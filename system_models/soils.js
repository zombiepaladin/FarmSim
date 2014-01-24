/*

    soil.js

    a sumulation programming environment
    based on morphic.js, blocks.js, threads.js, objects.js, and crop_gui.js
    inspired by Scratch and Snap!
	
	written by Byron Wheeler
	bwheek@ksu.edu

	
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
    needs blocks.js, threads.js, objects.js, morphic.js, and gui_widgets.js


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:

		SoilSystemMorph
		SoilIconMorph


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

modules.soil_gui = '2014-January-13';

var SoilSystemMorph;
var SoilIconMorph;

// SoilSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's soil system editor panel

// SoilSystemMorph inherits from Morph:

SoilSystemMorph.prototype = new Morph();
SoilSystemMorph.prototype.constructor = SoilSystemMorph;
SoilSystemMorph.uber = Morph.prototype;

// SoilSystemMorph preferences settings and skins

// ... to follow ...

// SoilSystemMorph instance creation:

SoilSystemMorph.prototype.backgroundColor = new Color(20, 200, 20);
SoilSystemMorph.prototype.stageBarColor = new Color(244, 20, 20);
SoilSystemMorph.prototype.stageColor = new Color(255,255,255);
SoilSystemMorph.prototype.corralBarColor = new Color (0,0,0); // TODO : implement, currently its the default
SoilSystemMorph.prototype.corralColor = new Color(255,255,255);
SoilSystemMorph.prototype.soilEditorColors = [
							new Color(20, 200, 20),              // background color of tabBar and the background color for the display morph.
							new Color(20, 233, 233).darker(15), // this is the color of the unselected tabs
							new Color(20, 233, 233) 			// this is the color of the slected panel
							];
							
// Soil system constructor
function SoilSystemMorph(aSoilSprite){

	this.init(aSoilSprite);
}

// Soil system initializing function
SoilSystemMorph.prototype.init = function(aSoilSprite){
	
	console.log(" Soil System init function");
	
		var sprite2 = new SpriteMorph(),
		sprite3 = new SpriteMorph(),
		sprite4 = new SpriteMorph(),
		sprite5 = new SpriteMorph();
		
		sprite2.name = 'Soil 2';
		sprite3.name = 'Soil 3';
		sprite4.name = "Soil 4";
        sprite5.name = "Soil 5";	
	
	// additional properties
	this.currentSoil = aSoilSprite || new SpriteMorph();
	
	this.globalVariables = new VariableFrame();
	this.soils = [ this.currentSoil, sprite2, sprite3, sprite4, sprite5,new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph(),new SpriteMorph() ];
	this.currentCategory = 'motion';
	this.currentTab = 'scripts';
	this.stageDimensions = new Point(240, 160);
	
	// The morphs associated with this system
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.soilEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	// initialize inherited properties
	SoilSystemMorph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor( PestSystemMorph.prototype.backgroundColor );
	
	// Build the different panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createSoilEditor();
	
};

// This function creates the stage bar morph.
SoilSystemMorph.prototype.createStageBar = function() {
		
	// remove any previous stage bars.
	if(this.stageBar){
		this.stageBar.destroy();
	}
	// create the new stage bar
	this.stageBar = new ControlBarMorph();
	
	// define its parameters
	this.stageBar.setWidth(this.stageDimensions.x);
	this.stageBar.setHeight(30);
	this.stageBar.corner = 10;
	this.stageBar.setColor( PestSystemMorph.prototype.stageBarColor );
	
	// add the stage bar to the soil system.
	this.add(this.stageBar);
	
};

// This function creates the stage window morph.
SoilSystemMorph.prototype.createStage = function(){
	
	// remove any old stages.
	if(this.stage){
		this.stage.destroy();
	}
	
	// set the inherited stagemorph properties.
	StageMorph.prototype.framerate = 0;
	
	// set the stage properties.
	this.stage = new StageMorph(this.globalVariables);
	this.stage.setColor( PestSystemMorph.prototype.stageColor );
	
	this.stage.setExtent(this.stageDimensions); 
	
	// add the stage to the soil system page.
	this.add(this.stage);
	
};

// This function creates the corral bar morph.
SoilSystemMorph.prototype.createCorralBar = function(){

	// remove any old corral bars
	if(this.corralBar){
		this.corralBar.destroy();
	}
	
	// create the new corralbar.
	this.corralBar = new ControlBarMorph();
	
	// define its properties.
	this.corralBar.add( new StringMorph("    Soils") );
	this.corralBar.setWidth(this.stageDimensions.x);
	this.corralBar.setHeight(30);
	
	//this.corralBar.setColor(PestSystemMorph.prototype.corralBarColor);
	
	// add the new corral bar to the soil system.
	this.add(this.corralBar);
	
};

// This function creates the corral window morph.
SoilSystemMorph.prototype.createCorral = function(){

	var frame, template, padding = 5, sprites, myself = this;
	
	// remove any old corrals
	if(this.corral){
		this.corral.destroy();
	}
	
	sprites = function() {
		return myself.soils;
	};
	
	// create the new corral as a scrollable morph.
	this.corral = new SpriteCorralMorph(sprites, SpriteIconMorph);
	
	this.add(this.corral);
	
};

// This function creates the soil editor window morph.
SoilSystemMorph.prototype.createSoilEditor = function() {
	var myself = this;
	
	// remove any old soil editors.
	if(this.soilEditor){
		this.soilEditor.destroy();
	}


	// create the tab panel morph to hold the soil editor.
	this.soilEditor = new TabPanelMorph( PestSystemMorph.prototype.pestEditorColors );
	
	// add the tabs to the tab panel
	
	// description tab
	var descEditor = new Morph();
	descEditor.setColor( PestSystemMorph.prototype.pestEditorColors[2] );
	this.soilEditor.addTab('description', descEditor);
	
	// script tab
	scriptEditor = new ScriptEditorMorph();
	scriptEditor.setColor( PestSystemMorph.prototype.pestEditorColors[2] );
	this.soilEditor.addTab('scripts', scriptEditor);
	
	// costume tab
	costumeEditor = new Morph();
	costumeEditor.setColor( PestSystemMorph.prototype.pestEditorColors[2] );
	this.soilEditor.addTab('costumes', costumeEditor);
	
	// add the editor to the soil system
	this.add(this.soilEditor);
};

// This function places all the morphs in the correct place on the page.
SoilSystemMorph.prototype.fixLayout = function() {

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
	
	// soil editor
	this.soilEditor.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.soilEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.soilEditor.setHeight(this.height() - 10);
	this.soilEditor.fixLayout();
	
	console.log("fixLayout - soil system");
	
}

// SoiilIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the SoilEditor's "Soils" tab, keeping
    a self-updating thumbnail of the soil I'm respresenting, and a
    self-updating label of the soil's name (in case it is changed
    elsewhere)
*/

// SoilIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

SoilIconMorph.prototype = new ToggleButtonMorph();
SoilIconMorph.prototype.constructor = SoilIconMorph;
SoilIconMorph.uber = ToggleButtonMorph.prototype;

// SoilIconMorph settings
SoilIconMorph.prototype.thumbSize = new Point(80, 60);
SoilIconMorph.prototype.labelShadowOffset = null;
SoilIconMorph.prototype.labelColor = new Color(255, 255, 255); // RGB white
SoilIconMorph.prototype.fontSize = 9;

// Soil Icon instance creation:
function SoilIconMorph(aSoil, aTemplate) {
	this.init(aSoil, aTemplate);
}

// soil icon init function
SoilIconMorph.prototype.init = function (aSoilSprite, aTemplate) {
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
		var soils = myself.parentThatIsA(SoilSystemMorph);
		
		if (soils) {
			console.log("Selected sprite soil: " + soils);
			//soils.selectSprite(myself.object);
		}
	};
	
	query = function () {
		// answer if my sprite is the current one
		var soils = myself.parentThatIsA(SoilSystemMorph);
		
		if (soils) {
			return soils.currentSoil === myself.object;
		}
		return false;
	};
	
	// additional properties
	this.object = aSoilSprite || new SpriteMorph();
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

SoilIconMorph.prototype.createThumbnail = function () {

};



