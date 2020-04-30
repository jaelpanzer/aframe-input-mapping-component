// <!-- drop down example -->
{/* <a-entity id="dropdownContainer" position="1 .5 -2">
    <a-gui-flex-container flex-direction="row" justify-content="center" align-items="normal" component-padding="0.1"
        opacity="0" width="2.5" height="0.75" position="0 0.375 0">
        <a-gui-icon-label-button id="mydropdown" width="2.5" height="0.75" onclick="rOptionsUi.openDropDown('mydropdown', 'myoptions')"
            icon="gear-b" value="Options" font-family="Arial" visible="true"
            animation__rotatein="property: rotation; to: 180 0 0; dur: 200; startEvents:opendropdown"
            animation__visiblein="property: visible; to: false; delay: 200; startEvents:opendropdown"
            animation__rotateout="property: rotation; to: 0 0 0; delay: 200; dur: 400; startEvents:closedropdown"
            animation__visibleout="property: visible; to: true; dur: 200; startEvents:closedropdown"
        >

        </a-gui-icon-label-button>
    </a-gui-flex-container>

    <a-gui-flex-container id="myoptions" flex-direction="column" justify-content="center" align-items="normal"
        component-padding="0.1" opacity="0" width="2.5" height="0.75" position="0 0 -0.15"
        scale="1 0.001 0.001" visible="false"
        animation__positionin="property: position; to: 0 0.375 0.15; dur: 100; startEvents:opendropdown"
        animation__scalein="property: scale; to: 1 1 1; dur: 200; delay:200; startEvents:opendropdown"
        animation__visiblein="property: visible; to: true; dur: 200; delay:0; startEvents:opendropdown"
        animation__positionout="property: position; to: 0 0 -0.15; delay:0; dur: 200; startEvents:closedropdown"
        animation__scaleout="property: scale; to: 1 0.001 0.001; delay:0; dur: 200; startEvents:closedropdown"
        animation__visibleout="property: visible; to: false; delay: 200; startEvents:closedropdown"
    >

        <a-gui-toggle width="2.5" height="0.75" onclick="toggleCaps" value="Hotspots" font-family="Arial" >
            <a-box color='red' width="2.5" height="0.75" depth="0.001" position="0 0 -0.1"></a-box>
        </a-gui-toggle>


        <a-gui-button width="2.5" height="0.75" onclick="red" value="Red" font-family="Arial" font-family="Arial" role="button">
        </a-gui-button>

        <a-gui-button width="2.5" height="0.75" onclick="blue" value="Blue" font-family="Arial" role="button">
        </a-gui-button>

        <a-gui-button width="2.5" height="0.75" onclick="green" value="Green" font-family="Arial" role="button">
        </a-gui-button>

        <a-gui-icon-button width="0.5" height="0.5" onclick="rOptionsUi.closeDropDown('mydropdown', 'myoptions')" icon="android-close" role="button">
        </a-gui-icon-button>

    </a-gui-flex-container>
</a-entity> */}


// right hand sample
{
// <!-- outside right watch: position="0.07 0 -0.05" rotation="0 90 180" -->
// <!-- inside along arm: position="0.01 0.05 0.12" rotation="0 -90 45" scale="0.03 0.03 0.03" -->

// <a-gui-flex-container flex-direction="row" justify-content="center" align-items="normal" component-padding="0.1"
//     opacity="1" width="3" height="1" position="0.01 0.05 0.12" rotation="0 -90 45" scale="0.03 0.03 0.03">

//     <a-gui-toggle width="2.5" height="0.75" onclick="toggleHotSpots" value="Hotspots" font-family="Arial">
//         <a-box color='red' width="2.5" height="0.75" depth="0.001" position="0 0 -0.1"></a-box>
//     </a-gui-toggle>
// </a-gui-flex-container>
}


