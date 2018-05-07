function create_scene_objects(x = 0, y = 0, z = 0){
	y = y-.5;
	create_table(x, y, z);
	create_floor('img/ground.jpg', x, y, z);
	
	create_boxes(4, x, y, z);
	createTower(10, x, y, z);
}
/** A small table for really no reason**/
function create_table(){
	
	var table_geometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
	var table_material = new THREE.MeshBasicMaterial({ color: 0x888888 })
	//little side table in the scene
	var table = new Physijs.BoxMesh( table_geometry, table_material, 0);
	table.position.y = 0.35;
	table.position.z = 0.85;
	table.castShadow = true;
	table.receiveShadow = true;
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
				scene.add( floor );
				// scene.add( new THREE.GridHelper( 20, 40, 0x111111, 0x111111 ) );
}
/**  Adds n random boxes to the scene **/
function create_boxes(n, x, y, z){
	var box_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'img/brick.jpg' ) }),
		.4, // low friction
		.4 // high restitution
	);
	box_material.map.wrapS = THREE.RepeatWrapping;
	box_material.map.repeat.set( .25, .25 );
	for ( var i = 0; i < n; i++ ) {
		var box = new Physijs.BoxMesh(
			new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
			box_material,
			5
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
		box.setAngularFactor(1,1,1); //POSSIBLY UNNECCESSARY
		box.setLinearFactor(1,1,1);  //POSSIBLY UNNECCESSARY
		scene.add( box );
		
	}
}
/** Adds ambient and directional light that looks natural **/
function create_lights(x, y, z){
	scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( x, y, z );
	light.castShadow = true;
	light.shadow.camera.top = 2;
	light.shadow.camera.bottom = -2;
	light.shadow.camera.right = 2;
	light.shadow.camera.left = -2;
	light.shadow.mapSize.set( 4096, 4096 );
	scene.add( light );
}
function load_materials(){
	// Loader
	var loader = new THREE.TextureLoader();
	// Materials
	
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
			//block.receiveShadow = true;
			block.castShadow = true;
			// tower.add(block);
			scene.add( block );
			// blocks.push( block );
		}
	}
	// tower.position.set(x,y,z);
	// scene.add(tower);
};