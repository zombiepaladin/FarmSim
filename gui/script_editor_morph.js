var ScriptEditorMorph;

// ScriptEditorMorph ///////////////////////////////////////

// I am an editor that allows you to edit a sprite's scripts

// ScriptEditorMorph inherits from Morph:

ScriptEditorMorph.prototype = new Morph();
ScriptEditorMorph.prototype.constructor = TabPanelMorph;
ScriptEditorMorph.uber = Morph.prototype;

// ScriptEditorMorph instance creation:

function ScriptEditorMorph(aSprite){
	this.init(aSprite);
};

ScriptEditorMorph.prototype.init = function (aSprite) {
	var myself = this;
	
	// set the default properties.
	ScriptEditorMorph.uber.init.call(this);
	
	// modify / add properties
	this.currentSprite = aSprite || new SpriteMorph();
	this.defaultWidth = 200;
	this.currentCategory = 'motion';
	this.categories = null;
	this.palette = null;
	this.editor = null;	
		
	// create layout
	this.createCategories();
	this.createPalette();
	this.createEditor();
		
	this.fixLayout();
};

ScriptEditorMorph.prototype.frameColor = new Color(60,60,60);
ScriptEditorMorph.prototype.groupColor = new Color(255, 255, 255);

ScriptEditorMorph.prototype.createCategories = function () {
	var myself = this;
	console.log("create categories");
	if (this.categories) {
		this.categories.destroy();
	}
	this.categories = new Morph();
	this.categories.color = this.groupColor;
	this.categories.silentSetWidth(this.defaultWidth);
	
	function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(50),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                myself.currentCategory = category;
                myself.categories.children.forEach(function (each) {
                    each.refresh();
                });
                myself.refreshPalette(true);
            },
            category[0].toUpperCase().concat(category.slice(1)), // label
            function () {  // query
                return myself.currentCategory === category;
            },
            null, // env
            null, // hint
            null, // template cache
            labelWidth, // minWidth
            true // has preview
        );

        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        return button;
    }
	
	function fixCategoriesLayout() {
        var buttonWidth = myself.categories.children[0].width(),
            buttonHeight = myself.categories.children[0].height(),
            border = 3,
            rows =  Math.ceil((myself.categories.children.length) / 2),
            xPadding = (myself.categories.width()
                - border
                - buttonWidth * 2) / 3,
            yPadding = 2,
            l = myself.categories.left(),
            t = myself.categories.top(),
            i = 0,
            row,
            col;

        myself.categories.children.forEach(function (button) {
            i += 1;
            row = Math.ceil(i / 2);
            col = 2 - (i % 2);
            button.setPosition(new Point(
                l + (col * xPadding + ((col - 1) * buttonWidth)),
                t + (row * yPadding + ((row - 1) * buttonHeight) + border)
            ));
        });

        myself.categories.setHeight(
            (rows + 1) * yPadding
                + rows * buttonHeight
                + 2 * border
        );
    }
		
	SpriteMorph.prototype.categories.forEach(function (cat) {
		if(!contains(['lists', 'other'], cat)) {
			addCategoryButton(cat);
		}
	});
	fixCategoriesLayout();
	this.add(this.categories);
};

ScriptEditorMorph.prototype.createPalette = function () {
	// assumes the categories have already been created
	var myself = this;
	console.log("create palette");
	if (this.palette) {
		this.palette.destroy();
	}
	
	this.palette = this.currentSprite.palette(this.currentCategory);
	this.palette.isDraggable = false;
	this.palette.acceptsDrops = true;
	this.palette.contents.acceptsDrops = false;
	
	this.palette.reactToDropOf = function (droppedMorph) {
		if (droppedMorph instanceof DialogBoxMorph) {
			myself.world().add(droppedMorph);
		} else if (droppedMorph instanceof SpriteMorph) {
			myself.removeSprite(droppedMorph);
		} else if (droppedMorph instanceof SpriteIconMorph) {
			droppedMorph.destroy();
			myself.removeSprite(droppedMorph.object);
		} else if (droppedMorph instanceof CostumeIconMorph) {
			myself.currentSprite.wearCustume(null);
			droppedMorph.destroy();
		} else {
			droppedMorph.destroy();
		}
	};
	
	this.palette.setWidth(this.categories.width());
	this.add(this.palette);
	this.palette.scrollX(this.palette.padding);
	this.palette.scrollY(this.palette.padding);
};

ScriptEditorMorph.prototype.createEditor = function() {
	// assumes the categories have already been created
	var scripts = this.currentSprite.scripts,
		myself = this;
		
	if (this.editor) {
		this.editor.destroy();
	}
	
	scripts.isDraggable = false;
	scripts.color = this.groupColor;
	
	this.editor = new ScrollFrameMorph(
		scripts,
		null,
		this.sliderColor
	);
	
	this.editor.color = new Color(20,70,100);
	this.editor.padding = 10;
	this.editor.growth = 50;
	this.editor.isDraggable = false;
	this.editor.acceptsDrops = false;
	this.editor.contents.acceptsDrops = true;
	
	scripts.scrollFrame = this.editor;
	this.add(this.editor);
	this.editor.scrollX(this.editor.padding);
	this.editor.scrollY(this.editor.padding);
}

ScriptEditorMorph.prototype.loadSprite = function (aSprite) {
	this.currentSprite = aSprite;
	
	// reload scripts and palette for new sprite
	this.createEditor();
	this.refreshPalette();
	this.fixLayout();
};

ScriptEditorMorph.prototype.refreshPalette = function (shouldIgnorePosition) {
    var oldTop = this.palette.contents.top();

    this.createPalette();
    this.fixLayout('refreshPalette');
    if (!shouldIgnorePosition) {
        this.palette.contents.setTop(oldTop);
    }
};

ScriptEditorMorph.prototype.fixLayout = function() {
		
	// palette
	this.palette.setHeight(this.height() - this.categories.height());
	this.palette.setPosition(this.categories.bottomLeft());
		
	// editor
	this.editor.setHeight(this.height());
	this.editor.setWidth( this.width() - this.palette.width() );
	this.editor.setPosition( this.categories.topRight() );

}

ScriptEditorMorph.prototype.setExtent = function (point) {
	ScriptEditorMorph.uber.setExtent.call(this, point);
	if(this.palette) this.fixLayout();
};
