/**
 * @author quinnciccoretti
 */


THREE.MoveController = function ( id ) {

	THREE.ViveController.call( this, id );

	var PI2 = Math.PI * 2;

	var MODES = { COLOR: 0, SIZE: 1 };
	var mode = MODES.COLOR;

	var color = new THREE.Color( 1, 1, 1 );
	var size = 1.0;

	// COLOR UI

	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { color:"#009933" } );
	var moveUI = new THREE.Mesh( geometry, material );
	moveUI.position.set( 0, 0.005, 0.0495 );
	moveUI.rotation.x = - 1.45;
	moveUI.scale.setScalar( 0.02 );
	this.add( moveUI );

	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	material.color = color;
	var ball = new THREE.Mesh( geometry, material );	//this shows where the user's thumb is on the trackpad
	moveUI.add( ball );

	handleController = function( controller ) {
		controller.update();
	}

	function onAxisChanged( event ) {
		ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;
		var r = 2*Math.sqrt(x*x+y*y);
		

		var dir = new THREE.Vector3(0,0,1);
		dir.applyEuler(this.rotation);
		
		var flat_dir = new THREE.Vector3(dir.x, 0 ,dir.z);
		flat_dir.divideScalar(flat_dir.length());	//convert to unit vec as we are only interested in direction
		flat_dir.multiplyScalar(r);	//scale to touchpad radius
		flat_dir.divideScalar(10);	//scale down to reasonable speed
		if(y<0){
			flat_dir.multiplyScalar(-1);	//flip around if thumpad forward
		}
		
		user.position.add(flat_dir);
	}
	function onGripsDown(){
		window.location.reload();
	}
	
	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown );	//Refresh the page when you press the grips of the MoveCtrlr
};

THREE.MoveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.MoveController.prototype.constructor = THREE.MoveController;
