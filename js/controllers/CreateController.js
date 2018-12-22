/**
 * @author quinnciccoretti
 * @class CreateController
 * Creates things
 */
class CreateController extends BasicController {
	constructor(id){
		super( id, "#0066ff", "Create");
		//Initialize all the geometries that will be thrown in a scene
		var modelabel;
		/**Table*/
		var table_geometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
		var table_material = new THREE.MeshBasicMaterial({ color: 0x888888 })
		var table = new Physijs.BoxMesh( table_geometry, table_material, 0);
		table.castShadow = true;
		table.receiveShadow = true;
		/**Sphere*/
		var sphere = new Physijs.SphereMesh(
			new THREE.SphereGeometry( .25, 12, 12 ),
			new THREE.MeshBasicMaterial({ color: 0xff0000 }),
			0 //mass
		);
		/**Brick*/
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
				1
		);
		var object;
		var modelist = ["table", "sphere","scene", "brick"];
		var mode = 0;
		this.addEventListener( 'gripsdown', this.onGripsDown );
		this.addEventListener( 'triggerdown', this.onTriggerDown );
		this.addEventListener( 'triggerup', this.onTriggerUp );
	}
	
	
	
	/**
	* The following three methods, on_activate, on_deactivate, and handle_update are a rather compicated way to
	* remove the physics object around the controller so it does not 
	* collide with created objects.
	*/
	on_activate (){
		this.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		this.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
		user.add( this );
		//add the model of the controller
		this.add(basic_controller_models[id]);
		this.make_nameplate();
		//remove physobj
		scene.remove(phys_obj_list[id]);
	}
	/**
	* add back the physics object
	*/
	on_deactivate (){
		//this removes the model to conserve memory
		this.remove(basic_controller_models[id]);
		user.remove(this);
		//add back physobj
		scene.add(phys_obj_list[id]);
	}
	// /**
	// * Updates controller position data based on gamepad pose
	// */
	// handle_update () {
	// 	this.update(); //refreshes controller data
	// 	//dont update physics
	// 	//this.update_phys_objects();
	// }
	update_phys_objects (){}
	
	
	/**
	* Creates object
	*/
	onTriggerDown(){
		
		
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
		
		if (mode == 3){
			object = brick.clone();
		}
		//sets it a little higher than the halo
		//relative to controller
		object.position.y = -0.016;
		object.position.z = -0.043;
		this.add(object);
	}
	/** Add object to scene */
	onTriggerUp(){
		object.matrix.premultiply( this.matrixWorld );
		object.matrix.decompose( object.position, object.quaternion, object.scale );
		var pos = this.get_absolute_position();
		object.position.set(pos.x, pos.y, pos.z);
		this.remove(object);
		scene.add(object);
		object.setLinearVelocity(this.get_velocity().multiplyScalar(4));
		this.pulse(.5,25);
	}
	
	/** Switch modes */
	onGripsDown( event ) {
		this.ui.remove(modelabel);
		mode +=1;
		if(mode == modelist.length){
			mode = 0;
		}
		modelabel = create_text_mesh(modelist[mode], 2, "#ff0000");
		this.ui.add(modelabel);
	}
	
	
}