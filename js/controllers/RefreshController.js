/**
 * @author quinnciccoretti
 * @class RefreshController
 * Launches a ball from the controller
 */
THREE.RefreshController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#000000", "Refresh");
	
	


	
	/**
	* Launches ball.
	*/
	function onTriggerDown(){
		location.reload();
		this.pulse(1,100);
	}

	
	
	this.addEventListener( 'triggerdown', onTriggerDown );
};

THREE.RefreshController.prototype = Object.create( THREE.BasicController.prototype );
THREE.RefreshController.prototype.constructor = THREE.RefreshController;
