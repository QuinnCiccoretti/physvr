/**
 * @author quinnciccoretti
 */

THREE.RBowController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#703101" );
	//ui - appears on touchpad
	


	this.handle_update = function() {
		this.update(); //refreshes controller data
		this.update_phys_objects();
		if(this.getButtonState("trigger")){
			var gp = this.getGamepad();
			var d = this.get_absolute_position().distanceTo(controller1.get_absolute_position());
			if( gp.hapticActuators && gp.hapticActuators[ 0 ]){	//Check if it has haptics
			    gp.hapticActuators[ 0 ].pulse( d, 25 );
			}
		}
	}
	

	function onTriggerUp(){
		var cyl  = new Physijs.CylinderMesh(
	    new THREE.CylinderGeometry( .1, .1, 2, 32 ),
	    new THREE.MeshBasicMaterial({ color: 0x703101 })
		);
		cyl.material.side = THREE.DoubleSide;
		var d = this.get_absolute_position().distanceTo(controller1.get_absolute_position());
		cyl.position = new THREE.Vector3(this.get_absolute_position());
		scene.add(cyl);
		// cyl.setLinearVelocity(d);
	}

	
	
	// this.addEventListener( 'triggerdown', onTriggerDown );
	this.addEventListener( 'triggerup', onTriggerUp );
};

THREE.RBowController.prototype = Object.create( THREE.BasicController.prototype );
THREE.RBowController.prototype.constructor = THREE.RBowController;
