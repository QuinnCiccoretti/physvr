/**
 * @author quinnciccoretti
 * @class LBowController
 * the hand that is the bow. Should be used with other hand as LBowController.
 */

class LBowController extends BasicController {
	constructor(id){
		super( id, "#703101", "LBow");
		//this bow is represented by a cylinder 
		//easier than importing a bow model lol
		var cyl  = new Physijs.CylinderMesh(
	    new THREE.CylinderGeometry( .01, .01, 1, 32 ),
	    new THREE.MeshBasicMaterial({ color: 0x703101 })
		);
		cyl.material.side = THREE.DoubleSide;
		this.add(cyl);
	}

	//dont update physics so it doesn't mess with arrow.
	handle_update (){
		this.update(); //refreshes controller data
		//this.update_phys_objects();	//Temporary solution
	}
}