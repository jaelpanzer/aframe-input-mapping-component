class SlideShow
{
    // static getQueryParameterByName(name, url) {
    //     if (!url) url = window.location.href;
    //     name = name.replace(/[\[\]]/g, '\\$&');
    //     var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    //         results = regex.exec(url);
    //     if (!results) return null;
    //     if (!results[2]) return '';
    //     return decodeURIComponent(results[2].replace(/\+/g, ' '));
    // }

    // static isUserData(relativeUrl)
    // {
    //     return relativeUrl.startsWith("userdata/") || relativeUrl.startsWith("userdata\\");
    // }
    
    // static transformUrl(relativeUrl)
    // {
    //     if (!this.isUserData(relativeUrl))
    //         return relativeUrl;
    
    //     var rootUrl = getQueryParameterByName("scene"); // todo: cache this
    //     if (!rootUrl)
    //         alert("No scene specified");
    
    //     return rootUrl.replace("scene.json", relativeUrl.substring("userdata\\".length));
    // }

    static getQueryParameterByName(name, url) { return rvrUtil.getQueryParameterByName(name, url); }
    static isUserData(relativeUrl) {return rvrUtil.isUserData(relativeUrl); }
    static transformUrl(relativeUrl) { return rvrUtil.transformUrl(relativeUrl); }


    static get displayTypeCursor() { return rControllers.getCursorId(); }
    static get displayTypeRight() { return rControllers.getRightHandId(); }
    static get displayTypeLeft() { return rControllers.getLeftHandId(); }

    static get className() { return "slideshow"; }
    static get controlClassName() { return "control"; }
    static get parentAttributeName() { return "parentId"; }

    static getDisplayTypeByControllerId(controllerId)
    {
        if (controllerId === rControllers.getCursorId()){
            return this.displayTypeCursor;
        } else if (controllerId === rControllers.getRightHandId()){
            return this.displayTypeRight;
        } else if (controllerId === rControllers.getLeftHandId())
        {
            return this.displayTypeLeft;
        }
    }

    static createPanel(width=1, height=1) {
        return rvrUtil.createPanel(width, height);
    }

    
    static createSlide(thumbWid, thumbHgt, index, color) {
        let thumbEl = SlideShow.createPanel(thumbWid, thumbHgt);
        thumbEl.setAttribute('material',
            {
                transparent: true,
                color: color
            });

        setAttributes(thumbEl, {
            index: index
        });

        // DEBUG: text="width:4;align:center;" 
        // thumbEl.setAttribute('text',
        //     {
        //         value: "idx:" + index,
        //         width: 2,
        //         align: "center"
        //     });

        return thumbEl;
    }

    constructor(hotspotSourceId, displayType, noteMarkerData, assetGroups)
    {
        this._hotspotSourceId = hotspotSourceId;
        this.targetAssetKey = "spotid";

        this.inactiveControlClass = "inactiveControl";
        // this.highlightColor = "#FFD700"; // gold
        this.highlightColor = "#FFA500";


        this._maxLeftEmptySlots = 2;
        this._maxRightEmptySlots = 2;
        
        // fields
        this._assetGroups = assetGroups;
        this._displayType = displayType;
        this._noteMarkerData = noteMarkerData;
        this._targetId = noteMarkerData["id"];
        this._length = 0;
        this._currentSlideIndex = -1;
        this._slidesArr = [];
        this._currDisplayedSlides = [];

        this._galleryRootEl = undefined;
        this._mainImageEl = undefined;
        this._mainImageBgEl = undefined;
        this._thumbsPanelEl = undefined;
        this._lineEl = undefined;
        this._closeButtonEl = undefined;

        // TODO: use scale property instead to scale down/up entire slideshow interface?
        if (displayType === SlideShow.displayTypeCursor)
        {
            this._depthIncrement = 0.01; // 0.01
            this._baseHgt = 7;
            this._baseWid = 8;
    
            this._textScale = 1.5;
        } else {

            // hand
            // width=".2" height=".2" position="-.15 0 0" rotation="225 0 0" 

            this._depthIncrement = 0.0008; // 0.0005
            this._baseHgt = .2;
            this._baseWid = .22;

            this._textScale = 0.08;
        }

        let percentForThumb = .90;
        this._thumbWid = (this._baseWid * percentForThumb) / 5;
        this._margin2 = (this._baseWid * (1-percentForThumb)) / 5;


        let sum = (this._thumbWid * 5) + (this._margin2 * 5);

        this._margin = this._margin2 / 2;
        this._opacity = 0.3;
        this._bgColor = "#888";

        this._thumbHgt = this._thumbWid * .7;


        this.setupContent();

    
        // debug
        this._name = "unknown";
    }

    get sourceId() { return this._hotspotSourceId;}
    get rootId() { return this._targetId + "_" + this._displayType; }
    get rootElement() { return this._galleryRootEl; }
    get closeButtonEl() { return this._closeButtonEl; }
    get lineEl() { return this._lineEl;}
    set lineEl(value) { this._lineEl = value;}

    get selectedIndex() { return this._currentSlideIndex; }
    get length() { return this._length;}

    get displayType() { return this._displayType; }

    setupContent()
    {
        let assetIds = this._noteMarkerData["assets"];
        let numThumbs = assetIds.length;
        this._length = numThumbs;

        let menuColor = "#111";

        // root panel / anchor: not actually rendered

        let rootPanelEl = SlideShow.createPanel(this._baseWid, this._baseHgt);
        rootPanelEl.setAttribute('material',
        {
            transparent: true,
            color: "red",
            opacity: 0
        });
        this.setAttributes(rootPanelEl, {
            class: SlideShow.className,
            id: this.rootId
        });
        this._galleryRootEl = rootPanelEl;

        // main image

        let bgImagePanelEl = SlideShow.createPanel();
        bgImagePanelEl.setAttribute('material',
        {
            transparent: true,
            color: menuColor,
            opacity: this._opacity
        });
        rootPanelEl.appendChild(bgImagePanelEl);
        this._mainImageBgEl = bgImagePanelEl;


        let mainImageEl = SlideShow.createPanel(this._baseWid - this._margin2, this._baseHgt - this._margin2);
        mainImageEl.setAttribute('material',{color:"white"});

        bgImagePanelEl.appendChild(mainImageEl);
        this._mainImageEl = mainImageEl;

        // marker notes

        let textBgColor = this.highlightColor;
        let textBgOpacity = 1;
        let data = this._noteMarkerData;

        let text = "";
        let shortdesc = data["shortdesc"];
        if (!this.isBlank(shortdesc))
        {
            // evidence marker number like '01'
            text += shortdesc;
        }
        let name = data["name"];
        if (!this.isBlank(name))
        {
            if (text.length > 0)
                text += ": ";
            text += name;
        }
        let longdesc = data["longdesc"];
        if (!this.isBlank(longdesc))
        {
            if (text.length > 0)
                text += "\n"
            text += longdesc;
        }

        let scale = this._textScale;
        let headerData = Caption.createScaledTextData(text, scale);

        let textColor = '#2c3037';
        let headerTextEl = headerData[0];
        let headerWid = headerData[1];
        let headerHgt = headerData[2];
        let headerYOffset = headerData[3];

        let headerBgWid = headerWid * 1.1;
        let headerBgHgt = headerHgt * 1.1;
        let headerBgEl = rvrUtil.createDropShadowPanel(headerBgWid, headerBgHgt);

        this.setAttributes(headerTextEl, {
            color: textColor
            // position: {x:-headerWid/2,y:-headerYOffset,z:this._depthIncrement }
        });
        Caption.updateScaledTextWithinBg(headerData, headerTextEl, headerBgEl, 'left', this._depthIncrement);

        this.setAttributes(headerBgEl, {
            position: {x: headerBgWid/2, y: headerBgHgt/2, z: 0}
        });
        headerBgEl.setAttribute('material',
        {
            color: textBgColor,
            opacity: textBgOpacity
        });
        headerBgEl.appendChild(headerTextEl);

        let headerAnchorEl = document.createElement('a-entity');
        this.setAttributes(headerAnchorEl,
            {
                rotation: {x:30, y:0, z: 0},
                position: {x:(this._baseWid / 2) - (headerBgWid), y:(this._baseHgt/2) + (this._thumbHgt + this._margin2), z:0}                
            });
        headerAnchorEl.appendChild(headerBgEl);
        rootPanelEl.appendChild(headerAnchorEl);


        // DEBUG: 1st attachment notes
        let attData = Caption.createScaledTextData("hello world", scale);

        let attTextEl = attData[0];

        this.setAttributes(attTextEl, {
            color: textColor
        });
        this._attTextEl = attTextEl;

        let attBgEl = rvrUtil.createDropShadowPanel();
        attBgEl.setAttribute('material',
        {
            color: textBgColor,
            opacity: textBgOpacity
        });
        attBgEl.appendChild(attTextEl);
        this._attBgEl = attBgEl;

        let attAnchorEl = document.createElement('a-entity');
        attAnchorEl.appendChild(attBgEl);
        this._attAnchorEl = attAnchorEl;

        rootPanelEl.appendChild(attAnchorEl);


        // thumbs container

        let thumbsPanelWidth = this._baseWid;
        let thumbsPanelHeight = this._thumbHgt + this._margin2;
        let thumbsPanelEl = SlideShow.createPanel(thumbsPanelWidth, thumbsPanelHeight);
        // setAttributes(thumbsPanelEl, { class: slideClass });
        thumbsPanelEl.setAttribute('material',
        {
            transparent: true,
            color: menuColor,
            opacity: this._opacity
        });

        let thumbPanelOffsetY = 
            (this._baseHgt/2) + 
            ((this._thumbHgt/2) + this._margin);
        this.setPosition(thumbsPanelEl, 0, thumbPanelOffsetY, this._depthIncrement);
    
        rootPanelEl.appendChild(thumbsPanelEl);
        this._thumbsPanelEl = thumbsPanelEl;

        let thumbSelectedEl = SlideShow.createPanel(this._thumbWid + this._margin2, this._thumbHgt + this._margin2);
        thumbSelectedEl.setAttribute('material',
        {
            transparent: true,
            color: this.highlightColor,
            opacity: 1
        });
        this.setAttributes( thumbSelectedEl, {
            position: {x:0, y:0, z:this._depthIncrement },
        });
        thumbsPanelEl.appendChild(thumbSelectedEl);


        // close button

        let closeButtonSize = this._thumbHgt * 0.66;
        let closeButtonOffsetX = (this._baseWid/2); // - (closeButtonSize/2);
        let closeButtonOffsetY = 
            (this._baseHgt/2) + 
            this._thumbHgt + this._margin2;

        // let closeEl = SlideShow.createPanel(closeButtonSize, closeButtonSize);
        // this.setPosition(closeEl, -closeButtonOffsetX, closeButtonOffsetY, this._depthIncrement * 4);
        // // closeEl.setAttribute('class', SlideShow.getControlClassName());
        // // closeEl.setAttribute('galleryId', this.galleryId);
        // this.setAttributes(closeEl,{
        //     'class': SlideShow.controlClassName,
        //     'parentId': this.rootId,
        //     'render-order': "menubutton"
        // });
        // closeEl.setAttribute('material',
        // {
        //     // 'opacity': 0.1,
        //     color: "white",
        //     transparent: true,
        //     src: 'assets/images/close2.png'
        // });

        let closeSize = 0.5;
        let closeScale = closeButtonSize / closeSize;
        let closeEl = rOptionsUi.createCloseButton(closeSize);
        this.setAttributes(closeEl, {
            scale: {x: closeScale, y: closeScale, z: closeScale},
            'parentId': this.rootId
        });

        let closeAnchorEl = document.createElement('a-entity');
        closeAnchorEl.appendChild(closeEl);
        thumbsPanelEl.appendChild(closeAnchorEl);
        rvrUtil.setCloseButtonPosition(closeEl, closeAnchorEl, closeButtonSize, thumbsPanelWidth, thumbsPanelHeight);

        // rootPanelEl.appendChild(closeEl);
        this._closeButtonEl = closeEl;


        // load slides

        let placeholderOpacity = 0;
        let slideBgOpacity = 1;
        let preSlidesColor = "blue";
        let slideColor = "#333"
        let pstSlidesColor = "#FFA500";
        let debug = false;
        if (debug)
        {
            placeholderOpacity = slideBgOpacity;
            // preSlidesColor = "blue";
            slideColor = "purple"
            // pstSlidesColor = "yellow";
        }

        this._slidesArr = [];
        if (numThumbs === 0)
        {
            // placeholder
            for(let j=0; j<5; j++)
            {
                let blankslideEl = SlideShow.createSlide(this._thumbWid, this._thumbHgt, j, slideColor);
                this._slidesArr.push(blankslideEl);
            }
        } else {
            for (let i =0; i< numThumbs; i++)
            {
                // insert leading blanks
                if (i === 0)
                {
                    // list.unshift("baz"); is the equivalent of insertAt(0)
        
                    for(let j=-this._maxLeftEmptySlots; j<0; j++)
                    {
                        let blankslideEl = SlideShow.createSlide(this._thumbWid, this._thumbHgt, j, preSlidesColor);
                        // blankslideEl.setAttribute('class', this.inactiveControlClass)
                        this._slidesArr.push(blankslideEl);
                    }
                } 
        
        
                // thumb border
                let thumbContainerEl = SlideShow.createSlide(this._thumbWid, this._thumbHgt, i, slideColor);

                let self = this;
                thumbContainerEl.addEventListener('click', function(e)
                {
                    console.log("gallery: click()");

                    self.playClickSound();

                    let target = e.target;

                    if (self.isUndefined(target))
                    {
                        return;
                    }

                    let index = target.getAttribute("index");
                    self.setIndex(Number(index));

                });

                let assetId = assetIds[i];
                let assetData = rvrUtil.getAssetDataFromAssetGroupsJsonUsingId(this._assetGroups, assetId);
                let relPath = assetData[0];
                let asset = assetData[1];
                let name = asset["name"];
                let fileName = asset["source"];
                let fileType = asset["type"];
                let shortDesc = asset["shortdesc"];
                let visible = asset["visible"];
                let meta = asset["meta"];

                let imageDim = this.getImageDimensionsFromMeta(meta);
                let imageWid = imageDim[0];
                let imageHgt = imageDim[1];

                let aspecRect = rvrUtil.scaleRectToFit(
                    [0,0,Number(imageWid),Number(imageHgt)], 
                    [0,0,this._thumbWid * 0.9,this._thumbHgt * 0.9]);

                // thumb image
                let thumbEl = SlideShow.createSlide(aspecRect[2], aspecRect[3], i, "white");

                thumbEl.setAttribute("material",{
                    src: transformUrl(relPath + fileName)
                });

                thumbEl.setAttribute("position", {x:0, y:0, z: this._depthIncrement});

                // meta
                thumbContainerEl.setAttribute(this.targetAssetKey, assetId);
                thumbContainerEl.appendChild(thumbEl);
                this._slidesArr.push(thumbContainerEl);
        
        
                // append trailing blanks
                if (i === numThumbs-1)
                {
                    for(let j=0; j<this._maxRightEmptySlots; j++)
                    {
                        let blankslideEl = SlideShow.createSlide(this._thumbWid, this._thumbHgt, i+1+j, pstSlidesColor);
                        // blankslideEl.setAttribute('class', this.inactiveControlClass)
                        this._slidesArr.push(blankslideEl);
                    }
                }
            }
        }


        // add all slides to panel and face them away from camera
        for(let i=0; i<this._slidesArr.length; i++)
        {
            let slideEl = this._slidesArr[i];

            if (i < this._maxLeftEmptySlots || i >= (this._slidesArr.length - this._maxRightEmptySlots)) {
                slideEl.setAttribute('material', {
                    opacity: 0
                });
            } else {
                slideEl.setAttribute('material', {
                    opacity: slideBgOpacity
                });
            }

            this.setAttributes(slideEl, {
                class: this.inactiveControlClass,
                rotation: {x:0, y:180, z:0},
                'render-order': 'menubutton'
            });
            this._thumbsPanelEl.appendChild(slideEl);
        }

        if (this._length > 0)
            this.setIndex(0);
    }

    getImageDimensionsFromMeta(meta)
    {
        return rvrUtil.getImageDimensionsFromMeta(meta);
    }

    playClickSound()
    {
        try {
            let audioEl = document.querySelector("#myClickSound");
            let audio = audioEl.components.sound;
            audio.playSound();
        } catch (e) {
            let err = e.message;
        }
    }

    setIndex(index)
    {
        if (this._currentSlideIndex === index)
            return;

        if (index < 0 || this.isUndefined(index))
            index = 0;

        if (index >= this._slidesArr.length)
            index = this._slidesArr.length - 1;

        this._currentSlideIndex = index;

        this.clearSlides();

        let targetIndex = index + this._maxLeftEmptySlots;

        for (let i = 0; i < 5; i++) {

            let currIdx = targetIndex - this._maxLeftEmptySlots + i;            
            let thumbEl = this._slidesArr[currIdx];

            if (i !== 2 && currIdx >= this._maxLeftEmptySlots && currIdx <this._slidesArr.length-this._maxRightEmptySlots)
            {
                thumbEl.setAttribute('class', SlideShow.controlClassName);
            }

            this.setPosition(thumbEl, -((this._baseWid / 2) - ((this._thumbWid+this._margin2) / 2)) + (i * (this._thumbWid + this._margin2)), 0, this._depthIncrement * 2);
            thumbEl.setAttribute("rotation", {x:0, y:0, z:0})

            this._currDisplayedSlides.push(thumbEl);
        }


        // display main image
        let targetSlideEl = this._slidesArr[targetIndex];
        let assetId = targetSlideEl.getAttribute(this.targetAssetKey);

        let assetData = rvrUtil.getAssetDataFromAssetGroupsJsonUsingId(this._assetGroups, assetId);
        let relPath = assetData[0];
        let asset = assetData[1];
        // let name = asset["name"];
        let fileName = asset["source"];
        let fileType = asset["type"];
        // let shortDesc = asset["shortdesc"];
        let visible = asset["visible"];
        let meta = asset["meta"];

        let imageDims = this.getImageDimensionsFromMeta(meta);
        let imageWid = imageDims[0];
        let imageHgt = imageDims[1];

        let aspecRect = rvrUtil.scaleRect(
            [0,0,Number(imageWid),Number(imageHgt)], 
            [0,0,this._baseWid - this._margin2, this._baseHgt - this._margin2], true, false);

        let gap = this._margin;
        let offsetY = ((this._baseHgt - aspecRect[3]) / 2) - this._margin -gap;

        this._mainImageBgEl.setAttribute('position', {x:0, y:offsetY, z:this._depthIncrement});
        this._mainImageBgEl.setAttribute('geometry',
        {
            width: aspecRect[2] + this._margin2,
            height: aspecRect[3] + this._margin2
        });

        this._mainImageEl.setAttribute('geometry',
        {
            width: aspecRect[2],
            height: aspecRect[3]
        });
        this._mainImageEl.setAttribute('position', {x:0, y:0, z:this._depthIncrement * 2});
        this._mainImageEl.setAttribute('material',
        {
            src: transformUrl(relPath + fileName)
        });


        // note
        let text = "";
        let name = asset["name"];
        if (!this.isBlank(name))
        {
            text += name + "\n";
        }
        let shortDesc = asset["shortdesc"];
        if (!this.isBlank(shortDesc))
        {
            text += shortDesc;
        }

        let scale = this._textScale;
        let attData = Caption.setupScaledTextDimensions(this._attTextEl, text, scale);

        let attBgEl = this._attBgEl;
        let attTextEl = attData[0];
        let attWid = attData[1];
        let attHgt = attData[2];
        let attYOffset = attData[3];

        this.setAttributes(attTextEl, {
            color: "black"
            // position: {x:-attWid/2,y:-attYOffset,z:this._depthIncrement }
        });
        Caption.updateScaledTextWithinBg(attData, attTextEl, attBgEl, 'left', this._depthIncrement);

        let attBgWid = attWid * 1.1;
        let attBgHgt = attHgt * 1.1;
        attBgEl.setAttribute('geometry',{
            width: attBgWid,
            height: attBgHgt
        });
        this.setAttributes(attBgEl, {
            position: {x: attBgWid/2, y: -attBgHgt/2, z: 0}
        });

        let attAnchorEl = this._attAnchorEl;
        this.setAttributes(attAnchorEl,
            {
                rotation: {x:-30, y:0, z: 0},
                position: {x:-(this._baseWid / 2), y:(this._baseHgt/2) - (aspecRect[3]+this._margin2) - gap, z:0}                
            });
    }
    
    moveNext()
    {
        let newIndex = this._currentSlideIndex + 1;
        if (newIndex > this._length-1)
        {
            // newIndex = 0;
            return;
        }

        this.setIndex(newIndex);
    }
    movePrevious()
    {
        let newIndex = this._currentSlideIndex - 1;
        if (newIndex < 0)
        {
            return;
        }

        this.setIndex(newIndex);

    }
    
    clearSlides()
    {
        
        // hide slides and 
        for(let i=0; i<this._currDisplayedSlides.length; i++)
        {
            let slideEl = this._currDisplayedSlides[i];
            slideEl.setAttribute("rotation", {x:0, y:180, z:0});
            slideEl.setAttribute("class", this.inactiveControlClass);
        }
        this._currDisplayedSlides = [];



        // select by class type
        // let query = "." + SlideShow.slideControlClassName() + ",." + this.inactiveControlClass;
        // let items = this._thumbsPanelEl.querySelectorAll(query);

        // let count = this.removeItems(results);
        // let y = 0;

        // for (let i = 0; i < items.length; i++) {
        //     let item = items[i];
        //     try{
        //         this._thumbsPanelEl.remove(item);

        //     } catch (e)
        //     {
        //         let msg = e.message;
        //     }
        // }
    }

    // removeItems(items) {
    //     let numRemoved = 0;
    //     for (let i = 0; i < items.length; i++) {
    //         // items[i].parentNode.removeChild(items[i]);
    //         if (removeItem(items[i]))
    //             numRemoved++;

    //         let x = 0;
    //     }

    //     return numRemoved;
    // }
    // removeItem(item) {
    //     // if (item != undefined)
    //     if (!this.isUndefined(item) && !this.isUndefined(item.parentNode)) {
    //         item.parentNode.removeChild(item);
    //         return true;
    //     }
    //     return false;
    // }

    setPosition(el, x, y, z)
    {
        el.setAttribute("position", {x:x, y:y, z:z });
    }

    isUndefined(value)
    {
        return rvrUtil.isUndefined(value);
    }

    isBlank(value)
    {
        return rvrUtil.isBlank(value);
    }

    setAttributes(el, attributes) {
        rvrUtil.setAttributes(el, attributes);
    }

    // DEBUG
    get Name()
    {
        return this._name;
    }
    set Name(value)
    {
        this._name = value;
    }
    
    show(myString)
    {
        let x = 0;
        return myString + "- hello | " + this._displayType;
    }

}