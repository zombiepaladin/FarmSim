var WeatherSystemMorph;

// WeatherSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's Weather system editor panel

// WeatherSystemMorph inherits from Morph:

WeatherSystemMorph.prototype = new SpriteEditorMorph();
WeatherSystemMorph.prototype.constructor = WeatherSystemMorph;
WeatherSystemMorph.uber = SpriteEditorMorph.prototype;


// WeatherSystemMorph instance creation:

function WeatherSystemMorph(universalVariables, WeatherSprites) {
    this.init(universalVariables, WeatherSprites);
}

WeatherSystemMorph.prototype.init = function (universalVariables, WeatherSprites) {
	
	var WeatherSprites = [],
		sprite2 = new WeatherSpriteMorph( universalVariables ),
		sprite3 = new WeatherSpriteMorph( universalVariables ),
		sprite4 = new WeatherSpriteMorph( universalVariables );
	
	sprite2.name = 'dis 2';
	sprite3.name = 'dis 3';
	sprite4.name = 'dis 4';
	
	WeatherSprites.push(sprite2);
	WeatherSprites.push(sprite3);
	WeatherSprites.push(sprite4);
	
	// initialize inherited properties
	WeatherSystemMorph.uber.init.call(this, universalVariables, WeatherSprites, WeatherSpriteMorph, WeatherSpriteIconMorph);
	
};