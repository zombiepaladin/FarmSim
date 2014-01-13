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

// Soil system constructor
function SoilSystemMorph(aSoil){

	this.init(aSoil);
}

// Soil system initializing function
SoilSystemMorph.prototype.init = function(aSoil){
	
	console.log(" Soil System init function");
	
	// additional properties
	this.soil = aSoil; // or if there isn't a soil passed in create one. 
	// || new SoilSpriteMorph();
	
	this.globalVariables = new VariableFrame();
	this.soils = new List([]);
	this.currentCategory = 'motion' //???
	this.currentTab = 'scripts';
	this.stageDimensions = new Point(240, 160);
	
	// The morphs associated with this system
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.pallette = null;  // not in use.
	this.editorBar = null; // not in use.
	this.tabBar = null;    // not in use.
	this.soilEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	// initialize inherited properties
	SoilSystemMorph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor( new Color( 20, 200, 20 ) );
	
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
	this.stageBar.setColor( new Color( 244, 20, 20 ) );
	
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
	
	// add the new corral bar to the soil system.
	this.add(this.corralBar);
	
};

// This function creates the corral window morph.
SoilSystemMorph.prototype.createCorral = function(){

	var frame, template, padding = 5, myself = this;
	
	// remove any old corrals
	if(this.corral){
		this.corral.Destroy();
	}
	
	// create the new corral as a scrollable morph.
	this.corral = new ScrollFrameMorph( null, null, this.sliderColor);
	
	// define its properties.
	this.corral.acceptsDrops = false;
	this.corral.contents.acceptsDrops = false;
	
	// define support functions for corral's contents.
	this.corral.contents.wantsDropOf = function (morph) {
		return morph instanceof SoilSpriteIconMorph;
	};
	
	this.corral.contents.reactToDropOf = function (soilIcon) {
		myself.corral.reactToDropOf(soilIcon);
	};
	
	this.soils.asArray().forEach( function(morph) {
		template = new SoilIconMorph( morph, template);
		this.corral.contents.add(template);
	});
	
	
	
	// define support functions for corral itself.
	
	this.corral.fixLayout = function() {
		this.arrangeIcons();
		this.refresh();
	};
	
	this.corral.arrangeIcons = function() {
		var x = this.left();
		var y = this.top();
		var max = this.right();
		var start = this.left();
		
		this.contents.children.forEach( function (icon) {
			var w = icon.width();
			
			if (x + w > max) {
				x = start;
				y += icon.height();
			}
			
			icon.setPosition( new Point( x, y ) );
			x += 2;
		});
		this.contents.adjustBounds();
	};
	
	this.corral.addSoil = function(soil) {
		this.contents.add( new SoilIconMorph(soil) );
		this.fixLayout();
	};
	
	this.corral.refresh = function() {
		this.contents.children.forEach(function(icon) {
			icon.refresh();
		});
	};
	
	this.corral.wantsDropOf = function(morph) {
		return morph instanceof SoilIconMorph;
	};
	
	this.corral.reactToDropOf = function (soilIcon) {
		var idx = 1;
		var pos = soilIcon.position();
		soilIcon.destroy();
		this.contents.children.forEach( function (icon) {
			if( pos.gt(icon.position()) || pos.y > icon.bottom()) { // ??? should it be pos.get
				idx += 1;
			}
		});
		
		myself.soils.add(spriteIcon.object, idx); // ??? spriteIcon
		myself.createCorral();
		myself.fixLayout();
	};
	
	this.add(this.corral);
	
};

// This function creates the soil editor window morph.
SoilSystemMorph.prototype.createSoilEditor = function() {
	var scripts = undefined;
	var myself = this;
	
	// remove any old soil editors.
	if(this.soilEditor){
		this.soilEditor.destroy();
	}
	
	// if the current tab is on scripts. probably should use a switch case when 
	// the editor tabs get finalized
	if(this.currentTab === 'scripts') {
		
		// create new soil editor.
		this.soilEditor = new ScrollFrameMorph(
			scripts,
			null,
			this.sliderColor
		);
		
		// soil editor parameters
		this.soilEditor.padding = 10;
		this.soilEditor.growth = 50;
		this.soilEditor.isDraggable = false;
		this.soilEditor.acceptsDrops = false;
		this.soilEditor.contents.acceptsDrops = true;
		
		// add the soil editor to the soil system
		this.add(this.soilEditor);
		
		this.soilEditor.scrollX(this.soilEditor.padding);
		this.soilEditor.scrollY(this.soilEditor.padding);		
	} else if(this.currentTab === 'stages') {
		// wardrobe
	}
	
	
	
};

// This function places all the morphs in the correct place on the page.
SoilSystemMorph.prototype.fixLayout = function() {

	this.stageBar.setPosition(this.topLeft().add(5));
	this.stage.setPosition(this.stageBar.bottomLeft());
	
	this.corralBar.setPosition(this.stage.bottomLeft().add(new Point(0,10)));
	
	this.corral.setPosition(this.corralBar.bottomLeft());
	this.corral.setWidth(this.corralBar.width());
	this.corral.setHeight(this.height() - this.corralBar.position().y + 15);
	this.corral.fixLayout();
	
	/*
	this.tabBar.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.tabBar.setWidth(this.width() - this.stageBar.width() - 30);
	this.tabBar.setHeight(30);
	*/
	
	// ??? had to kinda hack soil editor's position because tab bar is being reinvented.
	this.soilEditor.setPosition( this.stageBar.topRight().add( new Point(10, 18) ) ); // right 10 down 30
	this.soilEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.soilEditor.setHeight(this.height() - 30 - 10);
	
	
	console.log("fixLayout");
	
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
SoilIconMorph.prototype.init = function (aSoil, aTemplate) {
	var colors, action, query, myself = this;
	
	if(!aTemplate) {
		colors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.frameColor,
			IDE_Morph.prototype.frameColor
		];
	}
}




