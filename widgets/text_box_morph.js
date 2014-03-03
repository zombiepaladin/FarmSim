// TextBoxMorph ///////////////////////////////////////

// I am a box with text inside

// TextBoxMorph inherits from BoxMorph:

TextBoxMorph.prototype = new BoxMorph();
TextBoxMorph.prototype.constructor = TextBoxMorph;
TextBoxMorph.uber = BoxMorph.prototype;

// TextBoxMorph preference settings:

TextBoxMorph.prototype.backColor = new Color( 255, 255, 255 );


// TextBoxMorph instance creation:

function TextBoxMorph( edge, border, borderColor, text, numLines, owner){
	this.init( edge, border, borderColor, text, numLines, owner);
};

TextBoxMorph.prototype.init = function( edge, border, borderColor, text, numLines, owner) {
	
	var myself = this;
	
	// initialize inherited properties
	TextBoxMorph.uber.init.call(this, edge, border, borderColor);
	
	// declare sub-morph properties
	this.textContent = null;
	
	// assign properties
	this.padding = 3;
	this.color = this.backColor;
	this.lineCount = (numLines) ? numLines : 1; // if something was passed in we use that, otherwise we default to 1
	this.owner = (owner) ? owner : null;
	this.canGrow = true;
	
	// create submorphs
	this.createTextMorph(text);
		
	this.fixLayout();
	
};

TextBoxMorph.prototype.createTextMorph = function( text ){
	var myself = this;
	
	if( myself.textContent)
	{
		myself.textContent.destroy();
	}
	
	// create textMorph
	myself.textContent = new TextMorph(text);
	
	// assign textMorph properties
	myself.textContent.isEditable = true;
	
	// set up user event handlers
	// This event is triggered when the text is clicked
	myself.textContent.mouseDownLeft = function(pos) 
	{
		myself.reactToClick(pos);
	};
	
	// This event is triggered when newtext is typed
	myself.textContent.checkBounds = function(pos, keyCode)
	{	
		if(myself.canGrow)
		{
			// check to see if it went over the right bound
			if( ( myself.right() - 4*myself.padding) < pos.asArray()[0] ) 
			{
				// check to see if it went over the bottom bound
				if( (myself.bottom() - 2*myself.textContent.fontSize*1.2 ) < pos.asArray()[1] ) 
				{
					myself.lineCount++;
					myself.fixLayout();
					if( myself.owner)
					{
						myself.owner.fixLayout();
					}
				}
				
				return true; // move text to new line
			}
			// new line and the bottom is maxed out
			if( keyCode === 13 && (myself.bottom() - 2*myself.textContent.fontSize ) < pos.asArray()[1] ) 
			{
				myself.lineCount++;
				myself.fixLayout();
				if( myself.owner)
				{
					myself.owner.fixLayout();
				}
			}
		}
		return false; // don't do anything
	}
	
	// add textMorph to textboxmorph
	myself.add( myself.textContent );
};

TextBoxMorph.prototype.fixLayout = function(){
	var myself = this;

	// resize the textBoxMorph to match the width of the text content.
	myself.setHeight( myself.textContent.fontSize * 1.2 + myself.lineCount*myself.textContent.fontSize*1.2 );
	
	// align the text within the textBoxMorph
	myself.textContent.setPosition( myself.topLeft().add( new Point( myself.padding, myself.padding) ) );
};

TextBoxMorph.prototype.refresh = function(){
	var myself = this;
	myself.outlinePath();
	myself.fixLayout();
	
}

TextBoxMorph.prototype.outlinePath = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
        h = this.height();
	
	context.moveTo(0,0);
	context.lineTo(w,0);
	context.lineTo(w,h);
	context.lineTo(0,h);
};

TextBoxMorph.prototype.setText = function (words){
	this.textContent.text = this.createTextMorph(words);
	this.fixLayout(); // refresh the layout.
};

TextBoxMorph.prototype.getText = function(){

	return this.textContent.text;
};

TextBoxMorph.prototype.reactToClick = function(pos) {
	var myself = this;
	
	if (this.textContent.isEditable) {
        if (!this.textContent.currentlySelecting) {
            this.textContent.edit(); // creates a new cursor
        }
        cursor = this.textContent.root().root().cursor;
        if (cursor) {
		
			cursor.gotoPos(pos);
        }
        this.textContent.currentlySelecting = true;
    } else {
        this.textContent.escalateEvent('mouseClickLeft', pos);
    }
	
};


// events
TextBoxMorph.prototype.mouseDownLeft = function(pos) {
	this.reactToClick(pos);
};

// TODO: add event for clicking and dragging to select text



