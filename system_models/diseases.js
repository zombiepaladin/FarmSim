var DiseaseSystemMorph;

// DiseaseSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's disease system editor panel

// DiseaseSystemMorph inherits from Morph:

DiseaseSystemMorph.prototype = new SpriteEditorMorph();
DiseaseSystemMorph.prototype.constructor = DiseaseSystemMorph;
DiseaseSystemMorph.uber = SpriteEditorMorph.prototype;


// DiseaseSystemMorph instance creation:

function DiseaseSystemMorph(universalVariables, diseaseSprites) {
    this.init(universalVariables, diseaseSprites);
}

DiseaseSystemMorph.prototype.init = function (universalVariables, diseaseSprites) {
	
	var diseaseSprites = [],
		sprite2 = new DiseaseSpriteMorph(),
		sprite3 = new DiseaseSpriteMorph(),
		sprite4 = new DiseaseSpriteMorph();
	
	sprite2.name = 'dis 2';
	sprite3.name = 'dis 3';
	sprite4.name = 'dis 4';
	
	diseaseSprites.push(sprite2);
	diseaseSprites.push(sprite3);
	diseaseSprites.push(sprite4);
	
	// initialize inherited properties
	DiseaseSystemMorph.uber.init.call(this, universalVariables, diseaseSprites);
	
    // add/modify properties
	this.modelSpriteType = DiseaseSpriteMorph;
	this.modelSpriteIconType = DiseaseSpriteIconMorph;
};