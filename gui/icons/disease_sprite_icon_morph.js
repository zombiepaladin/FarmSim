var DiseaseSpriteIconMorph;

// DiseaseSpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm representing, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// DiseaseSpriteIconMorph inherits from SpriteIconMorph 

DiseaseSpriteIconMorph.prototype = new SpriteIconMorph();
DiseaseSpriteIconMorph.prototype.constructor = DiseaseSpriteIconMorph;
DiseaseSpriteIconMorph.uber = SpriteIconMorph.prototype;

// SpriteIconMorph instance creation:

function DiseaseSpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
};

DiseaseSpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
	DiseaseSpriteIconMorph.uber.init.call(this, aSprite, aTemplate);
};