'use strict';
// initialize all global vars
Physijs.scripts.worker = '/js/phys/physijs_worker.js';
Physijs.scripts.ammo = '/js/phys/ammo.js';

var container;

var camera, scene, renderer;
var user;
var basic_controller_model1, basic_controller_model2, basic_controller_models = [];
var controller1, controller2;
var handleController;
var controller_offset_z = -0.07;
var controller_offset_y = 0.03;
var ms = new MyScene();
// var brick_material;

//for dragcontroller
var intersected = [];
var raycaster = new THREE.Raycaster();
var tempMatrix = new THREE.Matrix4();
//for paintcontroller
var count;

var block_material, block_geometry;
var phys_obj1, phys_obj2;
var phys_obj_list = [];

var load_model;
var line;
var shapes = {};
var createTower;

var up = new THREE.Vector3( 0, 1, 0 );
var vector = new THREE.Vector3();
var vector1 = new THREE.Vector3();
var vector2 = new THREE.Vector3();
var vector3 = new THREE.Vector3();
var vector4 = new THREE.Vector3();
var point4 = new THREE.Vector3();
var point5 = new THREE.Vector3();


document.onload = init();
var render_stats;
/**
* Create stats element
*/
function init_stats(){
	render_stats = new Stats();
	render_stats.domElement.style.position = 'absolute';
	render_stats.domElement.style.top = '1px';
	render_stats.domElement.style.zIndex = 100;
	container.appendChild( render_stats.domElement );
}

/**
* Main initialization
*/

function init() {
	console.log("init....");
	init_font_loader();		
	load_materials();
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	init_stats();

	scene = new Physijs.Scene;
	scene.background = new THREE.Color( 0x162354 );
	// scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
	scene.setGravity(new THREE.Vector3( 0, -10, 0 ));
	

	user = new THREE.Group();
	user.position.set( 3, 1.6, 0 );	//a little to the side of the origin
	scene.add( user );
	
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 50 );
	// ms.setCam(camera);
	user.add( camera );

	//add floor, grid, table, etc.
	create_scene_objects(0,1.0,0);
	scene.add( new THREE.HemisphereLight( 0x888877, 0x777788, .4) );
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	renderer.vr.enabled = true;	//VR REQUIRED
	container.appendChild( renderer.domElement );

	document.body.appendChild( WEBVR.createButton( renderer ) ); //VR REQUIRED

	
	//Set up basic controllers while a list of other controllers loads
	controller1 = new THREE.BasicController( 0 );
	controller1.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
	controller1.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
	controller1.position.set(0,10,0); //start controller high and away to avoid collisions
	user.add( controller1 );

	controller2 = new THREE.BasicController( 1 );
	controller2.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
	controller2.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
	controller2.position.set(0,10,0);
	user.add( controller2 ); //start controller high and away to avoid collisions

	//gets the model for the vive controller. This needs to be done beforehand as it is slow and asyncy
	load_basic_model();
	//toggle the controller mode
	controller1.addEventListener( 'menudown', on_menu_up1 );
	controller2.addEventListener( 'menudown', on_menu_up2 );
	initGeometry();
	createTower(10);
	/**
	* If you want the controllers to be able to push things, you need to make an
	* invisible box that follows them around. You can't use .add becuase the 
	* physics engine wants its own coords. So you just update the position
	* of two boxes so they follow the controls, and make them invisible
	*/
	var physGeom = new THREE.CubeGeometry(0.12, 0.1, 0.22); 
	var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.5, 0.5);
	physMaterial.visible = false;	//Make them invisible

	phys_obj1 = new Physijs.BoxMesh(physGeom, physMaterial, 100);
	phys_obj2 = new Physijs.BoxMesh(physGeom, physMaterial, 100);
	phys_obj1.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
		controller1.pulse(.25, 25);
		//by setting object.userData.ctrlr_nocollide to true, you can make it not collide with the controller
		if(typeof other_object.userData.ctrlr_nocollide !== "undefined"){
			other_object.setLinearVelocity(0,0,0);
		}
		
	});
	phys_obj1.material.wireframe = true;
	phys_obj2.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
		controller2.pulse(.25, 25);
		//by setting object.userData.ctrlr_nocollide to true, you can make it not collide with the controller
		if(typeof other_object.userData.ctrlr_nocollide !== "undefined"){
			other_object.setLinearVelocity(0,0,0);
		}
	});
	scene.add(phys_obj1);
	scene.add(phys_obj2);
	//helps updated phys objs in basiccontroller
	phys_obj_list = [phys_obj1,phys_obj2];

	// Start simulation
	requestAnimationFrame( render );
	scene.simulate();
}	

var ctrlr1list = [
    new THREE.PaintController( 0 ), 
    new THREE.MoveController( 0 ), 
    new THREE.DragController( 0 ), 
    new THREE.SlingshotController( 0 ),
    new THREE.LBowController(0),
    new THREE.CreateController(0), 
    new THREE.RefreshController(0),
    new THREE.GravityController( 0 )
    // new THREE.BatController(0)

 ];

var current_controller1 = 0;
/**
* Toggles 1st ctrlr through various controller objects
*/
function on_menu_up1(){
	
	//The below line is essential. It is located in BasicController
	// and may be overriden
	controller1.on_deactivate();
	
	current_controller1++;
	if(current_controller1 == ctrlr1list.length){
		current_controller1 = 0;
	}
	controller1 = ctrlr1list[current_controller1];
	
	//The below line is essential. It is located in BasicController
	// and may be overriden
	controller1.on_activate();
	controller1.addEventListener( 'menuup', on_menu_up1 );
}

var current_controller2 = 0;
var ctrlr2list = [
    new THREE.PaintController( 1 ), 
	new THREE.MoveController( 1 ), 
	new THREE.DragController( 1 ), 
	new THREE.SlingshotController( 1 ),
	new THREE.RefreshController(1), 
	new THREE.RBowController(1),
	new THREE.GravityController( 1 ),
	new THREE.CreateController(1)

];
/**
* Toggles 2nd ctrlr through various controller objects
*/
function on_menu_up2(){
	
	//The below line is essential. It is located in BasicController
	// and may be overriden
	controller2.on_deactivate();
	
	current_controller2++;
	if(current_controller2 == ctrlr2list.length){
		current_controller2 = 0;
	}
	controller2 = ctrlr2list[current_controller2];
	
	//The below line is essential. It is located in BasicController
	// and may be overriden
	controller2.on_activate();
	controller2.addEventListener( 'menuup', on_menu_up2 );
}


/**
* Main loop. Called everytime the physics sim updates. All update code runs from here.
*/
function render() {
	//controllers define their own handle method which calls .update() and updates physics objs
	count = line.geometry.drawRange.count;
	controller1.handle_update();
	controller2.handle_update();
	
	scene.simulate(); // run physics
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	render_stats.update();	//update stats
	// physics_stats.update();
}
