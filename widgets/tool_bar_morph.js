var ToolBarMorph;

// ToolBarMorph ///////////////////////////////////////////////////////

// ToolBarMorph inherits from Morph:

ToolBarMorph.prototype = new Morph();
ToolBarMorph.prototype.constructor = ToolBarMorph;
ToolBarMorph.uber = Morph.prototype;

// ToolBarMorph instance creation:

function ToolBarMorph() {
    this.init();
}

ToolBarMorph.prototype.init = function() {
	
	this.iconMorphs = null; // this should be pass in as a parameter
	
	this.color = new Color( 255, 255, 255);
	
	this.saveButton = new ToggleButtonMorph( null, this, null,"Save");
	this.add( this.saveButton );
	
	
};

ToolBarMorph.prototype.fixLayout = function() {
	
	var myself = this;
	var padding = 5;
	
	if( this.iconMorphs )
	{
		this.iconMorphs.forEach( function(icon, i, icons) {
			
			icon.setPosition( myself.position().add( new Point( i * icon.width() + padding, 10 ) ) );
			
		});
	}
	//this.saveButton.setPosition( myself.postion().add( new Point( 10, 10 ) ) );
	
	
	
};

