//might need to be called in main init
//IT DOES GET CALLED RIGHT BELOW INIT()
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

		vector1.copy( vertex1 );
		vector1.applyMatrix4( matrix2 );
		vector1.add( point2 );

		vector2.copy( vertex2 );
		vector2.applyMatrix4( matrix2 );
		vector2.add( point2 );

		vector3.copy( vertex2 );
		vector3.applyMatrix4( matrix1 );
		vector3.add( point1 );

		vector4.copy( vertex1 );
		vector4.applyMatrix4( matrix1 );
		vector4.add( point1 );

		vector1.toArray( positions, ( count + 0 ) * 3 );
		vector2.toArray( positions, ( count + 1 ) * 3 );
		vector4.toArray( positions, ( count + 2 ) * 3 );

		vector2.toArray( positions, ( count + 3 ) * 3 );
		vector3.toArray( positions, ( count + 4 ) * 3 );
		vector4.toArray( positions, ( count + 5 ) * 3 );

		// normals

		vector1.copy( vertex1 );
		vector1.applyMatrix4( matrix2 );
		vector1.normalize();

		vector2.copy( vertex2 );
		vector2.applyMatrix4( matrix2 );
		vector2.normalize();

		vector3.copy( vertex2 );
		vector3.applyMatrix4( matrix1 );
		vector3.normalize();

		vector4.copy( vertex1 );
		vector4.applyMatrix4( matrix1 );
		vector4.normalize();

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

function handleController( controller ) {

	controller.update();

	var pivot = controller.getObjectByName( 'pivot' );

	if ( pivot ) {

		pivot.material.color.copy( controller.getColor() );
		pivot.scale.setScalar(controller.getSize());

		var matrix = pivot.matrixWorld;

		var point1 = controller.userData.points[ 0 ];
		var point2 = controller.userData.points[ 1 ];

		var matrix1 = controller.userData.matrices[ 0 ];
		var matrix2 = controller.userData.matrices[ 1 ];

		point1.setFromMatrixPosition( matrix );
		matrix1.lookAt( point2, point1, up );

		if ( controller.getButtonState( 'trigger' ) ) {

			stroke( controller, point1, point2, matrix1, matrix2 );

		}

		point2.copy( point1 );
		matrix2.copy( matrix1 );

	}
}