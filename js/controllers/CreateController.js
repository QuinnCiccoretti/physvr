/**
 * @author quinnciccoretti
 * @class CreateController
 * Creates things
 */
THREE.CreateController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#0066ff", "Create");
	//Init geometries
	var table_geometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
	var table_material = new THREE.MeshBasicMaterial({ color: 0x888888 })
	var table = new Physijs.BoxMesh( table_geometry, table_material, 0);
	table.castShadow = true;
	table.receiveShadow = true;

	var sphere = new Physijs.SphereMesh(
		new THREE.SphereGeometry( .5, 12, 12 ),
		new THREE.MeshBasicMaterial({ color: 0xff0000 }),
		0 //mass
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
	var mode = 0;
	/** Switch modes */
	function onGripsDown( event ) {

		if ( mode == 0 ) {
			mode = 1;
			return;
		}

		if ( mode == 1 ) {
			mode = 0
			return;
		}

	}
	
	this.addEventListener( 'gripsdown', onGripsDown );
	this.addEventListener( 'triggerdown', onTriggerDown );
	this.addEventListener( 'triggerup', onTriggerUp );
};

THREE.CreateController.prototype = Object.create( THREE.BasicController.prototype );
THREE.CreateController.prototype.constructor = THREE.CreateController;
