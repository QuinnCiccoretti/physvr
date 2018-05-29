function load_basic_model(){
	var loader = new THREE.OBJLoader();
		loader.setPath( 'models/' );
		//this part is weird and asyncy. Functions inside will execute when loaded.
		loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {
		var loader = new THREE.TextureLoader();
			loader.setPath( 'models/' );
			var controller = object.children[ 0 ];
			controller.material.map = loader.load( 'onepointfive_texture.png' );
			controller.material.specularMap = loader.load( 'onepointfive_spec.png' );
			controller.castShadow = true;
			controller.receiveShadow = true;
			
			basic_controller_model1 = controller.clone();
			basic_controller_model2 = controller.clone();
			controller1.add(basic_controller_model1);
			controller2.add(basic_controller_model2);
			controller1.addEventListener( 'menudown', on_menu_up1 );
			controller2.addEventListener( 'menudown', on_menu_up2 );
		} );
		

}
function load_bowmodel(){
	var mtlLoader = new THREE.MTLLoader();
	// mtlLoader.setBaseUrl( 'models/' );
	mtlLoader.setTexturePath( 'models/' )
	mtlLoader.setPath( 'models/' );
	var url = "Bow.mtl";
	mtlLoader.load( url, function( materials ) {

	    materials.preload();

	    var objLoader = new THREE.OBJLoader();
	    objLoader.setMaterials( materials );
	    objLoader.setPath( 'models/' );
	    objLoader.load( 'Bow.obj', function ( object ) {

	        console.log("loaded bow model");
	        bowmodel = object.children[0];
	        // bowmodel.position.z = ;
	        // controller1.add(bowmodel);
	        // user.lookAt(10,0,0);
	    });

	});
}

function create_scene_objects(x = 100, y = 10, z = 110){
	y = y-.5;
	create_table(x, y, z);
	create_floor('img/ground.jpg', x, y, z);
	
	create_boxes(4, x, y, z);
	createTower(10, x, y, z);
	create_dir_light(x+2, y+6, z)
}
/** A small table for really no reason**/
function create_table(x,y,z){
	
	var table_geometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
	var table_material = new THREE.MeshBasicMaterial({ color: 0x888888 })
	//little side table in the scene
	var table = new Physijs.BoxMesh( table_geometry, table_material, 0);
	table.position.set(x,y,z);
	table.position.y += 0.35;
	table.position.z += 0.85;
	// table.castShadow = true;
	// table.receiveShadow = true;
	scene.add( table );
}
/** A textured floor about the size of the vive play area and a grid that extends beyond. **/
function create_floor(texture_path, x, y, z){
	// Floor made of grass
				loader = new THREE.TextureLoader();
				var floor_material = Physijs.createMaterial(
						new THREE.MeshLambertMaterial({ map: loader.load( texture_path )}),
						.9, // high friction
						.2 // low restitution
				);
				var floor = new Physijs.BoxMesh(
					new THREE.CubeGeometry( 10, .1, 10 ),
					floor_material,
					0
				);
				floor.position.set(x, y, z);
				floor.receiveShadow = true;
				scene.add( floor );
				// scene.add( new THREE.GridHelper( 20, 40, 0x111111, 0x111111 ) );
}
var box_material;
/**  Adds n random bricks to the scene **/
function create_boxes(n, x, y, z){
	
	// box_material.map.wrapS = THREE.RepeatWrapping;
	// box_material.map.repeat.set( .25, .25 );
	for ( var i = 0; i < n; i++ ) {
		var box = new Physijs.BoxMesh(
			new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
			box_material,
			1
		);
		box.position.set(
			(Math.random() * 5)+x,
			(Math.random() * 5)+y,
			(Math.random() * 5)+z
		);
		box.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2
		);
		box.castShadow = true;
		// box.setAngularFactor(1,1,1); //POSSIBLY UNNECCESSARY
		// box.setLinearFactor(1,1,1);  //POSSIBLY UNNECCESSARY
		scene.add( box );
		
	}
}


function create_dir_light(x,y,z){
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( x+4, y, z );
	light.castShadow = true;
	var shadow_range = 8
	light.shadow.camera.top = shadow_range;
	light.shadow.camera.bottom = -shadow_range;
	light.shadow.camera.right = shadow_range;
	light.shadow.camera.left = -shadow_range;
	light.shadow.mapSize.set( 4096, 4096 );
	scene.add( light );
}
function load_materials(){
	// Loader
	var loader = new THREE.TextureLoader();
	//gets the model for the vive controller. This needs to be done beforehand as it is slow and asyncy
	load_basic_model();
	//load bow
	load_bowmodel();
	// Materials
	box_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'img/brick.jpg' ) }),
		.4, // low friction
		.4 // high restitution
	);
	block_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'img/wood.jpg' )}),
		0.1, // low friction
		.4 // medium restitution
	);
}
/** creates a jenga stack of height n **/
createTower = function(nrows, x=0, y=0, z=0) {
	var worldscale = 1/5;
	var block_length = 6*worldscale, block_height = 1*worldscale, block_width = 1.5*worldscale, block_offset = 2*worldscale,
	block_geometry = new THREE.BoxGeometry( block_length, block_height, block_width );
	var i, j,block;
	// var tower = new THREE.Objec();
	
	for ( i = 0; i < nrows; i++ ) {
		for ( j = 0; j < 3; j++ ) {
			block = new Physijs.BoxMesh( block_geometry, block_material );
			block.position.y = (block_height / 2) + block_height * i;
			block.position.y += y;
			if ( i % 2 === 0 ) {
				block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
				block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
				block.position.x += x;
			} 
			else {
				block.position.z = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
				block.position.z += z;
			}
			block.receiveShadow = true;
			block.castShadow = true;
			// tower.add(block);
			scene.add( block );
			// blocks.push( block );
		}
	}
	// tower.position.set(x,y,z);
	// scene.add(tower);
};