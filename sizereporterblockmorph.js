

var SizeReporterBlockMorph;

SizeReporterBlockMorph.prototype = new ReporterBlockMorph();
SizeReporterBlockMorph.prototype.constructor = SizeReporterBlockMorph;
SizeReporterBlockMorph.uber = ReporterBlockMorph.prototype;

function SizeReporterBlockMorph(sizeType) {
	this.init(sizeType);
};

SizeReporterBlockMorph.prototype.init = function(sizeType1) {
	
	this.sizeType = sizeType1;
	
	SizeReporterBlockMorph.uber.init.call(this, false);
	
	this.inputText = new InputSlotMorph( "0", true, null, false);

	this.inputType = new InputSlotMorph( sizeType1.name, false, sizeType1.units, false);
	
	this.add( this.inputText );
	this.add( this.inputType );
	
	this.fixLayout();
};


SizeReporterBlockMorph.prototype.evaluate = function() {
	var amount = this.sizeType.parseToBase( parseFloat( this.inputText.contents().text ), 
	                                  this.inputType.contents().text ) ;
	return amount;
};