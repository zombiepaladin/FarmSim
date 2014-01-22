/*

    weathers.js

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

		WeaterSystemMorph
		WeatherIconMorph


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

modules.weathers = '2014-January-13';

// Declarations

var WeatherSystemMorph;
var WeatherIconMorph;

// WeatherSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's weather system editor panel

// WeatherSystemMorph inherits from Morph:

WeatherSystemMorph.prototype = new Morph();
WeatherSystemMorph.prototype.constructor = WeatherSystemMorph;
WeatherSystemMorph.uber = Morph.prototype;

// WeatherSystemMorph preferences settings and skings

// ... to follow ...

// Weather system morph instance creation:

WeatherSystemMorph.prototype.backgroundColor = new Color(20, 200, 20);
WeatherSystemMorph.prototype.stageBarColor = new Color(244, 20, 20);
WeatherSystemMorph.prototype.stageColor = new Color(255,255,255);
WeatherSystemMorph.prototype.corralBarColor = new Color (0,0,0); // TODO : implement, currently its the default
WeatherSystemMorph.prototype.corralColor = new Color(255,255,255);
WeatherSystemMorph.prototype.weatherEditorColors = [
							new Color(20, 200, 20),              // background color of tabBar and the background color for the display morph.
							new Color(20, 233, 233).darker(15), // this is the color of the unselected tabs
							new Color(20, 233, 233) 			// this is the color of the slected panel
							];
						

// Weather system constructor
function WeatherSystemMorph(aWeather){
	this.init(aWeather);
};

// Weather system init function
WeatherSystemMorph.prototype.init = function(aWeather){
	
	console.log("Weather system init");
	
	// additional properties
	this.weather = aWeather; // current weather selected
	// should create a new WeatherSpriteMorph() if one is not passed in.
	
	this.globalVariables = new VariableFrame();
	this.weathers = new List([]); // list of weathers
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
	this.weatherEditor = null;
	
	this.setWidth(910);
	this.setHeight(429);
	
	//  initialize inherited properties
	WeatherSystemMorph.uber.init.call(this);
	
	// configure inherited properties
	this.fps = 2;
	this.setColor( WeatherSystemMorph.prototype.backgroundColor );
	
	// Build the different panes
	this.createStageBar();
	this.createStage();
	this.createCorralBar();
	this.createCorral();
	this.createWeatherEditor();
	
};

// This function creates the stage bar morph.
WeatherSystemMorph.prototype.createStageBar = function() {
	
	console.log("create weather stage bar");
	
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
	this.stageBar.setColor( WeatherSystemMorph.prototype.stageBarColor );
	
	// add the stage bar to the weather system.
	this.add(this.stageBar);
	
};

// This function creates the stage window morph.
WeatherSystemMorph.prototype.createStage = function() {
	
		console.log("create weather stage");
	
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
	this.stage.setColor( WeatherSystemMorph.prototype.stageColor );
	
	
	// add the stage  to the weather system.
	this.add(this.stage);
};

// This function creates the corral bar morph.
WeatherSystemMorph.prototype.createCorralBar = function() {
	
		console.log("create weather corral bar");
	
	// remove any previous stage bars.
	if(this.corralBar){
		this.corralBar.destroy();
	}
		
	// create the new corral bar.
	this.corralBar = new ControlBarMorph();
	
	// define its parameters.
	this.corralBar.add( new StringMorph("    Weathers") );
	this.corralBar.setWidth(this.stageDimensions.x);
	this.corralBar.setHeight(30);
	
	// this.corralBar.setColor( WeatherSystemMorph.prototype.stageColor ); // TODO: figure out the color for the corral bar
	
	// add the corral bar to the weather system.
	this.add(this.corralBar);
	
};

// This function creates the corral window morph.
WeatherSystemMorph.prototype.createCorral = function() {
	var frame, template, padding = 5, myself = this;
	
		console.log("create weather corral");
	
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
		return morph instanceof WeatherSpriteIconMorph;
	};
	
	this.corral.contents.reactToDropOf = function (WeatherIcon) {
		myself.corral.reactToDropOf(weatherIcon);
	};
	
	// support function for list of weathers.
	this.weathers.asArray().forEach( function(morph) {
		template = new WeatherIconMorph( morph, template);
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
	
	this.corral.addWeather = function(weather) {
		this.contents.add( new WeatherIconMorph(weather) );
		this.fixLayout();
	};
	
	this.corral.refresh = function() {
		this.contents.children.forEach(function(icon) {
			icon.refresh();
		});
	};
	
	this.corral.wantsDropOf = function(morph) {
		return morph instanceof WeatherIconMorph;
	};
	
	this.corral.reactToDropOf = function (weatherIcon) {
		var idx = 1;
		var pos = weatherIcon.position();
		weatherIcon.destroy();
		this.contents.children.forEach( function (icon) {
			if( pos.gt(icon.position()) || pos.y > icon.bottom()) { // ??? should it be pos.get
				idx += 1;
			}
		});
		
		myself.weathers.add(spriteIcon.object, idx); // ??? spriteIcon
		myself.createCorral();
		myself.fixLayout();
	};
	
	
	// add the stage bar to the weather system.
	this.add(this.corral);
};

// This funciton creates the weather editor window morph.
WeatherSystemMorph.prototype.createWeatherEditor = function() {

	var myself = this;
		
	if(this.weatherEditor) {
		this.weatherEditor.destroy();
	}
	
	// create the tab panel to hold the weather editor.
	this.weatherEditor = new TabPanelMorph(WeatherSystemMorph.prototype.weatherEditorColors);
	
	// add tabs to the editor.
	
	// description tab
	var descEditor = new Morph();
	descEditor.setColor( WeatherSystemMorph.prototype.weatherEditorColors[2] );
	this.weatherEditor.addTab('description', descEditor);

	// script tab
	var scriptEditor = new ScriptEditorMorph();
	scriptEditor.setColor( WeatherSystemMorph.prototype.weatherEditorColors[2] );
	this.weatherEditor.addTab('scripts', scriptEditor);
	
	// costume tab
	var costumeEditor = new Morph();
	costumeEditor.setColor( WeatherSystemMorph.prototype.weatherEditorColors[2] );
	this.weatherEditor.addTab('costumes', costumeEditor);
	
	// add the editor to the weather system
	this.add(this.weatherEditor);
};

// This function places all of this systems morphs in the correct place on the page.
WeatherSystemMorph.prototype.fixLayout = function() {
	
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
		
	// weather editor
	this.weatherEditor.setPosition(this.stageBar.topRight().add(new Point(10, 0)));
	this.weatherEditor.setWidth(this.width() - this.stageBar.width() - 30);
	this.weatherEditor.setHeight(this.height() - 10);
	this.weatherEditor.fixLayout();
	
	console.log("fixLayout - weather system");

};

// WeatherIconMorph /////////////////////////////////////////////////////////

/*
    I am a selectable element in the WeatherEditor's "Weathers" tab, keeping
    a self-updating thumbnail of the Weather I'm respresenting, and a
    self-updating label of the Weather's name (in case it is changed
    elsewhere)
*/

// WeatherIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

WeatherIconMorph.prototype = new ToggleButtonMorph();
WeatherIconMorph.prototype.constructor = WeatherIconMorph;
WeatherIconMorph.uber = ToggleButtonMorph.prototype;

// weatherIconMorph settings
WeatherIconMorph.prototype.thumbSize = new Point(80, 60);
WeatherIconMorph.prototype.labelShadowOffset = null;
WeatherIconMorph.prototype.labelColor = new Color(255, 255, 255);
WeatherIconMorph.prototype.fontSize = 9;

// Weather Icon instance creation:
function WeatherIconMorph(aWeather, aTemplate) {
	this.init(aWeather, aTemplate);
}

// weather icon init function
WeatherIconMorph.prototype.init = function (aWeather, aTemplate) {
	var colors, action, query, myself = this;
	
	if(!aTemplate) {
		colors = [
			IDE_Morph.prototype.groupColor,
			IDE_Morph.prototype.frameColor,
			IDE_Morph.prototype.frameColor
		];
	}
}




























