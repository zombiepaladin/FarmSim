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
var SpriteCorralMorph;
var SystemMorph;


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

function TabPanelMorph(tabColor){
	this.init(tabColor);
};

// The initialize function.
TabPanelMorph.prototype.init = function(tabColors) {
	var myself = this;
	
	// additional properties
	this.currentTab = 'description';
	this.colors = tabColors;
	this.TabHeight = 30;
	
	// collections of tabs and panels.
	this.tabs = []
	this.panels = [];
	
	// display morphs.
	this.tabBar = null;
	this.displayPanel = null;
	
	// initialize inherited properties
	TabPanelMorph.uber.init.call(this);
	
	// create layout
	this.createTabBar();
	this.createDisplayPanel();
};

// Create the tab bar.
TabPanelMorph.prototype.createTabBar = function() {
	
	// check if there is already a tab bar
	if (this.tabBar) {
		this.tabBar.destroy();
	}
	
	// create a new tab bar
	this.tabBar = new Morph();
	
	// assign color property to tab bar.
	this.tabBar.color = this.colors[0];
	
	// add the tab bar to the TabPanelMorph
	this.add(this.tabBar);
};

// Create the display panel
TabPanelMorph.prototype.createDisplayPanel = function() {
	
	// check if there is already a displayPanel
	if (this.displayPanel) {
		this.displayPanel.destroy();
	}
	
	// create a new morph for the panel area
	this.displayPanel = new Morph();

	// assign the color property
	this.displayPanel.color = this.colors[2];

	// add the display panel to the TabPanelMorph
	this.add(this.displayPanel);
};

// Arrange the layout.
TabPanelMorph.prototype.fixLayout = function() {
	var buttonHeight = this.TabHeight,
		border = 3,
		l = this.left(),
		t = 0,
		i = 0,
		myself = this;
		
	
	// tab bar layout
	this.tabBar.setWidth( this.width() );
	this.tabBar.setHeight( this.tabs[0].height() ) || 15; // 15 is pretty close. incase there arn't any tabs in this yet.
	this.tabBar.setPosition( this.position() );
	
	
	// display panel layout
	this.displayPanel.setWidth(this.width() );
	this.displayPanel.setHeight(this.height() - this.tabBar.height() );
	this.displayPanel.setPosition( this.tabBar.bottomLeft() );

	// tabs on the tab bar.
	this.tabs.forEach(function (tab) {
		i += 1;
		if(l + border + tab.width() > myself.tabBar.width()) {
			//t += tab.height() + 2 * border;
			l = myself.tabBar.left();
		}
		
		t = myself.tabBar.bottomLeft().asArray()[1] - tab.height();
		
		tab.setPosition( new Point( l + border, t) );
		console.log(t);
		l += myself.tabs[i-1].width() + 2 * border;
		
	});
	
	// the display panels
	this.tabs.forEach( function(tab) {
		myself.panels[tab.name].setPosition( myself.displayPanel.position().add( new Point(border, border) ) );
		myself.panels[tab.name].setExtent( myself.displayPanel.extent().subtract( new Point( 2*border, 2*border ) ) );
	});
	this.outlineTabPanel();

}

