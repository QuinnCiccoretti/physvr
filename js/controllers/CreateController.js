/**
 * @author quinnciccoretti
 * @class CreateController
 * Creates things
 */
THREE.CreateController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#0066ff", "Create");
	//Init geometries
	//table
	var table_geometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
	var table_material = new THREE.MeshBasicMaterial({ color: 0x888888 })
	var table = new Physijs.BoxMesh( table_geometry, table_material, 0);
	table.castShadow = true;
	table.receiveShadow = true;
	//Sphere
	var sphere = new Physijs.SphereMesh(
		new THREE.SphereGeometry( .5, 12, 12 ),
		new THREE.MeshBasicMaterial({ color: 0xff0000 }),
		0 //mass
	);
	//Brick
	var brick_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'img/brick.jpg' ) }),
		.4, // low friction
		.4 // high restitution
	);
	brick_material.map.wrapS = THREE.RepeatWrapping;
	brick_material.map.repeat.set( .25, .25 );
	var brick = new Physijs.BoxMesh(
			new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
			brick_material,
			5
	);
	/**
	* Creates object
	*/
	//dont update physics so it doesn't mess with arrow.
	this.handle_update = function() {
		this.update(); //refreshes controller data
		//this.update_phys_objects();	//Temporary solution
	}
	var object;
	function onTriggerDown(){
		
		
		//a sphere to launch
		if ( mode == 0 ) {
			object = table.clone();
		}

		if ( mode == 1 ) {
			object = sphere.clone();
		}

		if (mode == 2){
			var my_pos = this.get_absolute_position();
			create_scene_objects(my_pos.x, my_pos.y, my_pos.z);
			object = brick.clone();
		}
		
		this.add(object);
	}
	/** Add object to scene */
	function onTriggerUp(){
		object.matrix.premultiply( this.matrixWorld );
		object.matrix.decompose( object.position, object.quaternion, object.scale );
		var pos = this.get_absolute_position();
		object.position.set(pos.x, pos.y, pos.z);
		this.remove(object);
		scene.add(object);
		object.setLinearVelocity(this.get_velocity().multiplyScalar(4));
		this.pulse(.5,25);
	}
	var modelist = ["table", "sphere","scene"];
	var mode = 0;
	/** Switch modes */
	function onGripsDown( event ) {
		mode +=1;
		if(mode == modelist.length()){
			mode = 0;
		}
		var modelabel = create_text_mesh(modelist[mode], 2, "#ff0000");
		this.ui.add(modelabel);
	}
	
	this.addEventListener( 'gripsdown', onGripsDown );
	this.addEventListener( 'triggerdown', onTriggerDown );
	this.addEventListener( 'triggerup', onTriggerUp );
};

THREE.CreateController.prototype = Object.create( THREE.BasicController.prototype );
THREE.CreateController.prototype.constructor = THREE.CreateController;
