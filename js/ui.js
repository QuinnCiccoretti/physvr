var uifont;
function init_font_loader(){
	var loader = new THREE.FontLoader();
	var geometry;
	loader.load( 'res/VT323_Regular.json', function ( font ) {
		//font is loaded
		uifont = font;
		//
		console.log(uifont);
		
	});
}
function create_text_mesh(text){
	var text_geometry = create_text_geometry(text);
	var text_material = new THREE.MeshBasicMaterial({color:"#ff0000"});
	var text_mesh = new THREE.Mesh( text_geometry, text_material);
	//var text_scale = 1;
	//text_mesh.scale.set(text_scale,text_scale,text_scale);
	// text_mesh.rotation.z = 3.14;
	return text_mesh;
}
function create_text_geometry(text){
	var text_geom = new THREE.TextGeometry( text, {
		font: uifont,	//the already loaded font
		size: 0.05,
		height: 0.01,
		curveSegments: 2,
		bevelEnabled: false,
	} );
	return text_geom;
}