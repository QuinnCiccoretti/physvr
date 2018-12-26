/**
 * @author quinnciccoretti
 * @author mrdoob
 * @class DragController
 * Grabs and throws objects
 */

class DragController extends BasicController {
	constructor(id){
		super( id, "#bb6600", "Drag");
		//rays
		var geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );
		var line = new THREE.Line( geometry );
		line.name = 'line';
		line.scale.z = 5;
		this.add( line.clone() );
		
		//touchpad ball
		var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
		var material = new THREE.MeshBasicMaterial({color:"#ff0000"});
		//this shows where the user's thumb is on the trackpad
		var ball = new THREE.Mesh( geometry, material );	
		this.ui.add( ball );
		this.intersected = [];
		var object;
		this.addEventListener( 'axischanged', this.onAxisChanged );
		this.addEventListener( 'triggerup', this.onTriggerUp );
		this.addEventListener( 'triggerdown', this.onTriggerDown );
	}
	
	

	onTriggerDown(){
		var controller = this;
		var tempMatrix = new THREE.Matrix4();
		var intersections = this.getIntersections( tempMatrix );
		if ( intersections.length > 0 ) {
			var intersection = intersections[ 0 ];
			tempMatrix.getInverse( controller.matrixWorld );
			object = intersection.object;
			console.log(tempMatrix);
			object.matrix.premultiply( tempMatrix );
			object.matrix.decompose( object.position, object.quaternion, object.scale );
			
			controller.add( object );
			controller.userData.selected = object;
		}
	}
	onTriggerUp(){
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
	getIntersections(tempMatrix) {
				
				tempMatrix.identity().extractRotation( this.matrixWorld );
				raycaster.ray.origin.setFromMatrixPosition( this.matrixWorld );
				raycaster.ray.direction.set( 0, 0, -1 ).applyMatrix4( tempMatrix );
				return raycaster.intersectObjects( scene.children );
			}
	intersectObjects(  ) {
		// Do not highlight when already selected
		if ( this.userData.selected !== undefined ) return;
		var line = this.getObjectByName( 'line' );
		var intersections = getIntersections();
		if ( intersections.length > 0 ) {
			var intersection = intersections[ 0 ];
			var object = intersection.object;
			this.intersected.push( object );
			line.scale.z = intersection.distance;
		} else {
			line.scale.z = 5;
		}
	}
	cleanIntersected() {
		while ( this.intersected.length ) {
			var object = this.intersected.pop();
		}
	}
	onAxisChanged( event ) {
		
		if ( this.getButtonState( 'trigger' ) === false ) return;
		// if ( this.getButtonState( 'tou' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;

		ball.position.set(0, event.axes[ 1 ], 0);
		object.position.multiplyScalar(y*5);
	}
	
}