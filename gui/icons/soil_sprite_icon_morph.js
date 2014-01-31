var SoilSpriteIconMorph;

// SoilSpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm representing, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// SoilSpriteIconMorph inherits from SpriteIconMorph 

SoilSpriteIconMorph.prototype = new SpriteIconMorph();
SoilSpriteIconMorph.prototype.constructor = SoilSpriteIconMorph;
SoilSpriteIconMorph.uber = SpriteIconMorph.prototype;

// SpriteIconMorph instance creation:

function SoilSpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
};

SoilSpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
	SoilSpriteIconMorph.uber.init.call(this, aSprite, aTemplate);
};