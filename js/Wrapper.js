class Wrapper {
	constructor(id){
		//Set up basic controllers while a list of other controllers loads'
		this.wrap_id = id;
		this.ctrlr = new BasicController( id );
		var ctrlr = this.ctrlr; //may brick
		ctrlr.position.set(0,10,0); //start controller high and away to avoid collisions
		user.add( ctrlr );
		
		//toggle ctrlr mode by switching to a new ctrlr class
		//bit of a workaround but necessary
		var w = this;
		var f = this.on_menu_up;
		ctrlr.addEventListener( 'menuup', function(){
			f(w);		
		});
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
		this.current_controller = -1;
		// since 'menuup' event is dispatched in the controller
		// we must add it to all controllers
		for(var i = 0; i<this.ctrlrlist.length; i++){
			this.ctrlrlist[i].addEventListener( 'menuup', function(){
			f(w);		
		});
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
	on_menu_up(w){
		//The below line is essential. It is located in BasicController
		// and may be overriden
		console.log("This is what you came for");
		console.log(w);
		w.ctrlr.on_deactivate();
		
		w.current_controller++;
		if(w.current_controller == w.ctrlrlist.length){
			w.current_controller = 0;
		}
		w.ctrlr = w.ctrlrlist[w.current_controller];
		
		//Also essential & can be overridden
		w.ctrlr.on_activate();
		
	}
}