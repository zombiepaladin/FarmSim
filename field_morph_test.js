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

// FarmNodeMorph /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FarmNodeMorph inherits from Morph:

FarmNodeMorph.prototype = new BoxMorph();
FarmNodeMorph.prototype.constructor = FarmNodeMorph;
FarmNodeMorph.uber =  BoxMorph.prototype;

// FarmNodeMorph global variables
FarmNodeMorph.prototype.diameter = 16;

function FarmNodeMorph( pos,farm, field, globals) {
	this.init( pos, farm, field, globals);
};

FarmNodeMorph.prototype.init = function ( pos, f, fieldP, globals) {
	this.farm = f;
	this.field = fieldP;
	this.location = pos;
	
	
	FarmNodeMorph.uber.init.call(this);
	
	// parameters
	this.edge = this.diameter/2;
	this.border = 1;
	
	this.setHeight( this.diameter );
	this.setWidth( this.diameter );
	this.setPosition( pos);
	
	this.isDraggable = true;
	this.setColor( new Color( 148,62,15 ) );
	
};

FarmNodeMorph.prototype.mouseDownLeft = function( pos ) {

	// start state machine for this node
	switch(this.farm.fieldState )
	{
		case "idle":
			this.farm.fieldState = "dragging";
			this.farm.selectedNode = this;
		break;
		case "dragging":
		case "moving":
			this.farm.fieldState = "idle";
			this.farm.selectedNode = null;
		break;
	}
	
};

FarmNodeMorph.prototype.mouseMove = function(pos) {
	
	// implement state machine dragging and moving here
	switch( this.farm.fieldState )
	{
		case "idle":
		
		break;
		
		case "dragging":
			this.setPosition(new Point( pos.x - this.diameter/2, pos.y - this.diameter/2 ));
			this.farm.refresh();
			
		break;
		
		case "moving":
		break;
	}
	
};

FarmNodeMorph.prototype.mouseClickLeft = function(pos) {
	
	switch( this.farm.fieldState )
	{
		case "idle":
		case "dragging":
		case "moving":
		this.farm.fieldState = "idle";
		this.farm.selectedNode = null;
		break;
	}

};

FarmNodeMorph.prototype.userMenu = function( pos ) {
	
	var myself = this,
		menu = new MenuMorph(this);
		
		menu.addItem("Delete Node", 
		function() {
			myself.farm.selectedNode = myself;
			myself.farm.removeNode(myself.field, myself);
		},
		"Removes the node");

	return menu;
};

// FarmMorph /////////////////////////////////////////////////////////

// I am FarmSim's field corner

// FarmMorph inherits from StageMorph:

FarmMorph.prototype = new BoxMorph();
FarmMorph.prototype.constructor = FarmMorph;
FarmMorph.uber = BoxMorph.prototype;

// FarmMorph global variables


function FarmMorph(globals) {
    this.init(globals);
};

FarmMorph.prototype.init = function ( globals) {
		
	var myself = this;
	
	FarmMorph.uber.init.call(this);
	
	this.fieldState = "idle";
	this.selectedNode = null;
	this.selectedField = null;
	this.lastClickPos = new Point( 0,0);
	
	this.startx = 50;
	this.starty = 50;
	this.h = 100;
	this.w = 100;
	
	this.offsetx = 35;
	this.offsety = 35;
	
	this.fields = [];
	
	this.addField( 50  + this.offsetx,
	               50  + this.offsety,
				   100 + this.offsety,
				   100 + this.offsetx);
	//this.reset();
	
	this.edge = 0;
    this.border = 2;
	this.color =  new Color( 204,204,120 );
	
};


