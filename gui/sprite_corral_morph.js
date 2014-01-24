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
	var frame, template, padding = 5, myself = this;
	
	this.sprites = spriteCollection;
	
	frame = new ScrollFrameMorph(null, null, this.sliderColor);
	frame.acceptsDrops = false;
	frame.contents.acceptsDrops = false;
	
	frame.contents.wantsDropOf = function (morph) {
		return morph instanceof spriteIconType;
	};
	
	frame.contents.reactToDropOf = function (spriteIcon) {
		myself.reactToDropOf(spriteIcon);
	};
	
	frame.alpha = 0;
	
	this.sprites().forEach(function (morph) {
		template = new spriteIconType(morph, template);
		frame.contents.add(template);
	});
	
	this.frame = frame;
	this.add(frame);
	
	this.fixLayout = function () {
	console.log("fixing corral layout");
		this.frame.setPosition(myself.position());
		this.frame.setExtent(myself.extent());
		this.arrangeIcons();
		this.refresh();
	};
	
	this.arrangeIcons = function () {
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
	
	this.addSprite = function (sprite) {
		this.frame.contents.add(new spriteIconType(sprite));
		this.fixLayout();
	};
	
	this.refresh = function() {
		this.frame.contents.children.forEach(function (icon) {
			icon.refresh();
		});
	};
	
	this.wantsDropOf = function (morph) {
		return morph instanceof spriteIconMorph;
	};
	
	this.reactToDropOf = function (spriteIcon) {
		var idx = 0,
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
};
