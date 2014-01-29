var DescriptionEditorMorph;

// DescriptionEditorMorph ///////////////////////////////////////

// I am an editor that allows you to edit a sprite's scripts

// DescriptionEditorMorph inherits from Morph:

DescriptionEditorMorph.prototype = new Morph();
DescriptionEditorMorph.prototype.constructor = TabPanelMorph;
DescriptionEditorMorph.uber = Morph.prototype;

// DescriptionEditorMorph instance creation:

function DescriptionEditorMorph(aSprite){
	this.init(aSprite);
};

DescriptionEditorMorph.prototype.init = function (aSprite) {
	var myself = this;
	
	// set the default properties.
	DescriptionEditorMorph.uber.init.call(this);
	
	// modify / add properties
	this.currentSprite = aSprite || new SpriteMorph();
	this.defaultWidth = 200;
	this.currentCategory = 'motion';
	this.setColor( new Color( 0,0,0) ) ; //DescriptionEditorMorph.prototype.backgroundColor );
	
	
	this.frame = null;
	this.informationLabel = null;
	this.titleLabel = null;
	this.titleTextBox = null;
	this.authorLabel = null;
	this.authorTextBox = null;
	this.updateButton = null;
	this.updateLabel = null;
	this.updateTextBox = null;
	this.summaryLabel = null
	this.summaryTextBox = null;
	this.commentLabel = null;
	this.commentTextBox = null;

	
	this.updateButton = null; // TODO: need to implement
		
	// create layout

	this.createFrame();
	
	this.addToFrame(this.informationLabel, "Information: ", "label");
	this.addToFrame(this.informationLabel, "Title: ", "label");
	this.addToFrame(this.informationLabel, "<Enter Title Here>", "textbox");
	this.addToFrame(this.informationLabel, "Author: ", "label");
	
	
	this.fixLayout();
};

DescriptionEditorMorph.prototype.frameColor = new Color(60,60,60);
DescriptionEditorMorph.prototype.groupColor = new Color(255, 255, 255);
DescriptionEditorMorph.prototype.backgroundColor = new Color (0,0,0);
DescriptionEditorMorph.prototype.editButtonColors = [ new Color(189,149,57).darker(40),
													  new Color(189,149,57).lighter(60),
													  new Color(189,149,57)
													];



													
DescriptionEditorMorph.prototype.createFrame = function() {
	
	var myself = this;
	
	if( this.frame)
	{
		this.frame.destroy();
	}
	
	this.frame = new ScrollFrameMorph( null, null, null );
	/*
	this.informationLabel = new StringMorph("Information: ");
	this.titleLabel = new StringMorph("Title: ");
	this.titleTextBox = new TextMorph("<Enter Title Here>");
	
	this.titleTextBox.isEditable = true;
	this.titleTextBox.backgroundColor = new Color(255, 255, 255);
	
	this.authorLabel = new StringMorph("Author: ");
	this.authorTextBox = new TextMorph("<Enter Author Here>");
	
	
	
	
	this.frame.contents.add( this.informationLabel);
	this.frame.contents.add( this.titleLabel);
	this.frame.contents.add( this.titleTextBox);
	this.frame.contents.add( this.authorLabel);
	this.frame.contents.add( this.authorTextBox);
	*/
	
	
	
	
	// properties
	this.frame.acceptsDrops = false;
	this.frame.contents.acceptsDrops = false;
	this.frame.setColor( new Color( 30, 30, 30 ).lighter(50) );
	
	
	this.add(this.frame);
	
	
};				

DescriptionEditorMorph.prototype.addToFrame = function( item, name, stringKind ) {
	if( this.frame)
	{
		switch(stringKind)
		{
			case "label":
			
				item = new StringMorph(name);
				
			break;
			case "textbox":
			
				item = new TextMorph(name);
				item.isEditable = true;
				item.backgroundColor = new Color( 255, 255, 255);
				
			break;			
		}
		this.frame.contents.add(item);
	}
};
												

DescriptionEditorMorph.prototype.fixLayout = function() {
	var myself = this;
	var padding = 2;
	/*
	// title
	this.title.setWidth( this.width() -2*padding);
	this.title.setHeight(60);
	this.title.setPosition( this.topLeft().add( new Point( padding, padding ) ) );
	this.title.fixLayout();
	
	// body
	this.body.setWidth( this.width() - 2*padding );
	this.body.setHeight( (this.height() - this.title.height() ) /2 - 2*padding );
	this.body.setPosition( this.title.bottomLeft().add( new Point( 0, padding ) ) );
	this.body.fixLayout();
	
	// notes
	this.notes.setWidth( this.width() -2*padding);
	this.notes.setHeight( (this.height() - this.title.height() ) /2 - 2*padding );
	this.notes.setPosition( this.body.bottomLeft().add( new Point(0, padding) ) );
	*/
		
	// frame
	this.frame.setWidth( myself.width() - 2 * padding );
	this.frame.setHeight( myself.height() - 2 * padding );
	this.frame.setPosition( myself.topLeft().add( new Point( padding, padding) ) );
	
	
	this.frame.contents.adjustBounds();
	this.arrangeContents();
	// this.refresh(); // may not be needed for just text boxes or labels but probably the button.
};

DescriptionEditorMorph.prototype.arrangeContents = function() {
	
	var padding = 3;
	var myself = this;
	var y = 0;
	
	this.frame.contents.children[0].setPosition( this.topLeft().add( padding, padding ) ); // information label
	this.frame.contents.children.forEach( function( item) {
		
		item.setPosition( myself.topLeft().add( new Point( padding, y + padding ) ) );
		y += item.height();
	
		
	});
};

DescriptionEditorMorph.prototype.toggleTextBoxes = function() {
	this.title.editButton.labelString = "save";
}

DescriptionEditorMorph.prototype.setExtent = function (point) {
	ScriptEditorMorph.uber.setExtent.call(this, point);
	this.fixLayout();
};