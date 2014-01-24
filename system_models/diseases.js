/*

    diseases.js

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

		DiseaseSystemMorph
		DiseaseIconMorph


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

modules.diseases = '2014-January-13';

// Declarations

var DiseaseSystemMorph;
var DiseaseIconMorph;

// DiseaseSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's disease system editor panel

// DiseaseSystemMorph inherits from Morph:

DiseaseSystemMorph.prototype = new Morph();
DiseaseSystemMorph.prototype.constructor = DiseaseSystemMorph;
DiseaseSystemMorph.uber = Morph.prototype;

// DiseaseSystemMorph preferences settings and skins

// ... to follow ...

// DiseaseSystemMorph instance creation:

DiseaseSystemMorph.prototype.backgroundColor = new Color(20, 200, 20);
DiseaseSystemMorph.prototype.stageBarColor = new Color(244, 20, 20);
DiseaseSystemMorph.prototype.stageColor = new Color(255,255,255);
DiseaseSystemMorph.prototype.corralBarColor = new Color (0,0,0); // TODO : implement, currently its the default
DiseaseSystemMorph.prototype.corralColor = new Color(255,255,255);
DiseaseSystemMorph.prototype.diseaseEditorColors = [
							new Color(20, 200, 20),              // background color of tabBar and the background color for the display morph.
							new Color(20, 233, 233).darker(15), // this is the color of the unselected tabs
							new Color(20, 233, 233) 			// this is the color of the slected panel
							];

function DiseaseSystemMorph(aDiseaseSprite) {
    this.init(aDiseaseSprite);
}

DiseaseSystemMorph.prototype.init = function (aDiseaseSprite) {
	
	var sprite2 = new SpriteMorph(),
	sprite3 = new SpriteMorph(),
	sprite4 = new SpriteMorph();
	
	sprite2.name = 'dis 2';
	sprite3.name = 'dis 3';
	sprite4.name = 'dis 4';
	
    // additional properties
	this.currentDisease = aDiseaseSprite || new SpriteMorph();
	
	this.globalVariables = new VariableFrame();
	this.diseases = [this.currentDisease, sprite2, sprite3, sprite4 ]; // list of diseases
	this.currentCategory = 'motion';
	this.currentTab = 'scripts';
	this.stageDimensions = new Point(240, 160);
	
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.pallette = null;
	this.diseaseEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	// initialize inherited properties
	DiseaseSystemMorph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor( DiseaseSystemMorph.prototype.backgroundColor ); 
	
	// build panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createDiseaseEditor();
};

// this function creates the stage bar.
DiseaseSystemMorph.prototype.createStageBar = function () {
	if(this.stageBar) {
		this.stageBar.destroy();
	}
	this.stageBar = new ControlBarMorph();
	this.stageBar.setWidth(this.stageDimensions.x);
	this.stageBar.setHeight(30);
	this.stageBar.corner = 10;
	this.stageBar.setColor( DiseaseSystemMorph.prototype.stageBarColor );
	
	
	this.add(this.stageBar);
};

// this funciton creates the stage.
DiseaseSystemMorph.prototype.createStage = function () {
	// assumes stageBar has already been created
	if(this.stage) {
		this.stage.destroy();
	}
	StageMorph.prototype.framerate = 0;
	this.stage = new StageMorph(this.globalVariables/* this.globalVariables? */);
	
	this.stage.setColor(DiseaseSystemMorph.prototype.stageColor);
	this.stage.setExtent(this.stageDimensions); // dimensions are fixed
	
	this.add(this.stage);
};

// this funciton creates the corral bar.
DiseaseSystemMorph.prototype.createCorralBar = function () {
	// assumes stage has already been created
	if(this.corralBar) {
		this.corralBar.destroy();
	}
	this.corralBar = new ControlBarMorph();
	
	this.corralBar.add( new StringMorph("Diseases") );
	this.corralBar.setWidth(this.stageDimensions.x);
	this.corralBar.setHeight(30);
	this.add(this.corralBar);
};

