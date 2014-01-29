var SpriteCorralMorph;

// SpriteCorralMorph ///////////////////////////////////////

// I am an editor that holds multiple selectable sprites

// SpriteCorralMorph inherits from Morph:

SpriteCorralMorph.prototype = new Morph();
SpriteCorralMorph.prototype.constructor = SpriteCorralMorph;
SpriteCorralMorph.uber = Morph.prototype;

// SpriteCorralMorph defaults

SpriteCorralMorph.prototype.sliderColor = new Color(244, 244, 0);

// SpriteCorralMorph instance creation:

function SpriteCorralMorph(spriteCollection, spriteIconType){
	this.init(spriteCollection, spriteIconType);
};

SpriteCorralMorph.prototype.init = function (spriteCollection, spriteIconType) {
	
	var myself = this;
	
	SpriteCorralMorph.uber.init.call(this)
	
	this.sprites = spriteCollection;
	this.frame = null;
	
	this.createFrame(spriteIconType);
	this.fixLayout();
};

// create frame

SpriteCorralMorph.prototype.createFrame = function(spriteIconType) {
	
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
		return morph instanceof spriteIconType;
	};
	
	this.frame.contents.reactToDropOf = function (spriteIcon) {
		myself.reactToDropOf(spriteIcon);		
	};
	
	this.sprites().forEach(function (morph) {
	
		template = new spriteIconType(morph, template);
		
		myself.frame.contents.add(template);
		
	});
	
	// add the frame to the sprite corral morph
	this.add(this.frame);
	
};

// inherited functions
SpriteCorralMorph.prototype.fixLayout = function() {
	
	console.log("fixing corral layout");
	
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
	
	var x = this.frame.left(),
		y = this.frame.top(),
		max = this.frame.right(),
		start = this.frame.left();
		
	this.frame.contents.children.forEach(function (icon) {
		var w = icon.width();
		
		if (x + w > max) {
			x = start;
			y += icon.height();
		}
		icon.setPosition(new Point(x,y));
		x += w;
	});
	
	this.frame.contents.adjustBounds();
};

SpriteCorralMorph.prototype.addSprite = function() {
	
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
		sprites = myself.sprites(),
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
