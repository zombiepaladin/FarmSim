//fields.js


var FieldSpriteMorph;

FieldSpriteMorph.prototype = new SpriteMorph();
FieldSpriteMorph.prototype.constructor = FieldSpriteMorph;
FieldSpriteMorph.uber = SpriteMorph.prototype;

// FieldSpriteMorph instance creation

function FieldSpriteMorph(globals) {
    this.init(globals);
}

FieldSpriteMorph.prototype.init = function (globals) {

    FieldSpriteMorph.uber.init.call(this, globals);
	
	this.boundary = [ new Point(0,0), new Point(0,1), new Point(1,1), new Point(1,0) ];
	
	
	
	
    this.name = localize('Field');
};

FieldSpriteMorph.prototype.drawField = function (context) {
	
	// need context.
	/*	
	context.moveTo(this.boundary[0]);
	this.boundary.forEach( function(point) {
		convext.lineTo( point );
	});
	
	context.stroke(); // just line
	context.fill(); // fill in field color based on soil sprite.
	
	*/
};


FieldSpriteMorph.prototype.exportSprite = function () {

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

