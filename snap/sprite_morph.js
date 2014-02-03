var SpriteMorph;

// SpriteMorph /////////////////////////////////////////////////////////

// I am a scriptable object

// SpriteMorph inherits from PenMorph:

SpriteMorph.prototype = new PenMorph();
SpriteMorph.prototype.constructor = SpriteMorph;
SpriteMorph.uber = PenMorph.prototype;

// SpriteMorph settings

SpriteMorph.prototype.categories =
    [
        'motion',
        'control',
        'looks',
        'sensing',
        'sound',
        'operators',
        'pen',
        'variables',
        'lists',
        'other'
    ];

SpriteMorph.prototype.blockColor = {
    motion : new Color(74, 108, 212),
    looks : new Color(143, 86, 227),
    sound : new Color(207, 74, 217),
    pen : new Color(0, 161, 120),
    control : new Color(230, 168, 34),
    sensing : new Color(4, 148, 220),
    operators : new Color(98, 194, 19),
    variables : new Color(243, 118, 29),
    lists : new Color(217, 77, 17),
    other: new Color(150, 150, 150)
};

SpriteMorph.prototype.paletteColor = new Color(55, 55, 55);
SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
SpriteMorph.prototype.sliderColor
    = SpriteMorph.prototype.paletteColor.lighter(30);
SpriteMorph.prototype.isCachingPrimitives = true;

SpriteMorph.prototype.enableNesting = true;
SpriteMorph.prototype.highlightColor = new Color(250, 200, 130);
SpriteMorph.prototype.highlightBorder = 8;

SpriteMorph.prototype.bubbleColor = new Color(255, 255, 255);
SpriteMorph.prototype.bubbleFontSize = 14;
SpriteMorph.prototype.bubbleFontIsBold = true;
SpriteMorph.prototype.bubbleCorner = 10;
SpriteMorph.prototype.bubbleBorder = 3;
SpriteMorph.prototype.bubbleBorderColor = new Color(190, 190, 190);
SpriteMorph.prototype.bubbleMaxTextWidth = 130;

