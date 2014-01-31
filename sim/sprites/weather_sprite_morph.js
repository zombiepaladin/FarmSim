var WeatherSpriteMorph;

// WeatherSpriteMorph /////////////////////////////////////////////////////////

// I am a scriptable object

// WeatherSpriteMorph inherits from SpriteMorph:

WeatherSpriteMorph.prototype = new SpriteMorph();
WeatherSpriteMorph.prototype.constructor = WeatherSpriteMorph;
WeatherSpriteMorph.uber = SpriteMorph.prototype;

// WeatherSpriteMorph instance creation

function WeatherSpriteMorph(globals) {
    this.init(globals);
}

WeatherSpriteMorph.prototype.init = function (globals) {

    WeatherSpriteMorph.uber.init.call(this, globals);
	
    this.name = localize('Weather');
};
