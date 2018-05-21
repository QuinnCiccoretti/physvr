var arrow;
/**
 * @author quinnciccoretti
 * @class RBowController
 * the hand that pulls the bowstring. Should be used with other hand as LBowController
 */
THREE.RBowController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#703101", "RBow");
	
	/**for vibrating with distance*/
	var last_threshold = .1;	
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
				var handpos = this.position;
				var bowpos = controller1.position;
				// var midpoint = handpos.clone().add(bowpos).divideScalar(2);
				//position arrow
				var diff = bowpos.clone().sub(handpos);
				diff.normalize();
				var arrowHelper = THREE.arrowHelper(diff, new THREE.Vector3());
				arrow.position.set(handpos.x, handpos.y, handpos.z);
				arrow.__dirtyPosition = true; //needed for the physics scene to update pos
				 
				 //quaternion that will align objects between the two controllers
				var rot_between = arrowHelper.rotation;
			    // console.log(rot_between);
			    arrow.rotation.set(rot_between.x, rot_between.y, rot_between.z);
			    // console.log("a");
			    // console.log(arrow.rotation);
			    arrow.__dirtyRotation = true;	//needed for the physics scene to update rot
			    
			    //Cancel any movement of the arrow
			    arrow.setLinearVelocity(new THREE.Vector3(0, 0, 0));
			    arrow.setAngularVelocity(new THREE.Vector3(0, 0, 0));

			    //vibrate proportional to distance to simulate pulling bowstring
				var d = handpos.distanceTo(bowpos);
				if(d>last_threshold){//vibrates if the controller has moved a certain distance (0.025 meters)
					this.pulse(d,1);
					last_threshold+=.025;
				}
				
			}
			
		}
	}
	
	/**
	 * launches arrow proportional to draw distance
	 */
	function onTriggerUp(){
		last_threshold = .1;	//reset threshold for vibrating with distance
		var my_pos = this.get_absolute_position();
		var diff = my_pos.sub(controller1.get_absolute_position());
		user.remove(arrow);

		arrow.position.set(my_pos.x, my_pos.y, my_pos.z);
		arrow.__dirtyPosition = true; //needed for the physics scene to update pos
		scene.add(arrow);
		arrow.setLinearVelocity(diff.multiplyScalar(-20));
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
		user.add(arrow);
	}
	/**
	 * WORK IN PROGRESS -> TODO: Use local coords and add to user, then remove from scene
	 * calculates a euler that will rotate the arrow parralell to
	 * the line between both controllers.
	 */
	function calculate_euler(a,b){
		var diff = a.sub(b);
		var spher = new THREE.Spherical().setFromVector3(diff);
		spher.makeSafe();
		var rot = new THREE.Euler( spher.phi, 0, -1*spher.theta);
		
		return rot;
	}
	
	
	this.addEventListener( 'triggerdown', onTriggerDown );
	this.addEventListener( 'triggerup', onTriggerUp );
};

THREE.RBowController.prototype = Object.create( THREE.BasicController.prototype );
THREE.RBowController.prototype.constructor = THREE.RBowController;
