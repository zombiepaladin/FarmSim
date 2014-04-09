var FarmCorralMorph;

// FarmCorralMorph ///////////////////////////////////////

// I am an editor that holds multiple selectable sprites

// FarmCorralMorph inherits from Morph:

FarmCorralMorph.prototype = new Morph();
FarmCorralMorph.prototype.constructor = FarmCorralMorph;
FarmCorralMorph.uber = Morph.prototype;

// FarmCorralMorph defaults

FarmCorralMorph.prototype.backgroundColor = new Color(246, 233, 201);
FarmCorralMorph.prototype.sliderColor = new Color(244, 244, 0);

// FarmCorralMorph instance creation:

function FarmCorralMorph(){
	this.init();
};

FarmCorralMorph.prototype.init = function () {
	var myself = this;
	
	FarmCorralMorph.uber.init.call(this)
	this.frame = null;
	this.color = FarmCorralMorph.prototype.backgroundColor;
	
	this.createFrame();
	this.fixLayout();
};

// create frame

FarmCorralMorph.prototype.createFrame = function() {
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
		return morph instanceof FarmIconMorph;
	};
	
	this.frame.contents.reactToDropOf = function (morphIcon) {
		myself.reactToDropOf(morphIcon);		
	};
	
	// add the frame to the sprite corral morph
	this.add(this.frame);
	
};

// inherited functions
FarmCorralMorph.prototype.fixLayout = function() {
	var myself = this;
	
	this.frame.setPosition(myself.position());
	this.frame.setExtent(myself.extent());
	this.arrangeIcons();
	this.refresh();
};

FarmCorralMorph.prototype.refresh = function() {
	this.frame.contents.children.forEach(function (icon) {
		icon.refresh();
	});
};

FarmCorralMorph.prototype.arrangeIcons = function() {
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

FarmCorralMorph.prototype.addMorph = function( morph) {
	this.frame.contents.add( morph );
	this.fixLayout();
};

// events
FarmCorralMorph.prototype.wantsDropOf = function( Morph ) {
	return morph instanceof FarmIconMorph;
};

FarmCorralMorph.prototype.reactToDropOf = function (morphIcon) {
	var myself = this,
		idx = 0,
		oldIdx = this.frame.contents.children.indexOf(morphIcon),
		pos = morphIcon.position(),
		fields = this.parentThatIsA( FarmSystemMorph ).fields
		children = myself.frame.contents.children;
	
	// find the new position of the dropped sprite
	this.frame.contents.children.forEach(function (icon) {
		if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
			idx += 1;
		}
	});
	
	// rearrange both icons and sprites
	
	fields.splice(idx, 0, fields.splice(oldIdx, 1)[0]);
	children.splice(idx, 0, children.splice(oldIdx, 1)[0]);
	myself.fixLayout();
};