SpriteMorph.prototype.initBlocks = function () {
    SpriteMorph.prototype.blocks = {

        // Motion
        forward: {
            type: 'command',
            category: 'motion',
            spec: 'move %n steps',
            defaults: [10]
        },
        turn: {
            type: 'command',
            category: 'motion',
            spec: 'turn %clockwise %n degrees',
            defaults: [15]
        },
        turnLeft: {
            type: 'command',
            category: 'motion',
            spec: 'turn %counterclockwise %n degrees',
            defaults: [15]
        },
        setHeading: {
            type: 'command',
            category: 'motion',
            spec: 'point in direction %dir'
        },
        doFaceTowards: {
            type: 'command',
            category: 'motion',
            spec: 'point towards %dst'
        },
        gotoXY: {
            type: 'command',
            category: 'motion',
            spec: 'go to x: %n y: %n',
            defaults: [0, 0]
        },
        doGotoObject: {
            type: 'command',
            category: 'motion',
            spec: 'go to %dst'
        },
        doGlide: {
            type: 'command',
            category: 'motion',
            spec: 'glide %n secs to x: %n y: %n',
            defaults: [1, 0, 0]
        },
        changeXPosition: {
            type: 'command',
            category: 'motion',
            spec: 'change x by %n',
            defaults: [10]
        },
        setXPosition: {
            type: 'command',
            category: 'motion',
            spec: 'set x to %n',
            defaults: [0]
        },
        changeYPosition: {
            type: 'command',
            category: 'motion',
            spec: 'change y by %n',
            defaults: [10]
        },
        setYPosition: {
            type: 'command',
            category: 'motion',
            spec: 'set y to %n',
            defaults: [0]
        },
        bounceOffEdge: {
            type: 'command',
            category: 'motion',
            spec: 'if on edge, bounce'
        },
        xPosition: {
            type: 'reporter',
            category: 'motion',
            spec: 'x position'
        },
        yPosition: {
            type: 'reporter',
            category: 'motion',
            spec: 'y position'
        },
        direction: {
            type: 'reporter',
            category: 'motion',
            spec: 'direction'
        },

        // Looks
        doSwitchToCostume: {
            type: 'command',
            category: 'looks',
            spec: 'switch to costume %cst'
        },
        doWearNextCostume: {
            type: 'command',
            category: 'looks',
            spec: 'next costume'
        },
        getCostumeIdx: {
            type: 'reporter',
            category: 'looks',
            spec: 'costume #'
        },
        doSayFor: {
            type: 'command',
            category: 'looks',
            spec: 'say %s for %n secs',
            defaults: [localize('Hello!'), 2]
        },
        bubble: {
            type: 'command',
            category: 'looks',
            spec: 'say %s',
            defaults: [localize('Hello!')]
        },
        doThinkFor: {
            type: 'command',
            category: 'looks',
            spec: 'think %s for %n secs',
            defaults: [localize('Hmm...'), 2]
        },
        doThink: {
            type: 'command',
            category: 'looks',
            spec: 'think %s',
            defaults: [localize('Hmm...')]
        },
        changeEffect: {
            type: 'command',
            category: 'looks',
            spec: 'change %eff effect by %n',
            defaults: [null, 25]
        },
        setEffect: {
            type: 'command',
            category: 'looks',
            spec: 'set %eff effect to %n',
            defaults: [null, 0]
        },
        clearEffects: {
            type: 'command',
            category: 'looks',
            spec: 'clear graphic effects'
        },
        changeScale: {
            type: 'command',
            category: 'looks',
            spec: 'change size by %n',
            defaults: [10]
        },
        setScale: {
            type: 'command',
            category: 'looks',
            spec: 'set size to %n %',
            defaults: [100]
        },
        getScale: {
            type: 'reporter',
            category: 'looks',
            spec: 'size'
        },
        show: {
            type: 'command',
            category: 'looks',
            spec: 'show'
        },
        hide: {
            type: 'command',
            category: 'looks',
            spec: 'hide'
        },
        comeToFront: {
            type: 'command',
            category: 'looks',
            spec: 'go to front'
        },
        goBack: {
            type: 'command',
            category: 'looks',
            spec: 'go back %n layers',
            defaults: [1]
        },

        // Looks - Debugging primitives for development mode
        alert: {
            type: 'command',
            category: 'looks',
            spec: 'alert %mult%s'
        },
        log: {
            type: 'command',
            category: 'looks',
            spec: 'console log %mult%s'
        },

        // Sound
        playSound: {
            type: 'command',
            category: 'sound',
            spec: 'play sound %snd'
        },
        doPlaySoundUntilDone: {
            type: 'command',
            category: 'sound',
            spec: 'play sound %snd until done'
        },
        doStopAllSounds: {
            type: 'command',
            category: 'sound',
            spec: 'stop all sounds'
        },
        doRest: {
            type: 'command',
            category: 'sound',
            spec: 'rest for %n beats',
            defaults: [0.2]
        },
        doPlayNote: {
            type: 'command',
            category: 'sound',
            spec: 'play note %n for %n beats',
            defaults: [60, 0.5]
        },
        doChangeTempo: {
            type: 'command',
            category: 'sound',
            spec: 'change tempo by %n',
            defaults: [20]
        },
        doSetTempo: {
            type: 'command',
            category: 'sound',
            spec: 'set tempo to %n bpm',
            defaults: [60]
        },
        getTempo: {
            type: 'reporter',
            category: 'sound',
            spec: 'tempo'
        },

        // Pen
        clear: {
            type: 'command',
            category: 'pen',
            spec: 'clear'
        },
        down: {
            type: 'command',
            category: 'pen',
            spec: 'pen down'
        },
        up: {
            type: 'command',
            category: 'pen',
            spec: 'pen up'
        },
        setColor: {
            type: 'command',
            category: 'pen',
            spec: 'set pen color to %clr'
        },
        changeHue: {
            type: 'command',
            category: 'pen',
            spec: 'change pen color by %n',
            defaults: [10]
        },
        setHue: {
            type: 'command',
            category: 'pen',
            spec: 'set pen color to %n',
            defaults: [0]
        },
        changeBrightness: {
            type: 'command',
            category: 'pen',
            spec: 'change pen shade by %n',
            defaults: [10]
        },
        setBrightness: {
            type: 'command',
            category: 'pen',
            spec: 'set pen shade to %n',
            defaults: [100]
        },
        changeSize: {
            type: 'command',
            category: 'pen',
            spec: 'change pen size by %n',
            defaults: [1]
        },
        setSize: {
            type: 'command',
            category: 'pen',
            spec: 'set pen size to %n',
            defaults: [1]
        },
        doStamp: {
            type: 'command',
            category: 'pen',
            spec: 'stamp'
        },

        // Control
        receiveGo: {
            type: 'hat',
            category: 'control',
            spec: 'when %greenflag clicked'
        },
        receiveKey: {
            type: 'hat',
            category: 'control',
            spec: 'when %keyHat key pressed'
        },
        receiveClick: {
            type: 'hat',
            category: 'control',
            spec: 'when I am clicked'
        },
        receiveMessage: {
            type: 'hat',
            category: 'control',
            spec: 'when I receive %msgHat'
        },
        doBroadcast: {
            type: 'command',
            category: 'control',
            spec: 'broadcast %msg'
        },
        doBroadcastAndWait: {
            type: 'command',
            category: 'control',
            spec: 'broadcast %msg and wait'
        },
        getLastMessage: {
            type: 'reporter',
            category: 'control',
            spec: 'message'
        },
        doWait: {
            type: 'command',
            category: 'control',
            spec: 'wait %n secs',
            defaults: [1]
        },
        doWaitUntil: {
            type: 'command',
            category: 'control',
            spec: 'wait until %b'
        },
        doForever: {
            type: 'command',
            category: 'control',
            spec: 'forever %c'
        },
        doRepeat: {
            type: 'command',
            category: 'control',
            spec: 'repeat %n %c',
            defaults: [10]
        },
        doUntil: {
            type: 'command',
            category: 'control',
            spec: 'repeat until %b %c'
        },
        doIf: {
            type: 'command',
            category: 'control',
            spec: 'if %b %c'
        },
        doIfElse: {
            type: 'command',
            category: 'control',
            spec: 'if %b %c else %c'
        },
        doStop: {
            type: 'command',
            category: 'control',
            spec: 'stop script'
        },
        doStopAll: {
            type: 'command',
            category: 'control',
            spec: 'stop all %stop'
        },
        doRun: {
            type: 'command',
            category: 'control',
            spec: 'run %cmdRing %inputs'
        },
        fork: {
            type: 'command',
            category: 'control',
            spec: 'launch %cmdRing %inputs'
        },
        evaluate: {
            type: 'reporter',
            category: 'control',
            spec: 'call %repRing %inputs'
        },
    /*
        doRunWithInputList: {
            type: 'command',
            category: 'control',
            spec: 'run %cmd with input list %l'
        },

        forkWithInputList: {
            type: 'command',
            category: 'control',
            spec: 'launch %cmd with input list %l'
        },

        evaluateWithInputList: {
            type: 'reporter',
            category: 'control',
            spec: 'call %r with input list %l'
        },
    */
        doReport: {
            type: 'command',
            category: 'control',
            spec: 'report %s'
        },
        doStopBlock: {
            type: 'command',
            category: 'control',
            spec: 'stop block'
        },
        doCallCC: {
            type: 'command',
            category: 'control',
            spec: 'run %cmdRing w/continuation'
        },
        reportCallCC: {
            type: 'reporter',
            category: 'control',
            spec: 'call %cmdRing w/continuation'
        },
        doWarp: {
            type: 'command',
            category: 'other',
            spec: 'warp %c'
        },

        // Cloning - very experimental
        receiveOnClone: {
            type: 'hat',
            category: 'control',
            spec: 'when I start as a clone'
        },
        createClone: {
            type: 'command',
            category: 'control',
            spec: 'create a clone of %cln'
        },
        removeClone: {
            type: 'command',
            category: 'control',
            spec: 'delete this clone'
        },

        // Debugging - pausing

        doPauseAll: {
            type: 'command',
            category: 'control',
            spec: 'pause all %pause'
        },

        // Sensing

        reportTouchingObject: {
            type: 'predicate',
            category: 'sensing',
            spec: 'touching %col ?'
        },
        reportTouchingColor: {
            type: 'predicate',
            category: 'sensing',
            spec: 'touching %clr ?'
        },
        reportColorIsTouchingColor: {
            type: 'predicate',
            category: 'sensing',
            spec: 'color %clr is touching %clr ?'
        },
        colorFiltered: {
            type: 'reporter',
            category: 'sensing',
            spec: 'filtered for %clr'
        },
        reportStackSize: {
            type: 'reporter',
            category: 'sensing',
            spec: 'stack size'
        },
        reportFrameCount: {
            type: 'reporter',
            category: 'sensing',
            spec: 'frames'
        },
        doAsk: {
            type: 'command',
            category: 'sensing',
            spec: 'ask %s and wait',
            defaults: [localize('what\'s your name?')]
        },
        reportLastAnswer: { // retained for legacy compatibility
            type: 'reporter',
            category: 'sensing',
            spec: 'answer'
        },
        getLastAnswer: {
            type: 'reporter',
            category: 'sensing',
            spec: 'answer'
        },
        reportMouseX: {
            type: 'reporter',
            category: 'sensing',
            spec: 'mouse x'
        },
        reportMouseY: {
            type: 'reporter',
            category: 'sensing',
            spec: 'mouse y'
        },
        reportMouseDown: {
            type: 'predicate',
            category: 'sensing',
            spec: 'mouse down?'
        },
        reportKeyPressed: {
            type: 'predicate',
            category: 'sensing',
            spec: 'key %key pressed?'
        },
        reportDistanceTo: {
            type: 'reporter',
            category: 'sensing',
            spec: 'distance to %dst'
        },
        doResetTimer: {
            type: 'command',
            category: 'sensing',
            spec: 'reset timer'
        },
        reportTimer: { // retained for legacy compatibility
            type: 'reporter',
            category: 'sensing',
            spec: 'timer'
        },
        getTimer: {
            type: 'reporter',
            category: 'sensing',
            spec: 'timer'
        },
        reportAttributeOf: {
            type: 'reporter',
            category: 'sensing',
            spec: '%att of %spr',
            defaults: [['costume #']]
        },
        reportURL: {
            type: 'reporter',
            category: 'sensing',
            spec: 'http:// %s',
            defaults: ['snap.berkeley.edu']
        },
        reportIsFastTracking: {
            type: 'predicate',
            category: 'sensing',
            spec: 'turbo mode?'
        },
        doSetFastTracking: {
            type: 'command',
            category: 'sensing',
            spec: 'set turbo mode to %b'
        },

        // Operators
        reifyScript: {
            type: 'ring',
            category: 'other',
            spec: '%rc %ringparms'
        },
        reifyReporter: {
            type: 'ring',
            category: 'other',
            spec: '%rr %ringparms'
        },
        reifyPredicate: {
            type: 'ring',
            category: 'other',
            spec: '%rp %ringparms'
        },
        reportSum: {
            type: 'reporter',
            category: 'operators',
            spec: '%n + %n'
        },
        reportDifference: {
            type: 'reporter',
            category: 'operators',
            spec: '%n \u2212 %n'
        },
        reportProduct: {
            type: 'reporter',
            category: 'operators',
            spec: '%n \u00D7 %n'
        },
        reportQuotient: {
            type: 'reporter',
            category: 'operators',
            spec: '%n / %n' // '%n \u00F7 %n'
        },
        reportRound: {
            type: 'reporter',
            category: 'operators',
            spec: 'round %n'
        },
        reportMonadic: {
            type: 'reporter',
            category: 'operators',
            spec: '%fun of %n',
            defaults: [null, 10]
        },
        reportModulus: {
            type: 'reporter',
            category: 'operators',
            spec: '%n mod %n'
        },
        reportRandom: {
            type: 'reporter',
            category: 'operators',
            spec: 'pick random %n to %n',
            defaults: [1, 10]
        },
        reportLessThan: {
            type: 'predicate',
            category: 'operators',
            spec: '%s < %s'
        },
        reportEquals: {
            type: 'predicate',
            category: 'operators',
            spec: '%s = %s'
        },
        reportGreaterThan: {
            type: 'predicate',
            category: 'operators',
            spec: '%s > %s'
        },
        reportAnd: {
            type: 'predicate',
            category: 'operators',
            spec: '%b and %b'
        },
        reportOr: {
            type: 'predicate',
            category: 'operators',
            spec: '%b or %b'
        },
        reportNot: {
            type: 'predicate',
            category: 'operators',
            spec: 'not %b'
        },
        reportTrue: {
            type: 'predicate',
            category: 'operators',
            spec: 'true'
        },
        reportFalse: {
            type: 'predicate',
            category: 'operators',
            spec: 'false'
        },
        reportJoinWords: {
            type: 'reporter',
            category: 'operators',
            spec: 'join %words',
            defaults: [localize('hello') + ' ', localize('world')]
        },
        reportLetter: {
            type: 'reporter',
            category: 'operators',
            spec: 'letter %n of %s',
            defaults: [1, localize('world')]
        },
        reportStringSize: {
            type: 'reporter',
            category: 'operators',
            spec: 'length of %s',
            defaults: [localize('world')]
        },
        reportUnicode: {
            type: 'reporter',
            category: 'operators',
            spec: 'unicode of %s',
            defaults: ['a']
        },
        reportUnicodeAsLetter: {
            type: 'reporter',
            category: 'operators',
            spec: 'unicode %n as letter',
            defaults: [65]
        },
        reportIsA: {
            type: 'predicate',
            category: 'operators',
            spec: 'is %s a %typ ?',
            defaults: [5]
        },
        reportIsIdentical: {
            type: 'predicate',
            category: 'operators',
            spec: 'is %s identical to %s ?'
        },
        reportTextSplit: {
            type: 'reporter',
            category: 'operators',
            spec: 'split %s by %delim',
            defaults: [localize('hello') + ' ' + localize('world'), " "]
        },
        reportTypeOf: { // only in dev mode for debugging
            type: 'reporter',
            category: 'operators',
            spec: 'type of %s',
            defaults: [5]
        },
        reportTextFunction: { // only in dev mode - experimental
            type: 'reporter',
            category: 'operators',
            spec: '%txtfun of %s',
            defaults: [null, "Abelson & Sussman"]
        },

    /*
        reportScript: {
            type: 'reporter',
            category: 'operators',
            spec: 'the script %parms %c'
        },
        reify: {
            type: 'reporter',
            category: 'operators',
            spec: 'the %f block %parms'
        },
    */

        // Variables
        doSetVar: {
            type: 'command',
            category: 'variables',
            spec: 'set %var to %s',
            defaults: [null, 0]
        },
        doChangeVar: {
            type: 'command',
            category: 'variables',
            spec: 'change %var by %n',
            defaults: [null, 1]
        },
        doShowVar: {
            type: 'command',
            category: 'variables',
            spec: 'show variable %var'
        },
        doHideVar: {
            type: 'command',
            category: 'variables',
            spec: 'hide variable %var'
        },
        doDeclareVariables: {
            type: 'command',
            category: 'other',
            spec: 'script variables %scriptVars'
        },

        // Lists
        reportNewList: {
            type: 'reporter',
            category: 'lists',
            spec: 'list %exp'
        },
        reportCONS: {
            type: 'reporter',
            category: 'lists',
            spec: '%s in front of %l'
        },
        reportListItem: {
            type: 'reporter',
            category: 'lists',
            spec: 'item %idx of %l',
            defaults: [1]
        },
        reportCDR: {
            type: 'reporter',
            category: 'lists',
            spec: 'all but first of %l'
        },
        reportListLength: {
            type: 'reporter',
            category: 'lists',
            spec: 'length of %l'
        },
        reportListContainsItem: {
            type: 'predicate',
            category: 'lists',
            spec: '%l contains %s',
            defaults: [null, localize('thing')]
        },
        doAddToList: {
            type: 'command',
            category: 'lists',
            spec: 'add %s to %l',
            defaults: [localize('thing')]
        },
        doDeleteFromList: {
            type: 'command',
            category: 'lists',
            spec: 'delete %ida of %l',
            defaults: [1]
        },
        doInsertInList: {
            type: 'command',
            category: 'lists',
            spec: 'insert %s at %idx of %l',
            defaults: [localize('thing'), 1]
        },
        doReplaceInList: {
            type: 'command',
            category: 'lists',
            spec: 'replace item %idx of %l with %s',
            defaults: [1, null, localize('thing')]
        },

        // MAP - experimental
        reportMap: {
            type: 'reporter',
            category: 'lists',
            spec: 'map %repRing over %l'
        },

        // Code mapping - experimental
        doMapCodeOrHeader: { // experimental
            type: 'command',
            category: 'other',
            spec: 'map %cmdRing to %codeKind %code'
        },
        doMapStringCode: { // experimental
            type: 'command',
            category: 'other',
            spec: 'map String to code %code',
            defaults: ['<#1>']
        },
        doMapListCode: { // experimental
            type: 'command',
            category: 'other',
            spec: 'map %codeListPart of %codeListKind to code %code'
        },
        reportMappedCode: { // experimental
            type: 'reporter',
            category: 'other',
            spec: 'code of %cmdRing'
        }
    };
};

SpriteMorph.prototype.initBlocks();

SpriteMorph.prototype.blockAlternatives = {
    // motion:
    turn: ['turnLeft'],
    turnLeft: ['turn'],
    changeXPosition: ['changeYPosition', 'setXPosition', 'setYPosition'],
    setXPosition: ['setYPosition', 'changeXPosition', 'changeYPosition'],
    changeYPosition: ['changeXPosition', 'setYPosition', 'setXPosition'],
    setYPosition: ['setXPosition', 'changeYPosition', 'changeXPosition'],
    xPosition: ['yPosition'],
    yPosition: ['xPosition'],

    // looks:
    doSayFor: ['doThinkFor'],
    doThinkFor: ['doSayFor'],
    bubble: ['doThink'],
    doThink: ['bubble'],
    show: ['hide'],
    hide: ['show'],
    changeEffect: ['setEffect'],
    setEffect: ['changeEffect'],
    changeScale: ['setScale'],
    setScale: ['changeScale'],

    // sound:
    playSound: ['doPlaySoundUntilDone'],
    doPlaySoundUntilDone: ['playSound'],
    doChangeTempo: ['doSetTempo'],
    doSetTempo: ['doChangeTempo'],

    // pen:
    clear: ['down', 'up', 'doStamp'],
    down: ['up', 'clear', 'doStamp'],
    up: ['down', 'clear', 'doStamp'],
    doStamp: ['clear', 'down', 'up'],
    changeHue: ['setHue', 'changeBrightness', 'setBrightness'],
    setHue: ['changeHue', 'changeBrightness', 'setBrightness'],
    changeBrightness: ['setBrightness', 'setHue', 'changeHue'],
    setBrightness: ['changeBrightness', 'setHue', 'changeHue'],
    changeSize: ['setSize'],
    setSize: ['changeSize'],

    // control:
    receiveGo: ['receiveClick'],
    receiveClick: ['receiveGo'],
    doBroadcast: ['doBroadcastAndWait'],
    doBroadcastAndWait: ['doBroadcast'],
    doStopBlock: ['doStop', 'doStopAll'],
    doStop: ['doStopBlock', 'doStopAll'],
    doStopAll: ['doStopBlock', 'doStop'],

    // sensing:
    getLastAnswer: ['getTimer'],
    getTimer: ['getLastAnswer'],
    reportMouseX: ['reportMouseY'],
    reportMouseY: ['reportMouseX'],

    // operators:
    reportSum: ['reportDifference', 'reportProduct', 'reportQuotient'],
    reportDifference: ['reportSum', 'reportProduct', 'reportQuotient'],
    reportProduct: ['reportDifference', 'reportSum', 'reportQuotient'],
    reportQuotient: ['reportDifference', 'reportProduct', 'reportSum'],
    reportLessThan: ['reportEquals', 'reportGreaterThan'],
    reportEquals: ['reportLessThan', 'reportGreaterThan'],
    reportGreaterThan: ['reportEquals', 'reportLessThan'],
    reportAnd: ['reportOr'],
    reportOr: ['reportAnd'],
    reportTrue: ['reportFalse'],
    reportFalse: ['reportTrue'],

    // variables
    doSetVar: ['doChangeVar'],
    doChangeVar: ['doSetVar'],
    doShowVar: ['doHideVar'],
    doHideVar: ['doShowVar']
};

