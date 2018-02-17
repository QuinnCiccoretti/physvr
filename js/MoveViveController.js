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
		ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;
		
		var camera_rotation = camera.rotation.y;	//might have to change to user rotation
		var thumbpad_rotation = (Math.PI / 2) - Math.atan2(y,x);
		//update user position based on look direction
		user.position.x += Math.cos(camera_rotation + thumbpad_rotation);
		user.position.z += Math.sin(camera_rotation + thumbpad_rotation);


		// user.position.x += x/10;
		// user.position.z += y/10;

	}

	

	

	this.addEventListener( 'axischanged', onAxisChanged );
	

};

THREE.MoveViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.MoveViveController.prototype.constructor = THREE.MoveViveController;
