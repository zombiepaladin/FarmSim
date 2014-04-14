



// kilometer cubed, meter cubed, foot cubed, yard cubed, 
Volume.units = {  "m3", "km3", "ft3", "yd3"};

Volume.baseUnit = "ft3";

function Volume( amount, unit ){
	this.init( amount, unit);
};

Volume.prototype.init = function ( amount, unit ) {
	
	var this = myself;
	
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
		
	}	
	myself.Distance = amount;
	
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
	var len = null;
	switch( unit )
	{
				
	}
	
	return len;
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
	
	result = new Volume( myself.getVolume(myself.Distance, unit) + amount, unit);
	
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
	
	result = new Volume( myself.getVolume(myself.Distance, unit) - amount, unit);
	
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
		
	result = new Volume( myself.getVolume(myself.Distance, unit) * amount, unit);		
	
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
		
		result = new Volume( myself.getVolume(myself.Distance, unit) / amount, unit);
		
	return result;
};


