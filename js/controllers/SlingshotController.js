/**
 * @author quinnciccoretti
 * @class SlingshotController
 * Launches a ball from the controller
 */
class SlingshotController extends BasicController{
	constructor(id){
		super( id, "#ff0000", "Slingshot");
		//rays
		var geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );
		var line = new THREE.Line( geometry, new THREE.MeshBasicMaterial( { color: "#ff0000" } ) );
		line.name = 'line';
		line.scale.z = 0.5;
		this.add( line.clone() );
		this.addEventListener( 'triggerdown', this.onTriggerDown );
	}
	
	/**
	* Launches ball.
	*/
	onTriggerDown(){
		console.log("yacht");
		//a sphere to launch
		var sphere = new Physijs.SphereMesh(
			new THREE.SphereGeometry( 0.1, 12, 12 ),
			new THREE.MeshBasicMaterial({ color: 0xff0000 }),
			.5 //mass
		);
		var pos = this.position.add(user.position);
		//make vector that points in direction controller points
		var dir = this.get_pointing_vector();

		scene.add(sphere);
		sphere.position.set( pos.x, pos.y, pos.z );
    	sphere.__dirtyPosition = true;	//may be unneeded
		sphere.applyCentralImpulse(dir.multiplyScalar(10));
		this.pulse(1,100);
	}

	
	
	
}