// Add new tab to the collection.
TabPanelMorph.prototype.addTab = function(tabName, panelMorph) {
	var	myself = this;
	var tab;
	
	// TODO: check for duplicate tab. 

	
	// create new tab
	tab = new TabMorph(
		[															// color <array>: [normal, highlight, pressed]
			this.colors[1],
			this.colors[1].lighter(45),
			this.colors[2]
		],    											
		this.tabBar,    											// tab bar
		function () {											    // action
			myself.currentTab = tabName;
			myself.tabs.forEach( function (each) { each.refresh(); } );			
			myself.reactToTabSelect(tabName);
		}, 			 
		tabName[0].toUpperCase().concat(tabName.slice(1)),			// labelString
		function () { return myself.currentTab === tabName; },		// query		 			 
		null,            											// enviroment
		null             											// hint
	);
	
	// set up tab properties.
	tab.corner = 5;
	tab.edge = 1; // controls the edge line thickness.
	
	tab.drawEdges = function(
							context,    // context to the canvas
							color, 		// primary color
							topColor,   // top color
							bottomColor // bottom color
							) {
		if (MorphicPreferences.isFlat && !this.is3D) {return; }

		var w = this.width(),
			h = this.height(),
			c = this.corner,
			e = this.edge,
			eh = e / 2,
			gradient;

		nop(color); // argument not needed here

		context.lineCap = 'round';
		context.lineWidth = e;

		context.beginPath();
		context.moveTo(0, h + eh);
		context.bezierCurveTo(c, h, c, 0, c * 2, eh);
		context.lineTo(w - c * 2, eh);
		context.bezierCurveTo(w - c, 0, w - c, h, w, h + eh);
		context.stroke();
	};
		
	tab.fixLayout();
	tab.refresh();
	
	// add tab to the tabBar.
	this.tabBar.add(tab);
	
	this.displayPanel.add(panelMorph);
	if (this.currentTab !== tabName) {
		panelMorph.hide();
	}
	tab.name = tabName;
	this.tabs.push(tab);
	this.panels[tabName] = panelMorph;
	
	this.fixLayout();
};

// this function is the response to a tab being selected.
TabPanelMorph.prototype.reactToTabSelect = function(tabName) {
	var myself = this;
	this.tabs.forEach( function(tab) {
		if(tab.name !== tabName) {
			myself.panels[tab.name].hide();
			tab.color = myself.colors[1] // the color of the unselected tab
		} else {
			myself.currentTab = tabName;
			tab.color = myself.colors[2]; // same as the selected panel
			myself.panels[tab.name].show();
			myself.outlineTabPanel();
		}
	});
}

TabPanelMorph.prototype.outlineTabPanel = function() {
	
	var myself = this;
	var curTab = null;
	var tabName = this.currentTab;
	
	this.tabs.forEach( function(tab) {
	
		if(tab.name === tabName) {
			curTab = tab;
		}
	});

	// get the top-most canvas to draw on.
	this.image = newCanvas(this.displayPanel.extent());  
	var context = this.displayPanel.image.getContext('2d');
	
	var x1 = 0;
	var	y1 = 0;
	var	x2 = curTab.bottomLeft().asArray()[0] - this.topLeft().asArray()[0];
	var	x3 = curTab.width()+x2;
	var	x4 = this.displayPanel.width();
	var	y2 = this.displayPanel.height();
	
	
	/*
	(x1,y1)--------(x2,y1)  "tab"   (x3,y1)------(x4,y1)
	|                                                  |
	|                                                  |
	|                                                  |
	|                                                  |
	(x1,y2)--------------------------------------(x4,y2)
	*/
	
	context.strokeStyle = ( new Color(0,0,0) ).toString();
	context.lineWidth = 1;
	
	context.beginPath();
	context.moveTo(x3,y1);
	context.lineTo(x4,y1);
	context.lineTo(x4,y2);
	context.lineTo(x1,y2);
	context.lineTo(x1,y1);
	context.lineTo(x2,y1);
	context.stroke();
	
	context.strokeStyle = this.displayPanel.color.toString();
	context.lineWidth = 5;
	context.beginPath();
	context.moveTo(x2,y1);
	context.lineTo(x3,y1);
	context.stroke();
	
};


TabPanelMorph.prototype.show = function() {

	TabPanelMorph.uber.show.call(this);
	
	this.reactToTabSelect(this.currentTab);
	
};

// ScriptEditorMorph ///////////////////////////////////////

// I am an editor that allows you to edit a sprite's scripts

// ScriptEditorMorph inherits from Morph:

ScriptEditorMorph.prototype = new Morph();
ScriptEditorMorph.prototype.constructor = TabPanelMorph;
ScriptEditorMorph.uber = Morph.prototype;

// ScriptEditorMorph instance creation:

function ScriptEditorMorph(aSprite){
	this.init(aSprite);
};

ScriptEditorMorph.prototype.init = function (aSprite) {
	var myself = this;
	
	// additional properties
	this.currentSprite = aSprite || new SpriteMorph();
	this.defaultWidth = 200;
	this.currentCategory = 'motion';
	this.categories = null;
	this.palette = null;
	this.editor = null;	
	
	// initialize inherited properties
	ScriptEditorMorph.uber.init.call(this);
	
	// create layout
	this.createCategories();
	this.createPalette();
	this.createEditor();
	
	this.fixLayout();
};

