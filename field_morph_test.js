
// Global stuff ////////////////////////////////////////////////////////

modules.crops = '2014-March-18';

// Declarations////////////////////////////////////////////////////////
var FieldMorph2;
var FieldNodeMorph2;

// FieldNodeMorph2 /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FieldNodeMorph2 inherits from Morph:

FieldNodeMorph2.prototype = new BoxMorph();
FieldNodeMorph2.prototype.constructor = FieldNodeMorph2;
FieldNodeMorph2.uber =  BoxMorph.prototype;

// FieldNodeMorph global variables
FieldNodeMorph2.prototype.diameter = 16;

function FieldNodeMorph2( pos, field, globals) {
	this.init( pos, field, globals);
};

FieldNodeMorph2.prototype.init = function ( pos, f, globals) {
	
	this.field = f;
	
	FieldNodeMorph2.uber.init.call(this);
	
	// parameters
	this.edge = this.diameter/2;
	this.border = 1;
	
	this.setHeight( this.diameter );
	this.setWidth( this.diameter );
	this.setPosition( pos);
	
	this.isDraggable = true;
	this.setColor( new Color( 138, 69, 19 ) );
	
};

FieldNodeMorph2.prototype.mouseDownLeft = function( pos ) {

	// start state machine for this node
	switch(this.field.fieldState )
	{
		case "idle":
			this.field.fieldState = "dragging";
			this.field.selectedNode = this;
		break;
		case "dragging":
		case "moving":
			this.field.fieldState = "idle";
			this.field.selectedNode = null;
		break;
	}
	
};

FieldNodeMorph2.prototype.mouseMove = function(pos) {
	
	// implement state machine dragging and moving here
	switch( this.field.fieldState )
	{
		case "idle":
		
		break;
		
		case "dragging":
			this.setPosition(new Point( pos.x - this.diameter/2, pos.y - this.diameter/2 ));
			this.field.refresh();
			
		break;
		
		case "moving":
		break;
	}
	
};

FieldNodeMorph2.prototype.mouseClickLeft = function(pos) {
	
	switch( this.field.fieldState )
	{
		case "idle":
		case "dragging":
		case "moving":
		this.field.fieldState = "idle";
		this.field.selectedNode = null;
		break;
	}

};

FieldNodeMorph2.prototype.userMenu = function( pos ) {
	
	var myself = this,
		menu = new MenuMorph(this);
		
		menu.addItem("Remove Node", 
		function() {
			myself.field.selectedNode = myself;
			myself.field.removeNode();
		},
		"Removes the node");

	return menu;
};

// FieldMorph2 /////////////////////////////////////////////////////////

// I am FarmSim's field morph
// I allow the user to edit, define, and create the field sprites

// FieldMorph2 inherits from StageMorph:

FieldMorph2.prototype = new BoxMorph();
FieldMorph2.prototype.constructor = FieldMorph2;
FieldMorph2.uber = BoxMorph.prototype;

// FieldMorph2 global variables

function FieldMorph2(globals) {
    this.init(globals);
};

FieldMorph2.prototype.init = function ( globals) {
		
	var myself = this;
	
	FieldMorph2.uber.init.call(this);
	
	this.fieldState = "idle";
	this.selectedNode = null;
	this.lastClickPos = new Point( 0,0);
		
	this.startx = 25;
	this.starty = 25;
	this.h = 50;
	this.w  = 50;
	this.reset();
	
	this.edge = 0;
    this.border = 2;
	this.setColor( new Color(  102, 200, 10 ) );

};

