
function load_controller_models(){
	var loader = new THREE.OBJLoader();
	// var onProgress = function ( xhr ) {
	// 	if ( xhr.lengthComputable ) {
	// 		var percentComplete = xhr.loaded / xhr.total * 100;
	// 		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	// 	}
	// };

	// var onError = function ( xhr ) { console.log("oh no, mtl loading failed");};
	// var mtlLoader = new THREE.MTLLoader();
	// mtlLoader.setPath( 'models/' );
	// mtlLoader.load( 'yodas_lightsaber.mtl', function( materials ) {
	// 	materials.preload();
	// 	var objLoader = new THREE.OBJLoader();
	// 	objLoader.setMaterials( materials );
	// 	objLoader.setPath( 'models/' );
	// 	objLoader.load( 'yodas_lightsaber.obj', function ( object ) {
	// 		var controller = object.children[ 0 ];
	// 		controller.castShadow = true;
	// 		controller.receiveShadow = true;
			
	// 		var pivot = new THREE.Mesh( new THREE.IcosahedronGeometry( 0.01, 2 ) );
	// 		pivot.name = 'pivot';
	// 		pivot.position.y = -0.016;
	// 		pivot.position.z = -0.043;
	// 		pivot.rotation.x = Math.PI / 5.5;
	// 		controller.add( pivot );

	// 		controller1.add( controller.clone() );

	// 		pivot.material = pivot.material.clone();
	// 		controller2.add( controller.clone() );
	// 		}, onProgress, onError );
	// });
	
	loader.setPath( 'models/' );
	loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {

		var loader = new THREE.TextureLoader();
		loader.setPath( 'models/' );

		var controller = object.children[ 0 ];
		controller.material.map = loader.load( 'onepointfive_texture.png' );
		controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
		controller.castShadow = true;
		controller.receiveShadow = true;

		// var pivot = new THREE.Group();
		// var pivot = new THREE.Mesh( new THREE.BoxGeometry( 0.01, 0.01, 0.01 ) );
		var pivot = new THREE.Mesh( new THREE.IcosahedronGeometry( 0.01, 2 ) );
		pivot.name = 'pivot';
		pivot.position.y = -0.016;
		pivot.position.z = -0.043;
		pivot.rotation.x = Math.PI / 5.5;
		controller.add( pivot );

		controller1.add( controller.clone() );

		pivot.material = pivot.material.clone();
		controller2.add( controller.clone() );

	} );
}