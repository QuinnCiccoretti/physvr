/**
 * @author quinnciccoretti
 * @class BasicController
 * Defines basic methods for getting sensor data and using haptics
 */
THREE.BasicController = function ( id, uicolor="#ff00ff", name = "Basic") {

	THREE.ViveController.call( this, id );
	console.log("BasicController instantiated with id:"+id);
	//UI, appears on the touchpad, with uicolor
	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color: uicolor } );
	this.ui = new THREE.Mesh( geometry, material );
	this.ui.position.set( 0, 0.005, 0.0495 );
	this.ui.rotation.x = - 1.45;
	this.ui.scale.setScalar( 0.02 );
	
	this.add( this.ui );

	/**
	* Returns controller id, 1 or 0
	*/
	this.get_id = function() {
		return id;
	}

	/**
	* Updates controller position data based on gamepad pose
	*/
	this.handle_update = function() {
		this.update(); //refreshes controller data
		this.update_phys_objects();
	}

	/**
	* @returns the position of the controller in the scene, not relative to user
	*/
	this.get_absolute_position = function() {
		var temp = user.position.clone();
		return temp.add(this.position);
	}
	/**
	* @returns the velocity of the controller from the gamepad
	*/
	this.get_velocity = function() {
		return new THREE.Vector3().fromArray(this.getGamepad().pose.linearVelocity);
	}
	/**
	* @returns the angular velocity of the controller from the gamepad
	*/
	this.get_angular_velocity = function() {
		return new THREE.Vector3().fromArray(this.getGamepad().pose.angularVelocity);
	}

	/**
	* Updates invisible boxes (phys_obj1 and phys_obj2)
	* to follow controllers so they can push things
	*/
	this.update_phys_objects = function(){
		
		var my_pos = this.get_absolute_position();
		//get the appropriate physics object, object 1 or 2, from a global list
		var phys_obj = phys_obj_list[id];	

		var rot = this.rotation;
		phys_obj.rotation.set(rot.x, rot.y, rot.z);
		phys_obj.__dirtyRotation = true;

		phys_obj.position.set( my_pos.x, my_pos.y + controller_offset_y, my_pos.z  );
		phys_obj.__dirtyPosition = true;

	    //cancel the object's velocity
	    phys_obj.setLinearVelocity(new THREE.Vector3(0, 0, 0));
	    phys_obj.setAngularVelocity(new THREE.Vector3(0, 0, 0));
	}
	/**
	* called whenever the menu button is pressed to switch to this mode
	* from another mode
	*/
	this.on_activate = function(){
		this.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		this.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
		user.add( this );
		//add the model of the controller
		this.add(basic_controller_models[id]);
		this.make_nameplate();
	}
	/**
	* called whenever the menu button is pressed to switch modes from
	* this mode to another
	*/
	this.on_deactivate = function(){
		//this removes the model to conserve memory
		this.remove(basic_controller_models[id]);
		user.remove(this);
	}
	
	// /**
	// * Places physics objects arbitrarily far away from user.
	// * This ensures they don't randomly collide when they aren't being updated
	// */
	// this.suspend_phys_objects = function(){
	// 	suspend_object(phys_obj1);
	// 	suspend_object(phys_obj2);

	// }
	// *
	// * Helper method to suspend objects
	
	// function suspend_object(object){
	// 	var zerovec = new THREE.Vector3();
	// 	object.setLinearFactor(zerovec);
	// 	object.setAngularFactor(zerovec);
	// 	object.position.set( 0, 100, 0 );
 //   		object.__dirtyPosition = true;
	// }

	/** starts at false */
	var made_nameplate = false;
	/**
	 * Adds a text label to controller and sets .name attribute
	 */
	this.make_nameplate = function(){
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
	this.pulse = function(intensity, duration){
		var gp = this.getGamepad();
		if( gp.hapticActuators && gp.hapticActuators[ 0 ]){	//Check if it has haptics
		    gp.hapticActuators[ 0 ].pulse( intensity, duration );
		    //pulse at 0-1 intensity for (duration)ms
		}
	}

};

THREE.BasicController.prototype = Object.create( THREE.ViveController.prototype );
THREE.BasicController.prototype.constructor = THREE.BasicController;