ScriptEditorMorph.prototype.frameColor = new Color(60,60,60);
ScriptEditorMorph.prototype.groupColor = new Color(255, 255, 255);

ScriptEditorMorph.prototype.createCategories = function () {
	var myself = this;
	console.log("create categories");
	if (this.categories) {
		this.categories.destroy();
	}
	this.categories = new Morph();
	this.categories.color = this.groupColor;
	this.categories.silentSetWidth(this.defaultWidth);
	
	function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(50),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                myself.currentCategory = category;
                myself.categories.children.forEach(function (each) {
                    each.refresh();
                });
                myself.refreshPalette(true);
            },
            category[0].toUpperCase().concat(category.slice(1)), // label
            function () {  // query
                return myself.currentCategory === category;
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
        myself.categories.add(button);
        return button;
    }
	
	function fixCategoriesLayout() {
        var buttonWidth = myself.categories.children[0].width(),
            buttonHeight = myself.categories.children[0].height(),
            border = 3,
            rows =  Math.ceil((myself.categories.children.length) / 2),
            xPadding = (myself.categories.width()
                - border
                - buttonWidth * 2) / 3,
            yPadding = 2,
            l = myself.categories.left(),
            t = myself.categories.top(),
            i = 0,
            row,
            col;

        myself.categories.children.forEach(function (button) {
            i += 1;
            row = Math.ceil(i / 2);
            col = 2 - (i % 2);
            button.setPosition(new Point(
                l + (col * xPadding + ((col - 1) * buttonWidth)),
                t + (row * yPadding + ((row - 1) * buttonHeight) + border)
            ));
        });

        myself.categories.setHeight(
            (rows + 1) * yPadding
                + rows * buttonHeight
                + 2 * border
        );
    }
		
	SpriteMorph.prototype.categories.forEach(function (cat) {
		if(!contains(['lists', 'other'], cat)) {
			addCategoryButton(cat);
		}
	});
	fixCategoriesLayout();
	this.add(this.categories);
};

ScriptEditorMorph.prototype.createPalette = function () {
	// assumes the categories have already been created
	var myself = this;
	console.log("create palette");
	if (this.palette) {
		this.palette.destroy();
	}
	
	this.palette = this.currentSprite.palette(this.currentCategory);
	this.palette.isDraggable = false;
	this.palette.acceptsDrops = true;
	this.palette.contents.acceptsDrops = false;
	
	this.palette.reactToDropOf = function (droppedMorph) {
		if (droppedMorph instanceof DialogBoxMorph) {
			myself.world().add(droppedMorph);
		} else if (droppedMorph instanceof SpriteMorph) {
			myself.removeSprite(droppedMorph);
		} else if (droppedMorph instanceof SpriteIconMorph) {
			droppedMorph.destroy();
			myself.removeSprite(droppedMorph.object);
		} else if (droppedMorph instanceof CostumeIconMorph) {
			myself.currentSprite.wearCustume(null);
			droppedMorph.destroy();
		} else {
			droppedMorph.destroy();
		}
	};
	
	this.palette.setWidth(this.categories.width());
	this.add(this.palette);
	this.palette.scrollX(this.palette.padding);
	this.palette.scrollY(this.palette.padding);
};

ScriptEditorMorph.prototype.createEditor = function() {
	// assumes the categories have already been created
	var scripts = this.currentSprite.scripts,
		myself = this;
		
	if (this.editor) {
		this.editor.destroy();
	}
	
	scripts.isDraggable = false;
	scripts.color = this.groupColor;
	
	this.editor = new Morph();
	
	this.editor = new ScrollFrameMorph(
		scripts,
		null,
		this.sliderColor
	);
	
	this.editor.color = new Color(20,70,100);
	this.editor.padding = 10;
	this.editor.growth = 50;
	this.editor.isDraggable = false;
	this.editor.acceptsDrops = false;
	this.editor.contents.acceptsDrops = true;
	
	scripts.scrollFrame = this.editor;
	this.add(this.editor);
	this.editor.scrollX(this.editor.padding);
	this.editor.scrollY(this.editor.padding);
}

