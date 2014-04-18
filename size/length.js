
var Length;


Length.units = { 
			      kilometer : "km", // kilometer
				  meter     : "m",  // meter
 				  feet      : "ft", // foot
				  yard      : "yd", // yard
				  mile      : "mi"  // mile
			   };

Length.baseUnit = Length.units.ft;

/*
 * Author: Byron Wheeler
 *
 * Desc: This global function will return a length amount in the
 * specified units.
 *
 * Params:	
 *  amount - the amount of the unit passed in.
 *  unit - The unit of the returned quantity.
 *
 * Return: The area in the specified unit
 */
Length.parseToBase = function( amount, unit ){
	
	switch( unit )
	{
		case "km":
		
			amount *= 3280.84;
			break;
			
		case "m":
			
			amount *= 3.28084;
			break;
			
		case "ft":
			
			amount = amount;
			break;
			
		case "yd":
			
			amount *= 3.0;
			break;
			
		case "mi":
		
			amount *= 5280.0;
			break;
			
	}
	
	return amount;
};



function Length( amount, unit ){
	this.init( amount, unit);
};

Length.prototype.init = function ( amount, unit ) {
	
	var myself = this;
	
	myself.length = null;
	myself.name = "Length";
	
	myself.setLength( amount, unit);
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will change the length amount in this object
 * by the specified units.
 *
 * Params:	
 *  amount - The quantity that the length will be changed.
 *  unit - The unit of the quantity.
 *
 */
Length.prototype.setLength = function ( amount, unit ) {	
	
	var myself = this;
	
	switch( unit )
	{
		case "km":
		
			amount *= 3280.84;
			break;
			
		case "m":
		
			amount *= 3.28084;
			break;
					
		case "ft":
			
			amount = amount;
			break;
			
		case "yd":
			
			amount *= 3.0;
			break;
			
		case "mi":
			amount *= 5280.0;
			break;
		
	}	
	myself.length = amount;
	
};


/*
 * Author: Byron Wheeler
 *
 * Desc: This function will return an length amount in the
 * specified units.
 *
 * Params:	
 *  unit - The unit of the returned quantity.
 *
 * Return: The length in the specified unit
 */
Length.prototype.getLength = function ( unit ) {
	
	var myself = this;
	var amount = myself.length;
	switch( unit )
	{
		case "km":
		
			amount /= 3280.84;
			break;
			
		case "m":
			
			amount /= 3.28084;
			break;
			
		case "ft":
			
			amount = amount;
			break;
			
		case "yd":
			
			amount /= 3.0;
			break;
			
		case "mi":
		
			amount /= 5280.0;
			break;
			
	}
	
	return amount;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will add this object's length with the one passed in 
 * and return a new length.
 *
 * Params:	
 *	amount - The quantity to be added.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A length object from the added length
 */
Length.prototype.addLength = function ( amount, unit ) {
	
	var myself = this,
	    result = null;
	
	result = new Length( myself.getLength(myself.length, unit) + amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will subtract this object's length from the one passed in 
 * and return a new length.
 *
 * Params:	
 *	amount - The quantity to be subtracted.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A length object from the subtracted length
 */
Length.prototype.subLength = function ( amount, unit ) {
	var myself = this,
		result = null;
	
	result = new Length( myself.getLength(myself.length, unit) - amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will multiply this object's length with the one passed in 
 * and return a new length.
 *
 * Params:	
 *	amount - The quantity to be multiplied.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A length object from the multiplied length
 */
Length.prototype.mulLength = function ( amount, unit ) {
	var myself = this,
		result = null;
		
	result = new Length( myself.getLength(myself.length, unit) * amount, unit);		
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will divide this object's length from the one passed in 
 * and return a new length.
 *
 * Params:	
 *	amount - The quantity to be divided.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A length object from the divided length
 */

Length.prototype.divLength = function ( amount, unit ) {
	var myself = this,
		result = null;
		
		result = new Length( myself.getLength(myself.length, unit) / amount, unit);
		
	return result;
};


