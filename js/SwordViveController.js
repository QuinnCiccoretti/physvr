/**
 * @author mrdoob / http://mrdoob.com
 */

THREE.SwordViveController = function ( id ) {

	THREE.ViveController.call( this, id );

	var PI2 = Math.PI * 2;

	var MODES = { COLOR: 0, SIZE: 1 };
	var mode = MODES.COLOR;

	var color = new THREE.Color( 1, 1, 1 );
	var size = 1.0;

	//
	// COLOR UI

	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { map: generateHueTexture() } );
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


	// SIZE UI
	var sizeUI = new THREE.Group();
	sizeUI.position.set( 0, 0.005, 0.0495 );
	sizeUI.rotation.x = - 1.45;
	sizeUI.scale.setScalar( 0.02 );
	this.add( sizeUI );

	var triangleShape = new THREE.Shape();
	triangleShape.moveTo( 0, -1 );
	triangleShape.lineTo( 1, 1 );
	triangleShape.lineTo( -1, 1 );

	var geometry = new THREE.ShapeGeometry( triangleShape );
	var material = new THREE.MeshBasicMaterial( { color: 0x222222, wireframe:true } );
	var sizeUIOutline = new THREE.Mesh( geometry, material ) ;
	sizeUIOutline.position.z = 0.001;
	resizeTriangleGeometry(sizeUIOutline.geometry, 1.0);
	sizeUI.add( sizeUIOutline );

	var geometry = new THREE.ShapeGeometry( triangleShape );
	var material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide } );
	material.color = color;
	var sizeUIFill = new THREE.Mesh( geometry, material ) ;
	sizeUIFill.position.z = 0.0011;
	resizeTriangleGeometry(sizeUIFill.geometry, 0.5);
	sizeUI.add( sizeUIFill );

	sizeUI.visible = false;



	function onAxisChanged( event ) {

		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;

		if ( mode === MODES.COLOR ) {
			color.setHSL( Math.atan2( y, x ) / PI2, 1, ( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );

			ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		}

		if ( mode === MODES.SIZE ) {
			var ratio = (0.5 - y);
			size = ratio * 2;

			resizeTriangleGeometry(sizeUIFill.geometry, ratio);
		}

	}

	function resizeTriangleGeometry(geometry, ratio) {

		var x = 0, y = 0;
		var fullWidth = 0.75, fullHeight = 1.5;
		var angle = Math.atan( ( fullWidth / 2 ) / fullHeight );

		var bottomY = y - fullHeight / 2;
		var height = fullHeight * ratio;
		var width = ( Math.tan( angle ) * height ) * 2;

		geometry.vertices[ 0 ].set( x, bottomY, 0 );
		geometry.vertices[ 1 ].set( x + width / 2, bottomY + height, 0 );
		geometry.vertices[ 2 ].set( x - width / 2, bottomY + height, 0 );

		geometry.verticesNeedUpdate = true;

	}

	function onGripsDown( event ) {

		if ( mode === MODES.COLOR ) {
			mode = MODES.SIZE;
			colorUI.visible = false;
			sizeUI.visible = true;
			return;
		}

		if ( mode === MODES.SIZE ) {
			mode = MODES.COLOR;
			colorUI.visible = true;
			sizeUI.visible = false;
			return;
		}

	}

	this.getColor = function () { return color; };
	this.getSize = function () { return size; };

	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown );

};

THREE.SwordViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.SwordViveController.prototype.constructor = THREE.SwordViveController;
