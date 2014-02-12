var SpriteCorralMorph;

// SpriteCorralMorph ///////////////////////////////////////

// I am an editor that holds multiple selectable sprites

// SpriteCorralMorph inherits from Morph:

SpriteCorralMorph.prototype = new Morph();
SpriteCorralMorph.prototype.constructor = SpriteCorralMorph;
SpriteCorralMorph.uber = Morph.prototype;

// SpriteCorralMorph defaults

SpriteCorralMorph.prototype.backgroundColor = new Color(246, 233, 201);
SpriteCorralMorph.prototype.sliderColor = new Color(244, 244, 0);

// SpriteCorralMorph instance creation:

function SpriteCorralMorph(spriteCollection, spriteIconType){
	this.init(spriteCollection, spriteIconType);
};

SpriteCorralMorph.prototype.init = function (spriteCollection) {
	var myself = this;
	
	SpriteCorralMorph.uber.init.call(this)
	this.frame = null;
	this.color = SpriteCorralMorph.prototype.backgroundColor;
	
	this.createFrame();
	this.fixLayout();
};

// create frame

SpriteCorralMorph.prototype.createFrame = function() {
	var myself = this,
		template;
	
	if( this.frame ) {
		this.frame.destroy();
	}
	
	// create the new frame
	this.frame = new ScrollFrameMorph( null, null, this.sliderColor );
		
	// assign the appropriate properties.
	this.frame.acceptsDrops = false;
	this.frame.contents.acceptsDrops = false;
	this.frame.alpha = 0;
	
	// associated events:
	this.frame.contents.wantsDropOf = function (morph) {
		var spriteIconType = myself.parentThatIsA( SpriteEditorMorph ).spriteIconType;
		return morph instanceof spriteIconType;
	};
	
	this.frame.contents.reactToDropOf = function (spriteIcon) {
		var spriteType = myself.parentThatIsA( SpriteEditorMorph ).spriteIconType;
		myself.reactToDropOf(spriteIcon);		
	};
	
	// add the frame to the sprite corral morph
	this.add(this.frame);
	
};

// inherited functions
SpriteCorralMorph.prototype.fixLayout = function() {
	var myself = this;
	
	this.frame.setPosition(myself.position());
	this.frame.setExtent(myself.extent());
	this.arrangeIcons();
	this.refresh();
};

SpriteCorralMorph.prototype.refresh = function() {
	this.frame.contents.children.forEach(function (icon) {
		icon.refresh();
	});
};

SpriteCorralMorph.prototype.arrangeIcons = function() {
	var padding = 5,
		x = this.frame.left() + padding,
		y = this.frame.top() + padding,
		max = this.frame.right(),
		start = this.frame.left() + padding;
		
	this.frame.contents.children.forEach(function (icon) {
		var w = icon.width() + padding;
		
		if (x + w > max) {
			x = start;
			y += icon.height() + padding;
		}
		icon.setPosition(new Point(x,y));
		x += w;
	});
	
	this.frame.contents.adjustBounds();
};

SpriteCorralMorph.prototype.addSprite = function(sprite) {
	var spriteIconType = this.parentThatIsA( SpriteEditorMorph ).spriteIconType;
	this.frame.contents.add(new spriteIconType(sprite));
	this.fixLayout();
};

// events
SpriteCorralMorph.prototype.wantsDropOf = function( Morph ) {
	return morph instanceof spriteIconMorph;
};

SpriteCorralMorph.prototype.reactToDropOf = function (spriteIcon) {
	var myself = this,
		idx = 0,
		oldIdx = this.frame.contents.children.indexOf(spriteIcon),
		pos = spriteIcon.position(),
		sprites = this.parentThatIsA( SpriteEditorMorph ).sprites
		children = myself.frame.contents.children;
	
	// find the new position of the dropped sprite
	this.frame.contents.children.forEach(function (icon) {
		if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
			idx += 1;
		}
	});
	
	// rearrange both icons and sprites
	
	sprites.splice(idx, 0, sprites.splice(oldIdx, 1)[0]);
	children.splice(idx, 0, children.splice(oldIdx, 1)[0]);
	myself.fixLayout();
};
