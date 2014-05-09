/**
 * Blockly Apps: Test Graphics
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Test application.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Test = {};

// Supported languages.
BlocklyApps.LANGUAGES =
    ['ar', 'ca', 'cs', 'da', 'de', 'el', 'en', 'es', 'fa', 'fr', 'hi', 'hrx',
     'hu', 'is', 'it', 'ko', 'ms', 'nl', 'pl', 'pms', 'pt-br', 'ro', 'ru',
     'sco', 'sv', 'tr', 'uk', 'vi', 'zh-hans', 'zh-hant'];
BlocklyApps.LANG = BlocklyApps.getLang();

document.write('<script type="text/javascript" src="generated/' +
               BlocklyApps.LANG + '.js"></script>\n');

Test.HEIGHT = 400;
Test.WIDTH = 400;

/**
 * PID of animation task currently executing.
 */
Test.pid = 0;

/**
 * Should the Test be drawn?
 */
Test.visible = true;

/**
 * Initialize Blockly and the Test.  Called on page load.
 */
Test.init = function() {
  BlocklyApps.init();

  var rtl = BlocklyApps.isRtl();
  var blocklyDiv = document.getElementById('blockly');
  var visualization = document.getElementById('visualization');
  var onresize = function(e) {
    var top = visualization.offsetTop;
    blocklyDiv.style.top = Math.max(10, top - window.pageYOffset) + 'px';
    blocklyDiv.style.left = rtl ? '10px' : '420px';
    blocklyDiv.style.width = (window.innerWidth - 440) + 'px';
  };
  window.addEventListener('scroll', function() {
      onresize();
      Blockly.fireUiEvent(window, 'resize');
    });
  window.addEventListener('resize', onresize);
  onresize();

  var toolbox = document.getElementById('toolbox');
  Blockly.inject(document.getElementById('blockly'),
      {path: '../../',
       rtl: rtl,
       toolbox: toolbox,
       trashcan: true});

  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  BlocklyApps.checkTimeout(%1);\n';

  // Add to reserved word list: API, local variables in execution evironment
  // (execute) and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('Test,code');

  window.addEventListener('beforeunload', function(e) {
    if (Blockly.mainWorkspace.getAllBlocks().length > 2) {
      e.returnValue = BlocklyApps.getMsg('Test_unloadWarning');  // Gecko.
      return BlocklyApps.getMsg('Test_unloadWarning');  // Webkit.
    }
    return null;
  });

  // Hide download button if browser lacks support
  // (http://caniuse.com/#feat=download).
  if (!(goog.userAgent.GECKO ||
       (goog.userAgent.WEBKIT && !goog.userAgent.SAFARI))) {
    document.getElementById('captureButton').className = 'disabled';
  } else {
    BlocklyApps.bindClick('captureButton', Test.createImageLink);
  }

  // Initialize the slider.
  var sliderSvg = document.getElementById('slider');
  Test.speedSlider = new Slider(10, 35, 130, sliderSvg);

  var defaultXml =
      '<xml>' +
      '  <block type="draw_move" x="70" y="70">' +
      '    <value name="VALUE">' +
      '      <block type="math_number">' +
      '        <field name="NUM">100</field>' +
      '      </block>' +
      '    </value>' +
      '  </block>' +
      '</xml>';
  BlocklyApps.loadBlocks(defaultXml);

  Test.ctxDisplay = document.getElementById('display').getContext('2d');
  Test.ctxScratch = document.getElementById('scratch').getContext('2d');
  Test.reset();

  BlocklyApps.bindClick('runButton', Test.runButtonClick);
  BlocklyApps.bindClick('resetButton', Test.resetButtonClick);

  // Lazy-load the syntax-highlighting.
  window.setTimeout(BlocklyApps.importPrettify, 1);
};

window.addEventListener('load', Test.init);

/**
 * Reset the Test to the start position, clear the display, and kill any
 * pending tasks.
 */
Test.reset = function() {
  // Starting location and heading of the Test.
  Test.x = Test.HEIGHT / 2;
  Test.y = Test.WIDTH / 2;
  Test.heading = 0;
  Test.penDownValue = true;
  Test.visible = true;

  // Clear the display.
  Test.ctxScratch.canvas.width = Test.ctxScratch.canvas.width;
  Test.ctxScratch.strokeStyle = '#000000';
  Test.ctxScratch.fillStyle = '#000000';
  Test.ctxScratch.lineWidth = 1;
  Test.ctxScratch.lineCap = 'round';
  Test.ctxScratch.font = 'normal 18pt Arial';
  Test.display();

  // Kill any task.
  if (Test.pid) {
    window.clearTimeout(Test.pid);
  }
  Test.pid = 0;
};

