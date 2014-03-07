//fields.js


var FieldMorph;
var FieldCornerMorph;

FieldCornerMorph.prototype = new Morph();
FieldCornerMorph.prototype.constructor = new Morph();
FieldCornerMorph.uber =  Morph.prototype;

FieldCornerMorph.innerRadius = 5;  
FieldCornerMorph.outerRadius = 10;

function FieldCornerMorph(point, globals) {
	this.init(point, globals);
};

FieldCornerMorph.prototype.init = function (point, globals) {
	
	this.x = point.x;
	this.y = point.y;
	FieldCornerMorph.uber.init.call( this, globals );
	
	this.innerRadius = 5;
	this.outerRadius = 10;
	
	this.color = new Color( 0, 0, 0);
};


FieldCornerMorph.prototype.drawCorner = function( context ) {
	
	context.moveTo( this.x + this.innerRadius, this.y );
	context.arc( this.x, this.y, this.innerRadius, 0, Math.PI*2, true);
	context.moveTo( this.x + this.outerRadius, this.y );
	context.arc( this.x, this.y, this.outerRadius, 0, Math.PI*2, true);


};

FieldCornerMorph.prototype.drawNew = function() {

};


FieldMorph.prototype = new Morph();
FieldMorph.prototype.constructor = Morph;
FieldMorph.uber = Morph.prototype;

// FieldMorph instance creation

FieldMorph.prototype.Boundary = [ new FieldCornerMorph( new Point(50,   50), null ), 
                                  new FieldCornerMorph( new Point(150,  50), null ), 
								  new FieldCornerMorph( new Point(150, 150), null ), 
								  new FieldCornerMorph( new Point(50, 150), null ) ];

function FieldMorph(globals) {
    this.init(globals);
};

FieldMorph.prototype.init = function (globals) {

    FieldMorph.uber.init.call(this, globals);
	
	this.color = new Color( 255, 0, 0 );
	
};

FieldMorph.prototype.drawNew = function (context) {
	
	// need context.
	
	FieldMorph.uber.drawNew.call(this);
	
	var context = this.image.getContext('2d');
	
	context.beginPath();
	context.moveTo(this.Boundary[this.Boundary.length-1].x, this.Boundary[this.Boundary.length-1].y);
	
	this.Boundary.forEach( function(corner) {
		context.lineTo( corner.x, corner.y );
		
		corner.drawCorner( context );
		context.moveTo( corner.x, corner.y);
		
	});

	
	context.stroke(); // just line
	
	
};

FieldMorph.prototype.fixLayout = function() {

//this.drawNew()
}


FieldMorph.prototype.exportSprite = function () {

	var str = SimulatorMorph.prototype.serializer.serialize(this);
	
	window.open(str);

};




/*

The event process for the creating and dragging of a field is like a state machine with mouse clicks.
see document for state machine

event: mousedown
if( on point)
	state = dragging;
if( on line)
	create new point and add it to the field's boundary list
	state = dragging;
	
if( on inside)
	state = moving;
	
end event

event : mousemove
if( state === dragging)
	change point in the field's boundary list
	drawfield();
if( state === moving )
	foreach point in field's boundary list offset the value by input change dx, dy

end event

event: mousedown
if( state is dragging );
	state = idle;
	update boundary list of points
	drawfield();
end event
*/

