/*

    simulator.js

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

		SimlatorMorph


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
	this.soilSystem = null;
	
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

	console.log("create build panels");
	
	this.createLogo();
	this.createSystemSelectBar();
	this.createCropSystem();
	this.createSoilSystem();
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
	
	console.log("create crop system");
	
	if (this.cropSystem) {
		this.cropSystem.destroy();
	}
	
	this.cropSystem = new CropSystemMorph(undefined);
	this.add(this.cropSystem);
	if(this.currentSystem !== 'crops') this.cropSystem.hide();
};

SimulatorMorph.prototype.createSoilSystem = function() {
	
	console.log("create soil system.");
	
	var myself = this;
	
	if( this.soilSystem) {
		this.soilSystem.Destroy();
	}
	
	this.soilSystem = new SoilSystemMorph(undefined); // pass in undefined for default soil.

	this.add(this.soilSystem); // add soil system to the main system
	
	if( this.currentSystem != 'soils') this.soilSystem.hide(); // if soil system isn't selected, hide it.
}


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
	
	// soil system
	this.soilSystem.setPosition(this.systemSelectBar.bottomLeft());
	this.soilSystem.setWidth(this.systemSelectBar.width());
	this.soilSystem.setHeight(this.height() - this.systemSelectBar.bottom());
	this.soilSystem.fixLayout();
	
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
			this.cropSystem.cropEditor.fixLayout();
			console.log("switch to crop system");
			console.log(this.cropSystem.cropEditor);
			break;
		case 'soils':
			this.soilSystem.show();
			console.log("switch to soil system");
			break;
	}
	
	this.fixLayout();
};
	
	