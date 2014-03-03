var SpriteEditorMorph;

// SpriteEditorMorph //////////////////////////////////////////////////////

// I am an editor for a collection of FarmSim model sprites

// SpriteEditorMorph inherits from Morph:

SpriteEditorMorph.prototype = new Morph();
SpriteEditorMorph.prototype.constructor = SpriteEditorMorph;
SpriteEditorMorph.uber = Morph.prototype;

// SpriteEditorMorph preferences settings and skins

SpriteEditorMorph.prototype.backgroundColor = new Color(20, 200, 20);
SpriteEditorMorph.prototype.stageBarColor = new Color(244, 20, 20);
SpriteEditorMorph.prototype.stageColor = new Color(255,255,255);
SpriteEditorMorph.prototype.corralBarColor = new Color (0,0,0); // TODO : implement, currently its the default
SpriteEditorMorph.prototype.corralColor = new Color(255,255,255);
SpriteEditorMorph.prototype.scriptEditorColors = [
							new Color(20, 200, 20),              // background color of tabBar and the background color for the display morph.
							new Color(20, 233, 233).darker(15), // this is the color of the unselected tabs
							new Color(20, 233, 233) 			// this is the color of the slected panel
							];

// SpriteEditorMorph instance creation:

function SpriteEditorMorph(universalVariables, sprites) {
	this.init(universalVariables, sprites);
};

SpriteEditorMorph.prototype.init = function (universalVariables, sprites, spriteType, spriteIconType) {

	// initialize inherited properties
	SpriteEditorMorph.uber.init.call(this);
	
    // add/modify properties
	this.spriteType = spriteType || SpriteMorph;
	this.spriteIconType = spriteIconType || SpriteIconMorph;
	this.globalVariables = new VariableFrame(universalVariables);
	
	if (sprites === undefined || sprites.size === 0) {
		this.sprites = [new this.spriteType(this.globalVariables)];
	} else {
		this.sprites = sprites;
	}
	
	this.currentSprite = this.sprites[0];
	this.currentCategory = 'motion';
	this.currentTab = 'description';
	
	this.fps = 2;
	this.setColor(SpriteEditorMorph.prototype.backgroundColor); 
	this.stageDimensions = new Point(240, 160);	
	this.setWidth(910);
	this.setHeight(429);
	
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.tabs = null;
	this.scriptEditor = null;
	this.descEditor = null;
	
	// build panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createTabs();
	this.selectSprite( this.currentSprite );
};

SpriteEditorMorph.prototype.createStageBar = function () {
	if(this.stageBar) {
		this.stageBar.destroy();
	}
	this.stageBar = new ControlBarMorph();
	this.stageBar.setWidth(this.stageDimensions.x);
	this.stageBar.setHeight(30);
	this.stageBar.corner = 10;
	this.stageBar.setColor( SpriteEditorMorph.prototype.stageBarColor );
	
	
	this.add(this.stageBar);
};

SpriteEditorMorph.prototype.createStage = function () {
	var myself = this;
	
	// assumes stageBar has already been created
	if(this.stage) {
		this.stage.destroy();
	}
	StageMorph.prototype.framerate = 0;
	this.stage = new StageMorph(this.globalVariables/* this.globalVariables? */);
	
	this.stage.setColor( SpriteEditorMorph.prototype.stageColor );
	
	this.stage.setExtent(this.stageDimensions); // dimensions are fixed
	this.add(this.stage);
	
	this.sprites.forEach( function(sprite) {
		myself.stage.add(sprite);
		if (sprite === myself.currentSprite) { // only display the current sprite
			sprite.show();
		} else {
			sprite.hide();
		}
	});
	this.currentSprite.setCenter(this.stage.center());
};

SpriteEditorMorph.prototype.createCorralBar = function () {
	// assumes stage has already been created
	if(this.corralBar) {
		this.corralBar.destroy();
	}
	
	var myself = this;
	
	this.corralBar = new ControlBarMorph();
	
	// additional corral bar properties.
	this.corralBar.padding = 3;
	this.corralBar.title = null;
	this.corralBar.importButton = null;
	this.corralBar.exportButton = null;
	
	this.corralBar.title = new StringMorph("Title");
	
	this.corralBar.importButton = new ToggleButtonMorph(
														null,
														this,
														function() { 
															
															myself.importSprite();
															
														},
														"Import",
														null,
														null														
														);
	this.corralBar.exportButton = new ToggleButtonMorph(
														null,
														this,
														function() { myself.currentSprite.exportSprite(); },
														"Export",
														null,
														null
														);	
	
	
	
	this.corralBar.add( this.corralBar.title );
	this.corralBar.add( this.corralBar.importButton );
	this.corralBar.add( this.corralBar.exportButton );
	
	this.corralBar.fixLayout = function() {
		
		myself.corralBar.title.setPosition( myself.corralBar.topLeft().add(10, 10) );
		myself.corralBar.importButton.setPosition( new Point( myself.corralBar.title.right()+ myself.corralBar.padding , myself.corralBar.title.top() ) );
		myself.corralBar.exportButton.setPosition( new Point( myself.corralBar.importButton.right() + myself.corralBar.padding, myself.corralBar.title.top() ) );
		
	};
	
	
	this.add(this.corralBar);
};

