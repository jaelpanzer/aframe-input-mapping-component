
// CONSTANTS
let hotspotDistanceFromCamera = 8.2;
let dialogDistanceFromCamera = 7;
let depthOffset = 0.01; 

// settings
let _initialHotspotScale = 0.5; // from 0 to 1

// debug settings
let _isDebug = false;
let _forceCaptionDialogDebug = false;

// localization
let strLookAtRightHand = "look at your right hand controller";
let strLookAtLeftHand = "look at your left hand controller";

// id constants
let idKey = "id";
let nameKey = "name";
let typeKey = "type";
let shortDescKey = "shortdesc";
let longDescKey = "longdesc";
let assetsKey = "assets";
let thumbsourceKey = "thumbsource";
let panosourceKey = "panosource";
let stationsKey = "stations";
let markersKey = "markers";
let hotspotsKey = "hotspots";
let pathsKey = "paths";
let cacheKey = "cache";

let audioKey = "audio";
let imageKey = "image";
let sourceKey = "source";

let spotIdKey = "spotid";

let hotspotClass = "hotspot";
let captionClass = "caption";
let slideClass = "slideshow";
let controlClass = "control";
let disabledControlClass = "disabled";

// hotspots
let _camSpotColor = "white";

// assets
let clickSoundName = "click-sound";
let locationPin1ImageName = "location-pin1";
let locationPin2ImageName = "location-pin2";
let imagePinImageName = "image-pin";
let commentPinImageName = "comment-pin";


// fields
let _generalAssets = {}; // name, assetIdName

let _sceneData;
let _assetGroups;
let _controllersConnectedCount = 0;

let _fadeAniTime = 600;
let _currHotspotScale = 1;

// interactive gui
let _hotspotsVisible = true;
let _hotspotsScale = 1;
let _activeHotspots = [];
let _activeGalleries = [];
let _activeCaptionBoxes = {}; // sourceElementId, captionBox

// hud
let _toastTimeout = null;
let _toastTextEl = null;
let _toastTextBgEl = null;
let _sceneTextEl = null;
let _sceneTextBgEl = null;
let _helpVisible = true;
function getQueryParameterByName(name, url) { return rvrUtil.getQueryParameterByName(name, url); }
function isUserData(relativeUrl) {return rvrUtil.isUserData(relativeUrl); }
function transformUrl(relativeUrl) { return rvrUtil.transformUrl(relativeUrl); }

function getAssetGroups()
{
    if (isUndefined(_assetGroups))
        _assetGroups = _sceneData["assetgroups"];
    return _assetGroups;
}
function loadAssets() {

    let assetGroups = getAssetGroups();

    for (let i = 0; i < assetGroups.length; i++) {
        loadAssetSet(assetGroups[i]);
    }
};

function loadAssetSet(assetGroup) {

    if (!assetGroup[cacheKey])
        return;

    let assetsEl = document.querySelector('a-assets');

    let groupName = assetGroup[nameKey];
    let isCache = assetGroup[cacheKey];
    let paths = assetGroup[pathsKey];
    let assets = assetGroup["assets"];

    let isGeneralAssetGroup = groupName.toLowerCase() === "general-assets";

    for (let i = 0; i < assets.length; i++) {

        let asset = assets[i];
        let id = asset[idKey];
        let assetName = asset[nameKey];
        let type = asset[typeKey];

        if (type === imageKey) {

            let el = document.createElement("img");
            setAttributes(el,
                {
                    id: id,
                    name: assetName,
                    crossOrigin: isUserData(paths[imageKey] + asset[sourceKey]) ? "anonymous" : undefined,
                    src: transformUrl(paths[imageKey] + asset[sourceKey])
                });


            assetsEl.appendChild(el);
        } else if (type === audioKey) {

            let el = document.createElement("audio");
            setAttributes(el,
                {
                    id: id,
                    name: assetName,
                    crossOrigin: isUserData(paths[audioKey] + asset[sourceKey]) ? "anonymous" : undefined, // JSMITH - unsure if this is necessary
                    src: transformUrl(paths[audioKey] + asset[sourceKey])
                });

            assetsEl.appendChild(el);
        }

        if (isGeneralAssetGroup)
            _generalAssets[assetName] = id;
    }

}

function loadScene(sceneId) {
    console.log("loadScene: ", sceneId);

    let camData = getStation(sceneId);

    // just keep the same scene if can't change scene
    if (camData === undefined)
        return;


    let camId = camData["id"];
    let camName = camData[nameKey];
    let camSrc = camData[panosourceKey];
    let hotspots = camData[hotspotsKey];

    updateSceneLabel(camName);    

    for (let j = 0; j < hotspots.length; j++) {

        let hotspotData = hotspots[j];
        let type = hotspotData[typeKey];
        if (type=="camera"){
            loadCameraHotspot(camData, hotspotData);
        }
        else if (type =="evidence" || type=="note") {
            loadMarkerHotspot(camData, hotspotData);
        }
    }

    updateHelpState();
};

function getAssetSource(assetid)
{
    let src = "#" + assetid;
    let cachedAsset = document.getElementById(assetid);
    if (isUndefined(cachedAsset))
    {
        // directly link to source
        if (!isUndefined( _assetGroups))
        {
            let type = undefined;
            let source = undefined;
            let path = undefined;
            for(let i =_assetGroups.length-1; i>=0; i--)
            {
                let group = _assetGroups[i];
                let assets = group['assets'];
                for(let j=0; j< assets.length; j++)
                {
                    let a = assets[j];
                    if (a[idKey] === assetid)
                    {
                        type = a[typeKey];
                        source = a[sourceKey];           
                        break;
                    }
                }

                if (!isUndefined(source))
                {
                    let paths = group[pathsKey];
                    path = paths[type];
                    src = transformUrl(path + source);
                    break;
                }

            }
        }
    }
    return src;
}

function createHotspotPlane(hotspotData, spotWid, spotHgt, spotColor, sourceThumbId=undefined, backColor='#555')
{
    let hotspotEl = createPanel(spotWid, spotHgt);
    
    if (!isUndefined(sourceThumbId))
    {
        let source = getAssetSource(sourceThumbId);
        hotspotEl.setAttribute('material',
        {
            src: source
        });
    }

    let hasDropShadow = true;
    if (hasDropShadow)
    {
        let bgEl = createDropShadowPanel(spotHgt * 1.2, spotHgt * 1.2);
        setAttributes(bgEl,{
            material: { opacity:1, color: backColor },
            position: { x: 0, y: 0, z: -depthOffset }
        });
        hotspotEl.appendChild(bgEl);
    }

    let srcPos = extractPosFromHotspotData(hotspotData);
    let camPos = getCamPos();
    let forward = getForwardVector(camPos, srcPos);

    let pos = forward.clone();
    pos.multiplyScalar(hotspotDistanceFromCamera);

    setPositionInScene(hotspotEl, pos.x, pos.y, pos.z);

    setLookAt(hotspotEl, pos , getCamPos());

    // events
    let hoverPos = forward.clone();
    hoverPos.multiplyScalar(hotspotDistanceFromCamera * .7);

    // hotspotEl.setAttribute('event-set__mouseenter',
    //     {
    //         // scale: { x: 1.3, y: 1.3, z: 1 }
    //         // position: { x: Number(hoverPos.x), y: Number(hoverPos.y), z: Number(hoverPos.z) }
    //         // position: { x: -2, y: 0, z: -4 }
    //     });
    // hotspotEl.setAttribute('event-set__mouseleave',
    //     {
    //         // scale: { x: 1, y: 1, z: 1 }
    //         // position: { x: Number(pos.x), y: Number(pos.y), z: Number(pos.z) }
    //         // position: { x: 2, y: 0, z: -4 }
    //     });


    let popoutTime = 80;
    setAttributes(hotspotEl, {
        material: {
            // shader: 'flat',
            transparent: false,
            // src: "#" + thumb,
            // color: "white"
            color: spotColor
            // color: "#F00"
        }
        ,animation__positionin:
        // ,'event-set__mouseenter':
        {
            startEvents: 'popforward',
            // startEvents: 'mouseenter',

            // property: 'scale',
            // to: { x: 1.5, y: 1.5, z: 1.5 },

            property: 'position',
            to: { x: hoverPos.x, y: hoverPos.y, z: hoverPos.z },
            // from: { x: pos.x, y: pos.y, z: pos.z },

            dur: popoutTime
        }
        ,animation__positionout:
        // ,'event-set__mouseleave':
        {
            startEvents: 'popback',
            // startEvents: 'mouseleave',

            // property: 'scale',
            // to: { x: 1, y: 1, z: 1 },
            
            property: 'position',
            to: { x: pos.x, y: pos.y, z: pos.z },
            // from: { x: hoverPos.x, y: hoverPos.y, z: hoverPos.z },

            dur: popoutTime
        },
        animation__scalein:
        {
            startEvents: 'popforward',
            property: 'scale',
            // to: { x: 1, y: 1, z: 1 },
            dur: popoutTime
        },
        animation__scaleout:
        {
            startEvents: 'popback',
            property: 'scale',
            // to: { x: 1, y: 1, z: 1 },
            dur: popoutTime
        }
    });

    setHotspotScale(hotspotEl, _currHotspotScale);

    return hotspotEl;
}

