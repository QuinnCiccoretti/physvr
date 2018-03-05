/**
 * @author quinnciccoretti
 */
THREE.BasicViveController = function ( id ) {

	THREE.ViveController.call( this, id );
	//UI appears on the touchpad
	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color:"#ff00ff" } );
	var ui = new THREE.Mesh( geometry, material );
	ui.position.set( 0, 0.005, 0.0495 );
	ui.rotation.x = - 1.45;
	ui.scale.setScalar( 0.02 );
	this.add( ui );
	

	handleController = function( controller ) {
		controller.update();
	}
};

THREE.BasicViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.BasicViveController.prototype.constructor = THREE.BasicViveController;
