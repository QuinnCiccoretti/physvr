/**
 * @author quinnciccoretti
 */

THREE.LBowController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#703101" );
	//ui - appears on touchpad
	var cyl  = new Physijs.CylinderMesh(
    new THREE.CylinderGeometry( .1, .1, 2, 32 ),
    new THREE.MeshBasicMaterial({ color: 0x703101 })
	);
	cyl.material.side = THREE.DoubleSide;
	this.add(cyl);
};

THREE.LBowController.prototype = Object.create( THREE.BasicController.prototype );
THREE.LBowController.prototype.constructor = THREE.LBowController;