// left hand sample
{/* <a-entity id="dropdownContainer" position="-0.01 0.05 0.12" rotation="0 90 -45" scale="0.03 0.03 0.03" >

<a-gui-flex-container flex-direction="row" justify-content="center" align-items="normal" component-padding="0.1"
    opacity="0" width="2.5" height="0.75" position="0 0.375 0">
    <a-gui-icon-label-button id="mydropdown" width="2.5" height="0.75" onclick="openDropdown" icon="gear-b"
        value="Options" font-family="Arial" visible="true"
        animation__rotatein="property: rotation; to: 180 0 0; dur: 200; startEvents:opendropdown"
        animation__visiblein="property: visible; to: false; delay: 200; startEvents:opendropdown"
        animation__rotateout="property: rotation; to: 0 0 0; delay: 200; dur: 400; startEvents:closedropdown"
        animation__visibleout="property: visible; to: true; dur: 200; startEvents:closedropdown">

    </a-gui-icon-label-button>
</a-gui-flex-container>

<a-gui-flex-container id="myoptions" flex-direction="column" justify-content="center" align-items="normal"
    component-padding="0.1" opacity="0" width="2.5" height="0.75" position="0 0 -0.15" scale="1 0.001 0.001"
    visible="false"
    animation__positionin="property: position; to: 0 0.375 0.15; dur: 100; startEvents:opendropdown"
    animation__scalein="property: scale; to: 1 1 1; dur: 200; delay:200; startEvents:opendropdown"
    animation__visiblein="property: visible; to: true; dur: 200; delay:0; startEvents:opendropdown"
    animation__positionout="property: position; to: 0 0 -0.15; delay:0; dur: 200; startEvents:closedropdown"
    animation__scaleout="property: scale; to: 1 0.001 0.001; delay:0; dur: 200; startEvents:closedropdown"
    animation__visibleout="property: visible; to: false; delay: 200; startEvents:closedropdown">

    <a-gui-toggle width="2.5" height="0.75" onclick="toggleHotSpots" value="Hotspots" font-family="Arial">
        <a-box color='red' width="2.5" height="0.75" depth="0.001" position="0 0 -0.1"></a-box>
    </a-gui-toggle>


    <a-gui-button width="2.5" height="0.75" onclick="red" value="Option 1" font-family="Arial" role="button">
    </a-gui-button>

    <a-gui-button width="2.5" height="0.75" onclick="blue" value="Option 2" font-family="Arial" role="button">
    </a-gui-button>

    <a-gui-button width="2.5" height="0.75" onclick="green" value="Option 3" font-family="Arial" role="button">
    </a-gui-button>

    <a-gui-icon-button width="0.5" height="0.5" onclick="closeDropdown" icon="android-close" role="button">
    </a-gui-icon-button>

</a-gui-flex-container>
</a-entity> */}

