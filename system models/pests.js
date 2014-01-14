/*

    pests.js

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

		PestSystemMorph
		PestIconMorph


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

modules.pests = '2014-January-14';

// Declarations

var PestSystemMorph;
var PestIconMorph;

// PestSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's pest system editor panel

// Pest SystemMorph inherits from Morph:

PestSystemMorph.prototype = new Morph();
PestSystemMorph.prototype.constructor = PestSystemMorph;
PestSystemMorph.uber = Morph.prototype;

// PestSystemMorph preferences settings and skings

// ... to follow ...

// Pest system morph instance creation:


// Pest system constructor
function PestSystemMorph(aPest){
	this.init(aPest);
};

// Pest system init function
PestSystemMorph.prototype.init = function(aPest){
	
	console.log("Pest system init");
	
	// additional properties
	this.pest = aPest; // current pest selected
	// should create a new PestSpriteMorph() if one is not passed in.
	
	this.globalVariables = new VariableFrame();
	this.pests = new List([]); // list of pests
	this.currentCategory = 'motion'; // not sure what this is ???
	this.currentTab = 'scripts';
	this.stageDimensions = new Point(240, 160);
	
	// The morphs associated with this system.
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.pallette = null;  // not in use.
	this.editorBar = null; // not in use.
	this.tabBar = null;    // not in use.
	this.pestEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	//  initialize inherited properties
	PestSystemMorph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor( new Color( 20, 200, 20 ) );
	
	// Build the different panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createPestEditor();
	
};

// This function creates the stage bar morph.
PestSystemMorph.prototype.createStageBar = function() {
	
	console.log("create pest stage bar");
	
	// remove any previous stage bars.
	if(this.stageBar){
		this.stageBar.destroy();
	}
	
	// create the new stage bar.
	this.stageBar = new ControlBarMorph();
	
	// define its parameters.
	this.stageBar.setWidth(this.stageDimensions.x);
	this.stageBar.setHeight(30);
	this.stageBar.corner = 10;
	this.stageBar.setColor( new Color( 244, 20, 20) );
	
	// add the stage bar to the pest system.
	this.add(this.stageBar);
	
};

// This function creates the stage window morph.
PestSystemMorph.prototype.createStage = function() {
	
		console.log("create pest stage");
	
	// remove any previous stages.
	if(this.stage){
		this.stage.destroy();
	}
	
	// set the inherited Stage Morph properties.
	StageMorph.prototype.framerate = 0;
		
	// create the new stage.
	this.stage = new StageMorph( this.globalVariables);
	
	// define its parameters.
	this.stage.setExtent(this.stageDimensions);
	
	// add the stage  to the pest system.
	this.add(this.stage);
};

// This function creates the corral bar morph.
PestSystemMorph.prototype.createCorralBar = function() {
	
		console.log("create pest corral bar");
	
	// remove any previous stage bars.
	if(this.corralBar){
		this.corralBar.destroy();
	}
		
	// create the new corral bar.
	this.corralBar = new ControlBarMorph();
	
	// define its parameters.
	this.corralBar.add( new StringMorph("    Pests") );
	this.corralBar.setWidth(this.stageDimensions.x);
	this.corralBar.setHeight(30);
	
	// add the corral bar to the pest system.
	this.add(this.corralBar);
	
};

// This function creates the corral window morph.
PestSystemMorph.prototype.createCorral = function() {
	var frame, template, padding = 5, myself = this;
	
		console.log("create pest corral");
	
	// remove any previous stage bars.
	if(this.corral){
		this.corral.destroy();
	}
		
	// create the new stage bar.
	this.corral = new ScrollFrameMorph(null, null, this.sliderColor);
	
	// define its parameters.
	this.corral.acceptsDrops = false;
	this.corral.contents.acceptsDrops = false;
	
	// support functions for the contents of the corral.
	this.corral.contents.wantsDropOf = function (morph) {
		return morph instanceof PestSpriteIconMorph;
	};
	
	this.corral.contents.reactToDropOf = function (PestIcon) {
		myself.corral.reactToDropOf(pestIcon);
	};
	
	// support function for list of pests.
	this.pests.asArray().forEach( function(morph) {
		template = new PestIconMorph( morph, template);
		this.corral.contents.add(template);
	});
	
	
	// support functions for the corral itself
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
	
	this.corral.addPest = function(pest) {
		this.contents.add( new PestIconMorph(pest) );
		this.fixLayout();
	};
	
	this.corral.refresh = function() {
		this.contents.children.forEach(function(icon) {
			icon.refresh();
		});
	};
	
	this.corral.wantsDropOf = function(morph) {
		return morph instanceof PestIconMorph;
	};
	
	this.corral.reactToDropOf = function (pestIcon) {
		var idx = 1;
		var pos = pestIcon.position();
		pestIcon.destroy();
		this.contents.children.forEach( function (icon) {
			if( pos.gt(icon.position()) || pos.y > icon.bottom()) { // ??? should it be pos.get
				idx += 1;
			}
		});
		
		myself.pests.add(spriteIcon.object, idx); // ??? spriteIcon
		myself.createCorral();
		myself.fixLayout();
	};
	
	
	// add the stage bar to the pest system.
	this.add(this.corral);
};

// This funciton creates the pest editor window morph.
PestSystemMorph.prototype.createPestEditor = function() {
	var scripts = undefined;
	var myself = this;
	
		console.log("create pest editor");
	
	// remove any previous stage bars.
	if(this.pestEditor){
		this.pestEditor.destroy();
	}
	
	// if the current tab is on scripts. probably should use a switch case when 
	// the editor tabs get finalized
	if(this.currentTab === 'scripts') {
		
		// create new pest editor.
		this.pestEditor = new ScrollFrameMorph(
			scripts,
			null,
			this.sliderColor
		);
		
		// pest editor parameters
		this.pestEditor.padding = 10;
		this.pestEditor.growth = 50;
		this.pestEditor.isDraggable = false;
		this.pestEditor.acceptsDrops = false;
		this.pestEditor.contents.acceptsDrops = true;
		
		// add the pest editor to the pest system
		this.add(this.pestEditor);
		
		// finish the pest editor parameters
		this.pestEditor.scrollX(this.pestEditor.padding);
		this.pestEditor.scrollY(this.pestEditor.padding);		
	} else if(this.currentTab === 'stages') {	// other tabs
		// wardrobe
	}
};

// This function places all of this systems morphs in the correct place on the page.
PestSystemMorph.prototype.fixLayout = function() {
	
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
	
	// ??? had to kinda hack pest editor's position because tab bar is being reinvented.
	this.pestEditor.setPosition( this.stageBar.topRight().add( new Point(10, 18) ) ); // right 10 down 30
	this.pestEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.pestEditor.setHeight(this.height() - 30 - 10);
	
	
	console.log("fixLayout");

};

// PestIconMorph /////////////////////////////////////////////////////////

/*
    I am a selectable element in the PestEditor's "Pests" tab, keeping
    a self-updating thumbnail of the Pest I'm respresenting, and a
    self-updating label of the Pest's name (in case it is changed
    elsewhere)
*/

// PestIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

PestIconMorph.prototype = new ToggleButtonMorph();
PestIconMorph.prototype.constructor = PestIconMorph;
PestIconMorph.uber = ToggleButtonMorph.prototype;

// pestIconMorph settings
PestIconMorph.prototype.thumbSize = new Point(80, 60);
PestIconMorph.prototype.labelShadowOffset = null;
PestIconMorph.prototype.labelColor = new Color(255, 255, 255);
PestIconMorph.prototype.fontSize = 9;

// Pest Icon instance creation:
function PestIconMorph(aPest, aTemplate) {
	this.init(aPest, aTemplate);
}

// pest icon init function
PestIconMorph.prototype.init = function (aPest, aTemplate) {
	var colors, action, query, myself = this;
	
	if(!aTemplate) {
		colors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.frameColor,
			IDE_Morph.prototype.frameColor
		];
	}
}




























