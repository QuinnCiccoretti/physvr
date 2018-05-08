/**
 * @author quinnciccoretti
 * @class MoveController
 * Moves user around scene
 */
THREE.MoveController = function ( id ) {

	THREE.BasicController.call( this, id, "#009933", "Move");
	
	var MODES = { FLAT: 0, MULTI: 1 };
    var mode = MODES.MULTI;
	
	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	material.color = color;
	var ball = new THREE.Mesh( geometry, material );	//this shows where the user's thumb is on the trackpad
	this.ui.add( ball );

	
	/**
	* Moves user around the scene based on thumbpad
	*/
	function onAxisChanged( event ) {
		ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;
		var r = 2*Math.sqrt(x*x+y*y);
		

		var dir = new THREE.Vector3(0,0,1);
		dir.applyEuler(this.rotation);
		var flat_dir;
		if(mode === MODES.FLAT){
    		flat_dir = new THREE.Vector3(dir.x, 0 ,dir.z);
		}
		if(mode === MODES.MULTI){
		    flat_dir = new THREE.Vector3(dir.x, dir.y, dir.z);
		}
		flat_dir.divideScalar(flat_dir.length());	//convert to unit vec as we are only interested in direction
		flat_dir.multiplyScalar(r);	//scale to radius from center of touchpad
		flat_dir.divideScalar(10);	//scale down to reasonable speed
		if(y<0){
			flat_dir.multiplyScalar(-1);	//flip around if thumpad forward, allows thumbpad back to go backwards.
		}
		
		user.position.add(flat_dir);
		this.pulse(r/6, 5);	//pulse at intensity proportional to movement speed, for very short duration, 5ms.
	}
	/**
	* Refresh the page
	*/
	function onGripsDown(){
		if(mode === MODES.FLAT){
		    mode = MODES.MULTI;
		}
		if(mode === MODES.MULTI){
		    mode = MODES.FLAT;
		}
	}
	
	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown );	//Refresh the page when you press the grips of the MoveCtrlr
};

THREE.MoveController.prototype = Object.create( THREE.BasicController.prototype );
THREE.MoveController.prototype.constructor = THREE.MoveController;
