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

function DiseaseSystemMorph(aDisease) {
    this.init(aDisease);
}

DiseaseSystemMorph.prototype.init = function (aDisease) {

    // additional properties
	this.disease = aDisease; // || new DiseaseSpriteMorph();
	
	this.globalVariables = new VariableFrame();
	this.diseases = new List([]);
	this.currentCategory = 'motion';
	this.currentTab = 'scripts';
	this.stageDimensions = new Point(240, 160);
	
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.pallette = null;
	this.editorBar = null;
	this.tabBar = null;
	this.diseaseEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	// initialize inherited properties
	DiseaseSystemMorph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor(new Color(20, 200, 20)); 
	
	// build panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createTabBar();
	this.createDiseaseEditor();
};

DiseaseSystemMorph.prototype.createStageBar = function () {
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

DiseaseSystemMorph.prototype.createStage = function () {
	// assumes stageBar has already been created
	if(this.stage) {
		this.stage.destroy();
	}
	StageMorph.prototype.framerate = 0;
	this.stage = new StageMorph(this.globalVariables/* this.globalVariables? */);
	this.stage.setExtent(this.stageDimensions); // dimensions are fixed
	this.add(this.stage);
};

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

DiseaseSystemMorph.prototype.createCorral = function () {
	// assumes corralBar has already been created
	var frame, template, padding = 5, myself = this;
	
	if (this.corral) {
		this.corral.destroy();
	}
	
	this.corral = new ScrollFrameMorph(null, null, this.sliderColor);
	this.corral.acceptsDrops = false;
	this.corral.contents.acceptsDrops = false;
	
	this.corral.contents.wantsDropOf = function (morph) {
		return morph instanceof DiseaseSpriteIconMorph;
	};
	
	this.corral.contents.reactToDropOf = function (diseaseIcon) {
		myself.corral.reactToDropOf(diseaseIcon);
	};
	
	this.diseases.asArray().forEach(function(morph) {
		template = new DiseaseIconMorph(morph, template);
		this.corral.contents.add(template);
	});
	
	this.add(this.corral);
	
	this.corral.fixLayout = function() {
		console.log(this.width());
		console.log(this.height());
		this.arrangeIcons();
		this.refresh();
	}
	
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
	
	this.corral.addDisease = function (disease) {
		this.contents.add(new DiseaseIconMorph(disease));
		this.fixLayout();
	};
	
	this.corral.refresh = function () {
		this.contents.children.forEach(function(icon) {
			icon.refresh();
		});
	};
	
	this.corral.wantsDropOf = function(morph) {
		return morph instanceof DiseaseIconMorph;
	};
	
	this.corral.reactToDropOf = function (diseaseIcon) {
		var idx = 1,
			pos = diseaseIcon.position();
		diseaseIcon.destroy();
		this.contents.children.forEach(function (icon) {
			if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
				idx += 1;
			}
		});
		myself.diseases.add(spriteIcon.object, idx);
		myself.createCorral();
		myself.fixLayout();
	};
};

DiseaseSystemMorph.prototype.createEditorBar = function() {
	var myself = this;
	
	if (this.editorBar) {
		this.editorBar.destroy();
	}
	
	
}

DiseaseSystemMorph.prototype.createTabBar = function() {
	var tab,
		tabCorner = 15,
		tabColors = SimulatorMorph.prototype.tabColors,
		myself = this;
		
	if (this.tabBar) {
		this.tabBar.destroy();
	}
	
	this.tabBar = new AlignmentMorph('row', -tabCorner * 2);
	
	this.tabBar.tabTo = function (tabString) {
		var active;
		myself.currentTab = tabString;
		this.children.forEach(function (each) {
			each.refresh();
			if(each.state) {active = each;}
		});
		active.refresh(); // needed when programmatically tabbing
		myself.createDiseaseEditor();
		myself.fixLayout('tabEditor');
	};
	
	tab = new TabMorph(
		tabColors,
		null, // target
		function () {myself.tabBar.tabTo('scripts');},
		localize('Scripts'), // label
		function () { // query
			return myself.currentTab === 'stages';
		}
	);
	tab.padding = 3;
	tab.corner = tabCorner;
	tab.edge = 1;
	tab.labelShadowOffset = new Point(-1, -1);
	tab.labelShadowColor = tabColors[1];
	tab.labelColor = this.buttonLabelColor;
	tab.drawNew();
	tab.fixLayout();
	//this.tabBar.add(tab);
	
	tab = new TabMorph(
		tabColors,
		null, // target
		function () {this.tabBar.tabTo('stages');},
		localize('Costumes'), // label
		function () { // query
			return myself.currentTab === 'stages';
		}
	);
	tab.padding = 3;
	tab.corner = tabCorner;
	tab.edge = 1;
	tab.labelShadowOffset = new Point(-1, -1);
	tab.labelShadowColor = tabColors[1];
	tab.labelColor = this.buttonLabelColor;
	tab.drawNew();
	tab.fixLayout();
	this.tabBar.add(tab);
	
	this.tabBar.fixLayout();
	this.tabBar.children.forEach(function (each) {
		each.refresh();
	});
	//this.add(this.tabBar);
}

DiseaseSystemMorph.prototype.createDiseaseEditor = function() {
	// assumes the stage has already been created
	var scripts = undefined; //this.currentDisease.scripts,
		myself = this;
		
	if(this.diseaseEditor) {
		this.diseaseEditor.destroy();
	}
	
	if (this.currentTab === 'scripts') {
		//scripts.isDraggable = false;
		
		this.diseaseEditor = new ScrollFrameMorph(
			scripts,
			null,
			this.sliderColor
		);
		this.diseaseEditor.padding = 10;
		this.diseaseEditor.growth = 50;
		this.diseaseEditor.isDraggable = false;
		this.diseaseEditor.acceptsDrops = false;
		this.diseaseEditor.contents.acceptsDrops = true;
		
		//scripts.scrollFrame = this.diseaseEditor
		this.add(this.diseaseEditor);
		this.diseaseEditor.scrollX(this.diseaseEditor.padding);
		this.diseaseEditor.scrollY(this.diseaseEditor.padding);
	} else if (this.currentTab === 'stages') {
		// Wardrobe
	}
};


DiseaseSystemMorph.prototype.fixLayout = function () {
	
	this.stageBar.setPosition(this.topLeft().add(5));
	this.stage.setPosition(this.stageBar.bottomLeft());
	this.corralBar.setPosition(this.stage.bottomLeft().add(new Point(0,10)));
	this.corral.setPosition(this.corralBar.bottomLeft());
	this.corral.setWidth(this.corralBar.width());
	this.corral.setHeight(this.height() - this.corralBar.position().y + 15);
	this.corral.fixLayout();
	this.tabBar.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.tabBar.setWidth(this.width() - this.stageBar.width() - 30);
	this.tabBar.setHeight(30);
	this.diseaseEditor.setPosition(this.tabBar.bottomLeft());
	this.diseaseEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.diseaseEditor.setHeight(this.height() - this.tabBar.height() - 10);
	
	console.log("fixLayout");
	//console.log(this);
	//console.log(this.children);
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

DiseaseIconMorph.prototype.init = function (aDisease, aTemplate) {
	var colors, action, query, myself = this;
	
	if(!aTemplate) {
		colors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.frameColor,
			IDE_Morph.prototype.frameColor
		];
	}
}
