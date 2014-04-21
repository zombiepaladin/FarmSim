
var Patch;


Patch.properties = { 
                    location   : "Location" ,  // position
                    soil       : "Soil"  ,     // soil
			        plant      : "Plant" ,     // 
			        water      : "Water" ,     // 
			        nitrogen   : "Nitrogen" ,  // 
			        potassium  : "Potassium" , // 
			        phosphorus : "Phosphorus", // 
			       };


function Patch( aPos, aSoil, aPlant, aWater, aNitrogen, aPotassium, aPhosphorus){
	this.init( aPos, aSoil, aPlant, aWater, aNitrogen, aPotassium, aPhosphorus);
};

Patch.prototype.init = function( aPos, aSoil, aPlant, aWater, aNitrogen, aPotassium, aPhosphorus) {
	
	this.name = "Patch";
	
	this.location =   (aPos        && apos instanceof Point)  ? aPos        : new Point(0,0);
	this.soil =       (aSoil       && aSoil instanceof Soil)  ? aSoil       : null;
	this.plant =      (aPlant      && aPlant instanceof Plant)? aPlant      : [null];
	this.water =      (aWater      )                          ? aWater      : 1;
	this.nitrogen =   (aNitrogen   )                          ? aNitrogen   : 1;
	this.potassium =  (aPotassium  )                          ? aPotassium  : 1;
	this.phosphorus = (aPhosphorus )                          ? aPhosphorus : 1;
};

