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
	
	// create submorphs for the page
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
	this.createFrame();	
	
	// create layout
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

	
	this.informationLabel = new StringMorph("Information: ", null, null, true);         // bold

	this.titleLabel = new StringMorph("Title : ", null, null, null, true);              // italic 
	this.titleTextBox = new TextBoxMorph(null, null, null, "<Enter Title Here>");       
	this.authorLabel = new StringMorph("Author : ", null, null, null, true);            // italic
	this.authorTextBox = new TextBoxMorph(null, null, null, "<Enter Author Here>");      
	this.updateButton = null;
	this.updateLabel = new StringMorph("Last Updated: ", null, null, null, true);       // italic
	this.updateText = new TextMorph("MM/DD/YYYY");
	this.updateText.isEditable = true;
	this.summaryLabel = new StringMorph("Summary: ", null, null, true);					// bold
	this.summaryTextBox = new TextBoxMorph(null, null, null, "<Enter Summary Here>");   
	this.commentLabel = new StringMorph("Comments: ", null, null, true);                // bold
	this.commentTextBox = new TextBoxMorph(null, null, null, "<Enter Comments Here>");

	
	this.frame.contents.add( this.informationLabel );
	this.frame.contents.add( this.titleLabel );
	this.frame.contents.add( this.titleTextBox );
	this.frame.contents.add( this.authorLabel );
	this.frame.contents.add( this.authorTextBox );
	//this.frame.contents.add( this.updateButton );
	this.frame.contents.add( this.updateLabel );
	this.frame.contents.add( this.updateText );
	this.frame.contents.add( this.summaryLabel );
	this.frame.contents.add( this.summaryTextBox );
	this.frame.contents.add( this.commentLabel );
	this.frame.contents.add( this.commentTextBox );
	
	this.frame.fixLayout = function() {
		
		var myselfFrame = this;
		var padding = 3;
		
		// inforamtion label.
		myself.informationLabel.setPosition( myself.frame.topLeft().add( new Point( padding, padding) ) );
		
		// title label.
		myself.titleLabel.setPosition( new Point(myself.frame.left() + 6*padding, myself.informationLabel.bottom() + padding) );
		
		// title text box.
		myself.titleTextBox.setWidth(200);
		myself.titleTextBox.setHeight(myself.titleLabel.height()  + padding*2);
		myself.titleTextBox.setPosition( new Point(myself.titleLabel.right() + 6*padding, myself.titleLabel.top() -padding) );
		
		// author label.
		myself.authorLabel.setPosition( new Point( myself.titleLabel.left() ,myself.titleTextBox.bottom() + padding) );
		
		// author textbox.
		myself.authorTextBox.setWidth(200);
		myself.authorTextBox.setHeight(myself.authorLabel.height() + padding*2);
		myself.authorTextBox.setPosition( new Point( myself.titleTextBox.left(), myself.authorLabel.top()) );
		
		// update button
		// TODO: place button
		
		// update label
		myself.updateLabel.setPosition( new Point( myself.frame.right() - myself.updateLabel.width() - 2*padding, myself.frame.top() + 2*padding) ) ;
		
		// update text box
		myself.updateText.setPosition( myself.updateLabel.bottomLeft().add( new Point( 0, padding) ) );
		
		// summary label
		myself.summaryLabel.setPosition( new Point( myself.frame.left() + padding, myself.authorTextBox.bottom() + padding) );
		
		// summary text box
		myself.summaryTextBox.setWidth( myself.width() - 8*padding);
		myself.summaryTextBox.setHeight( 3*myself.summaryLabel.height() + 2*padding);
		myself.summaryTextBox.setPosition( new Point( myself.authorLabel.left(), myself.summaryLabel.bottom() + padding ) );
		
		// comments label
		myself.commentLabel.setPosition( new Point( myself.frame.left()+ padding, myself.summaryTextBox.bottom() + padding) );
		
		// comments text box
		myself.commentTextBox.setWidth( myself.width() - 8*padding);
		myself.commentTextBox.setHeight( 3*myself.commentLabel.height() + 2*padding);
		myself.commentTextBox.setPosition( new Point( myself.authorLabel.left() , myself.commentLabel.bottom() + padding) );
		
	};
	
	
	// properties
	this.frame.acceptsDrops = false;
	this.frame.contents.acceptsDrops = false;
	this.frame.setColor( new Color( 0, 100, 255 ).lighter(30) );
	
	
	this.add(this.frame);
	
	
};				
										

DescriptionEditorMorph.prototype.fixLayout = function() {
	var myself = this;
	var padding = 2;
	
	// frame
	this.frame.setWidth( myself.width() - 2 * padding );
	this.frame.setHeight( myself.height() - 2 * padding );
	this.frame.setPosition( myself.topLeft().add( new Point( padding, padding) ) );
	
	
	this.frame.fixLayout();
	// this.refresh(); // may not be needed for just text boxes or labels but probably the button.
};


DescriptionEditorMorph.prototype.toggleTextBoxes = function() {
	this.title.editButton.labelString = "save";
}

DescriptionEditorMorph.prototype.setExtent = function (point) {
	DescriptionEditorMorph.uber.setExtent.call(this, point);
	this.fixLayout();
};
