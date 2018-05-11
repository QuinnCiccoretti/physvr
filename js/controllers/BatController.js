/**
 * WORK IN PROGRESS
 * @author quinnciccoretti
 * @class BatController
 */

THREE.BatController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#888888", "Bat");
	//bat cylinder
	var cyl  = new Physijs.CylinderMesh(
    new THREE.CylinderGeometry( .01, .01, 1, 32 ),
    new THREE.MeshBasicMaterial({ color: 0x703101 })
	);
	cyl.material.side = THREE.DoubleSide;
	scene.add(cyl);
	// cyl.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	//     // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
	// 	other_object.setLinearVelocity(relative_velocity.multiplyScalar(10));
	// 	console.log("collided!!!")
	// });
	this.handle_update = function() {
		this.update();
		// this.update_phys_objects();
		var pos = this.get_absolute_position();
		cyl.position.set(pos.x, pos.y, pos.z);
		cyl.__dirtyPosition = true;
		cyl.setLinearVelocity(0,0,0);
		cyl.setAngularVelocity(0,0,0);
		
	}
	

};

THREE.BatController.prototype = Object.create( THREE.BasicController.prototype );
THREE.BatController.prototype.constructor = THREE.BatController;
