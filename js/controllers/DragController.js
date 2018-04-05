/**
 * @author quinnciccoretti
 * @author mrdoob / http://mrdoob.com
 */

THREE.DragController = function ( id ) {
	
	THREE.BasicController.call( this, id );
	//ui - appears on touchpad
	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color:"#bb6600" } );
	var ui = new THREE.Mesh( geometry, material );
	ui.position.set( 0, 0.005, 0.0495 );
	ui.rotation.x = - 1.45;
	ui.scale.setScalar( 0.02 );
	this.add( ui );
	//rays
	var geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );
	var line = new THREE.Line( geometry );
	line.name = 'line';
	line.scale.z = 5;
	this.add( line.clone() );

	
	function onTriggerDown(){
		var controller = this;
		var intersections = getIntersections( controller );
		if ( intersections.length > 0 ) {
			var intersection = intersections[ 0 ];
			tempMatrix.getInverse( controller.matrixWorld );
			var object = intersection.object;
		
			object.matrix.premultiply( tempMatrix );
			object.matrix.decompose( object.position, object.quaternion, object.scale );
			
			controller.add( object );
			controller.userData.selected = object;
		}
	}
	function onTriggerUp(){
		var controller = this;
		if ( controller.userData.selected !== undefined ) {
			var object = controller.userData.selected;
			object.matrix.premultiply( controller.matrixWorld );
			object.matrix.decompose( object.position, object.quaternion, object.scale );
			
			controller.remove(object);	//remove from controller
			scene.add(object);	//reenable physics
			if(typeof object.setLinearVelocity !== 'undefined'){
				var velo = this.get_velocity();//returns a 3d float array
				//set velocity proportional to distance between lifting object
				//most realistic way
				object.setLinearVelocity(velo.multiplyScalar(this.position.add(user.position).distanceTo(object.position)));	
				var angvelo = this.get_angular_velocity();
				object.setAngularVelocity(angvelo.divideScalar(2));
			}
			controller.userData.selected = undefined;
		}
	}
	function getIntersections( controller ) {
				tempMatrix.identity().extractRotation( controller.matrixWorld );
				raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
				raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );
				return raycaster.intersectObjects( scene.children );
			}
	function intersectObjects( controller ) {
		// Do not highlight when already selected
		if ( controller.userData.selected !== undefined ) return;
		var line = controller.getObjectByName( 'line' );
		var intersections = getIntersections( controller );
		if ( intersections.length > 0 ) {
			var intersection = intersections[ 0 ];
			var object = intersection.object;
			intersected.push( object );
			line.scale.z = intersection.distance;
		} else {
			line.scale.z = 5;
		}
	}
	function cleanIntersected() {
		while ( intersected.length ) {
			var object = intersected.pop();
		}
	}
	this.addEventListener( 'triggerup', onTriggerUp );
	this.addEventListener( 'triggerdown', onTriggerDown );
};

THREE.DragController.prototype = Object.create( THREE.BasicController.prototype );
THREE.DragController.prototype.constructor = THREE.DragController;
