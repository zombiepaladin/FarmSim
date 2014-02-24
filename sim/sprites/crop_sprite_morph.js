var CropSpriteMorph;

// CropSpriteMorph /////////////////////////////////////////////////////////

// I am a scriptable object

// CropSpriteMorph inherits from SpriteMorph:

CropSpriteMorph.prototype = new SpriteMorph();
CropSpriteMorph.prototype.constructor = CropSpriteMorph;
CropSpriteMorph.uber = SpriteMorph.prototype;

// CropSpriteMorph instance creation

function CropSpriteMorph(globals) {
    this.init(globals);
}

CropSpriteMorph.prototype.init = function (globals) {

    CropSpriteMorph.uber.init.call(this, globals);
	
    this.name = localize('Crop');
};

CropSpriteMorph.prototype.exportSprite = function () {

	var str = SimulatorMorph.prototype.serializer.serialize(this);
	
	window.open(str);

};

