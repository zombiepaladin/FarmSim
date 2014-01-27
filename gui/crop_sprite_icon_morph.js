var CropSpriteIconMorph;

// CropSpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm respresenting, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// CropSpriteIconMorph inherits from SpriteIconMorph 

CropSpriteIconMorph.prototype = new SpriteIconMorph();
CropSpriteIconMorph.prototype.constructor = CropSpriteIconMorph;
CropSpriteIconMorph.uber = SpriteIconMorph.prototype;
console.log(SpriteIconMorph);
// SpriteIconMorph instance creation:

function CropSpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
};

CropSpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
	console.log(this.uber);
    this.uber.init.call(this, aSprite, aTemplate);
};