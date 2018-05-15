# physvr
### quinnciccoretti, TJHSST
## Framework for doing physics with WebVR and physijs
physvr provides the [BasicController](./js/controllers/BasicController.js) class, which is ready to use for physics in webvr. Several implementations are also included, in [js/controllers](./js/controllers).
### Requires:
- VR Headset with controllers (tested with [HTC Vive](https://www.vive.com) on Windows 10)
- WebVR compatible browser (tested with [Firefox Nightly](https://www.mozilla.org/en-US/firefox/)). See [WebVR's site](https://webvr.info/) for more info

### Documentation
- See [out/](https://physvr.herokuapp.com/out/) directory. Docs created by jsdoc3

### To run:
(Try the live demo of master at https://physvr.herokuapp.com)
1. Start a node server locally
   1. Ensure that node is installed properly with `node -v`
   2. Ensure that npm is installed properly with `npm -v`
   3. Run `npm install`. (The only true dependency is express, which statically serves the directory. The python method below will work without `npm install`)
   4. Run `node serve.js`
2. If you don't have node, you can use python
	- `python -m http.server 5000` python3
	- `python -m SimpleHTTPServer 5000` python2
3. Navigate to http://localhost:5000 on a [WebVR compatible browser](https://webvr.info/)
4. Hit "Start VR"
5. Use the menu button on your controller (above the touchpad on the Vive) to switch controller modes. Most modes perform an action when you press the trigger.

### Adding your own Controller class:
1. All controller modes are objects that extend the [BasicController](./js/controllers/BasicController.js) class. (This class in turn extends [ViveController](./js/controllers/ViveController.js), which is a lower level class that stores gamepad data and doesn't include physics support)
2. To add your own controller mode, create an object that extends the BasicController class (or copy an existing controller and modify the class name). I recommend you look at RefreshController (the very simplest controller) to figure out the javascript class syntax, which is a bit odd. Below is a sample:
```javascript
THREE.MyController = function ( id ) {
	
	THREE.BasicController.call( this, id, "#000000", "MyName");
	
	/**
	* Do something when the trigger is pulled
	*/
	function onTriggerDown(){
		console.log("trigger is down");
	}
	
	this.addEventListener( 'triggerdown', onTriggerDown );
};

THREE.MyController.prototype = Object.create( THREE.BasicController.prototype );
THREE.MyController.prototype.constructor = THREE.MyController;
```
3. Call:
	 - `ctrlr1list.append(new MyController(0));`	Adds to controller 0
	 - `ctrlr2list.append(new MyController(1));`	Adds to controller 1
	 - 0 and 1 are unique controller IDs, that correspond to `controller1` and `controller2` respectively.
	 - if you want a Controller Class to be available to only one controller, only append to one list.

## TO DO
 - [ ] Fix rotation of arrow on BowControllers
 - [x] Add multi-axis movement modes on MoveController
 - [x] Add CreatorController to add objects to the scene
 - [ ] Use VRStageParameters from WebVR api to create walls where they are in Vive Chaperone