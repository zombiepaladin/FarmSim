

var SizeReporterBlockMorph;

SizeReporterBlockMorph.prototype = new ReporterBlockMorph();
SizeReporterBlockMorph.prototype.constructor = SizeReporterBlockMorph;
SizeReporterBlockMorph.uber = ReporterBlockMorph.prototype;

function SizeReporterBlockMorph(sizeType) {
	this.init(sizeType);
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will create the prototype/class for Size reporter block morph.
 *
 * Params:	
 *  	N/A.
 *
 * Return: N/A
 */
SizeReporterBlockMorph.prototype.init = function() {
	
	var myself = this;
	SizeReporterBlockMorph.uber.init.call(this, false);
	
	this.sizes = { length: "Length",
	               area: "Area",
				   volume: "Volume",
				   mass: "Mass"
				  };
	
	this.units = {
					_:"",
	   			 };
	
	// The size input : Length, Area, Volume, or Mass.
	this.inputType = new InputSlotMorph( "Size", false, this.sizes, false);
	
	// The amount input.
	this.inputText = new InputSlotMorph( "0", true, null, false);

	// The "unit" associated with the amount.
	this.inputUnitType = new InputSlotMorph( "units", false, this.units, false);	
	
	// This event is for filling the unit type with the correct units.
	// ex: area should have square feet as an not grams.
	this.inputUnitType.mouseClickLeft = function (pos) {
		
		var sizeType = myself.inputType.contents().text;
		switch( sizeType )
		{
			case "Length":
				myself.units = Length.units;
				myself.inputUnitType.setChoices( myself.units, false );
			break;
			case "Area":
				myself.units = Area.units;
				myself.inputUnitType.setChoices( myself.units, false );
			break;
			case "Volume":
				myself.units = Volume.units;
				myself.inputUnitType.setChoices( Volume.units, false );
			break;
			case "Mass":
				myself.units = Mass.units;
				myself.inputUnitType.setChoices( Mass.units, false );
			break;
		}
		
		if (this.arrow().bounds.containsPoint(pos)) {
			this.dropDownMenu();
		} else if (this.isReadOnly) {
			this.dropDownMenu();
		} else {
			this.contents().edit();
			this.contents().selectAll();
		}

	};

	this.add( this.inputType );
	this.add( this.inputText );
	this.add( this.inputUnitType );
	
	this.fixLayout();
};

/*
 * Author: Byron Wheeler
 *
 * Desc: This function will evaluate the this size reporter block morph.
 * It will return the amount that is entered in the base unit.
 * The base unit is determined from the users input for the type of size
 *
 * Params:	
 *  	N/A.
 *
 * Return: The amount as specifed by the base unit.
 */
SizeReporterBlockMorph.prototype.evaluate = function() {
	
	var unit, 
		amount,
		size,
		result = null;
	
	// read in the inputs
	unit = this.inputUnitType.contents().text
	amount = parseFloat( this.inputText.contents().text ) ;
	size = this.inputType.contents().text;
	
	// get correct type.
	switch( size )
		{
			case "Length":
				sizeType = Length;
			break;
			case "Area":
				sizeType = Area;
			break;
			case "Volume":
				sizeType = Volume;
			break;
			case "Mass":
				sizeType = Mass;
			break;
		}
	
	// the try catch is for if the user changed the size and forgot to change the unit. 
	// ex. The user changed from mass to length and forgot that 5 "grams" cannot be a length.
	try
	{
		result = sizeType.parseToBase( amount, unit);
	} catch( error)
	{
		result = sizeType.parseToBase(amount, sizeType.baseUnit );
	}

	return result;
	
	
	
};