/**
 * Copy the scratch canvas to the display canvas. Add a Test marker.
 */
Test.display = function() {
  Test.ctxDisplay.globalCompositeOperation = 'copy';
  Test.ctxDisplay.drawImage(Test.ctxScratch.canvas, 0, 0);
  Test.ctxDisplay.globalCompositeOperation = 'source-over';
  // Draw the Test.
  if (Test.visible) {
    // Make the Test the colour of the pen.
    Test.ctxDisplay.strokeStyle = Test.ctxScratch.strokeStyle;
    Test.ctxDisplay.fillStyle = Test.ctxScratch.fillStyle;

    // Draw the Test body.
    var radius = Test.ctxScratch.lineWidth / 2 + 10;
    Test.ctxDisplay.beginPath();
    Test.ctxDisplay.arc(Test.x, Test.y, radius, 0, 2 * Math.PI, false);
    Test.ctxDisplay.lineWidth = 3;
    Test.ctxDisplay.stroke();

    // Draw the Test head.
    var WIDTH = 0.3;
    var HEAD_TIP = 10;
    var ARROW_TIP = 4;
    var BEND = 6;
    var radians = 2 * Math.PI * Test.heading / 360;
    var tipX = Test.x + (radius + HEAD_TIP) * Math.sin(radians);
    var tipY = Test.y - (radius + HEAD_TIP) * Math.cos(radians);
    radians -= WIDTH;
    var leftX = Test.x + (radius + ARROW_TIP) * Math.sin(radians);
    var leftY = Test.y - (radius + ARROW_TIP) * Math.cos(radians);
    radians += WIDTH / 2;
    var leftControlX = Test.x + (radius + BEND) * Math.sin(radians);
    var leftControlY = Test.y - (radius + BEND) * Math.cos(radians);
    radians += WIDTH;
    var rightControlX = Test.x + (radius + BEND) * Math.sin(radians);
    var rightControlY = Test.y - (radius + BEND) * Math.cos(radians);
    radians += WIDTH / 2;
    var rightX = Test.x + (radius + ARROW_TIP) * Math.sin(radians);
    var rightY = Test.y - (radius + ARROW_TIP) * Math.cos(radians);
    Test.ctxDisplay.beginPath();
    Test.ctxDisplay.moveTo(tipX, tipY);
    Test.ctxDisplay.lineTo(leftX, leftY);
    Test.ctxDisplay.bezierCurveTo(leftControlX, leftControlY,
        rightControlX, rightControlY, rightX, rightY);
    Test.ctxDisplay.closePath();
    Test.ctxDisplay.fill();
  }
};

/**
 * Click the run button.  Start the program.
 */
Test.runButtonClick = function() {
  var runButton = document.getElementById('runButton');
  var resetButton = document.getElementById('resetButton');
  // Ensure that Reset button is at least as wide as Run button.
  if (!resetButton.style.minWidth) {
    resetButton.style.minWidth = runButton.offsetWidth + 'px';
  }
  runButton.style.display = 'none';
  resetButton.style.display = 'inline';
  // Prevent double-clicks or double-taps.
  resetButton.disabled = true;
  setTimeout(function() {resetButton.disabled = false;},
             BlocklyApps.DOUBLE_CLICK_TIME);

  document.getElementById('spinner').style.visibility = 'visible';
  Blockly.mainWorkspace.traceOn(true);
  Test.execute();
};

/**
 * Click the reset button.  Reset the Test.
 */
Test.resetButtonClick = function() {
  var runButton = document.getElementById('runButton');
  runButton.style.display = 'inline';
  document.getElementById('resetButton').style.display = 'none';
  // Prevent double-clicks or double-taps.
  runButton.disabled = true;
  setTimeout(function() {runButton.disabled = false;},
             BlocklyApps.DOUBLE_CLICK_TIME);

  document.getElementById('spinner').style.visibility = 'hidden';
  Blockly.mainWorkspace.traceOn(false);
  Test.reset();
};


/**
 * Execute the user's code.  Heaven help us...
 */
Test.execute = function() {
  BlocklyApps.log = [];
  BlocklyApps.ticks = 1000000;

  var code = Blockly.JavaScript.workspaceToCode();
  try {
    eval(code);
  } catch (e) {
    // Null is thrown for infinite loop.
    // Otherwise, abnormal termination is a user error.
    if (e !== Infinity) {
      alert(e);
    }
  }

  // BlocklyApps.log now contains a transcript of all the user's actions.
  // Reset the graphic and animate the transcript.
  Test.reset();
  Test.pid = window.setTimeout(Test.animate, 100);
};

/**
 * Iterate through the recorded path and animate the Test's actions.
 */
