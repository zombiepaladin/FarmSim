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
	
	// group properties
	this.fieldPanel.color = this.color;
	
	// add title bar
	this.fieldPanel.titleBar = new ControlBarMorph();
	this.fieldPanel.titleBar.color = new Color(255, 255, 255)
	this.fieldPanel.titleBar.border = 1;
	
	this.fieldPanel.titleBar.clear = new ToggleButtonMorph( 
															null, // colors
															this, // target 
															function () { myself.reset(); }, //action
															" Test Clear "
														   );
	this.fieldPanel.titleBar.add( this.fieldPanel.titleBar.clear );
		
	
	this.fieldPanel.add( this.fieldPanel.titleBar );
	
	
	// add stage morph
	this.fieldPanel.stage = new FieldMorph( this.globalVariables);
	this.fieldPanel.stage.color = new Color( 50, 255, 100 );
	this.fieldPanel.add( this.fieldPanel.stage );

	this.fieldPanel.fixLayout = function() {
	
		myself.fieldPanel.titleBar.setWidth( myself.fieldPanel.width() );
		myself.fieldPanel.titleBar.setHeight( 80 );
		myself.fieldPanel.titleBar.setPosition( myself.fieldPanel.topLeft() );
		
		myself.fieldPanel.titleBar.clear.setPosition( myself.fieldPanel.titleBar.topLeft() );
		
		myself.fieldPanel.stage.setWidth( myself.fieldPanel.width() );
		myself.fieldPanel.stage.setHeight( myself.fieldPanel.height() - myself.fieldPanel.titleBar.height() );
		myself.fieldPanel.stage.setPosition( myself.fieldPanel.titleBar.bottomLeft() );
		myself.fieldPanel.stage.fixLayout();
	};
	
	this.add( this.fieldPanel );
	
};


FarmOpsSystemMorph.prototype.reset = function() {
	
	var myself = this;
	
	myself.fieldPanel.stage.reset();
	
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

