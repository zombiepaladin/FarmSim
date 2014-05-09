
var Mass;


Mass.units = { 
			   kilogram   : "kg", // kilgram
			   gram       : "g",  // gram
			   metric_ton : "mt", // metric ton
			   ounce      : "oz", // ounce
			   pound      : "lb", // pound
			   ton        : "t"   // ton
			 };

Mass.baseUnit = Mass.units.pound;

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
Mass.parseToBase = function( amount, unit ){
	
	switch( unit )
	{
		case "kg":
			
			amount /= 2.20462;
			break;
			
		case "g":
			
			amount /= 0.00220462;
			break;
			
		case "mt":
			
			amount /= 2204.62;
			break;
			
		case "oz":
			
			amount /= 0.0625;
			break;
			
		case "lb":
			
			amount = amount;
			break;
			
		case "ton":
			
			amount /= 2000;
			break;		
	}
	
	return amount;
};

function Mass( amount, unit ){
	this.init( amount, unit);
};

Mass.prototype.init = function ( amount, unit ) {
	
	var myself = this;
	
	myself.name = "Mass";
	myself.mass = null;
	
	myself.setMass( amount, unit);
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will change the mass amount in this object
 * by the specified units.
 *
 * Params:	
 *  amount - The quantity that the mass will be changed.
 *  unit - The unit of the quantity.
 *
 */
Mass.prototype.setMass = function ( amount, unit ) {	
	
	var myself = this;
	
	switch( unit )
	{
		case "kg":
			
			amount *= 2.20462;
			break;
			
		case "g":
			
			amount *= 0.00220462;
			break;
			
		case "mt":
			
			amount *= 2204.62;
			break;
			
		case "oz":
			
			amount *= 0.0625;
			break;
			
		case "lb":
			
			amount = amount;
			break;
			
		case "t":
			
			amount *= 2000;
			break;
	}	
	myself.mass = amount;
	
};


/*
 * Author: Byron Wheeler
 *
 * Desc: This function will return an mass amount in the
 * specified units.
 *
 * Params:	
 *  unit - The unit of the returned quantity.
 *
 * Return: The mass in the specified unit
 */
Mass.prototype.getMass = function ( unit ) {
	
	var myself = this;
	var amount = myself.mass;
	switch( unit )
	{
		case "kg":
			
			amount *= 2.20462;
			break;
			
		case "g":
			
			amount *= 0.00220462;
			break;
			
		case "mt":
			
			amount *= 2204.62;
			break;
			
		case "oz":
			
			amount *= 0.0625;
			break;
			
		case "lb":
			
			amount = amount;
			break;
			
		case "ton":
			
			amount *= 2000;
			break;		
	}
	
	return amount;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will add this object's mass with the one passed in 
 * and return a new mass.
 *
 * Params:	
 *	amount - The quantity to be added.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A mass object from the added mass
 */
Mass.prototype.addMass = function ( amount, unit ) {
	
	var myself = this,
	    result = null;
	
	result = new Mass( myself.getMass(myself.mass, unit) + amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will subtract this object's mass from the one passed in 
 * and return a new mass.
 *
 * Params:	
 *	amount - The quantity to be subtracted.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A mass object from the subtracted mass
 */
Mass.prototype.subMass = function ( amount, unit ) {
	var myself = this,
		result = null;
	
	result = new Mass( myself.getMass(myself.mass, unit) - amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will multiply this object's mass with the one passed in 
 * and return a new mass.
 *
 * Params:	
 *	amount - The quantity to be multiplied.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A mass object from the multiplied mass
 */
Mass.prototype.mulMass = function ( amount, unit ) {
	var myself = this,
		result = null;
		
	result = new Mass( myself.getMass(myself.mass, unit) * amount, unit);		
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will divide this object's mass from the one passed in 
 * and return a new mass.
 *
 * Params:	
 *	amount - The quantity to be divided.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A mass object from the divided mass
 */

Mass.prototype.divMass = function ( amount, unit ) {
	var myself = this,
		result = null;
		
		result = new Mass( myself.getMass(myself.mass, unit) / amount, unit);
		
	return result;
};