function createHotspotCaption(captionText, captionColor)
{
    let captionData = Caption.createScaledTextData(captionText, 1.5);

    let captionEl = captionData[0];
    let width = captionData[1];
    let height = captionData[2];
    let yOffset = captionData[3];

    setAttributes(captionEl, {
        class: captionClass,
        color: captionColor,
        align: "center"
    });

    let bgEl = createDropShadowPanel(width*1.1, height*1.1);
    setPosition(bgEl, 0, yOffset, -depthOffset);
    captionEl.appendChild(bgEl);

    return captionEl;
}

function extractPosFromHotspotData(hotspotData)
{
    // XYZ space is different in AFRAME space, so need to translate
    let spotPosX = hotspotData["posx"];
    let spotPosZ = -hotspotData["posy"];
    let spotPosY = hotspotData["posz"];

    let pos = new THREE.Vector3();
    pos.x = Number(spotPosX);
    pos.y = Number(spotPosY);
    pos.z = Number(spotPosZ);

    return pos;
}

function addTextSlideOutToHotspot(hotspotEl, spotWid, spotHgt, text, textColor)
{
    let anchorId = "anchor";    

    hotspotEl.addEventListener('mouseenter', function(evt)
    {
        let srcEl = evt.srcElement;
        let anchorEl = srcEl.querySelector('#' + anchorId);
        anchorEl.emit('showdesc');

        srcEl.emit('popforward');

    });
    hotspotEl.addEventListener('mouseleave', function(evt)
    {
        let srcEl = evt.srcElement;
        let anchorEl = srcEl.querySelector('#' + anchorId);
        anchorEl.emit('hidedesc');

        srcEl.emit('popback');

    });

    // text
    // let textData = Caption.createScaledTextData(text, 1.7);
    let textData = Caption.createScaledShortTextData(text, .7);
    let textEl = textData[0];
    setAttributes(textEl, {
        color: textColor
    });

    let bgWidth = textData[1] * 1.1;
    let bgHeight = Math.max(textData[2] * 1.1, spotHgt);

    let bgEl = rvrUtil.createPanel()
    setAttributes(bgEl,{
        position: {x:bgWidth/2, y:-bgHeight/2, z:0},
        material: {color: 'white'},
        geometry: {width: bgWidth, height: bgHeight}
    });
    bgEl.appendChild(textEl);

    Caption.updateScaledTextWithinBg(textData, textEl, bgEl, 'left', depthOffset);

    let animationDuration = 200;
    let anchorEl = document.createElement('a-entity');
    setAttributes(anchorEl, { 
        id: anchorId,
        // geometry: { primitive:'plane', width: 0.01, height: 0.01 },
        // material: { color: 'red' },
        position: {x:spotWid / 2, y: spotHgt / 2, z:0},
        rotation: {x: 0, y: -60, z: 0},
        scale: {x:0.001, y: 1, z:1},
        visible: false,
        animation__scalein:
        {
            property: 'scale',
            to: {x:0.001, y: 1, z:1 },
            dur: animationDuration,
            startEvents: 'hidedesc'
        },
        animation__visiblein: {
            property: 'visible',
            to: true,
            dur: 0,
            // delay: 0,
            startEvents: 'showdesc'
        },
        animation__scaleout: {
            property: 'scale',
            to: { x: 1, y: 1, z: 1 },
            dur: animationDuration,
            startEvents: 'showdesc'
        },
        animation__visibleout: {
            property: 'visible',
            to: false,
            delay: animationDuration,
            startEvents: 'hidedesc'
        },
    });
    anchorEl.appendChild(bgEl);
    hotspotEl.appendChild(anchorEl);
}
function loadMarkerHotspot(camData, hotspotData)
{
    let targetNoteId = hotspotData[sourceKey];

    let targetData = getNote(targetNoteId);

    if (targetData === undefined)
    {
        return;
    }

    let name = targetData[nameKey];
    let shortDesc = targetData[shortDescKey];
    let longDesc = targetData[longDescKey];
    let targetAssets = targetData[assetsKey];

    let pos = extractPosFromHotspotData(hotspotData);
    let spotWid = 0.5;
    let spotHgt = 0.5;
    let textColor = 'black';

    if (hasAttachments(targetData))
    {
        // thumb = _generalAssets[imagePinImageName];
        thumb = "assets\\images\\thumb_pin_"
    } else {
        // thumb = _generalAssets[commentPinImageName];
        thumb = "assets\\images\\comment_pin_"
    }

    let type = hotspotData[typeKey];
    if (type=="evidence"){
        thumb += 'ev.png';
    } else {
        thumb += 'att.png';
    }

    let hotspotEl = createHotspotPlane(hotspotData, spotWid, spotHgt, textColor, '');

    hotspotEl.setAttribute('material', {
        transparent: false,
        color: 'white',
        src: thumb
    });

    // meta
    setAttributes(hotspotEl, {
        class: hotspotClass,
        id: hotspotData[idKey],
        spotid: hotspotData[sourceKey]
    });

    let clickFn = function (evt) {

        // change scene
        console.log("get note: click()");
        let hotspotTarget = evt.target;
        // let destid = hotspotTarget.getAttribute("spotid");

        // let noteMarkerData = getNote(destid);
        // if (isUndefined(noteMarkerData))
        //     return;        
        // let currAssets = noteMarkerData[assetsKey];

        // let controllerId = rvrUtil.stringifyEvent(evt.detail.cursorEl.id);
        // drawGeneralText(controllerId, false);
        let controllerId = getControllerIdFromEvent(evt);

        // loadGallery(hotspotTarget, controllerId);
        playClickSound();
        loadMarkerDialog(hotspotTarget, controllerId);
    };

    hotspotEl.addEventListener('click', clickFn);

    addTextSlideOutToHotspot(hotspotEl, spotWid, spotHgt, name, textColor);

    addHotspotToScene(hotspotEl);

}
function loadCameraHotspot(camData, hotspotData)
{
    // creating the following object
    //<a-entity class="link"
    //geometry="primitive: plane; height: 1; width: 1"
    //material="shader: flat; src: ${thumb}"
    //event-set__mouseenter="scale: 1.2 1.2 1"
    //event-set__mouseleave="scale: 1 1 1"
    //event-set__click="_target: #image-360; _delay: 300; material.src: ${src}"
    //proxy-event="event: click; to: #image-360; as: fade"
    //sound="on: click; src: #click-sound"
    //change-color-on-click
    //    ></a-entity>

    let targetCamId = hotspotData[sourceKey];

    let targetCam = getStation(targetCamId);

    let thumb = targetCam[thumbsourceKey];
    if (thumb === undefined || thumb === "") {
        thumb = _generalAssets[locationPin2ImageName];
    }

    let pos = extractPosFromHotspotData(hotspotData);
    let spotWid = 0.7;
    let spotHgt = 0.7;
    let hotspotEl = createHotspotPlane(hotspotData, spotWid, spotHgt, _camSpotColor, thumb, '#336699');

    hotspotEl.addEventListener('click', onLoadSceneRequest);

    let skySrc = targetCam[panosourceKey];

    // meta
    setAttributes(hotspotEl,
        {
            class: hotspotClass,
            id: hotspotData[idKey],
            spotid: hotspotData[sourceKey]
        });

    // text
    let textColor = 'black';
    let captionText = targetCam["name"];

    addTextSlideOutToHotspot(hotspotEl, spotWid, spotHgt, captionText, textColor);

    addHotspotToScene(hotspotEl);
}
function addHotspotToScene(hotspotEl)
{
    let graphEl = getGraph();
    graphEl.appendChild(hotspotEl);
    _activeHotspots.push(hotspotEl);
}

function loadMarkerDialog(hotspotElSrc, controllerId)
{
    if (isUndefined(hotspotElSrc))
        return;

    let destid = hotspotElSrc.getAttribute("spotid");
    let noteMarkerData = getNote(destid);

    if (isUndefined(noteMarkerData))
        return;

    // remove scene captions
    // remove any cursor galleries
    // disable source marker
    // load caption
    // > if cursor type : check if attachments. if attachments, directly open gallery
    // > if 6dof type : open caption with options to show hand galleries


    clearAllCaptions();

    let dialog = undefined;
    let hasGallery = this.hasAttachments(noteMarkerData);
    if (!_forceCaptionDialogDebug && (controllerId.includes(rControllers.getCursorId()) && hasGallery))
    {
        // immediately show gallery
        // removeGalleryByDisplayType(SlideShow.displayTypeCursor);
        dialog = loadGallery(hotspotElSrc, controllerId);
    } 
    else 
    {
        // show caption
        dialog = loadCaption(hotspotElSrc, controllerId);
    }

    // disable source hotspot
    disableControl(hotspotElSrc);

    return dialog;
}

function hasAttachments(noteMarkerData)
{
    return CaptionBox.hasAttachments(noteMarkerData);
}

