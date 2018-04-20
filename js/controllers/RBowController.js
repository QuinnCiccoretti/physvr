/**
 * @author quinnciccoretti
 * @class RBowController
 * the hand that pulls the bowstring. Should be used with other hand as LBowController
 */

var arrow;

THREE.RBowController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#703101" );
	//////////////////////////////////////////
	//test using another controller with this one 
	///////////////////////////////////////////
	/**
	 * positions and points arrow between controllers.
	 */
	this.handle_update = function() {
		this.update(); //refreshes controller data
		// this.update_phys_objects(); //TODO -> cancel physics, as arrow collides with controller
		//canceling update is temporary solution
		//maybe try scene.remove(phys_objn)

		if(this.getButtonState("trigger")){	//while trigger held
			if(typeof arrow !== "undefined"){
				var handpos = this.get_absolute_position();
				var bowpos = controller1.get_absolute_position();
				var midpoint = handpos.clone().add(bowpos).divideScalar(2);
				//position arrow
				arrow.position = midpoint;
				arrow.__dirtyPosition = true; //needed for the physics scene to update pos
				 
				 //quaternion that will align objects between the two controllers
				var rot_between = calculate_quat(bowpos.clone(), handpos.clone());
			    arrow.rotation.setFromQuaternion(rot_between);
			    arrow.__dirtyRotation = true;	//needed for the physics scene to update rot
			    
			    //Cancel any movement of the arrow
			    arrow.setLinearVelocity(new THREE.Vector3(0, 0, 0));
			    arrow.setAngularVelocity(new THREE.Vector3(0, 0, 0));

			    //vibrate proportional to distance to simulate pulling bowstring
				var d = handpos.distanceTo(bowpos);
				this.pulse(d/5,1);
			}
			
		}
	}
	
	/**
	 * launches arrow proportional to draw distance
	 */
	function onTriggerUp(){
		var diff = this.get_absolute_position().sub(controller1.get_absolute_position());
		arrow.setLinearVelocity(diff.multiplyScalar(-30));
	}
	/**
	 * instantiates new arrow with physics
	 */
	function onTriggerDown(){
		arrow = new Physijs.CylinderMesh(
	    new THREE.CylinderGeometry( .01, .01, .5, 32 ),
	    new THREE.MeshBasicMaterial({ color: 0x703101 }),
	    .5	//mass
		);
		arrow.material.side = THREE.DoubleSide;

		var handpos = this.get_absolute_position();
		arrow.position.set(handpos.x,handpos.y,handpos.z);
		arrow.__dirtyPosition = true;
		scene.add(arrow);
	}
	/**
	 * calculates a quaternion that will rotate the arrow parralell to
	 * the line between both controllers.
	 */
	function calculate_quat(a,b){
		a.normalize(); //possibly unneeded
		b.normalize();
		var theta = Math.acos( a.dot(b) / (a.length()*b.length()));
		var c = a.cross(b);

		var quaternion = new THREE.Quaternion();
		quaternion.setFromAxisAngle( c, theta * 8);
		return quaternion;
	}
	
	
	this.addEventListener( 'triggerdown', onTriggerDown );
	this.addEventListener( 'triggerup', onTriggerUp );
};

THREE.RBowController.prototype = Object.create( THREE.BasicController.prototype );
THREE.RBowController.prototype.constructor = THREE.RBowController;
