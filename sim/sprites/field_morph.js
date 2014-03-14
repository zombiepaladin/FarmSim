//fields.js


var FieldMorph;
var FieldNodeMorph;

FieldNodeMorph.prototype = new Morph();
FieldNodeMorph.prototype.constructor = new Morph();
FieldNodeMorph.uber =  Morph.prototype;

FieldNodeMorph.prototype.innerRadius = 5;  
FieldNodeMorph.prototype.outerRadius = 10;
FieldNodeMorph.prototype.border = 2;

function FieldNodeMorph(point, globals) {
	this.init(point, globals);
};

FieldNodeMorph.prototype.init = function (point, globals) {
	
	this.x = point.x;
	this.y = point.y;
	
	FieldNodeMorph.uber.init.call( this, globals );
	
	this.innerRadius = 5;
	this.outerRadius = 10;
	this.linePoints = [];
	
	this.color = new Color( 0, 0, 0);
};


FieldNodeMorph.prototype.drawNode = function( context ) {
	

	context.fillstyle = new Color( 0,0,0);
	context.moveTo( this.x + this.innerRadius, this.y );
	context.arc( this.x, this.y, this.innerRadius, 0, Math.PI*2, true);
	context.moveTo( this.x + this.outerRadius, this.y );
	context.arc( this.x, this.y, this.outerRadius, 0, Math.PI*2, true);
	context.moveTo( this.x, this.y );
	
	
};

FieldNodeMorph.prototype.nodeWasClicked = function( x_click, y_click ) {
	
	var dx = Math.abs( x_click - this.x);
	var dy = Math.abs( y_click - this.y);
	
	var test = Math.sqrt( dx*dx + dy*dy);
	
	 return (test <= this.outerRadius ) ? true : false;
};


FieldNodeMorph.prototype.lineWasClicked = function( x_click, y_click, nextNode) {
	
	var myself = this;
	var startPoint = new Point( this.x, this.y);
	var endPoint = new Point( nextNode.x, nextNode.y);
	var clickPoint = new Point( x_click, y_click);
	
	var result = false;
	
	
	Magnitude = function( Point ) {
		var mag = Math.sqrt(Point.x * Point.x + Point.y * Point.y);
		return mag;
	};
	
	DotProd = function( point1, point2 ) {
		var dot = (point1.x * point2.x) + (point1.y * point2.y);
		return dot;
	};
	
	Angle = function( point1, point2 ) {
		
		return Math.acos( DotProd(point1,point2) / ( Magnitude(point1) * Magnitude(point2) ) );
		
	};
		
	ProjDistance = function( sPoint, ePoint, cPoint ){
		
		return Math.abs(   (sPoint.y - ePoint.y)*cPoint.x 
		                 - (sPoint.x - ePoint.x)*cPoint.y
                         + (sPoint.x * ePoint.y)
                         - (sPoint.y * ePoint.x) ) /
						 Math.sqrt( (sPoint.x - ePoint.x)*(sPoint.x - ePoint.x) 
						          + (sPoint.y - ePoint.y)*(sPoint.y - ePoint.y) );
	};
	
	if( ProjDistance( startPoint, endPoint, clickPoint ) < 5 )
	{
		if( Angle( startPoint, clickPoint) < Math.PI/2 &&  Angle( endPoint, clickPoint) < Math.PI/2 )
		{
			if( Magnitude( new Point( startPoint.x - clickPoint.x, startPoint.y - clickPoint.y)) < Magnitude( new Point( startPoint.x - endPoint.x, startPoint.y, endPoint.y ) ) ) 
			{
				result = true;
			}
		}
	}
	
	
	return result;
	
};


FieldNodeMorph.prototype.drawNew = function() {

};


FieldMorph.prototype = new StageMorph();
FieldMorph.prototype.constructor = StageMorph;
FieldMorph.uber = StageMorph.prototype;

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
	var myself = this,
		nextNode;
	
	FieldMorph.uber.drawNew.call(this);
	
	var context = this.image.getContext('2d');
	context.lineWidth = 2;
	
	
	this.boundary.forEach( function(node, i, nodes){
	
		nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
		
		node.drawNode( context );
	
		context.lineTo( nextNode.x, nextNode.y );
	
	});
	
	context.stroke(); // just line
	
	
};

FieldMorph.prototype.fixLayout = function() {

}

FieldMorph.prototype.refresh = function() {
	var myself = this;
	myself.hide();
	myself.drawNew();
	myself.show();
};

FieldMorph.prototype.fieldWasClicked = function() {
	
	
	
	
	
};

FieldMorph.prototype.mouseDownLeft = function(pos) {
	
	var myself = this;
	var x_click = pos.x - myself.bounds.origin.x;
	var y_click = pos.y - myself.bounds.origin.y;
	var exit = false;
	switch( this.state)
	{
		case "idle":		
			for( var i = 0; i < myself.boundary.length; i++)
			{
				if( myself.boundary[i].nodeWasClicked( x_click, y_click ) )
				{
					myself.selectedNode = myself.boundary[i];
					myself.state = "dragging";
					exit = true;
					break;
				}
			}
			if( !exit)
			{
			
				myself.boundary.forEach( function(node, i, nodes) {
					var newNode,
						nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1];
					
					if(!exit && node.lineWasClicked(x_click, y_click, nextNode)) {
						newNode = new FieldNodeMorph( new Point( x_click, y_click), nextNode);
						myself.boundary.splice( i + 1, 0, newNode);
						myself.selectedNode = newNode;
						myself.state = "dragging";
						exit = true;
					}
				});
				
				
			}
			/* 
			if( FieldWasClicked(  x_click, y_click ) )
			{
				
			}
			*/
			
			break;
		case "dragging":
		case "moving":
			this.state = "idle";
			break;
	
	}
};

FieldMorph.prototype.mouseMove = function(pos) {
	
	var myself = this;
	var x = (pos.x - myself.bounds.origin.x);
	var y = (pos.y - myself.bounds.origin.y);
	
	switch( this.state )
	{
		case "idle":
			// doing nothing.
		break;
		
		case "dragging":
			// dragging a node around
			myself.selectedNode.x = pos.x - myself.bounds.origin.x;
			myself.selectedNode.y = pos.y - myself.bounds.origin.y;
			myself.refresh();
		break;
		
		case "moving":
			// moving the whole field
		break;
		
		
	}


}

FieldMorph.prototype.mouseClickLeft = function( pos ) {
	
	switch( this.state )
	{
		case "idle":
		break;
		case "dragging":
			this.state = "idle";
		break;
		case "moving":
			this.state = "idle";
		break;
		
	}
	
	
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

