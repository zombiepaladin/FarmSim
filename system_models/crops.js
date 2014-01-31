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

// CropSystemMorph /////////////////////////////////////////////////////////

// I am FarmSim's crop system editor panel

// CropSystemMorph inherits from SpriteEditorMorph:

CropSystemMorph.prototype = new SpriteEditorMorph();
CropSystemMorph.prototype.constructor = CropSystemMorph;
CropSystemMorph.uber = SpriteEditorMorph.prototype;

// CropSystemMorph initialization

function CropSystemMorph(universalVariables, cropSprites) {
    this.init(universalVariables, cropSprites);
}

CropSystemMorph.prototype.init = function (universalVariables, cropSprites) {
	
	var cropSprites = [],
				sprite2 = new CropSpriteMorph(),
                sprite3 = new CropSpriteMorph(),
                sprite4 = new CropSpriteMorph(),
                sprite5 = new CropSpriteMorph();
        sprite2.name = "Alpha";
        sprite3.name = "Beta";
        sprite4.name = "Delta";
        sprite5.name = "Gamma";	
		
		
	cropSprites.push(sprite2);
	cropSprites.push(sprite3);
	cropSprites.push(sprite4);
	cropSprites.push(sprite5);
	
	// initialize inherited properties
	CropSystemMorph.uber.init.call(this, universalVariables, cropSprites);
	
	sprite2.setCenter(this.stage.center());
	
    // add/modify properties
	this.modelSpriteType = CropSpriteMorph;
	this.modelSpriteIconType = CropSpriteIconMorph;
};
