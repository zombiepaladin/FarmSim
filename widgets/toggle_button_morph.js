
var ToggleButtonMorph;

// ToggleButtonMorph ///////////////////////////////////////////////////////

/*
    I am a two-state PushButton. When my state is "true" I keep my "pressed"
    background color. I can also be set to not auto-layout my bounds, in
    which case my label will left-align.
*/

// ToggleButtonMorph inherits from PushButtonMorph:

ToggleButtonMorph.prototype = new PushButtonMorph();
ToggleButtonMorph.prototype.constructor = ToggleButtonMorph;
ToggleButtonMorph.uber = PushButtonMorph.prototype;

// ToggleButton settings

ToggleButtonMorph.prototype.contrast = 30;

// ToggleButtonMorph instance creation:

function ToggleButtonMorph(
    colors, // color overrides, <array>: [normal, highlight, pressed]
    target,
    action, // a toggle function
    labelString,
    query, // predicate/selector
    environment,
    hint,
    template, // optional, for cached background images
    minWidth, // <num> optional, if specified label will left-align
    hasPreview, // <bool> show press color on left edge (e.g. category)
    isPicture // treat label as picture, i.e. don't apply typography
) {
    this.init(
        colors,
        target,
        action,
        labelString,
        query,
        environment,
        hint,
        template,
        minWidth,
        hasPreview,
        isPicture
    );
}

ToggleButtonMorph.prototype.init = function (
    colors,
    target,
    action,
    labelString,
    query,
    environment,
    hint,
    template,
    minWidth,
    hasPreview,
    isPicture
) {
    // additional properties:
    this.state = false;
    this.query = query || function () {return true; };
    this.minWidth = minWidth || null;
    this.hasPreview = hasPreview || false;
    this.isPicture = isPicture || false;
    this.trueStateLabel = null;

    // initialize inherited properties:
    ToggleButtonMorph.uber.init.call(
        this,
        target,
        action,
        labelString,
        environment,
        hint,
        template
    );

    // override default colors if others are specified
    if (colors) {
        this.color = colors[0];
        this.highlightColor = colors[1];
        this.pressColor = colors[2];
    }

    this.refresh();
    this.drawNew();
};

// ToggleButtonMorph events

ToggleButtonMorph.prototype.mouseEnter = function () {
    if (!this.state) {
        this.image = this.highlightImage;
        this.changed();
    }
    if (this.hint) {
        this.bubbleHelp(this.hint);
    }
};

ToggleButtonMorph.prototype.mouseLeave = function () {
    if (!this.state) {
        this.image = this.normalImage;
        this.changed();
    }
    if (this.hint) {
        this.world().hand.destroyTemporaries();
    }
};

ToggleButtonMorph.prototype.mouseDownLeft = function () {
    if (!this.state) {
        this.image = this.pressImage;
        this.changed();
    }
};

ToggleButtonMorph.prototype.mouseClickLeft = function () {
    if (!this.state) {
        this.image = this.highlightImage;
        this.changed();
    }
    this.trigger(); // allow me to be triggered again to force-update others
};

// ToggleButtonMorph action

ToggleButtonMorph.prototype.trigger = function () {
    ToggleButtonMorph.uber.trigger.call(this);
    this.refresh();
};

ToggleButtonMorph.prototype.refresh = function () {
/*
    if query is a function:
    execute the query with target as environment (can be null)
    for lambdafied (inline) actions

    else if query is a String:
    treat it as function property of target and execute it
    for selector-like queries
*/
    if (typeof this.query === 'function') {
        this.state = this.query.call(this.target);
    } else { // assume it's a String
        this.state = this.target[this.query]();
    }
    if (this.state) {
        this.image = this.pressImage;
        if (this.trueStateLabel) {
            this.label.hide();
            this.trueStateLabel.show();
        }
    } else {
        this.image = this.normalImage;
        if (this.trueStateLabel) {
            this.label.show();
            this.trueStateLabel.hide();
        }
    }
    this.changed();
};

// ToggleButtonMorph layout:

ToggleButtonMorph.prototype.fixLayout = function () {
    if (this.label !== null) {
        var lw = Math.max(this.label.width(), this.labelMinExtent.x),
            padding = this.padding * 2 + this.outline * 2 + this.edge * 2;
        this.setExtent(new Point(
            (this.minWidth ?
                    Math.max(this.minWidth, lw) + padding
                    : lw + padding),
            Math.max(this.label instanceof StringMorph ?
                    this.label.rawHeight() :
                        this.label.height(), this.labelMinExtent.y) + padding
        ));
        this.label.setCenter(this.center());
        if (this.trueStateLabel) {
            this.trueStateLabel.setCenter(this.center());
        }
        if (this.minWidth) { // left-align along my corner
            this.label.setLeft(
                this.left()
                    + this.outline
                    + this.edge
                    + this.corner
                    + this.padding
            );
        }
    }
};

