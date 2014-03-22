/*
    fields.js
	
    a sumulation programming environment
    based on morphic.js, blocks.js, threads.js and objects.js
    inspired by Scratch and Snap!
	
	written by Byron Wheeler
	bwheel@ksu.edu
	
    Copyright (C) 2014 by Nathan Bean

    This file is part of FarmSim, built upon the Snap! libraries.

    FarmSim and Snap! are free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


    prerequisites:
    --------------
    needs blocks.js, threads.js, objects.js and morphic.js


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:

		FieldMorph
		FieldNodeMorph


    credits
    -------
	Jens Mönig contributed the bulk of the Snap! framework.
    Nathan Dinsmore contributed saving and loading of projects,
    ypr-Snap! project conversion and countless bugfixes
    Ian Reynolds contributed handling and visualization of sounds

*/

// Global stuff ////////////////////////////////////////////////////////

modules.crops = '2014-March-18';

// Declarations////////////////////////////////////////////////////////
var FieldMorph;
var FieldNodeMorph;

// FieldNodeMorph /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FieldNodeMorph inherits from Morph:

FieldNodeMorph.prototype = new Morph();
FieldNodeMorph.prototype.constructor = new Morph();
FieldNodeMorph.uber =  Morph.prototype;

// FieldNodeMorph global variables

FieldNodeMorph.prototype.innerRadius = 5;  
FieldNodeMorph.prototype.outerRadius = 10;
FieldNodeMorph.prototype.border = 2;

// FieldNodeMorph initialization

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
	
	
	context.lineWidth = 2;
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
 // we override parent (morph) draw new function so that we don't draw this wrong.
};



// FieldMorph /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FieldMorph inherits from StageMorph:

FieldMorph.prototype = new StageMorph();
FieldMorph.prototype.constructor = StageMorph;
FieldMorph.uber = StageMorph.prototype;

// FieldMorph global variables

FieldMorph.prototype.start = null;
FieldMorph.prototype.state = "idle";
FieldMorph.prototype.selectedNode = null;
FieldMorph.prototype.prevPos = new Point( 0,0);

// FieldNodeMorph initialization

function FieldMorph(globals) {
    this.init(globals);
};

FieldMorph.prototype.init = function (startx, starty, height, width, globals) {

	this.startX = (startx) ? startx : 50;
	this.startY = (starty) ? starty : 50;
	this.Width = (width) ? width : 100;
	this.Height = (height) ? height : 100;

	// set up the basic field
	var c1 = new FieldNodeMorph( new Point( this.startX,              this.startY),               this.start);
	var c2 = new FieldNodeMorph( new Point( this.startX + this.Width, this.startY),               c1);
	var c3 = new FieldNodeMorph( new Point( this.startX + this.Width, this.startY + this.Height), c2);
	var c4 = new FieldNodeMorph( new Point( this.startX,              this.startY + this.Height), c3);
	this.boundary = [c4, c3, c2, c1];

	
    FieldMorph.uber.init.call(this, globals);
	
	this.fixLayout();
};

FieldMorph.prototype.drawNew = function (context) {
	
	// need context.
	var myself = this,
		nextNode;
	
	FieldMorph.uber.drawNew.call(this);
	
	var context = this.image.getContext('2d');
	context.lineWidth = 4;
	
	
	this.boundary.forEach( function(node, i, nodes){
	
		nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
		
		node.drawNode( context );
	
		context.lineTo( nextNode.x, nextNode.y );
	
	});
	
	context.moveTo(0,0);
	context.lineTo( this.width(), 0);
	context.lineTo( this.width(), this.height() );
	context.lineTo( 0, this.height() );
	context.lineTo( 0,0);
	context.stroke(); // just line	
	
};

FieldMorph.prototype.fixLayout = function() {
	
};

FieldMorph.prototype.refresh = function() {
	var myself = this;
	myself.hide();
	myself.drawNew();
	myself.show();
};

