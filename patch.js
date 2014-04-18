
var Patch;

function Patch( aPos, aSoil, aPlant, aWater, aNitrogen, aPotassium, aPhosphorus){
	this.init( aPos, aSoil, aPlant, aWater, aNitrogen, aPotassium, aPhosphorus);
};

Patch.prototype.init = function( aPos, aSoil, aPlant, aWater, aNitrogen, aPotassium, aPhosphorus) {
	
	this.location =   (aPos        && apos instanceof Point)        ? aPos        : new Point(0,0);
	this.soil =       (aSoil       && aSoil instanceof Soil)        ? aSoil       : null;
	this.plat =       (aPlant      && aPlant instanceof Plant)      ? aPlant      : [null];
	this.water =      (aWater      && aWater instanceof Volume)     ? aWater      : new Volume( 1 , Volume.baseUnit);
	this.nitrogen =   (aNitrogen   && a Nitrogen instanceof Volume) ? aNitrogen   : new Volume( 1 , Volume.baseUnit);
	this.potassium =  (aPotassium  && aPotassium instanceof Volume) ? aPotassium  : new Volume( 1 , Volume.baseUnit);
	this.phosphorus = (aPhosphorus && aPhosphorus instanceof Volume)? aPhosphorus : new Volume( 1 , Volume.baseUnit);
};