// SpriteMorph instance creation

function SpriteMorph(globals) {
    this.init(globals);
}

SpriteMorph.prototype.init = function (globals) {
    this.name = localize('Sprite');
    this.variables = new VariableFrame(globals || null, this);
    this.scripts = new ScriptsMorph(this);
    this.customBlocks = [];
    this.costumes = new List();
    this.costume = null;
    this.sounds = new List();
    this.normalExtent = new Point(60, 60); // only for costume-less situation
    this.scale = 1;
    this.rotationStyle = 1; // 1 = full, 2 = left/right, 0 = off
    this.version = Date.now(); // for observer optimization
    this.isClone = false; // indicate a "temporary" Scratch-style clone
    this.cloneOriginName = '';

    // sprite nesting properties
    this.parts = []; // not serialized, only anchor (name)
    this.anchor = null;
    this.nestingScale = 1;
    this.rotatesWithAnchor = true;

    this.blocksCache = {}; // not to be serialized (!)
    this.paletteCache = {}; // not to be serialized (!)
    this.rotationOffset = new Point(); // not to be serialized (!)
    this.idx = 0; // not to be serialized (!) - used for de-serialization
    this.wasWarped = false; // not to be serialized, used for fast-tracking

    SpriteMorph.uber.init.call(this);

    this.isDraggable = true;
    this.isDown = false;

    this.heading = 90;
    this.changed();
    this.drawNew();
    this.changed();
};

// SpriteMorph duplicating (fullCopy)

SpriteMorph.prototype.fullCopy = function () {
    var c = SpriteMorph.uber.fullCopy.call(this),
        arr = [],
        cb;

    c.stopTalking();
    c.color = this.color.copy();
    c.blocksCache = {};
    c.paletteCache = {};
    c.scripts = this.scripts.fullCopy();
    c.scripts.owner = c;
    c.variables = this.variables.copy();
    c.variables.owner = c;

    c.customBlocks = [];
    this.customBlocks.forEach(function (def) {
        cb = def.copyAndBindTo(c);
        c.customBlocks.push(cb);
        c.allBlockInstances(def).forEach(function (block) {
            block.definition = cb;
        });
    });
    this.costumes.asArray().forEach(function (costume) {
        arr.push(costume.copy());
    });
    c.costumes = new List(arr);
    arr = [];
    this.sounds.asArray().forEach(function (sound) {
        arr.push(sound);
    });
    c.sounds = new List(arr);

    c.parts = [];
    c.anchor = null;
    c.nestingScale = 1;
    c.rotatesWithAnchor = true;

    return c;
};

// SpriteMorph versioning

SpriteMorph.prototype.setName = function (string) {
    this.name = string || this.name;
    this.version = Date.now();
};

// SpriteMorph rendering

SpriteMorph.prototype.drawNew = function () {
    var myself = this,
        currentCenter = this.center(),
        facing, // actual costume heading based on my rotation style
        isFlipped,
        isLoadingCostume = this.costume &&
            typeof this.costume.loaded === 'function',
        cst,
        pic, // (flipped copy of) actual costume based on my rotation style
        stageScale = this.parent instanceof StageMorph ?
                this.parent.scale : 1,
        newX,
        corners = [],
        origin,
        shift,
        corner,
        costumeExtent,
        ctx,
        handle;

    if (this.isWarped) {
        this.wantsRedraw = true;
        return;
    }
    facing = this.rotationStyle ? this.heading : 90;
    if (this.rotationStyle === 2) {
        facing = 90;
        if ((this.heading > 180 && (this.heading < 360))
                || (this.heading < 0 && (this.heading > -180))) {
            isFlipped = true;
        }
    }
    if (this.costume && !isLoadingCostume) {
        pic = isFlipped ? this.costume.flipped() : this.costume;

        // determine the rotated costume's bounding box
        corners = pic.bounds().corners().map(function (point) {
            return point.rotateBy(
                radians(facing - 90),
                myself.costume.center()
            );
        });
        origin = corners[0];
        corner = corners[0];
        corners.forEach(function (point) {
            origin = origin.min(point);
            corner = corner.max(point);
        });
        costumeExtent = origin.corner(corner)
            .extent().multiplyBy(this.scale * stageScale);

        // determine the new relative origin of the rotated shape
        shift = new Point(0, 0).rotateBy(
            radians(-(facing - 90)),
            pic.center()
        ).subtract(origin);

        // create a new, adequately dimensioned canvas
        // and draw the costume on it
        this.image = newCanvas(costumeExtent);
        this.silentSetExtent(costumeExtent);
        ctx = this.image.getContext('2d');
        ctx.scale(this.scale * stageScale, this.scale * stageScale);
        ctx.translate(shift.x, shift.y);
        ctx.rotate(radians(facing - 90));
        ctx.drawImage(pic.contents, 0, 0);

        // adjust my position to the rotation
        this.setCenter(currentCenter, true); // just me

        // determine my rotation offset
        this.rotationOffset = shift
            .translateBy(pic.rotationCenter)
            .rotateBy(radians(-(facing - 90)), shift)
            .scaleBy(this.scale * stageScale);
    } else {
        facing = isFlipped ? -90 : facing;
        newX = Math.min(
            Math.max(
                this.normalExtent.x * this.scale * stageScale,
                5
            ),
            1000
        );
        this.silentSetExtent(new Point(newX, newX));
        this.image = newCanvas(this.extent());
        this.setCenter(currentCenter, true); // just me
        SpriteMorph.uber.drawNew.call(this, facing);
        this.rotationOffset = this.extent().divideBy(2);
        if (isLoadingCostume) { // retry until costume is done loading
            cst = this.costume;
            handle = setInterval(
                function () {
                    myself.wearCostume(cst);
                    clearInterval(handle);
                },
                100
            );
            return myself.wearCostume(null);

        }
    }
    this.version = Date.now();
};

SpriteMorph.prototype.endWarp = function () {
    this.isWarped = false;
    if (this.wantsRedraw) {
        var x = this.xPosition(),
            y = this.yPosition();
        this.drawNew();
        this.silentGotoXY(x, y, true); // just me
        this.wantsRedraw = false;
    }
    this.parent.changed();
};

SpriteMorph.prototype.rotationCenter = function () {
    return this.position().add(this.rotationOffset);
};

SpriteMorph.prototype.colorFiltered = function (aColor) {
    // answer a new Morph containing my image filtered by aColor
    // ignore transparency (alpha)
    var morph = new Morph(),
        ext = this.extent(),
        ctx,
        src,
        clr,
        i,
        dta;

    src = this.image.getContext('2d').getImageData(0, 0, ext.x, ext.y);
    morph.image = newCanvas(ext);
    morph.bounds = this.bounds.copy();
    ctx = morph.image.getContext('2d');
    dta = ctx.createImageData(ext.x, ext.y);
    for (i = 0; i < ext.x * ext.y * 4; i += 4) {
        clr = new Color(
            src.data[i],
            src.data[i + 1],
            src.data[i + 2]
        );
        if (clr.eq(aColor)) {
            dta.data[i] = src.data[i];
            dta.data[i + 1] = src.data[i + 1];
            dta.data[i + 2] = src.data[i + 2];
            dta.data[i + 3] = 255;
        }
    }
    ctx.putImageData(dta, 0, 0);
    return morph;
};

// SpriteMorph block instantiation

SpriteMorph.prototype.blockForSelector = function (selector, setDefaults) {
    var info, block, defaults, inputs, i;
    info = this.blocks[selector];
    if (!info) {return null; }
    block = info.type === 'command' ? new CommandBlockMorph()
        : info.type === 'hat' ? new HatBlockMorph()
            : info.type === 'ring' ? new RingMorph()
                : new ReporterBlockMorph(info.type === 'predicate');
    block.color = this.blockColor[info.category];
    block.category = info.category;
    block.selector = selector;
    if (contains(['reifyReporter', 'reifyPredicate'], block.selector)) {
        block.isStatic = true;
    }
    block.setSpec(localize(info.spec));
    if (setDefaults && info.defaults) {
        defaults = info.defaults;
        block.defaults = defaults;
        inputs = block.inputs();
        if (inputs[0] instanceof MultiArgMorph) {
            inputs[0].setContents(defaults);
            inputs[0].defaults = defaults;
        } else {
            for (i = 0; i < defaults.length; i += 1) {
                if (defaults[i] !== null) {
                    inputs[i].setContents(defaults[i]);
                }
            }
        }
    }
    return block;
};

SpriteMorph.prototype.variableBlock = function (varName) {
    var block = new ReporterBlockMorph(false);
    block.selector = 'reportGetVar';
    block.color = this.blockColor.variables;
    block.category = 'variables';
    block.setSpec(varName);
    block.isDraggable = true;
    return block;
};

// SpriteMorph block templates

