function create_table(){
	console.log("made a table");
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
function create_floor(path){
	// Floor made of grass
				loader = new THREE.TextureLoader();
				var floor_material = Physijs.createMaterial(
						new THREE.MeshLambertMaterial({ map: loader.load( path )}),
						.9, // high friction
						.2 // low restitution
				);
				var floor = new Physijs.BoxMesh(
					new THREE.CubeGeometry( 5, .1, 5 ),
					floor_material,
					0
				);
				scene.add( floor );
}