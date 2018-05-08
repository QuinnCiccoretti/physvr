/**
 * @author mrdoob / http://mrdoob.com
 */
function initGeometry() {

				var geometry = new THREE.BufferGeometry();

				var positions = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
				positions.dynamic = true;
				geometry.addAttribute( 'position', positions );

				var normals = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
				normals.dynamic = true;
				geometry.addAttribute( 'normal', normals );

				var colors = new THREE.BufferAttribute( new Float32Array( 1000000 * 3 ), 3 );
				colors.dynamic = true;
				geometry.addAttribute( 'color', colors );

				geometry.drawRange.count = 0;

				var material = new THREE.MeshStandardMaterial( {
					roughness: 0.9,
					metalness: 0.0,
					// envMap: reflectionCube,
					vertexColors: THREE.VertexColors,
					side: THREE.DoubleSide
				} );

				line = new THREE.Mesh( geometry, material );
				line.frustumCulled = false;
				line.castShadow = true;
				line.receiveShadow = true;
				scene.add( line );

				// Shapes
				shapes[ 'tube' ] = getTubeShapes(1.0);
			}

function getTubeShapes(size) {

	var PI2 = Math.PI * 2;

	var sides = 10;
	var array = [];
	var radius = 0.01 * size;
	for( var i = 0; i < sides; i ++ ){

		var angle = ( i / sides ) * PI2;
		array.push( new THREE.Vector3( Math.sin( angle ) * radius, Math.cos( angle ) * radius, 0 ) );
	}

	return array;
}


function stroke( controller, point1, point2, matrix1, matrix2 ) {

	var color = controller.getColor();

	var shapes = getTubeShapes( controller.getSize() );

	var geometry = line.geometry;
	var attributes = geometry.attributes;
	var count = geometry.drawRange.count;

	var positions = attributes.position.array;
	var normals = attributes.normal.array;
	var colors = attributes.color.array;

	for ( var j = 0, jl = shapes.length; j < jl; j ++ ) {

		var vertex1 = shapes[ j ];
		var vertex2 = shapes[ ( j + 1 ) % jl ];

		// positions

		vector1.copy( vertex1 ); vector1.applyMatrix4( matrix2 ); vector1.add( point2 );
		vector2.copy( vertex2 ); vector2.applyMatrix4( matrix2 ); vector2.add( point2 );
		vector3.copy( vertex2 ); vector3.applyMatrix4( matrix1 ); vector3.add( point1 );
		vector4.copy( vertex1 ); vector4.applyMatrix4( matrix1 ); vector4.add( point1 );

		vector1.toArray( positions, ( count + 0 ) * 3 );
		vector2.toArray( positions, ( count + 1 ) * 3 );
		vector4.toArray( positions, ( count + 2 ) * 3 );

		vector2.toArray( positions, ( count + 3 ) * 3 );
		vector3.toArray( positions, ( count + 4 ) * 3 );
		vector4.toArray( positions, ( count + 5 ) * 3 );

		// normals

		vector1.copy( vertex1 ); vector1.applyMatrix4( matrix2 ); vector1.normalize();
		vector2.copy( vertex2 ); vector2.applyMatrix4( matrix2 ); vector2.normalize();
		vector3.copy( vertex2 ); vector3.applyMatrix4( matrix1 ); vector3.normalize();
		vector4.copy( vertex1 ); vector4.applyMatrix4( matrix1 ); vector4.normalize();

		vector1.toArray( normals, ( count + 0 ) * 3 );
		vector2.toArray( normals, ( count + 1 ) * 3 );
		vector4.toArray( normals, ( count + 2 ) * 3 );

		vector2.toArray( normals, ( count + 3 ) * 3 );
		vector3.toArray( normals, ( count + 4 ) * 3 );
		vector4.toArray( normals, ( count + 5 ) * 3 );

		// colors

		color.toArray( colors, ( count + 0 ) * 3 );
		color.toArray( colors, ( count + 1 ) * 3 );
		color.toArray( colors, ( count + 2 ) * 3 );

		color.toArray( colors, ( count + 3 ) * 3 );
		color.toArray( colors, ( count + 4 ) * 3 );
		color.toArray( colors, ( count + 5 ) * 3 );

		count += 6;

	}

	geometry.drawRange.count = count;

}

