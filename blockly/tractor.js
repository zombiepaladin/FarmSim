

var Tractor = {};

var SystemCommands = [];

Tractor.HEIGHT = 450;
Tractor.WIDTH = 450;

Tractor.pid = 0;
Tractor.visible = true;

Tractor.init = function(){
	
	// Add to reserved word list: API, local variables in execution evironment
	// (execute) and the infinite loop detection function.
	Blockly.JavaScript.addReservedWords('Tractor,code');
	
	Tractor.ctxDisplay = document.getElementById('displayCanvas').getContext('2d');
	Tractor.ctxScratch = document.getElementById('scratchCanvas').getContext('2d');
	Tractor.reset();
};

window.addEventListener('load',Tractor.init);

Tractor.reset = function() {
	
	// reset the tractor
	Tractor.x = Tractor.WIDTH / 2;
	Tractor.y = Tractor.HEIGHT / 2;
	Tractor.heading = 0;
	Tractor.penDownValue = true;
	Tractor.visible = true;
	
	// reset the canvas context
	Tractor.ctxScratch.canvas.width = Tractor.ctxDisplay.canvas.width;
	Tractor.ctxScratch.strokeStyle = '#00000000';
	Tractor.ctxScratch.fillStyle = '#00000000';
	Tractor.ctxScratch.lineWidth = 1;
	Tractor.ctxScratch.lineCap = 'round';
	Tractor.ctxScratch.font = 'normal 18pt Arial';
	Tractor.display();
	
	if( Tractor.pid) {
		window.clearTimeout( Tractor.pid );
	}
	Tractor.pid = 0;
};

Tractor.display = function() {

	Tractor.ctxDisplay.globalCompositeOperation = 'copy';
	Tractor.ctxDisplay.drawImage(Tractor.ctxScratch.canvas, 0, 0);
	Tractor.ctxDisplay.globalCompositeOperation = 'source-over';
	
	if( Tractor.visible) {
	
		Tractor.ctxDisplay.strokeStyle = Tractor.ctxScratch.strokeStyle;
		Tractor.ctxDisplay.fillStyle = Tractor.ctxScratch.fillStyle;
		
		// draw the tractor here.
		// possibly have a js class that draws different types of tractors 
		// and have a switch case here that would call the correct draw 
		// tractor function from that class.
		Tractor.ctxDisplay.strokeRect( Tractor.x, Tractor.y, 15, 15);
		
		
	}
	
};

Tractor.execute = function() {
	/*var code = Blockly.JavaScript.worspaceToCode();
	try{
		eval(code);
	} catch(e) {
	
		if( e !== Infinity){
			alert(e);
		}
	}*/
	
	//Tractor.reset();
	Tractor.pid = window.setTimeout( Tractor.animate, 100);
	
};

Tractor.animate = function() {
	Tractor.pid = 0;
	
	var action = SystemCommands.shift();
	
	if( !action) return;
	
	var command = action.shift();
	Tractor.step( command, action);
	Tractor.display();
	
	Tractor.pid = window.setTimeout(Tractor.animate, 100);
};

Tractor.step = function( command, values){
	
	switch( command)
	{
		case 'moveforward':
			if( Tractor.penDownValue ){
				Tractor.ctxScratch.beginPath();
				Tractor.ctxScratch.moveTo(Tractor.x, Tractor.y);
			}
			var dist = values[0];
			if( dist ){
				Tractor.x += dist*Math.sin( 2*Math.PI*Tractor.heading / 360 );
				Tractor.y -= dist*Math.cos( 2*Math.PI*Tractor.heading / 360 );
				var bump = 0;
			} else{
				var bump = 0.1;
			}
			if ( Tractor.penDownValue ) {
				Tractor.ctxScratch.lineTo(Tractor.x, Tractor.y);// + bump);
				Tractor.ctxScratch.stroke();
			}
		break;

		case 'moveto':
			var xpos = values[0];
			var ypos = values[1];
			Tractor.x = xpos;
			Tractor.y = ypos;
		break;
		case 'turnright':
			Tractor.heading += values[0];
			Tractor.heading %= 360;
			if( Tractor.heading < 0){
				Tractor.heading += 360;
			}
		break;
		
		
		
	}
};

// tractor actions

Tractor.moveForward = function( distance, id) { // use ide for highlighting the block that is being executed
	SystemCommands.push(['moveforward', distance]);
};

Tractor.moveBackward = function(distance, id){
	SystemCommands.push(['moveforward', -distance]);
};

Tractor.moveTo = function( xpos, ypos, id) {
	SystemCommands.push(['moveto', xpos,ypos]);
};
Tractor.turnRight = function(angle, id){
	SystemCommands.push(['turnright', angle]);
};
Tractor.turnleft = function( angle, id) {
	SystemCommands.push(['turnright', -angle]);
};