// ToggleButtonMorph drawing

ToggleButtonMorph.prototype.createBackgrounds = function () {
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
    this.drawBackground(context, this.color);
    this.drawEdges(
        context,
        this.color,
        this.color.lighter(this.contrast),
        this.color.darker(this.contrast)
    );

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
        this.pressColor,
        this.pressColor.lighter(40),
        this.pressColor.darker(40)
    );

    this.image = this.normalImage;
};

ToggleButtonMorph.prototype.drawEdges = function (
    context,
    color,
    topColor,
    bottomColor
) {
    var gradient;

    ToggleButtonMorph.uber.drawEdges.call(
        this,
        context,
        color,
        topColor,
        bottomColor
    );

    if (this.hasPreview) { // indicate the possible selection color
        if (MorphicPreferences.isFlat && !this.is3D) {
            context.fillStyle = this.pressColor.toString();
            context.fillRect(
                this.outline,
                this.outline,
                this.corner,
                this.height() - this.outline * 2
            );
            return;
        }
        gradient = context.createLinearGradient(
            0,
            0,
            this.corner,
            0
        );
        gradient.addColorStop(0, this.pressColor.lighter(40).toString());
        gradient.addColorStop(1, this.pressColor.darker(40).toString());
        context.fillStyle = gradient; // this.pressColor.toString();
        context.beginPath();
        this.previewPath(
            context,
            Math.max(this.corner - this.outline, 0),
            this.outline
        );
        context.closePath();
        context.fill();
    }
};

ToggleButtonMorph.prototype.previewPath = function (context, radius, inset) {
    var offset = radius + inset,
        h = this.height();

    // top left:
    context.arc(
        offset,
        offset,
        radius,
        radians(-180),
        radians(-90),
        false
    );
    // bottom left:
    context.arc(
        offset,
        h - offset,
        radius,
        radians(90),
        radians(180),
        false
    );
};

ToggleButtonMorph.prototype.createLabel = function () {
    var shading = !MorphicPreferences.isFlat || this.is3D,
        none = new Point();

    if (this.label !== null) {
        this.label.destroy();
    }
    if (this.trueStateLabel !== null) {
        this.trueStateLabel.destroy();
    }
    if (this.labelString instanceof Array && this.labelString.length === 2) {
        if (this.labelString[0] instanceof SymbolMorph) {
            this.label = this.labelString[0].fullCopy();
            this.trueStateLabel = this.labelString[1].fullCopy();
            if (!this.isPicture) {
                this.label.shadowOffset = shading ?
                        this.labelShadowOffset : none;
                this.label.shadowColor = this.labelShadowColor;
                this.label.color = this.labelColor;
                this.label.drawNew();

                this.trueStateLabel.shadowOffset = shading ?
                        this.labelShadowOffset : none;
                this.trueStateLabel.shadowColor = this.labelShadowColor;
                this.trueStateLabel.color = this.labelColor;
                this.trueStateLabel.drawNew();
            }
        } else if (this.labelString[0] instanceof Morph) {
            this.label = this.labelString[0].fullCopy();
            this.trueStateLabel = this.labelString[1].fullCopy();
        } else {
            this.label = new StringMorph(
                localize(this.labelString[0]),
                this.fontSize,
                this.fontStyle,
                true,
                false,
                false,
                shading ? this.labelShadowOffset : null,
                this.labelShadowColor,
                this.labelColor
            );
            this.trueStateLabel = new StringMorph(
                localize(this.labelString[1]),
                this.fontSize,
                this.fontStyle,
                true,
                false,
                false,
                shading ? this.labelShadowOffset : null,
                this.labelShadowColor,
                this.labelColor
            );
        }
    } else {
        if (this.labelString instanceof SymbolMorph) {
            this.label = this.labelString.fullCopy();
            if (!this.isPicture) {
                this.label.shadowOffset = shading ?
                        this.labelShadowOffset : none;
                this.label.shadowColor = this.labelShadowColor;
                this.label.color = this.labelColor;
                this.label.drawNew();
            }
        } else if (this.labelString instanceof Morph) {
            this.label = this.labelString.fullCopy();
        } else {
            this.label = new StringMorph(
                localize(this.labelString),
                this.fontSize,
                this.fontStyle,
                true,
                false,
                false,
                shading ? this.labelShadowOffset : none,
                this.labelShadowColor,
                this.labelColor
            );
        }
    }
    this.add(this.label);
    if (this.trueStateLabel) {
        this.add(this.trueStateLabel);
    }
};

