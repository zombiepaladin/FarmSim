/*
 * Author: Byron Wheeler
 *
 * Desc: This javascript file handles all the processing for the field editor in FarmSim
 * 
 * It requres that the mousedown, mousemove, mouseup, and contextmenu event listeners
 * call their respective functions in the farm object class. 
 * 
 *
 * 
 */



var Farm = {};
var Corner = {};
var scale = {x:1,y:1}; // scale variable

//////// corner object ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function creates the corner object for the field.
 *
 * Params:	N/A.
 *
 * Return: N/A.
 */
Corner = function( x, y,rad) {
	this.init(x,y,rad);
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function initializes the corner
 *
 * Params:	xpos - the x position of the corner node.
 * ypos - the y position of the corner node
 * rad - the radius of the corner node
 *
 * Return: N/A
 */
Corner.prototype.init = function( xpos, ypos, rad) {
	
	var myself = this;
	
	myself.x = xpos;
	myself.y = ypos;
	myself.radius = rad;

};

//////// conditional functions ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function processes the mouse click down event for the node.
 * It gets called by the doMouseDown from the Farm Object.
 *
 * Params:	xclick - the x position of the click event
 *  yclick - the y position of the click event.
 *
 * Return: True - the corner was clicked, false it was not clicked
 */
Corner.prototype.wasClicked = function( xclick, yclick ) {		
	var myself = this;
	var result = false;
	var difx = (xclick - myself.x);
	var dify = (yclick - myself.y);
	if( Math.pow( difx, 2) + Math.pow(dify, 2)  <= (myself.radius * myself.radius) ) {
		result = true;
	}	
	return result; 
};

//////// canvas update ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function displays the node. 
 *
 * Params:	ctx - The context to draw itself on.
 * farm - the farm object it is associated on, so as to know if 
 *        this node is the selected node and to draw appropiately. 
 * Return: N/A
 */
Corner.prototype.display = function( ctx, farm ) {
	
	
	if( this === farm.selectedNode ) {
		ctx.fillStyle = '#b2b200';
	}
	else {
		ctx.fillStyle = '#000000';
	}
	
	ctx.beginPath();
	ctx.moveTo( this.x, this.y);
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	ctx.fill();
	
	ctx.beginPath();
	ctx.fillStyle = '#F4A460';
	ctx.moveTo(this.x, this.y);
	ctx.arc(this.x, this.y, this.radius-2, 0, Math.PI*2, true);
	ctx.fill();
};


//////// farm object ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function is the constructor for the farm object
 *
 * Params:	N/A
 *
 * Return: The farm editor object.
 */
Farm = function(){
	this.init();
}

/*
 * Author: Byron Wheeler
 *
 * Desc: This function initializes all the properties of the farm
 *
 * Params:	N/A
 *
 * Return: N/A
 */
Farm.prototype.init = function(){
	
	var myself = this;
	
	
	myself.currentState = "idle";
	myself.selectedNode = null;
	myself.selectedField = null;
	
	myself.lastClickX = 0;
	myself.lastClickY = 0;
	
	myself.cornerRadius = 7;
	myself.startFieldX = 50;
	myself.startFieldY = 50;
	myself.defaultHeight = 50;
	myself.defaultWidth = 50;
	
	myself.farmCanvas = document.getElementById('displayCanvas');
	myself.farmContext = myself.farmCanvas.getContext('2d');
	
	myself.backgroundCanvas = document.getElementById('backgroundCanvas');
	myself.backgroundContext = myself.backgroundCanvas.getContext('2d');
	
	myself.topgroundCanvas = document.getElementById('topgroundCanvas');
	myself.topgroundContext = myself.topgroundCanvas.getContext('2d');
	
	myself.imageLoader = document.getElementById('imageLoader');
	myself.backgroundImage = null;
	myself.reset();
	
};

//////// event handlers ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function processes the mouse click down event on the canvas
 *
 * Params:	The event DOM from the html page.
 *
 * Return: N/A
 */
Farm.prototype.doMouseDown = function( event ) {
	
	var myself = this;
	var exit = false;
	
	var offsetx = event.offsetX/scale.x, 
	    offsety = event.offsetY/scale.y;
	
	myself.selectedNode = null;
	myself.selectedField = null;
	switch(myself.currentState)
	{
		case "idle":
			
			// check for click on corner node
			myself.fields.forEach( function(field, f, fs) {
			
				field.forEach( function(node, n, nodes) {
					
					if( !exit && node.wasClicked(offsetx, offsety) ) {
						
						myself.currentState = "dragging";
						myself.selectedNode = node;
						exit = true;
					}
				});
			});
			// check for click on line
			if( !exit) {
				myself.fields.forEach( function( field, f, fs) {
					field.forEach( function(node, n , nodes) {
						
						var nextNode = (nodes[n+1]) ? nodes[n+1] : nodes[0];
						var newNode;
						
						if (!exit && myself.lineWasClicked(node, nextNode,offsetx, offsety )) {
							
							newNode = new Corner( offsetx, offsety, myself.cornerRadius );
							field.splice( n+1, 0, newNode);                
							myself.selectedNode = newNode;             
							myself.currentState = "dragging";          
							exit = true;
							
						}
					});
				});
				// check for click in area
				if( !exit) {
					myself.fields.forEach( function( field, f, fs) {
						if( myself.fieldWasClicked( field, offsetx, offsety) ) {
							
							myself.currentState = "moving";
							myself.selectedField = field;
							myself.lastClickX = offsetx;
							myself.lastClickY = offsety;
							exit = true;
						}
					});
				}
			}
			
		break;
		case "dragging" :
		case "moving":
			myself.currentState = "idle";
		break;
	}
	
	myself.display();
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function processes the mouse move event on the canvas
 *
 * Params:	The event DOM from the html page.
 *
 * Return: N/A
 */
Farm.prototype.doMouseMove = function( event ) {
	
	var myself = this;
	var offsetx = event.offsetX/scale.x, 
	    offsety = event.offsetY/scale.y;
	switch(myself.currentState)
	{
		case "idle":
		break;
		case "dragging" :
			if( myself.selectedNode ) {
				myself.selectedNode.x = offsetx;
				myself.selectedNode.y = offsety;
				this.display();
			}
		break;
		case "moving":
			var diffx = offsetx - myself.lastClickX;
			var diffy = offsety - myself.lastClickY;
			
			myself.selectedField.forEach( function (node, n, nodes) {
				node.x += diffx;
				node.y += diffy;
			});
			
			myself.display();
			myself.lastClickX = offsetx;
			myself.lastClickY = offsety;
		break;
	}
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function processes the mouse click up event on the canvas
 *
 * Params:	The event DOM from the html page.
 *
 * Return: N/A
 */
Farm.prototype.doMouseUp = function( event ) {
	
	var myself = this;
	switch(myself.currentState)
	{
		case "idle":
		case "dragging" :
		case "moving":
			myself.currentState = "idle";
		break;
	}
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function processes the mouse right click event on the canvas.
 * It's purpose is to disable the mouse right click.
 *
 * Params:	The event DOM from the html page.
 *
 * Return: N/A
 */
Farm.prototype.doContextMenu = function( event ){

	event.preventDefault()
    return(false); 
};

Farm.prototype.doHandleImage = function( event ){
	var myself = this;
    var reader = new FileReader();
	
    reader.onload = function(event){
	
        myself.backgroundImage = new Image();
		
        myself.backgroundImage.onload = function(){
		
            myself.backgroundCanvas.width = myself.backgroundImage.width;
            myself.backgroundCanvas.height = myself.backgroundImage.height;
            myself.backgroundContext.drawImage(myself.backgroundImage,1,1,650,650);
			
        }
        myself.backgroundImage.src = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);     
};

//////// conditional functions ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function checks to see if the x,y coordinates
 * that are passed in are on the line. the line it
 * checks are the lines between each consecutive point in the 
 * points array passed in as well.
 *
 * Params:	An array of points to check, and the
 * position of the x click, and the position of the y click
 *
 * Return: bool- true if the click was on the line, and false
  if the click was not on the line.
 */
Farm.prototype.lineWasClicked  = function(startPoint, endPoint, xclick, yclick){
	var result = false;
	
	var clickPoint = new Corner( xclick, yclick, 0);
	
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
	
	ProjDistance = function( sPoint, ePoint, cPoint ) {
		
		return Math.abs(   (sPoint.y - ePoint.y)*cPoint.x 
		                 - (sPoint.x - ePoint.x)*cPoint.y
                         + (sPoint.x * ePoint.y)
                         - (sPoint.y * ePoint.x) ) /
						 Math.sqrt( (sPoint.x - ePoint.x)*(sPoint.x - ePoint.x) 
						          + (sPoint.y - ePoint.y)*(sPoint.y - ePoint.y) );
	};

	if( ProjDistance( startPoint, endPoint, clickPoint ) < startPoint.radius )
	{
		if( Angle( startPoint, clickPoint) < Math.PI/2 &&  Angle( endPoint, clickPoint) < Math.PI/2 )
		{
			if( Magnitude( new Corner( startPoint.x - clickPoint.x, startPoint.y - clickPoint.y) , 0) < Magnitude( new Corner( startPoint.x - endPoint.x, startPoint.y - endPoint.y, 0 ) ) && 
			    Magnitude( new Corner( endPoint.x - clickPoint.x, endPoint.y - clickPoint.y) , 0) < Magnitude( new Corner( startPoint.x - endPoint.x, startPoint.y - endPoint.y, 0 ) )) 
			{
				result = true;
			}
		}
	}

	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function checks to see if the x,y coordinates
 * that are passed in are on the polygon that is formed by the points array.
 *
 * Params:	points - an array of points that in-order form the polygon of the field.
 * xclick - the x position of the click.
 * yclick - the y position of the click.
 *
 * Return: true it was within the field, false it was outside the field.
 */
Farm.prototype.fieldWasClicked = function( points, xclick, yclick) {
	var myself = this,
		result = false,
		nextNode,
		clickPoint = new Corner( xclick, yclick, 0);
		
		points.forEach( function( node, i, nodes ) {
		
			nextNode = ( i === nodes.length-1) ? nodes[0] : nodes[i+1];
			
			if(( node.y     < clickPoint.y && nextNode.y >  clickPoint.y ) ||
			   ( nextNode.y < clickPoint.y && node.y     >  clickPoint.y ) &&
			   ( node.x    <= clickPoint.x || nextNode.x <= clickPoint.x ) )
			  {
				if( (node.x +(clickPoint.y - node.y) / ( nextNode.y - node.y) * (nextNode.x - node.x)) < clickPoint.x )
				{
					result = !result;
				}
			  }
		});

		return result;	
};

//////// canvas update ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function displays all the fields on the canvas for the user.
 * 
 * Params:	N/A
 * 
 * Return: N/A
 */
Farm.prototype.display = function() {
	
	var myself = this;
	var nextNode;
	// clear the drawing canvas
	myself.farmCanvas.width = myself.farmCanvas.width;
	
	myself.farmContext.save();
	myself.farmContext.scale(scale.x, scale.y);
	
	myself.farmContext.lineEnd = 'round';
	myself.farmContext.lineJoin = 'round';
	
	myself.farmContext.fillStyle = '#aa7243';
	myself.farmContext.lineWidth = 8;	
	
	//////////////////////////////////////////////
	// display the outline of the fence
	myself.farmContext.strokeStyle = '#00000000';
	myself.fields.forEach( function( field, f, fs ) {
		myself.farmContext.save();
		if( field === myself.selectedField ) {
			myself.farmContext.strokeStyle = '#b2b200';
		}
		
		myself.farmContext.beginPath();
		myself.farmContext.moveTo(field.x,field.y);
		field.forEach( function( node, n, nodes ) {

			myself.farmContext.lineTo( node.x, node.y );
			
		});
		myself.farmContext.lineTo( field[0].x, field[0].y);
		myself.farmContext.fill();
		myself.farmContext.stroke();
		myself.farmContext.restore();
	});

	
	////////////////////////////////////////////////
	// display the brown of the fence.
	myself.farmContext.strokeStyle = '#926239';
	myself.farmContext.lineWidth = 4;	
	myself.fields.forEach( function( field, f, fs ) {
		
		myself.farmContext.beginPath();
		myself.farmContext.moveTo(field.x,field.y);
		field.forEach( function( node, n, nodes ) {

			myself.farmContext.lineTo( node.x, node.y );
			
		});
		myself.farmContext.lineTo( field[0].x, field[0].y);
		myself.farmContext.stroke();
	});
	
	/////////////////////////////////////////////////
	// display the nodes
	myself.farmContext.lineWidth = 1;
	myself.fields.forEach( function( field, f, fs ) {
				
		field.forEach( function( node, n, nodes ) {
			
			nextNode = ( n === nodes.length-1) ? nodes[0] : nodes[n+1];
			node.display( myself.farmContext, myself );
		});
	});
	
	
	// put the field name above the  field
	myself.farmContext.font = "10 Georgia";
	myself.fields.forEach( function(field, f, fs ) {
		
		var fieldNumber = myself.fields.indexOf(field) + 1;
		var avgX = 0, avgY = 0;
		field.forEach( function( node, n, nodes) {
			avgX += node.x;
			avgY += node.y;

		});
		
		avgX /= field.length;
		avgY /= field.length;
		
		var textX = avgX;
		var textY = avgY;
		myself.farmContext.fillText("Field: " + fieldNumber, textX - 8*2, textY ); // subract the 8*2 for letters in order to center the text

	});
	
	myself.farmContext.restore();
	
	// Draw the topground widgets
	myself.topgroundContext.save();
	myself.topgroundContext.scale( scale.x, scale.y );
	
	var width = myself.topgroundCanvas.width;
	var height = myself.topgroundCanvas.height;
	var Xpos;
	var Ypos;
	if( myself.selectedNode ){

		Xpos = myself.selectedNode.x/scale.x; 
		Ypos = height/scale.y - myself.selectedNode.y/scale.y ;

	}else if ( myself.selectedField ) {
		Xpos = myself.selectedField[0].x/scale.x ;
		Ypos = height/scale.y - myself.selectedField[0].y/scale.y;
	} else {
		Xpos = "_";
		Ypos = "_";
	};
	
	myself.topgroundCanvas.width = myself.topgroundCanvas.width; // clear
	
	myself.topgroundContext.font = "14px Georgia";
	myself.topgroundContext.fillText("Selected X: " + Xpos + " Y: " + Ypos, 10, myself.topgroundCanvas.height-10);
	
	myself.topgroundContext.restore();
	
	
	// refresh background
	// TODO: use a global variable to know when to apply scale so we don't have to keep refreshing the background image
	//if( scale.x != 1 && scale.y != 1) {
	
	//	myself.topgroundContext.scale( scale.x, scale.y );
		
	//	myself.backgroundCanvas.width = myself.backgroundCanvas.width;
		
		// this needs work to scale 
		//myself.backgroundContext.drawImage( myself.backgroundImage, 1, 1, myself.backgroundCanvas.width*scale.x, myself.backgroundCanvas.height*scale.y );
	//}
};

//////// User Interaction functions (mostly button clicks) ////////
/*
 * Author: Byron Wheeler
 *
 * Desc: This function adds a new field to the canvas.
 *
 * Params:	N/A.
 *
 * Return: N/A.
 */
Farm.prototype.addNewField = function() {
	
	var myself = this;
	var C0 = new Corner( myself.startFieldX                      , myself.startFieldY                       , myself.cornerRadius );
	var C1 = new Corner( myself.startFieldX + myself.defaultWidth, myself.startFieldY                       , myself.cornerRadius );
	var C2 = new Corner( myself.startFieldX + myself.defaultWidth, myself.startFieldY + myself.defaultHeight, myself.cornerRadius );
	var C3 = new Corner( myself.startFieldX                      , myself.startFieldY + myself.defaultHeight, myself.cornerRadius );	
	var boundary = [ C0, C1, C2, C3 ];
	
	myself.startFieldX += myself.defaultWidth/2;
	myself.startFieldY += myself.defaultHeight/2;
	
	myself.fields.push(boundary);
	myself.display();
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function resets the canvas to the default.
 *
 * Params:	N/A.
 *
 * Return: N/A.
 */
Farm.prototype.reset = function() {
	
	var myself = this;
	
	myself.fields = null;
	myself.startFieldX = 50;
	myself.startFieldY = 50;
	
	var myself = this;
	var C0 = new Corner( myself.startFieldX                      , myself.startFieldY                       , myself.cornerRadius );
	var C1 = new Corner( myself.startFieldX + myself.defaultWidth, myself.startFieldY                       , myself.cornerRadius );
	var C2 = new Corner( myself.startFieldX + myself.defaultWidth, myself.startFieldY + myself.defaultHeight, myself.cornerRadius );
	var C3 = new Corner( myself.startFieldX                      , myself.startFieldY + myself.defaultHeight, myself.cornerRadius );	
	var boundary = [ C0, C1, C2, C3 ];
	myself.fields = [ boundary ];
	
	this.farmCanvas.width = this.farmCanvas.width;
	
	myself.startFieldX += myself.defaultWidth/2;
	myself.startFieldY += myself.defaultHeight/2;
	myself.display();
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function removes the selected field from the canvas
 *
 * Params:	N/A.
 *
 * Return: N/A.
 */
Farm.prototype.removeField = function() {
	
	var exit = false;
	var myself = this;
	
	if( myself.selectedField && this.fields.length > 0) {
		myself.fields.forEach(function( field, f, fs ){
			
			if( !exit && field == myself.selectedField ) {
				
				myself.selectedField = null;
				myself.fields.splice(f,1);			
				myself.display();
				exit = true;
				
			}
			
		});
	};
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function removes the selected corner from the canvas
 *
 * Params:	N/A.
 *
 * Return: N/A.
 */
Farm.prototype.removeCorner = function() {
	
	var exit = false;
	var myself = this;
	
	if( myself.selectedNode ) {
		
		myself.fields.forEach( function( field, f, fs) {
			
			if( !exit && field.length > 3){
			
				field.forEach( function( node, n, nodes ) {
					
					if( !exit && node == myself.selectedNode ) {
						
						myself.selectedNode = null;
						field.splice(n,1);
						exit = true;
						myself.display();
					}
				});
			}
		});
	}
};

Farm.prototype.exportFarm = function() {
	
	var myself = this;
	
	var img = myself.farmCanvas.toDataURL();
	//document.write('<img src="'+img+'"/>');
	var downloader = document.getElementById('download');
	downloader.href = img;
	/*
	myself.farmCanvas.toBlob( function( blob) {
		
		saveAs( blob, "farmImage.png");
	});
	
	*/
	
	
};