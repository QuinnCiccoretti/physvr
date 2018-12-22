class Wrapper {
	constructor(){
		//Set up basic controllers while a list of other controllers loads
		this.ctrlr = new BasicController( 0 );
		var ctrlr = this.ctrlr; //may brick
		// ctrlr.userData.points = [ new THREE.Vector3(), new THREE.Vector3() ];
		// ctrlr.userData.matrices = [ new THREE.Matrix4(), new THREE.Matrix4() ];
		ctrlr.position.set(0,10,0); //start controller high and away to avoid collisions
		user.add( ctrlr );

		
		//toggle the controller mode
		ctrlr.addEventListener( 'menudown', this.on_menu_up );
		var physGeom = new THREE.CubeGeometry(0.12, 0.1, 0.22); 
		var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}), 0.5, 0.5);
		physMaterial.visible = false;	//Make them invisible
		this.phys_obj = new Physijs.BoxMesh(physGeom, physMaterial, 100);
		this.phys_obj.addEventListener( 'collision', 
			function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				ctrlr.pulse(.25, 25);
				//by setting object.userData.ctrlr_nocollide to true, you can make it not collide with the controller
				if(typeof other_object.userData.ctrlr_nocollide !== "undefined"){
					other_object.setLinearVelocity(0,0,0);
				}
			}
		);
		this.phys_obj.material.wireframe = true;
		scene.add(this.phys_obj);
		var ctrlrlist = [
		    new PaintController( 0 ), 
		    new MoveController( 0 ), 
		    new DragController( 0 ), 
		    new SlingshotController( 0 ),
		    new LBowController(0),
		    new CreateController(0), 
		    new RefreshController(0),
		    new GravityController( 0 )
		    // new THREE.BatController(0)
		 ];
		var current_controller = 0;
		
		
	}
	get_phys_obj(){
		return this.phys_obj;
	}
	get_ctrlr(){
		return this.ctrlr;
	}
	handle_update(){
		this.ctrlr.handle_update();
	}
	/**
	* Toggles 1st ctrlr through various controller objects
	*/
	on_menu_up(){
		
		//The below line is essential. It is located in BasicController
		// and may be overriden
		this.ctrlr.on_deactivate();
		
		current_controller++;
		if(current_controller == ctrlr1list.length){
			current_controller = 0;
		}
		this.ctrlr = ctrlrlist[current_controller];
		
		//The below line is essential. It is located in BasicController
		// and may be overriden
		this.ctrlr.on_activate();
		this.ctrlr.addEventListener( 'menuup', this.on_menu_up );
	}
}