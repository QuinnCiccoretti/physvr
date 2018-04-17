/**
 * @author quinnciccoretti
 */

THREE.SlingshotController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#ff0000" );
	
	//rays
	var geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );
	var line = new THREE.Line( geometry, new THREE.MeshBasicMaterial( { color: "#ff0000" } ) );
	line.name = 'line';
	line.scale.z = 2;
	this.add( line.clone() );


	
	
	function onTriggerDown(){
		//a sphere to launch
		var sphere = new Physijs.SphereMesh(
			new THREE.SphereGeometry( 0.1, 12, 12 ),
			new THREE.MeshBasicMaterial({ color: 0xff0000 }),
			.5 //mass
		);
		var pos = this.position.add(user.position);
		//make vector that points in direction controller points
		var dir = new THREE.Vector3(0,0,-1);
		dir.applyEuler(this.rotation);

		scene.add(sphere);
		sphere.position.set( pos.x, pos.y, pos.z );
    	sphere.__dirtyPosition = true;	//may be unneeded
		sphere.applyCentralImpulse(dir.multiplyScalar(10));
		var gp = this.getGamepad();
		if( gp.hapticActuators && gp.hapticActuators[ 0 ]){	//Check if it has haptics
		    gp.hapticActuators[ 0 ].pulse( 1, 100 );
		    //pulse at 0-1 intensity for 100ms
		}
	}

	
	
	this.addEventListener( 'triggerdown', onTriggerDown );
};

THREE.SlingshotController.prototype = Object.create( THREE.BasicController.prototype );
THREE.SlingshotController.prototype.constructor = THREE.SlingshotController;
