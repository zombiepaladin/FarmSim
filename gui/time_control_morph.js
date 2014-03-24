/*
    TimeControlMorph.js

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

modules.crops = '2014-March-20'


// Declarations

var TimeControlMorph;

// TimeControlMorph /////////////////////////////////////////////////////////

// I am FarmSim's Farm operation system control bar atop the editor plane

// TimeControlMorph inherits from Morph:

TimeControlMorph.prototype = new Morph();
TimeControlMorph.prototype.constructor = TimeControlMorph;
TimeControlMorph.uber = Morph.prototype;

// TimeControlMorph initialization

function TimeControlMorph(universalVariables, field) {
    this.init(universalVariables, field);
}

TimeControlMorph.prototype.init = function (universalVariables, fieldIn) {
	
	
	TimeControlMorph.uber.init.call(this, universalVariables);
	
	//parameters (control)
	this.field = fieldIn;
	
	// parameters (look and feel)
	this.color = new Color(255,0,0);
	this.lineWidth = 4;
	this.padding = 10;
	
	// create sub-morphs
	this.createPlayButton();
	this.createPauseButton();
	this.createFastForwardButton();
	this.createRewindButton();
	this.createTimeLabel();
	this.createSpeedLabel();
	
	
	// set the default width.
	this.setWidth( this.padding + this.rewindButton.width() + 
	               this.padding + this.pauseButton.width() + 
				   this.padding + this.playButton.width() + 
				   this.padding + this.fastForwardButton.width() + 
				   this.padding 
				 );

};

TimeControlMorph.prototype.createPauseButton = function() {
	
	var myself = this;
	
	if( this.pauseButton )
	{
		this.pauseButton.destroy();
	}

	this.pauseButton = new ToggleButtonMorph( 
											null, // colors
											this, // target 
											function () {  }, //action
											"   || "
											);
											
	this.add( this.pauseButton );
	
};
TimeControlMorph.prototype.createPlayButton = function() {
	
	var myself = this;
	
	if( this.playButton )
	{
		this.playButton.destroy();
	}

	this.playButton = new ToggleButtonMorph( 
											null, // colors
											this, // target 
											function () {  }, //action
											"   > "
											);
											
	this.add( this.playButton );
	
};
TimeControlMorph.prototype.createFastForwardButton = function() {
	
	var myself = this;
	
	if( this.fastForwardButton )
	{
		this.fastForwardButton.destroy();
	}

	this.fastForwardButton = new ToggleButtonMorph( 
											null, // colors
											this, // target 
											function () {  }, //action
											"   >> "
											);
											
	this.add( this.fastForwardButton );
	
};
TimeControlMorph.prototype.createRewindButton = function() {
	
	var myself = this;
	
	if( this.rewindButton )
	{
		this.rewindButton.destroy();
	}

	this.rewindButton = new ToggleButtonMorph( 
											null, // colors
											this, // target 
											function () {  }, //action
											"   << "
											);
											
	this.add( this.rewindButton );
	
};

TimeControlMorph.prototype.createTimeLabel = function() {
	
	if( this.timeLabel)
	{
		this.timeLabel.destroy();
	}
	
	this.timeLabel = new TextMorph( 
									"DD:HH:MM",     // text
									18,             // font size
									null,           // font style
									null,           // bold
									null,           // italic
									null,           // alignment
									null,           // width
									null,           // fontName
									null,           // shadowOffset
									null            // shadowColor
									);
	this.add( this.timeLabel );
	
	
};
TimeControlMorph.prototype.createSpeedLabel = function() {
	
		
	if( this.speedLabel)
	{
		this.speedLabel.destroy();
	}
	
	this.speedLabel = new TextMorph( 
									"1X",     // text
									18,             // font size
									null,           // font style
									true,           // bold
									null,           // italic
									null,           // alignment
									null,           // width
									null,           // fontName
									null,           // shadowOffset
									null            // shadowColor
									);
	this.add( this.speedLabel );
	
	
	
};

TimeControlMorph.prototype.fixLayout = function() {

	var myself = this;
	
	this.rewindButton.setPosition( new Point( myself.left() + myself.padding, myself.top() + myself.padding ) );
	this.pauseButton.setPosition( new Point( myself.rewindButton.right() + myself.padding, myself.rewindButton.top() ) );
	this.playButton.setPosition( new Point( myself.pauseButton.right() + myself.padding,  myself.pauseButton.top() ) );
	this.fastForwardButton.setPosition( new Point( myself.playButton.right() + myself.padding,   myself.playButton.top() ) );
	this.timeLabel.setPosition( new Point( myself.rewindButton.left(), myself.rewindButton.bottom() + myself.padding));
	this.speedLabel.setPosition( new Point( myself.timeLabel.right() + 2 * myself.padding, myself.rewindButton.bottom() + myself.padding ) );

};

TimeControlMorph.prototype.drawNew = function() {

    // initialize my surface property
    this.image = newCanvas(this.extent());
    var context = this.image.getContext('2d');

	context.fillStyle = this.color.toString();
	context.fillRect(0,0,this.width(), this.height() );

	context.lineWidth = this.lineWidth;
	context.strokeStyle = new Color( 255,255,255 );

	context.beginPath();
	context.moveTo( 0,  0);                      //this.left(), this.top() );
	context.lineTo( this.width(), 0);            //this.right(), this.top() );
	context.lineTo( this.width(), this.height());//this.right(), this.bottom() );
	context.lineTo( 0,  this.height());          //this.left(), this.bottom() );
	context.lineTo( 0,  0);                      //this.left(), this.top() );	
	context.stroke();
	context.closePath();


};
