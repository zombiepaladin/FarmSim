var PestSpriteIconMorph;

// PestSpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm representing, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// PestSpriteIconMorph inherits from SpriteIconMorph 

PestSpriteIconMorph.prototype = new SpriteIconMorph();
PestSpriteIconMorph.prototype.constructor = PestSpriteIconMorph;
PestSpriteIconMorph.uber = SpriteIconMorph.prototype;

// SpriteIconMorph instance creation:

function PestSpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
};

PestSpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
	PestSpriteIconMorph.uber.init.call(this, aSprite, aTemplate);
};