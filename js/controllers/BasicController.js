/**
 * @author quinnciccoretti
 */
THREE.BasicController = function ( id ) {

	THREE.ViveController.call( this, id );
	console.log("BasicController instantiated with id:"+id);
	//UI, appears on the touchpad
	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color:"#ff00ff" } );
	var ui = new THREE.Mesh( geometry, material );
	ui.position.set( 0, 0.005, 0.0495 );
	ui.rotation.x = - 1.45;
	ui.scale.setScalar( 0.02 );
	this.add( ui );
	/**
	* Returns controller id, 1 or 0
	*/
	this.get_id = function() {
		return id;
	}
	/**
	* The basic controller only updates its position
	*/
	this.handle_update = function() {
		this.update(); //refreshes controller data
		this.update_phys_objects();
	}
	/**
	* Updates invisible boxes to follow controllers so they can push things
	*/
	this.update_phys_objects = function(){
		
		var user_pos = user.position;
		//get the appropriate physics object, object 1 or 2, from a global list
		var phys_obj = phys_obj_list[id];	

		var rot = this.rotation;
		phys_obj.rotation.set(rot.x, rot.y, rot.z);
		phys_obj.__dirtyRotation = true;

		var pos = this.position;
		phys_obj.position.set( pos.x +user_pos.x, pos.y +user_pos.y + controller_offset_y, pos.z +user_pos.z );
		phys_obj.__dirtyPosition = true;

	    //cancel the object's velocity
	    phys_obj.setLinearVelocity(new THREE.Vector3(0, 0, 0));
	    phys_obj.setAngularVelocity(new THREE.Vector3(0, 0, 0));
	}

};

THREE.BasicController.prototype = Object.create( THREE.ViveController.prototype );
THREE.BasicController.prototype.constructor = THREE.BasicController;