// ToggleButtonMorph hiding and showing:

/*
    override the inherited behavior to recursively hide/show all
    children, so that my instances get restored correctly when
    hiding/showing my parent.
*/

ToggleButtonMorph.prototype.hide = function () {
    this.isVisible = false;
    this.changed();
};

ToggleButtonMorph.prototype.show = function () {
    this.isVisible = true;
    this.changed();
};

// TabMorph ///////////////////////////////////////////////////////

// TabMorph inherits from ToggleButtonMorph:

TabMorph.prototype = new ToggleButtonMorph();
TabMorph.prototype.constructor = TabMorph;
TabMorph.uber = ToggleButtonMorph.prototype;

// TabMorph instance creation:

function TabMorph(
    colors, // color overrides, <array>: [normal, highlight, pressed]
    target,
    action, // a toggle function
    labelString,
    query, // predicate/selector
    environment,
    hint
) {
    this.init(
        colors,
        target,
        action,
        labelString,
        query,
        environment,
        hint
    );
}

// TabMorph layout:

TabMorph.prototype.fixLayout = function () {
    if (this.label !== null) {
        this.setExtent(new Point(
            this.label.width()
                + this.padding * 2
                + this.corner * 3
                + this.edge * 2,
            (this.label instanceof StringMorph ?
                        this.label.rawHeight() : this.label.height())
                + this.padding * 2
                + this.edge
        ));
        this.label.setCenter(this.center());
    }
};

// TabMorph action:

TabMorph.prototype.refresh = function () {
    if (this.state) { // bring to front
        if (this.parent) {
            this.parent.add(this);
        }
    }
    TabMorph.uber.refresh.call(this);
};

// TabMorph drawing:

TabMorph.prototype.drawBackground = function (context, color) {
    var w = this.width(),
        h = this.height(),
        c = this.corner;

    context.fillStyle = color.toString();
    context.beginPath();
    context.moveTo(0, h);
    context.bezierCurveTo(c, h, c, 0, c * 2, 0);
    context.lineTo(w - c * 2, 0);
    context.bezierCurveTo(w - c, 0, w - c, h, w, h);
    context.closePath();
    context.fill();
};

TabMorph.prototype.drawOutline = function () {
    nop();
};

TabMorph.prototype.drawEdges = function (
    context,
    color,
    topColor,
    bottomColor
) {
    if (MorphicPreferences.isFlat && !this.is3D) {return; }

    var w = this.width(),
        h = this.height(),
        c = this.corner,
        e = this.edge,
        eh = e / 2,
        gradient;

    nop(color); // argument not needed here

    gradient = context.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, topColor.toString());
    gradient.addColorStop(1, bottomColor.toString());

    context.strokeStyle = gradient;
    context.lineCap = 'round';
    context.lineWidth = e;

    context.beginPath();
    context.moveTo(0, h + eh);
    context.bezierCurveTo(c, h, c, 0, c * 2, eh);
    context.lineTo(w - c * 2, eh);
    context.bezierCurveTo(w - c, 0, w - c, h, w, h + eh);
    context.stroke();
};

// ToggleMorph ///////////////////////////////////////////////////////

/*
    I am a PushButton which toggles a check mark ( becoming check box)
    or a bullet (becoming a radio button). I can have both or either an
    additional label and an additional pictogram, whereas the pictogram
    can be either an instance of (any) Morph, in which case the pictogram
    will be an interactive toggle itself or a Canvas, in which case it
    is just going to be a picture.
*/

// ToggleMorph inherits from PushButtonMorph:

ToggleMorph.prototype = new PushButtonMorph();
ToggleMorph.prototype.constructor = ToggleMorph;
ToggleMorph.uber = PushButtonMorph.prototype;

// ToggleMorph instance creation:

function ToggleMorph(
    style, // 'checkbox' or 'radiobutton'
    target,
    action, // a toggle function
    labelString,
    query, // predicate/selector
    environment,
    hint,
    template,
    element, // optional Morph or Canvas to display
    builder // method which constructs the element (only for Morphs)
) {
    this.init(
        style,
        target,
        action,
        labelString,
        query,
        environment,
        hint,
        template,
        element,
        builder
    );
}

ToggleMorph.prototype.init = function (
    style,
    target,
    action,
    labelString,
    query,
    environment,
    hint,
    template,
    element,
    builder
) {
    // additional properties:
    this.padding = 1;
    style = style || 'checkbox';
    this.corner = (style === 'checkbox' ?
            0 : fontHeight(this.fontSize) / 2 + this.outline + this.padding);
    this.state = false;
    this.query = query || function () {return true; };
    this.tick = null;
    this.captionString = labelString || null;
    this.labelAlignment = 'right';
    this.element = element || null;
    this.builder = builder || null;
    this.toggleElement = null;

    // initialize inherited properties:
    ToggleMorph.uber.init.call(
        this,
        target,
        action,
        (style === 'checkbox' ? '\u2713' : '\u25CF'),
        environment,
        hint,
        template
    );
    this.refresh();
    this.drawNew();
};

