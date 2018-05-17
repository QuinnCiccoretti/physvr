/**
 * @author quinnciccoretti
 * @class GravityController
 * Control gravity with toucpad
 */
THREE.GravityController = function ( id ) {

	THREE.BasicController.call( this, id, "#555666", "Gravity");
	//this little ball shows where the user's thumb is on the trackpad
	var MODES = { UPDOWN: 0, MULTI: 1 };
    var mode = MODES.UPDOWN;
	var modelabel;
	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial({color:"#ff0000"});
	var ball = new THREE.Mesh( geometry, material );	//this shows where the user's thumb is on the trackpad
	this.ui.add( ball );

	
	/**
	* Moves user around the scene based on thumbpad
	*/
	function onAxisChanged( event ) {
		ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		//only execute the rest if pressing down on thumbpad
		if ( this.getButtonState( 'thumbpad' ) === false ) return;
		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;
		var r = 2*Math.sqrt(x*x+y*y);
		var grav;
		if(mode === MODES.UPDOWN){
			grav = new THREE.Vector3(0,1,0).multiplyScalar(y*-20);
		}
		if(mode === MODES.MULTI){
			var dir = new THREE.Vector3(0,0,-1);
			dir.applyEuler(this.rotation);
			grav = dir.multiplyScalar(y*-20);
		}
		scene.setGravity(grav);
		this.pulse(r/6, 5);	//pulse at intensity proportional to movement speed, for very short duration, 5ms.
	}
	var modelist = ["up/down", "multiaxis"];
	/**
	* Change mode
	*/
	function onGripsDown(event){
		console.log("gripsdown, mode:"+mode);
		if(mode === MODES.UPDOWN){
		    mode = MODES.MULTI;
		}
		//will not work without else if
		else if(mode === MODES.MULTI){
		    mode = MODES.UPDOWN;
		}
		this.ui.remove(modelabel); 
		modelabel = create_text_mesh(modelist[mode], 2, "#ff0000");
		this.ui.add(modelabel);
	}
	
	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown );	//Refresh the page when you press the grips of the MoveCtrlr
};

THREE.GravityController.prototype = Object.create( THREE.BasicController.prototype );
THREE.GravityController.prototype.constructor = THREE.GravityController;
