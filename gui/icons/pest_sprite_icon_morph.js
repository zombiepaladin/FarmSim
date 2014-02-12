var PestSpriteIconMorph;

// PestSpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm representing, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// PestSpriteIconMorph inherits from SpriteIconMorph 

PestSpriteIconMorph.prototype = new SpriteIconMorph();
PestSpriteIconMorph.prototype.constructor = PestSpriteIconMorph;
PestSpriteIconMorph.uber = SpriteIconMorph.prototype;

// PestSpriteIconMorph settings

PestSpriteIconMorph.prototype.thumbSize = new Point(60, 40);
//PestSpriteIconMorph.prototype.labelShadowOffset = null;
//PestSpriteIconMorph.prototype.labelShadowColor = null;
//PestSpriteIconMorph.prototype.labelColor = new Color(255, 255, 255);
//PestSpriteIconMorph.prototype.fontSize = 9;
PestSpriteIconMorph.prototype.backgroundColor = new Color(156, 180, 150);
PestSpriteIconMorph.prototype.outlineColor = new Color(29, 23, 13);

// SpriteIconMorph instance creation:

function PestSpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
};

PestSpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
	PestSpriteIconMorph.uber.init.call(this, aSprite, aTemplate);
};

// PestSpriteIconMorph rendering:

PestSpriteIconMorph.prototype.outlineSprite = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
        h = this.height();
		
	context.arc(w/2, h/2, w/2 - 2 * offset, 0, 2 * Math.PI);
};

PestSpriteIconMorph.prototype.outlineName = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
        h = this.height();
	
	context.arc(w/2, h/2, w/2 - 2 * offset, Math.PI * 0.125, Math.PI * 0.875);
};

PestSpriteIconMorph.prototype.drawBackground = function (context, color) {
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


PestSpriteIconMorph.prototype.drawEdges = function (
    context,
    color,
    topColor,
    bottomColor
) {
	return;
};

CropSpriteMorph.prototype.createBackgrounds = function () {
/*
    basically the same as inherited from PushButtonMorph, except for
    not inverting the pressImage 3D-ish border (because it stays that way),
    and optionally coloring the left edge in the press-color, previewing
    the selection color (e.g. in the case of Scratch palette-category
    selector. the latter is done in the drawEdges() method.
*/
    var context,
        ext = this.extent();

    if (this.template) { // take the backgrounds images from the template
        this.image = this.template.image;
        this.normalImage = this.template.normalImage;
        this.highlightImage = this.template.highlightImage;
        this.pressImage = this.template.pressImage;
        return null;
    }

    this.normalImage = newCanvas(ext);
    context = this.normalImage.getContext('2d');
    this.drawOutline(context);
    this.drawBackground(context, this.normalColor);

    this.highlightImage = newCanvas(ext);
    context = this.highlightImage.getContext('2d');
    this.drawOutline(context);
    this.drawBackground(context, this.highlightColor);
	this.drawEdges(
        context,
        this.highlightColor,
        this.highlightColor.lighter(this.contrast),
        this.highlightColor.darker(this.contrast)
    );

    // note: don't invert the 3D-ish edges for pressedImage, because
    // it will stay that way, and should not look inverted (or should it?)
    this.pressImage = newCanvas(ext);
    context = this.pressImage.getContext('2d');
    this.drawOutline(context);
    this.drawBackground(context, this.pressColor);
	this.drawEdges(
        context,
        this.highlightColor,
        this.highlightColor.lighter(this.contrast),
        this.highlightColor.darker(this.contrast)
    );

    this.image = this.normalImage;
};

