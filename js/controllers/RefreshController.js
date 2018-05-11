/**
 * @author quinnciccoretti
 * @class RefreshController
 * Reloads everything from start
 */
THREE.RefreshController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#000000", "Refresh");
	
	/**
	* Reload the page from cache
	*/
	function onTriggerDown(){
		location.reload();
		this.pulse(1,100);
	}
	/**
	* Reload the page from the server
	*/
	function onGripsDown(){
	    //true reloads from server
		location.reload(true);
		this.pulse(1,100);
	}

	
	
	this.addEventListener( 'triggerdown', onTriggerDown );
	this.addEventListener( 'gripsdown', onGripsDown );
};

THREE.RefreshController.prototype = Object.create( THREE.BasicController.prototype );
THREE.RefreshController.prototype.constructor = THREE.RefreshController;
