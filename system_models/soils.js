var SoilSystemMorph;

// SoilSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's Soil system editor panel

// SoilSystemMorph inherits from Morph:

SoilSystemMorph.prototype = new SpriteEditorMorph();
SoilSystemMorph.prototype.constructor = SoilSystemMorph;
SoilSystemMorph.uber = SpriteEditorMorph.prototype;


// SoilSystemMorph instance creation:

function SoilSystemMorph(universalVariables, SoilSprites) {
    this.init(universalVariables, SoilSprites);
}

SoilSystemMorph.prototype.init = function (universalVariables, SoilSprites) {
	
	var SoilSprites = [],
		sprite2 = new SoilSpriteMorph( universalVariables ),
		sprite3 = new SoilSpriteMorph( universalVariables ),
		sprite4 = new SoilSpriteMorph( universalVariables );
	
	sprite2.name = 'dis 2';
	sprite3.name = 'dis 3';
	sprite4.name = 'dis 4';
	
	SoilSprites.push(sprite2);
	SoilSprites.push(sprite3);
	SoilSprites.push(sprite4);
	
	// initialize inherited properties
	SoilSystemMorph.uber.init.call(this, universalVariables, SoilSprites, SoilSpriteMorph, SoilSpriteIconMorph);
	
};