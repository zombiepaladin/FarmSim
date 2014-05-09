/* 
 * @desc: This file contains the custom items for our toolbox
 * 
 * @depen: This file requires the following files to be included before this one.
 * - length.js
 * - area.js
 * - volume.js
 * - mass.js
 * 
 */
 
 
 
 // LENGTH... 
Blockly.Blocks['length_type'] = {
  init: function() {
    this.setHelpUrl('http://www.google.com/');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Length");
    this.appendValueInput("AMOUNT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("Unit:")
        .appendField(new Blockly.FieldDropdown([["Foot", "ft"], ["Yard", "yd"], ["Mile", "mi"], ["Meter", "m"], ["Kilometer", "km"]]), "DropDownLen");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('');
  }
};

Blockly.JavaScript['length_type'] = function(block) {
  var value_amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_dropdownlen = block.getFieldValue('DropDownLen');

  var code = 'new Length(' + value_amount + ',' + '"' + dropdown_dropdownlen + '"' + ')';
  
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
}


// AREA ...
Blockly.Blocks['area_type'] = {
  init: function() {
    this.setHelpUrl('http://www.google.com/');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Area");
    this.appendValueInput("AMOUNT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("Unit:")
        .appendField(new Blockly.FieldDropdown([["Feet Square", "ft2"], ["Yard Square", "yd2"], ["Mile Square", "mi2"], ["Acre", "a"], ["Hectare", "ha"], ["Meter Square", "m2"], ["Kilometer Square", "km2"], ["Section", "sec"]]), "DropDownArea");
    this.setInputsInline(true);
    this.setOutput(true, "Area");
    this.setTooltip('');
  }
};

Blockly.JavaScript['area_type'] = function(block) {
  var value_amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_dropdownarea = block.getFieldValue('DropDownArea');

  var code = 'new Area(' + value_amount + ',' + '"' + dropdown_dropdownarea + '"' + ' )' ;

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};


// VOLUME...
Blockly.Blocks['volume_type'] = {
  init: function() {
    this.setHelpUrl('http://www.google.com/');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Volume");
    this.appendValueInput("AMOUNT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("Unit:")
        .appendField(new Blockly.FieldDropdown([["Feet Cube", "ft3"], ["Yard Cube", "yd3"], ["Meter Cube", "m3"], ["Kilometer Cube", "km3"]]), "DropDownVolume");
    this.setInputsInline(true);
    this.setOutput(true, "Volume");
    this.setTooltip('');
  }
};

Blockly.JavaScript['volume_type'] = function(block) {
  var value_amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_dropdownvolume = block.getFieldValue('DropDownVolume');
  
  var code = 'new Volume('+ value_amount +',' + '"' + dropdown_dropdownvolume + '"' + ')';

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// MASS ...
Blockly.Blocks['mass_type'] = {
  init: function() {
    this.setHelpUrl('http://www.google.com/');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Mass");
    this.appendValueInput("AMOUNT")
        .setCheck("Number");
    this.appendDummyInput()
        .appendField("Unit:")
        .appendField(new Blockly.FieldDropdown([["Ounce", "oz"], ["Pound", "lb"], ["Ton", "t"], ["Gram", "g"], ["Kilogram", "kg"], ["Metric Ton", "mt"]]), "DropDownMass");
    this.setInputsInline(true);
    this.setOutput(true, "Mass");
    this.setTooltip('');
  }
};

Blockly.JavaScript['mass_type'] = function(block) {
  var value_amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_dropdownmass = block.getFieldValue('DropDownMass');
  
  var code = 'new Mass(' + value_amount + ',' + '"' + dropdown_dropdownmass +'"'+ ')';
  
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// move forward/backward
Blockly.Blocks['move_forward'] = {
  init: function() {
    this.setHelpUrl('http://www.google.com/');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Move")
        .appendField(new Blockly.FieldDropdown([["Forward", "forward"], ["Backward", "backward"]]), "MoveDropDown");
    this.appendValueInput("amount")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.JavaScript['move_forward'] = function(block) {
  var dropdown_movedropdown = block.getFieldValue('MoveDropDown');
  var value_amount = Blockly.JavaScript.valueToCode(block, 'amount', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code;
  if( dropdown_movedropdown === "forward") {
	code = 'Tractor.moveForward(' + value_amount + ');';
  } else {
	code = 'Tractor.moveBackward(' + value_amount + ');';
  }
  return code;
};

//  tractor turn
Blockly.Blocks['turn'] = {
  init: function() {
    this.setHelpUrl('http://www.google.com/');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Turn")
        .appendField(new Blockly.FieldDropdown([["Right", "right"], ["Left", "left"]]), "TurnDropDown");
    this.appendValueInput("amount")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.JavaScript['turn'] = function(block) {
	var dropdown_turndropdown = block.getFieldValue('TurnDropDown');
	var value_amount = Blockly.JavaScript.valueToCode(block, 'amount', Blockly.JavaScript.ORDER_ATOMIC);
	// TODO: Assemble JavaScript into code variable.
	var code;
	if( dropdown_turndropdown === "right") {
		code = "Tractor.turnRight(" + value_amount + ");";
	} else {
		code = "Tractor.turnLeft(" + value_amount + ");";
	}
	
  return code;
};

// tractor move to (teleport)
Blockly.Blocks['move_to'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Move To X:");
    this.appendValueInput("Xpos")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField("Y:");
    this.appendValueInput("Ypos")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.JavaScript['move_to'] = function(block) {
  var value_xpos = Blockly.JavaScript.valueToCode(block, 'Xpos', Blockly.JavaScript.ORDER_ATOMIC);
  var value_ypos = Blockly.JavaScript.valueToCode(block, 'Ypos', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = 'Tractor.moveTo(' + value_xpos + ',' + value_ypos + ');';
  return code;
};
