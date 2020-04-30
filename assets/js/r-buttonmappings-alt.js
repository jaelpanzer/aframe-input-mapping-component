// 
let rButtonMappingsAlt = (function()
{
    let _txtPositionR;
    let _txtPositionL;
    let _txtInput;

    let _degreesOfFreedom = 0; // 0:gaze | 1:3dof | 2: 6dof
    let _leftController = null;
    let _rightController = null;

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
    
    function addGeneralOculusHandlers(controllerEl)
    {
        let ctl = controllerEl;

        //Stick Moved
        ctl.addEventListener('axismove', function (event) {

            let name = getIdOfControllerFromEventInternal(event);
            
            let x = event.detail.axis[0];
            let y = event.detail.axis[1];
            let dir = analogAxisToDigitalDirection(x, y);

            rButtonMappingsAlt.getDebugInputAText().setAttribute("value",  "id:" + name + "|dir:" + dir + "|stick  x:" + event.detail.axis[0].toFixed(2) + ", y:" + event.detail.axis[1].toFixed(2));
            // rButtonMappingsAlt.getDebugInputAText().setAttribute("value", rvrUtil.stringifyEvent(event.detail));

        });

        //Trigger Touch Started
        ctl.addEventListener('triggertouchstart', function (event) {
            rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "touch started ");
            // rButtonMappingsAlt.getDebugInputAText().setAttribute("value", rvrUtil.stringifyEvent(event));

        });

        //Trigger Touch Ended
        ctl.addEventListener('triggertouchend', function (event) {
            rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "touch ended ");
        });
        
        
        //Trigger Pressed
        ctl.addEventListener('triggerdown', function (event) {
            rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "trigger down");
        });

        //Trigger Released
        ctl.addEventListener('triggerup', function (event) {
            rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "trigger up");
        });

        //Grip Pressed
        ctl.addEventListener('gripdown', function (event) {
            rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "gripdown down");
        });

        //Grip Released
        ctl.addEventListener('gripup', function (event) {
            rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "gripdown up");
        });

    }

    function addLeftOculusHandlers(controllerEl)
    {
        let ctlL = controllerEl;

        addGeneralOculusHandlers(ctlL);

        // // position of controller.
        // const timerL = setInterval(() => {
        //     let pL = ctlL.object3D.position;
        //     rButtonMappingsAlt.getDebugPositionLAText().setAttribute("value", "l-position: " + pL.x.toFixed(2) + ", " + pL.y.toFixed(2) + ", " + pL.z.toFixed(2));
        // }, 100);

        // //Y-buttorn Pressed 
        // ctlL.addEventListener('ybuttondown', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Left Y-button down");
        // });

        // //Y-buttorn Released 
        // ctlL.addEventListener('ybuttonup', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Left Y-button up");
        // });

        // //X-buttorn Pressed 
        // ctlL.addEventListener('xbuttondown', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Left X-button down");
        // });

        // //X-buttorn Released 
        // ctlL.addEventListener('xbuttonup', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Left X-button up");
        // });
    }

    function addRightOculusHandlers(controllerEl)
    {
        rButtonMappingsAlt.getDebugInputAText().setAttribute('value', "hello add");

        let ctlR = controllerEl;

        addGeneralOculusHandlers(ctlR);

        // position of controller.
        const timerR = setInterval(() => {
            let pR = ctlR.object3D.position;
            rButtonMappingsAlt.getDebugPositionRAText().setAttribute("value", "r-position: " + pR.x.toFixed(2) + ", " + pR.y.toFixed(2) + ", " + pR.z.toFixed(2));
        }, 100);

        // //A-buttorn Pressed 
        // ctlR.addEventListener('abuttondown', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Right A-button down");
        // });

        // //A-buttorn Released 
        // ctlR.addEventListener('abuttonup', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Right A-button up");
        // });

        // //B-buttorn Pressed 
        // ctlR.addEventListener('bbuttondown', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Right B-button down");
        // });

        // //B-buttorn Released 
        // ctlR.addEventListener('bbuttonup', function (event) {
        //     rButtonMappingsAlt.getDebugInputAText().setAttribute("value", "Right B-button up");
        // });

    }

    function setInputMessage(message)
    {
        rButtonMappingsAlt.getDebugInputAText().setAttribute('value', message);
    }
    function setPositionMessage(message)
    {
        rButtonMappingsAlt.getDebugInputAText().setAttribute('value', message);
    }

    function getAllAttributes(el)
    {
        let attString = "";
        for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++){
            // arr.push(atts[i].nodeName);
            attString += atts[i].nodeName + " | ";
        }

        return attString;
    }

    function getIdOfControllerFromEventInternal(event)
    {
        if (isUndefined(event))
            return "";

        let id = "";
        let src = event["srcElement"];
        if (!isUndefined(src))
        {
            id = "s";
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

    return {
        getDebugPositionRAText: function()
        {
            if (isUndefined(_txtPositionR))
            {
                _txtPositionR = rvrUtil.createDebugTextElement();
            }
            return _txtPositionR;
        },
        getDebugPositionLAText: function()
        {
            if (isUndefined(_txtPositionL))
            {
                _txtPositionL = rvrUtil.createDebugTextElement();
            }
            return _txtPositionL;
        },
        getDebugInputAText: function()
        {
            if (isUndefined(_txtInput))
            {
                _txtInput = rvrUtil.createDebugTextElement();
            }
            return _txtInput;
        },
        // setDof: function(is6Dof)
        // {
        //     _is6Dof = is6Dof;
        // },
        hasLeftController: function()
        {
            return !isUndefined(_leftController);
        },
        hasRightController: function()
        {
            return !isUndefined(_rightController);
        },
        setRightController: function(controllerEl)
        {
            if (isUndefined(controllerEl))
            {
                _rightController = null;
                return;
            }

            _rightController = controllerEl;
            
            let ctype = _rightController.getAttribute("ctype");
            

            // let att = getAllAttributes(_rightController);
            // setInputMessage("> att: " + att);

            addRightOculusHandlers(_rightController);

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
                _leftController = null;
                return;
            }

            _leftController = controllerEl;

            addLeftOculusHandlers(_leftController);

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
        getIdOfControllerFromEvent: function(event)
        {
            return getIdOfControllerFromEventInternal(event);
        }
    };
})();


