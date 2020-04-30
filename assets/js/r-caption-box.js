class CaptionBox
{
    static get className() { return "captionbox"; }
    static get controlClassName() { return "control"; }
    static get parentAttributeName() { return "parentId"; }

    static generateElementId(id)
    {
        return id + "_" + CaptionBox.className;
    }
    static hasAttachments(noteMarkerData)
    {
        try
        {
            let assets = noteMarkerData["assets"];

            return assets.length > 0;
        } 
        catch (e)
        {
            console.log(e.message);
        }
        return false;
    }

    static createEmptySceneTextElement()
    {
        return rvrUtil.createDefaultTextElement();
    }

    static createPanel(width=1, height=1)
    {
        return rvrUtil.createPanel(width, height);
    }
    static updatePanel(el, width, height)
    {
        return rvrUtil.updatePanel(el, width, height);
    }

    constructor(hotspotSourceId, noteMarkerData, assetGroups, hasCloseButton=true, scale=1)
    {
        // constants
        this._depthIncrement = 0.01;

        // fields
        this._scale = scale;
        this._galleryButtonSize = 0.4 * scale;
        this._closeButtonSize = 0.5;
        this._closeButtonScale = 0.9;

        this._hotspotSourceId = hotspotSourceId;
        this._assetGroups = assetGroups;
        this._noteMarkerData = noteMarkerData;

        this._width = 0;
        this._height = 0;

        this._lineEl = undefined;

        let captionEl = CaptionBox.createEmptySceneTextElement();
        this.setAttributes(captionEl,{
            class: CaptionBox.className,
            id: this.rootId
        });

        this._rootEl = captionEl;

        let backdropEl = CaptionBox.createPanel();
        this._backdropEl = backdropEl;
        captionEl.appendChild(backdropEl);

        if (CaptionBox.hasAttachments(noteMarkerData))
        {
            let assets = this._noteMarkerData["assets"];
            let depthIncrement = this._depthIncrement;
            let galleryButtonSize = this._galleryButtonSize;
            let opacity = 0.8;

            // button / thumb container
            let galleryEl = CaptionBox.createPanel();
            // this.setAttributes(galleryEl,{
            //     // 'render-order': "menubutton"
            //     // 'class': CaptionBox.getControlClassName(),
            //     // 'parentId': this.rootId
            // });
            galleryEl.setAttribute("position", {x:0,y:0,z:-depthIncrement});

            let assetCount = assets.length;
            if (assetCount > 3) assetCount =3;

            for (let i=1; i<assetCount; i++)
            {
                opacity *= 0.9;

                let dropShadowEl = CaptionBox.createPanel(galleryButtonSize, galleryButtonSize);
                dropShadowEl.setAttribute('material',{
                    color: "#CCC",
                    opacity: opacity
                });
                let shadowOffset = 0.03 * scale;
                this.setAttributes(dropShadowEl,{
                    // width: galleryButtonSize,
                    // height: galleryButtonSize,
                    position: {x:shadowOffset * i,y:-shadowOffset * i,z:i * -depthIncrement } 
                });

                galleryEl.appendChild(dropShadowEl);
            }

            this._galleryEl = galleryEl;

            // thumb
            let assetId = assets[0];
            let assetData = rvrUtil.getAssetDataFromAssetGroupsJsonUsingId(this._assetGroups, assetId);
            let relPath = assetData[0];
            let asset = assetData[1];
            let fileName = asset["source"];
            let meta = asset["meta"];

            let imageDimData = this.getImageDimensionsFromMeta(meta);

            let imageWid = imageDimData[0];
            let imageHgt = imageDimData[1];


            let thumbWid = galleryButtonSize*.9;
            let thumbHgt = galleryButtonSize*.9;
            let aspecRect = rvrUtil.scaleRectToFit(
                [0,0,Number(imageWid),Number(imageHgt)], 
                [0,0,thumbWid, thumbHgt]);

            let thumbEl = CaptionBox.createPanel(Number(aspecRect[2]), Number(aspecRect[3])); // SlideShow.createSlide(aspecRect[2], aspecRect[3], 0, "white");
            // let thumbEl = document.createElement('a-plane');
            this.setAttributes(thumbEl,{
                // width: Number(aspecRect[2]),
                // height: Number(aspecRect[3]),
                // 'render-order': "menubutton",
                'class': CaptionBox.controlClassName,
                'parentId': this.rootId
            });
            thumbEl.setAttribute("material",{
                // color: 'white',
                transparent: false,
                src: relPath + fileName
            });

            // galleryEl.appendChild(thumbEl);
            thumbEl.appendChild(galleryEl);

            this._thumbEl = thumbEl;
            backdropEl.appendChild(this._thumbEl);
        }

        if (hasCloseButton)
        {
            // let closeEl = document.createElement('a-entity');
            // closeEl.setAttribute('geometry',
            //     {
            //         primitive: 'plane'
            //     });

            

            // let closeEl = CaptionBox.createPanel();
            // closeEl.setAttribute(CaptionBox.parentAttributeName, CaptionBox.controlClassName);
            // this.setAttributes(closeEl,
            //     {
            //         // 'render-order': "menubutton"
            //         'class': CaptionBox.controlClassName,
            //         'parentId': this.rootId
            //     });
            // closeEl.setAttribute('material',
            // {
            //     // 'opacity': 0.1,
            //     shader: 'flat',
            //     color: "#FFF",
            //     transparent: true,
            //     src: 'assets/images/close2.png'
            // });
            
            let closeEl = rOptionsUi.createCloseButton(this._closeButtonSize);
            let scaleSize = this._closeButtonScale;
            this.setAttributes(closeEl, {
                scale: { x:scaleSize, y:scaleSize, z:scaleSize},
                'parentId': this.rootId
            });

            this._closeButtonEl = closeEl;

            let closeAnchorEl = document.createElement('a-entity');            
            closeAnchorEl.appendChild(closeEl);
            this._closeAnchorEl = closeAnchorEl;


            // backdropEl.appendChild(this._closeButtonEl);
            backdropEl.appendChild(this._closeAnchorEl);

        }

        this.updateContent();
    }

    // get noteMarkerData() { return this._noteMarkerData; }
    get sourceId() { return this._hotspotSourceId;}
    get rootId() { return CaptionBox.generateElementId(this._hotspotSourceId); }
    get rootElement() { return this._rootEl; }
    get closeButtonEl() { return this._closeButtonEl; }
    get hasGallery() { return !this.isUndefined(this._galleryEl); }
    get galleryButtonEl() { return this._thumbEl; }
    get lineEl() { return this._lineEl;}
    set lineEl(value) { this._lineEl = value;}

    get width() { return this._width;}
    get height() { return this._height;}

    updateContent()
    {
        // if (this._ignoreUpdate)
        //     return;

        let data = this._noteMarkerData;
        let depthIncrement = this._depthIncrement;

        // text

        let textColor = "#2c3037";

        let text = "";
        let shortdesc = data["shortdesc"];
        if (!this.isUndefined(shortdesc))
        {
            // evidence marker number like '01'
            text += shortdesc;
        }
        let name = data["name"];
        if (!this.isUndefined(name))
        {
            if (text.length > 0)
                text += ": ";
            text += name + "\n";
        }
        let longdesc = data["longdesc"];
        if (!this.isUndefined(longdesc))
        {
            if (text.length > 0)
                text += "\n"
            text += longdesc;
        }

        // TODO: color caption according to type
        let type = data["type"];

        let assets = data["assets"];
        let hasAssets = assets.length > 0;

        // text element

        let captionEl = this._rootEl;
        this.setAttributes(captionEl, {
            color: textColor,
            value: text
        });

        let updateData = Caption.setupScaledTextDimensions(captionEl, text, this._scale);
        let bgBaseWidth = updateData[1];
        let bgBaseHeight = updateData[2];
        let yOffsetShift = updateData[3];

        // backdrop
        let galleryButtonSize = this._galleryButtonSize;
        let padding = .1;

        let backdropEl = this._backdropEl;

        let bgWidth = bgBaseWidth + padding;
        let bgHeight = bgBaseHeight + padding;

        let galleryButtonOffset = 0;
        if (hasAssets)
        {
            bgHeight += (galleryButtonSize / 2);
            galleryButtonOffset = (galleryButtonSize / 2);
        }

        // backdropEl.setAttribute("geometry", {
        //     primitive: "plane",
        //     width: bgWidth,
        //     height: bgHeight
        // });
        CaptionBox.updatePanel(backdropEl, bgWidth, bgHeight);
        // opacity below 1 causes text artifacts on backgrounds
        backdropEl.setAttribute("material", {
            shader: "flat",
            opacity: 1,
            color: "orange"
        });

        backdropEl.setAttribute("position", {x:bgBaseWidth/2,y:yOffsetShift - galleryButtonOffset/2,z:-depthIncrement});

        // gallery
        
        if (hasAssets)
        {
            let galleryEl = this._galleryEl;
            
            CaptionBox.updatePanel(galleryEl, galleryButtonSize, galleryButtonSize);

            let thumbEl = this._thumbEl;
            thumbEl.setAttribute("position", {x:-(bgWidth/2 - galleryButtonSize / 2 - padding/2),y:-(bgHeight/2 ),z:depthIncrement*5});

        }


        // close button

        let closeEl = this._closeButtonEl;
        if (!this.isUndefined(closeEl)) {

            // position and size
            // let closeButtonSize = .20 * this._scale;
            // CaptionBox.updatePanel(closeEl, closeButtonSize, closeButtonSize);

            let closeButtonSize = this._closeButtonSize * this._closeButtonScale;

            let closeAnchorEl = this._closeAnchorEl;
            // this.setAttributes(closeAnchorEl, {
            //     // rotation: {x:-30, y:0, z: 0},
            //     position: {x:-(bgWidth / 2), y:(bgHeight/2), z:0}                
            // });

            rvrUtil.setCloseButtonPosition(closeEl, closeAnchorEl, closeButtonSize, bgWidth, bgHeight);
        }

    }

    getImageDimensionsFromMeta(meta)
    {
        return rvrUtil.getImageDimensionsFromMeta(meta);
    }

    isBlank(str) {
        return rvrUtil.isBlank(str);
    }

    isUndefined(value)
    {
        return rvrUtil.isUndefined(value);
    }

    setAttributes(el, attributes) {
        rvrUtil.setAttributes(el, attributes);
    }
}