/**
 * @author quinnciccoretti
 * @class CreateController
 * Creates things
 */
class CreateController extends BasicController {
	constructor(id){
		super( id, "#0066ff", "Create");
		//Initialize all the geometries that will be thrown in a scene
		this.modelabel;
		/**Table*/
		var table_geometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
		var table_material = new THREE.MeshBasicMaterial({ color: 0x888888 })
		this.table = new Physijs.BoxMesh( table_geometry, table_material, 0);
		this.table.castShadow = true;
		this.table.receiveShadow = true;
		/**Sphere*/
		this.sphere = new Physijs.SphereMesh(
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
		this.brick = new Physijs.BoxMesh(
				new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
				brick_material,
				1
		);
		this.obj;
		this.modelist = ["table", "sphere","scene", "brick"];
		this.mode = 0;
		this.addEventListener( 'gripsdown', this.onGripsDown );
		this.addEventListener( 'triggerdown', this.onTriggerDown );
		this.addEventListener( 'triggerup', this.onTriggerUp );
	}
	
	
	
	/**
	* The following three methods, on_activate, on_deactivate, and handle_update are a rather compicated way to
	* remove the physics object around the controller so it does not 
	* collide with created objects.
	* !!!!! WIP !!!!!!!!!
	*/
	on_activate (){
		this.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		this.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
		user.add( this );
		//add the model of the controller
		this.add(basic_controller_models[this.id_]);
		this.make_nameplate();
		
	}

	/**
	* add back the physics objects
	* !!!!! WIP !!!!!!!!!
	*/
	on_deactivate (){
		//this removes the model to conserve memory
		this.remove(basic_controller_models[this.id_]);
		user.remove(this);
		
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
		var obj = this.obj;
		var mode = this.mode;
		//a sphere to launch
		if ( mode == 0 ) {
			obj = this.table.clone();
		}

		if ( mode == 1 ) {
			obj = this.sphere.clone();
		}

		if (mode == 2){
			var my_pos = this.get_absolute_position();
			create_scene_objects(my_pos.x, my_pos.y, my_pos.z);
			obj = this.brick.clone();
		}
		
		if (mode == 3){
			obj = this.brick.clone();
		}
		//sets it a little higher than the halo
		//relative to controller
		obj.position.y = -0.016;
		obj.position.z = -0.043;
		this.add(obj);
	}
	/** Add object to scene */
	onTriggerUp(){
		var obj = this.obj;
		obj.matrix.premultiply( this.matrixWorld );
		obj.matrix.decompose( obj.position, obj.quaternion, obj.scale );
		var pos = this.get_absolute_position();
		obj.position.set(pos.x, pos.y, pos.z);
		this.remove(obj);
		scene.add(obj);
		obj.setLinearVelocity(this.get_velocity().multiplyScalar(4));
		this.pulse(.5,25);
	}
	
	/** Switch modes */
	onGripsDown( event ) {
		var modelabel = this.modelabel;
		var mode = this.mode;
		this.ui.remove(modelabel);
		
		mode +=1;
		if(mode == this.modelist.length){
			mode = 0;
		}
		modelabel = create_text_mesh(this.modelist[mode], 2, "#ff0000");
		this.ui.add(modelabel);
	}
	
	
}