function loadCaption(hotspotSrcEl, controllerid)
{
    if (isUndefined(hotspotSrcEl))
        return;

    let sourceId = hotspotSrcEl.getAttribute("id");
    let destId = hotspotSrcEl.getAttribute("spotid");
    let noteMarkerData = getNote(destId);

    if (isUndefined(noteMarkerData))
        return;

    removeGalleryByDisplayType(rControllers.getCursorId());

    let cap = new CaptionBox(sourceId, noteMarkerData, getAssetGroups(), true, 2);

    let captionEl = cap.rootElement;
    setPositionOfDialogFromHotspot(hotspotSrcEl, captionEl);
    
    let graphEl = getGraph();
    graphEl.appendChild(captionEl);

    let closeButtonEl = cap.closeButtonEl;
    closeButtonEl.addEventListener(rOptionsUi.getCloseButtonEventName(), function(e)
    {
        let target = e.target;
        let popUpId = target.getAttribute(CaptionBox.parentAttributeName);

        playClickSound();
        removeCaptionBoxById(popUpId);
    });

    if (cap.hasGallery)
    {
        let galleryEl = cap.galleryButtonEl;
        galleryEl.addEventListener('click', function (e) {

            let target = e.target;
            let ctlId = getControllerIdFromEvent(e);
            let popUpId = target.getAttribute(CaptionBox.parentAttributeName);

            let cap = _activeCaptionBoxes[popUpId];
            let spotSrcId = cap.sourceId;

            let spotSrcEl = document.getElementById(spotSrcId);

            let x = 0;

            playClickSound();
            clearAllCaptions();
            loadGallery(spotSrcEl, ctlId);
        });
    }

    let lineEl = createLeaderLine(hotspotSrcEl, captionEl);
    cap.lineEl = lineEl;

    let sceneEl = getGraph();
    sceneEl.appendChild(lineEl);

    _activeCaptionBoxes[cap.rootId] = cap;

    return cap;
}

function loadGallery(hotspotSrcEl, controllerId)
{
    // bring assets to hand

    if (isUndefined(hotspotSrcEl))
        return;

    let destid = hotspotSrcEl.getAttribute("spotid");
    let noteMarkerData = getNote(destid);

    if (isUndefined(noteMarkerData)) {
        return;
    }

    let displayType = SlideShow.getDisplayTypeByControllerId(controllerId);
    removeGalleryByDisplayType(displayType);

    let slideShow = new SlideShow(hotspotSrcEl["id"], controllerId, noteMarkerData, getAssetGroups());

    let galleryEl = slideShow.rootElement;

    if (controllerId.includes(rControllers.getCursorId()))
    {
        setPositionOfDialogFromHotspot(hotspotSrcEl, galleryEl, -Math.PI / 3);

        let graphEl = getGraph();
        graphEl.appendChild(galleryEl);

        let lineEl = createLeaderLine(hotspotSrcEl, galleryEl);
        slideShow.lineEl = lineEl;
        graphEl.appendChild(lineEl);
    
        disableControl(hotspotSrcEl);

    } 
    else 
    {
        // width=".2" height=".2" position="-.15 0 0" rotation="225 0 0" 
        
        let controllerEl= document.getElementById(controllerId);
        if (!isUndefined(controllerEl))
        {
            let xOffset = 0.15;
            if (controllerId.includes(rControllers.getRightHandId()))
            {
                xOffset *= -1;
                removeGalleryByDisplayType(SlideShow.displayTypeRight);

                showToast(strLookAtRightHand);
            }
            else if (controllerId.includes(rControllers.getLeftHandId()))
            {
                removeGalleryByDisplayType(SlideShow.displayTypeLeft);

                showToast(strLookAtLeftHand);
            }

            setAttributes(galleryEl, {
                // rotation: {x:225,  y:0, z:0 },
                rotation: {x:265,  y:0, z:0 },
                position: {x:xOffset, y:0, z:0 }
            });
            controllerEl.appendChild(galleryEl);
        }
    }


    let closeButtonEl = slideShow.closeButtonEl;
    closeButtonEl.addEventListener(rOptionsUi.getCloseButtonEventName(), function(e)
    {
        let target = e.target;
        let popUpId = target.getAttribute(SlideShow.parentAttributeName);

        if (removeGalleryById(popUpId)){
            onRemovedGallery();
        }
    });

    _activeGalleries.push(slideShow);

    updateHelpState();
    return slideShow;
}

function onRemovedGallery()
{
    playClickSound();
    updateHelpState();
}

function disableControl(el)
{
    el.setAttribute('class', disabledControlClass);
}

function getGalleryByDisplayType(galleryDisplayType)
{
    if (isUndefined(galleryDisplayType))
        return undefined;

    for(let i=_activeGalleries.length-1;i>-1;i--)
    {
        let slideShow = _activeGalleries[i];
        if (slideShow.displayType === galleryDisplayType)
            return slideShow;
    }

    return undefined;
}
function removeCaptionBoxById(popUpId)
{
    if (isUndefined(popUpId))
        return;

    try {
        // delete _activeCaptionBoxes[popUpId];

        // TODO:
        let objDictionary = _activeCaptionBoxes;
        let key = popUpId;

        // DEBUG
        // let myObject = objDictionary; // dictionary is just an object with properties
        // let t1 = "";
        // for (let key1 in myObject) {
        //     let value = myObject[key1];
        //     t1 += value + "|";
        // }

        // re-enable hotspot
        let sourceId = objDictionary[key].sourceId;
        let sourceEl = document.getElementById(sourceId);
        sourceEl.setAttribute('class', hotspotClass);
        
        // remove pop-up
        let value = objDictionary[key];
        let el = value.rootElement        
        removeItem(el);

        let lineEl = value.lineEl;
        removeItem(lineEl);

        // delete from active list
        delete objDictionary[key];

        // DEBUG
        // let t2 = "";
        // for (let key2 in myObject) {
        //     let value = myObject[key2];
        //     t2 += value + "|";
        // }

        let x= 0;
    } catch (e) {
        console.log(e.message);
    }
}
function removeGalleryById(galleryId)
{
    let isRemovedGallery = false;
    if (isUndefined(galleryId))
        return isRemovedGallery;

    for(let i=0;i<_activeGalleries.length;i++)
    {
        let galleryEl = _activeGalleries[i].rootElement;
        if (galleryEl.getAttribute(idKey) !== galleryId)
            continue;

        removeGalleryByIndex(i);
        isRemovedGallery = true;
        break;
    }

    return isRemovedGallery;
}
function removeGalleryByDisplayType(galleryDisplayType)
{
    let isRemovedGallery = false;
    if (isUndefined(galleryDisplayType))
        return isRemovedGallery;

    for(let i=_activeGalleries.length-1;i>-1;i--)
    {
        let slideShow = _activeGalleries[i];
        if (slideShow.displayType !== galleryDisplayType)
            continue;

        removeGalleryByIndex(i);
        isRemovedGallery = true;
    }

    return isRemovedGallery;
}
function removeGalleryByIndex(index)
{
    let slideShow = _activeGalleries[index];
    let hotspotSrcId = slideShow.sourceId;
    let hotspotSrcEl = document.getElementById(hotspotSrcId);
    if (!isUndefined(hotspotSrcEl))
    {
        // enable control
        hotspotSrcEl.setAttribute('class', hotspotClass);
    }

    removeItem(slideShow.lineEl);
    removeItem(slideShow.rootElement);

    _activeGalleries.splice(index, 1);
}

function getCamPos()
{
    return new THREE.Vector3();
}
function getControllerIdFromEvent(event)
{
    let id = "unknown";
    try
    {
        id = event.detail.cursorEl.id;
    } catch (e)
    {
        drawGeneralText(e.message);
    }

    return id;
}

function playClickSound()
{
    try {
        let audioEl = document.querySelector("#myClickSound");
        let audio = audioEl.components.sound;
        audio.playSound();
    } catch (e) {
        let err = e.message;
    }
}

function updateSceneLabel(text)
{
    updateHudLabel(text, _sceneTextEl, _sceneTextBgEl);
}
function showToast(text)
{
    // let timeout = _toastTimeout;
    let textEl = _toastTextEl;
    let textBgEl = _toastTextBgEl;

    updateHudLabel(text, textEl, textBgEl);

    // textEl.setAttribute('visible', true);
    textBgEl.setAttribute('visible', true);

    clearTimeout(_toastTimeout);

    _toastTimeout = setTimeout(() => {
        // setAttributes(textEl, {
        //     text: {value:''}
        // });
        textBgEl.setAttribute('visible', false);
    }, 5000);    
}
function updateHudLabel(text, textEl, bgEl)
{
    let updateData = Caption.setupScaledTextDimensions(textEl, text, 1.5);

    let width = updateData[1];
    let height = updateData[2];

    Caption.updateScaledTextWithinBg(updateData, textEl, bgEl, 'center', depthOffset);

    setAttributes(bgEl,{
        geometry: {width: width * 1.1, height: height * 1.1},
        position: {x:0, y:0, z:0}
    });
    
}
function setUpOffsetDebug(srcEl)
{
    // DEBUG: create own lookat
    // let lookForward = srcEl.object3D.position.clone();
    // lookForward.normalize();
    // lookForward.multiplyScalar(-1);

    // let rotMatrix = new THREE.Matrix4().lookAt(lookForward, new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));

    // // var qt = new THREE.Quaternion().setFromRotationMatrix(mx);
    // // var rotation = new THREE.Euler().setFromQuaternion( qt, 'XYZ');

    // let p = createPanel();
    // p.setAttribute("material", "color:#F00");
    // p.object3D.rotation.setFromRotationMatrix(rotMatrix);

    // let pPos = new THREE.Vector3(spotPosX, spotPosY, spotPosZ);
    // pPos.normalize();
    // pPos.multiplyScalar(3);
    // // p.setAttribute('position', {x: pPos.x, y: pPos.y, z: pPos.z});
    // p.object3D.position.set(pPos.x, pPos.y, pPos.z);
    // sceneEl.appendChild(p);


    // let p2 = createPanel();
    // p2.setAttribute("material", "color:#0F0");
    // p2.object3D.rotation.setFromRotationMatrix(rotMatrix);
    // let lookUp = new THREE.Vector3(0,1,0).applyMatrix4(rotMatrix).normalize();
    // lookUp.multiplyScalar(.2); // 1/2 of height of src + 1/2 of height of target
    // p2.object3D.position.set(pPos.x + lookUp.x, pPos.y + lookUp.y, pPos.z + lookUp.z);
    // sceneEl.appendChild(p2);
}

