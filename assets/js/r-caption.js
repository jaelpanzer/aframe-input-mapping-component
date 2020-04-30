class Caption
{
    static get className() { return "captionfixedwrap"; }

    static createScaledShortTextData(text, scale)
    {
        let textEl = rvrUtil.createDefaultTextElement();
        let captionData = Caption.setupScaledShortTextDimensions(textEl, text, scale);
        return captionData;

    }
    static setupScaledShortTextDimensions(textEl, text, scale)
    {
        let wrapCount = 20;
        let lineHeight = 0.275;
        let numberOfLines = rvrUtil.getNumberOfLines(text, wrapCount);
        let fontYOffset = 0.03;

        let baseWidth = 3;

        let bgWidth = (baseWidth * scale);
        let bgHeight = ((lineHeight * scale) * numberOfLines);
        let yOffset = -fontYOffset * scale;

        rvrUtil.setAttributes(textEl, {
            width: baseWidth * scale,
            value: text
        });
        textEl.setAttribute('wrap-count', wrapCount);


        return [textEl, bgWidth, bgHeight, yOffset];
    }


    // constants for "assets/fonts/_generated/Roboto-Regular-msdf.json"
    static get wrapCount() { return 30; } 
    static get fontLineHeight() { return 0.123; }
    static get fontYOffset() { return 0.012; } // space above 1st line and last line's letters like 'p' bleed over, so offset
    static get baseWrapLength() { return 2; } // width in meters that text is supposed to fit in

    static createScaledTextData(text, scale)
    {
        let textEl = rvrUtil.createDefaultTextElement();
        let captionData = Caption.setupScaledTextDimensions(textEl, text, scale);
        return captionData;
    }
    static setupScaledTextDimensions(textEl, text, scale)
    {
        if (rvrUtil.isUndefined(textEl))
            return;

        let baseWidth = Caption.baseWrapLength;
        let wrapCount = Caption.wrapCount;
        let fontYOffset = Caption.fontYOffset;
        let lineHeight = Caption.fontLineHeight;

        rvrUtil.setAttributes(textEl, {
            width: baseWidth * scale,
            value: text
        });
        textEl.setAttribute('wrap-count', wrapCount);

        let numberOfLines = rvrUtil.getNumberOfLines(text, wrapCount);

        let bgWidth = (baseWidth * scale);
        let bgHeight = ((lineHeight * scale) * numberOfLines);
        let yOffset = -fontYOffset * scale;

        return [textEl, bgWidth, bgHeight, yOffset];
    }

    // align options are left|right|center
    static updateScaledTextWithinBg(captionData, textEl, textBgEl, align='left', depthIncrement=0.01)
    {
        let width = captionData[1];
        let height = captionData[2];
        let yOffset = captionData[3];

        // // DEBUG
        // textEl.setAttribute('geometry',{
        //     primitive: 'plane',
        //     width: width,
        //     height: height
        // });
        // textEl.setAttribute('material',{
        //     color: 'green'
        // });

        // caller should do this so can scale as desired
        // textBgEl.setAttribute('geometry',{
        //     width: width,
        //     height: height
        // });

        if (align==='center')
        {
            rvrUtil.setAttributes(textEl, {
                align: 'center',
                position: {x:0, y:-yOffset, z:depthIncrement }
            });
        } 
        else if (align ==='left')
        {
            rvrUtil.setAttributes(textEl, {
                align: 'left',
                position: {x:-width/2, y:-yOffset, z:depthIncrement }
            });

        } else if (align === 'right')
        {
            rvrUtil.setAttributes(textEl, {
                align: 'right',
                position: {x:width/2, y:-yOffset, z:depthIncrement }
            });
        }
    }

    get sourceId() { return this._hotspotSourceId;}
    get rootId() { return CaptionBox.generateElementId(this._hotspotSourceId); }
    get rootElement() { return this._rootEl; }
    get width() { return this._width;}
    get height() { return this._height;}

    constructor(text, scale=1, hotspotSourceId='', padding=0)
    {
        // fields        
        this._scale = scale;
        this._hotspotSourceId = hotspotSourceId;
        this._text = text;
        this._width = 0;
        this._height = 0;
        this._textColor = "white";
        this._bgColor = "yellow";
        this._bgOpacity = 0.5;
        this._padding = padding; // 0.1;

        this.depthIncrement = 0.01;

        let textEl = rvrUtil.createDefaultTextElement();
        this._rootEl = textEl;

        let bgEl = rvrUtil.createPanel();
        // bgEl.setAttribute('material',{
        //     shader: 'flat'
        // });
        this._rootEl.appendChild(bgEl);
        this._bgEl = bgEl;

        this.updateContent();
    }

    updateContent()
    {
        let padding2 = this._padding * 2;
        let data = Caption.setupScaledTextDimensions(this._rootEl, this._text, this._scale);
        let textEl = this._rootEl; // same as data[0]
        let bgWidth = data[1] + padding2;
        let bgHeight = data[2] + padding2;
        let yOffset = data[3];

        this._width = bgWidth;
        this._height = bgHeight;

        this.setAttributes(textEl, {
            color: this._textColor,
            value: this._text
        });

        let bgEl = this._bgEl;
        this.setAttributes(bgEl,{
            position: {x:bgWidth / 2,y:yOffset, z:-this.depthIncrement}
        });
        bgEl.setAttribute('geometry',{
            width: bgWidth,
            height: bgHeight,
        });
        bgEl.setAttribute('material',{
            opacity: this._bgOpacity,
            color: this._bgColor
        });
    }
    
    getNumberOfLines(value, wrapCount)
    {
       return rvrUtil.getNumberOfLines(value, wrapCount);
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