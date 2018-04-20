/**
 * @author quinnciccoretti
 */
var arrow;

THREE.RBowController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#703101" );
	//ui - appears on touchpad
	

	this.handle_update = function() {
		this.update(); //refreshes controller data
		// this.update_phys_objects();
		if(this.getButtonState("trigger")){	//while trigger held
			if(typeof arrow !== "undefined"){
				var handpos = this.get_absolute_position();
				var bowpos = controller1.get_absolute_position()
				arrow.position.set(handpos.x,handpos.y,handpos.z);
				arrow.__dirtyPosition = true;
				 // Change the object's rotation
    mesh.rotation.set(0, 90, 180);
    mesh.__dirtyRotation = true;
    
    // You may also want to cancel the object's velocity
    mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));

				var gp = this.getGamepad();
				var d = this.get_absolute_position().distanceTo(controller1.get_absolute_position());
				this.pulse(d/5,1);
			}
			
		}
	}
	

	function onTriggerUp(){
		var diff = this.get_absolute_position().sub(controller1.get_absolute_position());
		arrow.setLinearVelocity(diff.multiplyScalar(-30));
	}
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

	function calculate_quat(a,b){
		// theta = arccos ( (a.b) / a.length *b.length )
		a.normalize();
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
