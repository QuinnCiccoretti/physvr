/**
 * @author quinnciccoretti
 * @class BasicController
 * Defines basic methods for getting sensor data and using haptics
 */
class BasicController extends ViveController  {
	constructor( id, uicolor="#ff00ff", name = "Basic"){
		super(id);
		console.log("BasicController instantiated with id:"+id);
		//UI, appears on the touchpad, with uicolor
		var geometry = new THREE.CircleGeometry( 1, 32 );
		var material = new THREE.MeshBasicMaterial( { color: uicolor } );
		this.ui = new THREE.Mesh( geometry, material );
		this.ui.position.set( 0, 0.005, 0.0495 );
		this.ui.rotation.x = - 1.45;
		this.ui.scale.setScalar( 0.02 );
		this.add( this.ui );
		/** starts at false */
		var made_nameplate = false;
	}
	
	
	
	

	/**
	* Returns controller id, 1 or 0
	*/
	get_id() {
		return this.id_;
	}

	/**
	* Updates controller position data based on gamepad pose
	*/
	handle_update() {
		this.update(); //refreshes controller data
	}

	/**
	* @returns the position of the controller in the scene, not relative to user
	*/
	get_absolute_position() {
		var temp = user.position.clone();
		return temp.add(this.position);
	}
	/**
	* @returns the velocity of the controller from the gamepad
	*/
	get_velocity() {
		return new THREE.Vector3().fromArray(this.getGamepad().pose.linearVelocity);
	}
	/**
	* @returns the angular velocity of the controller from the gamepad
	*/
	get_angular_velocity() {
		return new THREE.Vector3().fromArray(this.getGamepad().pose.angularVelocity);
	}
	/**
	* @returns a vector pointing out from the controller,
	* intended for shooting things alongs
	*/
    get_pointing_vector(){
        var dir = new THREE.Vector3(0,0,-1);
		dir.applyEuler(this.rotation);
		return dir;
    }
	/**
	* Updates invisible boxes (phys_obj1 and phys_obj2)
	* to follow controllers so they can push things
	*/
	update_phys_obj(my_phys_obj){
		
		var my_pos = this.get_absolute_position();
		//get the appropriate physics object, object 1 or 2, from a global list
		// var my_phys_obj = phys_obj_list[this.id_];	

		var rot = this.rotation;
		my_phys_obj.rotation.set(rot.x, rot.y, rot.z);
		my_phys_obj.__dirtyRotation = true;

		my_phys_obj.position.set( my_pos.x, my_pos.y + controller_offset_y, my_pos.z  );
		my_phys_obj.__dirtyPosition = true;

	    //cancel the object's velocity
	    my_phys_obj.setLinearVelocity(new THREE.Vector3(0, 0, 0));
	    my_phys_obj.setAngularVelocity(new THREE.Vector3(0, 0, 0));
	}
	/**
	* called whenever the menu button is pressed to switch to this mode
	* from another mode
	*/
	on_activate(){
		this.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		this.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
		user.add( this );
		//add the model of the controller
		this.add(basic_controller_models[this.id_]);
		this.make_nameplate();
	}
	/**
	* called whenever the menu button is pressed to switch modes from
	* this mode to another
	*/
	on_deactivate(){
		//this removes the model to conserve memory
		this.remove(basic_controller_models[this.id_]);
		user.remove(this);
	}
	
	
	/**
	 * Adds a text label to controller and sets .name attribute
	 */
	make_nameplate(){
		this.name = name;
		if( !made_nameplate && (typeof uifont !== "undefined") ){
			this.nameplate = create_text_mesh(name, 2, uicolor);
			this.nameplate.rotation.z = -1.55;	//align w/ controller handle
			this.ui.add(this.nameplate);
			this.nameplate.position.set(-0.5, -0.8, 0.3); //set relative pos
			made_nameplate = true;
		}
		
	}
	/**
	* Vibrates haptics if controller has them
	* @param intensity a 0-1 value, 1 is highest vibration
	* @param duration duration of a pulse in ms
	*/
	pulse(intensity, duration){
		var gp = this.getGamepad();
		if( gp.hapticActuators && gp.hapticActuators[ 0 ]){	//Check if it has haptics
		    gp.hapticActuators[ 0 ].pulse( intensity, duration );
		    //pulse at 0-1 intensity for (duration)ms
		}
	}

}
