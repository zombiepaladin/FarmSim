// TextBoxMorph ///////////////////////////////////////

// I am a box with text inside

// TextBoxMorph inherits from BoxMorph:

TextBoxMorph.prototype = new BoxMorph();
TextBoxMorph.prototype.constructor = TextBoxMorph;
TextBoxMorph.uber = BoxMorph.prototype;

// TextBoxMorph preference settings:


// TextBoxMorph instance creation:

function TextBoxMorph( edge, border, borderColor, text){
	this.init( edge, border, borderColor, text);
};

TextBoxMorph.prototype.init = function( edge, border, borderColor, text) {
	
	var myself = this;
	
	// initialize inherited properties
	TextBoxMorph.uber.init.call(this, edge, border, borderColor);
	
	this.textContent = null;
	
	// assign properties
	this.padding = 3;
	this.color = new Color( 255, 255, 255 ) ;
	this.border = 3;
	
	
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
	
	myself.textContent = new TextMorph(text);
	
	myself.textContent.isEditable = true
	
	myself.add( myself.textContent );
};

TextBoxMorph.prototype.fixLayout = function()
{
	var myself = this;
	
	myself.textContent.setPosition( myself.topLeft().add( new Point( myself.padding, myself.padding) ) );
};

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
	this.textContent.text = words;
};

TextBoxMorph.prototype.getText = function(){

	return this.textContent.text;
};

