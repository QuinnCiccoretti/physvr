/**
 * @author quinnciccoretti
 */

THREE.BatController = function ( id ) {
	
	THREE.BasicController.call( this, id );
	//bat cylinder
	var cyl  = new Physijs.CylinderMesh(
    new THREE.CylinderGeometry( 5, 5, 20, 32 );,
    new THREE.MeshBasicMaterial({ color: 0x888888 })
	);
	this.add(cyl);
	cyl.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
		other_object.setLinearVelocity(this.get_velocity().multiplyScalar(10));
	});
};

THREE.BatController.prototype = Object.create( THREE.BasicController.prototype );
THREE.BatController.prototype.constructor = THREE.BatController;
