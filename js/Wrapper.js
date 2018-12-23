class Wrapper {
	constructor(id){
		//Set up basic controllers while a list of other controllers loads'
		this.wrap_id = id;
		this.ctrlr = new BasicController( 0 );
		var ctrlr = this.ctrlr; //may brick
		ctrlr.position.set(0,10,0); //start controller high and away to avoid collisions
		user.add( ctrlr );
		
		//toggle ctrlr mode by switching to a new ctrlr class
		ctrlr.addEventListener( 'menudown', this.on_menu_up );
		var physGeom = new THREE.CubeGeometry(0.12, 0.1, 0.22); 
		var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.5, 0.5);
		physMaterial.visible = false;	//Make them invisible
		this.phys_obj = new Physijs.BoxMesh(physGeom, physMaterial, 100);
		this.phys_obj.addEventListener( 'collision', 
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				ctrlr.pulse(.25, 25);
				//set object.userData.ctrlr_nocollide = true; to stop collision
				if(typeof other_object.userData.ctrlr_nocollide !== "undefined"){
					other_object.setLinearVelocity(0,0,0);
				}
			}
		);
		this.phys_obj.material.wireframe = true;
		scene.add(this.phys_obj);
		this.ctrlrlist = [
		    new PaintController( id ), 
		    new MoveController( id ), 
		    new DragController( id ), 
		    new SlingshotController( id ),
		    new LBowController(id),
		    new CreateController(id), 
		    new RefreshController(id),
		    new GravityController( id )
		    // new THREE.BatController(0)
		 ];
		this.current_controller = 0;
		// since 'menuup' event is dispatched in the controller
		// we must add it to all controllers
		for(var i = 0; i<this.ctrlrlist.length; i++){
			this.ctrlrlist[i].addEventListener( 'menuup', this.on_menu_up );
		}
		
	}
	get_phys_obj(){
		return this.phys_obj;
	}
	get_ctrlr(){
		return this.ctrlr;
	}
	handle_update(){
		this.ctrlr.handle_update();
		this.ctrlr.update_phys_obj(this.phys_obj);
	}
	/**
	* Toggles through various controller objects,
	* effectively switching the function of the buttons
	*/
	on_menu_up(){
		//The below line is essential. It is located in BasicController
		// and may be overriden
		this.ctrlr.on_deactivate();
		
		this.current_controller++;
		if(this.current_controller == this.ctrlrlist.length){
			this.current_controller = 0;
		}
		this.ctrlr = this.ctrlrlist[this.current_controller];
		
		//Also essential & can be overridden
		this.ctrlr.on_activate();
		
	}
}