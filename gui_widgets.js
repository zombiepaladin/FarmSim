/*

    gui_widgets.js

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

		ControlBarMorph


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

modules.gui_widgets = '2014-January-13';

// Declarations

var ControlBarMorph;
var TabPanelMorph;


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


// TabPanelMorph ///////////////////////////////////////

// I am a panel that allows you to tab through multiple morphs

// TabPanelMorph inherits from Morph:

TabPanelMorph.prototype = new Morph();
TabPanelMorph.prototype.constructor = TabPanelMorph;
TabPanelMorph.uber = Morph.prototype;

// TabPanelMorph instance creation:

function TabPanelMorph(tabNames, tabMorphs){
	this.init(tabNames, tabMorphs);
};

TabPanelMorph.prototype.init = function(tabNames, tabMorphs) {
	var myself = this;
	
	// additional properties
	this.currentTab = 'description';
	this.tabs = [];
	this.panels = {};
	this.tabBar = null;
	
	// initialize inherited properties
	TabPanelMorph.uber.init.call(this);
	
	// create layout
	this.createTabBar();
	this.createDisplayPanel();
	
	// populate tabs
	if (tabNames !== undefined && tabMorphs !== undefined) {
		tabNames.foreach( function(tab, index) {
			myself.addTab(tab, tabMorphs[index]);
		});
	}
};

TabPanelMorph.prototype.createTabBar = function() {
	
	if (this.tabBar) {
		this.tabBar.destroy();
	}
	
	this.tabBar = new Morph();
	this.tabBar.setPosition(this.position());
	this.tabBar.setWidth(this.width());
	this.tabBar.setHeight(30);
	this.add(this.tabBar);
};

TabPanelMorph.prototype.createDisplayPanel = function() {
	
	if (this.displayPanel) {
		this.displayPanel.destroy();
	}
	
	this.displayPanel = new Morph();
	this.displayPanel.setPosition(this.tabBar.bottomLeft());
	this.displayPanel.setWidth(this.width());
	this.displayPanel.setHeight(this.height() - this.tabBar.height());
	this.add(this.displayPanel);
};

TabPanelMorph.prototype.fixLayout = function() {
	var buttonHeight = 30,
		border = 3,
		xPadding = 2,
		yPadding = 2,
		l = this.left(),
		t = this.top(),
		i = 0,
		myself = this;
		
	this.tabBar.setPosition(this.position());
	this.tabBar.setWidth(this.width());
	
	this.tabBar.children.forEach(function (button) {
		i += 1;
		if(l + border + button.width() > myself.tabBar.width()) {
			t += button.height() + 2 * border;
			l = myself.tabBar.left();
		}
		button.setPosition(new Point(
			l + border,
			t + border
		));
		l += myself.tabBar.children[i-1].width() + 2 * border;
	});

	this.tabBar.setHeight(
			t + buttonHeight + 2 * border - this.tabBar.top()
	);
	
	this.displayPanel.setPosition(this.tabBar.bottomLeft());
	this.displayPanel.setWidth(this.width());
	this.displayPanel.setHeight(this.height() - this.tabBar.height());
	
	this.tabs.forEach( function(tab) {
		myself.panels[tab].setPosition(myself.displayPanel.position());
		myself.panels[tab].setExtent(myself.displayPanel.extent());
	});
}

TabPanelMorph.prototype.addTab = function(tabName, tabMorph) {
	var labelWidth = 75,
		colors = [
			new Color(244,244,200),
			new Color(244,244,200).darker(50),
			new Color(244,244,200).lighter(50)
		],
		button,
		myself = this;

	button = new ToggleButtonMorph(
		colors,
		myself, // the tabPanel is the target
		function () {
			myself.currentTab = tabName;
			myself.tabBar.children.forEach(function (each) {
				each.refresh();
			});
			//myself.refreshPalette(true);
			// TODO: Refresh stuff
			myself.reactToTabSelect(tabName);
		},
		tabName[0].toUpperCase().concat(tabName.slice(1)), // label
		function () {  // query
			return myself.currentTab === tabName;
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
	button.outlinePath = ControlBarMorph.prototype.outlinePath;
	button.fixLayout();
	button.refresh();
	this.tabBar.add(button);
	
	tabMorph.setPosition(this.tabBar.bottomLeft());
	tabMorph.setHeight(this.height - this.tabBar.bottom());
	tabMorph.setWidth(this.width());
	this.displayPanel.add(tabMorph);
	if (this.currentTab !== tabName) {
		tabMorph.hide();
	}
	
	this.tabs.push(tabName);
	this.panels[tabName] = tabMorph;
	
	this.fixLayout();
};

TabPanelMorph.prototype.reactToTabSelect = function(tabName) {
	var myself = this;
	this.tabs.forEach( function(tab) {
		if(tab !== tabName) {
			myself.panels[tab].hide();
		} else {
			myself.currentTab = tabName;
			myself.panels[tab].show();
		}
	});
}