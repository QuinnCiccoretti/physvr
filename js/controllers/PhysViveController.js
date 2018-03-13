/**
 * @author quinnciccoretti
 */


THREE.PhysViveController = function ( id ) {

	THREE.ViveController.call( this, id );
	var color = new THREE.Color( 1, 1, 1 );
	var size = 1.0;

	// COLOR UI

	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color:"#000000" } );
	var moveUI = new THREE.Mesh( geometry, material );
	moveUI.position.set( 0, 0.005, 0.0495 );
	moveUI.rotation.x = - 1.45;
	moveUI.scale.setScalar( 0.02 );
	this.add( moveUI );

	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	material.color = color;
	var ball = new THREE.Mesh( geometry, material );	//this shows where the user's thumb is on the trackpad
	moveUI.add( ball );

	handleController = function( controller ) {
		controller.update();
	}

	function onAxisChanged( event ) {
	
	}
	this.addEventListener( 'axischanged', onAxisChanged );
};

THREE.PhysViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.PhysViveController.prototype.constructor = THREE.PhysViveController;
