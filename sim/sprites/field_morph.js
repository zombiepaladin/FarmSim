//fields.js


var FieldMorph;
var FieldNodeMorph;

FieldNodeMorph.prototype = new Morph();
FieldNodeMorph.prototype.constructor = new Morph();
FieldNodeMorph.uber =  Morph.prototype;

FieldNodeMorph.innerRadius = 5;  
FieldNodeMorph.outerRadius = 10;

function FieldNodeMorph(point, nextNode, globals) {
	this.init(point, nextNode, globals);
};

FieldNodeMorph.prototype.init = function (point, nextNode, globals) {
	
	this.x = point.x;
	this.y = point.y;
	this.next = nextNode;
	
	FieldNodeMorph.uber.init.call( this, globals );
	
	this.innerRadius = 5;
	this.outerRadius = 10;
	
	this.color = new Color( 0, 0, 0);
};


FieldNodeMorph.prototype.drawNode = function( context ) {
	

	context.fillstyle = new Color( 0,0,0);
	context.moveTo( this.x + this.innerRadius, this.y );
	context.arc( this.x, this.y, this.innerRadius, 0, Math.PI*2, true);
	context.moveTo( this.x + this.outerRadius, this.y );
	context.arc( this.x, this.y, this.outerRadius, 0, Math.PI*2, true);
	context.moveTo( this.x, this.y );
	
	if( this.next ){
		context.lineTo( this.next.x, this.next.y );
		this.next.drawNode( context );
	}
};

FieldNodeMorph.prototype.NodeWasClicked = function( x_click, y_click ) {
	
	var dx = Math.abs( x_click - this.x);
	var dy = Math.abs( y_click - this.y);
	
	var test = Math.sqrt( dx*dx + dy*dy);
	
	 return (test <= this.outerRadius ) ? true : false;
};

FieldNodeMorph.prototype.drawNew = function() {

};


FieldMorph.prototype = new Morph();
FieldMorph.prototype.constructor = Morph;
FieldMorph.uber = Morph.prototype;

// FieldMorph instance creation

FieldMorph.prototype.start = null;
FieldMorph.prototype.state = "idle";
FieldMorph.prototype.selectedNode = null;

function FieldMorph(globals) {
    this.init(globals);
};

FieldMorph.prototype.init = function (globals) {

	
	var c1 = new FieldNodeMorph( new Point( 50, 50), this.start);
	var c2 = new FieldNodeMorph( new Point( 150, 50), c1);
	var c3 = new FieldNodeMorph( new Point( 150, 150), c2);
	var c4 = new FieldNodeMorph( new Point( 50, 150), c3);
	this.boundary = [c4, c3, c2, c1];

		
    FieldMorph.uber.init.call(this, globals);
	
	this.color = new Color( 255, 0, 0 );
	
};

FieldMorph.prototype.drawNew = function (context) {
	
	// need context.
	
	FieldMorph.uber.drawNew.call(this);
	
	var context = this.image.getContext('2d');
	context.lineWidth = 2;

	this.boundary[0].drawNode( context );
	
	context.lineTo( this.boundary[0].x, this.boundary[0].y );
	
	context.stroke(); // just line
	
	
};

FieldMorph.prototype.fixLayout = function() {

//this.drawNew()
}

FieldMorph.prototype.mouseDownLeft = function(pos) {
	
	var myself = this;
	switch( this.state)
	{
		case "idle":			
			this.boundary.forEach( function( node ) {
				
				if( node.NodeWasClicked( pos.x - myself.bounds.origin.x, pos.y - myself.bounds.origin.y ) ) 
				{
					selectedNode = node;
					myself.state = "dragging";
				}
				/*
				else if( node.LineWasClicked( pos.x - myself.bounds.origin.x, pos.y - myself.bounds.origin.y ) )
				{
					// create new node
					// newNode = addNode(x,y)
					// slectedNode = newNode;
					// myself.state = "dragging"
				}
				*/
			});
			
			/* 
			if( FieldWasClicked(  pos.x - myself.bounds.origin.x, pos.y - myself.bounds.origin.y ) )
			{
				
			}
			*/
			
			var idle;
			break;
		case "dragging":
		case "moving":
		this.state = "idle";
		var drag, 
			move;
		break;
	
	}
};

FieldMorph.prototype.mouseMove = function(pos) {
	
	
	switch( this.state )
	{
		case "idle":
			// doing nothing.
			var idle;
		break;
		
		case "dragging":
			// dragging a node around
			var drag;
		break;
		
		case "moving":
			// moving the whole field
			var move;
		break;
		
		
	}


}



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