// this function creates the corral
DiseaseSystemMorph.prototype.createCorral = function () {
	var frame, template, padding = 5, sprites, myself = this;
	
		console.log("create disease corral");
	
	// remove any previous stage bars.
	if(this.corral){
		this.corral.destroy();
	}
		
		sprites = function () {
                return myself.diseases;
        }
        
        this.corral = new SpriteCorralMorph(sprites, SpriteIconMorph);	
	
	// add the stage bar to the disease system.
	this.add(this.corral);
};

// creates the disease editor window.
DiseaseSystemMorph.prototype.createDiseaseEditor = function() {

	var myself = this;
		
	// check if there is aready one and take care of it.
	if(this.diseaseEditor) {
		this.diseaseEditor.destroy();
	}
	
	// create the tab panel to hold the disease editor.
	this.diseaseEditor = new TabPanelMorph(DiseaseSystemMorph.prototype.diseaseEditorColors);
	
	// add tabs to the tab panel
	
	// description tab
	var descEditor = new Morph();
	descEditor.setColor( DiseaseSystemMorph.prototype.diseaseEditorColors[2] );
	this.diseaseEditor.addTab('description', descEditor);

	// script tab
	var scriptEditor = new ScriptEditorMorph();
	scriptEditor.setColor( DiseaseSystemMorph.prototype.diseaseEditorColors[2] );
	this.diseaseEditor.addTab('scripts', scriptEditor);
	
	// costume tab
	var costumeEditor = new Morph();
	costumeEditor.setColor( DiseaseSystemMorph.prototype.diseaseEditorColors[2] );
	this.diseaseEditor.addTab('costumes', costumeEditor);
	
	// add disease editor to the disease system
	this.add(this.diseaseEditor);
};

// this function sets the position / layout of all the system morphs.
DiseaseSystemMorph.prototype.fixLayout = function () {
	
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
	
	// disease editor
	this.diseaseEditor.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.diseaseEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.diseaseEditor.setHeight(this.height() - 10);
	this.diseaseEditor.fixLayout();
	
	console.log("fixLayout - disease system");

};

// DiseaseIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the DiseaseEditor's "Diseases" tab, keeping
    a self-updating thumbnail of the disease I'm respresenting, and a
    self-updating label of the disease's name (in case it is changed
    elsewhere)
*/

// DiseaseIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

DiseaseIconMorph.prototype = new ToggleButtonMorph();
DiseaseIconMorph.prototype.constructor = DiseaseIconMorph;
DiseaseIconMorph.uber = ToggleButtonMorph.prototype;

// DiseaseIconMorph settings

DiseaseIconMorph.prototype.thumbSize = new Point(80, 60);
DiseaseIconMorph.prototype.labelShadowOffset = null;
DiseaseIconMorph.prototype.labelColor = new Color(255, 255, 255);
DiseaseIconMorph.prototype.fontSize = 9;

// DiseaseIconMorph instance creation:

function DiseaseIconMorph(aDisease, aTemplate) {
	this.init(aDisease, aTemplate);
}
// Disease icon init function
DiseaseIconMorph.prototype.init = function (aDiseaseSprite, aTemplate) {
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
		var diseases = myself.parentThatIsA(DiseaseSystemMorph);
		
		if (diseases) {
			console.log("Selected sprite disease: " + diseases);
			//diseases.selectSprite(myself.object);
		}
	};
	
	query = function () {
		// answer if my sprite is the current one
		var diseases = myself.parentThatIsA(DiseaseSystemMorph);
		
		if (diseases) {
			return diseases.currentDisease === myself.object;
		}
		return false;
	};
	
	// additional properties
	this.object = aDiseaseSprite || new SpriteMorph();
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

DiseaseIconMorph.prototype.createThumbnail = function () {
}













