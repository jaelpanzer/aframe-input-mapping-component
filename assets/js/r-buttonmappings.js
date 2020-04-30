// BUTTON MAPPINGS
// - https://blog.mozvr.com/input-mapping/
// - uses input-mapping-component
let rButtonMappings = (function () {
    AFRAME.registerComponent('setup-button-mappings',
        {
            schema: {},
            init: function () {
                console.log("setup controls");
                initMappings();
            }
        });

    function initMappings() {
        _buttonsText = rvrUtil.createDebugTextElement();
        _mappingText = rvrUtil.createDebugTextElement();

        let sceneEl = rvrUtil.getScene();

        // To be exposed by the application
        let inputActions = {
            set1: {
                gallerydown: {label: 'gallery down'},
                galleryup: {label: 'gallery up'},

                // axisup: {label: 'axis up'},
                // axisdown: {label: 'axis down'},
                // axisleft: {label: 'axis left'},
                // axisright: {label: 'axis right'},
                // axiscenter: {label: 'axis center'},

                changeTask: { label: 'change scheme' },
                logdefault: { label: 'Test Log' },
                logtask1: { label: 'Test Log Task 1' },
                logtask2: { label: 'Test Log Task 2' },
                lefthand: { label: 'Left hand' },
                righthand: { label: 'Right hand' },
                longpress: { label: 'Long press' },
                doubletouch: { label: 'Double touch' },
                doublepress: { label: 'Double press' }
            },
            set2: {
                changeTask: { label: 'change scheme' },
                logdefault: { label: 'Test Log' },
                logtask1: { label: 'Test Log Task 1' },
                logtask2: { label: 'Test Log Task 2' }
            }
        }

        AFRAME.registerInputActions(inputActions, 'set1');
        // Could be defined by default by the app or the user, custom UI, external request, etc.
        let mappings = {
            behaviours: {
                default: {
                    'vive-controls': {
                        trackpad: 'dpad'
                    }
                }
            },
            mappings: {
                set1: {
                    common: {
                        triggerdown: { left: 'lefthand', right: 'righthand' }
                    },
                    'vive-controls': {
                        'grip.down': 'changeTask',
                        'trackpad.down': 'logtask1',
                        'trackpad.doubletouch': 'doubletouch',
                        'trackpad.doublepress': 'doublepress',
                        // Activators for down, up, touchstart and touchend are optionals you can just write the event without the .
                        'trackpaddpadleftdown': 'dpadleft',
                        'trackpaddpadright.longpress': 'dpadrightlong'
                    },
                    'oculus-touch-controls': {
                        'gripdown' : 'gallerydown',
                        'gripup' : 'galleryup',

                        'abutton.down': 'changeTask',
                        'bbutton.down': 'logdefault'
                    },
                    'windows-motion-controls': {
                        'grip.down': 'changeTask'
                    },
                    keyboard: {
                        't_up': 'logdefault',
                        'c_up': 'changeTask'
                    }
                },
                set2: {
                    'vive-controls': {
                        'trigger.down': 'logtask2',
                        'grip.down': 'changeTask'
                    },
                    'oculus-touch-controls': {
                        'abutton.down': 'changeTask',
                        'bbutton.down': 'logtask1'
                    },
                    'windows-motion-controls': {
                        'trigger.down': 'logtask2',
                        'grip.down': 'changeTask'
                    },
                    keyboard: {
                        'y_up': 'logtask2',
                        'c_up': 'changeTask'
                    }
                }
            }
        };
        AFRAME.registerInputMappings(mappings);

        // DEBUG
        function logButtonEvent(event) {
            let type = event.type;
            let currentMappingActions = AFRAME.inputActions[AFRAME.currentInputMapping];
            let text = currentMappingActions[type] ? currentMappingActions[type].label : type;
            console.log(text);
            rButtonMappings.drawButtonsText(text, true);
        }

        rButtonMappings.drawMappingText('Current mapping: ' + AFRAME.currentInputMapping, false);
        let keys = Object.keys(inputActions);

        sceneEl.addEventListener('changeTask', function (evt) {
            let next = (keys.indexOf(AFRAME.currentInputMapping) + 1) % keys.length;
            AFRAME.currentInputMapping = keys[next];
            rButtonMappings.drawMappingText('Current mapping: ' + AFRAME.currentInputMapping, false);
            logButtonEvent(event);
        });
        let events = [
            // 'axisup','axisdown','axisleft','axisright','axiscenter'
            'gallerydown','galleryup',
            'dpadleft', 'dpadrightlong', 'dpad',
            'logtask1', 'logtask2', 'logdefault',
            'righthand', 'lefthand',
            'doubletouch', 'doublepress', 'longpress'
        ];
        for (let i = 0; i < events.length; i++) {
            sceneEl.addEventListener(events[i], function (event) {
                logButtonEvent(event);
            });
        }
    }

    // constants
    let baseLeftPrefix = "l_";
    let baseRightPrefix = "r_";
    let prefixDefault = "def_";
    let prefixGallery = "gal_";

    // localization
    let triggerClickText = "trigger: click";
    let laserText = "laser pointer";
    let exitText = "exit";
    let switchMediaText =  "left/right: switch photos";
    let closeGalleryText = "close gallery";

    // fields

    let _leftControllerEl = null;
    let _rightControllerEl = null;

    let _rightControllerButtonLocations;
    let _leftControllerButtonLocations;

    let _leftHelpContainerEl = null;
    let _rightHelpContainerEl = null;
    let _leftHelpElements = [];
    let _rightHelpElements = [];

    let axismoveEvent = 'dirmove';
    let buttonEvent = 'buttonchange';

    function analogAxisToDigitalDirection(x, y)
    {
        var centerZone = 0.5;
        if (x * x + y * y < centerZone * centerZone)
        {
            return "center";
        } else {

            let angle = Math.atan2(x, y);
            angle = (angle * THREE.Math.RAD2DEG + 180 + 45) % 360;
            if (angle > 0 && angle < 90) {
              return "up";
            } else if (angle >= 90 && angle < 180) {
              return "left";
            } else if (angle >= 180 && angle < 270) {
              return "down";
            } else {
              return "right";
            }
        }
    }
    function onControllerEvent(eventType, value)
    {
        // let event = new CustomEvent('myEvent',{ detail: "this is my util event"});
        // rvrUtil.getLibElement().dispatchEvent(event);

        let event = new CustomEvent(eventType, { detail: value} );
        rButtonMappings.getLibElement().dispatchEvent(event);
    }
    function onButtonEvent(e, value)
    {
        let id = getIdOfControllerFromEventInternal(e);
        let detailValue = {
            controllerid: id,
            buttonstate: value
        }
        onControllerEvent(buttonEvent, detailValue);
    }
    function addLeftOculusHandlers(controllerEl)
    {
        let ctlL = controllerEl;

        addGeneralOculusHandlers(ctlL);

        // // position of controller.
        // const timerL = setInterval(() => {
        //     let pL = ctlL.object3D.position;
        //     rButtonMappings.getDebugPositionLAText().setAttribute("value", "l-position: " + pL.x.toFixed(2) + ", " + pL.y.toFixed(2) + ", " + pL.z.toFixed(2));
        // }, 100);

        //Y-buttorn Pressed 
        ctlL.addEventListener('ybuttondown', function (event) {
            onButtonEvent(event, 'ybuttondown');
            rButtonMappings.getButtonsText().setAttribute("value", "Left Y-button down");
        });

        //Y-buttorn Released 
        ctlL.addEventListener('ybuttonup', function (event) {
            onButtonEvent(event, 'ybuttonup');
            rButtonMappings.getButtonsText().setAttribute("value", "Left Y-button up");
        });

        //X-buttorn Pressed 
        ctlL.addEventListener('xbuttondown', function (event) {
            onButtonEvent(event, 'xbuttondown');
            rButtonMappings.getButtonsText().setAttribute("value", "Left X-button down");
        });

        //X-buttorn Released 
        ctlL.addEventListener('xbuttonup', function (event) {
            onButtonEvent(event, 'xbuttonup');
            rButtonMappings.getButtonsText().setAttribute("value", "Left X-button up");
        });
    }
    function addRightOculusHandlers(controllerEl)
    {
        let ctlR = controllerEl;

        rButtonMappings.getDebugPositionRAText().setAttribute("value", "add right");

        addGeneralOculusHandlers(ctlR);

        // // position of controller.
        // const timerR = setInterval(() => {
        //     let pR = ctlR.object3D.position;
        //     rButtonMappings.getDebugPositionRAText().setAttribute("value", "r-position: " + pR.x.toFixed(2) + ", " + pR.y.toFixed(2) + ", " + pR.z.toFixed(2));
        // }, 100);

        //A-buttorn Pressed 
        ctlR.addEventListener('abuttondown', function (event) {
            onButtonEvent(event, 'abuttondown');
            rButtonMappings.getButtonsText().setAttribute("value", "Right A-button down");
        });

        //A-buttorn Released 
        ctlR.addEventListener('abuttonup', function (event) {
            onButtonEvent(event, 'abuttonup');
            rButtonMappings.getButtonsText().setAttribute("value", "Right A-button up");
        });

        //B-buttorn Pressed 
        ctlR.addEventListener('bbuttondown', function (event) {
            onButtonEvent(event, 'bbuttondown');
            rButtonMappings.getButtonsText().setAttribute("value", "Right B-button down");
        });

        //B-buttorn Released 
        ctlR.addEventListener('bbuttonup', function (event) {
            onButtonEvent(event, 'bbuttonup');
            rButtonMappings.getButtonsText().setAttribute("value", "Right B-button up");
        });
    }
    function addGeneralOculusHandlers(controllerEl)
    {
        let ctl = controllerEl;

        //Stick Moved
        ctl.addEventListener('axismove', function (event) {

            let name = getIdOfControllerFromEventInternal(event);
            let x = event.detail.axis[0];
            let y = event.detail.axis[1];
            let dir = analogAxisToDigitalDirection(x, y);

            rButtonMappings.getMappingsText().setAttribute("value",  "id:" + name + "|dir:" + dir + "|stick  x:" + event.detail.axis[0].toFixed(2) + ", y:" + event.detail.axis[1].toFixed(2));
            // rButtonMappings.getMappingsText().setAttribute("value", rvrUtil.stringifyEvent(event.detail));

            onControllerEvent(axismoveEvent,{
                            controllerid: name,
                            direction: dir,
                            x: x,
                            y: y
                        });

            // if (name.includes(rControllers.getLeftHandId()))
            // {
            //     if (!isUndefined(_leftController))
            //     {
            //         _leftController.emit('dirmove',{
            //             name: name,
            //             dir: dir,
            //             x: x,
            //             y: y
            //         });
            //     }

            // } else if (name.includes(rControllers.getRightHandId()))
            // {
            //     _rightController.emit('dirmove',{
            //         name: name,
            //         dir: dir,
            //         x: x,
            //         y: y
            //     });
            // }

        });

        //Trigger Touch Started
        ctl.addEventListener('triggertouchstart', function (event) {
            rButtonMappings.getMappingsText().setAttribute("value", "touch started ");
            // rButtonMappings.getMappingsText().setAttribute("value", rvrUtil.stringifyEvent(event));

        });

        //Trigger Touch Ended
        ctl.addEventListener('triggertouchend', function (event) {
            rButtonMappings.getMappingsText().setAttribute("value", "touch ended ");
        });
        
        
        //Trigger Pressed
        ctl.addEventListener('triggerdown', function (event) {
            rButtonMappings.getMappingsText().setAttribute("value", "trigger down");
        });

        //Trigger Released
        ctl.addEventListener('triggerup', function (event) {
            rButtonMappings.getMappingsText().setAttribute("value", "trigger up");
        });

        //Grip Pressed
        ctl.addEventListener('gripdown', function (event) {
            rButtonMappings.getMappingsText().setAttribute("value", "gripdown down");
        });

        //Grip Released
        ctl.addEventListener('gripup', function (event) {
            rButtonMappings.getMappingsText().setAttribute("value", "gripdown up");
        });

    }

    function addRightOculusHelp()
    {
        if (isUndefined(_rightControllerEl) || !isUndefined(_rightHelpContainerEl))
        {
            drawDebugButtonsText('cannot find r-controller');
            return;
        }

        let mappings = rButtonMappings.getRightControllerMappings();
        if (isUndefined(mappings)) 
        {
            drawDebugButtonsText('cannot find r-mappings');
            return;
        }

        _rightHelpContainerEl = document.createElement('a-entity');
        setAttributes(_rightHelpContainerEl, {
            visible: false
        });
        _rightControllerEl.appendChild(_rightHelpContainerEl);

        let helpContainerEl = _rightHelpContainerEl;
        let helpElements = _rightHelpElements;
    
        let defaultIdPrefix = prefixDefault + baseRightPrefix;
        let galleryIdPrefix = prefixGallery + baseRightPrefix;
    
        let bPos = mappings['button1'];
        let trigPos = mappings['trigger'];
        let stickPos = mappings['stick'];
        let homePos = mappings['home'];
        let laserPos = mappings['laser'];

        // default
    
        let trigEl = createHelpCaption(trigPos, {x:.04, y:0.01, z:-0.06}, triggerClickText);
        setAttributes(trigEl, { id: defaultIdPrefix + "click", visible: false })
        helpContainerEl.appendChild(trigEl);
        
        let laserEl = createHelpCaption(laserPos, {x:.03, y:0.02, z:-0.04}, laserText);
        setAttributes(laserEl, { id: defaultIdPrefix + "laser", visible: false })
        helpContainerEl.appendChild(laserEl);

        let homeEl = createHelpCaption(homePos, {x:.02, y:0.05, z:0.04}, exitText);
        setAttributes(homeEl, { id: defaultIdPrefix + "exit", visible: false })
        helpContainerEl.appendChild(homeEl);

        helpElements.push(trigEl);
        helpElements.push(laserEl);
        helpElements.push(homeEl);

        // gallery

        // let bEl = createHelpCaption(bPos, {x:.03, y:0.03, z:-0.065}, closeGalleryText);
        let closeGalEl = createHelpCaption(bPos, { x: .06, y: 0.08, z: 0.04 }, closeGalleryText);
        setAttributes(closeGalEl, { id: galleryIdPrefix + "closegallery", visible: false })
        helpContainerEl.appendChild(closeGalEl);

        // let stickEl = createHelpCaption(stickPos, {x:.03, y:0.01, z:-0.04}, switchMediaText );
        let stickGalEl = createHelpCaption(stickPos, { x: .05, y: 0.08, z: 0.02 }, switchMediaText);
        setAttributes(stickGalEl, { id: galleryIdPrefix + "switchmedia", visible: false })
        helpContainerEl.appendChild(stickGalEl);
        
        helpElements.push(closeGalEl);
        helpElements.push(stickGalEl);
    }
    function addLeftOculusHelp()
    {
        if (isUndefined(_leftControllerEl) || !isUndefined(_leftHelpContainerEl))
            return;

        let mappings = rButtonMappings.getLeftControllerMappings();
        if (isUndefined(mappings))
            return;
        
        _leftHelpContainerEl = document.createElement('a-entity');
        setAttributes(_leftHelpContainerEl, {
            visible: false
        });
        _leftControllerEl.appendChild(_leftHelpContainerEl);


        let defaultIdPrefix = prefixDefault + baseLeftPrefix;
        let galleryIdPrefix = prefixGallery + baseLeftPrefix;

        let helpContainerEl = _leftHelpContainerEl;
        let helpElements = _leftHelpElements;

        let bPos = mappings['button1'];
        let trigPos = mappings['trigger'];
        let stickPos = mappings['stick'];
        let homePos = mappings['home'];
        let laserPos = mappings['laser'];

        // default
    
        let trigEl = createHelpCaption(trigPos, {x:-.04, y:0.01, z:-0.06}, triggerClickText);
        setAttributes(trigEl, { id: defaultIdPrefix + "click", visible: false })
        helpContainerEl.appendChild(trigEl);
        
        let laserEl = createHelpCaption(laserPos, {x:-.03, y:0.02, z:-0.04}, laserText);
        setAttributes(laserEl, { id: defaultIdPrefix + "laser", visible: false })
        helpContainerEl.appendChild(laserEl);

        let homeEl = createHelpCaption(homePos, {x:-.02, y:0.05, z:0.04}, exitText);
        setAttributes(homeEl, { id: defaultIdPrefix + "exit", visible: false })
        helpContainerEl.appendChild(homeEl);

        helpElements.push(trigEl);
        helpElements.push(laserEl);
        helpElements.push(homeEl);

        // gallery

        // let bEl = createHelpCaption(bPos, {x:-.03, y:0.03, z:-0.065}, closeGalleryText);
        let closeGalEl = createHelpCaption(bPos, { x: -.06, y: 0.08, z: 0.04 }, closeGalleryText);
        setAttributes(closeGalEl, { id: galleryIdPrefix + "closegallery", visible: false })
        helpContainerEl.appendChild(closeGalEl);

        // let stickEl = createHelpCaption(stickPos, {x:-.03, y:0.01, z:-0.04}, switchMediaText );
        let stickGalEl = createHelpCaption(stickPos, { x: -.05, y: 0.08, z: 0.02 }, switchMediaText);
        setAttributes(stickGalEl, { id: galleryIdPrefix + "switchmedia", visible: false })
        helpContainerEl.appendChild(stickGalEl);
        
        helpElements.push(closeGalEl);
        helpElements.push(stickGalEl);
    }

    function createHelpCaption(startPos, relEndPos, text) {
        let lineColor = "#3FF";

        let lineEl = document.createElement('a-entity');
        setAttributes(lineEl, {
            position: startPos,
            line: {
                start: { x: 0, y: 0, z: 0 },
                end: relEndPos,
                material: { color: lineColor },
                opacity: 0.5
            }
        });

        let markerSize = 0.0015;
        let buttonPointEl = rvrUtil.createBox(markerSize, markerSize, markerSize);
        setAttributes(buttonPointEl, {
            // position: startPos
            material: { color: lineColor },
            rotation: { x: -90, y: 0, z: 0 }
        });
        lineEl.appendChild(buttonPointEl);

        let textData = Caption.createScaledShortTextData(text, 0.035);
        let textEl = textData[0];
        setAttributes(textEl, {
            align: 'center',
            color: "#FFF",
            rotation: { x: -90, y: 0, z: 0 },
            position: relEndPos
        });
        lineEl.appendChild(textEl);

        return lineEl;
    }

    function getRightOculusQuestButtonPositions()
    {
        if (!isUndefined( _rightControllerButtonLocations))
            return _rightControllerButtonLocations;

        _rightControllerButtonLocations = {
            "button1": { x: -0.003, y: -0.004, z: -0.009 },  // b
            "button2": { x: 0.002, y: 0.0045, z: 0.0025 },   // a
            "home": { x: 0.0095, y: 0.0155, z: 0.0185 },     // home
            "stick": { x: 0.018, y: 0.0025, z: -0.013 },     // analog stick
            "trigger": { x: 0.01, y: -0.035, z: -0.005 },    // gun trigger
            "side": { x: -0.01, y: -0.005, z: 0.035 },        // side thumb button
            "laser": { x: 0.0105, y: -0.05, z: -0.05 }        // laser
        };

        return _rightControllerButtonLocations;
    }
    function getLeftOculusQuestButtonPositions()
    {
        if (!isUndefined(_leftControllerButtonLocations))
            return _leftControllerButtonLocations;

            _leftControllerButtonLocations = {
            "button1": { x: 0.003, y: -0.004, z: -0.009 },  // y
            "button2": { x: -0.002, y: 0.0045, z: 0.0025 }, // x
            "home": { x: -0.0095, y: 0.0155, z: 0.0185 },   // home
            "stick": { x: -0.018, y: 0.0025, z: -0.013 },   // analog stick
            "trigger": { x: -0.01, y: -0.035, z: -0.005 },  // gun trigger
            "side": { x: 0.01, y: -0.005, z: 0.035 },        // side thumb button
            "laser": { x: -0.0105, y: -0.05, z: -0.05 }        // laser
        };

        return _leftControllerButtonLocations;
    }

    // 0:no help | 1:default | 2:gallery
    function setHelpModeInternal(mode=0, helpContainerEl, helpElements)
    {
        if (mode === 0) {
            // no help
            if (!isUndefined(helpContainerEl))
                helpContainerEl.setAttribute('visible', false);
        } else {

            if (mode === 1) {
                // default
                setHelpElementsVisibility(prefixDefault, helpElements, true);
                setHelpElementsVisibility(prefixGallery, helpElements, false);
            } else if (mode === 2) {
                // gallery
                setHelpElementsVisibility(prefixDefault, helpElements, true);
                setHelpElementsVisibility(prefixGallery, helpElements, true);
            }

            if (!isUndefined( helpContainerEl))
                helpContainerEl.setAttribute('visible', true);
        } 
    }

    function setHelpElementsVisibility(prefix, elements, visible)
    {
        if (isUndefined(elements))
            return;

        for(let i=0;i<elements.length;i++)
        {
            let el = elements[i];
            if (el.getAttribute('id').startsWith(prefix))
            {
                el.setAttribute('visible', visible);
            }
        }
    }

    // util

    function getIdOfControllerFromEventInternal(event)
    {
        if (isUndefined(event))
            return "empty event";

        let id = "";
        let src = event["srcElement"];
        if (!isUndefined(src))
        {
            id = "src found";
            // let id = src.getAttribute('id');
            // if (!isUndefine(id))
            // {
            //     name = id;
            // }
            // name = rvrUtil.stringifyEvent(src);
            let test = src["id"];
            if (!isUndefined(test))
                id = test;
        }

        return id;
    }

    function isUndefined(myObject)
    {
        return myObject === undefined || myObject === null;
    }


    let _libEl;

    // DEBUG
    let _timeoutMappingText = null;
    let _timeoutButtonsText = null;
    let _buttonsText;
    let _mappingText;
    let _rightControllerPosText;
    let _leftControllerPosText

    function drawDebugButtonsText(el, timeout, message, isTimeout) {
        let textEl = el;
        if (!textEl)
            return;

        // textEl.setAttribute('text', {value: message});
        textEl.setAttribute('value', message);
        clearTimeout(timeout);

        if (isTimeout) {
            timeout = setTimeout(() => {
                // textEl.setAttribute('text', { value: '' });
                textEl.setAttribute('value', '');
            }, 1000);
        }
    }
    function showRightButtonPositionsDebug(controllerEl)
    {
        // find location of buttons on controller model so can tag with help labels

        let rightEl = controllerEl;
        if (isUndefined(controllerEl)) {
            rightEl = document.getElementById('righthand');
        }

        let rButtonPos = rButtonMappings.getRightControllerMappings();

        let markerSize = 0.001;
        let angle = -125;

        let bEl = createBox(markerSize, markerSize, markerSize);
        setAttributes(bEl, {
            material: { color: "#F33" },
            // position: {x:-0.003, y:-0.004, z:-0.009},
            position: rButtonPos["button1"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "bbutton"
        });
        rightEl.appendChild(bEl);

        let aEl = createBox(markerSize, markerSize, markerSize);
        setAttributes(aEl, {
            material: { color: "#F33" },
            // position: {x:0.002, y:0.0045, z:0.0025},
            position: rButtonPos["button2"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "abutton"
        });
        rightEl.appendChild(aEl);

        let stickEl = createBox(markerSize, markerSize, markerSize);
        setAttributes(stickEl, {
            material: { color: "#F33" },
            // position: {x:0.018, y:0.0025, z:-0.013},
            position: rButtonPos["stick"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rstick"
        });
        rightEl.appendChild(stickEl);

        let homeEl = createBox(markerSize, markerSize, markerSize);
        setAttributes(homeEl, {
            material: { color: "#F33" },
            // position: {x:0.0095, y:0.0155, z:0.0185},
            position: rButtonPos["home"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rhome"
        });
        rightEl.appendChild(homeEl);


        let rtriggerEl = createBox(markerSize, markerSize, markerSize);
        setAttributes(rtriggerEl, {
            material: { color: "#3FF" },
            // position: {x:0.011, y:-0.035, z:-0.005},
            position: rButtonPos["trigger"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rtrigger"
        });
        rightEl.appendChild(rtriggerEl);

        let rmidEl = createBox(markerSize, markerSize, markerSize);
        setAttributes(rmidEl, {
            material: { color: "#FF3" },
            // position: {x:-0.01, y:-0.005, z:0.035},
            position: rButtonPos["side"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rmid"
        });
        rightEl.appendChild(rmidEl);

    }
    function showLeftButtonPositionsDebug(controllerEl)
    {
        // find location of buttons on controller model so can tag with help labels

        let leftEl = controllerEl;
        if (isUndefined(controllerEl)) {
            leftEl = document.getElementById('lefthand');
        }

        let lButtonPos = rButtonMappings.getLeftControllerMappings();

        let markerSize = 0.001;
        let angle = -125;

        let bEl = rvrUtil.createBox(markerSize, markerSize, markerSize);
        setAttributes(bEl, {
            material: { color: "#F33" },
            // position: {x:-0.003, y:-0.004, z:-0.009},
            position: lButtonPos["button1"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "bbutton"
        });
        leftEl.appendChild(bEl);

        let aEl = rvrUtil.createBox(markerSize, markerSize, markerSize);
        setAttributes(aEl, {
            material: { color: "#F33" },
            // position: {x:0.002, y:0.0045, z:0.0025},
            position: lButtonPos["button2"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "abutton"
        });
        leftEl.appendChild(aEl);

        let stickEl = rvrUtil.createBox(markerSize, markerSize, markerSize);
        setAttributes(stickEl, {
            material: { color: "#F33" },
            // position: {x:0.018, y:0.0025, z:-0.013},
            position: lButtonPos["stick"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rstick"
        });
        leftEl.appendChild(stickEl);

        let homeEl = rvrUtil.createBox(markerSize, markerSize, markerSize);
        setAttributes(homeEl, {
            material: { color: "#F33" },
            // position: {x:0.0095, y:0.0155, z:0.0185},
            position: lButtonPos["home"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rhome"
        });
        leftEl.appendChild(homeEl);


        let rtriggerEl = rvrUtil.createBox(markerSize, markerSize, markerSize);
        setAttributes(rtriggerEl, {
            material: { color: "#3FF" },
            // position: {x:0.011, y:-0.035, z:-0.005},
            position: lButtonPos["trigger"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rtrigger"
        });
        leftEl.appendChild(rtriggerEl);

        let rmidEl = rvrUtil.createBox(markerSize, markerSize, markerSize);
        setAttributes(rmidEl, {
            material: { color: "#FF3" },
            // position: {x:-0.01, y:-0.005, z:0.035},
            position: lButtonPos["side"],
            rotation: { x: angle, y: 0, z: 0 },
            id: "rmid"
        });
        leftEl.appendChild(rmidEl);

    }

    function isHelpSupported()
    {
        let type = rControllers.getControllerType();

        return (type === rControllers.getQuestId());
    }

    return {
        getLibElement: function()
        {
            if (isUndefined(_libEl))
            {
                _libEl = document.createElement('a-entity');
            }
            return _libEl;
        },
        setRightController: function(controllerEl)
        {
            if (isUndefined(controllerEl))
            {
                _rightControllerEl = null;
                return;
            }

            _rightControllerEl = controllerEl;

            let type = rControllers.getControllerType();
            if (type === rControllers.getQuestId())
            {
                addRightOculusHandlers(_rightControllerEl);
                addRightOculusHelp();
            }

            // setInputMessage("> att: " + type);

            // let ctype = _rightController.getAttribute("ctype");
            
            // let att = getAllAttributes(_rightController);
            // setInputMessage("> att: " + att);

            // if (!isUndefined(ctype))
            // {
            //     if (ctype.startsWith("oculus"))
            //     {
            //         setInputMessage("> trying to add input");
            //         addRightOculusHandlers(_rightController);
            //     } else {
            //         // cannot find type
            //         setInputMessage("> cannot find type");
            //     }
            // } else {
            //     // unidentified controller
            //     // setInputMessage("> unidentified controller");
            // }

        },
        setLeftController: function(controllerEl)
        {
            if (isUndefined(controllerEl))
            {
                _leftControllerEl = null;
                return;
            }

            _leftControllerEl = controllerEl;

            let type = rControllers.getControllerType();
            if (type === rControllers.getQuestId())
            {
                addLeftOculusHandlers(_leftControllerEl);
                addLeftOculusHelp();
            }

            // let ctype = _leftController.getAttribute("ctype");
            // if (!isUndefined(ctype))
            // {
            //     if (ctype.startsWith("oculus"))
            //     {
            //         addLeftOculusHandlers(_leftController);
            //     } else {
            //         // cannot find type
            //     }
            // } else {
            //     // unidentified controller
            // }

        },
        getRightControllerMappings: function()
        {
            let type = rControllers.getControllerType();
            if (type === rControllers.getQuestId())
            {
                return getRightOculusQuestButtonPositions();
            } 

            return null;
        },
        getLeftControllerMappings: function()
        {
            let type = rControllers.getControllerType();
            if (type === rControllers.getQuestId())
            {
                return getLeftOculusQuestButtonPositions();
            } 

            return null;
        },
        setControllersHelpMode: function (leftMode=0, rightMode=0)
        {
            if (!isHelpSupported())
                return;

            setHelpModeInternal(leftMode, _leftHelpContainerEl,  _leftHelpElements);
            setHelpModeInternal(rightMode, _rightHelpContainerEl, _rightHelpElements);
        },


        // DEBUG

        getMappingsText: function () {
            if (isUndefined(_mappingText)) {
                _mappingText = rvrUtil.createDebugTextElement();
            }
            return _mappingText;
        },
        getButtonsText: function () {
            if (isUndefined(_buttonsText)) {
                _buttonsText = rvrUtil.createDebugTextElement();
            }
            return _buttonsText;
        },
        getDebugPositionRAText: function()
        {
            if (isUndefined(_rightControllerPosText)) {
                _rightControllerPosText = rvrUtil.createDebugTextElement();
            }
            return _rightControllerPosText;
        },
        getDebugPositionLAText: function()
        {
            if (isUndefined(_leftControllerPosText)) {
                _leftControllerPosText = rvrUtil.createDebugTextElement();
            }
            return _leftControllerPosText;
        },
        drawMappingText: function (message, isTimeout) {
            drawDebugButtonsText(rButtonMappings.getMappingsText(), _timeoutMappingText, message, isTimeout);
        },
        drawButtonsText: function(message, isTimeout) {
            drawDebugButtonsText(rButtonMappings.getButtonsText(), _timeoutButtonsText, message, isTimeout);
        },
        showButtonPositionsDebug: function(rightEl, leftEl)
        {
            showRightButtonPositionsDebug(rightEl);
            showLeftButtonPositionsDebug(leftEl);
        },
        // testControllerHelp: function(el)
        // {
        //     _rightControllerEl = el;
        //     addRightOculusHelp();
        // },
        triggerEvent: function () {

            // DEBUG
            // onControllerEvent(axismoveEvent,{
            //     controllerid: "cursor",
            //     direction: "right",
            //     x: 0.1,
            //     y: 0.9
            // });

            onControllerEvent(buttonEvent,{
                controllerid: "cursor",
                buttonstate: "ybuttonup"
            });
        }
    }

})();