FarmMorph.prototype.mouseDownLeft = function( pos ) {
	
	var myself = this,
		exit = false;
	
	switch( this.fieldState )
	{
		case "idle" :
		
			myself.fields.forEach( function ( field, f, fields) {
				
				// check for line click.
				if(!exit) {				
					field.boundary.forEach( function ( node, i , nodes ) {
						var newNode,
							nextNode = ( nodes[i+1] ) ? nodes[ i+1] : nodes[0];
						
						if( !exit && myself.lineWasClicked( node.position(), nextNode.position(), pos) )
						{
						
							newNode = new FarmNodeMorph( pos.add( new Point(-node.diameter/2, -node.diameter/2) ), myself, field ); // pass in FarmFieldMorph as parameter
							
							field.boundary.splice( i + 1, 0, newNode);
							myself.selectedNode = newNode;
							
							myself.add( newNode);
							
							myself.fieldState = "dragging";
							myself.refresh();
							exit = true;
						}

					});
				}
			});
			// check for click inside.
			myself.fields.forEach( function ( field, f, fields) {
			
				if( !exit && myself.fieldWasClicked(field.boundary, pos))
				{	
					myself.fieldState = "moving";
					myself.lastClickPos = pos;
					myself.selectedField = field;
					exit = true;
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
		this.selectedNode = null;
		this.selectedField = null;
		break;
		
		case "dragging":
			if( this.selectedNode )
			{
				this.selectedNode.setPosition( new Point( pos.x - this.selectedNode.diameter/2, pos.y - this.selectedNode.diameter/2 ) );
				this.refresh();
			}
			
		break;
		
		case "moving" :
			
			var diff = new Point(pos.x - this.lastClickPos.x, pos.y - this.lastClickPos.y) ;
			
			if( this.selectedField)
			{
				this.selectedField.boundary.forEach( function( node, i , nodes) {
					
					node.setPosition( node.position().add( diff ) );  // new Point( node.position().x + diffx , node.position().y + diffy ) );
					
				});
			}	
			
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

FarmMorph.prototype.lineWasClicked = function( startPoint, endPoint, clickPoint) {
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

FarmMorph.prototype.fieldWasClicked = function(points, clickPoint) {
	
	var myself = this,
		result = false,
		nextNode;
		
		points.forEach( function( node, i, nodes ) {
		
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


FarmMorph.prototype.reset = function() {
	
	var myself = this;
	
// destroy all fields and each field's respective boundary node.
	myself.fields.forEach( function(field, f, fields) {
		
		field.boundary.forEach( function( node, i, nodes) {
			
			node.destroy();
			
		});
		
	});
	this.fields = [];
	this.addField( 50  + this.offsetx,
	               50  + this.offsety,
				   100 + this.offsety,
				   100 + this.offsetx);
				   
	myself.refresh();
};

FarmMorph.prototype.refresh = function() {
	var myself = this;
	myself.hide();
	myself.drawNew();
	myself.show();
};

FarmMorph.prototype.addField = function(startx, starty, fieldHeight, fieldWidth) {
	
	var myself = this;
	
	var field = {};
	
	var n1 = new FarmNodeMorph(  new Point( startx,              starty               ), this, field );
	var n2 = new FarmNodeMorph(  new Point( startx + fieldWidth, starty               ), this, field );
	var n3 = new FarmNodeMorph(  new Point( startx + fieldWidth, starty + fieldHeight ), this, field );
	var n4 = new FarmNodeMorph(  new Point( startx,              starty + fieldHeight ), this, field );
	
	field.boundary = [ n1, n2, n3, n4 ];
	
	field.boundary.forEach( function (node, i , nodes ) {
		
		myself.add( node );
		
	});
	
	myself.fields.push( field );
	
	myself.refresh();
};

FarmMorph.prototype.removeField = function( field ){
	
	var myself = this;
	
	field.boundary.forEach( function( node, i, nodes ) {
		
		node.destroy();
		
	});

	myself.fields.splice( myself.fields.indexOf( field ), 1);
	
	myself.refresh();
};

FarmMorph.prototype.removeNode = function(field, nodeRemove) {
	
	var myself = this;
	var exit = false;
	
	if( field.boundary.indexOf( nodeRemove ) )
	{
		
		field.boundary.splice( field.boundary.indexOf( nodeRemove ), 1 );
		nodeRemove.destroy();
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

			if(!exit && myself.lineWasClicked( node.position(), nextNode.position(), mousePos )) {
				
				// create the new node
				newNode = new FarmNodeMorph( mousePos, myself, field);
				
				// insert new node
				field.boundary.splice( i + 1, 0, newNode);
				myself.selectedNode = newNode;
				myself.add( newNode );
				
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
		
		//////////////////////////////////
		// Click on node - > add new node option
		myself.fields.forEach( function (field, f, fields) {
			
			field.boundary.forEach( function ( node, i , nodes ) {
				var newNode,
					nextNode = ( nodes[i+1] ) ? nodes[ i+1] : nodes[0];
					
				if( !exit && myself.lineWasClicked( node.position(), nextNode.position(), mousePos) )
				{
					menu.addItem("Create corner",
					function() {
						myself.insertNode(mousePos);
					},
					"Adds a new corner to the fence.");
					exit = true;
				}
			});
		});
		exit = false;
		//////////////////////////////////
		// Click on area - > remove field option
		myself.fields.forEach( function ( field, f, fields) {
			
			if( !exit && myself.fieldWasClicked(field.boundary, mousePos))
			{	
				menu.addItem("Remove Field",
				function() {
					myself.removeField(field);
				},
				"Removes the field from the farm.");
				exit = true;
			}
		});
		
		
		//////////////////////////////////
		// Click outside area - > add new field option
		
		
		if( !exit ) //  if exit is true then we just found an area previously
		{	
			menu.addItem("Create Field",
			function() {
				myself.addField(mousePos.x, mousePos.y, 100, 100);
			},
			"Adds a new field to the farm.");
		}
		
		
		
		
		//////////////////////////////////
		// Click anywhere - > reset whole farm
		menu.addItem("Reset Farm",
		function() { 
			myself.reset(); 
		},
		' reset the screen to the\n original position' 
		);		
		
	return menu;
};

FarmMorph.prototype.drawNew = function ( ) {
	
	var myself = this;
	
		
	FarmMorph.uber.drawNew.call(this);
		
	if( this.fields  )
	{
		
		var context = this.image.getContext('2d');
		var offsetx = this.fields[0].boundary[0].diameter/2 - myself.position().x;
		var offsety = this.fields[0].boundary[0].diameter/2 - myself.position().y;
	
		
		context.lineWidth = 6;
		context.lineCap = "round";
		context.beginPath();
		
		this.fields.forEach( function(field, f, fields ) {
		
			context.moveTo( field.boundary[0].position().x + offsetx , field.boundary[0].position().y + offsety);
			
			field.boundary.forEach( function(node, i, nodes){
			
				nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
			
				context.lineTo( nextNode.position().x + offsetx, nextNode.position().y + offsety);
			
			});
		});

			
		context.fillStyle = new Color( 96, 79, 49 ).toString();
		context.fill();
		
		context.strokeStyle  =  new Color( 0, 0, 0 ).toString();
		context.stroke()		
	
		
		context.lineWidth = 4;
		context.beginPath();
		
		this.fields.forEach( function(field, f, fields ) {
			
			context.moveTo( field.boundary[0].position().x + offsetx , field.boundary[0].position().y + offsety);
			
			field.boundary.forEach( function(node, i, nodes){
			
				nextNode = (i === nodes.length - 1) ? nodes[0] : nodes[i+1]
			
				context.lineTo( nextNode.position().x + offsetx, nextNode.position().y + offsety);
			
			});
		});
		
		
		context.strokeStyle  =  new Color( 138, 69, 19 ).toString();
		context.stroke();
	
	}
	
	
};


