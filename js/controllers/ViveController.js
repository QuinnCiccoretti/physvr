/**
 * @author mrdoob / http://mrdoob.com
 * @author stewdio / http://stewd.io
 */

class ViveController extends THREE.Object3D{


	
	constructor(){
		super();
		var scope = this;
		var gamepad;
		var axes = [ 0, 0 ];
		this.thumbpadIsPressed = false;
		this.triggerIsPressed = false;
		this.gripsArePressed = false;
		this.menuIsPressed = false;
		this.matrixAutoUpdate = false;
		this.standingMatrix = new THREE.Matrix4();
	}
	/**
	* Iterate across gamepads as Vive Controllers may not be
	* in position 0 and 1.
	*/
	findGamepad( id ) {
		var gamepads = navigator.getGamepads && navigator.getGamepads();
		for ( var i = 0, j = 0; i < gamepads.length; i ++ ) {
			var gamepad = gamepads[ i ];
			if ( gamepad && ( gamepad.id === 'OpenVR Gamepad' || gamepad.id.startsWith( 'Oculus Touch' ) || gamepad.id.startsWith( 'Spatial Controller' ) ) ) {

				if ( j === this.id_) return gamepad;

				j ++;
			}
		}
	}

	


	getGamepad (){


		return this.gamepad;

	};


	getButtonState( button ) {


		if ( button === 'thumbpad' ) return this.thumbpadIsPressed;
		if ( button === 'trigger' ) return this.triggerIsPressed;
		if ( button === 'grips' ) return this.gripsArePressed;
		if ( button === 'menu' ) return this.menuIsPressed;

	};


	update (){
		var gamepad = this.gamepad;
		var scope = this.scope;
		gamepad = this.findGamepad( this.id_ );


		if ( gamepad !== undefined && gamepad.pose !== undefined ) {

			if ( gamepad.pose === null ) return; // No user action yet

			//  Position and orientation.

			var pose = gamepad.pose;

			if ( pose.position !== null ) scope.position.fromArray( pose.position );
			if ( pose.orientation !== null ) scope.quaternion.fromArray( pose.orientation );
			scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
			scope.matrix.premultiply( scope.standingMatrix );	
			scope.matrixWorldNeedsUpdate = true;
			scope.visible = true;

			//  Thumbpad and Buttons.

			if ( axes[ 0 ] !== gamepad.axes[ 0 ] || axes[ 1 ] !== gamepad.axes[ 1 ] ) {

				axes[ 0 ] = gamepad.axes[ 0 ]; //  X axis: -1 = Left, +1 = Right.
				axes[ 1 ] = gamepad.axes[ 1 ]; //  Y axis: -1 = Bottom, +1 = Top.
				scope.dispatchEvent( { type: 'axischanged', axes: axes } );

			}

			if ( thumbpadIsPressed !== gamepad.buttons[ 0 ].pressed ) {

				thumbpadIsPressed = gamepad.buttons[ 0 ].pressed;
				scope.dispatchEvent( { type: thumbpadIsPressed ? 'thumbpaddown' : 'thumbpadup', axes: axes } );

			}

			if ( triggerIsPressed !== gamepad.buttons[ 1 ].pressed ) {

				triggerIsPressed = gamepad.buttons[ 1 ].pressed;
				scope.dispatchEvent( { type: triggerIsPressed ? 'triggerdown' : 'triggerup' } );

			}

			if ( gripsArePressed !== gamepad.buttons[ 2 ].pressed ) {

				gripsArePressed = gamepad.buttons[ 2 ].pressed;
				scope.dispatchEvent( { type: gripsArePressed ? 'gripsdown' : 'gripsup' } );

			}

			if ( menuIsPressed !== gamepad.buttons[ 3 ].pressed ) {

				menuIsPressed = gamepad.buttons[ 3 ].pressed;
				scope.dispatchEvent( { type: menuIsPressed ? 'menudown' : 'menuup' } );

			}

		} else {

			// scope.visible = false;

		}

	};


}

