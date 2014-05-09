
var Volume;


Volume.units = {  
				  meter_cubed     : "m3",  // kilometer cubed
				  kilometer_cubed : "km3", // meter cubed
 				  feet_cubed      : "ft3", // foot cubed
				  yard_cubed      : "yd3"  // yard cubed
			   };

Volume.baseUnit = Volume.units.feet_cubed;

/*
 * Author: Byron Wheeler
 *
 * Desc: This global function will return a mass amount in the
 * specified units.
 *
 * Params:	
 *  amount - the amount of the unit passed in.
 *  unit - The unit of the returned quantity.
 *
 * Return: The area in the specified unit
 */
Volume.parseToBase = function( amount, unit ){
	
	switch( unit )
	{
		case "m3":
			
			amount *= 35.3146667;
			break;
			
		case "km3":
			
			amount *= 2.8316846592e-11
			break;
			
		case "ft3":
			
			amount = amount;
			break;
			
		case "yd3":
			
			amount *= 27;
			break;		
	}
	
	return amount;
};

function Volume( amount, unit ){
	this.init( amount, unit);
};

Volume.prototype.init = function ( amount, unit ) {
	
	var myself = this;
	
	this.name = "Volume";
	this.volume = null;
	
	myself.setVolume( amount, unit);
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will change the volume amount in this object
 * by the specified units.
 *
 * Params:	
 *  amount - The quantity that the volume will be changed.
 *  unit - The unit of the quantity.
 *
 */
Volume.prototype.setVolume = function ( amount, unit ) {	
	
	var myself = this;
	
	switch( unit )
	{
		case "m3":
			
			amount *= 35.3146667;
			break;
			
		case "km3":
			
			amount *= 2.8316846592e-11
			break;
			
		case "ft3":
			
			amount = amount;
			break;
			
		case "yd3":
			
			amount *= 27;
			break;
	}	
	myself.volume = amount;
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will return an volume amount in the
 * specified units.
 *
 * Params:	
 *  unit - The unit of the returned quantity.
 *
 * Return: The volume in the specified unit
 */
Volume.prototype.getVolume = function ( unit ) {
	
	var myself = this;
	var amount = myself.volume;
	
	switch( unit )
	{
		case "m3":
			
			amount /= 35.3146667;
			break;
			
		case "km3":
			
			amount /= 2.8316846592e-11
			break;
			
		case "ft3":
			
			amount = amount;
			break;
			
		case "yd3":
			
			amount /= 27;
			break;		
	}
	
	return amount;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will add this object's volume with the one passed in 
 * and return a new volume.
 *
 * Params:	
 *	amount - The quantity to be added.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A volume object from the added volume
 */
Volume.prototype.addVolume = function ( amount, unit ) {
	
	var myself = this,
	    result = null;
	
	result = new Volume( myself.getVolume(myself.volume, unit) + amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will subtract this object's volume from the one passed in 
 * and return a new volume.
 *
 * Params:	
 *	amount - The quantity to be subtracted.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A volume object from the subtracted volume
 */
Volume.prototype.subVolume = function ( amount, unit ) {
	var myself = this,
		result = null;
	
	result = new Volume( myself.getVolume(myself.volume, unit) - amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will multiply this object's volume with the one passed in 
 * and return a new volume.
 *
 * Params:	
 *	amount - The quantity to be multiplied.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A volume object from the multiplied volume
 */
Volume.prototype.mulVolume = function ( amount, unit ) {
	var myself = this,
		result = null;
		
	result = new Volume( myself.getVolume(myself.volume, unit) * amount, unit);		
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will divide this object's volume from the one passed in 
 * and return a new volume.
 *
 * Params:	
 *	amount - The quantity to be divided.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A volume object from the divided volume
 */
Volume.prototype.divVolume = function ( amount, unit ) {
	var myself = this,
		result = null;
		
		result = new Volume( myself.getVolume(myself.volume, unit) / amount, unit);
		
	return result;
};


