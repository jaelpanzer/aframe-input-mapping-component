let rvrUtil = (function()
{
    // AFRAME.registerComponent('rotation-listener', {
    //     tick() {
    //         const newValue = this.el.getAttribute('rotation');
    //         const stringCoords = AFRAME.utils.coordinates.stringify(newValue);
    //         if (this.lastValue !== stringCoords) {
    //             this.el.emit('rotationChanged', newValue);
    //             this.lastValue = stringCoords;
    //         }
    //     }
    // });

    // AFRAME.registerComponent('position-listener', {
    //     tick() {
    //         const newValue = this.el.getAttribute('position');
    //         const stringCoords = AFRAME.utils.coordinates.stringify(newValue);
    //         if (this.lastValue !== stringCoords) {
    //             this.el.emit('positionChanged', newValue);
    //             this.lastValue = stringCoords;
    //         }
    //     },
    // });
    AFRAME.registerComponent('position-listener', {
        tick: function() {
            // const newValue = this.el.getAttribute('position');
            // const stringCoords = AFRAME.utils.coordinates.stringify(newValue);
            // if (this.lastValue !== stringCoords) {
            //     this.el.emit('positionChanged', newValue);
            //     this.lastValue = stringCoords;
            // }

            var newValue = new THREE.Vector3();
            this.el.object3D.getWorldPosition(newValue);
            var lastValue = "";
            var stringCoords = AFRAME.utils.coordinates.stringify(newValue);
            if (lastValue !== stringCoords) {
                // doesn't fire on HMD
                this.el.emit('positionChanged', newValue);
                lastValue = stringCoords;
            }
        }
    });


    // basically ignoring positional data from headset
    let _cameraEl;
    AFRAME.registerComponent('camlocked',{
        init: function(){
            // var scene = this.el;
        
            // cameraEl.addEventListener('componentchanged', function (evt) {
            //     if (evt.detail.name !== 'position') { return; }
            //     console.log(evt.detail.newData);

            //     var worldPos = new THREE.Vector3();
            //     worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
            //     console.log(worldPos.x);
            //   });



            // camera.addEventListener('componentchanged', function (evt) {
            //   if (evt.detail.name === 'rotation' || evt.detail.name === 'position') {
            //     // Do something.
            //     console.log("head");
            //   }
            // });        
        },
        tick: function()
        {
            if (!_cameraEl)
                return;


            try {

                // DEBUG: alternate way to keep position, but restore rotation
                // - graphEl is child of camera

                // let rotInRad = _cameraEl.object3D.rotation;
                // let rot = _cameraEl.getAttribute('rotation');

                // let euler = new THREE.Euler();
                // let rotInRad = euler.setFromQuaternion(_cameraEl.object3D.quaternion);

                // // let rotInRad = new THREE.Euler();
                // // _cameraEl.object3D.getWorldRotation(rotInRad);

                // rotInRad.reorder("YXZ");

                // let x = THREE.Math.radToDeg(rotInRad.x);
                // let y = THREE.Math.radToDeg(rotInRad.y);
                // let z = THREE.Math.radToDeg(rotInRad.z);

                // let graphEl = rvrUtil.getGraph();
                // rvrUtil.setAttributes(graphEl, {
                //     // rotation: {x:-x, y:-y, z:-z }
                // });


                // just change position of graph to match camera and rotation doesn't have to calculated
                const newValue = new THREE.Vector3();
                newValue.setFromMatrixPosition(_cameraEl.object3D.matrixWorld);

                this.el.object3D.position.set(
                    newValue.x,
                    newValue.y,
                    newValue.z);
            } catch (e)
            {
                console.log(e);
            }

            return;


            var newValue = new THREE.Vector3();
            newValue.setFromMatrixPosition(_cameraEl.object3D.matrixWorld);

            // v1
            // console.log(newValue.x);
            // drawGeneralText("a:" + newValue.x + "\ny:"+newValue.y+"\nz:"+newValue.z);
            // this.el.emit('headChanged', newValue);

            // _cameraEl.emit('headChanged', newValue);

            // v2
            // var lastValue = "";
            // var stringCoords = AFRAME.utils.coordinates.stringify(newValue);
            // if (lastValue !== stringCoords) {
            //     _cameraEl.emit('headChanged', newValue);
            //     lastValue = stringCoords;
            //     drawGeneralText("a:" + newValue.x + "\ny:"+newValue.y+"\nz:"+newValue.z);
            // }

            // v3
            // let graphEl = rvrUtil.getSky();
            // graphEl.object3D.position.set(newValue.x, graphEl.object3D.position.y, newValue.z);
            // let gPos = graphEl.object3D.position;
            // drawGeneralText("x:" + gPos.x + "\ny:"+gPos.y+"\nz:"+gPos.z);

            // let boxEl = document.getElementById("test");
            // let boxPos = new THREE.Vector3(0,-2,-5);
            // boxPos.add(newValue);

            // boxEl.object3D.position.set(boxPos.x, boxPos.y, boxPos.z);


            // var offset = new THREE.Vector3();
            // offset.x = this.el.getAttribute("myx");
            // offset.y = this.el.getAttribute("myy");
            // offset.z = this.el.getAttribute("myz");

            // if (!offset.x)
            //     return;

    
            var offsetx= Number(this.el.getAttribute("myx"));
            var offsety=0;
            var offsetz=0;
            if (offsetx !== null || offsetx !== undefined)
            {
                offsety = Number(this.el.getAttribute("myy"));
                offsetz = Number(this.el.getAttribute("myz"));
            }

            // this.el.object3D.position.set(
            //     newValue.x + offsetx,
            //     newValue.y + offsety,
            //     newValue.z + offsetz);

            this.el.object3D.position.set(
                newValue.x + offsetx,
                offsety,
                newValue.z + offsetz);
        }
    });

    function fireMyEvent()
    {
        let event = new CustomEvent('myEvent',{ detail: "this is my util event"});
        rvrUtil.getLibElement().dispatchEvent(event);
    }


    function isUndefinedInternal(value)
    {
        if (value === undefined || value === null)
        {
            return true;
        }

        if (/^ *$/.test(value)) {
            //string contains 0+ spaces only
            return true;
        }

        return false;
    }

    // function stringifyEventInternal(e) {
    //     const obj = {};
    //     for (let k in e) {
    //         obj[k] = e[k];
    //     }
    //     return JSON.stringify(obj, (k, v) => {
    //         if (v instanceof Node) return 'Node';
    //         if (v instanceof Window) return 'Window';
    //         return v;
    //     }, ' ');
    // }

    // function stringify_object(object, depth=0, max_depth=2) {
    //     // change max_depth to see more levels, for a touch event, 2 is good
    //     if (depth > max_depth)
    //         return 'Object';
    
    //     const obj = {};
    //     for (let key in object) {
    //         let value = object[key];
    //         if (value instanceof Node)
    //             // specify which properties you want to see from the node
    //             value = {id: value.id};
    //         else if (value instanceof Window)
    //             value = 'Window';
    //         else if (value instanceof Object)
    //             value = stringify_object(value, depth+1, max_depth);
    
    //         obj[key] = value;
    //     }
    
    //     return depth? obj: JSON.stringify(obj);
    // }

    function stringifySimple(object)
    {
        if (isUndefinedInternal(object) || object.length === 0) {
            return "";
        }


        let rc = "";
        for (let key in object) {
            let value = object[key];

            rc  += "" + key + ":" + value + "|"

            if (rc.length > 19500)
            {
                return rc + "...";
            }
            
        }

        return rc;
    }

    function stringifyThing(object)
    {
        let result = stringifyThingRecurse("", 0, object);        
        return result;
    }

    function stringifyThingRecurse(str, depth, object, recurse=true)
    {
        if (isUndefinedInternal(object) || object.length === 0) {
            return "";
        }


        let finalResult = "";
        const obj = {};
        for (let key in object) {
            let value = object[key];

            let result = "";
            for (let i=0; i<depth; i++)
            {
                result += ">"
            }
            result += key + ":" + value + "\n";

            if (value instanceof Node){
                // specify which properties you want to see from the node
                let n = {id: value.id};
                if (recurse)
                {
                    let c = stringifyThingRecurse(result, depth+1, value, false);
                    result += c;
                }
            } else if (value instanceof Window){
                result += 'Window\n';
            }
            else if (value instanceof Object){
                let c = stringifyThingRecurse(result, depth+1, value, recurse);
                result += c;
            }
    
            util.
            obj[key] = value;

            finalResult += result;
        }

        return str + finalResult;

    }

    // const getCircularReplacer = () => {
    //     const seen = new WeakSet();
    //     return (key, value) => {
    //       if (typeof value === "object" && value !== null) {
    //         if (seen.has(value)) {
    //           return;
    //         }
    //         seen.add(value);
    //       }
    //       return value;
    //     };
    //   };
      
    // //   JSON.stringify(circularReference, getCircularReplacer());
    // function stringThing(object)
    // {
    //     return JSON.stringify(object, getCircularReplacer());
    // }

    // function stringifyOnce(obj, replacer, indent){
    //     var printedObjects = [];
    //     var printedObjectKeys = [];
    
    //     function printOnceReplacer(key, value){
    //         if ( printedObjects.length > 2000){ // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
    //         return 'object too long';
    //         }
    //         var printedObjIndex = false;
    //         printedObjects.forEach(function(obj, index){
    //             if(obj===value){
    //                 printedObjIndex = index;
    //             }
    //         });
    
    //         if ( key == ''){ //root element
    //              printedObjects.push(obj);
    //             printedObjectKeys.push("root");
    //              return value;
    //         }
    
    //         else if(printedObjIndex+"" != "false" && typeof(value)=="object"){
    //             if ( printedObjectKeys[printedObjIndex] == "root"){
    //                 return "(pointer to root)";
    //             }else{
    //                 return "(see " + ((!!value && !!value.constructor) ? value.constructor.name.toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
    //             }
    //         }else{
    
    //             var qualifiedKey = key || "(empty key)";
    //             printedObjects.push(value);
    //             printedObjectKeys.push(qualifiedKey);
    //             if(replacer){
    //                 return replacer(key, value);
    //             }else{
    //                 return value;
    //             }
    //         }
    //     }
    //     return JSON.stringify(obj, printOnceReplacer, indent);
    // };

    function scaleRectToFitInternal(dstRect, srcRect) {

        // x, y, width, height array
        let srcWid = srcRect[2];
        let srcHgt = srcRect[3];
        let dstWid = dstRect[2];
        let dstHgt = dstRect[3];

        let srcAspect = srcWid / srcHgt;
        let dstAspect = dstWid / dstHgt;

        let keepWidth = srcAspect > dstAspect;

        let resizedRect = scaleRectInternal(dstRect, srcRect, keepWidth, !keepWidth);

        return resizedRect;
    }
    function scaleRectInternal(dstRect, srcRect, keepWidth, keepHeight) {

        // x, y, width, height array
        let srcWid = srcRect[2];
        let srcHgt = srcRect[3];
        let dstWid = dstRect[2];
        let dstHgt = dstRect[3];

        let srcAspect = srcWid / srcHgt;
        let dstAspect = dstWid / dstHgt;

        let resizedRect = [0,0,0,0];

        if (srcAspect > dstAspect)
        {
            // wider than high keep the width and scale the height
            resizedRect[2] = dstWid;
            resizedRect[3] = dstWid / srcAspect;

            if (keepHeight)
            {
                let resizePerc = dstHgt / resizedRect[3];
                resizedRect[2] = dstWid * resizePerc;
                resizedRect[3] = dstHgt;
            }

            // centering /src/ within /dest/ rect
            resizedRect[0] = 0;
            resizedRect[1] = (dstHgt - resizedRect[3] / 2);

        } else {

            // higher than wide – keep the height and scale the width
            resizedRect[3] = dstHgt;
            resizedRect[2] = dstHgt * srcAspect;

            if (keepWidth)
            {
                let resizedPerc = dstWid / resizedRect[2];
                resizedRect[2] = dstWid;
                resizedRect[3] = dstHgt * resizedPerc;
            }

            resizedRect[0] = (dstWid - resizedRect[2]) / 2;
            resizedRect[1] = 0;
        }

        return resizedRect;
    }

    function getAssetDataFromAssetGroupsJsonUsingIdInternal(assetsJson, id)
    {
        let rcAssetData = [];
        if (isUndefinedInternal(assetsJson) || isUndefinedInternal(id))
            return;

        try {
            for (let i = 0; i < assetsJson.length; i++) {
                let assetGroup = assetsJson[i];
                let assets = assetGroup["assets"];

                let foundAsset = undefined;
                for (let j = 0; j < assets.length; j++) {
                    let asset = assets[j];

                    if (asset["id"] === id)
                    {
                        foundAsset = asset;
                        break;
                    }
                }

                if (!isUndefinedInternal(foundAsset))
                {
                    let type = foundAsset["type"];

                    let paths = assetGroup["paths"];

                    let relPath = paths[type];

                    rcAssetData = [relPath, foundAsset];
                    break;
                }

            }
        } catch (e) {
            console.log(e.message);
        }
        return rcAssetData;
    }

    function getQueryParameterByNameInternal(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function isUserDataInternal(relativeUrl)
    {
        return relativeUrl.startsWith("userdata/") || relativeUrl.startsWith("userdata\\");
    }
    
    function transformUrlInternal(relativeUrl)
    {
        if (!this.isUserData(relativeUrl))
            return relativeUrl;
    
        var rootUrl = getQueryParameterByName("scene"); // todo: cache this
        if (!rootUrl)
        {
            // alert("No scene specified");

            // localhost or not trimble cloud
            return relativeUrl;
        }
    
        return rootUrl.replace("scene.json", relativeUrl.substring("userdata\\".length));
    }


    let _libEl;
    let _graph;
    let _sky;
    let _scene;
    return {
        getQueryParameterByName: function(name, url)
        {
            return getQueryParameterByNameInternal(name,url);
        },
        isUserData: function(relativeUrl)
        {
            return isUserDataInternal(relativeUrl);
        },
        transformUrl: function(relativeUrl)
        {
            return transformUrlInternal(relativeUrl);
        },
        getLibElement: function () {
            if (isUndefinedInternal(_libEl)) {
                _libEl = document.createElement('a-entity');
            }
            return _libEl;
        },
        getSky: function () {
            if (isUndefinedInternal(_sky))
                _sky = document.querySelector("a-sky");

            return _sky;
        },
        getScene: function () {
            if (isUndefinedInternal(_scene))
                _scene = document.querySelector("a-scene")
            return _scene;
        },
        getGraph: function () {
            if (isUndefinedInternal(_graph))
                _graph = document.getElementById("graph")

            return _graph;
        },
        setCameraLock: function (cameraEl) {
            _cameraEl = cameraEl;
        },
        setAttributes: function(el, attributes) {
            Object.keys(attributes).forEach(key => el.setAttribute(key, attributes[key]));
        },
        getAssetDataFromAssetGroupsJsonUsingId: function(assetsGroupsJson, id)
        {
            let result = getAssetDataFromAssetGroupsJsonUsingIdInternal(assetsGroupsJson, id);
            return result;

        },
        getImageDimensionsFromMeta(meta)
        {
            let imageWidthHeight = [1, 1];
            try {
                let imageWid = rvrUtil.getValueFromMeta(meta, "w");
                let imageHgt = rvrUtil.getValueFromMeta(meta, "h");
    
                if (!(this.isUndefined(imageWid) || this.isUndefined(imageHgt)))
                {
                    imageWidthHeight[0] = Math.abs(Number(imageWid));
                    imageWidthHeight[1] = Math.abs(Number(imageHgt));
                }
    
            } catch (ex)
            {
                console.log(ex);
            }
    
            return imageWidthHeight;
        },
        getValueFromMeta: function(meta, id)
        {
            let result = undefined;

            let metaPairs = meta.split("|");

            for (let i=0; i<metaPairs.length; i++)
            {
                let pair = metaPairs[i].split(":");

                if (pair.length > 1 && pair[0] === id)
                {
                    result = pair[1];
                    break;
                }
            }

            return result;
        },
        stringifyEvent: function (obj) {
            //   return stringifyEventInternal(event);
            // return stringify_object(obj, 1);
            // return stringifyThing(obj);
            // let rc = stringThing(obj);

            // let rc = stringifyOnce(obj, null, ">");

            let rc = stringifySimple(obj);
            // let rc = stringifyThing(obj);
            return rc;
        },
        scaleRectToFit: function (xyWidHgtArrSource, xyWidHgtArrDest) {
            return scaleRectToFitInternal(xyWidHgtArrDest, xyWidHgtArrSource);
        },
        scaleRect: function (xyWidHgtArrSource, xyWidHgtArrDest, keepWidth, keepHeight) {
            return scaleRectInternal(xyWidHgtArrDest, xyWidHgtArrSource, keepWidth, keepHeight);
        },
        isUndefined: function (myObject) {
            return isUndefinedInternal(myObject);
        },
        createDefaultTextElement: function()
        {
            let textEl = document.createElement("a-text");
    
            // // DEBUG
            // textEl.setAttribute("geometry", {
            //     primitive: "plane",
            //     width: 1,
            //     height: "auto"
            // });
            // textEl.setAttribute("material", {
            //     shader: "flat",
            //     color: "blue",
            //     opacity: 0.5
            // });
    
            rvrUtil.setAttributes(textEl, {
                align: "left",
                // font: "assets/fonts/roboto/Roboto-msdf.json",
                // font: "assets/fonts/avrile-sans/AvrileSans-Regular-msdf.json",
                font: "assets/fonts/_generated/Roboto-Regular-msdf.json",
                shader: "msdf",
                negate: "false"
            });

            return textEl;
        },
        createDropShadowPanel: function(width=1, height=1)
        {
            let bgEl = rvrUtil.createPanel(width, height);
            bgEl.setAttribute('material',{
                transparent:true,
                opacity: 0.3,
                color:"#111"
            });
            return bgEl;
        },
        createPanel: function(width=1, height=1) {
            let p = document.createElement('a-entity');
            // p.setAttribute('geometry',
            //     {
            //         primitive: 'box',
            //         height: .3,
            //         width: .3,
            //         depth: 0
            //     });
            p.setAttribute('geometry',
                {
                    primitive: 'plane',
                    height: height,
                    width: width
                });
            p.setAttribute('material',
                {
                    shader: 'flat',
                    // transparent: true,
                    color: "#FFF"
                    // opacity: 1
                });
    
            return p;
        },
        updatePanel: function(el, width, height)
        {
            el.setAttribute('geometry', {
                width: width,
                height: height
            });
    
            return el;
        },
        createBox: function(height=0.3, width=0.3, depth=0.3) {
            let el = document.createElement('a-box');
            el.setAttribute('geometry',
                {
                    primitive: 'box',
                    height: height,
                    width: width,
                    depth: depth
                });
            el.setAttribute('material',
                {
                    shader: 'flat',
                    color: 'red'
                });
        
            // el.setAttribute('class', 'myBox');
        
            return el;
        },        
        getNumberOfLines: function (value, wrapCount) {
            // not accurate due to a-frame's own wrapCount miscounting 
            let totalLines = 0;
            let paragraphs = value.split("\n");

            //// remove leading and trailing lines
            // let numTrailingLinesToRemove = 0;
            // for (let k=paragraphs.length-1; k>=0; k--)
            // {
            //     if (!CaptionBox.isBlank(paragraphs[k]))
            //         break;
            //     numTrailingLinesToRemove++;
            // }
            // if (numTrailingLinesToRemove > 0)
            //     paragraphs = paragraphs.slice(0,paragraphs.length-numTrailingLinesToRemove);

            for (let i = 0; i < paragraphs.length; i++) {
                if (i == paragraphs.length - 1 && rvrUtil.isBlank(paragraphs[i]))
                    break;

                totalLines += 1;
                let words = paragraphs[i].split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
                let currLength = 0;
                for (let j = 0; j < words.length; j++) {
                    let wordLength = words[j].length;

                    if (currLength === 0 && wordLength > wrapCount) {
                        let lines = Number((wordLength / wrapCount).toFixed(0));
                        totalLines += lines;
                        wordLength = wordLength % wrapCount;
                    }

                    if (currLength + wordLength < wrapCount) {
                        currLength += wordLength;
                        continue;
                    } else {

                        totalLines += 1;
                        currLength = wordLength;
                    }

                }
            }

            return totalLines;
        },
        setCloseButtonPosition: function(closeButtonEl, closeAnchorEl, closeButtonWidthHeight, parentWidth, parentHeight)
        {
            rvrUtil.setAttributes(closeButtonEl, {
                position: {x:-closeButtonWidthHeight/2,y:-closeButtonWidthHeight/2,z:0}
            });
            rvrUtil.setAttributes(closeAnchorEl,{
                // rotation: {x:-30, y:0, z: 0},
                position: {x:-(parentWidth / 2), y:(parentHeight/2), z:0}                
            });
        },
        isBlank: function(str) {
            return (!str || /^\s*$/.test(str));
        },
        createDebugTextElement: function () {
            let txt = document.createElement('a-text');
            txt.setAttribute('align', 'left');
            txt.setAttribute('width', 3);
            return txt;
        },
        triggerEvent: function () {
            fireMyEvent();
        }
    };
})();

