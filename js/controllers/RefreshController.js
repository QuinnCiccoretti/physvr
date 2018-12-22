/**
 * @author quinnciccoretti
 * @class RefreshController
 * Reloads everything from start
 */
class RefreshController extends BasicController {
	constructor(id){
		super( id, "#000000", "Refresh");
		this.addEventListener( 'triggerdown', this.onTriggerDown );
		this.addEventListener( 'gripsdown', this.onGripsDown );
	}

	/**
	* Reload the page from cache
	*/
	onTriggerDown(){
		location.reload();
		this.pulse(1,100);
	}
	/**
	* Reload the page from the server
	*/
	onGripsDown(){
	    //true reloads from server
		location.reload(true);
		this.pulse(1,100);
	}

}