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
		new THREE.SphereGeometry( 0.1, 12, 12 ),
		new THREE.MeshBasicMaterial({ color: 0xff0000 }),
		.5 //mass
	);
	
	/**
	* Creates object
	*/
	function onTriggerDown(){
		var pos = this.get_absolute_position();
		var object;
		//a sphere to launch
		if ( mode == 0 ) {
			object = table.clone();
		}

		if ( mode == 1 ) {
			object = sphere.clone();
		}
		object.position.set(pos.x, pos.y, pos.z);
		scene.add(object);
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
};

THREE.CreateController.prototype = Object.create( THREE.BasicController.prototype );
THREE.CreateController.prototype.constructor = THREE.CreateController;
