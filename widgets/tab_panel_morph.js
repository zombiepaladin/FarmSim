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
	
	// initialize inherited properties
	TabPanelMorph.uber.init.call(this);
	
	// add / modify properties
	this.currentTab = null;
	this.colors = tabColors;
	this.TabHeight = 30;
	
	// collections of tabs and panels.
	this.tabs = []
	this.panels = [];
	
	// display morphs.
	this.tabBar = null;
	this.displayPanel = null;
	
	
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
	this.currentTab = (this.currentTab) ? this.currentTab : tabName;
	
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
