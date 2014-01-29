/*
    crops.js

    a sumulation programming environment
    based on morphic.js, blocks.js, threads.js and objects.js
    inspired by Scratch and Snap!
	
	written by Nathan Bean
	nhb7817@ksu.edu
	
    Copyright (C) 2014 by Nathan Bean

    This file is part of FarmSim, built upon the Snap! libraries.

    FarmSim and Snap! are free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


    prerequisites:
    --------------
    needs blocks.js, threads.js, objects.js and morphic.js


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:

		CropSystemMorph
		CropIconMorph


    credits
    -------
	Jens Mönig contributed the bulk of the Snap! framework.
    Nathan Dinsmore contributed saving and loading of projects,
    ypr-Snap! project conversion and countless bugfixes
    Ian Reynolds contributed handling and visualization of sounds

*/

/*global modules, Morph, SpriteMorph, BoxMorph, SyntaxElementMorph, Color,
ListWatcherMorph, isString, TextMorph, newCanvas, useBlurredShadows,
radians, VariableFrame, StringMorph, Point, SliderMorph, MenuMorph,
morphicVersion, DialogBoxMorph, ToggleButtonMorph, contains,
ScrollFrameMorph, StageMorph, PushButtonMorph, InputFieldMorph, FrameMorph,
Process, nop, SnapSerializer, ListMorph, detect, AlignmentMorph, TabMorph,
Costume, CostumeEditorMorph, MorphicPreferences, touchScreenSettings,
standardSettings, Sound, BlockMorph, ToggleMorph, InputSlotDialogMorph,
ScriptsMorph, isNil, SymbolMorph, BlockExportDialogMorph,
BlockImportDialogMorph, SnapTranslator, localize, List, InputSlotMorph,
SnapCloud, Uint8Array, HandleMorph, SVG_Costume, fontHeight, hex_sha512,
sb, CommentMorph, CommandBlockMorph, BlockLabelPlaceHolderMorph*/

// Global stuff ////////////////////////////////////////////////////////

modules.crops = '2014-January-13';

// Declarations

var CropSystemMorph;
var CropIconMorph;

// CropSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's crop system editor panel

// CropSystemMorph inherits from Morph:

CropSystemMorph.prototype = new Morph();
CropSystemMorph.prototype.constructor = CropSystemMorph;
CropSystemMorph.uber = Morph.prototype;

// CropSystemMorph preferences settings and skins

// ... to follow ...

// CropSystemMorph instance creation:

CropSystemMorph.prototype.backgroundColor = new Color(20, 200, 20);
CropSystemMorph.prototype.stageBarColor = new Color(244, 20, 20);
CropSystemMorph.prototype.stageColor = new Color(255,255,255);
CropSystemMorph.prototype.corralBarColor = new Color (0,0,0); // TODO : implement, currently its the default
CropSystemMorph.prototype.corralColor = new Color(255,255,255);
CropSystemMorph.prototype.cropEditorColors = [
							new Color(20, 200, 20),              // background color of tabBar and the background color for the display morph.
							new Color(20, 233, 233).darker(15), // this is the color of the unselected tabs
							new Color(20, 233, 233) 			// this is the color of the slected panel
							];

function CropSystemMorph(aCrop) {
    this.init(aCrop);
}

CropSystemMorph.prototype.init = function (aCropSprite) {
	
	var sprite2 = new SpriteMorph(),
                sprite3 = new SpriteMorph(),
                sprite4 = new SpriteMorph(),
                sprite5 = new SpriteMorph();
        sprite2.name = "Alpha";
        sprite3.name = "Beta";
        sprite4.name = "Delta";
        sprite5.name = "Gamma";	
	
	// initialize inherited properties
	CropSystemMorph.uber.init.call(this);
	
    // add/modify properties
	
	this.currentCrop = aCropSprite || new SpriteMorph();
	this.globalVariables = new VariableFrame();
	this.crops = [this.currentCrop, sprite2, sprite3, sprite4, sprite5];
	this.currentCategory = 'motion';
	this.currentTab = 'description';
	
	this.fps = 2;
	this.setColor(CropSystemMorph.prototype.backgroundColor); 
	this.stageDimensions = new Point(240, 160);	
	this.setWidth(910);
	this.setHeight(429);
	
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.cropEditor = null;
	
	// build panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createCropEditor();
};

CropSystemMorph.prototype.createStageBar = function () {
	if(this.stageBar) {
		this.stageBar.destroy();
	}
	this.stageBar = new ControlBarMorph();
	this.stageBar.setWidth(this.stageDimensions.x);
	this.stageBar.setHeight(30);
	this.stageBar.corner = 10;
	this.stageBar.setColor( CropSystemMorph.prototype.stageBarColor );
	
	
	this.add(this.stageBar);
};