ScriptEditorMorph.prototype.refreshPalette = function (shouldIgnorePosition) {
    var oldTop = this.palette.contents.top();

    this.createPalette();
    this.fixLayout('refreshPalette');
    if (!shouldIgnorePosition) {
        this.palette.contents.setTop(oldTop);
    }
};

ScriptEditorMorph.prototype.fixLayout = function() {
		
	// palette
	this.palette.setHeight(this.height() - this.categories.height());
	this.palette.setPosition(this.categories.bottomLeft());
		
	// editor
	this.editor.setHeight(this.height());
	this.editor.setWidth(this.width() - this.palette.width());
	this.editor.setPosition( this.categories.topRight() );

}

ScriptEditorMorph.prototype.setExtent = function (point) {
	ScriptEditorMorph.uber.setExtent.call(this, point);
	if(this.palette) this.fixLayout();
};



// SpriteCorralMorph ///////////////////////////////////////

// I am an editor that holds multiple selectable sprites

// SpriteCorralMorph inherits from Morph:

SpriteCorralMorph.prototype = new Morph();
SpriteCorralMorph.prototype.constructor = SpriteCorralMorph;
SpriteCorralMorph.uber = Morph.prototype;

// SpriteCorralMorph defaults

SpriteCorralMorph.prototype.sliderColor = new Color(244, 244, 0);

// SpriteCorralMorph instance creation:

function SpriteCorralMorph(spriteCollection, spriteIconType){
	this.init(spriteCollection, spriteIconType);
};

SpriteCorralMorph.prototype.init = function (spriteCollection, spriteIconType) {
	var frame, template, padding = 5, myself = this;
	
	this.sprites = spriteCollection;
	
	frame = new ScrollFrameMorph(null, null, this.sliderColor);
	frame.acceptsDrops = false;
	frame.contents.acceptsDrops = false;
	
	frame.contents.wantsDropOf = function (morph) {
		return morph instanceof spriteIconType;
	};
	
	frame.contents.reactToDropOf = function (spriteIcon) {
		myself.reactToDropOf(spriteIcon);
	};
	
	frame.alpha = 0;
	
	this.sprites().forEach(function (morph) {
		template = new spriteIconType(morph, template);
		frame.contents.add(template);
	});
	
	this.frame = frame;
	this.add(frame);
	
	this.fixLayout = function () {
	console.log("fixing corral layout");
		this.frame.setPosition(myself.position());
		this.frame.setExtent(myself.extent());
		this.arrangeIcons();
		this.refresh();
	};
	
	this.arrangeIcons = function () {
		var x = this.frame.left(),
			y = this.frame.top(),
			max = this.frame.right(),
			start = this.frame.left();
		
		this.frame.contents.children.forEach(function (icon) {
			var w = icon.width();
			
			if (x + w > max) {
				x = start;
				y += icon.height();
			}
			icon.setPosition(new Point(x,y));
			x += w;
		});
		this.frame.contents.adjustBounds();
	};
	
	this.addSprite = function (sprite) {
		this.frame.contents.add(new spriteIconType(sprite));
		this.fixLayout();
	};
	
	this.refresh = function() {
		this.frame.contents.children.forEach(function (icon) {
			icon.refresh();
		});
	};
	
	this.wantsDropOf = function (morph) {
		return morph instanceof spriteIconMorph;
	};
	
	this.reactToDropOf = function (spriteIcon) {
		var idx = 0,
			oldIdx = this.frame.contents.children.indexOf(spriteIcon),
			pos = spriteIcon.position(),
			sprites = myself.sprites(),
			children = myself.frame.contents.children;
		// find the new position of the dropped sprite
		this.frame.contents.children.forEach(function (icon) {
			if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
				idx += 1;
			}
		});
		// rearrange both icons and sprites
		sprites.splice(idx, 0, sprites.splice(oldIdx, 1)[0]);
		children.splice(idx, 0, children.splice(oldIdx, 1)[0]);
		myself.fixLayout();
	};
};
