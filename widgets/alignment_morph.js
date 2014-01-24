var AlignmentMorph;

// AlignmentMorph /////////////////////////////////////////////////////

// I am a reified layout, either a row or a column of submorphs

// AlignmentMorph inherits from Morph:

AlignmentMorph.prototype = new Morph();
AlignmentMorph.prototype.constructor = AlignmentMorph;
AlignmentMorph.uber = Morph.prototype;

// AlignmentMorph instance creation:

function AlignmentMorph(orientation, padding) {
    this.init(orientation, padding);
}

AlignmentMorph.prototype.init = function (orientation, padding) {
    // additional properties:
    this.orientation = orientation || 'row'; // or 'column'
    this.alignment = 'center'; // or 'left' in a column
    this.padding = padding || 0;
    this.respectHiddens = false;

    // initialize inherited properties:
    AlignmentMorph.uber.init.call(this);

    // override inherited properites:
};

// AlignmentMorph displaying and layout

AlignmentMorph.prototype.drawNew = function () {
    this.image = newCanvas(new Point(1, 1));
    this.fixLayout();
};

AlignmentMorph.prototype.fixLayout = function () {
    var myself = this,
        last = null,
        newBounds;
    if (this.children.length === 0) {
        return null;
    }
    this.children.forEach(function (c) {
        var cfb = c.fullBounds(),
            lfb;
        if (c.isVisible || myself.respectHiddens) {
            if (last) {
                lfb = last.fullBounds();
                if (myself.orientation === 'row') {
                    c.setPosition(
                        lfb.topRight().add(new Point(
                            myself.padding,
                            (lfb.height() - cfb.height()) / 2
                        ))
                    );
                } else { // orientation === 'column'
                    c.setPosition(
                        lfb.bottomLeft().add(new Point(
                            myself.alignment === 'center' ?
                                    (lfb.width() - cfb.width()) / 2
                                            : 0,
                            myself.padding
                        ))
                    );
                }
                newBounds = newBounds.merge(cfb);
            } else {
                newBounds = cfb;
            }
            last = c;
        }
    });
    this.bounds = newBounds;
};

