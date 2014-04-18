var PatchReporterBlockMorph;

PatchReporterBlockMorph.prototype = new ReporterBlockMorph();
PatchReporterBlockMorph.prototype.constructor = PatchReporterBlockMorph;
PatchReporterBlockMorph.uber = ReporterBlockMorph.prototype;

function PatchReporterBlockMorph(sizeType) {
	this.init(sizeType);
};

PatchReporterBlockMorph.prototype.init = function(sizeType1) {
	

	
	PatchReporterBlockMorph.uber.init.call(this, false);
	
	this.inputText = new InputSlotMorph( "0", true, null, false);

	this.inputType = new InputSlotMorph( null, false, null, false);
	
	this.add( this.inputText );
	this.add( this.inputType );
	
	this.fixLayout();
};


PatchReporterBlockMorph.prototype.evaluate = function() {
	var amount = this.sizeType.parseToBase( parseFloat( this.inputText.contents().text ), 
	                                  this.inputType.contents().text ) ;
	return amount;
};