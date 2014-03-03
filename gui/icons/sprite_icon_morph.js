// SpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm representing, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// SpriteIconMorph inherits from ToggleButtonMorph (Widgets)

SpriteIconMorph.prototype = new ToggleButtonMorph();
SpriteIconMorph.prototype.constructor = SpriteIconMorph;
SpriteIconMorph.uber = ToggleButtonMorph.prototype;

// SpriteIconMorph settings

SpriteIconMorph.prototype.thumbSize = new Point(40, 40);
SpriteIconMorph.prototype.labelShadowOffset = null;
SpriteIconMorph.prototype.labelShadowColor = null;
SpriteIconMorph.prototype.labelColor = new Color(240, 216, 156);
SpriteIconMorph.prototype.fontSize = 9;

SpriteIconMorph.prototype.normalColor = new Color(0, 0, 0, 0);
SpriteIconMorph.prototype.highlightColor = new Color(240, 216, 156);
SpriteIconMorph.prototype.pressedColor = new Color(135, 162, 89);

// SpriteIconMorph instance creation:

function SpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
}

SpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
			this.normalColor,
			this.highlightColor,
			this.pressedColor
        ];

    }

    action = function () {
        // make my sprite the current one
        var ide = myself.parentThatIsA(SpriteEditorMorph);

        if (ide) {
            ide.selectSprite(myself.object);
        }
    };

    query = function () {
        // answer true if my sprite is the current one
        var ide = myself.parentThatIsA(SpriteEditorMorph);

        if (ide) {
            return ide.currentSprite === myself.object;
        }
        return false;
    };

    // additional properties:
    this.object = aSprite || new SpriteMorph(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;
    this.rotationButton = null; // synchronous rotation of nested sprites

    // initialize inherited properties:
    SpriteIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SpriteIconMorph.prototype.createThumbnail = function () {
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }

    this.thumbnail = new Morph();
    this.thumbnail.setExtent(this.thumbSize);
    if (this.object instanceof SpriteMorph) { // support nested sprites
        this.thumbnail.image = this.object.fullThumbnail(this.thumbSize);
        this.createRotationButton();
    } else {
        this.thumbnail.image = this.object.thumbnail(this.thumbSize);
    }
    this.add(this.thumbnail);
};

SpriteIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        this.object.name,
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

SpriteIconMorph.prototype.createRotationButton = function () {
    var button, myself = this;

    if (this.rotationButton) {
        this.rotationButton.destroy();
        this.roationButton = null;
    }
    if (!this.object.anchor) {
        return;
    }

    button = new ToggleButtonMorph(
        null, // colors,
        null, // target
        function () {
            myself.object.rotatesWithAnchor =
                !myself.object.rotatesWithAnchor;
        },
        [
            '\u2192',
            '\u21BB'
        ],
        function () {  // query
            return myself.object.rotatesWithAnchor;
        }
    );

    button.corner = 8;
    button.labelMinExtent = new Point(11, 11);
    button.padding = 0;
    button.pressColor = button.color;
    button.drawNew();
    // button.hint = 'rotate synchronously\nwith anchor';
    button.fixLayout();
    button.refresh();
    button.changed();
    this.rotationButton = button;
    this.add(this.rotationButton);
};

// SpriteIconMorph stepping

SpriteIconMorph.prototype.step = function () {
    if (this.version !== this.object.version) {
        this.createThumbnail();
        this.createLabel();
        this.fixLayout();
        this.version = this.object.version;
        this.refresh();
    }
};

// SpriteIconMorph layout

SpriteIconMorph.prototype.fixLayout = function () {
    if (!this.thumbnail || !this.label) {return null; }

    this.setWidth(
        this.thumbnail.width()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 2
    );

    this.setHeight(
        this.thumbnail.height()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 3
            + this.label.height()
    );

    this.thumbnail.setCenter(this.center());
    this.thumbnail.setTop(
        this.top() + this.outline + this.edge + this.padding
    );

    if (this.rotationButton) {
        this.rotationButton.setTop(this.top());
        this.rotationButton.setRight(this.right());
    }

    this.label.setWidth(
        Math.min(
            this.label.children[0].width(), // the actual text
            this.thumbnail.width()
        )
    );
    this.label.setCenter(this.center());
    this.label.setTop(
        this.thumbnail.bottom() + this.padding
    );
};

// SpriteIconMorph menu

SpriteIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this),
        myself = this;
    if (this.object instanceof StageMorph) {
        menu.addItem(
            'pic...',
            function () {
                window.open(myself.object.fullImageClassic().toDataURL());
            },
            'open a new window\nwith a picture of the stage'
        );
        return menu;
    }
    if (!(this.object instanceof SpriteMorph)) {return null; }
    menu.addItem("show", 'showSpriteOnStage');
    menu.addLine();
    menu.addItem("duplicate", 'duplicateSprite');
    menu.addItem("delete", 'removeSprite');
    menu.addLine();
    if (this.object.anchor) {
        menu.addItem(
            localize('detach from') + ' ' + this.object.anchor.name,
            function () {myself.object.detachFromAnchor(); }
        );
    }
    if (this.object.parts.length) {
        menu.addItem(
            'detach all parts',
            function () {myself.object.detachAllParts(); }
        );
    }
    menu.addItem("export...", 'exportSprite');
    return menu;
};

SpriteIconMorph.prototype.duplicateSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.duplicateSprite(this.object);
    }
};

SpriteIconMorph.prototype.removeSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.removeSprite(this.object);
    }
};

SpriteIconMorph.prototype.exportSprite = function () {
    this.object.exportSprite();
};

SpriteIconMorph.prototype.showSpriteOnStage = function () {
    this.object.showOnStage();
};

// SpriteIconMorph drawing

SpriteIconMorph.prototype.createBackgrounds = function () {
//    only draw the edges if I am selected
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
    this.drawBackground(context, this.color);

    this.highlightImage = newCanvas(ext);
    context = this.highlightImage.getContext('2d');
    this.drawBackground(context, this.highlightColor);

    this.pressImage = newCanvas(ext);
    context = this.pressImage.getContext('2d');
    this.drawOutline(context);
    this.drawBackground(context, this.pressColor);
    this.drawEdges(
        context,
        this.pressColor,
        this.pressColor.lighter(this.contrast),
        this.pressColor.darker(this.contrast)
    );

    this.image = this.normalImage;
};

// SpriteIconMorph drag & drop

SpriteIconMorph.prototype.prepareToBeGrabbed = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        idx;
    this.mouseClickLeft(); // select me
    if (ide) {
        idx = ide.sprites.asArray().indexOf(this.object);
        ide.sprites.remove(idx + 1);
        ide.createCorral();
        ide.fixLayout();
    }
};

SpriteIconMorph.prototype.wantsDropOf = function (morph) {
    // allow scripts & media to be copied from one sprite to another
    // by drag & drop
    return morph instanceof BlockMorph
        || (morph instanceof CostumeIconMorph)
        || (morph instanceof SoundIconMorph);
};

SpriteIconMorph.prototype.reactToDropOf = function (morph, hand) {
    if (morph instanceof BlockMorph) {
        this.copyStack(morph);
    } else if (morph instanceof CostumeIconMorph) {
        this.copyCostume(morph.object);
    } else if (morph instanceof SoundIconMorph) {
        this.copySound(morph.object);
    }
    this.world().add(morph);
    morph.slideBackTo(hand.grabOrigin);
};

SpriteIconMorph.prototype.copyStack = function (block) {
    var dup = block.fullCopy(),
        y = Math.max(this.object.scripts.children.map(function (stack) {
            return stack.fullBounds().bottom();
        }).concat([this.object.scripts.top()]));

    dup.setPosition(new Point(this.object.scripts.left() + 20, y + 20));
    this.object.scripts.add(dup);
    dup.allComments().forEach(function (comment) {
        comment.align(dup);
    });
    this.object.scripts.adjustBounds();

    // delete all custom blocks pointing to local definitions
    // under construction...
    dup.allChildren().forEach(function (morph) {
        if (morph.definition && !morph.definition.isGlobal) {
            morph.deleteBlock();
        }
    });
};

SpriteIconMorph.prototype.copyCostume = function (costume) {
    var dup = costume.copy();
    this.object.addCostume(dup);
    this.object.wearCostume(dup);
};

SpriteIconMorph.prototype.copySound = function (sound) {
    var dup = sound.copy();
    this.object.addSound(dup.audio, dup.name);
};

SpriteIconMorph.prototype.refresh = function()
{
	var myself = this;
	
	SpriteIconMorph.uber.refresh.call(this);
	
	myself.createLabel();
	myself.createBackgrounds();
	myself.createThumbnail();
	myself.fixLayout();
	/*
	*/
	
	
}

