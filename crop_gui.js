/*

    crop_gui.js

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

		SimlatorGuiMorph
        CropIDE_Morph


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

modules.crop_gui = '2013-November-07';

// Declarations

var SimulatorMorph;
var CropIDE_Morph;
var CropIconMorph;

var ControlBarMorph;


// SimulatorMorph /////////////////////////////////////////////////////

// I am FarmSim's top-level frame, the Simulator GUI

// SimulatorMorph inherits from Morph:

SimulatorMorph.prototype = new Morph();
SimulatorMorph.prototype.constructor = SimulatorMorph;
SimulatorMorph.uber = Morph.prototype;

// SimulatorMorph preferences settings, and skins

SimulatorMorph.prototype.setDefaultDesign = function () {
	MorphicPreferences.isFlat = false;
	
	SimulatorMorph.prototype.buttonContrast = 30;
	SimulatorMorph.prototype.backgroundColor = new Color(69,69,17);
	SimulatorMorph.prototype.frameColor = new Color(218,183,121);
	SimulatorMorph.prototype.labelColor = new Color(39,34,4);
	SimulatorMorph.prototype.groupColor = new Color(189,149,57);
	SimulatorMorph.prototype.tabColors = [
		SimulatorMorph.prototype.groupColor.darker(40),
		SimulatorMorph.prototype.groupColor.lighter(60),
		SimulatorMorph.prototype.groupColor
	];
};

// SimulatorMorph instance creation:

function SimulatorMorph(isAutoFill) {
	this.init(isAutoFill);
};

SimulatorMorph.prototype.init = function (isAutoFill) {

	// global font setting
	MorphicPreferences.globalFontFamily = 'Helvetica, Arial';
	
	// TODO: restore saved user preferences
	this.setDefaultDesign();
	
	// additional properties:
	this.serializer = new SnapSerializer();
	
	this.globalVariables = new VariableFrame();
	this.currentSystem = 'crops';
	this.simulationName = '';
	this.simulationNotes = '';
	
	// gui components:
	this.logo = null;
	this.systemSelectBar = null;
	this.cropSystem = null;
	
	// gui settings:
	this.isAutoFill = isAutoFill || true;
	this.isAppMode = false;
	
	// initialize inherited properties:
	SpriteMorph.uber.init.call(this);
	
	// override inherited properties:
	this.color = this.backgroundColor;
};

SimulatorMorph.prototype.openIn = function(world) {
	var myself = this;
	
	this.buildPanes();
	world.add(this);
	world.userMenu = this.userMenu;
	
	// TODO: get persistent data, if any
	
	// prevent non-DialogBoxMorphs from being 
	// dropped onto the World in user-mode
	world.reactToDropOf = function(morph) {
		if(!(morph instanceof DialogBoxMorph)) {
			if (world.hand.grabOrigin) {
				morph.slideBackTo(world.hand.grabOrigin);
			} else {
				world.hand.grab(morph);
			}
		}
	};
	
	this.reactToWorldResize(world.bounds);
};

// SimulatorMorph construction

SimulatorMorph.prototype.buildPanes = function() {
	this.createLogo();
	this.createSystemSelectBar();
	this.createCropSystem();
};
	
SimulatorMorph.prototype.createLogo = function() {
    var myself = this;

    if (this.logo) {
        this.logo.destroy();
    }

    this.logo = new Morph();
    this.logo.texture = 'tractor-icon.png';
    this.logo.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d'),
            gradient = context.createLinearGradient(
                0,
                0,
                this.width(),
                0
            );
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(0.5, myself.frameColor.toString());
        context.fillStyle = MorphicPreferences.isFlat ?
                myself.frameColor.toString() : gradient;
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    this.logo.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        context.drawImage(
            this.cachedTexture,
            5,
            Math.round((this.height() - this.cachedTexture.height) / 2)
        );
        this.changed();
    };

    this.logo.mouseClickLeft = function () {
        myself.snapMenu();
    };

    this.logo.color = new Color();
    this.logo.setExtent(new Point(200, 28)); // dimensions are fixed
    this.add(this.logo);
};

SimulatorMorph.prototype.createSystemSelectBar = function () {
	// assumes the logo has already been created
	var myself = this;
	
	if (this.systemSelectBar) {
		this.systemSelectBar.destroy();
	}
	this.systemSelectBar = new Morph();
	this.systemSelectBar.color = this.groupColor;
	this.systemSelectBar.setPosition(this.logo.bottomLeft());
	this.systemSelectBar.silentSetWidth(this.width());
	
	function addSystemButton(system) {
		var labelWidth = 75,
			colors = [
				myself.frameColor,
				myself.frameColor.darker(50),
				myself.frameColor.lighter(50)
			],
			button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                myself.currentSubsystem = system;
                myself.systemSelectBar.children.forEach(function (each) {
                    each.refresh();
                });
                //myself.refreshPalette(true);
				// TODO: Refresh stuff
				myself.reactToSystemSelect(system);
            },
            system[0].toUpperCase().concat(system.slice(1)), // label
            function () {  // query
                return myself.currentSubsystem === system;
            },
            null, // env
            null, // hint
            null, // template cache
            labelWidth, // minWidth
            true // has preview
        );

        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        myself.systemSelectBar.add(button);
        return button;
    }

    function fixSystemSelectBarLayout() {
        var buttonHeight = myself.systemSelectBar.children[0].height(),
			border = 3,
            xPadding = 2,
            yPadding = 2,
            l = myself.systemSelectBar.left(),
            t = myself.systemSelectBar.top(),
            i = 0;
		myself.systemSelectBar.setWidth(
			myself.width()
		);
		
        myself.systemSelectBar.children.forEach(function (button) {
			i += 1;
			if(l + border + button.width() > myself.systemSelectBar.width()) {
				t += button.height() + 2 * border;
				l = myself.systemSelectBar.left();
			}
			button.setPosition(new Point(
                l + border,
                t + border
            ));
			l += myself.systemSelectBar.children[i-1].width() + 2 * border;
        });

        myself.systemSelectBar.setHeight(
				t + buttonHeight + 2 * border - myself.systemSelectBar.top()
        );
    }

	// TODO: Systems should probably be moved!
	['farm ops', 'crops', 'soils', 'weather', 'equipment', 'markets'].forEach(function(system) {
		addSystemButton(system);
	});
    fixSystemSelectBarLayout();
	this.systemSelectBar.fixLayout = function() {
		fixSystemSelectBarLayout();
	};
    this.add(this.systemSelectBar);
};

SimulatorMorph.prototype.createCropSystem = function() {
	// assumes systemSelectBar has already been created
	var myself = this;
	
	if (this.cropSystem) {
		this.cropSystem.destroy();
	}
	
	this.cropSystem = new CropIDE_Morph(undefined);
	this.add(this.cropSystem);
	if(this.currentSystem !== 'crops') this.cropSystem.hide();
};

// SimulatorMorph layout

SimulatorMorph.prototype.fixLayout = function (situation) {
	var padding = 10;

	Morph.prototype.trackChanges = false;
	
	// system select bar
	this.systemSelectBar.setWidth(this.width());
	this.systemSelectBar.fixLayout();
	
	// crop system
	this.cropSystem.setPosition(this.systemSelectBar.bottomLeft());
	this.cropSystem.setWidth(this.systemSelectBar.width());
	this.cropSystem.setHeight(this.height() - this.systemSelectBar.bottom());
	this.cropSystem.fixLayout();
	
	Morph.prototype.trackChanges = true;
	this.changed();
};

// SimulatorMorph resizing

SimulatorMorph.prototype.setExtent = function (point) {
	var minExt,
		ext;
		
	// determine the minimum dimensions making sense for the current mode
	// for now, default to VGA resolution
	minExt = new Point(640, 480);

	ext = point.max(minExt);
	SimulatorMorph.uber.setExtent.call(this, ext);
	
	// avoid fixing layout before panels have been created
	if(this.logo) this.fixLayout();
};

// SimulatorMorph events

SimulatorMorph.prototype.reactToWorldResize = function(rect) {
	if(this.isAutoFill) {
		this.setPosition(rect.origin);
		this.setExtent(rect.extent());
	}
};

SimulatorMorph.prototype.reactToSystemSelect = function(system) {
	this.currentSystem = system;
	
	this.cropSystem.hide();
	
	switch (system) {
		case 'crops':
			this.cropSystem.show();
			break;
	}
	
	this.fixLayout();
};
	
	
	

// CropIDE_Morph /////////////////////////////////////////////////////////

// I am FarmSim's crop editor panel

// CropIDE_Morph inherits from Morph:

CropIDE_Morph.prototype = new Morph();
CropIDE_Morph.prototype.constructor = CropIDE_Morph;
CropIDE_Morph.uber = Morph.prototype;

// CropIDE_Morph preferences settings and skins

// ... to follow ...

// CropIDE_Morph instance creation:

function CropIDE_Morph(aCrop) {
    this.init(aCrop);
}

CropIDE_Morph.prototype.init = function (aCrop) {

    // additional properties
	this.crop = aCrop; // || new CropSpriteMorph();
	
	this.globalVariables = new VariableFrame();
	this.crops = new List([]);
	this.currentCategory = 'motion';
	this.currentTab = 'scripts';
	this.stageDimensions = new Point(240, 160);
	
	this.stageBar = null;
	this.stage = null;
	this.corralBar = null;
	this.corral = null;
	this.pallette = null;
	this.cropBar = null;
	this.tabBar = null;
	this.cropEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	// initialize inherited properties
	CropIDE_Morph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor(new Color(20, 200, 20)); 
	
	// build panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createTabBar();
	this.createCropEditor();
};

CropIDE_Morph.prototype.createStageBar = function () {
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

CropIDE_Morph.prototype.createStage = function () {
	// assumes stageBar has already been created
	if(this.stage) {
		this.stage.destroy();
	}
	StageMorph.prototype.framerate = 0;
	this.stage = new StageMorph(this.globalVariables/* this.globalVariables? */);
	this.stage.setExtent(this.stageDimensions); // dimensions are fixed
	this.add(this.stage);
};