SpriteMorph.prototype.blockTemplates = function (category) {
    var blocks = [], myself = this, varNames, button,
        cat = category || 'motion', txt;

    function block(selector) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
        newBlock.isTemplate = true;
        return newBlock;
    }

    function variableBlock(varName) {
        var newBlock = SpriteMorph.prototype.variableBlock(varName);
        newBlock.isDraggable = false;
        newBlock.isTemplate = true;
        return newBlock;
    }

    function watcherToggle(selector) {
        if (StageMorph.prototype.hiddenPrimitives[selector]) {
            return null;
        }
        var info = SpriteMorph.prototype.blocks[selector];
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleWatcher(
                    selector,
                    localize(info.spec),
                    myself.blockColor[info.category]
                );
            },
            null,
            function () {
                return myself.showingWatcher(selector);
            },
            null
        );
    }

    function variableWatcherToggle(varName) {
        return new ToggleMorph(
            'checkbox',
            this,
            function () {
                myself.toggleVariableWatcher(varName);
            },
            null,
            function () {
                return myself.showingVariableWatcher(varName);
            },
            null
        );
    }

    function helpMenu() {
        var menu = new MenuMorph(this);
        menu.addItem('help...', 'showHelp');
        return menu;
    }

    if (cat === 'motion') {

        blocks.push(block('forward'));
        blocks.push(block('turn'));
        blocks.push(block('turnLeft'));
        blocks.push('-');
        blocks.push(block('setHeading'));
        blocks.push(block('doFaceTowards'));
        blocks.push('-');
        blocks.push(block('gotoXY'));
        blocks.push(block('doGotoObject'));
        blocks.push(block('doGlide'));
        blocks.push('-');
        blocks.push(block('changeXPosition'));
        blocks.push(block('setXPosition'));
        blocks.push(block('changeYPosition'));
        blocks.push(block('setYPosition'));
        blocks.push('-');
        blocks.push(block('bounceOffEdge'));
        blocks.push('-');
        blocks.push(watcherToggle('xPosition'));
        blocks.push(block('xPosition'));
        blocks.push(watcherToggle('yPosition'));
        blocks.push(block('yPosition'));
        blocks.push(watcherToggle('direction'));
        blocks.push(block('direction'));

    } else if (cat === 'looks') {

        blocks.push(block('doSwitchToCostume'));
        blocks.push(block('doWearNextCostume'));
        blocks.push(watcherToggle('getCostumeIdx'));
        blocks.push(block('getCostumeIdx'));
        blocks.push('-');
        blocks.push(block('doSayFor'));
        blocks.push(block('bubble'));
        blocks.push(block('doThinkFor'));
        blocks.push(block('doThink'));
        blocks.push('-');
        blocks.push(block('changeEffect'));
        blocks.push(block('setEffect'));
        blocks.push(block('clearEffects'));
        blocks.push('-');
        blocks.push(block('changeScale'));
        blocks.push(block('setScale'));
        blocks.push(watcherToggle('getScale'));
        blocks.push(block('getScale'));
        blocks.push('-');
        blocks.push(block('show'));
        blocks.push(block('hide'));
        blocks.push('-');
        blocks.push(block('comeToFront'));
        blocks.push(block('goBack'));

    // for debugging: ///////////////

        if (this.world().isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('log'));
            blocks.push(block('alert'));
        }

    /////////////////////////////////

    } else if (cat === 'sound') {

        blocks.push(block('playSound'));
        blocks.push(block('doPlaySoundUntilDone'));
        blocks.push(block('doStopAllSounds'));
        blocks.push('-');
        blocks.push(block('doRest'));
        blocks.push('-');
        blocks.push(block('doPlayNote'));
        blocks.push('-');
        blocks.push(block('doChangeTempo'));
        blocks.push(block('doSetTempo'));
        blocks.push(watcherToggle('getTempo'));
        blocks.push(block('getTempo'));

    } else if (cat === 'pen') {

        blocks.push(block('clear'));
        blocks.push('-');
        blocks.push(block('down'));
        blocks.push(block('up'));
        blocks.push('-');
        blocks.push(block('setColor'));
        blocks.push(block('changeHue'));
        blocks.push(block('setHue'));
        blocks.push('-');
        blocks.push(block('changeBrightness'));
        blocks.push(block('setBrightness'));
        blocks.push('-');
        blocks.push(block('changeSize'));
        blocks.push(block('setSize'));
        blocks.push('-');
        blocks.push(block('doStamp'));

    } else if (cat === 'control') {

        blocks.push(block('receiveGo'));
        blocks.push(block('receiveKey'));
        blocks.push(block('receiveClick'));
        blocks.push(block('receiveMessage'));
        blocks.push('-');
        blocks.push(block('doBroadcast'));
        blocks.push(block('doBroadcastAndWait'));
        blocks.push(watcherToggle('getLastMessage'));
        blocks.push(block('getLastMessage'));
        blocks.push('-');
        blocks.push(block('doWarp'));
        blocks.push('-');
        blocks.push(block('doWait'));
        blocks.push(block('doWaitUntil'));
        blocks.push('-');
        blocks.push(block('doForever'));
        blocks.push(block('doRepeat'));
        blocks.push(block('doUntil'));
        blocks.push('-');
        blocks.push(block('doIf'));
        blocks.push(block('doIfElse'));
        blocks.push('-');
        blocks.push(block('doReport'));
        blocks.push('-');
        blocks.push(block('doStopBlock'));
        blocks.push(block('doStop'));
        blocks.push(block('doStopAll'));
        blocks.push('-');
        blocks.push(block('doRun'));
        blocks.push(block('fork'));
        blocks.push(block('evaluate'));
        blocks.push('-');
    /*
    // list variants commented out for now (redundant)
        blocks.push(block('doRunWithInputList'));
        blocks.push(block('forkWithInputList'));
        blocks.push(block('evaluateWithInputList'));
        blocks.push('-');
    */
        blocks.push(block('doCallCC'));
        blocks.push(block('reportCallCC'));
        blocks.push('-');
        blocks.push(block('receiveOnClone'));
        blocks.push(block('createClone'));
        blocks.push(block('removeClone'));
        blocks.push('-');
        blocks.push(block('doPauseAll'));

    } else if (cat === 'sensing') {

        blocks.push(block('reportTouchingObject'));
        blocks.push(block('reportTouchingColor'));
        blocks.push(block('reportColorIsTouchingColor'));
        blocks.push('-');
        blocks.push(block('doAsk'));
        blocks.push(watcherToggle('getLastAnswer'));
        blocks.push(block('getLastAnswer'));
        blocks.push('-');
        blocks.push(watcherToggle('reportMouseX'));
        blocks.push(block('reportMouseX'));
        blocks.push(watcherToggle('reportMouseY'));
        blocks.push(block('reportMouseY'));
        blocks.push(block('reportMouseDown'));
        blocks.push('-');
        blocks.push(block('reportKeyPressed'));
        blocks.push('-');
        blocks.push(block('reportDistanceTo'));
        blocks.push('-');
        blocks.push(block('doResetTimer'));
        blocks.push(watcherToggle('getTimer'));
        blocks.push(block('getTimer'));
        blocks.push('-');
        blocks.push(block('reportAttributeOf'));
        blocks.push('-');
        blocks.push(block('reportURL'));
        blocks.push('-');
        blocks.push(block('reportIsFastTracking'));
        blocks.push(block('doSetFastTracking'));

    // for debugging: ///////////////

        if (this.world().isDevMode) {

            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('colorFiltered'));
            blocks.push(block('reportStackSize'));
            blocks.push(block('reportFrameCount'));
        }

    } else if (cat === 'operators') {

        blocks.push(block('reifyScript'));
        blocks.push(block('reifyReporter'));
        blocks.push(block('reifyPredicate'));
        blocks.push('#');
        blocks.push('-');
        blocks.push(block('reportSum'));
        blocks.push(block('reportDifference'));
        blocks.push(block('reportProduct'));
        blocks.push(block('reportQuotient'));
        blocks.push('-');
        blocks.push(block('reportModulus'));
        blocks.push(block('reportRound'));
        blocks.push(block('reportMonadic'));
        blocks.push(block('reportRandom'));
        blocks.push('-');
        blocks.push(block('reportLessThan'));
        blocks.push(block('reportEquals'));
        blocks.push(block('reportGreaterThan'));
        blocks.push('-');
        blocks.push(block('reportAnd'));
        blocks.push(block('reportOr'));
        blocks.push(block('reportNot'));
        blocks.push('-');
        blocks.push(block('reportTrue'));
        blocks.push(block('reportFalse'));
        blocks.push('-');
        blocks.push(block('reportJoinWords'));
        blocks.push(block('reportTextSplit'));
        blocks.push(block('reportLetter'));
        blocks.push(block('reportStringSize'));
        blocks.push('-');
        blocks.push(block('reportUnicode'));
        blocks.push(block('reportUnicodeAsLetter'));
        blocks.push('-');
        blocks.push(block('reportIsA'));
        blocks.push(block('reportIsIdentical'));

    // for debugging: ///////////////

        if (this.world().isDevMode) {
            blocks.push('-');
            txt = new TextMorph(
                'development mode \ndebugging primitives:'
            );
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportTypeOf'));
            blocks.push(block('reportTextFunction'));
        }

    /////////////////////////////////

    } else if (cat === 'variables') {

        button = new PushButtonMorph(
            null,
            function () {
                new VariableDialogMorph(
                    null,
                    function (pair) {
                        if (pair && !myself.variables.silentFind(pair[0])) {
                            myself.addVariable(pair[0], pair[1]);
                            myself.toggleVariableWatcher(pair[0], pair[1]);
                            myself.blocksCache[cat] = null;
                            myself.paletteCache[cat] = null;
                            myself.parentThatIsA(IDE_Morph).refreshPalette();
                        }
                    },
                    myself
                ).prompt(
                    'Variable name',
                    null,
                    myself.world()
                );
            },
            'Make a variable'
        );
        button.userMenu = helpMenu;
        button.selector = 'addVariable';
        button.showHelp = BlockMorph.prototype.showHelp;
        blocks.push(button);

        if (this.variables.allNames().length > 0) {
            button = new PushButtonMorph(
                null,
                function () {
                    var menu = new MenuMorph(
                        myself.deleteVariable,
                        null,
                        myself
                    );
                    myself.variables.allNames().forEach(function (name) {
                        menu.addItem(name, name);
                    });
                    menu.popUpAtHand(myself.world());
                },
                'Delete a variable'
            );
            button.userMenu = helpMenu;
            button.selector = 'deleteVariable';
            button.showHelp = BlockMorph.prototype.showHelp;
            blocks.push(button);
        }

        blocks.push('-');

        varNames = this.variables.allNames();
        if (varNames.length > 0) {
            varNames.forEach(function (name) {
                blocks.push(variableWatcherToggle(name));
                blocks.push(variableBlock(name));
            });
            blocks.push('-');
        }

        blocks.push(block('doSetVar'));
        blocks.push(block('doChangeVar'));
        blocks.push(block('doShowVar'));
        blocks.push(block('doHideVar'));
        blocks.push(block('doDeclareVariables'));

        blocks.push('=');

        blocks.push(block('reportNewList'));
        blocks.push('-');
        blocks.push(block('reportCONS'));
        blocks.push(block('reportListItem'));
        blocks.push(block('reportCDR'));
        blocks.push('-');
        blocks.push(block('reportListLength'));
        blocks.push(block('reportListContainsItem'));
        blocks.push('-');
        blocks.push(block('doAddToList'));
        blocks.push(block('doDeleteFromList'));
        blocks.push(block('doInsertInList'));
        blocks.push(block('doReplaceInList'));

    // for debugging: ///////////////

        if (this.world().isDevMode) {
            blocks.push('-');
            txt = new TextMorph(localize(
                'development mode \ndebugging primitives:'
            ));
            txt.fontSize = 9;
            txt.setColor(this.paletteTextColor);
            blocks.push(txt);
            blocks.push('-');
            blocks.push(block('reportMap'));
        }

    /////////////////////////////////

        blocks.push('=');

        if (StageMorph.prototype.enableCodeMapping) {
            blocks.push(block('doMapCodeOrHeader'));
            blocks.push(block('doMapStringCode'));
            blocks.push(block('doMapListCode'));
            blocks.push('-');
            blocks.push(block('reportMappedCode'));
            blocks.push('=');
        }

        button = new PushButtonMorph(
            null,
            function () {
                var ide = myself.parentThatIsA(IDE_Morph),
                    stage = myself.parentThatIsA(StageMorph);
                new BlockDialogMorph(
                    null,
                    function (definition) {
                        if (definition.spec !== '') {
                            if (definition.isGlobal) {
                                stage.globalBlocks.push(definition);
                            } else {
                                myself.customBlocks.push(definition);
                            }
                            ide.flushPaletteCache();
                            ide.refreshPalette();
                            new BlockEditorMorph(definition, myself).popUp();
                        }
                    },
                    myself
                ).prompt(
                    'Make a block',
                    null,
                    myself.world()
                );
            },
            'Make a block'
        );
        button.userMenu = helpMenu;
        button.selector = 'addCustomBlock';
        button.showHelp = BlockMorph.prototype.showHelp;
        blocks.push(button);
    }
    return blocks;
};