function getForwardVector(srcPosition, targetPosition)
{
    let lookForward = targetPosition.clone();
    lookForward.sub(srcPosition);
    lookForward.normalize();

    return lookForward;
}

function setLookAt(srcEl, srcPosition, targetPosition)
{
    let lookForward = getForwardVector(srcPosition, targetPosition);
    
    // let lookBack = lookForward.clone();
    // lookBack.multiplyScalar(-1);

    // let rotMatrix = new THREE.Matrix4().lookAt(lookForward, new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
    let rotMatrix = new THREE.Matrix4().lookAt(lookForward, targetPosition,new THREE.Vector3(0,1,0));

    srcEl.object3D.rotation.setFromRotationMatrix(rotMatrix);
}

//// places targetEl(a-entity) in the up-vector direction of srcEl(a-entity) by reUpOffset(float) amount
// DEPRECATED: just add entity as child entity of source
// function setUpOffsetAndLookAt(srcPosition, targetEl, relUpOffset)
// {
//     // assuming srcEl is relative to 0,0,0
//     let srcPos = srcPosition.clone();
//     let lookForward = srcPos.clone();
//     let distance = srcPos.length();
//     lookForward.normalize();
//     lookForward.multiplyScalar(-1);

//     let rotMatrix = new THREE.Matrix4().lookAt(lookForward, new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));

//     // var qt = new THREE.Quaternion().setFromRotationMatrix(mx);
//     // var rotation = new THREE.Euler().setFromQuaternion( qt, 'XYZ');

//     let pPos = new THREE.Vector3(srcPos.x, srcPos.y, srcPos.z);
//     pPos.normalize();
//     pPos.multiplyScalar(distance*0.9);

//     targetEl.object3D.rotation.setFromRotationMatrix(rotMatrix);
//     let lookUp = new THREE.Vector3(0,1,0).applyMatrix4(rotMatrix).normalize();
//     lookUp.multiplyScalar(relUpOffset); // 1/2 of height of src + 1/2 of height of target

//     // targetEl.object3D.position.set(pPos.x + lookUp.x, pPos.y + lookUp.y, pPos.z + lookUp.z);
//     setPositionInScene(targetEl, pPos.x + lookUp.x, pPos.y + lookUp.y, pPos.z + lookUp.z);
// }


function setPositionOfDialogFromHotspot(hotspotElSrc, targetEl, angleLeftOfTarget=-Math.PI / 10, distance=dialogDistanceFromCamera)
{
    // make target position at eye level
    let targetPos = getPositionOfElement(hotspotElSrc);
    targetPos.y = 0;
    let sourcePos = getCamPos();

    let lookForward = getForwardVector(sourcePos, targetPos);

    if ((lookForward.x === 0 || isUndefined(lookForward.x))
        && (lookForward.z === 0 || isUndefined(lookForward.z)))
    {
        lookForward = new THREE.Vector3(0, 0, 1);
    }
    
    // rotate to the right by a bit to not be in the way of where marker is positioned
    let angle = angleLeftOfTarget;
    let axis = new THREE.Vector3(0, 1, 0);
    lookForward.applyAxisAngle(axis, angle);
    targetPos.applyAxisAngle(axis, angle);

    // let lookBack = lookForward.clone();
    // lookBack.multiplyScalar(-1);

    let rotMatrix = new THREE.Matrix4().lookAt(lookForward, targetPos ,new THREE.Vector3(0,1,0));

    let baseDistance = distance;

    let basePos = lookForward.clone();
    basePos.multiplyScalar(baseDistance);

    setPositionInScene(targetEl, basePos.x, basePos.y, basePos.z);
    targetEl.object3D.rotation.setFromRotationMatrix(rotMatrix);
}
function getPositionOfElement(el)
{
    let rc = undefined;
    if (el.hasAttribute("myx"))
    {
        let x = el.getAttribute("myx");
        let y = el.getAttribute("myy");
        let z = el.getAttribute("myz");

        rc = new THREE.Vector3(Number(x), Number(y), Number(z));
    } else {

        // NOTE: not going to work if object isn't rendered yet
        // - getAttribute('position') will also fail for the same reason
        let c = el.object3D.position.clone();
        // let a = el.getAttribute('position');

        rc = c;
    }
    return rc;
}
function setPositionInScene(el, x, y, z)
{
    // here so getPositionFromElement() works, bc can't get position of entity normally
    setAttributes(el,{
        myx: x,
        myy: y,
        myz: z
    });

    // normal
    // el.object3D.position.set(x, y, z);
    el.setAttribute('position', {x:Number(x), y:Number(y), z:Number(z)});

    // camlocked
    // el.setAttribute("camlocked","");

}
function setPosition(el, x, y, z)
{
    // el.object3D.position.set(x, y, z);
    el.setAttribute("position", {x:x, y:y, z:z });
}

function getStation(id) {

    let cams = _sceneData[stationsKey];
    let camData = undefined;
    for (let i = 0; i < cams.length; i++) {

        if (cams[i][idKey] === id) {
            //console.log("loadScene: found id");
            camData = cams[i];

            break;
        }
    }

    return camData;
}

function getNote(id)
{
    let markers = _sceneData[markersKey];
    let markerData = undefined;
    for (let i = 0; i < markers.length; i++) {
        if (markers[i][idKey] === id)
        {
            return markers[i];
        }
    }

    return null;
}

function clearAllCaptions()
{
    // clear all other captions
    for (let key in _activeCaptionBoxes)
    {
        let captionBox = _activeCaptionBoxes[key];
        removeCaptionBoxById(key)
    }
}

function clearScene() {

    console.log("> clearing scene");

    clearAllCaptions();

    let classTypes = [hotspotClass, captionClass, slideClass, disabledControlClass];
    let numRemoved = 0;    
    for (let i=0; i<classTypes.length; i++)
    {
        let classType = classTypes[i];
        numRemoved = clearSceneOfClassType(classType);
        console.log(classType + " cleared: " + numRemoved);
    }

    _activeHotspots = [];
}

function clearSceneOfClassType(classType)
{
    let graphEl = getGraph();
    let classEls = graphEl.querySelectorAll('.' + classType);
    let numRemoved = removeItems(classEls);
    return numRemoved;
}

function removeItems(items)
{
    let numRemoved = 0;
    for (let i = 0; i < items.length; i++) {
        // items[i].parentNode.removeChild(items[i]);
        if (removeItem(items[i]))
            numRemoved++;

        let x = 0;
    }

    return numRemoved;
}
function removeItem(item)
{
    // if (item != undefined)
    if (!isUndefined(item) && !isUndefined(item.parentNode))
    {
        item.parentNode.removeChild(item);
        return true;
    }
    return false;
}

function setupControls()
{
    if (rControllers.hasControllers())
    {
        // drawGeneralText('found controllers on start');
        setupControllers();
    } 
    else 
    {

        rControllers.getLibElement().addEventListener('controllerdetected', function () {
            // drawGeneralText('found controllers on event');
            setupControllers();
        });

        // cursor

        // uses a-frame's camera.zoom property
        // https://stackoverflow.com/questions/44459356/a-frame-zoom-on-wheel-scroll
        // ALT:
        // instead of doing zoom which zooms the entire screen, maybe scale an inverted sphere
        window.addEventListener("wheel", event => {
            let delta = -Math.sign(event.deltaY);
            //getting the mouse wheel change (120 or -120 and normalizing it to 1 or -1)

            // v1: original
            let zoomLevel = getZoomLevel() + delta;
            setZoomLevel(zoomLevel);

            if (_isDebug) {
                // debug
                // rControllers.triggerEvent();
                // rButtonMappings.updateHelpElements(2, 2);

            }
        });

    }

    setupControlsUiOption();
    setRayCasterObjectsOnControls();
}

function setupControllers()
{
    registerButtonMappings();
}

