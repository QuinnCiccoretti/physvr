var uifont;
/**
 * Loads a font. Note this is async and must load completely
 * before creating text from the font
 */
function init_font_loader(){
	var loader = new THREE.FontLoader();
	var geometry;
	loader.load( 'res/VT323_Regular.json', function ( font ) {
		//font is loaded
		uifont = font;
		create_HUD();
		return uifont;
	});
	
}
/**
 * @param uicolor the color of the material
 * @returns a mesh with a certain color and a text geometry
 */
function create_text_mesh(text, textsize = 0.05, uicolor = "#000000"){
	var text_geometry = create_text_geometry(text, textsize);
	var text_material = new THREE.MeshBasicMaterial({color: uicolor});
	var text_mesh = new THREE.Mesh( text_geometry, text_material);
	
	return text_mesh;
}
/**
 * @returns text geometry with given size
 */
function create_text_geometry(text, textsize){
	var text_geom = new THREE.TextGeometry( text, {
		font: uifont,	//the already loaded font
		size: textsize,
		height: 0.01,
		curveSegments: 2,
		bevelEnabled: false,
	} );
	return text_geom;
}
/**
 * WORK IN PROGRESS
 */
function create_HUD(){
	var text1 = create_text_mesh("physvr", 0.05, "#ff0000");
	text1.rotation.x = 3.14/6;
	camera.add(text1);
	text1.position.set(0.1, 0.25, -0.4);
}