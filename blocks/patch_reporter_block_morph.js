var PatchReporterBlockMorph;

PatchReporterBlockMorph.prototype = new ReporterBlockMorph();
PatchReporterBlockMorph.prototype.constructor = PatchReporterBlockMorph;
PatchReporterBlockMorph.uber = ReporterBlockMorph.prototype;

function PatchReporterBlockMorph() {
	this.init();
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will create the prototype/class for Patch reporter block morph.
 *
 * Params:	
 *  	N/A.
 *
 * Return: N/A
 */
PatchReporterBlockMorph.prototype.init = function() {
	
	PatchReporterBlockMorph.uber.init.call(this, false);
	
	this.patch = new Patch( );

	this.inputType = new InputSlotMorph( this.patch.name, true, Patch.properties , false);
	
	this.add( this.inputType );

	this.fixLayout();
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will evaluate the this patch reporter block morph.
 * It will return the amount of the associated property that the user wants
 *
 * This function assumes whatever is stored in the patch is already the base unit.
 *
 * Params:	
 *  	N/A.
 *
 * Return: The associated property.
 */
PatchReporterBlockMorph.prototype.evaluate = function() {
									  
				
	var result = null;
	
	switch( Path.properties )
	{
		case Patch.location:
			result =  this.patch.location;
		break;
		case Patch.soil:
			result =  this.patch.soil;
		break;
		case Patch.plant:
			result =  this.patch.plant;
		break;
		case Patch.water:
			result =  this.patch.water; // assuming that this property is in it's base units
		break;
		case Patch.nitrogen:
			result =  this.patch.nitrogen; // assuming that this property is in it's base units
		break;
		case Patch.potassium:
			result =  this.patch.potassium; // assuming that this property is in it's base units
		break;
		case Patch.phosphorus:
			result =  this.patch.phosphorus; // assuming that this property is in it's base units
		break;

	}

	return result;
};