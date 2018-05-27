/**
 * @author quinnciccoretti
 * @class LBowController
 * the hand that is the bow. Should be used with other hand as LBowController.
 */

THREE.LBowController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#703101", "LBow");
	//ui - appears on touchpad
	// var cyl  = new Physijs.CylinderMesh(
 //    new THREE.CylinderGeometry( .01, .01, 1, 32 ),
 //    new THREE.MeshBasicMaterial({ color: 0x703101 })
	// );
	// cyl.material.side = THREE.DoubleSide;
	// this.add(cyl);
	// this.add(bowmodel);
	//dont update physics so it doesn't mess with arrow.
	this.handle_update = function() {
		this.update(); //refreshes controller data
		//this.update_phys_objects();	//Temporary solution
	}
};

THREE.LBowController.prototype = Object.create( THREE.BasicController.prototype );
THREE.LBowController.prototype.constructor = THREE.LBowController;
