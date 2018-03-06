/**
 * @author quinnciccoretti
 * @author mrdoob / http://mrdoob.com
 */


THREE.DragViveController = function ( id ) {
	var trigger_down = false;
	var selectedObj;
	var is_obj_selected = false;
	THREE.ViveController.call( this, id );
	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color:"#bb6600" } );
	var moveUI = new THREE.Mesh( geometry, material );
	moveUI.position.set( 0, 0.005, 0.0495 );
	moveUI.rotation.x = - 1.45;
	moveUI.scale.setScalar( 0.02 );
	this.add( moveUI );

	// Track collisions
	obj_list[id].addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
		console.log("collision");
		if(trigger_down&&!is_obj_selected){
			console.log("selected");
			is_obj_selected = true;
			selectedObj = other_object;
			// console.log(selectedObj);
		}

	});
	
	
	handleController = function( controller ) {

		controller.update();
		console.log(is_obj_selected);
		if(selectedObj!=0){
			console.log("updating velocity")
			var diff = selectedObj.position.sub(this.position);
			selectedObj.setLinearVelocity(diff.x,diff.y,diff.z);
		}
	}
	function onTriggerUp(){
		//is_obj_selected = false;
		trigger_down = false;
	}
	function onTriggerDown(){
		trigger_down = true;
	}
	this.addEventListener( 'triggerup', onTriggerUp );
	this.addEventListener( 'triggerdown', onTriggerDown );
};

THREE.DragViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.DragViveController.prototype.constructor = THREE.DragViveController;
