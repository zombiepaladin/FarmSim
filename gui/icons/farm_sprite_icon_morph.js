var FarmIconMorph;

// FarmIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm representing, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// FarmIconMorph inherits from SpriteIconMorph 

FarmIconMorph.prototype = new SpriteIconMorph();
FarmIconMorph.prototype.constructor = FarmIconMorph;
FarmIconMorph.uber = SpriteIconMorph.prototype;

// FarmIconMorph settings

FarmIconMorph.prototype.thumbSize = new Point(60, 35);
//FarmIconMorph.prototype.labelShadowOffset = null;
//FarmIconMorph.prototype.labelShadowColor = null;
//FarmIconMorph.prototype.labelColor = new Color(255, 255, 255);
//FarmIconMorph.prototype.fontSize = 9;

FarmIconMorph.prototype.backgroundColor = new Color(266, 104, 37);
FarmIconMorph.prototype.outlineColor = new Color(29, 23, 13);


// FarmIconMorph instance creation:

function FarmIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
};

FarmIconMorph.prototype.init = function (aSprite, aTemplate) {
	FarmIconMorph.uber.init.call(this, aSprite, aTemplate);
	
	this.color = new Color(226, 104, 37);
};

// FarmIconMorph rendering:

FarmIconMorph.prototype.outlineSprite = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
        h = this.height(),
		w2 = w/2,
		w4 = w/4;
		
	context.moveTo(w * 0.25 + offset, offset);
	context.lineTo(w * 0.75 - offset, offset);
	context.lineTo(w - offset, h/2);
	context.lineTo(w * 0.75 - offset, h - offset);
	context.lineTo(w * 0.25 + offset, h - offset);
	context.lineTo(0 + offset, h/2);
};

FarmIconMorph.prototype.outlineName = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
        h = this.height(),
		w2 = w/2,
		w4 = w/4;
		
	context.moveTo(w * 0.0625 + 2 * offset, h * 0.625 + offset);
	context.lineTo(w * 0.25 + offset, h - offset);
	context.lineTo(w * 0.75 - offset, h - offset);
	context.lineTo(w * 0.9375 - 2 * offset, h * 0.625 + offset);
};

FarmIconMorph.prototype.drawBackground = function (context, color) {
    var isFlat = MorphicPreferences.isFlat && !this.is3D;
    
	// highlight
	context.lineWidth = 4;
	context.strokeStyle = color.toString();
	context.fillStyle = color.toString();
	context.beginPath();
    this.outlinePath(
        context,
        4,
        this.outline
    );
    context.closePath();
	context.stroke();
	context.fill();
	
	// background
	context.fillStyle = this.backgroundColor.toString();
    context.beginPath();
    this.outlineSprite(
        context,
        2,
        this.outline
    );
    context.closePath();
    context.fill();
    
	// name
	context.fillStyle = this.outlineColor.toString();
	context.beginPath();
	this.outlineName(
        context,
        2,
        this.outline
    );
	context.closePath();
	context.fill();
	
	// outline
	context.lineWidth = 1;
	context.strokeStyle = this.outlineColor.toString();
	context.beginPath();
    this.outlineSprite(
        context,
        2,
        this.outline
    );
    context.closePath();
	context.stroke();
};


FarmIconMorph.prototype.drawEdges = function (
    context,
    color,
    topColor,
    bottomColor
) {
	return;
};
