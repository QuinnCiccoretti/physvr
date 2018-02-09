function init_scene(){
	scene = new Physijs.Scene();
	// scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
	scene.addEventListener(
		'update',
		function() {
			scene.simulate( undefined, 2 );
		}
	);
	scene.background = new THREE.Color( 0x222222 );
}
function init_user(){
	user = new THREE.Group();
	user.position.set( 0, 1.6, 0 );
	scene.add( user );
}
function init_camera(){
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 50 );
	user.add( camera );
}
function init_objects() {
	create_table(0.35,0.85);
	create_textured_floor('img/grass.jpg');
	create_boxes();
	create_lights();
}
//little side table in the scene always on ground
function create_table(y,z){
	var geometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
	var material = new THREE.MeshStandardMaterial( {
		color: 0x444444,
		roughness: 1.0,
		metalness: 0.0
	} );
	var table = new THREE.Mesh( geometry, material );
	table.position.z = z;
	table.position.y = y;

	table.castShadow = true;
	table.receiveShadow = true;
	scene.add( table );
}
function create_textured_floor(texturepath){
	// Floor made of grass
	loader = new THREE.TextureLoader();
	var floor_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: loader.load( texturepath )}),
			.9, // high friction
			.2 // low restitution
	);
	var floor = new Physijs.BoxMesh(
		new THREE.CubeGeometry( 5, .1, 5 ),
		floor_material
	);
	scene.add( new THREE.GridHelper( 20, 40, 0x111111, 0x111111 ) );
	scene.add( floor );
}
function create_boxes(){
	var box_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'img/brick.jpg' ) }),
		.4, // low friction
		.6 // high restitution
	);
	box_material.map.wrapS = THREE.RepeatWrapping;
	box_material.map.repeat.set( .25, .25 );
	for ( var i = 0; i < 10; i++ ) {
		var box = new Physijs.BoxMesh(
			new THREE.BoxGeometry( 4, 4, 4 ),
			box_material
		);
		box.position.set(
			Math.random() * 50 - 25,
			10 + Math.random() * 5,
			Math.random() * 50 - 25
		);
		box.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2
		);
		box.castShadow = true;
		scene.add( box );
		
	}
}
function create_lights() {
	scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );
	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 6, 0 );
	light.castShadow = true;
	light.shadow.camera.top = 2;
	light.shadow.camera.bottom = -2;
	light.shadow.camera.right = 2;
	light.shadow.camera.left = -2;
	light.shadow.mapSize.set( 4096, 4096 );
	scene.add( light );
}
function init_renderer(){
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	renderer.vr.enabled = true;	//VR REQUIRED
	container.appendChild( renderer.domElement );
	document.body.appendChild( WEBVR.createButton( renderer ) ); //VR REQUIRED
}