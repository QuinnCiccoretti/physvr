/**
 * @author quinnciccoretti
 * @author mrdoob / http://mrdoob.com
 */

THREE.SlingshotViveController = function ( id ) {
	
	THREE.ViveController.call( this, id );
	//ui - appears on touchpad
	var geometry = new THREE.CircleGeometry( 1, 32 );
	var red_material = new THREE.MeshBasicMaterial( { color:"#ff0000" } );
	var ui = new THREE.Mesh( geometry, red_material );
	ui.position.set( 0, 0.005, 0.0495 );
	ui.rotation.x = - 1.45;
	ui.scale.setScalar( 0.02 );
	this.add( ui );
	//rays
	var geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );
	var line = new THREE.Line( geometry, red_material );
	line.name = 'line';
	line.scale.z = 5;
	this.add( line.clone() );


	handleController = function( controller ) {
		controller.update();
	}
	
	function onTriggerDown(){
		//a sphere to launch
		var sphere = new Physijs.SphereMesh(
			new THREE.SphereGeometry( 5, 5, 5 ),
			new THREE.MeshBasicMaterial({ color: 0x000000 })
		);
		sphere.position = this.position;
		//make vector that points in direction controller points
		var dir = new THREE.Vector3(0,0,1);
		dir.applyEuler(this.rotation);

		scene.add(sphere);
		sphere.applyCentralImpulse(dir);
	}

	
	this.addEventListener( 'triggerup', onTriggerUp );
	this.addEventListener( 'triggerdown', onTriggerDown );
};

THREE.SlingshotViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.SlingshotViveController.prototype.constructor = THREE.SlingshotViveController;