Test.animate = function() {
  // All tasks should be complete now.  Clean up the PID list.
  Test.pid = 0;

  var tuple = BlocklyApps.log.shift();
  if (!tuple) {
    document.getElementById('spinner').style.visibility = 'hidden';
    Blockly.mainWorkspace.highlightBlock(null);
    return;
  }
  var command = tuple.shift();
  BlocklyApps.highlight(tuple.pop());
  Test.step(command, tuple);
  Test.display();

  // Scale the speed non-linearly, to give better precision at the fast end.
  var stepSpeed = 1000 * Math.pow(1 - Test.speedSlider.getValue(), 2);
  Test.pid = window.setTimeout(Test.animate, stepSpeed);
};

/**
 * Execute one step.
 * @param {string} command Logo-style command (e.g. 'FD' or 'RT').
 * @param {!Array} values List of arguments for the command.
 */
Test.step = function(command, values) {
  switch (command) {
    case 'FD':  // Forward
      if (Test.penDownValue) {
        Test.ctxScratch.beginPath();
        Test.ctxScratch.moveTo(Test.x, Test.y);
      }
      var distance = values[0];
      if (distance) {
        Test.x += distance * Math.sin(2 * Math.PI * Test.heading / 360);
        Test.y -= distance * Math.cos(2 * Math.PI * Test.heading / 360);
        var bump = 0;
      } else {
        // WebKit (unlike Gecko) draws nothing for a zero-length line.
        var bump = 0.1;
      }
      if (Test.penDownValue) {
        Test.ctxScratch.lineTo(Test.x, Test.y + bump);
        Test.ctxScratch.stroke();
      }
      break;
	case 'MT': // Move To
      Test.x=values[0];
      Test.y=values[1];
      break; 
    case 'RT':  // Right Turn
      Test.heading += values[0];
      Test.heading %= 360;
      if (Test.heading < 0) {
        Test.heading += 360;
      }
      break;
    case 'DP':  // Draw Print
      Test.ctxScratch.save();
      Test.ctxScratch.translate(Test.x, Test.y);
      Test.ctxScratch.rotate(2 * Math.PI * (Test.heading - 90) / 360);
      Test.ctxScratch.fillText(values[0], 0, 0);
      Test.ctxScratch.restore();
      break;
    case 'DF':  // Draw Font
      Test.ctxScratch.font = values[2] + ' ' + values[1] + 'pt ' + values[0];
      break;
    case 'PU':  // Pen Up
      Test.penDownValue = false;
      break;
    case 'PD':  // Pen Down
      Test.penDownValue = true;
      break;
    case 'PW':  // Pen Width
      Test.ctxScratch.lineWidth = values[0];
      break;
    case 'PC':  // Pen Colour
      Test.ctxScratch.strokeStyle = values[0];
      Test.ctxScratch.fillStyle = values[0];
      break;
    case 'HT':  // Hide Test
      Test.visible = false;
      break;
    case 'ST':  // Show Test
      Test.visible = true;
      break;
  }
};

/**
 * Save an image of the SVG canvas.
 */
Test.createImageLink = function() {
  var imgLink = document.getElementById('downloadImageLink');
  imgLink.setAttribute('href',
      document.getElementById('display').toDataURL('image/png'));
  var temp = window.onbeforeunload;
  window.onbeforeunload = null;
  imgLink.click();
  window.onbeforeunload = temp;
};

// Test API.

Test.moveForward = function(distance, id) {
  BlocklyApps.log.push(['FD', distance, id]);
};

Test.moveBackward = function(distance, id) {
  BlocklyApps.log.push(['FD', -distance, id]);
};

Test.moveTo = function(xpos, ypos, id) {
          BlocklyApps.log.push(['MT', xpos, ypos, id]);
};

Test.turnRight = function(angle, id) {
  BlocklyApps.log.push(['RT', angle, id]);
};

Test.turnLeft = function(angle, id) {
  BlocklyApps.log.push(['RT', -angle, id]);
};

Test.penUp = function(id) {
  BlocklyApps.log.push(['PU', id]);
};

Test.penDown = function(id) {
  BlocklyApps.log.push(['PD', id]);
};

Test.penWidth = function(width, id) {
  BlocklyApps.log.push(['PW', Math.max(width, 0), id]);
};

Test.penColour = function(colour, id) {
  BlocklyApps.log.push(['PC', colour, id]);
};

Test.hideTest = function(id) {
  BlocklyApps.log.push(['HT', id]);
};

Test.showTest = function(id) {
  BlocklyApps.log.push(['ST', id]);
};

Test.drawPrint = function(text, id) {
  BlocklyApps.log.push(['DP', text, id]);
};

Test.drawFont = function(font, size, style, id) {
  BlocklyApps.log.push(['DF', font, size, style, id]);
};
