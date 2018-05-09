/**
 * @author quinnciccoretti
 * @class MoveController
 * Moves user around scene
 */
THREE.MoveController = function ( id ) {

	THREE.BasicController.call( this, id, "#009933", "Move");
	
	var MODES = { FLAT: 0, MULTI: 1 };
    var mode = MODES.FLAT;
	var modelabel;
	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	// material.color = "#000000";
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
		var final_dir;
		if(mode === MODES.FLAT){
    		final_dir = new THREE.Vector3(dir.x, 0 ,dir.z);
		}
		if(mode === MODES.MULTI){
		    final_dir = dir;
		}
		final_dir.divideScalar(final_dir.length());	//convert to unit vec as we are only interested in direction
		final_dir.multiplyScalar(r);	//scale to radius from center of touchpad
		final_dir.divideScalar(10);	//scale down to reasonable speed
		if(y<0){
			final_dir.multiplyScalar(-1);	//flip around if thumpad forward, allows thumbpad back to go backwards.
		}
		
		user.position.add(final_dir);
		this.pulse(r/6, 5);	//pulse at intensity proportional to movement speed, for very short duration, 5ms.
	}
	var modelist = ["flataxis", "multiaxis"];
	/**
	* Change mode
	*/
	function onGripsDown(event){
		console.log("gripsdown, mode:"+mode);
		if(mode === MODES.FLAT){
		    mode = MODES.MULTI;
		}
		//will not work without else if
		else if(mode === MODES.MULTI){
		    mode = MODES.FLAT;
		}
		this.ui.remove(modelabel);
		modelabel = create_text_mesh(modelist[mode], 2, "#ff0000");
		this.ui.add(modelabel);
	}
	
	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown );	//Refresh the page when you press the grips of the MoveCtrlr
};

THREE.MoveController.prototype = Object.create( THREE.BasicController.prototype );
THREE.MoveController.prototype.constructor = THREE.MoveController;
