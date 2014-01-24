var ControlBarMorph;

// ControlBarMorph ///////////////////////////////////////

// I am a bar with rounded corners

// ControlBarMorph inherits from BoxMorph:

ControlBarMorph.prototype = new BoxMorph();
ControlBarMorph.prototype.constructor = ControlBarMorph;
ControlBarMorph.uber = BoxMorph.prototype;

// ControlBarMorph preference settings:

ControlBarMorph.corner = 5;

// ControlBarMorph instance creation:

function ControlBarMorph(edge, border, borderColor){
	this.init(edge, border, borderColor);
}

ControlBarMorph.init = function(edge, border, borderColor) {
	// initialize inherited properties
	ControlBarMorph.uber.init.call(this, edge, border, borderColor);
}

// ControlBarMorph drawing

ControlBarMorph.prototype.outlinePath = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
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
    // top right:
    context.arc(
        w - offset,
        offset,
        radius,
        radians(-90),
        radians(-0),
        false
    );
    // bottom right:
    context.lineTo(
        w - inset,
        h - inset
    );
    // bottom left:
    context.lineTo(
        inset,
        h - inset
    );
};