/**
 * Though still a "controller" for class purposes, it use the leap to
 * render in physics objects in the shape of your hands
 * @author quinnciccoretti
 */
var leap_active = false;	//only want to initialize one listener for leap data
THREE.LeapController = function ( id ) {
	var boneMeshes = [];
	var leapcontroller;
	THREE.BasicController.call( this, id );
	init_bone_meshes();
	init_leap();
	
	
	/**
	 * Sets up an interface with the leap, and adds a listener to
	 * call draw_hands() whenever it updates.
	 */
	function init_leap() {
		leapcontroller = new Leap.Controller({ enableGestures: true, optimizeHMD:true});
		leapcontroller.use('screenPosition')
		leapcontroller.use('transform', {
		// This matrix flips the x, y, and z axis, scales to meters, and offsets the hands by -8cm.
		vr: true,
		// This causes the camera's matrix transforms (position, rotation, scale) to be applied to the hands themselves
		// The parent of the bones remain the scene, allowing the data to remain in easy-to-work-with world space.
		// (As the hands will usually interact with multiple objects in the scene.)
		effectiveParent: camera
		})
		
		console.log("Initialized Leap");
	}
	/**
	 * Makes an array of physijs meshes, which will be updated
	 * based on the position of the user's joints to draw a 
	 * hand.
	 */
	function init_bone_meshes() {
		for (var i = 0; i < 40; i++) {
			var m = new Physijs.SphereMesh(
				new THREE.SphereGeometry(0.01),
				Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xff0000}), 1, 1),
				1
				);
			m.material.side = THREE.DoubleSide;
			m.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				// `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`				
				
			});
			boneMeshes.push(m);
		}
		console.log("Initialized boneMeshes:");
		console.log(boneMeshes);
	}
	/**
	 * Updates positions of bonemeshes, effectively drawing a hand.
	 */
	function draw_hands(frame){
		if(frame == 0){	//if empty
			return 0;
		}
		var dat = [];
		var fingers = frame.fingers;
		var count = 0;
		for (var i = 0; i < fingers.length; i++) {
			for (var j = 0; j < fingers[i].bones.length; j++) {
				var b = fingers[i].bones[j];
				var bmesh = boneMeshes[count];
				if(bmesh!=null){
					var bpos = new THREE.Vector3().fromArray(b.center());				
					var adjpos = bpos;	//might apply transforms, don't want to edit data
					bmesh.__dirtyRotation = true;
					bmesh.__dirtyPosition = true;
					bmesh.position.set( adjpos.x, adjpos.y, adjpos.z);
				}
				// You may also want to cancel the object's velocity
				//bmesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
				//bmesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
				count = count +1;
			}
		}
	}


	function start_leap(){
		if(!leap_active){
			leapcontroller.connect();	//start sending data
			leapcontroller.on('frame', function(frame){	//setup a listener for whenever there is a new frame
				//all update code runs from here
				draw_hands(frame);	//update pos's of bonemesh

			});
			leap_active = true;
		}
	}
	this.addEventListener( 'triggerdown', start_leap() );
};

THREE.LeapController.prototype = Object.create( THREE.BasicController.prototype );
THREE.LeapController.prototype.constructor = THREE.LeapController;
