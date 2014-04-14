



// square kilometer, square meter, square foot, square yard, square mile, acer, hectare, section
Area.units = { "km2", "m2", "ft2", "yd2", "mi2", "a", "ha" , "sec" };

Area.baseUnit = "ft2";

function Area( amount, unit ){
	this.init( amount, unit);
};

Area.prototype.init = function ( amount, unit ) {
	
	var this = myself;
	this.Area = null;
	myself.setArea( amount, unit);
	
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will change the area amount in this object
 * by the specified units.
 *
 * Params:	
 *  amount - The quantity that the area will be changed.
 *  unit - The unit of the quantity.
 *
 */
Area.prototype.setArea = function ( amount, unit ) {	
	
	var myself = this;
	
	switch( unit )
	{
		case "km2":
			amount 
			break;
		case "m2":
			amount 
			break;
		case "ft2":
			amount 
			break;
		case "yd2":
			amount 
			break;
		case "mi2":
			amount 
			break;
		case "a":
			amount 
			break;
		case "ha":
			amount 
			break;
		case "sec":
			amount 
			break;
		
	}	
	myself.Area = amount;
	
};


/*
 * Author: Byron Wheeler
 *
 * Desc: This function will return an area amount in the
 * specified units.
 *
 * Params:	
 *  unit - The unit of the returned quantity.
 *
 * Return: The area in the specified unit
 */
Area.prototype.getArea = function ( unit ) {
	
	var myself = this;
	var area = null;
	switch( unit )
	{
		case "km2":
			area  = new Area();
			break;
		case "m2":
			area  = new Area(); 
			break;
		case "ft2":
			area  = new Area(); 
			break;
		case "yd2":
			area  = new Area(); 
			break;
		case "mi2":
			area  = new Area(); 
			break;
		case "a":
			area  = new Area(); 
			break;
		case "ha":
			area  = new Area(); 
			break;
		case "sec":
			area  = new Area(); 
			break;	
	}
	
	return len;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will add this object's area with the one passed in 
 * and return a new area.
 *
 * Params:	
 *	amount - The quantity to be added.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A area object from the added area
 */
Area.prototype.addArea = function ( amount, unit ) {
	
	var myself = this,
	    result = null;
	
	result = new Area( myself.getArea(myself.Distance, unit) + amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will subtract this object's area from the one passed in 
 * and return a new area.
 *
 * Params:	
 *	amount - The quantity to be subtracted.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A area object from the subtracted area
 */
Area.prototype.subArea = function ( amount, unit ) {
	var myself = this,
		result = null;
	
	result = new Area( myself.getArea(myself.Distance, unit) - amount, unit);
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will multiply this object's area with the one passed in 
 * and return a new area.
 *
 * Params:	
 *	amount - The quantity to be multiplied.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A area object from the multiplied area
 */
Area.prototype.mulArea = function ( amount, unit ) {
	var myself = this,
		result = null;
		
	result = new Area( myself.getArea(myself.Distance, unit) * amount, unit);		
	
	return result;
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will divide this object's area from the one passed in 
 * and return a new area.
 *
 * Params:	
 *	amount - The quantity to be divided.
 *  unit - The unit of the quantity passed in.
 *
 * Return: A area object from the divided area
 */

Area.prototype.divArea = function ( amount, unit ) {
	var myself = this,
		result = null;
		
		result = new Area( myself.getArea(myself.Distance, unit) / amount, unit);
		
	return result;
};