SpriteMorph.prototype.palette = function (category) {
    if (!this.paletteCache[category]) {
        this.paletteCache[category] = this.freshPalette(category);
    }
    return this.paletteCache[category];
};

SpriteMorph.prototype.freshPalette = function (category) {
    var palette = new ScrollFrameMorph(null, null, this.sliderColor),
        unit = SyntaxElementMorph.prototype.fontSize,
        x = 0,
        y = 5,
        ry = 0,
        blocks,
        hideNextSpace = false,
        myself = this,
        stage = this.parentThatIsA(StageMorph),
        oldFlag = Morph.prototype.trackChanges;

    Morph.prototype.trackChanges = false;

    palette.owner = this;
    palette.padding = unit / 2;
    palette.color = this.paletteColor;
    palette.growth = new Point(0, MorphicPreferences.scrollBarSize);

    // menu:

    palette.userMenu = function () {
        var menu = new MenuMorph(),
            ide = this.parentThatIsA(IDE_Morph),
            more = {
                operators:
                    ['reifyScript', 'reifyReporter', 'reifyPredicate'],
                control:
                    ['doWarp'],
                variables:
                    [
                        'doDeclareVariables',
                        'reportNewList',
                        'reportCONS',
                        'reportListItem',
                        'reportCDR',
                        'reportListLength',
                        'reportListContainsItem',
                        'doAddToList',
                        'doDeleteFromList',
                        'doInsertInList',
                        'doReplaceInList'
                    ]
            };

        function hasHiddenPrimitives() {
            var defs = SpriteMorph.prototype.blocks,
                hiddens = StageMorph.prototype.hiddenPrimitives;
            return Object.keys(hiddens).some(function (any) {
                return defs[any].category === category ||
                    contains((more[category] || []), any);
            });
        }

        function canHidePrimitives() {
            return palette.contents.children.some(function (any) {
                return contains(
                    Object.keys(SpriteMorph.prototype.blocks),
                    any.selector
                );
            });
        }

        if (canHidePrimitives()) {
            menu.addItem(
                'hide primitives',
                function () {
                    var defs = SpriteMorph.prototype.blocks;
                    Object.keys(defs).forEach(function (sel) {
                        if (defs[sel].category === category) {
                            StageMorph.prototype.hiddenPrimitives[sel] = true;
                        }
                    });
                    (more[category] || []).forEach(function (sel) {
                        StageMorph.prototype.hiddenPrimitives[sel] = true;
                    });
                    ide.flushBlocksCache(category);
                    ide.refreshPalette();
                }
            );
        }
        if (hasHiddenPrimitives()) {
            menu.addItem(
                'show primitives',
                function () {
                    var hiddens = StageMorph.prototype.hiddenPrimitives,
                        defs = SpriteMorph.prototype.blocks;
                    Object.keys(hiddens).forEach(function (sel) {
                        if (defs[sel].category === category) {
                            delete StageMorph.prototype.hiddenPrimitives[sel];
                        }
                    });
                    (more[category] || []).forEach(function (sel) {
                        delete StageMorph.prototype.hiddenPrimitives[sel];
                    });
                    ide.flushBlocksCache(category);
                    ide.refreshPalette();
                }
            );
        }
        return menu;
    };

    // primitives:

    blocks = this.blocksCache[category];
    if (!blocks) {
        blocks = myself.blockTemplates(category);
        if (this.isCachingPrimitives) {
            myself.blocksCache[category] = blocks;
        }
    }

    blocks.forEach(function (block) {
        if (block === null) {
            return;
        }
        if (block === '-') {
            if (hideNextSpace) {return; }
            y += unit * 0.8;
            hideNextSpace = true;
        } else if (block === '=') {
            if (hideNextSpace) {return; }
            y += unit * 1.6;
            hideNextSpace = true;
        } else if (block === '#') {
            x = 0;
            y = ry;
        } else {
            hideNextSpace = false;
            if (x === 0) {
                y += unit * 0.3;
            }
            block.setPosition(new Point(x, y));
            palette.addContents(block);
            if (block instanceof ToggleMorph
                    || (block instanceof RingMorph)) {
                x = block.right() + unit / 2;
                ry = block.bottom();
            } else {
                if (block.fixLayout) {block.fixLayout(); }
                x = 0;
                y += block.height();
            }
        }
    });

    // global custom blocks:

    if (stage) {
        y += unit * 1.6;

        stage.globalBlocks.forEach(function (definition) {
            var block;
            if (definition.category === category ||
                    (category === 'variables'
                        && contains(
                            ['lists', 'other'],
                            definition.category
                        ))) {
                block = definition.templateInstance();
                y += unit * 0.3;
                block.setPosition(new Point(x, y));
                palette.addContents(block);
                x = 0;
                y += block.height();
            }
        });
    }

    // local custom blocks:

    y += unit * 1.6;
    this.customBlocks.forEach(function (definition) {
        var block;
        if (definition.category === category ||
                (category === 'variables'
                    && contains(
                        ['lists', 'other'],
                        definition.category
                    ))) {
            block = definition.templateInstance();
            y += unit * 0.3;
            block.setPosition(new Point(x, y));
            palette.addContents(block);
            x = 0;
            y += block.height();
        }
    });

    Morph.prototype.trackChanges = oldFlag;
    return palette;
};

// SpriteMorph variable management

SpriteMorph.prototype.addVariable = function (name, isGlobal) {
    var ide = this.parentThatIsA(IDE_Morph);
    if (isGlobal) {
        this.variables.parentFrame.addVar(name);
        if (ide) {
            ide.flushBlocksCache('variables');
        }
    } else {
        this.variables.addVar(name);
        this.blocksCache.variables = null;
    }
};

SpriteMorph.prototype.deleteVariable = function (varName) {
    var ide = this.parentThatIsA(IDE_Morph);
    this.deleteVariableWatcher(varName);
    this.variables.deleteVar(varName);
    if (ide) {
        ide.flushBlocksCache('variables'); // b/c the var could be global
        ide.refreshPalette();
    }
};

// SpriteMorph costume management

SpriteMorph.prototype.addCostume = function (costume) {
    if (!costume.name) {
        costume.name = 'costume' + (this.costumes.length() + 1);
    }
    this.costumes.add(costume);
};

SpriteMorph.prototype.wearCostume = function (costume) {
    var x = this.xPosition ? this.xPosition() : null,
        y = this.yPosition ? this.yPosition() : null,
        isWarped = this.isWarped;
    if (isWarped) {
        this.endWarp();
    }
    this.changed();
    this.costume = costume;
    this.drawNew();
    this.changed();
    if (isWarped) {
        this.startWarp();
    }
    if (x !== null) {
        this.silentGotoXY(x, y, true); // just me
    }
    if (this.positionTalkBubble) { // the stage doesn't talk
        this.positionTalkBubble();
    }
    this.version = Date.now();
};

SpriteMorph.prototype.getCostumeIdx = function () {
    return this.costumes.asArray().indexOf(this.costume) + 1;
};

SpriteMorph.prototype.doWearNextCostume = function () {
    var arr = this.costumes.asArray(),
        idx;
    if (arr.length > 1) {
        idx = arr.indexOf(this.costume);
        if (idx > -1) {
            idx += 1;
            if (idx > (arr.length - 1)) {
                idx = 0;
            }
            this.wearCostume(arr[idx]);
        }
    }
};

SpriteMorph.prototype.doWearPreviousCostume = function () {
    var arr = this.costumes.asArray(),
        idx;
    if (arr.length > 1) {
        idx = arr.indexOf(this.costume);
        if (idx > -1) {
            idx -= 1;
            if (idx < 0) {
                idx = arr.length - 1;
            }
            this.wearCostume(arr[idx]);
        }
    }
};

SpriteMorph.prototype.doSwitchToCostume = function (id) {
    var num,
        arr = this.costumes.asArray(),
        costume;
    if (
        contains(
            [localize('Turtle'), localize('Empty')],
            (id instanceof Array ? id[0] : null)
        )
    ) {
        costume = null;
    } else {
        if (id === -1) {
            this.doWearPreviousCostume();
            return;
        }
        costume = detect(arr, function (cst) {
            return cst.name === id;
        });
        if (costume === null) {
            num = parseFloat(id);
            if (num === 0) {
                costume = null;
            } else {
                costume = arr[num - 1] || null;
            }
        }
    }
    this.wearCostume(costume);
};

// SpriteMorph sound management

SpriteMorph.prototype.addSound = function (audio, name) {
    this.sounds.add(new Sound(audio, name));
};

SpriteMorph.prototype.playSound = function (name) {
    var stage = this.parentThatIsA(StageMorph),
        sound = detect(
            this.sounds.asArray(),
            function (s) {return s.name === name; }
        ),
        active;
    if (sound) {
        active = sound.play();
        if (stage) {
            stage.activeSounds.push(active);
            stage.activeSounds = stage.activeSounds.filter(function (aud) {
                return !aud.ended && !aud.terminated;
            });
        }
        return active;
    }
};

// SpriteMorph user menu

SpriteMorph.prototype.userMenu = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        menu = new MenuMorph(this);

    if (ide && ide.isAppMode) {
        menu.addItem('help', 'nop');
        return menu;
    }
    menu.addItem("duplicate", 'duplicate');
    menu.addItem("delete", 'remove');
    menu.addItem("edit", 'edit');
    menu.addLine();
    if (this.anchor) {
        menu.addItem(
            localize('detach from') + ' ' + this.anchor.name,
            'detachFromAnchor'
        );
    }
    if (this.parts.length) {
        menu.addItem('detach all parts', 'detachAllParts');
    }
    menu.addItem("export...", 'exportSprite');
    return menu;
};

SpriteMorph.prototype.exportSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.exportSprite(this);
    }
};

SpriteMorph.prototype.edit = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.selectSprite(this);
    }
};

SpriteMorph.prototype.showOnStage = function () {
    var stage = this.parentThatIsA(StageMorph);
    if (stage) {
        this.keepWithin(stage);
        stage.add(this);
    }
    this.show();
};

SpriteMorph.prototype.duplicate = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.duplicateSprite(this);
    }
};

SpriteMorph.prototype.remove = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.removeSprite(this);
    }
};

// SpriteMorph cloning (experimental)

SpriteMorph.prototype.createClone = function () {
    var clone,
        hats,
        stage = this.parentThatIsA(StageMorph);
    if (stage) {
        if (stage.cloneCount > 300) {return; }
        stage.cloneCount += 1;
        clone = this.fullCopy();
        clone.isClone = true;
        clone.name = '';
        clone.cloneOriginName = this.isClone ?
                this.cloneOriginName : this.name;
        stage.add(clone);
        hats = clone.allHatBlocksFor('__clone__init__');
        hats.forEach(function (block) {
            stage.threads.startProcess(block, stage.isThreadSafe);
        });
    }
};

SpriteMorph.prototype.removeClone = function () {
    if (this.isClone) {
        // this.stopTalking();
        this.parent.threads.stopAllForReceiver(this);
        this.destroy();
        this.parent.cloneCount -= 1;
    }
};

// SpriteMorph primitives

// SpriteMorph pen color

SpriteMorph.prototype.setColor = function (aColor) {
    var x = this.xPosition(),
        y = this.yPosition();
    if (!this.color.eq(aColor)) {
        this.color = aColor;
        this.drawNew();
        this.gotoXY(x, y);
    }
};

