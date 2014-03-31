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

		FarmMorph
		FarmNodeMorph


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
var FarmMorph;
var FarmNodeMorph;
var FarmFieldMorph;

// FarmNodeMorph /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FarmNodeMorph inherits from Morph:

FarmNodeMorph.prototype = new BoxMorph();
FarmNodeMorph.prototype.constructor = FarmNodeMorph;
FarmNodeMorph.uber =  BoxMorph.prototype;

// FarmNodeMorph global variables
FarmNodeMorph.prototype.diameter = 16;

function FarmNodeMorph( pos, field, globals) {
	this.init( pos, field, globals);
};

FarmNodeMorph.prototype.init = function ( pos, f, globals) {
	
	this.field = f;
	
	FarmNodeMorph.uber.init.call(this);
	
	// parameters
	this.edge = this.diameter/2;
	this.border = 1;
	
	this.setHeight( this.diameter );
	this.setWidth( this.diameter );
	this.setPosition( pos);
	
	this.isDraggable = true;
	this.setColor( new Color( 138, 69, 19 ) );
	
};

FarmNodeMorph.prototype.mouseDownLeft = function( pos ) {

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

FarmNodeMorph.prototype.mouseMove = function(pos) {
	
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

FarmNodeMorph.prototype.mouseClickLeft = function(pos) {
	
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

FarmNodeMorph.prototype.userMenu = function( pos ) {
	
	var myself = this,
		menu = new MenuMorph(this);
		
		menu.addItem("Delete Node", 
		function() {
			myself.field.selectedNode = myself;
			myself.field.removeNode(myself.field.selectedNode);
		},
		"Removes the node");

	return menu;
};


// FarmFieldMorph /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FarmFieldMorph inherits from Morph:

FarmFieldMorph.prototype = new BoxMorph();
FarmFieldMorph.prototype.constructor = FarmFieldMorph;
FarmFieldMorph.uber = BoxMorph.prototype;

function FarmFieldMorph(sx, sy, h, w) {
	this.init( sx, sy, h, w);
};

FarmFieldMorph.prototype.init = function(startx, starty, fieldHeight, fieldWidth) {
	
	var myself = this;
	
	var n1 = new FarmNodeMorph(  new Point( this.startx,              this.starty               ), this );
	var n2 = new FarmNodeMorph(  new Point( this.startx + fieldWidth, this.starty               ), this );
	var n3 = new FarmNodeMorph(  new Point( this.startx + fieldWidth, this.starty + fieldHeight ), this );
	var n4 = new FarmNodeMorph(  new Point( this.startx,              this.starty + fieldHeight ), this );
	

	myself.boundary = [ n1, n2, n3, n4 ];
	
	myself.boundary.forEach( function (node, i , nodes ) {
		
		myself.add( node );
		
	});

};

FarmFieldMorph.prototype.lineWasClicked = function( startPoint, endPoint, clickPoint) {
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

FarmFieldMorph.prototype.fieldWasClicked = function(clickPoint) {
	
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

// FarmMorph /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FarmMorph inherits from StageMorph:

FarmMorph.prototype = new SpriteMorph();
FarmMorph.prototype.constructor = FarmMorph;
FarmMorph.uber = SpriteMorph.prototype;

// FarmMorph global variables


function FarmMorph(globals) {
    this.init(globals);
};

FarmMorph.prototype.init = function ( globals) {
		
	var myself = this;
	
	FarmMorph.uber.init.call(this);
	
	this.fieldState = "idle";
	this.selectedNode = null;
	this.lastClickPos = new Point( 0,0);
	
	this.startx = 50;
	this.starty = 50;
	this.h = 100;
	this.w = 100;
	
	this.offsetx = this.position.x;
	this.offsety = this.position.y;
	
	this.fields = [];
	
	this.addField( 50  + this.offsetx,
	               50  + this.offsety,
				   100 + this.offsety,
				   100 + this.offsetx);
	//this.reset();
	
	this.edge = 0;
    this.border = 2;
	this.color =  new Color(  102, 200, 10 );
	
	
};


FarmMorph.prototype.mouseDownLeft = function( pos ) {
	
	var myself = this,
		exit = false;
	
	switch( this.fieldState )
	{
		case "idle" :
		
			myself.fields.forEach( function ( field, f, fields) {
				
				// check for line click.
				field.boundary.forEach( function ( node, i , nodes ) {
					var newNode,
						nextNode = ( nodes[i+1] ) ? nodes[ i+1] : nodes[0];
					
					if( !exit && field.lineWasClicked( node.position(), nextNode.position(), pos) )
					{
					
						newNode = new FarmNodeMorph( pos.add( new Point(-node.diameter/2, -node.diameter/2) ), myself ); // pass in FarmFieldMorph as parameter
						
						field.boundary.splice( i + 1, 0, newNode);
						field.selectedNode = newNode;
						
						field.add( newNode);
						
						myself.fieldState = "dragging";
						myself.refresh();
						exit = true;
					}

				});
			});
			// check for click inside.
			myself.fields.forEach( function ( field, f, fields) {
			
				if( !exit && field.fieldWasClicked(pos))
				{	
					myself.fieldState = "moving";
					myself.lastClickPos = pos;
				}
			});
			
		break;
		
		case "dragging":
		case "moving" :
			myself.fieldState = "idle";
		break;
		
	}
};

FarmMorph.prototype.mouseMove = function(pos) {
	
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
			
			this.fields.forEach( function( field, f, fields) {
				if( field === selectedField)
				{
					field.boundary.forEach( function( node, i , nodes) {
						
						node.setPosition( node.position().add( diff ) );  // new Point( node.position().x + diffx , node.position().y + diffy ) );
						
					});
				}
			});
			this.refresh();
			this.lastClickPos = pos;
			
		break;
		
	}
}

FarmMorph.prototype.mouseClickLeft = function(pos) {
	
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

FarmMorph.prototype.reset = function() {
	
	var myself = this;
	
// destroy all fields and each field's respective boundary node.
	myself.fields.forEach( function(field, f, fields) {
		
		field.destroy();
		
	});
	
	myself.addField(  50  + this.offsetx,
	                  50  + this.offsety,
				      100 + this.offsety,
				      100 + this.offsetx );

};

FarmMorph.prototype.refresh = function() {
	var myself = this;
	myself.hide();
	myself.drawNew();
	myself.show();
};

FarmMorph.prototype.addField = function(startx, starty, fieldHeight, fieldWidth) {
	
	var myself = this;
	/*
	
	var n1 = new FarmNodeMorph(  new Point( this.startx + offsetx,              this.starty + offsety               ), this );
	var n2 = new FarmNodeMorph(  new Point( this.startx + offsetx + fieldWidth, this.starty + offsety               ), this );
	var n3 = new FarmNodeMorph(  new Point( this.startx + offsetx + fieldWidth, this.starty + offsety + fieldHeight ), this );
	var n4 = new FarmNodeMorph(  new Point( this.startx + offsetx,              this.starty + offsety + fieldHeight ), this );
	*/
	var field = new FarmFieldMorph(startx,starty,fieldHeight,fieldWidth);
	/*field.boundary = [ n1, n2, n3, n4 ];
	
	this.boundary.forEach( function (node, i , nodes ) {
		
		field.add( node );
		
	});
	*/
	myself.fields.push( field );
	
	//myself.add( field );
	
	myself.refresh();
};

FarmMorph.prototype.removeField = function( field ){
	
};

// TODO : check which field
FarmMorph.prototype.removeNode = function(field) {
	
	var myself = this;
	if( field.boundary.length > 3 )
	{
		field.boundary.splice( myself.boundary.indexOf( myself.selectedNode ), 1 );
		
		if( field.selectedNode)
		{
			field.selectedNode.destroy();
		}
		myself.refresh();
	}
	
};

FarmMorph.prototype.insertNode = function(mousePos) {
	
	var myself = this;
	var exit = false;
	
	myself.fields.forEach( function(field, f , fields ) {
	
		field.boundary.forEach( function(node, i , nodes) {
			var newNode,
				nextNode = ( nodes[i+1] ) ? nodes[i+1] : nodes[0];

			if(!exit && field.lineWasClicked( node.position(), nextNode.position(), mousePos )) {
				
				// create the new node
				newNode = new FarmNodeMorph( mousePos, myself);
				
				// insert new node
				field.boundary.splice( i + 1, 0, newNode);
				field.selectedNode = newNode;
				field.add( newNode );
				
				// update state
				exit = true;
				myself.refresh();
			}
		});
	});
};

FarmMorph.prototype.userMenu = function( ) {
	
	var myself = this,
		menu = new MenuMorph(this);
		
		var world = this.root();
		var mousePos = world.hand.bounds.origin;

		var exit = false;
		myself.fields.forEach( function (field, f, fields) {
			
			field.boundary.forEach( function ( node, i , nodes ) {
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
		});
		menu.addItem("Reset",
		function() { 
			myself.reset(); 
		},
		' reset the screen to the\n original position' 
		);		
		
	return menu;
};

FarmMorph.prototype.drawNew = function ( ) {
	
	var myself = this;
	
		
	PenMorph.uber.drawNew.call(this);
		
	if( this.boundary )
	{

		var context = this.image.getContext('2d');
		var offsetx = this.boundary[0].diameter/2 - myself.position().x;
		var offsety = this.boundary[0].diameter/2 - myself.position().y;
		
		context.lineWidth = 6;
		context.lineCap = "round";
		context.beginPath();
		
		context.moveTo( this.boundary[0].left() + offsetx , this.boundary[0].top() + offsety);
		this.fields.forEach( function(field, f, fields ) {
			
			field.boundary.forEach( function(node, i, nodes){
			
				nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
			
				context.lineTo( nextNode.left() + offsetx, nextNode.top() + offsety);
			
			});
		});
		context.strokeStyle  =  new Color( 0, 0, 0 ).toString();
		context.stroke()
		
		
		context.lineWidth = 4;
		context.beginPath();
		context.moveTo( this.boundary[0].left() + offsetx, this.boundary[0].top() + offsety);
		
		this.fields.forEach( function(field, f, fields ) {
			
			field.boundary.forEach( function(node, i, nodes){
			
				nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
			
				context.lineTo( nextNode.left() + offsetx, nextNode.top() + offsety);
			
			});
		});
		
		context.strokeStyle  =  new Color( 138, 69, 19 ).toString();
		context.stroke()
		
	}
	
	
};


