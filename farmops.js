/*
    farmops.js

    a sumulation programming environment
    based on morphic.js, blocks.js, threads.js and objects.js
    inspired by Scratch and Snap!
	
	written by Byron Wheeler
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
    GNU Affero General Public License for m	ore details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


    prerequisites:
    --------------
    needs blocks.js, threads.js, objects.js and morphic.js


    toc
    ---
    the following list shows the order in which all constructors are
    defined. Use this list to locate code in this document:

		FarmOpsSystemMorph
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

modules.crops = '2014-March-03'


// Declarations

var FarmOpsControlMorph;

// FarmOpsControlMorph /////////////////////////////////////////////////////////

// I am FarmSim's Farm operation system control bar atop the editor plane

// FarmOpsControlMorph inherits from Morph:

FarmOpsControlMorph.prototype = new ControlBarMorph();
FarmOpsControlMorph.prototype.constructor = FarmOpsControlMorph;
FarmOpsControlMorph.uber = ControlBarMorph.prototype;

// FarmOpsControlMorph initialization

function FarmOpsControlMorph(universalVariables, field) {
    this.init(universalVariables, field);
}

FarmOpsControlMorph.prototype.init = function (universalVariables, fieldIn) {
	
	
	FarmOpsControlMorph.uber.init.call(this, universalVariables);
	
	this.field = fieldIn;
	
	this.color = new Color(255,255,255);
	this.boarder = 1;
	
	this.createClearButton();

	this.createTimerControl();
	
	
};

FarmOpsControlMorph.prototype.createClearButton = function() {
	
	var myself = this;
	
	if( this.clearButton )
	{
		this.clearButton.destroy();
	}

	this.clearButton = new ToggleButtonMorph( 
											null, // colors
											this, // target 
											function () { myself.field.reset(); }, //action
											" Test Clear "
											);
											
	this.add( this.clearButton );
	
};
FarmOpsControlMorph.prototype.createTimerControl = function() {
	
	if( this.timerControl)
	{
		this.timerControl.destroy();
	}
	
	this.timerControl = new TimeControlMorph();
	
	this.timerControl.color = new Color( 15,255, 255 );
	
	this.add( this.timerControl );
	
};

FarmOpsControlMorph.prototype.fixLayout = function() {

	var padding = 10;
	var myself = this;
	
	this.clearButton.setPosition(new Point( myself.right() - myself.clearButton.width() - padding, myself.top() + padding) );
	
	this.timerControl.setHeight( myself.height() );
	this.timerControl.setPosition( myself.topLeft() );
	this.timerControl.fixLayout();
};



// Declarations

var FarmOpsSystemMorph;

// FarmOpsSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's Farm operation system editor panel

// FarmOpsSystemMorph inherits from Morph:

FarmOpsSystemMorph.prototype = new Morph();
FarmOpsSystemMorph.prototype.constructor = FarmOpsSystemMorph;
FarmOpsSystemMorph.uber = Morph.prototype;

// FarmOpsSystemMorph initialization

function FarmOpsSystemMorph(universalVariables) {
    this.init(universalVariables);
}

FarmOpsSystemMorph.prototype.init = function (universalVariables) {
	
	this.universalVariables = universalVariables;
	
	FarmOpsSystemMorph.uber.init.call(this, universalVariables);
	
	this.color = new Color(10,183,10);
	
	this.spritePanel = null;
	this.fieldPanel = null;
	
	this.createSpritePanel();
	this.createFieldPanel();
	
	this.fixLayout();
	
};

FarmOpsSystemMorph.prototype.createSpritePanel = function() {
	
	var myself = this;
	
	if( this.spritePanel ){
		this.spritePanel.destroy();
	}
	
	this.spritePanel = new Morph();
	
	// group properties
	this.spritePanel.color = this.color;
	
	
	// add top bar
	this.spritePanel.controlBar = new ControlBarMorph();
	this.spritePanel.controlBar.color = new Color( 255, 0, 0);
	this.spritePanel.add( this.spritePanel.controlBar );
	
	
	// add menu with buttons
	this.spritePanel.categoryMenu = new Morph();
	this.spritePanel.categoryMenu.color = new Color( 255, 255, 255 );	
	this.spritePanel.add( this.spritePanel.categoryMenu );
	
	// add sprite corral
	this.spritePanel.corral = new SpriteCorralMorph();
	this.spritePanel.corral.color = new Color( 255, 255, 255 );
	this.spritePanel.add( this.spritePanel.corral );
	
	
	
	this.spritePanel.fixLayout = function() {
		
		var padding = 2;
		
		myself.spritePanel.controlBar.setHeight( 30 );
		myself.spritePanel.controlBar.setWidth( myself.spritePanel.width() );
		myself.spritePanel.controlBar.setPosition( myself.spritePanel.topLeft() );
		
		myself.spritePanel.categoryMenu.setHeight( 120 )
		myself.spritePanel.categoryMenu.setWidth( myself.spritePanel.width() );
		myself.spritePanel.categoryMenu.setPosition( myself.spritePanel.controlBar.bottomLeft() );		
		
		myself.spritePanel.corral.setWidth( myself.spritePanel.width() );
		myself.spritePanel.corral.setHeight( myself.spritePanel.height() - (myself.spritePanel.categoryMenu.height() + myself.spritePanel.controlBar.height() + 11*padding) );
		myself.spritePanel.corral.setPosition( new Point( myself.spritePanel.categoryMenu.left(), myself.spritePanel.categoryMenu.bottom() + padding ) );	
	}
	
	
	this.add( this.spritePanel );
	
};

FarmOpsSystemMorph.prototype.createFieldPanel = function() {
	
	var myself = this;
	
	if( this.fieldPanel ) {
		this.fieldPanel.destroy();
	}
	
	this.fieldPanel = new Morph();
	
	// add stage morph
	if( this.fieldPanel.stage )
	{
		this.fieldPanel.stage.destroy();
	}
	
	this.fieldPanel.stage = new FieldMorph( this.globalVariables);
	this.fieldPanel.stage.color = new Color( 50, 255, 100 );
	this.fieldPanel.add( this.fieldPanel.stage );

	// add title bar
	if( this.fieldPanel.titleBar)
	{
		this.fieldPanel.titleBar.destroy();
	}
	this.fieldPanel.titleBar = new FarmOpsControlMorph(this.universalVariables, this.fieldPanel.stage );
	this.fieldPanel.add( this.fieldPanel.titleBar );
	
	// fixlayout
	this.fieldPanel.fixLayout = function() {
	
		myself.fieldPanel.titleBar.setWidth( myself.fieldPanel.width() );
		myself.fieldPanel.titleBar.setHeight( 80 );
		myself.fieldPanel.titleBar.setPosition( myself.fieldPanel.topLeft() );
		myself.fieldPanel.titleBar.fixLayout();
		
		myself.fieldPanel.stage.setWidth( myself.fieldPanel.width() );
		myself.fieldPanel.stage.setHeight( myself.fieldPanel.height() - myself.fieldPanel.titleBar.height() );
		myself.fieldPanel.stage.setPosition( myself.fieldPanel.titleBar.bottomLeft() );
		myself.fieldPanel.stage.fixLayout();
	};
	
	this.add( this.fieldPanel );
	
};



FarmOpsSystemMorph.prototype.fixLayout = function() {

	var padding = 10;

	this.spritePanel.setWidth(200);
	this.spritePanel.setHeight( this.height() );
	this.spritePanel.setPosition( new Point(this.left() + padding, this.top() + padding) );
	this.spritePanel.fixLayout();
	
	this.fieldPanel.setWidth( this.width() - this.spritePanel.width() - 3*padding);
	this.fieldPanel.setHeight( this.height() - 2*padding);
	this.fieldPanel.setPosition( new Point( this.spritePanel.right() + padding, this.spritePanel.top() ) );	
	this.fieldPanel.fixLayout();

};

