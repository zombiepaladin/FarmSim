var PestSystemMorph;

// PestSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's Pest system editor panel

// PestSystemMorph inherits from Morph:

PestSystemMorph.prototype = new SpriteEditorMorph();
PestSystemMorph.prototype.constructor = PestSystemMorph;
PestSystemMorph.uber = SpriteEditorMorph.prototype;


// PestSystemMorph instance creation:

function PestSystemMorph(universalVariables, PestSprites) {
    this.init(universalVariables, PestSprites);
}

PestSystemMorph.prototype.init = function (universalVariables, PestSprites) {
	
	var PestSprites = [],
		sprite2 = new PestSpriteMorph( universalVariables ),
		sprite3 = new PestSpriteMorph( universalVariables ),
		sprite4 = new PestSpriteMorph( universalVariables );
	
	sprite2.name = 'Asphids';
	sprite3.name = 'dis 3';
	sprite4.name = 'dis 4';
	
	PestSprites.push(sprite2);
	PestSprites.push(sprite3);
	PestSprites.push(sprite4);
	
	// initialize inherited properties
	PestSystemMorph.uber.init.call(this, universalVariables, PestSprites, PestSpriteMorph, PestSpriteIconMorph);
	
};