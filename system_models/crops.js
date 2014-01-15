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

function CropSystemMorph(aCrop) {
    this.init(aCrop);;
}

CropSystemMorph.prototype.init = function (aCrop) {

    // additional properties
	this.crop = aCrop; // || new CropSpriteMorph();
	
	this.globalVariables = new VariableFrame();
	this.crops = new List([]);
	this.currentCategory = 'motion';
	this.currentTab = 'description';
	this.stageDimensions = new Point(240, 160);
	
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.pallette = null;
	this.editorBar = null;
	this.tabBar = null;
	this.cropEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	// initialize inherited properties
	CropSystemMorph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor(new Color(20, 200, 20)); 
	
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
	this.stageBar.setColor(new Color(244, 20, 20));
	
	
	this.add(this.stageBar);
};

CropSystemMorph.prototype.createStage = function () {
	// assumes stageBar has already been created
	if(this.stage) {
		this.stage.destroy();
	}
	StageMorph.prototype.framerate = 0;
	this.stage = new StageMorph(this.globalVariables/* this.globalVariables? */);
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
	var frame, template, padding = 5, myself = this;
	
	if (this.corral) {
		this.corral.destroy();
	}
	
	this.corral = new ScrollFrameMorph(null, null, this.sliderColor);
	this.corral.acceptsDrops = false;
	this.corral.contents.acceptsDrops = false;
	
	this.corral.contents.wantsDropOf = function (morph) {
		return morph instanceof CropSpriteIconMorph;
	};
	
	this.corral.contents.reactToDropOf = function (cropIcon) {
		myself.corral.reactToDropOf(cropIcon);
	};
	
	this.crops.asArray().forEach(function(morph) {
		template = new CropSpriteIconMorph(morph, template);
		this.corral.contents.add(template);
	});
	
	this.add(this.corral);
	
	this.corral.fixLayout = function() {
		this.arrangeIcons();
		this.refresh();
	};
	
	this.corral.arrangeIcons = function() {
		var x = this.left(),
			y = this.top(),
			max = this.right(),
			start = this.left();
		
		this.contents.children.forEach(function (icon) {
			var w = icon.width();
			
			if (x + w > max) {
				x = start;
				y += icon.height(); 
			}
			icon.setPosition(new Point(x, y));
			x += 2;
		});
		this.contents.adjustBounds();
	};
	
	this.corral.addCrop = function (crop) {
		this.contents.add(new CropIconMorph(crop));
		this.fixLayout();
	};
	
	this.corral.refresh = function () {
		this.contents.children.forEach(function(icon) {
			icon.refresh();
		});
	};
	
	this.corral.wantsDropOf = function(morph) {
		return morph instanceof cropIconMorph;
	};
	
	this.corral.reactToDropOf = function (cropIcon) {
		var idx = 1,
			pos = cropIcon.position();
		cropIcon.destroy();
		this.contents.children.forEach(function (icon) {
			if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
				idx += 1;
			}
		});
		myself.crops.add(spriteIcon.object, idx);
		myself.createCorral();
		myself.fixLayout();
	};
};

CropSystemMorph.prototype.createCropEditor = function() {
	// assumes the stage has already been created
	var scripts = undefined; //this.currentCrop.scripts,
		myself = this;
		
	if(this.cropEditor) {
		this.cropEditor.destroy();
	}
	
	//scripts.isDraggable = false;
	
	this.cropEditor = new TabPanelMorph();
	this.cropEditor.setWidth(this.width() - this.stage.left() - 20);
	this.cropEditor.setHeight(this.height());
	
	descEditor = new Morph();
	descEditor.setColor(new Color(20, 20, 200));
	this.cropEditor.addTab('description', descEditor);
	
	scriptEditor = new ScriptEditorMorph();
	scriptEditor.setColor(new Color(233, 20,20));
	this.cropEditor.addTab('scripts', scriptEditor);
	
	costumeEditor = new Morph();
	costumeEditor.setColor(new Color(20, 233, 233));
	this.cropEditor.addTab('costumes', costumeEditor);
	
	this.add(this.cropEditor);
};


CropSystemMorph.prototype.fixLayout = function () {
	
	this.stageBar.setPosition(this.topLeft().add(5));
	this.stage.setPosition(this.stageBar.bottomLeft());
	
	this.corralBar.setPosition(this.stage.bottomLeft().add(new Point(0,10)));
	this.corral.setPosition(this.corralBar.bottomLeft());
	this.corral.setWidth(this.corralBar.width());
	this.corral.setHeight(this.height() - this.corralBar.position().y + 15);
	this.corral.fixLayout();
	
	this.cropEditor.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.cropEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.cropEditor.setHeight(this.height() - 10);
	this.cropEditor.fixLayout();
	
	console.log("fixLayout");
	//console.log(this);
	//console.log(this.children);
};

// CropIconMorph ////////////////////////////////////////////////////

/*
    I am a selectable element in the CropEditor's "Crops" tab, keeping
    a self-updating thumbnail of the crop I'm respresenting, and a
    self-updating label of the crop's name (in case it is changed
    elsewhere)
*/

// CropIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

CropIconMorph.prototype = new ToggleButtonMorph();
CropIconMorph.prototype.constructor = CropIconMorph;
CropIconMorph.uber = ToggleButtonMorph.prototype;

// CropIconMorph settings

CropIconMorph.prototype.thumbSize = new Point(80, 60);
CropIconMorph.prototype.labelShadowOffset = null;
CropIconMorph.prototype.labelColor = new Color(255, 255, 255);
CropIconMorph.prototype.fontSize = 9;

// CropIconMorph instance creation:

function CropIconMorph(aCrop, aTemplate) {
	this.init(aCrop, aTemplate);
};

CropIconMorph.prototype.init = function (aCrop, aTemplate) {
	var colors, action, query, myself = this;
	
	if(!aTemplate) {
		colors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.frameColor,
			IDE_Morph.prototype.frameColor
		];
	}
};
