
function load_text_geometry(text){
	var loader = new THREE.FontLoader();
	var geometry;
	loader.load( 'res/VT323_Regular.json', function ( font ) {
		//font is loaded
		geometry = new THREE.TextGeometry( text, {
			font: font,
			size: 80,
			height: 5,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 10,
			bevelSize: 8,
			bevelSegments: 5
		} );
	} );
	return geometry;
}