FieldMorph.prototype.reset = function() {
	
	
	var c1 = new FieldNodeMorph( new Point( this.startX,              this.startY),               this.start);
	var c2 = new FieldNodeMorph( new Point( this.startX + this.Width, this.startY),               c1);
	var c3 = new FieldNodeMorph( new Point( this.startX + this.Width, this.startY + this.Height), c2);
	var c4 = new FieldNodeMorph( new Point( this.startX,              this.startY + this.Height), c3);
	this.boundary = [c4, c3, c2, c1];
	this.refresh();
	
	
};

FieldMorph.prototype.fieldWasClicked = function(x_click, y_click) {
	
	var myself = this,
		result = false,
		nextNode;
		
		myself.boundary.forEach( function( node, i, nodes ) {
			nextNode = ( i === nodes.length-1) ? nodes[0] : nodes[i+1];
			
			if(( node.y     < y_click && nextNode.y > y_click ) ||
			   ( nextNode.y < y_click && node.y     > y_click ) &&
			   ( node.x    <= x_click || nextNode.x <= x_click ) )
			  {
				if( (node.x +(y_click - node.y) / ( nextNode.y - node.y) * (nextNode.x - node.x)) < x_click )
				{
					result = !result;
				}
			  }
		});

		return result;	
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
						// create the new node
						newNode = new FieldNodeMorph( new Point( x_click, y_click), nextNode);
						
						// insert new node
						myself.boundary.splice( i + 1, 0, newNode);
						myself.selectedNode = newNode;
						
						// update state
						myself.state = "dragging";
						exit = true;
					}
				});
				
				 
				if( !exit &&  myself.fieldWasClicked(  x_click, y_click ) )
				{
					myself.state =  "moving";
					exit = true;
				}
				
			}
			
			break;
		case "dragging":
		case "moving":
			this.state = "idle";
			break;
	
	}
	myself.prevPos = new Point( x_click, y_click );
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
			myself.boundary.forEach( function(node) {
				
				node.x += (x - myself.prevPos.x);
				node.y += (y - myself.prevPos.y);
				myself.refresh();
			});
		break;
		
	}
	myself.prevPos = new Point( x, y );

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

FieldMorph.prototype.RclickX = 07;
FieldMorph.prototype.RclickY = 7;

FieldMorph.prototype.mouseClickRight = function(pos) {
	
	// recorde where the right click was clicked.
	this.RclickX = pos.x - this.bounds.origin.x;
	this.RclickY = pos.y - this.bounds.origin.y;

};

FieldMorph.prototype.insertNode = function() {
	
	var myself = this;
	var exit = false;
	
	this.boundary.forEach( function(node, i , nodes) {
		var newNode,
			nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1];

		if(!exit && node.lineWasClicked(myself.RclickX, myself.RclickY, nextNode)) {
			// create the new node
			newNode = new FieldNodeMorph( new Point( myself.RclickX, myself.RclickY), nextNode);
			
			// insert new node
			myself.boundary.splice( i + 1, 0, newNode);
			myself.selectedNode = newNode;
			
			// update state
			exit = true;
			myself.refresh();
		}
	});
};

FieldMorph.prototype.removeNode = function() {
	
	var myself = this;
	var exit = false;
	
	this.boundary.forEach( function(node, i , nodes) {
		
		if(  !exit && node.nodeWasClicked( myself.RclickX, myself.RclickY ) )
		{
			myself.boundary.splice( i,1);
			// myself.boundary.remove
			// something like these
			myself.refresh();
			exit = true;
		}
	});
	
	
};


FieldMorph.prototype.userMenu = function( pos ) {
	
	var myself = this,
		menu = new MenuMorph(this);
		
		menu.addItem("Insert Node",
		function() {
			myself.insertNode();
		},
		"Adds a new node");
		
		
		menu.addItem("Remove Node", 
		function() {
			myself.removeNode();
		},
		"Removes the node");
		
		
		menu.addItem("Reset",
		function() { 
			myself.reset(); 
		},
		' reset the screen to the\n original position' 
		);		
		
	return menu;
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