function registerButtonMappings() 
{
    let ctlR = document.getElementById(rControllers.getRightHandId());
    let ctlL = document.getElementById(rControllers.getLeftHandId());
    // rButtonMappingsAlt.setRightController(ctlR);
    // rButtonMappingsAlt.setLeftController(ctlL);
    rButtonMappings.setRightController(ctlR);
    rButtonMappings.setLeftController(ctlL);
    updateHelpState();

    // event
    let buttonMappingsEl = rButtonMappings.getLibElement();

    buttonMappingsEl.addEventListener('dirmove', function(e)
    {
        try{

            let state = e.detail.direction;
            let controllerId = e.detail.controllerid;

            let isLeft = null;
            if (controllerId.includes('left'))
            {
                isLeft = true;
            } else if (controllerId.includes('right'))
            {
                isLeft = false;
            }

            if (isUndefined(isLeft))
                return;


            let handled = false;

            if (!handled)
            {
                // switch slides on current slideshow
                let slideShowDisplayType = isLeft ? SlideShow.displayTypeLeft : SlideShow.displayTypeRight;
                let gallery = getGalleryByDisplayType(slideShowDisplayType);
                if (!isUndefined(gallery))
                {
                    if (state.includes('left'))
                    {
                        handled = true;
                        gallery.movePrevious();
                    } else if (state.includes('right'))
                    {
                        handled = true;
                        gallery.moveNext();
                    }
                }
            }

            if (!handled)
            {
                // doesn't work in VR

                // drawGeneralText('zoom state event:' + state);

                // // zoom
                // if (state.includes('up'))
                // {
                //     // zoom in 
                //     setZoomLevel(getZoomLevel() + 1);
                //     handled = true;
                // } else if (state.includes('down'))
                // {
                //     // zoom out
                //     setZoomLevel(getZoomLevel() -1);
                //     handled = true;
                // }
            }

            
        } catch (ex)
        {
            console.log(ex.message);
        }
    });

    // close gallery
    buttonMappingsEl.addEventListener('buttonchange', function(e)
    {
        try{
            let name = e.detail.controllerid;
            let state = e.detail.buttonstate;

            let displayType = undefined;
            if (name.includes('left'))
            {
                displayType = SlideShow.displayTypeLeft;
            } else if (name.includes('right'))
            {
                displayType = SlideShow.displayTypeRight;
            } else {
                displayType = SlideShow.displayTypeCursor;
            }

            // drawGeneralText('button state event:' + state);
            if (state.includes('ybuttonup') || state.includes('bbuttonup'))
            {
                if (removeGalleryByDisplayType(displayType)) {
                    onRemovedGallery();
                }
            } 
            else if (state.includes('abutton'))
            {
                // DEBUG
                // rControllers.triggerEvent();
            }
            
        } catch (ex)
        {
            console.log(ex.message);
        }
    });
}

function setupControlsUiOption()
{
    rOptionsUi.findControls();
    rOptionsUi.setupControllerUi(_initialHotspotScale);
    setHotspotScaleAll(_initialHotspotScale);
    rOptionsUi.setToggleHotpotsAction("toggleHotSpotsClickHandler");
    rOptionsUi.setScaleHotspotsAction("hotspotScaleSliderClickHandler");
    rOptionsUi.setToggleHelpAction("toggleHelpClickHandler");
}

function setRayCasterObjectsOnControls()
{
    // ".link,.mylink"
    let raycasterObjects = 
        "[gui-interactable]," + 
        "." + hotspotClass + "," +
        // "." + captionClass + "," + 
        "." + controlClass;
        // "." + slideClass;

    let cursor = document.getElementById(rControllers.getCursorId());
    let ctlR = document.getElementById(rControllers.getRightHandId());
    let ctlL = document.getElementById(rControllers.getLeftHandId());

    let controls = [ cursor, ctlR, ctlL ];

    for (let i = 0; i< controls.length; i++)
    {
        let el = controls[i];
        if(isUndefined(el))
            continue;

        el.setAttribute("raycaster", {
            objects: raycasterObjects,
            far: 100
        });
    }
}

function updateHelpState()
{
    if (!_helpVisible)
    {
        rButtonMappings.setControllersHelpMode(0, 0);
    } else {

        let righthandDisplayType = SlideShow.displayTypeRight;
        let lefthandDisplayType =  SlideShow.displayTypeLeft;
        let hasRightGallery = false;
        let hasLeftGallery = false;
        for(let i=_activeGalleries.length-1;i>-1;i--)
        {
            let slideShow = _activeGalleries[i];
            if (slideShow.displayType === righthandDisplayType) {
                hasRightGallery = true;
            } else if (slideShow.displayType === lefthandDisplayType) {
                hasLeftGallery = true;
            }
        }

        let leftMode = 1;
        if (hasLeftGallery) leftMode = 2;
        let rightMode = 1;
        if (hasRightGallery) rightMode = 2;

        rButtonMappings.setControllersHelpMode(leftMode, rightMode);
    }
}

// init scene
// TODO: move to something.js
AFRAME.registerComponent('sceneinit',
    {
        schema: {},
        init: function () {

            $.getJSON(transformUrl("userdata/scene.json"),
                function (data) {

                    console.log("scene init: try load json");

                    _sceneData = data;

                    let version = data["version"];
                    let initialViewStationId = data["initial"];

                    console.log("scene init: json success");

                    loadAssets();

                    // initial scene

                    // set initial sky
                    setupSceneLoadTransitions();

                    // let stationData = getStation(initialViewStationId);
                    // if (stationData == undefined) {
                    //     let cams = _sceneData[stationsKey];
                    //     stationData = cams[0];
                    // }
                    // let initialSkyId = stationData[panosourceKey];
                    setSky(initialViewStationId);

                    let sceneEl = getScene();

                    rvrUtil.setCameraLock(document.getElementById("cam"));

                    // set click sound
                    let soundAssetKey = _generalAssets["click-sound"];
                    let clickSoundEl = document.createElement('a-sound');
                    setAttributes(clickSoundEl, {
                        id: "myClickSound",
                        src: "#" + soundAssetKey
                    });

                    sceneEl.appendChild(clickSoundEl);

                    setupCameraUi();

                    loadScene(initialViewStationId);

                    setupControls();

                    debugGeneral();

                });
        }
    });

function setSky(stationId)
{
    let stationData = getStation(stationId);
    if (stationData == undefined) {
        let cams = _sceneData[stationsKey];
        stationData = cams[0];
    }

    let skyId = stationData[panosourceKey];

    let skyEl = getSky();
    let skySrc = getAssetSource(skyId);

    setAttributes(skyEl, {
        src: skySrc
    });

}

function onLoadSceneRequest(evt)
{
    // change scene
    console.log("change scene requested: click()");
    let hotspotTargetEl = evt.target;
    let destid = hotspotTargetEl.getAttribute("spotid");

    if (isUndefined(getStation(destid)))
        return;

    clearScene();
    playClickSound();

    let skyEl = getSky();
    skyEl.setAttribute("spotid", destid);

    let fadeTime = _fadeAniTime;
    let targetPos = getPositionOfElement(hotspotTargetEl);
    // let camPos = getCamPos();

    setAttributes(skyEl, {
        'animation__zoomin':
        {
            property: 'position',
            // from: {x:camPos.x, y:camPos.y, z:camPos.z},
            to: {x:-targetPos.x, y: -targetPos.y, z: -targetPos.z},
            dur: fadeTime,
            startEvents: 'fade'
        }
    });

    skyEl.emit("fade");
}

function setupSceneLoadTransitions()
{
    let skyEl = getSky();

    let fadeTime = _fadeAniTime;
    // delay on unfade so sky has time to load
    setAttributes(skyEl, {
        radius: 10,
        // camlocked: '',
        rotation: {x: 0, y: 270, z: 0},
        'animation__fade': {
            property: 'components.material.material.color',
            type: 'color',
            from: "#FFF",
            to: "#000",
            dur: fadeTime,
            startEvents: 'fade'
        }
        ,'animation__unfade':{
            property: 'components.material.material.color',
            type: 'color',
            from: "#000",
            to: "#FFF",
            delay: 700,
            dur: fadeTime,
            startEvents: 'animationcomplete__fade'
        }
    });

    // listen to sky animations
    skyEl.addEventListener("animationcomplete__fade",
        function (evt) {
            console.log("ended fade in");
            let e = evt;
            let name = evt.detail.name;

            let spotid = this.getAttribute(spotIdKey);

            // keep sky black until transition back
            setSky(spotid);
            let skyEl = getSky();
            setAttributes(skyEl, {
                material: {
                    color: '#000'
                }
            });

            let x = 0;
        });
    skyEl.addEventListener("animationcomplete__unfade",
        function (evt) {
            console.log("sky fadeback");
            let e = evt;
            let name = evt.detail.name;

            let spotid = this.getAttribute(spotIdKey);
            loadScene(spotid);
            let x = 0;
        });
        skyEl.addEventListener("animationcomplete__zoomin", function(evt)
        {
            let skyEl = getSky();
            skyEl.setAttribute('position', {x: 0, y: 0, z: 0},)
        });

}

function setupCameraUi() {

    // toast message placeholder
    let toastsRoot = document.getElementById('toastsBox');

    let toastData = Caption.createScaledTextData('hello world', 1);
    _toastTextEl = toastData[0];
    setAttributes(_toastTextEl, {
        color: 'white'
    });
    _toastTextBgEl = rvrUtil.createDropShadowPanel(toastData[1], toastData[2]);
    setAttributes(_toastTextBgEl,{
        visible: false,
        'render-order': 'hud'
    });
    _toastTextBgEl.appendChild(_toastTextEl);

    toastsRoot.appendChild(_toastTextBgEl);


    // current view station description placeholder
    let sceneInfoRoot = document.getElementById('sceneLabelsBox');

    let sceneLabelData = Caption.createScaledTextData("no view station loaded", 1);
    _sceneTextEl = sceneLabelData[0];
    setAttributes(_sceneTextEl, {
        color: 'white'
    });
    _sceneTextBgEl = rvrUtil.createDropShadowPanel(sceneLabelData[1],sceneLabelData[2]);
    setAttributes(_sceneTextBgEl, {
        'render-order': 'hud'
    });
    _sceneTextBgEl.appendChild(_sceneTextEl);

    sceneInfoRoot.appendChild(_sceneTextBgEl);


}


