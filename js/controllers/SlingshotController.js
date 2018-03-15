/**
 * @author quinnciccoretti
 * @author mrdoob / http://mrdoob.com
 */

THREE.SlingshotController = function ( id ) {
	
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
			new THREE.SphereGeometry( 0.25, 12, 12 ),
			new THREE.MeshBasicMaterial({ color: 0xff0000 })
		);
		var pos = this.position;
		//make vector that points in direction controller points
		var dir = new THREE.Vector3(0,0,-1);
		dir.applyEuler(this.rotation);

		scene.add(sphere);
		sphere.position.set( pos.x, pos.y, pos.z );
    	sphere.__dirtyPosition = true;
		sphere.applyCentralImpulse(dir);
	}

	
	
	this.addEventListener( 'triggerdown', onTriggerDown );
};

THREE.SlingshotController.prototype = Object.create( THREE.ViveController.prototype );
THREE.SlingshotController.prototype.constructor = THREE.SlingshotController;