let rOptionsUi = (function()
{
    // constants
    let defaultAnimationDuration = 200;
    let defaultWidth = 2.5;
    let defaultHeight = 0.75;
    let defaultFontFamily = "Arial";
    let defaultHandScale = 0.035;
    let defaultBackColor = 'black';
    let defaultBackDepth = 0.007;
    let bgColor = "#FFA500"; // "#ed5b21"
    let activeColor = "#FFA500";
    let textColor = "#2c3037"; // default of aframe-gui is #2c3037
    let closeButtonEventName = "closeclicked";

    // localization
    let dropDownText = "Options";
    let hotspotsText = "Hotspots";
    let toggleHotspotText = "Hide";
    let scaleHotspotText = "Scale";
    let helpText = "Help";
    let toggleHelpText = "Hide";

    let onText = "on";
    let offText = "off";
    
    let _cursorEl;
    let _leftControllerEl;
    let _rightControllerEl;

    let _hotspotsTitleEl;
    let _hotspotToggleEl;
    // let _hotspotToggleLabelEl;
    let _hotspotSliderEl;
    // let _hotspotSliderLabelEl;

    let _helpToggleEl;
    let _helpToggleLabelEl;

    function createBackPanel(width, height, backColor)
    {
        let backEl = document.createElement('a-plane');
        setAttributes(backEl, {
            material: { shader: 'flat' },
            color: backColor,
            width: width,
            height: height,
            position: { x: 0, y: 0, z: -defaultBackDepth },
            rotation: { x: 0, y: 180, z: 0 }
        });
        return backEl
    }

    function closeDropDownInternal(dropdownId, optionsId)
    {
        console.log("closedropdown");
        var dropDownEl = document.getElementById(dropdownId);
        dropDownEl.emit('closedropdown');
        var myoptions = document.getElementById(optionsId);
        myoptions.emit('closedropdown');
    }

    function openDropDownInternal(dropdownId, optionsId)
    {
        console.log("opendropdown");
        var mydropdown = document.getElementById(dropdownId);
        mydropdown.emit('opendropdown');
        var myoptions = document.getElementById(optionsId);
        myoptions.emit('opendropdown');
    }

    function testActionInternal(value)
    {
        let p = value;
        let x = 0;
    }

    function createMainMenu(containerId, dropdownId, optionsId, hotspotScale)
    {
        let rootEl = document.createElement('a-entity');
        setAttributes(rootEl, {
            // scale: {x: defaultHandScale, y: defaultHandScale, z: defaultHandScale},
            // position: {x: 0.01, y: 0.05, z:0.12},
            // rotation: {x: 0, y: -90, z: 45},
            id: containerId
        });

        // let flexContainerEl = rOptionsUi.createDefaultFlexContainer();
        // setAttributes(flexContainerEl, {
        //     'flex-direction': 'column',
        //     width: 3,
        //     height: 1
        // });

        let dropdownEl = rOptionsUi.createDropDownButton(dropdownId, optionsId, dropDownText, 'gear-b');
        let dropdownContainerEl = rOptionsUi.createDropDownFlexContainer();
        dropdownContainerEl.appendChild(dropdownEl);
        rootEl.appendChild(dropdownContainerEl);

        let optionsEl = rOptionsUi.createOptionsFlexContainer(optionsId);
        let hotspotTitleEl;
        let hotspotToggleEl;
        // let hotspotToggleLabelEl;
        let hotspotSliderEl;
        // let hotspotSliderLabelEl;
        let helpTitleEl;
        let helpToggleEl;
        let helpToggleLabelEl;
        {
            let bottomMargin = "0.05";
            let labelHeightScale = 0.65;
            let switchWidth = defaultWidth * 0.4;

            // hotspots

            hotspotTitleEl = rOptionsUi.createLabel(hotspotsText, defaultWidth, defaultHeight * labelHeightScale);
            setAttributes(hotspotTitleEl, {
                "background-color": bgColor,
                margin: "0 0 " + bottomMargin + " 0"
            });
            optionsEl.appendChild(hotspotTitleEl);

            hotspotToggleEl = rOptionsUi.createToggle(toggleHotspotText, '');
            setAttributes(hotspotToggleEl, {
                margin: "0 0 " + bottomMargin + " 0"
            });
            optionsEl.appendChild(hotspotToggleEl);

            // hotspotToggleLabelEl = rOptionsUi.createLabel("(" + offText + ")",switchWidth, defaultHeight);
            // setAttributes(hotspotToggleLabelEl, {
            //     position: {x: defaultWidth/2 + switchWidth/2, y: 0, z:0 },
            //     "background-color": bgColor
            // });            
            // hotspotToggleEl.appendChild(hotspotToggleLabelEl);

            hotspotSliderLabelEl = rOptionsUi.createLabel(scaleHotspotText, defaultWidth, defaultHeight * labelHeightScale);
            optionsEl.appendChild(hotspotSliderLabelEl);

            hotspotSliderEl = rOptionsUi.createSlider("", hotspotScale, defaultWidth, defaultHeight * labelHeightScale);
            setAttributes(hotspotSliderEl, {
                id: 'hotspotScaleSlider',
                margin: "0 0 " + bottomMargin + " 0"
                // onclick: "rOptionsUi.testSlider('" + "myslider" + "')",
                // onclick: "mySliderClickHandler"
            });
            optionsEl.appendChild(hotspotSliderEl);

            // help

            helpTitleEl = rOptionsUi.createLabel(helpText, defaultWidth, defaultHeight * labelHeightScale);
            setAttributes(helpTitleEl, {
                "background-color": bgColor,
                margin: "0 0 " + bottomMargin + " 0"
            });
            optionsEl.appendChild(helpTitleEl);

            helpToggleEl = rOptionsUi.createToggle(toggleHelpText, '');
            setAttributes(helpToggleEl, {
                margin: "0 0 " + bottomMargin + " 0"
            });
            optionsEl.appendChild(helpToggleEl);

            // helpToggleLabelEl = rOptionsUi.createLabel("(" + offText + ")",switchWidth, defaultHeight);
            // setAttributes(helpToggleLabelEl, {
            //     position: {x: defaultWidth/2 + switchWidth/2, y: 0, z:0 },
            //     "background-color": bgColor
            // });            
            // helpToggleEl.appendChild(helpToggleLabelEl);

            // close

            let closeOptionsEl = rOptionsUi.createCloseOptionsButton(dropdownId, optionsId);
            optionsEl.appendChild(closeOptionsEl);
        }
        rootEl.appendChild(optionsEl);

        let menuData = [rootEl, 
            hotspotTitleEl, hotspotToggleEl, hotspotSliderEl, hotspotSliderLabelEl,
            helpTitleEl, helpToggleEl
            // hotspotToggleLabelEl, helpToggleLabelEl
        ];

        return menuData;
    }

    // utils
    function getToggleStateText(isOn)
    {
        let text = "(";
        if (isOn)
        {
            text += onText;
        } else {
            text += offText
        }
        text += ")"; 

        return text;
    }

    function isUndefined(value)
    {
        return rvrUtil.isUndefined(value);
    }

    function isBlank(value)
    {
        return rvrUtil.isBlank(value);
    }

    function setAttributes(el, attributes) {
        rvrUtil.setAttributes(el, attributes);
    }

    return {
        getDefaultWidth() { return defaultWidth; },
        getDefaultHeight() { return defaultHeight; },

        createDefaultFlexContainer: function()
        {
            let el = document.createElement('a-gui-flex-container');
            setAttributes(el,
                {
                    'flex-direction': 'row',
                    'justify-content': 'center',
                    'align-items': 'normal',
                    'component-padding': 0.1,
                    width: defaultWidth,
                    height: defaultHeight,
                });
            return el;
        },
        createDropDownFlexContainer: function() { 
            let el = rOptionsUi.createDefaultFlexContainer();
            setAttributes(el,
                {
                    opacity: 0,
                    position: { x: 0, y: 0.375, z: 0 }
                });
    
            return el;
         },
        createDropDownButton: function(dropdownId, optionsId, text, icon='', width=defaultWidth, height=defaultHeight, hasBack=true, backColor=defaultBackColor) 
        { 
            let el = document.createElement('a-gui-icon-label-button');

            let animationDuration = defaultAnimationDuration;
    
            setAttributes(el,
                {
                    width: width,
                    height: height,
                    "active-color": activeColor,
                    onclick: "rOptionsUi.openDropDown('" + dropdownId + "','" + optionsId + "')",
                    // animation__rotatein:
                    // {
                    //     property: 'rotation',
                    //     to: { x: 180, y: 0, z: 0 },
                    //     dur: animationDuration,
                    //     startEvents: 'opendropdown'
                    // },
                    animation__scalein:
                    {
                        property: 'scale',
                        to: { x: 1, y: 0.001, z: 0.001 },
                        dur: animationDuration,
                        startEvents: 'opendropdown'
                    },
                    animation__visiblein: {
                        property: 'visible',
                        to: false,
                        delay: animationDuration,
                        startEvents: 'opendropdown'  
                    },
                    // animation__rotateout: {
                        
                    //     property: 'rotation',
                    //     to: { x: 0, y: 0, z: 0 },
                    //     delay: animationDuration,
                    //     dur: animationDuration * 2,
                    //     startEvents: 'closedropdown'
                    // },
                    animation__scaleout: {
                        property: 'scale',
                        to: { x: 1, y: 1, z: 1 },
                        delay: animationDuration,
                        dur: animationDuration,
                        startEvents: 'closedropdown'
                    },
                    animation__visibleout: {
                        property: 'visible',
                        to: true,
                        dur: animationDuration,
                        startEvents: 'closedropdown'  
                    },
    
                    id: dropdownId,
                    value: text,
                    icon: icon
                });
    
            if (hasBack) {
                // cover up back geometry noise
                el.appendChild(createBackPanel(width, height, backColor));
    
            }
    
            return el;
        },
        createOptionsFlexContainer: function (optionId) {
            let depthToRecessControl = 0.15;
            let hideScale = { x: 1, y: 0.001, z: 0.001 };
            let animationDuration = defaultAnimationDuration;

            let el = rOptionsUi.createDefaultFlexContainer();
            setAttributes(el, {
                'flex-direction': 'column',
                opacity: 0,
                position: { x: 0, y: 0, z: -depthToRecessControl },
                scale: hideScale,
                visible: false,

                animation__positionin: {
                    property: 'position',
                    to: { x: 0, y: 0.375, z: depthToRecessControl },
                    dur: animationDuration / 2,
                    startEvents: 'opendropdown'
                },
                animation__scalein: {
                    property: 'scale',
                    to: { x: 1, y: 1, z: 1 },
                    dur: animationDuration,
                    delay: animationDuration,
                    startEvents: 'opendropdown'
                },
                animation__visiblein: {
                    property: 'visible',
                    to: true,
                    dur: animationDuration,
                    // delay: 0,
                    startEvents: 'opendropdown'
                },
                animation__positionout: {
                    property: 'position',
                    to: { x: 0, y: 0, z: -depthToRecessControl },
                    dur: animationDuration,
                    // delay: 0,
                    startEvents: 'closedropdown'
                },
                animation__scaleout: {
                    property: 'scale',
                    to: hideScale,
                    // delay: 0,
                    dur: animationDuration,
                    startEvents: 'closedropdown'
                },
                animation__visibleout: {
                    property: 'visible',
                    to: false,
                    delay: animationDuration,
                    startEvents: 'closedropdown'
                },

                id: optionId
            });

            return el;
        },
        createCloseOptionsButton: function (dropdownId, optionsId, size=0.5, hasBack=true, backColor=defaultBackColor) 
        { 
            let el = rOptionsUi.createCloseButton(size, hasBack, backColor);
            setAttributes(el, {
                onclick: "rOptionsUi.closeDropDown('" + dropdownId + "','" + optionsId + "')"
            });
    
            return el;
        },
        getCloseButtonEventName: function()
        {
            return closeButtonEventName;
        },
        createCloseButton: function(size=0.5, hasBack=true, backColor=defaultBackColor)
        {
            let el = document.createElement('a-gui-icon-button');
            setAttributes(el, {
                width: size,
                height: size,
                "active-color": activeColor,
                onclick: "closeButtonClicked",
                icon: 'android-close',
                role: 'button'
            });
    
            if (hasBack)
            {
                // cover up back geometry noise
                let backEl = document.createElement('a-ring');
                setAttributes(backEl, {
                    material: { shader: 'flat' },
                    color: backColor,
                    'radius-inner': 0.001,
                    'radius-outer': size / 2,
                    position: { x: 0, y: 0, z: -defaultBackDepth },
                    rotation: { x: 0, y: 180, z: 0 }
                });
                el.appendChild(backEl);
            }
    
            return el;
        },
        createButton: function(text, action, width=defaultWidth, height=defaultHeight, hasBack=true, backColor=defaultBackColor)
        {
            let el = document.createElement("a-gui-button");
    
            setAttributes(el, {
                width: width,
                height: height,
                // 'font-family': defaultFontFamily,
                role: 'button',
                "active-color": activeColor,
                onclick: action,
                value: text
            });
    
            if (hasBack)
            {
                // cover up back geometry noise
                el.appendChild(createBackPanel(width, height, backColor));
            }
    
            return el;
        },    
        createToggle: function(text, action, width=defaultWidth, height=defaultHeight, hasBack=true, backColor=defaultBackColor)
        {
            let el = document.createElement("a-gui-toggle");
            setAttributes(el, {
                width: width,
                height: height,
                "active-color": activeColor,
                // "checked": true, // 
                // 'font-family': defaultFontFamily,
                onclick: action,
                value: text
            });
    
            if (hasBack)
            {
                el.appendChild(createBackPanel(width, height, backColor));
            }
    
            return el;
        },
    
        createSlider: function(action, initialPercent=0, width=defaultWidth, height=defaultHeight, hasBack=true, backColor=defaultBackColor)
        {
            let el = document.createElement("a-gui-slider");
            setAttributes(el, {
                // value: text,
                width: width,
                height: height,
                "active-color": activeColor,
                // 'font-family': defaultFontFamily,
                percent: initialPercent,
                onclick: action
            });
    
            if (hasBack)
            {
                el.appendChild(createBackPanel(width, height, backColor));
            }
    
            return el;
        },
    
        createLabel: function(text, width=defaultWidth, height=defaultHeight, hasBack=true, backColor=defaultBackColor)
        {
            let el = document.createElement("a-gui-label");
            setAttributes(el, {
                value: text,
                // 'font-family': defaultFontFamily,
                width: width,
                height: height
            });
    
            if (hasBack)
            {
                el.appendChild(createBackPanel(width, height, backColor));
            }
            
            return el;
        },


        findControls: function()
        {
            _cursorEl = document.getElementById(rControllers.getCursorId());
            _leftControllerEl = document.getElementById(rControllers.getLeftHandId());
            _rightControllerEl = document.getElementById(rControllers.getRightHandId());
        },
        openDropDown: function(dropdownId, optionsId)
        {
            openDropDownInternal(dropdownId, optionsId);
        },
        closeDropDown: function(dropdownId, optionsId)
        {
            closeDropDownInternal(dropdownId, optionsId);
        },
        setLeftController: function(leftEl)
        {
            _leftControllerEl = leftEl;
        },
        setRightController: function(rightEl)
        {
            _rightControllerEl = rightEl;
        },
        setCursor: function(cursorEl)
        {
            _cursorEl = cursorEl;
        },
        setupControllerUi: function(hotspotScale=0.5)
        {

            if (!rvrUtil.isUndefined(_rightControllerEl))
            {
                let containerId = 'rightUiContainer'
                let dropdownId = 'rightDropDown';
                let optionsId = 'rightOptions';

                let mainMenuData = createMainMenu(containerId, dropdownId, optionsId, hotspotScale);

                _hotspotsTitleEl = mainMenuData[1];
                _hotspotToggleEl = mainMenuData[2];
                _hotspotSliderEl = mainMenuData[3];
                _hotspotSliderLabelEl = mainMenuData[4];

                // _helpTitleEl = mainMenuData[5];
                _helpToggleEl = mainMenuData[6];
                _helpToggleLabelEl = mainMenuData[7]

                // _hotspotToggleLabelEl = mainMenuData[3];

                let rootEl = mainMenuData[0];
                setAttributes(rootEl, {
                    scale: {x: defaultHandScale, y: defaultHandScale, z: defaultHandScale},
                    position: {x: 0.01, y: 0.05, z:0.12},
                    rotation: {x: 0, y: -90, z: 45},
                    id: containerId
                });                

                _rightControllerEl.appendChild(rootEl);

            }

            if (!rvrUtil.isUndefined(_cursorEl))
            {
                // do something for controller-less setup?
            }
        },
        setToggleHotpotsAction: function(nameOfHandler)
        {
            setAttributes(_hotspotToggleEl, {
                onclick: nameOfHandler
            });
        },
        updateToggleHotspotState: function(isOn)
        {
            if (isUndefined( _hotspotToggleLabelEl))
                return;
            let text = getToggleStateText(isOn);
            setAttributes(_hotspotToggleLabelEl, {
                value: text
            });
        },
        setScaleHotspotsAction: function(nameOfHandler)
        {
            setAttributes(_hotspotSliderEl, {
                onclick: nameOfHandler
            });
        },
        updateScaleHotspotsState(percent)
        {
            let text = scaleHotspotText + " (" + Number(percent).toFixed(2) + ")"; 
            setAttributes(_hotspotSliderLabelEl, {
                value: text
            });
        },

        setToggleHelpAction: function(nameOfHandler)
        {
            setAttributes(_helpToggleEl, {
                onclick: nameOfHandler
            });
        },
        updateToggleHelpState: function(isOn)
        {
            if (isUndefined( _helpToggleLabelEl))
                return;

            let text = getToggleStateText(isOn);
            setAttributes(_helpToggleLabelEl, {
                value: text
            });
        },

        // DEBUG

        // sample to create dropdown
        setupSampleLeftControllerDropdown()
        {
            if (!rvrUtil.isUndefined(_leftControllerEl))
            {
                let containerId = 'leftUiContainer'
                let dropdownId = 'leftDropDown';
                let optionsId = 'leftOptions';

                // localize
                let dropDownText = 'My Drops';
                let option1Text = 'Option 1';
                let option2Text = 'Option 2';
                let option3Text = 'Option 3';

                let rootEl = document.createElement('a-entity');
                setAttributes(rootEl, {
                    scale: { x: defaultHandScale, y: defaultHandScale, z: defaultHandScale },
                    position: { x: -0.01, y: 0.05, z: 0.12 },
                    rotation: { x: 0, y: 90, z: -45 },
                    id: containerId
                });

                let dropdownEl = rOptionsUi.createDropDownButton(dropdownId, optionsId, dropDownText, 'gear-b');

                let dropdownContainerEl = rOptionsUi.createDropDownFlexContainer();
                dropdownContainerEl.appendChild(dropdownEl);
                rootEl.appendChild(dropdownContainerEl);

                let optionsEl = rOptionsUi.createOptionsFlexContainer(optionsId);
                let button1El = rOptionsUi.createButton(option1Text, "rOptionsUi.testAction('red')");
                optionsEl.appendChild(button1El);
                let button2El = rOptionsUi.createButton(option2Text, "rOptionsUi.testAction('blue')");
                optionsEl.appendChild(button2El);
                let button3El = rOptionsUi.createButton(option3Text, "rOptionsUi.testAction('green')");
                optionsEl.appendChild(button3El);
                let closeOptionsEl = rOptionsUi.createCloseOptionsButton(dropdownId, optionsId);
                optionsEl.appendChild(closeOptionsEl);
                rootEl.appendChild(optionsEl);

                _leftControllerEl.appendChild(rootEl);
            }
        },
        setupSampleCursorOptionsDropdown()
        {
            let sceneEl = rvrUtil.getScene();

            let containerId = 'cursorUiContainer'
            let dropdownId = 'cursorDropDown';
            let optionsId = 'cursorOptions';

            let mainMenuData = createMainMenu(containerId, dropdownId, optionsId, 0.7);
            let rootEl = mainMenuData[0];

            this.setToggleHelpAction("toggleHelpClickHandler");

            setAttributes(rootEl,{
                position: {x:0, y:-0.7, z:-2}
            });

            sceneEl.appendChild(rootEl);
        },

        testCreate: function()
        {
            let graphEl = rvrUtil.getGraph();

            let dropdownId = 'testDropdown';
            let optionsId = 'testOptions';

            let scale = 0.7;
            let rootEl = document.createElement('a-entity');
            setAttributes(rootEl, {
                scale: {x: scale, y: scale, z: scale},
                position: {x: 0, y: -1, z: -4},
                id: 'dropDownContainer'
            });

            let dropdownEl = rOptionsUi.createDropDownButton(dropdownId, optionsId, "My Drops", 'gear-b');

            let dropdownContainerEl = rOptionsUi.createDropDownFlexContainer();
            dropdownContainerEl.appendChild(dropdownEl);
            rootEl.appendChild(dropdownContainerEl);

            let optionsEl = rOptionsUi.createOptionsFlexContainer(optionsId);
            let button1El = rOptionsUi.createButton('Red', "rOptionsUi.testAction('red')");
            optionsEl.appendChild(button1El);
            let button2El = rOptionsUi.createButton('Blue', "rOptionsUi.testAction('blue')");
            optionsEl.appendChild(button2El);
            let button3El = rOptionsUi.createButton('Green', "rOptionsUi.testAction('green')");
            optionsEl.appendChild(button3El);
            let closeOptionsEl = rOptionsUi.createCloseOptionsButton(dropdownId, optionsId);
            optionsEl.appendChild(closeOptionsEl);
            rootEl.appendChild(optionsEl);

            graphEl.appendChild(rootEl);
        },
        testOptions: function()
        {
            let sceneEl = rvrUtil.getScene();
            let optionsId = 'myOptions';

            let scale = 0.7;
            let rootEl = document.createElement('a-entity');
            setAttributes(rootEl, {
                scale: {x: scale, y: scale, z: scale},
                position: {x: 0, y: -1, z: -4},
                id: 'optionsContainer'
            });

            let optionsEl = rOptionsUi.createDefaultFlexContainer(optionsId);
            setAttributes(optionsEl, {
                'flex-direction': 'column',
                opacity: 0,
                visible: true
            })
            {
                let bottomMargin = "0.05";
                

                let toggleEl = rOptionsUi.createToggle("Visible", "rOptionsUi.testValue('" + "blah" + "')");
                setAttributes(toggleEl, {
                    margin: "0 0 " + bottomMargin + " 0"
                })
                optionsEl.appendChild(toggleEl);

                let sliderLabelEl = rOptionsUi.createLabel("Scale", defaultWidth, defaultHeight * 0.65);
                optionsEl.appendChild(sliderLabelEl);

                let sliderEl = rOptionsUi.createSlider("", 0.6, defaultWidth, defaultHeight * 0.65);
                setAttributes(sliderEl, {
                    id: 'myslider',
                    margin: "0 0 " + bottomMargin + " 0",
                    // onclick: "rOptionsUi.testSlider('" + "myslider" + "')",
                    onclick: "mySliderClickHandler"
                });
                optionsEl.appendChild(sliderEl);

                // let closeOptionsEl = createCloseOptionsButton(dropdownId, optionsId);
                // optionsEl.appendChild(closeOptionsEl);
            }

            rootEl.appendChild(optionsEl);
            sceneEl.appendChild(rootEl);
        }

        // none of these work within the class unless the function is passing static data "testAction('stringData', 'myName')"

        ,testAction: function(value)
        {
            testActionInternal(value);
        },
        testValue: function(e)
        {
            let x = e;
        },
        testSlider: function(e, data)
        {   
            try {
                let ev = e;
                let d = data;
                let x = 0;
            } catch (ex) {
                let msg = ex;
            }
        }
        
};
})();

function closeButtonClicked(e)
{
    let srcEl = e.srcElement;
    srcEl.emit(rOptionsUi.getCloseButtonEventName());
}

// ** sigh **
// function must be attached as window.*** to get eventarg and percent
function mySliderClickHandler(e, percent)
{
    let x = e;
    let d = percent;
}