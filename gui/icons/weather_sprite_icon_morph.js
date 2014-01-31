var WeatherSpriteIconMorph;

// WeatherSpriteIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the Sprite corral, keeping a self-updating
    thumbnail of the sprite I'm representing, and a self-updating label
    of the sprite's name (in case it is changed elsewhere)
*/

// WeatherSpriteIconMorph inherits from SpriteIconMorph 

WeatherSpriteIconMorph.prototype = new SpriteIconMorph();
WeatherSpriteIconMorph.prototype.constructor = WeatherSpriteIconMorph;
WeatherSpriteIconMorph.uber = SpriteIconMorph.prototype;

// SpriteIconMorph instance creation:

function WeatherSpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
};

WeatherSpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
	WeatherSpriteIconMorph.uber.init.call(this, aSprite, aTemplate);
};