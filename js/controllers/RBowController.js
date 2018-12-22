var arrow;
/**
 * @author quinnciccoretti
 * @class RBowController
 * the hand that pulls the bowstring. Should be used with other hand as LBowController
 */
class RBowController extends BasicController {
	constructor(id){
		super( id, "#703101", "RBow");
		/**for vibrating with distance*/
		var last_threshold = .1;
		this.addEventListener( 'triggerdown', this.onTriggerDown );
		this.addEventListener( 'triggerup', this.onTriggerUp );
	}
	
	
	
	 /**
	 * positions and points arrow between controllers.
	 */
	handle_update(){
		this.update(); //refreshes controller data
		// this.update_phys_objects(); //TODO -> cancel physics, as arrow collides with controller
		//canceling update is temporary solution
		//maybe try scene.remove(phys_objn)

		if(this.getButtonState("trigger")){	//while trigger held
			if(typeof arrow !== "undefined"){
				var handpos = this.get_absolute_position();
				var bowpos = controller1.get_absolute_position();
				var midpt = handpos.clone().add(bowpos).divideScalar(2);
				//position arrow 
				var diff = bowpos.clone().sub(handpos);
				diff.normalize();
				var arrowHelper = new THREE.ArrowHelper(diff, new THREE.Vector3());
				arrow.position.set(midpt.x, midpt.y, midpt.z);
				arrow.__dirtyPosition = true; //needed for the physics scene to update pos
				 
				 //quaternion that will align objects between the two controllers
				var align = arrowHelper.rotation;
			    arrow.rotation.set(align.x, align.y, align.z);
			    arrow.__dirtyRotation = true;	//needed for the physics scene to update rot
			    
			    //Cancel any movement of the arrow
			    arrow.setLinearVelocity(new THREE.Vector3(0, 0, 0));
			    arrow.setAngularVelocity(new THREE.Vector3(0, 0, 0));

			    //pulse haptics proportional to distance to simulate pulling bowstring
				var d = handpos.distanceTo(bowpos);
				if(d>last_threshold){
				//vibrates if the controller has moved a certain distance (0.025 meters)
					this.pulse(d,1);
					last_threshold+=.025;
				}
				
			}
			
		}
	}
	
	/**
	 * launches arrow proportional to draw distance
	 */
	onTriggerUp(){
		last_threshold = .1;	//reset threshold for vibrating with distance
		var my_pos = this.get_absolute_position();
		arrow.position.set(my_pos.x, my_pos.y, my_pos.z);
		arrow.__dirtyPosition = true; //needed for the physics scene to update pos
		// scene.add(arrow);
		var diff = my_pos.sub(controller1.get_absolute_position());
		// user.remove(arrow);

		
		arrow.setLinearVelocity(diff.multiplyScalar(-40));
	}
	/**
	 * instantiates new arrow with physics
	 */
	onTriggerDown(){
		arrow = new Physijs.CylinderMesh(
	    new THREE.CylinderGeometry( .01, .01, .5, 32 ),
	    new THREE.MeshBasicMaterial({ color: 0x703101 }),
	    .5	//mass
		);
		arrow.material.side = THREE.DoubleSide;

		var handpos = this.get_absolute_position();
		arrow.position.set(handpos.x,handpos.y,handpos.z);
		arrow.__dirtyPosition = true;
		scene.add(arrow);
	}	
}