// check if field line was clicked
// returns true if it was clicked
FieldMorph2.prototype.lineWasClicked = function( startPoint, endPoint, clickPoint ) {

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
	
	if( ProjDistance( startPoint, endPoint, clickPoint ) < 10 )
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

// check if inside the field was clicked and not the outside.
FieldMorph2.prototype.fieldWasClicked = function(clickPoint) {
	
	var myself = this,
		result = false,
		nextNode;
		
		myself.boundary.forEach( function( node, i, nodes ) {
		
			nextNode = ( i === nodes.length-1) ? nodes[0] : nodes[i+1];
			
			if(( node.position().y     < clickPoint.y && nextNode.position().y >  clickPoint.y ) ||
			   ( nextNode.position().y < clickPoint.y && node.position().y     >  clickPoint.y ) &&
			   ( node.position().x    <= clickPoint.x || nextNode.position().x <= clickPoint.x ) )
			  {
				if( (node.position().x +(clickPoint.y - node.position().y) / ( nextNode.position().y - node.position().y) * (nextNode.position().x - node.position().x)) < clickPoint.x )
				{
					result = !result;
				}
			  }
		});

		return result;	
};


FieldMorph2.prototype.mouseDownLeft = function( pos ) {
	
	var myself = this,
		exit = false;
	
	switch( this.fieldState )
	{
		case "idle" :
		
			// check for line click.
			myself.boundary.forEach( function ( node, i , nodes ) {
				var newNode,
				    nextNode = ( nodes[i+1] ) ? nodes[ i+1] : nodes[0];
				
				if( !exit && myself.lineWasClicked( node.position(), nextNode.position(), pos) )
				{
				
					newNode = new FieldNodeMorph2( pos.add( new Point(-node.diameter/2, -node.diameter/2) ), myself );
					
					myself.boundary.splice( i + 1, 0, newNode);
					myself.selectedNode = newNode;
					
					myself.add( newNode);
					
					myself.fieldState = "dragging";
					myself.refresh();
					exit = true;
				}

			});
			
			// check for click inside.
			if( !exit && myself.fieldWasClicked(pos))
			{	
				myself.fieldState = "moving";
				myself.lastClickPos = pos;
			}
			
			
		break;
		
		case "dragging":
		case "moving" :
			myself.fieldState = "idle";
		break;
		
	}
};

FieldMorph2.prototype.mouseMove = function(pos) {
	
	switch( this.fieldState )
	{
		case "idle" :
		break;
		
		case "dragging":
		
			this.selectedNode.setPosition( new Point( pos.x - this.selectedNode.diameter/2, pos.y - this.selectedNode.diameter/2 ) );
			this.refresh();
			
		break;
		
		case "moving" :
			
			var diff = new Point(pos.x - this.lastClickPos.x, pos.y - this.lastClickPos.y) ;
			
			this.boundary.forEach( function( node, i , nodes) {
				
				node.setPosition( node.position().add( diff ) );  // new Point( node.position().x + diffx , node.position().y + diffy ) );
				
			});
			
			this.refresh();
			this.lastClickPos = pos;
			
		break;
		
	}
}

FieldMorph2.prototype.mouseClickLeft = function(pos) {
	
	switch( this.fieldState )
	{	
		case "carrying":
		case "idle" :
		case "dragging":
		case "moving" :
			this.fieldState = "idle";
		break;	
	}	
};

// This function resets the field back to the original position
FieldMorph2.prototype.reset = function() {
	
	var myself = this;

	if( myself.boundary)
	{
		myself.boundary.forEach( function( node, i, nodes ) {
			
			if( node )
			{
				node.destroy();
			}
		});
	}
	
	var n1 = new FieldNodeMorph2(  new Point( this.startx,          this.starty          ), this );
	var n2 = new FieldNodeMorph2(  new Point( this.startx + this.w, this.starty          ), this );
	var n3 = new FieldNodeMorph2(  new Point( this.startx + this.w, this.starty + this.h ), this );
	var n4 = new FieldNodeMorph2(  new Point( this.startx,          this.starty + this.h ), this );
	
	this.boundary = [ n1, n2, n3, n4 ];
	
	this.boundary.forEach( function( node, i, nodes) {
		
		myself.add( node );
		
	});
	myself.refresh();

};

// this function re-draws the field.
FieldMorph2.prototype.refresh = function() {
	var myself = this;
	myself.hide();
	myself.drawNew();
	myself.show();
};

// this function removes the node the mouse it currently over.
FieldMorph2.prototype.removeNode = function() {
	
	var myself = this;
	if( myself.boundary.length > 3 )
	{
		myself.boundary.splice( myself.boundary.indexOf( myself.selectedNode ), 1 );
		
		if( myself.selectedNode)
		{
			myself.selectedNode.destroy();
		}
		myself.refresh();
	}
	
};

// this function inserts a new node at the position the mouse is at
FieldMorph2.prototype.insertNode = function(mousePos) {
	
	var myself = this;
	var exit = false;
	
	this.boundary.forEach( function(node, i , nodes) {
		var newNode,
			nextNode = ( nodes[i+1] ) ? nodes[i+1] : nodes[0];

		if(!exit && myself.lineWasClicked( node.position(), nextNode.position(), mousePos )) {
			
			// create the new node
			newNode = new FieldNodeMorph2( mousePos, myself);
			
			// insert new node
			myself.boundary.splice( i + 1, 0, newNode);
			myself.selectedNode = newNode;
			myself.add( newNode );
			
			// update state
			exit = true;
			myself.refresh();
		}
	});
};

FieldMorph2.prototype.userMenu = function( ) {
	
	var myself = this,
		menu = new MenuMorph(this);
		
		var world = this.root();
		var mousePos = world.hand.bounds.origin;

		var exit = false;
		
		myself.boundary.forEach( function ( node, i , nodes ) {
			var newNode,
			    nextNode = ( nodes[i+1] ) ? nodes[ i+1] : nodes[0];
				
			if( !exit && myself.lineWasClicked( node.position(), nextNode.position(), mousePos) )
			{
				menu.addItem("Insert Node",
				function() {
					myself.insertNode(mousePos);
				},
				"Adds a new node");
				exit = true;
			}
		});
		
		menu.addItem("Reset",
		function() { 
			myself.reset(); 
		},
		' reset the screen to the\n original position' 
		);		
		
	return menu;
};

FieldMorph2.prototype.drawNew = function ( ) {
	
	var myself = this;
		
		
	FieldMorph2.uber.drawNew.call(this);
		
	if( this.boundary )
	{
		var context = this.image.getContext('2d');
		var offset = this.boundary[0].diameter/2;
		
		// draw two lines over top of each other to give black boarder
		
		// draw thicker black line
		context.lineWidth = 6;
		context.beginPath();
		var start = new Point( this.boundary[0].left() + offset, this.boundary[0].top() + offset);
		context.moveTo(start.x, start.y);
		this.boundary.forEach( function(node, i, nodes){
		
			nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
			context.lineTo( nextNode.left() + offset, nextNode.top() + offset);
		
		});
		context.strokeStyle  =  new Color( 0, 0, 0 ).toString();
		context.stroke()
		
		// draw thiner brown line.
		context.lineWidth = 4;
		context.beginPath();
		context.moveTo( this.boundary[0].left() + offset, this.boundary[0].top() + offset);
		this.boundary.forEach( function(node, i, nodes){
		
			nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
			context.lineTo( nextNode.left() + offset, nextNode.top() + offset);
		
		});
		context.strokeStyle  =  new Color( 138, 69, 19 ).toString();
		context.stroke()
		
	}
	
	
};