SpriteMorph.prototype.getHue = function () {
    return this.color.hsv()[0] * 100;
};

SpriteMorph.prototype.setHue = function (num) {
    var hsv = this.color.hsv(),
        x = this.xPosition(),
        y = this.yPosition();

    hsv[0] = Math.max(Math.min(+num || 0, 100), 0) / 100;
    hsv[1] = 1; // we gotta fix this at some time
    this.color.set_hsv.apply(this.color, hsv);
    if (!this.costume) {
        this.drawNew();
        this.changed();
    }
    this.gotoXY(x, y);
};

SpriteMorph.prototype.changeHue = function (delta) {
    this.setHue(this.getHue() + (+delta || 0));
};

SpriteMorph.prototype.getBrightness = function () {
    return this.color.hsv()[2] * 100;
};

SpriteMorph.prototype.setBrightness = function (num) {
    var hsv = this.color.hsv(),
        x = this.xPosition(),
        y = this.yPosition();

    hsv[1] = 1; // we gotta fix this at some time
    hsv[2] = Math.max(Math.min(+num || 0, 100), 0) / 100;
    this.color.set_hsv.apply(this.color, hsv);
    if (!this.costume) {
        this.drawNew();
        this.changed();
    }
    this.gotoXY(x, y);
};

SpriteMorph.prototype.changeBrightness = function (delta) {
    this.setBrightness(this.getBrightness() + (+delta || 0));
};

// SpriteMorph layers

SpriteMorph.prototype.comeToFront = function () {
    if (this.parent) {
        this.parent.add(this);
        this.changed();
    }
};

SpriteMorph.prototype.goBack = function (layers) {
    var layer, newLayer = +layers || 0;
    if (!this.parent) {return null; }
    layer = this.parent.children.indexOf(this);
    if (layer < newLayer) {return null; }
    this.parent.removeChild(this);
    this.parent.children.splice(layer - newLayer, null, this);
    this.parent.changed();
};

// SpriteMorph collision detection optimization

SpriteMorph.prototype.overlappingImage = function (otherSprite) {
    // overrides method from Morph because Sprites aren't nested Morphs
    var oRect = this.bounds.intersect(otherSprite.bounds),
        oImg = newCanvas(oRect.extent()),
        ctx = oImg.getContext('2d');

    if (oRect.width() < 1 || oRect.height() < 1) {
        return newCanvas(new Point(1, 1));
    }
    ctx.drawImage(
        this.image,
        this.left() - oRect.left(),
        this.top() - oRect.top()
    );
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(
        otherSprite.image,
        otherSprite.left() - oRect.left(),
        otherSprite.top() - oRect.top()
    );
    return oImg;
};

// SpriteMorph stamping

SpriteMorph.prototype.doStamp = function () {
    var stage = this.parent,
        context = stage.penTrails().getContext('2d'),
        isWarped = this.isWarped;
    if (isWarped) {
        this.endWarp();
    }
    context.save();
    context.scale(1 / stage.scale, 1 / stage.scale);
    context.drawImage(
        this.image,
        (this.left() - stage.left()),
        (this.top() - stage.top())
    );
    context.restore();
    this.changed();
    if (isWarped) {
        this.startWarp();
    }
};

SpriteMorph.prototype.clear = function () {
    this.parent.clearPenTrails();
};

// SpriteMorph pen size

SpriteMorph.prototype.setSize = function (size) {
    // pen size
    if (!isNaN(size)) {
        this.size = Math.min(Math.max(+size, 0.0001), 1000);
    }
};

SpriteMorph.prototype.changeSize = function (delta) {
    this.setSize(this.size + (+delta || 0));
};

// SpriteMorph scale

SpriteMorph.prototype.getScale = function () {
    // answer my scale in percent
    return this.scale * 100;
};

SpriteMorph.prototype.setScale = function (percentage) {
    // set my (absolute) scale in percent
    var x = this.xPosition(),
        y = this.yPosition(),
        isWarped = this.isWarped,
        realScale,
        growth;

    if (isWarped) {
        this.endWarp();
    }
    realScale = (+percentage || 0) / 100;
    growth = realScale / this.nestingScale;
    this.nestingScale = realScale;
    this.scale = Math.max(realScale, 0.01);

    // apply to myself
    this.changed();
    this.drawNew();
    this.changed();
    if (isWarped) {
        this.startWarp();
    }
    this.silentGotoXY(x, y, true); // just me
    this.positionTalkBubble();

    // propagate to nested parts
    this.parts.forEach(function (part) {
        var xDist = part.xPosition() - x,
            yDist = part.yPosition() - y;
        part.setScale(part.scale * 100 * growth);
        part.silentGotoXY(
            x + (xDist * growth),
            y + (yDist * growth)
        );
    });
};

SpriteMorph.prototype.changeScale = function (delta) {
    this.setScale(this.getScale() + (+delta || 0));
};

// SpriteMorph graphic effects

SpriteMorph.prototype.setEffect = function (effect, value) {
    var eff = effect instanceof Array ? effect[0] : null;
    if (eff === 'ghost') {
        this.alpha = 1 - Math.min(Math.max(+value || 0, 0), 100) / 100;
        this.changed();
    }
};

SpriteMorph.prototype.getGhostEffect = function () {
    return (1 - this.alpha) * 100;
};

SpriteMorph.prototype.changeEffect = function (effect, value) {
    var eff = effect instanceof Array ? effect[0] : null;
    if (eff === 'ghost') {
        this.setEffect(effect, this.getGhostEffect() + (+value || 0));
    }
};

SpriteMorph.prototype.clearEffects = function () {
    this.setEffect(['ghost'], 0);
};

// SpriteMorph talk bubble

SpriteMorph.prototype.stopTalking = function () {
    var bubble = this.talkBubble();
    if (bubble) {bubble.destroy(); }
};

SpriteMorph.prototype.doThink = function (data) {
    this.bubble(data, true);
};

SpriteMorph.prototype.bubble = function (data, isThought, isQuestion) {
    var bubble,
        stage = this.parentThatIsA(StageMorph);

    this.stopTalking();
    if (data === '' || isNil(data)) {return; }
    bubble = new SpriteBubbleMorph(
        data,
        stage ? stage.scale : 1,
        isThought,
        isQuestion
    );
    this.add(bubble);
    this.positionTalkBubble();
};

SpriteMorph.prototype.talkBubble = function () {
    return detect(
        this.children,
        function (morph) {return morph instanceof SpeechBubbleMorph; }
    );
};

SpriteMorph.prototype.positionTalkBubble = function () {
    var stage = this.parentThatIsA(StageMorph),
        stageScale = stage ? stage.scale : 1,
        bubble = this.talkBubble(),
        middle = this.center().y;
    if (!bubble) {return null; }
    bubble.show();
    if (!bubble.isPointingRight) {
        bubble.isPointingRight = true;
        bubble.drawNew();
        bubble.changed();
    }
    bubble.setLeft(this.right());
    bubble.setBottom(this.top());
    while (!this.isTouching(bubble) && bubble.bottom() < middle) {
        bubble.silentMoveBy(new Point(-1, 1).scaleBy(stageScale));
    }
    if (!stage) {return null; }
    if (bubble.right() > stage.right()) {
        bubble.isPointingRight = false;
        bubble.drawNew();
        bubble.setRight(this.center().x);
    }
    bubble.keepWithin(stage);
    bubble.changed();
};

// dragging and dropping adjustments b/c of talk bubbles

SpriteMorph.prototype.prepareToBeGrabbed = function (hand) {
    var bubble = this.talkBubble();
    if (!bubble) {return null; }
    this.removeShadow();
    bubble.hide();
    if (!this.bounds.containsPoint(hand.position())) {
        this.setCenter(hand.position());
    }
    this.addShadow();
};

SpriteMorph.prototype.justDropped = function () {
    this.positionTalkBubble();
};

// SpriteMorph drawing:

SpriteMorph.prototype.drawLine = function (start, dest) {
    var stagePos = this.parent.bounds.origin,
        stageScale = this.parent.scale,
        context = this.parent.penTrails().getContext('2d'),
        from = start.subtract(stagePos).divideBy(stageScale),
        to = dest.subtract(stagePos).divideBy(stageScale),
        damagedFrom = from.multiplyBy(stageScale).add(stagePos),
        damagedTo = to.multiplyBy(stageScale).add(stagePos),
        damaged = damagedFrom.rectangle(damagedTo).expandBy(
            Math.max(this.size * stageScale / 2, 1)
        ).intersect(this.parent.visibleBounds()).spread();

    if (this.isDown) {
        context.lineWidth = this.size;
        context.strokeStyle = this.color.toString();
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
        if (this.isWarped === false) {
            this.world().broken.push(damaged);
        }
    }
};

// SpriteMorph motion - adjustments due to nesting

SpriteMorph.prototype.moveBy = function (delta, justMe) {
    // override the inherited default to make sure my parts follow
    // unless it's justMe (a correction)
    var start = this.isDown && !justMe && this.parent ?
            this.rotationCenter() : null;
    SpriteMorph.uber.moveBy.call(this, delta);
    if (start) {
        this.drawLine(start, this.rotationCenter());
    }
    if (!justMe) {
        this.parts.forEach(function (part) {
            part.moveBy(delta);
        });
    }
};

SpriteMorph.prototype.slideBackTo = function (situation, inSteps) {
    // override the inherited default to make sure my parts follow
    var steps = inSteps || 5,
        pos = situation.origin.position().add(situation.position),
        xStep = -(this.left() - pos.x) / steps,
        yStep = -(this.top() - pos.y) / steps,
        stepCount = 0,
        oldStep = this.step,
        oldFps = this.fps,
        myself = this;

    this.fps = 0;
    this.step = function () {
        myself.moveBy(new Point(xStep, yStep));
        stepCount += 1;
        if (stepCount === steps) {
            situation.origin.add(myself);
            if (situation.origin.reactToDropOf) {
                situation.origin.reactToDropOf(myself);
            }
            myself.step = oldStep;
            myself.fps = oldFps;
        }
    };
};

SpriteMorph.prototype.setCenter = function (aPoint, justMe) {
    // override the inherited default to make sure my parts follow
    // unless it's justMe
    var delta = aPoint.subtract(this.center());
    this.moveBy(delta, justMe);
};

SpriteMorph.prototype.nestingBounds = function () {
    // same as fullBounds(), except that it uses "parts" instead of children
    var result;
    result = this.bounds;
    this.parts.forEach(function (part) {
        if (part.isVisible) {
            result = result.merge(part.nestingBounds());
        }
    });
    return result;
};

// SpriteMorph motion primitives

Morph.prototype.setPosition = function (aPoint, justMe) {
    // override the inherited default to make sure my parts follow
    // unless it's justMe
    var delta = aPoint.subtract(this.topLeft());
    if ((delta.x !== 0) || (delta.y !== 0)) {
        this.moveBy(delta, justMe);
    }
};

SpriteMorph.prototype.forward = function (steps) {
    var dest,
        dist = steps * this.parent.scale || 0;

    if (dist >= 0) {
        dest = this.position().distanceAngle(dist, this.heading);
    } else {
        dest = this.position().distanceAngle(
            Math.abs(dist),
            (this.heading - 180)
        );
    }
    this.setPosition(dest);
    this.positionTalkBubble();
};

