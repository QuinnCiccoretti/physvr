/**
 * WORK IN PROGRESS
 * WORK IN PROGRESS
 * WORK IN PROGRESS
 * WORK IN PROGRESS
 * @author quinnciccoretti
 */

THREE.BatController = function ( id ) {
	
	THREE.BasicController.call( this, id );
	//bat cylinder
	var cyl  = new Physijs.CylinderMesh(
    new THREE.CylinderGeometry( .1, .1, 2, 32 ),
    new THREE.MeshBasicMaterial({ color: 0x888888 })
	);
	cyl.material.side = THREE.DoubleSide;
	cyl.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
		other_object.setLinearVelocity(this.get_velocity().multiplyScalar(10));
		console.log("collided!!!")
	});
	this.handle_update = function() {
		this.update();
		this.update_phys_objects();
		var pos = this.get_absolute_position();
		cyl.position.set(pos.x, pos.y, pos.z);
		cyl.__dirtyPosition = true;
		
	}
	this.addEventListener()

};

THREE.BatController.prototype = Object.create( THREE.BasicController.prototype );
THREE.BatController.prototype.constructor = THREE.BatController;
