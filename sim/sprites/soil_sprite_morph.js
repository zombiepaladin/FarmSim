var SoilSpriteMorph;

// SoilSpriteMorph /////////////////////////////////////////////////////////

// I am a scriptable object

// SoilSpriteMorph inherits from SpriteMorph:

SoilSpriteMorph.prototype = new SpriteMorph();
SoilSpriteMorph.prototype.constructor = SoilSpriteMorph;
SoilSpriteMorph.uber = SpriteMorph.prototype;

// SoilSpriteMorph instance creation

function SoilSpriteMorph(globals) {
    this.init(globals);
}

SoilSpriteMorph.prototype.init = function (globals) {

    SoilSpriteMorph.uber.init.call(this, globals);
	
    this.name = localize('Soil');
};
