//fields.js


var FieldMorph;
var FieldNodeMorph;

FieldNodeMorph.prototype = new Morph();
FieldNodeMorph.prototype.constructor = new Morph();
FieldNodeMorph.uber =  Morph.prototype;

FieldNodeMorph.prototype.innerRadius = 5;  
FieldNodeMorph.prototype.outerRadius = 10;
FieldNodeMorph.prototype.border = 2;

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

FieldNodeMorph.prototype.nodeWasClicked = function( x_click, y_click ) {
	
	var dx = Math.abs( x_click - this.x);
	var dy = Math.abs( y_click - this.y);
	
	var test = Math.sqrt( dx*dx + dy*dy);
	
	 return (test <= this.outerRadius ) ? true : false;
};

FieldNodeMorph.prototype.lineWasClicked1 = function( x_click, y_click, nextNode) {
	
	var startPoint = new Point(this.x, this.y),
		queryPoint = new Point( x_click, y_click),
		endPoint = new Point( nextNode.x, nextNode.y);

	// check that the cross product is not zero
	var crossproduct = (queryPoint.y - startPoint.y) * (endPoint.x - startPoint.x) - ( queryPoint.x - startPoint.x) * ( endPoint.y - startPoint.y);	
	if( Math.abs(crossproduct) > 0.000000000000000111)  return false; // it is not greater than epsilon for double precesion.		
	
	// check that the dot product is positive
	var dotproduct = (queryPoint.y - startPoint.y) * (endPoint.x - startPoint.x) + (queryPoint.x - startPoint.x) * (endPoint.y - startPoint.y);
	if( dotproduct < 0)  return false;

	// check that the dot product is less than the squared distance between start to finish
	var squareLen = ( endPoint.x - startPoint.x) * 	( endPoint.x - startPoint.x) + ( endPoint.y - startPoint.y) *( endPoint.y - startPoint.y) 
	if( dotproduct > squareLen )  return false;

	return true;
};

FieldNodeMorph.prototype.lineWasClicked2 = function( x_click, y_click, nextNode) {
	
	var m, 
		b, 
		test, 
	    dist1, 
		dist2, 
		distTotal;
	
	for( i = -20; i < 20; i++)
	{
		m = ( nextNode.y - this.y )/ ( nextNode.x - (this.x+i) );
		b = this.y/(m*(this.x+i));
		test = m*x_click + b;
	
		dist1 = Math.sqrt( ( x_click - (this.x+i))*( x_click - (this.x+i)) + ( y_click - this.y)*( y_click - this.y) );
		dist2 = Math.sqrt( ( nextNode.x - x_click )*( nextNode.x - x_click ) + ( nextNode.y - y_click )*( nextNode.y - y_click ) );
		distTotal = Math.sqrt( (nextNode.x - (this.x+i)) * (nextNode.x - (this.x+i)) + (nextNode.y - this.y) * (nextNode.y - this.y) );
		if( Math.abs(distTotal - dist1 - dist2) > 0.000000000000001) continue;
	
		if( (test - y_click) > 0.0000000000000001) continue;
	
		return true;
	}
	return false
	
};

FieldNodeMorph.prototype.lineWasClicked = function( x_click, y_click, nextNode) {
	
	
	for( var i = x_click - 10; i < x_click + 10; i++)
	{
		for( var j = y_click - 10; j < y_click + 10; j++)
		{
			if(this.lineWasClicked1( i,j,nextNode) ) {
				return true;
			}
			
			
		}
		
	}
	
	return false;
	
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
	var x_click = pos.x - myself.bounds.origin.x;
	var y_click = pos.y - myself.bounds.origin.y;
	var exit = false;
	switch( this.state)
	{
		case "idle":			
			this.boundary.forEach( function( node ) {
				
				if( !exit)
				{
					if( node.nodeWasClicked( x_click, y_click ) ) 
					{
						myself.selectedNode = node;
						myself.state = "dragging";
						console.log("dragging click");
						exit = true;
					}
					else if( node.lineWasClicked( x_click, y_click, (node.next) ? node.next : myself.boundary[0] ) )
					{
						console.log( "found true");
						// create new node
						myself.selectedNode = node;
						myself.addNode( x_click , y_click, (node.next) ? node.next : myself.boundary[0] )
						myself.slectedNode = node.next;
						myself.state = "dragging"
						myself.refresh();
						exit = true;
					}
				}
			});
			
			/* 
			if( FieldWasClicked(  pos.x - myself.bounds.origin.x, pos.y - myself.bounds.origin.y ) )
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

FieldMorph.prototype.refresh = function() {
	var myself = this;
	myself.hide();
	myself.drawNew();
	myself.show();
};

FieldMorph.prototype.addNode = function( x, y , next) {
	
	var myself = this;
	
	var newNode = new FieldNodeMorph( new Point( x,y), next);
	myself.selectedNode.next = newNode;
	myself.boundary.splice( myself.boundary.indexOf( myself.selectedNode ) + 1 , 0 , newNode);
	
	
};

FieldMorph.prototype.mouseMove = function(pos) {
	
	var myself = this;
	var x = (pos.x - myself.bounds.origin.x);
	var y = (pos.y - myself.bounds.origin.y);
	console.log(" mouse move x="+ x  + " y="+y );
	
	switch( this.state )
	{
		case "idle":
			// doing nothing.
		break;
		
		case "dragging":
			// dragging a node around
			myself.selectedNode.x = pos.x - myself.bounds.origin.x;
			myself.selectedNode.y = pos.y - myself.bounds.origin.y;
			console.log("dragging move x =" + myself.selectedNode.x + " y=" + myself.selectedNode.y);
			myself.refresh();
		break;
		
		case "moving":
			// moving the whole field
		break;
		
		
	}


}


FieldMorph.prototype.mouseClickLeft = function( pos ) {
	
	console.log( " mouseClickLeft x=" + pos.x + " y=" + pos.y);
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

