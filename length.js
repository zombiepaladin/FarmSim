



// kilometer, meter, centimeter, milimeter, inch, foot, yard, mile
Length.units = { "km", "m", "ft", "yd", "mi" };

Length.baseUnit = "ft";


function Length( amount, unit ){
	this.init( amount, unit);
};

Length.prototype.init = function ( amount, unit ) {
	
	var this = myself;
	
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
	myself.Distance = amount;
	
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
	var len = null;
	switch( unit )
	{
		case "km":
		
			len = myself.Distance / 3280.84;
			break;
			
		case "m":
			
			len = myself.Distance / 3.28084;
			break;
			
		case "ft":
			
			len = myself.Distance;
			break;
			
		case "yd":
			
			len = myself.Distance / 3.0;
			break;
			
		case "mi":
		
			len = myself.Distance / 5280.0;
			break;
			
	}
	
	return len;
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
	
	result = new Length( myself.getLength(myself.Distance, unit) + amount, unit);
	
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
	
	result = new Length( myself.getLength(myself.Distance, unit) - amount, unit);
	
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
		
	result = new Length( myself.getLength(myself.Distance, unit) * amount, unit);		
	
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
		
		result = new Length( myself.getLength(myself.Distance, unit) / amount, unit);
		
	return result;
};


