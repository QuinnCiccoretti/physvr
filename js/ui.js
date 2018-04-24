var uifont;
function init_font_loader(){
	var loader = new THREE.FontLoader();
	var geometry;
	loader.load( 'res/VT323_Regular.json', function ( font ) {
		//font is loaded
		uifont = font;
		return uifont;
	});
	
}
function create_text_mesh(text, textsize = 0.05){
	var text_geometry = create_text_geometry(text, textsize);
	var text_material = new THREE.MeshBasicMaterial({color:"#000000"});
	var text_mesh = new THREE.Mesh( text_geometry, text_material);
	
	return text_mesh;
}
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