SpriteMorph.prototype.setHeading = function (degrees) {
    var x = this.xPosition(),
        y = this.yPosition(),
        turn = degrees - this.heading;

    // apply to myself
    this.changed();
    SpriteMorph.uber.setHeading.call(this, degrees);
    this.silentGotoXY(x, y, true); // just me
    this.positionTalkBubble();

    // propagate to my parts
    this.parts.forEach(function (part) {
        var pos = new Point(part.xPosition(), part.yPosition()),
            trg = pos.rotateBy(radians(turn), new Point(x, y));
        if (part.rotatesWithAnchor) {
            part.turn(turn);
        }
        part.gotoXY(trg.x, trg.y);
    });
};

SpriteMorph.prototype.faceToXY = function (x, y) {
    var deltaX = (x - this.xPosition()) * this.parent.scale,
        deltaY = (y - this.yPosition()) * this.parent.scale,
        angle = Math.abs(deltaX) < 0.001 ? (deltaY < 0 ? 90 : 270)
                : Math.round(
                (deltaX >= 0 ? 0 : 180)
                    - (Math.atan(deltaY / deltaX) * 57.2957795131)
            );
    this.setHeading(angle + 90);
};

SpriteMorph.prototype.turn = function (degrees) {
    this.setHeading(this.heading + (+degrees || 0));
};

SpriteMorph.prototype.turnLeft = function (degrees) {
    this.setHeading(this.heading - (+degrees || 0));
};

SpriteMorph.prototype.xPosition = function () {
    var stage = this.parentThatIsA(StageMorph);

    if (!stage && this.parent.grabOrigin) { // I'm currently being dragged
        stage = this.parent.grabOrigin.origin;
    }
    if (stage) {
        return (this.rotationCenter().x - stage.center().x) / stage.scale;
    }
    return this.rotationCenter().x;
};

SpriteMorph.prototype.yPosition = function () {
    var stage = this.parentThatIsA(StageMorph);

    if (!stage && this.parent.grabOrigin) { // I'm currently being dragged
        stage = this.parent.grabOrigin.origin;
    }
    if (stage) {
        return (stage.center().y - this.rotationCenter().y) / stage.scale;
    }
    return this.rotationCenter().y;
};

SpriteMorph.prototype.direction = function () {
    return this.heading;
};

SpriteMorph.prototype.penSize = function () {
    return this.size;
};

SpriteMorph.prototype.gotoXY = function (x, y, justMe) {
    var stage = this.parentThatIsA(StageMorph),
        newX,
        newY,
        dest;

    newX = stage.center().x + (+x || 0) * stage.scale;
    newY = stage.center().y - (+y || 0) * stage.scale;
    if (this.costume) {
        dest = new Point(newX, newY).subtract(this.rotationOffset);
    } else {
        dest = new Point(newX, newY).subtract(this.extent().divideBy(2));
    }
    this.setPosition(dest, justMe);
    this.positionTalkBubble();
};

SpriteMorph.prototype.silentGotoXY = function (x, y, justMe) {
    // move without drawing
    var penState = this.isDown;
    this.isDown = false;
    this.gotoXY(x, y, justMe);
    this.isDown = penState;
};

SpriteMorph.prototype.setXPosition = function (num) {
    this.gotoXY(+num || 0, this.yPosition());
};

SpriteMorph.prototype.changeXPosition = function (delta) {
    this.setXPosition(this.xPosition() + (+delta || 0));
};

SpriteMorph.prototype.setYPosition = function (num) {
    this.gotoXY(this.xPosition(), +num || 0);
};

SpriteMorph.prototype.changeYPosition = function (delta) {
    this.setYPosition(this.yPosition() + (+delta || 0));
};

SpriteMorph.prototype.glide = function (
    duration,
    endX,
    endY,
    elapsed,
    startPoint
) {
    var fraction, endPoint, rPos;
    endPoint = new Point(endX, endY);
    fraction = Math.max(Math.min(elapsed / duration, 1), 0);
    rPos = startPoint.add(
        endPoint.subtract(startPoint).multiplyBy(fraction)
    );
    this.gotoXY(rPos.x, rPos.y);
};

SpriteMorph.prototype.bounceOffEdge = function () {
    // taking nested parts into account
    var stage = this.parentThatIsA(StageMorph),
        fb = this.nestingBounds(),
        dirX,
        dirY;

    if (!stage) {return null; }
    if (stage.bounds.containsRectangle(fb)) {return null; }

    dirX = Math.cos(radians(this.heading - 90));
    dirY = -(Math.sin(radians(this.heading - 90)));

    if (fb.left() < stage.left()) {
        dirX = Math.abs(dirX);
    }
    if (fb.right() > stage.right()) {
        dirX = -(Math.abs(dirX));
    }
    if (fb.top() < stage.top()) {
        dirY = -(Math.abs(dirY));
    }
    if (fb.bottom() > stage.bottom()) {
        dirY = Math.abs(dirY);
    }

    this.setHeading(degrees(Math.atan2(-dirY, dirX)) + 90);
    this.setPosition(this.position().add(
        fb.amountToTranslateWithin(stage.bounds)
    ));
    this.positionTalkBubble();
};

// SpriteMorph message broadcasting

SpriteMorph.prototype.allMessageNames = function () {
    var msgs = [];
    this.scripts.allChildren().forEach(function (morph) {
        var txt;
        if (morph.selector) {
            if (contains(
                    ['receiveMessage', 'doBroadcast', 'doBroadcastAndWait'],
                    morph.selector
                )) {
                txt = morph.inputs()[0].evaluate();
                if (isString(txt) && txt !== '') {
                    if (!contains(msgs, txt)) {
                        msgs.push(txt);
                    }
                }
            }
        }
    });
    return msgs;
};

SpriteMorph.prototype.allHatBlocksFor = function (message) {
    return this.scripts.children.filter(function (morph) {
        var event;
        if (morph.selector) {
            if (morph.selector === 'receiveMessage') {
                event = morph.inputs()[0].evaluate();
                return event === message || (event instanceof Array);
            }
            if (morph.selector === 'receiveGo') {
                return message === '__shout__go__';
            }
            if (morph.selector === 'receiveOnClone') {
                return message === '__clone__init__';
            }
            if (morph.selector === 'receiveClick') {
                return message === '__click__';
            }
        }
        return false;
    });
};

SpriteMorph.prototype.allHatBlocksForKey = function (key) {
    return this.scripts.children.filter(function (morph) {
        if (morph.selector) {
            if (morph.selector === 'receiveKey') {
                return morph.inputs()[0].evaluate()[0] === key;
            }
        }
        return false;
    });
};

// SpriteMorph events

SpriteMorph.prototype.mouseClickLeft = function () {
    var stage = this.parentThatIsA(StageMorph),
        hats = this.allHatBlocksFor('__click__'),
        procs = [];

    hats.forEach(function (block) {
        procs.push(stage.threads.startProcess(block, stage.isThreadSafe));
    });
    return procs;
};

// SpriteMorph timer

SpriteMorph.prototype.getTimer = function () {
    var stage = this.parentThatIsA(StageMorph);
    if (stage) {
        return stage.getTimer();
    }
    return 0;
};

// SpriteMorph tempo

SpriteMorph.prototype.getTempo = function () {
    var stage = this.parentThatIsA(StageMorph);
    if (stage) {
        return stage.getTempo();
    }
    return 0;
};

// SpriteMorph last message

SpriteMorph.prototype.getLastMessage = function () {
    var stage = this.parentThatIsA(StageMorph);
    if (stage) {
        return stage.getLastMessage();
    }
    return '';
};

// SpriteMorph user prompting

SpriteMorph.prototype.getLastAnswer = function () {
    return this.parentThatIsA(StageMorph).lastAnswer;
};

// SpriteMorph mouse coordinates

SpriteMorph.prototype.reportMouseX = function () {
    var stage = this.parentThatIsA(StageMorph);
    if (stage) {
        return stage.reportMouseX();
    }
    return 0;
};

SpriteMorph.prototype.reportMouseY = function () {
    var stage = this.parentThatIsA(StageMorph);
    if (stage) {
        return stage.reportMouseY();
    }
    return 0;
};

// SpriteMorph variable watchers (for palette checkbox toggling)

SpriteMorph.prototype.findVariableWatcher = function (varName) {
    var stage = this.parentThatIsA(StageMorph),
        myself = this;
    if (stage === null) {
        return null;
    }
    return detect(
        stage.children,
        function (morph) {
            return morph instanceof WatcherMorph
                    && (morph.target === myself.variables
                            || morph.target === myself.variables.parentFrame)
                    && morph.getter === varName;
        }
    );
};

SpriteMorph.prototype.toggleVariableWatcher = function (varName, isGlobal) {
    var stage = this.parentThatIsA(StageMorph),
        watcher,
        others;
    if (stage === null) {
        return null;
    }
    watcher = this.findVariableWatcher(varName);
    if (watcher !== null) {
        if (watcher.isVisible) {
            watcher.hide();
        } else {
            watcher.show();
            watcher.fixLayout(); // re-hide hidden parts
            watcher.keepWithin(stage);
        }
        return;
    }

    // if no watcher exists, create a new one
    watcher = new WatcherMorph(
        varName,
        this.blockColor.variables,
        isGlobal ? this.variables.parentFrame : this.variables,
        varName
    );
    watcher.setPosition(stage.position().add(10));
    others = stage.watchers(watcher.left());
    if (others.length > 0) {
        watcher.setTop(others[others.length - 1].bottom());
    }
    stage.add(watcher);
    watcher.fixLayout();
    watcher.keepWithin(stage);
};

SpriteMorph.prototype.showingVariableWatcher = function (varName) {
    var stage = this.parentThatIsA(StageMorph),
        watcher;
    if (stage === null) {
        return false;
    }
    watcher = this.findVariableWatcher(varName);
    if (watcher) {
        return watcher.isVisible;
    }
    return false;
};

SpriteMorph.prototype.deleteVariableWatcher = function (varName) {
    var stage = this.parentThatIsA(StageMorph),
        watcher;
    if (stage === null) {
        return null;
    }
    watcher = this.findVariableWatcher(varName);
    if (watcher !== null) {
        watcher.destroy();
    }
};

// SpriteMorph non-variable watchers

SpriteMorph.prototype.toggleWatcher = function (selector, label, color) {
    var stage = this.parentThatIsA(StageMorph),
        watcher,
        others;
    if (!stage) { return; }
    watcher = this.watcherFor(stage, selector);
    if (watcher) {
        if (watcher.isVisible) {
            watcher.hide();
        } else {
            watcher.show();
            watcher.fixLayout(); // re-hide hidden parts
            watcher.keepWithin(stage);
        }
        return;
    }

    // if no watcher exists, create a new one
    watcher = new WatcherMorph(
        label,
        color,
        WatcherMorph.prototype.isGlobal(selector) ? stage : this,
        selector
    );
    watcher.setPosition(stage.position().add(10));
    others = stage.watchers(watcher.left());
    if (others.length > 0) {
        watcher.setTop(others[others.length - 1].bottom());
    }
    stage.add(watcher);
    watcher.fixLayout();
    watcher.keepWithin(stage);
};

SpriteMorph.prototype.showingWatcher = function (selector) {
    var stage = this.parentThatIsA(StageMorph),
        watcher;
    if (stage === null) {
        return false;
    }
    watcher = this.watcherFor(stage, selector);
    if (watcher) {
        return watcher.isVisible;
    }
    return false;
};

SpriteMorph.prototype.watcherFor = function (stage, selector) {
    var myself = this;
    return detect(stage.children, function (morph) {
        return morph instanceof WatcherMorph &&
            morph.getter === selector &&
             morph.target === (morph.isGlobal(selector) ? stage : myself);
    });
};

// SpriteMorph custom blocks

