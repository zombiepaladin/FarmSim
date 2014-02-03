var PestSpriteMorph;

// PestSpriteMorph /////////////////////////////////////////////////////////

// I am a scriptable object

// PestSpriteMorph inherits from SpriteMorph:

PestSpriteMorph.prototype = new SpriteMorph();
PestSpriteMorph.prototype.constructor = PestSpriteMorph;
PestSpriteMorph.uber = SpriteMorph.prototype;

// PestSpriteMorph instance creation

function PestSpriteMorph(globals) {
    this.init(globals);
}

PestSpriteMorph.prototype.init = function (globals) {

    PestSpriteMorph.uber.init.call(this, globals);
	
    this.name = localize('Pest');
};