SpriteEditorMorph.prototype.createCorral = function () {
	    // assumes corralBar has already been created
        var frame, template, padding = 5, sprites, myself = this;
        
        if (this.corral) {
                this.corral.destroy();
        }
        
        sprites = function () {
                return myself.sprites;
        }
        
        this.corral = new SpriteCorralMorph(this.sprites);
        this.add(this.corral);
		
		this.sprites.forEach( function(sprite) {
			myself.corral.addSprite(sprite);
		});
		
};

SpriteEditorMorph.prototype.createTabs = function() {

	var	myself = this;
	
	if(this.tabs) {
		this.tabs.destroy();
	}
	
	// create tab panel morph to hold the editor's pages
	this.tabs = new TabPanelMorph(SpriteEditorMorph.prototype.scriptEditorColors);
	
	// add pages to the tab panel
	
	// description page
	this.descEditor = new DescriptionEditorMorph(null, this.corral);
	this.descEditor.setColor( SpriteEditorMorph.prototype.scriptEditorColors[2] );
	this.tabs.addTab('description', 	this.descEditor);

	// script page
	if(this.scriptEditor) {
		this.scriptEditor.destroy();
	}
	this.scriptEditor = new ScriptEditorMorph();
	this.scriptEditor.setColor( SpriteEditorMorph.prototype.scriptEditorColors[2] );
	this.tabs.addTab('scripts', this.scriptEditor);
	
	// costume page
	var costumeEditor = new Morph();
	costumeEditor.setColor( SpriteEditorMorph.prototype.scriptEditorColors[2] );
	this.tabs.addTab('costumes', costumeEditor);
	
	// add the script editor to the system
	this.add(this.tabs);
};

SpriteEditorMorph.prototype.fixLayout = function () {
	
	// stage bar
	this.stageBar.setPosition(this.topLeft().add(5));
	
	// stage
	this.stage.setPosition(this.stageBar.bottomLeft());
	
	// corral bar
	this.corralBar.setPosition(this.stage.bottomLeft().add(new Point(0,10)));
	this.corralBar.setWidth(this.stageDimensions.x);
	this.corralBar.setHeight(50);
	this.corralBar.fixLayout();
	
	
	// corral
	this.corral.setPosition(this.corralBar.bottomLeft());
	this.corral.setWidth(this.corralBar.width());
	this.corral.setHeight(this.height() - this.corralBar.position().y + 15);
	this.corral.fixLayout();
	
	// tabs
	this.tabs.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.tabs.setWidth(this.width() - this.stageBar.width() - 30);
	this.tabs.setHeight(this.height() - 10);
	this.tabs.fixLayout();
	
};

// SpriteEditorMorph sprite list access

SpriteEditorMorph.prototype.addNewSprite = function () {
	var sprite = [new this.spriteType(this.globalVariables)];
	
	sprite.name = sprite.name 
		+ (this.corral.frame.contents.children.length + 1);
	sprite.setCenter(this.stage.center());
	this.stage.add(sprite);
	
	this.sprites.add(sprite);
	this.corral.addSprite(sprite);
	this.selectSprite(sprite);
};

SpriteEditorMorph.prototype.selectSprite = function (sprite) {
	this.currentSprite.hide();
	this.currentSprite = sprite;
	this.currentSprite.show();
	
	this.descEditor.loadSprite( this.currentSprite );
	
	this.scriptEditor.loadSprite(this.currentSprite);
	this.fixLayout();
};


SpriteEditorMorph.prototype.importSprite = function() {
	
	var inputXml = '"<project><sprite morphType="Crop" name="Corn!!" idx="0" x="0" y="0" heading="90" scale="1" rotation="1" draggable="true" costume="0" color="80,80,80" pen="tip" id="1"><costumes><list id="2"></list></costumes><sounds><list id="3"></list></sounds><variables></variables><blocks></blocks><scripts></scripts><description></description></sprite></project>"';
	
	SimulatorMorph.prototype.serializer.loadSprites(inputXml,this);
	
	
	
};