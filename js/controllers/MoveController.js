/**
 * @author quinnciccoretti
 * @class MoveController
 * Moves user around scene
 */
class MoveController extends BasicController {
	constructor(id){
		super(id, "#009933", "Move");
		this.MODES = { FLAT: 0, MULTI: 1 };
	    this.mode = this.MODES.FLAT;
		this.modelabel;
		var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
		var material = new THREE.MeshBasicMaterial();
		this.ball = new THREE.Mesh( geometry, material );	//this shows where the user's thumb is on the trackpad
		this.ui.add( this.ball );
		this.modelist = ["flataxis", "multiaxis"];
		this.addEventListener( 'axischanged', this.onAxisChanged );
		//Refresh the page when you press the grips of the MoveCtrlr
		this.addEventListener( 'gripsdown', this.onGripsDown );	
	}
	
	
	

	
	/**
	* Moves user around the scene based on thumbpad
	*/
	onAxisChanged( event ) {
		this.ball.position.set(event.axes[ 0 ], event.axes[ 1 ], 0);
		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;
		var r = 2*Math.sqrt(x*x+y*y);
		

		var dir = this.get_pointing_vector().multiplyScalar(-1);
		var final_dir;
		if(this.mode === this.MODES.FLAT){
    		final_dir = new THREE.Vector3(dir.x, 0 ,dir.z);
		}
		if(this.mode === this.MODES.MULTI){
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
	
	/**
	* Change mode
	*/
	onGripsDown(event){
		var mode = this.mode;
		var MODES = this.MODES;
		console.log("gripsdown, mode:"+mode);
		if(mode === MODES.FLAT){
		    mode = MODES.MULTI;
		}
		//will not work without else if
		else if(mode === MODES.MULTI){
		    mode = MODES.FLAT;
		}
		this.ui.remove(this.modelabel);
		this.modelabel = create_text_mesh(this.modelist[mode], 2, "#ff0000");
		this.ui.add(modelabel);
	}
	
}