// ToggleMorph layout:

ToggleMorph.prototype.fixLayout = function () {
    var padding = this.padding * 2 + this.outline * 2,
        y;
    if (this.tick !== null) {
        this.silentSetHeight(this.tick.rawHeight() + padding);
        this.silentSetWidth(this.tick.width() + padding);

        this.setExtent(new Point(
            Math.max(this.width(), this.height()),
            Math.max(this.width(), this.height())
        ));
        this.tick.setCenter(this.center());
    }
    if (this.state) {
        this.tick.show();
    } else {
        this.tick.hide();
    }
    if (this.toggleElement && (this.labelAlignment === 'right')) {
        y = this.top() + (this.height() - this.toggleElement.height()) / 2;
        this.toggleElement.setPosition(new Point(
            this.right() + padding,
            y
        ));
    }
    if (this.label !== null) {
        y = this.top() + (this.height() - this.label.height()) / 2;
        if (this.labelAlignment === 'right') {
            this.label.setPosition(new Point(
                this.toggleElement ?
                        this.toggleElement instanceof ToggleElementMorph ?
                                this.toggleElement.right()
                                : this.toggleElement.right() + padding
                        : this.right() + padding,
                y
            ));
        } else {
            this.label.setPosition(new Point(
                this.left() - this.label.width() - padding,
                y
            ));
        }
    }
};

ToggleMorph.prototype.createLabel = function () {
    var shading = !MorphicPreferences.isFlat || this.is3D;

    if (this.label === null) {
        if (this.captionString) {
            this.label = new TextMorph(
                localize(this.captionString),
                this.fontSize,
                this.fontStyle,
                true
            );
            this.add(this.label);
        }
    }
    if (this.tick === null) {
        this.tick = new StringMorph(
            localize(this.labelString),
            this.fontSize,
            this.fontStyle,
            true,
            false,
            false,
            shading ? new Point(1, 1) : null,
            new Color(240, 240, 240)
        );
        this.add(this.tick);
    }
    if (this.toggleElement === null) {
        if (this.element) {
            if (this.element instanceof Morph) {
                this.toggleElement = new ToggleElementMorph(
                    this.target,
                    this.action,
                    this.element,
                    this.query,
                    this.environment,
                    this.hint,
                    this.builder
                );
            } else if (this.element instanceof HTMLCanvasElement) {
                this.toggleElement = new Morph();
                this.toggleElement.silentSetExtent(new Point(
                    this.element.width,
                    this.element.height
                ));
                this.toggleElement.image = this.element;
            }
            this.add(this.toggleElement);
        }
    }
};

// ToggleMorph action:

ToggleMorph.prototype.trigger = function () {
    ToggleMorph.uber.trigger.call(this);
    this.refresh();
};

ToggleMorph.prototype.refresh = function () {
    /*
    if query is a function:
    execute the query with target as environment (can be null)
    for lambdafied (inline) actions

    else if query is a String:
    treat it as function property of target and execute it
    for selector-like queries
    */
    if (typeof this.query === 'function') {
        this.state = this.query.call(this.target);
    } else { // assume it's a String
        this.state = this.target[this.query]();
    }
    if (this.state) {
        this.tick.show();
    } else {
        this.tick.hide();
    }
    if (this.toggleElement && this.toggleElement.refresh) {
        this.toggleElement.refresh();
    }
};

// ToggleMorph events

ToggleMorph.prototype.mouseDownLeft = function () {
    PushButtonMorph.uber.mouseDownLeft.call(this);
    if (this.tick) {
        this.tick.setCenter(this.center().add(1));
    }
};

ToggleMorph.prototype.mouseClickLeft = function () {
    PushButtonMorph.uber.mouseClickLeft.call(this);
    if (this.tick) {
        this.tick.setCenter(this.center());
    }
};

ToggleMorph.prototype.mouseLeave = function () {
    PushButtonMorph.uber.mouseLeave.call(this);
    if (this.tick) {
        this.tick.setCenter(this.center());
    }
};

// ToggleMorph hiding and showing:

/*
    override the inherited behavior to recursively hide/show all
    children, so that my instances get restored correctly when
    hiding/showing my parent.
*/

ToggleMorph.prototype.hide = ToggleButtonMorph.prototype.hide;

ToggleMorph.prototype.show = ToggleButtonMorph.prototype.show;