function updateGeometry( start, end ) {

	if ( start === end ) return;

	var offset = start * 3;
	var count = ( end - start ) * 3;

	var geometry = line.geometry;
	var attributes = geometry.attributes;

	attributes.position.updateRange.offset = offset;
	attributes.position.updateRange.count = count;
	attributes.position.needsUpdate = true;

	attributes.normal.updateRange.offset = offset;
	attributes.normal.updateRange.count = count;
	attributes.normal.needsUpdate = true;

	attributes.color.updateRange.offset = offset;
	attributes.color.updateRange.count = count;
	attributes.color.needsUpdate = true;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//



/**
 * @author quinnciccoretti
 * @author mrdoob
 * @class PaintController
 * Draws in 3d
 */
THREE.PaintController = function ( id ) {

	THREE.BasicController.call( this, id, "#ffffff", "Paint");

	var PI2 = Math.PI * 2;

	var MODES = { COLOR: 0, SIZE: 1 };
	var mode = MODES.COLOR;

	var color = new THREE.Color( 1, 1, 1 );
	var size = 1 
	


	this.handle_update = function() {
		var count = line.geometry.drawRange.count;
				
		count = line.geometry.drawRange.count;
		this.update();
		this.update_phys_objects();
		// updateGeometry( count, line.geometry.drawRange.count );
		var pivot = this.getObjectByName( 'pivot' );

		if ( pivot ) {

			pivot.material.color.copy( this.getColor() );
			pivot.scale.setScalar(this.getSize());

			var matrix = pivot.matrixWorld;
			var point1 = this.userData.points[ 0 ];
			var point2 = this.userData.points[ 1 ];
			var matrix1 = this.userData.matrices[ 0 ];
			var matrix2 = this.userData.matrices[ 1 ];

			point1.setFromMatrixPosition( matrix );
			matrix1.lookAt( point2, point1, up );

			if ( this.getButtonState( 'trigger' ) ) {
				stroke( this, point1, point2, matrix1, matrix2 );
			}

			point2.copy( point1 );
			matrix2.copy( matrix1 );

		}
		updateGeometry( count, line.geometry.drawRange.count );

	}
	function generateHueTexture() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 256;
		canvas.height = 256;

		var context = canvas.getContext( '2d' );
		var imageData = context.getImageData( 0, 0, 256, 256 );
		var data = imageData.data;
		var swatchColor = new THREE.Color();

		for ( var i = 0, j = 0; i < data.length; i += 4, j ++ ) {

			var x = ( ( j % 256 ) / 256 ) - 0.5;
			var y = ( Math.floor( j / 256 ) / 256 ) - 0.5;

			swatchColor.setHSL( Math.atan2( y, x ) / PI2, 1,( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );

			data[ i + 0 ] = swatchColor.r * 256;
			data[ i + 1 ] = swatchColor.g * 256;
			data[ i + 2 ] = swatchColor.b * 256;
			data[ i + 3 ] = 256;

		}

		context.putImageData( imageData, 0, 0 );

		return new THREE.CanvasTexture( canvas );

	}
	//Little ball on the top of "paintbrush"

	var pivot = new THREE.Mesh( new THREE.IcosahedronGeometry( 0.01, 2 ) );
	pivot.name = 'pivot';
	pivot.position.y = -0.016;
	pivot.position.z = -0.043;
	pivot.rotation.x = Math.PI / 5.5;
	this.add( pivot );

	// COLOR UI - not using default
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
		ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;

		if ( mode === MODES.COLOR ) {
			color.setHSL( Math.atan2( y, x ) / PI2, 1, ( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );
			this.nameplate.material.color.setHSL( Math.atan2( y, x ) / PI2, 1, ( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );
			//or try
			// this.nameplate.material.color = color;
		}

		if ( mode === MODES.SIZE ) {
			var ratio = (0.5 - y);
			size = ratio * ratio * 10;

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

THREE.PaintController.prototype = Object.create( THREE.BasicController.prototype );
THREE.PaintController.prototype.constructor = THREE.PaintController;