CropSystemMorph.prototype.createStage = function () {
	// assumes stageBar has already been created
	if(this.stage) {
		this.stage.destroy();
	}
	StageMorph.prototype.framerate = 0;
	this.stage = new StageMorph(this.globalVariables/* this.globalVariables? */);
	
	this.stage.setColor( CropSystemMorph.prototype.stageColor );
	
	this.stage.setExtent(this.stageDimensions); // dimensions are fixed
	this.add(this.stage);
};

CropSystemMorph.prototype.createCorralBar = function () {
	// assumes stage has already been created
	if(this.corralBar) {
		this.corralBar.destroy();
	}
	this.corralBar = new ControlBarMorph();
	
	this.corralBar.add( new StringMorph("Crops") );
	this.corralBar.setWidth(this.stageDimensions.x);
	this.corralBar.setHeight(30);
	this.add(this.corralBar);
};

CropSystemMorph.prototype.createCorral = function () {
	        // assumes corralBar has already been created
        var frame, template, padding = 5, sprites, myself = this;
        
        if (this.corral) {
                this.corral.destroy();
        }
        
        sprites = function () {
                return myself.crops;
        }
        
        this.corral = new SpriteCorralMorph(sprites, SpriteIconMorph);
        this.add(this.corral);
};

CropSystemMorph.prototype.createCropEditor = function() {

	var	myself = this;
	
	if(this.cropEditor) {
		this.cropEditor.destroy();
	}
	
	// create tab panel morph to hold the editor's pages
	this.cropEditor = new TabPanelMorph(CropSystemMorph.prototype.cropEditorColors);
	
	// add pages to the tab panel
	
	// description page
	var descEditor = new DescriptionEditorMorph();
	//descEditor.groupColor = CropSystemMorph.prototype.cropEditorColors[1];
	//descEditor.setColor( CropSystemMorph.prototype.cropEditorColors[1] );
	this.cropEditor.addTab('description', descEditor);

	// script page
	var scriptEditor = new ScriptEditorMorph();
	scriptEditor.setColor( CropSystemMorph.prototype.cropEditorColors[2] );
	this.cropEditor.addTab('scripts', scriptEditor);
	
	// costume page
	var costumeEditor = new Morph();
	costumeEditor.setColor( CropSystemMorph.prototype.cropEditorColors[2] );
	this.cropEditor.addTab('costumes', costumeEditor);
	
	// add the crop editor to the system
	this.add(this.cropEditor);
};

CropSystemMorph.prototype.fixLayout = function () {
	
	// stage bar
	this.stageBar.setPosition(this.topLeft().add(5));
	
	// stage
	this.stage.setPosition(this.stageBar.bottomLeft());
	
	// corral bar
	this.corralBar.setPosition(this.stage.bottomLeft().add(new Point(0,10)));
	
	// corral
	this.corral.setPosition(this.corralBar.bottomLeft());
	this.corral.setWidth(this.corralBar.width());
	this.corral.setHeight(this.height() - this.corralBar.position().y + 15);
	this.corral.fixLayout();
	
	// crop editor
	this.cropEditor.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.cropEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.cropEditor.setHeight(this.height() - 10);
	this.cropEditor.fixLayout();
	
	console.log("fixLayout - crop system");

};


// CropIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the CropEditor's "Crops" tab, keeping
    a self-updating thumbnail of the crop I'm representing, and a
    self-updating label of the crop's name (in case it is changed
    elsewhere)
*/

// CropIconMorph inherits from SpriteIconMorph

CropIconMorph.prototype = new ToggleButtonMorph();
CropIconMorph.prototype.constructor = CropIconMorph;
CropIconMorph.uber = ToggleButtonMorph.prototype;

// CropIconMorph settings

CropIconMorph.prototype.thumbSize = new Point(80, 60);
CropIconMorph.prototype.labelShadowOffset = null;
CropIconMorph.prototype.labelShadowColor = null;
CropIconMorph.prototype.labelColor = new Color(255, 255, 255);
CropIconMorph.prototype.fontSize = 9;

// CropIconMorph instance creation:

function CropIconMorph(aCropSprite, aTemplate) {
	this.init(aCropSprite, aTemplate);
};

CropIconMorph.prototype.init = function (aCropSprite, aTemplate) {
	var colors, action, query, myself = this;
	
	if(!aTemplate) {
		colors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.frameColor,
			IDE_Morph.prototype.frameColor
		];
	}
	
	action = function () {
		// make my sprite the current one
		var crops = myself.parentThatIsA(CropSystemMorph);
		
		if (crops) {
			console.log("Selected sprite");
			//crops.selectSprite(myself.object);
		}
	};
	
	query = function () {
		// answer if my sprite is the current one
		var crops = myself.parentThatIsA(CropSystemMorph);
		
		if (crops) {
			return crops.currentCrop === myself.object;
		}
		return false;
	};
	
	// additional properties
	this.object = aCropSprite || new SpriteMorph();
	this.version = this.object.version;
	this.thumbnail = null;
	
	// initialize inherited properties
	SpriteIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );
	
    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

CropIconMorph.prototype.createThumbnail = function () {
}