function setHotspotVisibility(isVisible)
{
    if (isVisible !== true && isVisible !== false)
        return;

    if (_hotspotsVisible === isVisible)
        return;

    _hotspotsVisible = isVisible;
    // rOptionsUi.updateToggleHotspotState(!_hotspotsVisible);

    for (let i=0; i<_activeHotspots.length; i++)
    {
        let hotspotEl = _activeHotspots[i];
        if (isVisible)
        {
            setAttributes(hotspotEl, {
                visible: isVisible,
                class: hotspotClass
            });
        } else {
            setAttributes(hotspotEl, {
                visible: isVisible,
                class: disableControl // disable hover and interactivity
            });

        }
    }
}
function setHelpVisibility(isVisible)
{
    if (isVisible !== true && isVisible !== false)
        return;

    if (_helpVisible === isVisible)
        return;

    _helpVisible = isVisible;
    // rOptionsUi.updateToggleHelpState(!_helpVisible);
    updateHelpState();
}

function setHotspotScaleAll(scale)
{
    if (scale < 0)
        scale = 0;
    else if (scale > 1)
        scale = 1;

    let min = 0.1;
    let max = 2.0;

    _currHotspotScale = min + ((max - min) * scale);
    let newScale = _currHotspotScale;
    rOptionsUi.updateScaleHotspotsState(scale);

    for (let i=0; i<_activeHotspots.length; i++)
    {
        let hotEl = _activeHotspots[i];
        setHotspotScale(hotEl, newScale);
    }

}
function setHotspotScale(el, scaleValue)
{
    let scalePopForward = 1;
    if (scaleValue > 0.9)
    {
        // ensure hotspot always 'pops' forward
        scalePopForward = scaleValue * 1.1;
    }

    setAttributes(el, {
        scale: {x: scaleValue, y: scaleValue, z: scaleValue},
        animation__scalein: { to: { x: scalePopForward, y: scalePopForward, z: scalePopForward } },
        animation__scaleout: { to: { x: scaleValue, y: scaleValue, z: scaleValue } },
    });
}


function toggleHotSpotsClickHandler(el)
{
    setHotspotVisibility(!_hotspotsVisible);    
}
function toggleHelpClickHandler(el)
{
    setHelpVisibility(!_helpVisible);
}
function hotspotScaleSliderClickHandler(el, data)
{
    let scale = data;
    setHotspotScaleAll(scale);
}

function getZoomLevel()
{
    return document.getElementById('cam').getAttribute('camera').zoom;
}
function setZoomLevel(zoomLevel=1)
{
    let camEl = document.getElementById('cam');
    let mycam = camEl.getAttribute('camera');

    //limiting the zoom so it doesnt zoom too much in or out
    if (zoomLevel < 1)
        zoomLevel = 1;
    if (zoomLevel > 5)
        zoomLevel = 5;

    mycam.zoom = zoomLevel;
    //setting the camera element
    camEl.setAttribute('camera', mycam);
}

// util

function isBlank(str) {
    return rvrUtil.isBlank(str);
}

function setAttributes(el, attributes) {
    // Object.keys(attributes).forEach(key => el.setAttribute(key, attributes[key]));
    rvrUtil.setAttributes(el, attributes);
}

function isUndefined(obj)
{
    return rvrUtil.isUndefined(obj);
}

function getGraph()
{
    return rvrUtil.getGraph();
}
function getScene()
{
    return rvrUtil.getScene();
}

function getSky()
{
    return rvrUtil.getSky();
}

function createDropShadowPanel(width, height)
{
    return rvrUtil.createDropShadowPanel(width, height);
}
function createPanel(width=0.4, height=0.4)
{
    return rvrUtil.createPanel(width,height);
}

function createLeaderLine(fromEl, toEl)
{
    let fromPos = getPositionOfElement(fromEl);
    let toPos = getPositionOfElement(toEl);

    // v1: doesn't look very good

    let material = fromEl.getAttribute('material');
    let matColor = "white";
    if (!isUndefined(material))
        matColor = material.color;
    let lineEl = document.createElement('a-entity');
    setAttributes(lineEl,{
        // camlocked: "",
        class: disabledControlClass
    });
    lineEl.setAttribute('line',
    {
        start: fromPos,
        end: toPos,
        color: matColor,
        opacity: 0.5
    });

    return lineEl;


    // v2: spotlight texture
    // - can't figure out how to rotate spotlight toward target

    // let lengthOfLight = 3;
    // // let texture = "assets/images/white-spotlight.png";
    // // let texture = "assets/images/straight-spotlight.png"
    // // let texture = "assets/images/spotlight.png"
    // let texture = "assets/images/location_pin2.png"
    

    // let pos = fromPos;
    // // let pos = getForwardVector(fromPos, toPos);
    // // pos.multiplyScalar(lengthOfLight / 2);
    // // pos.add(fromPos);

    // let camPos = new THREE.Vector3();
    // let forwardVector = getForwardVector(pos, camPos);

    // let material = fromEl.getAttribute('material');
    // let matColor = "white";
    // // if (!isUndefined(material))
    // //     matColor = material.color;

    // let spotlightEl = createPanel();
    // spotlightEl.setAttribute('geometry',
    // {
    //     primitive: 'plane',
    //     height: lengthOfLight,
    //     width: 3
    // });

    // let flatVector1 = getForwardVector(camPos, toPos);
    // let targetVector1 = flatVector1.clone();
    // flatVector1.y = 0;
    // flatVector1.normalize();
    // let angle1 = flatVector1.angleTo(targetVector1);

    // let flatVector2 = getForwardVector(camPos, fromPos);
    // let targetVector2 = flatVector2.clone();
    // flatVector2.y = 0;
    // flatVector2.normalize();
    // let angle2 = flatVector2.angleTo(targetVector2);

    // let angle = angle1 + angle2;

    // let rotFaceMatrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0,0,angle));
    // spotlightEl.object3D.rotation.setFromRotationMatrix(rotFaceMatrix);

    // // let rotMatrix = new THREE.Matrix4().lookAt(forwardVector, camPos ,new THREE.Vector3(0,1,0));
    // // rotMatrix.multiply(rotFaceMatrix);
    // // spotlightEl.object3D.rotation.setFromRotationMatrix(rotMatrix);
    // // setPositionInScene(spotlightEl, pos.x, pos.y, pos.z);


    // spotlightEl.setAttribute('position', pos);

    // // setAttributes(spotlightEl, {
    // //     scale: { x: 13, y: 13, z: 13 }
    // //     // position: { x: 1, y: 0, z: -2 }
    // // });
    // spotlightEl.setAttribute('material', { 
    //     src: texture,
    //     // wireframe: true,
    //     color: matColor,
    //     transparent: true
    // });

    // return spotlightEl;


    // v3

    // // let texture = "assets/images/white-spotlight.png";
    // // let texture = "assets/images/straight-spotlight.png"
    // // let texture = "assets/images/spotlight.png"
    // let texture = "assets/images/location_pin2.png"

    // let material = fromEl.getAttribute('material');
    // let matColor = "white";
    // // if (!isUndefined(material))
    // //     matColor = material.color;


    // let lengthOfLight = 3;
    // let pos = fromPos;
    // // let pos = getForwardVector(fromPos, toPos);
    // // pos.multiplyScalar(lengthOfLight / 2);
    // // pos.add(fromPos);


    // let spotlightEl = document.createElement('a-box');
    // setPositionInScene(spotlightEl, pos.x, pos.y, pos.z);
   
    // spotlightEl.setAttribute('geometry',{
    //     height: .01,
    //     width: .01,
    //     depth: 20
    // });
    // spotlightEl.setAttribute('material', { 
    //     // src: texture,
    //     // wireframe: true,
    //     color: matColor,
    //     transparent: true
    // });
    // let targetId = toEl.getAttribute('id');
    // if (isUndefined(targetId))
    // {
    //     let blha = 0;
    // }
    // spotlightEl.setAttribute('look-at',{
    //     src: "#" + targetId
    // });


    // return spotlightEl;
}

// DEBUG functions

let _timeoutGeneralText = null;

// log
// TODO: move to log.js
AFRAME.registerComponent('log',
    {
        schema: { type: 'string' },
        init: function () {
            let stringToLog = this.data;
            console.log(stringToLog);
        }
    });


function addCompass() {

    let sceneEl = rvrUtil.getSky();

    let delta = 9.5;

    let n = createBox();
    n.setAttribute('material', 'color:red');
    n.setAttribute('position', { x: 0, y: 0, z: -delta });
    n.setAttribute('rotation', { x: 0, y: 0, z: 45 });
    sceneEl.appendChild(n);

    let e = createBox();
    e.setAttribute('material', 'color:green');
    e.setAttribute('position', { x: delta, y: 0, z: 0 });
    e.setAttribute('rotation', { x: 45, y: 0, z: 0 });
    sceneEl.appendChild(e);

    let s = createBox();
    s.setAttribute('material', 'color:blue');
    s.setAttribute('position', { x: 0, y: 0, z: delta });
    s.setAttribute('rotation', { x: 0, y: 0, z: 45 });
    sceneEl.appendChild(s);

    let w = createBox();
    w.setAttribute('material', 'color:yellow');
    w.setAttribute('position', { x: -delta, y: 0, z: 0 });
    w.setAttribute('rotation', { x: 45, y: 0, z: 0 });
    sceneEl.appendChild(w);

    // let compassEl = createPanel(10, 10);
    // setAttributes(compassEl, {
    //     position: {x: 0, y: 5, z: 0},
    //     rotation: {x: 90, y: 0, z:180 },
    //     material: {
    //         transparent: true,
    //         src: "assets\\images\\compass.png"
    //     }
    // });
    // graphEl.appendChild(compassEl);
}

