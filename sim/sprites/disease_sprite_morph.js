var DiseaseSpriteMorph;

// DiseaseSpriteMorph /////////////////////////////////////////////////////////

// I am a scriptable object

// DiseaseSpriteMorph inherits from SpriteMorph:

DiseaseSpriteMorph.prototype = new SpriteMorph();
DiseaseSpriteMorph.prototype.constructor = DiseaseSpriteMorph;
DiseaseSpriteMorph.uber = SpriteMorph.prototype;

// DiseaseSpriteMorph instance creation

function DiseaseSpriteMorph(globals) {
    this.init(globals);
}

DiseaseSpriteMorph.prototype.init = function (globals) {

    DiseaseSpriteMorph.uber.init.call(this, globals);
	
    this.name = localize('Disease');
};

DiseaseSpriteMorph.prototype.exportSprite = function () {
	
	var str = SimulatorMorph.prototype.serializer.serialize(this);
	window.open(str);

};