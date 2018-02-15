/**
 * @author mrdoob / http://mrdoob.com
 */


THREE.MoveViveController = function ( id ) {

	THREE.ViveController.call( this, id );

	var PI2 = Math.PI * 2;

	var MODES = { COLOR: 0, SIZE: 1 };
	var mode = MODES.COLOR;

	var color = new THREE.Color( 1, 1, 1 );
	var size = 1.0;

	// COLOR UI

	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color:"#009933" } );
	var colorUI = new THREE.Mesh( geometry, material );
	colorUI.position.set( 0, 0.005, 0.0495 );
	colorUI.rotation.x = - 1.45;
	colorUI.scale.setScalar( 0.02 );
	this.add( colorUI );

	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	material.color = color;
	var ball = new THREE.Mesh( geometry, material );
	colorUI.add( ball );

	handleController = function( controller ) {
		controller.update();
	}

	function onAxisChanged( event ) {

		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;

		console.log(x,y);

	}

	

	

	this.addEventListener( 'axischanged', onAxisChanged );
	

};

THREE.MoveViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.MoveViveController.prototype.constructor = THREE.MoveViveController;