function createBox(height=0.3, width=0.3, depth=0.3) {
    return rvrUtil.createBox(height, width, depth);
}

function drawGeneralText(message, isTimeout)
{
    drawDebuggingText(document.getElementById('textgen'), _timeoutGeneralText, message, isTimeout);
}
function drawDebuggingText(el, timeout, message, isTimeout)
{
    let textEl = el;
    if (!textEl)
        return;

    textEl.setAttribute('text', {value: message});
    clearTimeout(timeout);

    if (isTimeout)
    {
        timeout = setTimeout(() => {
            textEl.setAttribute('text', { value: '' });
        }, 1000);    
    }
}

function debugConsole() {

    let leftTxt = rButtonMappingsAlt.getDebugPositionLAText();
    let rightTxt = rButtonMappingsAlt.getDebugPositionRAText();
    let inputTxt = rButtonMappingsAlt.getDebugInputAText();

    let mappingsTxt = rButtonMappings.getMappingsText();
    let buttonsTxt = rButtonMappings.getButtonsText();
    rButtonMappings.drawMappingText("hello mapping", false);
    rButtonMappings.drawButtonsText("hello buttons", false);

    let genTxt = rvrUtil.createDebugTextElement();
    genTxt.setAttribute("id", "textgen");
    genTxt.setAttribute("value", "my general text");

    // addCompass();

    let debugRoot = document.getElementById('debuglog');
    // debugRoot.appendChild(txt0);
    // debugRoot.appendChild(txt1);

    // txt2.setAttribute('value', '> txt2 debug now');
    // debugRoot.appendChild(inputTxt);
    // debugRoot.appendChild(genTxt);

    // debugRoot.appendChild(mappingsTxt);
    // debugRoot.appendChild(buttonsTxt);
}

function debugSliderControl()
{
    let optionsId = 'myOptions';
    let scale = 0.7;
    let defaultWidth = rOptionsUi.getDefaultWidth();
    let defaultHeight = rOptionsUi.getDefaultHeight();


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
        
        let toggleEl =  rOptionsUi.createToggle("Visible", "rOptionsUi.testValue('" + "blah" + "')");
        setAttributes(toggleEl, {
            margin: "0 0 " + bottomMargin + " 0",
        });
        optionsEl.appendChild(toggleEl);

        let sliderLabelEl = rOptionsUi.createLabel("Scale", defaultWidth, defaultHeight * 0.65);
        optionsEl.appendChild(sliderLabelEl);

        let sliderEl = rOptionsUi.createSlider("", 0.5, defaultWidth, defaultHeight * 0.65);
        setAttributes(sliderEl, {
            id: 'myslider',
            margin: "0 0 " + bottomMargin + " 0",
            // onclick: "rOptionsUi.testSlider('" + "myslider" + "')",
            onclick: "hotspotScaleSliderClickHandler"
        });
        optionsEl.appendChild(sliderEl);

        // let closeOptionsEl = createCloseOptionsButton(dropdownId, optionsId);
        // optionsEl.appendChild(closeOptionsEl);
    }

    rootEl.appendChild(optionsEl);

    let sceneEl = rvrUtil.getScene();
    sceneEl.appendChild(rootEl);
}

function debugGuiButton()
{
    let sceneEl = getScene();

    let bEl = rOptionsUi.createCloseButton();
    setAttributes(bEl, {
        position: {x: 0, y: 0.7, z: -4}
    });
    bEl.addEventListener("closeclicked", function(e)
    {
        let sourceEl = e.srcElement;
        let x = 0;
    });
    
    sceneEl.appendChild(bEl);
}

function debugAnimation()
{
    let graphEl = getScene();


    let popoutTime = 1000;
    let boxEl = document.createElement('a-box');

    let pos = new THREE.Vector3(-2, -1, -5);
    let hoverPos = new THREE.Vector3(-2, -1, -3);

    setAttributes(boxEl,{
        id: 'mybox',
        material: {color: 'red'},
        width: .9,
        height: .9,
        depth: .1,
        position: pos,
        rotation: { x: 0, y: 0, z: 0 },
        class: hotspotClass

        ,animation__positionin:
        // ,'event-set__mouseenter':
        // ,animation:
        {
            startEvents: 'showdesc',
            // startEvents: 'mouseenter',

            // property: 'scale',
            // to: { x: 1.5, y: 1.5, z: 1.5 },

            property: 'position',
            // from: { x: pos.x, y: pos.y, z: pos.z },
            to: { x: hoverPos.x, y: hoverPos.y, z: hoverPos.z },

            // property: 'rotation',
            // // from: { x: 0, y: 0, z: 0 },
            // to: { x: 0, y: 90, z: 0 },

            // loop: true,
            dur: popoutTime
        }
        ,animation__positionout:
        // ,'event-set__mouseleave':
        {
            startEvents: 'hidedesc',
            // startEvents: 'mouseleave',

            // property: 'scale',
            // to: { x: 1, y: 1, z: 1 },
            
            property: 'position',
            // from: { x: hoverPos.x, y: hoverPos.y, z: hoverPos.z },
            to: { x: pos.x, y: pos.y, z: pos.z },

            // property: 'rotation',
            // // from: { x: 0, y: 180, z: 0 },
            // to: { x: 0, y: 0, z: 0 },

            dur: popoutTime
        }
    });
    // boxEl.addEventListener('mouseenter', function(e)
    // {
    //     // let box = document.querySelector("#mybox");
    //     let box = e.srcElement;
    //     box.emit('showdesc');
    // });
    // boxEl.addEventListener('mouseleave', function(e)
    // {
    //     // let box = document.querySelector("#mybox");
    //     let box = e.srcElement;
    //     box.emit('hidedesc');
    // });

    // let inEl = document.createElement('a-animation');
    // setAttributes(inEl, {
    //     begin: 0,
    //     dur: popoutTime,
    //     repeat: "indefinite",
    //     fill: 'forwards',
    //     // attribute: "rotation",
    //     // from: { x: 0, y: 0, z: 0 },
    //     // to: { x: 0, y: 180, z: 0 }

    //     attribute: "scale",
    //     from: { x: 1, y: 1, z: 1 },
    //     to: { x: 2, y: 2, z: 2 }

    // });
    // boxEl.appendChild(inEl);

    // let outEl = document.createElement('a-animation');
    // setAttributes(outEl, {
    //     attribute: "rotation",
    //     begin: "hidedesc",
    //     dur: popoutTime,
    //     to: { x: 0, y: 0, z: 0 }
    // });
    // boxEl.appendChild(outEl);    

    let buttonEl = createPanel(0.3, 0.3);
    setAttributes(buttonEl,
    {
        id: 'mybutton',
        material: 
        { 
            // src: "userdata//images//Img_P026_01_20200116102145223.jpeg",
            color: "blue"
        },
        position: {x: 0, y: .3, z:-3 },
        class: hotspotClass
    });
    buttonEl.addEventListener('mouseenter', function(e)
    {
        let box = document.querySelector("#mybox");
        // box.setAttribute('position', { x: pos.x, y: pos.y, z: pos.z })
        box.emit('showdesc');
    });
    buttonEl.addEventListener('mouseleave', function(e)
    {
        let box = document.querySelector("#mybox");
        // box.setAttribute('position', { x: hoverPos.x, y: hoverPos.y, z: hoverPos.z })
        box.emit('hidedesc');
    });


    graphEl.appendChild(boxEl);
    graphEl.appendChild(buttonEl);
}

function debugTextDescFlipout()
{
    let graphEl = getGraph();

    let anchorId = "anchor";
    let spotSize = 0.6;
    let hotspotEl = createPanel(spotSize, spotSize);
    setAttributes(hotspotEl, {
        class: hotspotClass,
        position: {x:1, y:0, z:-2},
        material: {
            shader: 'flat',
            transparent: false,
            src: "assets\\images\\thumb_pin_ev.png"
            // color: "black"
        }
    });

    hotspotEl.addEventListener('mouseenter', function(evt)
    {
        let srcEl = evt.srcElement;
        let anchorEl = srcEl.querySelector('#' + anchorId);
        anchorEl.emit('showdesc');
    });
    hotspotEl.addEventListener('mouseleave', function(evt)
    {
        let srcEl = evt.srcElement;
        let anchorEl = srcEl.querySelector('#' + anchorId);
        anchorEl.emit('hidedesc');
    });

    // let text = "a lot of text of some stuff and things that happens to wrap around a bit or so i believe things to be. but who am i to know about such things"
    //             + "a lot of text of some stuff and things that happens to wrap around a bit or so i believe things to be. but who am i to know about such things";
    let text = "short text";

    let textData = Caption.createScaledTextData(text, 1);
    let textEl = textData[0];
    setAttributes(textEl, {
        color: 'black'
    });

    let bgWidth = textData[1] * 1.1;
    let bgHeight = Math.max(textData[2] * 1.1, spotSize);

    let bgEl = rvrUtil.createPanel()
    setAttributes(bgEl,{
        position: {x:bgWidth/2, y:-bgHeight/2, z:0},
        material: {color: 'white'},
        geometry: {width: bgWidth, height: bgHeight}
    });
    bgEl.appendChild(textEl);

    Caption.updateScaledTextWithinBg(textData, textEl, bgEl, 'left', depthOffset);

    let animationDuration = 100;
    let anchorEl = document.createElement('a-entity');
    setAttributes(anchorEl, { 
        id: anchorId,
        // geometry: { primitive:'plane', width: 0.01, height: 0.01 },
        // material: { color: 'red' },
        position: {x:spotSize / 2, y: spotSize / 2, z:0},
        scale: {x:0.001, y: 1, z:1},
        animation__scalein:
        {
            property: 'scale',
            to: {x:0.001, y: 1, z:1 },
            dur: animationDuration,
            startEvents: 'hidedesc'
        },
        animation__visiblein: {
            property: 'visible',
            to: true,
            dur: 0,
            // delay: 0,
            startEvents: 'showdesc'
        },
        animation__scaleout: {
            property: 'scale',
            to: { x: 1, y: 1, z: 1 },
            dur: animationDuration,
            startEvents: 'showdesc'
        },
        animation__visibleout: {
            property: 'visible',
            to: false,
            delay: animationDuration,
            startEvents: 'hidedesc'
        },
    });
    anchorEl.appendChild(bgEl);
    hotspotEl.appendChild(anchorEl);

    graphEl.appendChild(hotspotEl);
}