CropIDE_Morph.prototype.createCorralBar = function () {
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

CropIDE_Morph.prototype.createCorral = function () {
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

CropIDE_Morph.prototype.createTabBar = function() {
	var tab,
		tabCorner = 15,
		tabColors = [new Color(220,100,100), new Color(100,220,100), new Color(100,100,220)],
		myself = this;
		
	if(this.tabBar) {
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
		myself.createCropEditor();
		myself.fixLayout('tabEditor');
	};
	
	tab = new TabMorph(
		tabColors,
		null, // target
		function () {tabBar.tabTo('scripts');},
		localize('Scropts'), // label
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
		function () {tabBar.tabTo('stages');},
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
	//this.tabBar.add(tab);
	
	this.tabBar.fixLayout();
	this.tabBar.children.forEach(function (each) {
		each.refresh();
	});
	this.add(this.tabBar);
}

CropIDE_Morph.prototype.createCropEditor = function() {
	// assumes the stage has already been created
	var scripts = undefined; //this.currentCrop.scripts,
		myself = this;
		
	if(this.cropEditor) {
		this.cropEditor.destroy();
	}
	
	if (this.currentTab === 'scripts') {
		//scripts.isDraggable = false;
		
		this.cropEditor = new ScrollFrameMorph(
			scripts,
			null,
			this.sliderColor
		);
		this.cropEditor.padding = 10;
		this.cropEditor.growth = 50;
		this.cropEditor.isDraggable = false;
		this.cropEditor.acceptsDrops = false;
		this.cropEditor.contents.acceptsDrops = true;
		
		//scripts.scrollFrame = this.cropEditor
		this.add(this.cropEditor);
		this.cropEditor.scrollX(this.cropEditor.padding);
		this.cropEditor.scrollY(this.cropEditor.padding);
	} else if (this.currentTab === 'stages') {
		// Wardrobe
	}
};


CropIDE_Morph.prototype.fixLayout = function () {
	
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
	this.cropEditor.setPosition(this.tabBar.bottomLeft());
	this.cropEditor.setWidth(this.tabBar.width());
	this.cropEditor.setHeight(this.height() - this.tabBar.height() - 20);
	
	console.log("fixLayout");
	console.log(this);
	console.log(this.children);
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
}

CropIconMorph.prototype.init = function (aCrop, aTemplate) {
	var colors, action, query, myself = this;
	
	if(!aTemplate) {
		colors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.frameColor,
			IDE_Morph.prototype.frameColor
		];
	}
}


// ControlBarMorph ///////////////////////////////////////

// I am a bar with rounded corners

// ControlBarMorph inherits from BoxMorph:

ControlBarMorph.prototype = new BoxMorph();
ControlBarMorph.prototype.constructor = ControlBarMorph;
ControlBarMorph.uber = BoxMorph.prototype;

// ControlBarMorph preference settings:

ControlBarMorph.corner = 5;

// ControlBarMorph instance creation:

function ControlBarMorph(edge, border, borderColor){
	this.init(edge, border, borderColor);
}

ControlBarMorph.init = function(edge, border, borderColor) {
	// initialize inherited properties
	ControlBarMorph.uber.init.call(this, edge, border, borderColor);
}

// ControlBarMorph drawing

ControlBarMorph.prototype.outlinePath = function (context, radius, inset) {
    var offset = radius + inset,
        w = this.width(),
        h = this.height();

    // top left:
    context.arc(
        offset,
        offset,
        radius,
        radians(-180),
        radians(-90),
        false
    );
    // top right:
    context.arc(
        w - offset,
        offset,
        radius,
        radians(-90),
        radians(-0),
        false
    );
    // bottom right:
    context.lineTo(
        w - inset,
        h - inset
    );
    // bottom left:
    context.lineTo(
        inset,
        h - inset
    );
};
