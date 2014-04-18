
var Area;



Area.units = { 
               kilometer_squared : "km2" , // square kilometer
               meter_squared     : "m2"  , // square meter
			   feet_squared      : "ft2" , // square foot
			   yard_squared      : "yd2" , // square yard
			   mile_squared      : "mi2" , // square mile
			   acre              : "a"   , // acer
			   hectare           : "ha"  , // hectare
			   section           : "sec"   // section
			 };

Area.baseUnit = Area.units.feet_squared;

/*
 * Author: Byron Wheeler
 *
 * Desc: This global unction will return an area amount in the
 * specified units.
 *
 * Params:	
 *  amount the amount of the unit passed in.
 *  unit - The unit of the returned quantity.
 *
 * Return: The area in the specified unit
 */
Area.parseToBase = function( amount, unit ){
	
	var myself = this;

	switch( unit )
	{
		case "km2":
		
			amount *= 1.076e7;
			break;
			
		case "m2":
		
			amount *=  10.7639;
			break;
			
		case "ft2":
		
			amount *= amount; 
			break;
			
		case "yd2":
		
			amount *= 9;
			break;    
			          
		case "mi2":   
		              
			amount *= 27878400;
			break;    
			          
		case "a":     
		              
			amount *= 43560;
			break;    
			          
		case "ha":    
		              
			amount *= 107639;
			break;    
			          
		case "sec":   
		              
			amount *= 27878400;
			break;	
	}
	
	return amount;
};



function Area( amount, unit ){
	this.init( amount, unit);
};

Area.prototype.init = function ( amount, unit ) {
	
	var myself = this;
	
	myself.area = null;
	myself.name = "Area";
	
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
		
			amount *= 1.076e7;
			break;
			
		case "m2":
		
			amount *= 10.7639;
			break;
			
		case "ft":
		
			amount = amount;
			break;
			
		case "yd":
		
			amount *= 9;
			break;
			
		case "mi2":
		
			amount *= 27878400;
			break;
			
		case "a":
		
			amount *= 43560;
			break;
			
		case "ha":
		
			amount *= 107639;
			break;
			
		case "sec":
		
			amount *= 27878400;
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
	var amount = myself.area;
	switch( unit )
	{
		case "km2":
		
			amount /= 1.076e7;
			break;
			
		case "m2":
		
			amount /=  10.7639;
			break;
			
		case "ft2":
		
			amount /= amount; 
			break;
			
		case "yd2":
		
			amount /= 9;
			break;    
			          
		case "mi2":   
		              
			amount /= 27878400;
			break;    
			          
		case "a":     
		              
			amount /= 43560;
			break;    
			          
		case "ha":    
		              
			amount /= 107639;
			break;    
			          
		case "sec":   
		              
			amount /= 27878400;
			break;	
	}
	
	return amount;
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
	
	result = new Area( myself.getArea(myself.area, unit) + amount, unit);
	
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
	
	result = new Area( myself.getArea(myself.area, unit) - amount, unit);
	
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
		
	result = new Area( myself.getArea(myself.area, unit) * amount, unit);		
	
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
		
		result = new Area( myself.getArea(myself.area, unit) / amount, unit);
		
	return result;
};


