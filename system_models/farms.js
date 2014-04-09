/*
    Farms.js

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

		FarmSystemMorph
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

var FarmSystemMorph;

// FarmSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's Farm operation system editor panel

// FarmSystemMorph inherits from Morph:

FarmSystemMorph.prototype = new Morph();
FarmSystemMorph.prototype.constructor = FarmSystemMorph;
FarmSystemMorph.uber = Morph.prototype;

// FarmSystemMorph initialization

function FarmSystemMorph(universalVariables, fields) {
    this.init(universalVariables, fields);
}

FarmSystemMorph.prototype.init = function (universalVariables, import_fields) {
	
	var myself = this;
	
	this.universalVariables = universalVariables;
	
	
	var icon1 = new FarmIconMorph();
		icon2 = new FarmIconMorph();
		
		icon1.name = 'test1';
		icon2.name = 'test2';
	
	this.fields = [];
	
	this.fields.push( icon1 );
	this.fields.push( icon2 );

	FarmSystemMorph.uber.init.call(this, universalVariables );
	
	this.color = new Color(20, 200, 20);
	
	
	
	this.controlBar = null;
	this.corral = null;
	this.fieldPanel = null;
	
	
	
	this.createSpritePanel();
	this.createFieldPanel();
	this.fieldPanel.descEditor.loadSprite( icon1 );
	this.fixLayout();
	
};

FarmSystemMorph.prototype.createSpritePanel = function() {
	
	var myself = this;
	
	
	// add top bar
	if( this.controlBar){
		myself.controlBar.destroy();
	}

	this.controlBar = new ControlBarMorph();
	this.controlBar.color = new Color( 255, 0, 0);
	this.add( this.controlBar );
	
	// add sprite corral
	if( this.corral ) {
		myself.corral.destroy();
	}
    
	this.corral = new FarmCorralMorph(this.fields);
		
	this.add( this.corral );
	
	this.fields.forEach( function(field, f, fs) {
		myself.corral.addMorph(field);
	});
};

FarmSystemMorph.prototype.createFieldPanel = function() {
	
	var myself = this;
	
	if( this.fieldPanel ) {
		this.fieldPanel.destroy();
	}
	
	this.fieldPanel = new TabPanelMorph( [ this.color, 
	                                       new Color( 0,255, 255 ).darker(25), 
	                                       new Color( 0,255, 255 ) ]);
	
	if( this.fieldPanel.descEditor)
	{
		this.fieldPanel.descEditor.destroy();
	}
	
	this.fieldPanel.descEditor = new DescriptionEditorMorph(null, this.corral);
	this.fieldPanel.descEditor.setColor( new Color( 0, 128, 255) );
	this.fieldPanel.addTab('description', this.fieldPanel.descEditor);
	
	// add stage morph
	if( this.fieldPanel.stage )
	{
		this.fieldPanel.stage.destroy();
	}
	
	this.fieldPanel.stage = new Morph();
	
	this.fieldPanel.stage.toolBar = new ToolBarMorph();
	this.fieldPanel.stage.toolBar.color = new Color( 0,255, 255 );
	this.fieldPanel.stage.add( this.fieldPanel.stage.toolBar );
	
	this.fieldPanel.stage.field = new FarmMorph( this.globalVariables);
	this.fieldPanel.stage.add( this.fieldPanel.stage.field );
	
	this.fieldPanel.stage.fixLayout = function() {
		myself.fieldPanel.stage.toolBar.setHeight( 50 );
		myself.fieldPanel.stage.toolBar.setWidth( myself.fieldPanel.stage.width() );
		myself.fieldPanel.stage.toolBar.setPosition( myself.fieldPanel.stage.position() );
		myself.fieldPanel.stage.toolBar.fixLayout();
		
		myself.fieldPanel.stage.field.setHeight( myself.fieldPanel.stage.height() - myself.fieldPanel.stage.toolBar.height() );
		myself.fieldPanel.stage.field.setWidth( myself.fieldPanel.stage.width() );
		myself.fieldPanel.stage.field.setPosition( myself.fieldPanel.stage.toolBar.bottomLeft() );
	};
	
	//this.fieldPanel.stage.field.color = new Color( 50, 255, 100 );
	this.fieldPanel.addTab('field', this.fieldPanel.stage);

	this.add( this.fieldPanel );
};

FarmSystemMorph.prototype.fixLayout = function() {

	var padding = 10;
	
	this.controlBar.setWidth( 240 );
	this.controlBar.setHeight( 30 );
	this.controlBar.setPosition( new Point(this.left() + padding/2, this.top() + padding/2) );
	
	this.corral.setWidth( this.controlBar.width() );
	this.corral.setHeight( this.height() - this.controlBar.height()  - 2*padding);
	this.corral.setPosition( this.controlBar.bottomLeft() );
	this.corral.fixLayout();
	
	this.fieldPanel.setWidth( this.width() - this.corral.width() - 3*padding );
	this.fieldPanel.setHeight(  this.height() - 2*padding );
	this.fieldPanel.setPosition( new Point( this.corral.right() + padding, this.controlBar.top() ) );	
	
	this.fieldPanel.stage.fixLayout();
	this.fieldPanel.fixLayout();
	

};

