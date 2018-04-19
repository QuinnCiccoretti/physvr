/**
 * @author quinnciccoretti
 */

THREE.RBowController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#703101" );
	//ui - appears on touchpad
	var arrow;


	this.handle_update = function() {
		this.update(); //refreshes controller data
		// this.update_phys_objects();
		if(this.getButtonState("trigger")){	//while trigger held
			if(typeof arrow !== "undefined"){
				var mypos = this.get_absolute_position();
				arrow.position.set(mypos.x,mypos.y,mypos.z);
				arrow.__dirtyPosition = true;
				arrow.rotation.applyQuaternion(calculate_quat(mypos, controller1.get_absolute_position() ))

				var gp = this.getGamepad();
				var d = this.get_absolute_position().distanceTo(controller1.get_absolute_position());
				this.pulse(d,25);
			}
			
		}
	}
	

	function onTriggerUp(){

		
		
		var diff = this.get_absolute_position().sub(controller1.get_absolute_position());
		


		cyl.setLinearVelocity(diff.multiplyScalar(-10));
	}
	function onTriggerDown(){
		var cyl  = new Physijs.CylinderMesh(
	    new THREE.CylinderGeometry( .01, .01, .5, 32 ),
	    new THREE.MeshBasicMaterial({ color: 0x703101 })
		);
		cyl.material.side = THREE.DoubleSide;

		arrow = cyl;
		var mypos = this.get_absolute_position();
		arrow.position.set(mypos.x,mypos.y,mypos.z);
		arrow.__dirtyPosition = true;
		scene.add(arrow);
	}

	function calculate_quat(a,b){
		// theta = arccos ( (a.b) / a.length *b.length )
		var theta = Math.acos( a.dot(b) / (a.length()*b.length()));
		var c = a.cross(b);

		var quaternion = new THREE.Quaternion();
		quaternion.setFromAxisAngle( c, theta );
		return quaternion;
	}
	
	
	this.addEventListener( 'triggerdown', onTriggerDown );
	this.addEventListener( 'triggerup', onTriggerUp );
};

THREE.RBowController.prototype = Object.create( THREE.BasicController.prototype );
THREE.RBowController.prototype.constructor = THREE.RBowController;