function debugText()
{
    let graphEl = getGraph();
   

    // TEST TEXT 2

    let textValue0 = "blah blah"; // 40
    let textValue1 = "0123456789012345678901234567890123456789" +
                     "01234567890123456789012345678901234pqjyg"; // 40
    let textValue2 = "one1 two2 thre four one1 two2 thre four5" + // 40 
                     "\n\n" +
                     "one1 two2 thre four one1 two2 thre four5" +
                     "one1 two2 thre four\n one1 two2 thre four5" +
                    //  "\n\n" +
                    //  "\n" +
                     "pyg1 two2 thre four\n one1 two2 thre pqjyg"; 
    let textValue3 = "1234 6789 1234 6789 1234 6789 1234 67890" +
                     "1234 6789 1234 6789 1234 6789 1234 67890" +
                     "1234 6789 1234 6789 1234 6789 1234 67890" +
                     "1234 6789 1234 6789 1234 6789 1234 pqjyg";

    let textValue4 = "one\n" + 
                     "two\n" + 
                     "\n\n" + 
                     "three\n" + 
                     "four\n\n";

    // width: 2 | lineheight: .175
    // width: 4 | lineheight: .36

    let textColor = "green";
    let wrapCount = 30;
    let lineHeight = .175;

    let txt = textValue2;

    let cap1 = new Caption(txt, 0.5);
    let t1El = cap1.rootElement;
    let yOffset1 = (cap1.height/2) * 1.1;
    setAttributes(t1El,{
        position: {x:0,y:yOffset1,z:-4}
    });
    graphEl.appendChild(t1El);


    let cap2 = new Caption(textValue1);
    let t1E2 = cap2.rootElement;
    let yOffset2 = (cap2.height/2) * 1.1;
    setAttributes(t1E2,{
        position: {x:0,y:-yOffset2,z:-4}
    });
    graphEl.appendChild(t1E2);

}

function debugShortText()
{
    let textValue0 = "blah blah"; // 40
    let textValue1 = "0123456789012345678901234567890123456789" +
                     "01234567890123456789012345678901234pqjyg"; // 40
    let textValue2 = "one1 two2 thre four one1 two2 thre four5" + // 40 
                     "\n\n" +
                     "one1 two2 thre four one1 two2 thre four5" +
                     "one1 two2 thre four\n one1 two2 thre four5" +
                    //  "\n\n" +
                    //  "\n" +
                     "pyg1 two2 thre four\n one1 two2 thre pqjyg"; 
    let textValue3 = "1234 6789 1234 6789 1234 6789 1234 67890" +
                     "1234 6789 1234 6789 1234 6789 1234 67890" +
                     "1234 6789 1234 6789 1234 6789 1234 67890" +
                     "1234 6789 1234 6789 1234 6789 1234 pqjyg";

    let textValue4 = "zerTY\n" +
                     "ohe\n" + 
                     "two\n" + 
                    //  "\n\n" + 
                     "three\n" + 
                     "fgur\n" + 
                     "5ive\n" +
                     "6\n" +
                     "7\n" +
                     "8\n" +
                     "9\n" +
                     "ohe\n" + 
                     "two\n" + 
                    //  "\n\n" + 
                     "three\n" + 
                     "fgur\n" + 
                     "5ive\n" +
                     "6\n" +
                     "7\n" +
                     "8\n" +
                     "9\n" +

                     "10g";

    let text = textValue3;
    
    let wrapCount = 20;
    let lineHeight = 0.275;
    let lineCount = rvrUtil.getNumberOfLines(text, wrapCount);
    let yOffset = 0.03;
    let tEl = rvrUtil.createDebugTextElement();
    setAttributes(tEl, {
        // geometry: {primitive: 'plane', width: 2, height: lineCount * lineHeight },
        material: { color: '#FFF'},
        align: 'left',
        'wrap-count': wrapCount,

        color: '#F00',
        position: { x:0, y:0, z:-4},
        value: text
    });

    let bgWidth = 3;
    let height = lineCount * lineHeight;
    let bgEl = rvrUtil.createPanel(bgWidth, height);
    setAttributes(bgEl, {
        position: { x:bgWidth/2, y:-yOffset, z:-0.01},
        material: { color: '#555'}
    });
    tEl.appendChild(bgEl);

    let sceneEl = getScene();
    sceneEl.appendChild(tEl);
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}

function debugLoadGallery()
{
    // DEBUG: load any gallery

    let graphEl = getGraph();

    let galleryHotSpotId = "33795b87-bb76-4f2d-9ede-b0315d2e4278";

    let markerEl = document.getElementById(galleryHotSpotId); // left with images
    let destid = markerEl.getAttribute("spotid");
    let noteMarkerData = getNote(destid);
    let controllerId = "cursor"; // "lefthand" "cursor"

    let galleryEl = null;
    if (controllerId === "cursor")
    {
        // scene
        let slideShow = new SlideShow(markerEl["id"], controllerId, noteMarkerData, getAssetGroups());
        galleryEl = slideShow.rootElement;
        setPosition(galleryEl, 0, 0, -dialogDistanceFromCamera);

    } else 
    {
        // hand
        let slideShow = new SlideShow(markerEl["id"], controllerId, noteMarkerData, getAssetGroups());
        galleryEl = slideShow.rootElement;
        setPosition(galleryEl, 0, 0, -.3);
    }
    graphEl.appendChild(galleryEl);

}

function oldDebugCode()
{
        // test event
    // let utilEl = rvrUtil.getLibElement();
    // utilEl.addEventListener('myEvent', function (e) {
    //     let msg = e.detail;
    //     let x = 0;

    //     let y = e["srcElement"];
    //     let str = rvrUtil.stringifyEvent(y);
    //     // mappingsTxt.setAttribute('value', str.toString());
    // });
    // rvrUtil.triggerEvent();


    // <a-image src="#logo" width="3" height="1.5"></a-image>
    
    // image test
    // let graphEl = getGraph();
    // let imageEl = createPanel();
    // imageEl.setAttribute("position", {x:0, y:0, z:-4});
    // imageEl.setAttribute("geometry",{
    //     width: 1,
    //     height: 2
    // });
    // imageEl.setAttribute("material",{
    //     color: "blue",
    //     src: "userdata/images/derp starters.jpeg"
    // });
    // graphEl.appendChild(imageEl);

    // // retrieve asset by id
    // let assetId = "a32fac7f-abfd-44ef-bc3e-dbe6156eb31b";
    // let assetGroups = _sceneData["assetgroups"];
    // let result = rvrUtil.getAssetPathFromAssetGroupsJsonUsingId(assetGroups, assetId);


    // deleting property from object / remove key from dictionary
    // var myObject = {
    //     "ircEvent": "PRIVMSG",
    //     "method": "newURI",
    //     "regex": "^http://.*"
    // };

    // let t1 = "";
    // for (let key in myObject)
    // {
    //     let value = myObject[key];
    //     t1 += value + "|";
    // }

    // delete myObject['regex'];

    // let t2 = "";
    // for (let key in myObject)
    // {
    //     let value = myObject[key];
    //     t2 += value + "|";
    // }


    let q = 0;
}

function debugGeneral()
{
    if (!_isDebug)
        return;

    debugConsole();

 
    let graphEl = getGraph();
    let sceneEl = getScene();

    // debugLoadGallery();
    // debugText();
    // debugShortText();
    
    // rOptionsUi.setupSampleLeftControllerDropdown();
    // rOptionsUi.testCreate();
    // debugTextDescFlipout();
    // rOptionsUi.testOptions();
    // debugSliderControl();
    // rOptionsUi.setupSampleCursorOptionsDropdown();

    // debugAnimation();

    // rButtonMappings.showButtonPositionsDebug(controllerEl, null);

    // rButtonMappings.updateHelpElements(2, 2);


    // let size = 0.0001;
    // testControllerEl = createBox(size, size, size);
    // setAttributes(testControllerEl, {
    //     position: {x:0, y:-0.5, z:-2},
    //     material: {color: "#3F3"}
    // });

    // rButtonMappings.testControllerHelp(testControllerEl);

    // sceneEl.appendChild(testControllerEl);

    // rButtonMappings.updateHelpElements(2, 2);
}

// let testControllerEl;