SpriteMorph.prototype.deleteAllBlockInstances = function (definition) {
    this.allBlockInstances(definition).forEach(function (each) {
        each.deleteBlock();
    });
    this.customBlocks.forEach(function (def) {
        if (def.body && def.body.expression.isCorpse) {
            def.body = null;
        }
    });
};

SpriteMorph.prototype.allBlockInstances = function (definition) {
    var stage, objects, blocks = [], inDefinitions;
    if (definition.isGlobal) {
        stage = this.parentThatIsA(StageMorph);
        objects = stage.children.filter(function (morph) {
            return morph instanceof SpriteMorph;
        });
        objects.push(stage);
        objects.forEach(function (sprite) {
            blocks = blocks.concat(sprite.allLocalBlockInstances(definition));
        });
        inDefinitions = [];
        stage.globalBlocks.forEach(function (def) {
            if (def.body) {
                def.body.expression.allChildren().forEach(function (c) {
                    if (c.definition && (c.definition === definition)) {
                        inDefinitions.push(c);
                    }
                });
            }
        });
        return blocks.concat(inDefinitions);
    }
    return this.allLocalBlockInstances(definition);
};

SpriteMorph.prototype.allLocalBlockInstances = function (definition) {
    var inScripts, inDefinitions, inBlockEditors, inPalette, result;

    inScripts = this.scripts.allChildren().filter(function (c) {
        return c.definition && (c.definition === definition);
    });

    inDefinitions = [];
    this.customBlocks.forEach(function (def) {
        if (def.body) {
            def.body.expression.allChildren().forEach(function (c) {
                if (c.definition && (c.definition === definition)) {
                    inDefinitions.push(c);
                }
            });
        }
    });

    inBlockEditors = this.allEditorBlockInstances(definition);
    inPalette = this.paletteBlockInstance(definition);

    result = inScripts.concat(inDefinitions).concat(inBlockEditors);
    if (inPalette) {
        result.push(inPalette);
    }
    return result;
};

SpriteMorph.prototype.allEditorBlockInstances = function (definition) {
    var inBlockEditors = [],
        world = this.world();

    if (!world) {return []; } // when copying a sprite

    this.world().children.forEach(function (morph) {
        if (morph instanceof BlockEditorMorph) {
            morph.body.contents.allChildren().forEach(function (block) {
                if (!block.isPrototype
                        && !(block instanceof PrototypeHatBlockMorph)
                        && (block.definition === definition)) {
                    inBlockEditors.push(block);
                }
            });
        }
    });
    return inBlockEditors;
};


SpriteMorph.prototype.paletteBlockInstance = function (definition) {
    var ide = this.parentThatIsA(IDE_Morph);
    if (!ide) {return null; }
    return detect(
        ide.palette.contents.children,
        function (block) {
            return block.definition === definition;
        }
    );
};

SpriteMorph.prototype.usesBlockInstance = function (definition) {
    var inDefinitions,
        inScripts = detect(
            this.scripts.allChildren(),
            function (c) {
                return c.definition && (c.definition === definition);
            }
        );

    if (inScripts) {return true; }

    inDefinitions = [];
    this.customBlocks.forEach(function (def) {
        if (def.body) {
            def.body.expression.allChildren().forEach(function (c) {
                if (c.definition && (c.definition === definition)) {
                    inDefinitions.push(c);
                }
            });
        }
    });
    return (inDefinitions.length > 0);
};

SpriteMorph.prototype.doubleDefinitionsFor = function (definition) {
    var spec = definition.blockSpec(),
        blockList,
        idx,
        stage;

    if (definition.isGlobal) {
        stage = this.parentThatIsA(StageMorph);
        if (!stage) {return []; }
        blockList = stage.globalBlocks;
    } else {
        blockList = this.customBlocks;
    }
    idx = blockList.indexOf(definition);
    if (idx === -1) {return []; }
    return blockList.filter(function (def, i) {
        return def.blockSpec() === spec && (i !== idx);
    });
};

SpriteMorph.prototype.replaceDoubleDefinitionsFor = function (definition) {
    var doubles = this.doubleDefinitionsFor(definition),
        myself = this,
        stage,
        ide;
    doubles.forEach(function (double) {
        myself.allBlockInstances(double).forEach(function (block) {
            block.definition = definition;
            block.refresh();
        });
    });
    if (definition.isGlobal) {
        stage = this.parentThatIsA(StageMorph);
        stage.globalBlocks = stage.globalBlocks.filter(function (def) {
            return !contains(doubles, def);
        });
    } else {
        this.customBlocks = this.customBlocks.filter(function (def) {
            return !contains(doubles, def);
        });
    }
    ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.flushPaletteCache();
        ide.refreshPalette();
    }
};

// SpriteMorph thumbnail

SpriteMorph.prototype.thumbnail = function (extentPoint) {
/*
    answer a new Canvas of extentPoint dimensions containing
    my thumbnail representation keeping the originial aspect ratio
*/
    var src = this.image, // at this time sprites aren't composite morphs
        scale = Math.min(
            (extentPoint.x / src.width),
            (extentPoint.y / src.height)
        ),
        xOffset = (extentPoint.x - (src.width * scale)) / 2,
        yOffset = (extentPoint.y - (src.height * scale)) / 2,
        trg = newCanvas(extentPoint),
        ctx = trg.getContext('2d');

    ctx.save();
    if (src.width && src.height) {
        ctx.scale(scale, scale);
        ctx.drawImage(
            src,
            Math.floor(xOffset / scale),
            Math.floor(yOffset / scale)
        );
    }
    return trg;
};

SpriteMorph.prototype.fullThumbnail = function (extentPoint) {
    // containing parts and anchor symbols, if any
    var thumb = this.thumbnail(extentPoint),
        ctx = thumb.getContext('2d'),
        ext = extentPoint.divideBy(3),
        i = 0;

    ctx.restore();
    if (this.anchor) {
        ctx.drawImage(
            this.anchor.thumbnail(ext),
            0,
            0
        );
    }
    for (i = 0; i < 3; i += 1) {
        if (this.parts[i]) {
            ctx.drawImage(
                this.parts[i].thumbnail(ext),
                i * ext.x,
                extentPoint.y - ext.y
            );
        }
    }
    return thumb;
};

// SpriteMorph Boolean visual representation

SpriteMorph.prototype.booleanMorph = function (bool) {
    // answer a block which can be shown in watchers, speech bubbles etc.
    var block = new ReporterBlockMorph(true);
    block.color = SpriteMorph.prototype.blockColor.operators;
    block.setSpec(localize(bool.toString()));
    return block;
};

// SpriteMorph nesting
/*
    simulate Morphic trees
*/

SpriteMorph.prototype.attachPart = function (aSprite) {
    var v = Date.now();
    if (aSprite.anchor) {
        aSprite.anchor.detachPart(aSprite);
    }
    this.parts.push(aSprite);
    this.version = v;
    aSprite.anchor = this;
    this.allParts().forEach(function (part) {
        part.nestingScale = part.scale;
    });
    aSprite.version = v;
};

SpriteMorph.prototype.detachPart = function (aSprite) {
    var idx = this.parts.indexOf(aSprite),
        v;
    if (idx !== -1) {
        v = Date.now();
        this.parts.splice(idx, 1);
        this.version = v;
        aSprite.anchor = null;
        aSprite.version = v;
    }
};

SpriteMorph.prototype.detachAllParts = function () {
    var v = Date.now();

    this.parts.forEach(function (part) {
        part.anchor = null;
        part.version = v;
    });
    this.parts = [];
    this.version = v;
};

SpriteMorph.prototype.detachFromAnchor = function () {
    if (this.anchor) {
        this.anchor.detachPart(this);
    }
};

SpriteMorph.prototype.allParts = function () {
    // includes myself
    var result = [this];
    this.parts.forEach(function (part) {
        result = result.concat(part.allParts());
    });
    return result;
};

SpriteMorph.prototype.allAnchors = function () {
    // includes myself
    var result = [this];
    if (this.anchor !== null) {
        result = result.concat(this.anchor.allAnchors());
    }
    return result;
};

// SpriteMorph highlighting

SpriteMorph.prototype.addHighlight = function (oldHighlight) {
    var isHidden = !this.isVisible,
        highlight;

    if (isHidden) {this.show(); }
    highlight = this.highlight(
        oldHighlight ? oldHighlight.color : this.highlightColor,
        this.highlightBorder
    );
    this.addBack(highlight);
    this.fullChanged();
    if (isHidden) {this.hide(); }
    return highlight;
};

SpriteMorph.prototype.removeHighlight = function () {
    var highlight = this.getHighlight();
    if (highlight !== null) {
        this.fullChanged();
        this.removeChild(highlight);
    }
    return highlight;
};

SpriteMorph.prototype.toggleHighlight = function () {
    if (this.getHighlight()) {
        this.removeHighlight();
    } else {
        this.addHighlight();
    }
};

SpriteMorph.prototype.highlight = function (color, border) {
    var highlight = new SpriteHighlightMorph(),
        fb = this.bounds, // sprites are not nested in a Morphic way
        edge = border,
        ctx;

    highlight.setExtent(fb.extent().add(edge * 2));
    highlight.color = color;
    highlight.image = this.highlightImage(color, border);
    ctx = highlight.image.getContext('2d');
    ctx.drawImage(
        this.highlightImage(new Color(255, 255, 255), 4),
        border - 4,
        border - 4
    );
    ctx.drawImage(
        this.highlightImage(new Color(50, 50, 50), 2),
        border - 2,
        border - 2
    );
    ctx.drawImage(
        this.highlightImage(new Color(255, 255, 255), 1),
        border - 1,
        border - 1
    );
    highlight.setPosition(fb.origin.subtract(new Point(edge, edge)));
    return highlight;
};

SpriteMorph.prototype.highlightImage = function (color, border) {
    var fb, img, hi, ctx, out;
    fb = this.extent();
    img = this.image;

    hi = newCanvas(fb.add(border * 2));
    ctx = hi.getContext('2d');

    ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, border, 0);
    ctx.drawImage(img, border * 2, 0);
    ctx.drawImage(img, border * 2, border);
    ctx.drawImage(img, border * 2, border * 2);
    ctx.drawImage(img, border, border * 2);
    ctx.drawImage(img, 0, border * 2);
    ctx.drawImage(img, 0, border);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(img, border, border);

    out = newCanvas(fb.add(border * 2));
    ctx = out.getContext('2d');
    ctx.drawImage(hi, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color.toString();
    ctx.fillRect(0, 0, out.width, out.height);

    return out;
};

SpriteMorph.prototype.getHighlight = function () {
    var highlights;
    highlights = this.children.slice(0).reverse().filter(
        function (child) {
            return child instanceof SpriteHighlightMorph;
        }
    );
    if (highlights.length !== 0) {
        return highlights[0];
    }
    return null;
};

// SpriteMorph nesting events

SpriteMorph.prototype.mouseEnterDragging = function () {
    var obj;
    if (!this.enableNesting) {return; }
    obj = this.world().hand.children[0];
    if (this.wantsDropOf(obj)) {
        this.addHighlight();
    }
};

SpriteMorph.prototype.mouseLeave = function () {
    if (!this.enableNesting) {return; }
    this.removeHighlight();
};

SpriteMorph.prototype.wantsDropOf = function (morph) {
    // allow myself to be the anchor of another sprite
    // by drag & drop
    return this.enableNesting
        && morph instanceof SpriteIconMorph
        && !contains(morph.object.allParts(), this);
};

SpriteMorph.prototype.reactToDropOf = function (morph, hand) {
    this.removeHighlight();
    this.attachPart(morph.object);
    this.world().add(morph);
    morph.slideBackTo(hand.grabOrigin);
};
