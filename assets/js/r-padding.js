    
let rPadding = (function() {

    AFRAME.registerComponent('mypadding',
    {
        schema: {},
        init: function () {
            console.log("setup mypadding");
        },
        tick: function()
        {
            let el = this.el;

            // let width = el.getAttribute('width');
            // let height = el.getAttribute('height');

            if (!isUndefined(el.components.text.geometry))
            {
                // let width = el.components.text.data.getAttribute('width');
                // let height = el.components.text.data.getAttribute('height');

                let width = el.components.text.data.width;
                let height = el.components.text.data.height;

                if (!isUndefined(width) && !isUndefined(height) && height > 0)
                {
                    let x= 0;
                }
            }

        },
        update: function()
        {
            let el = this.el;

            let width = el.getAttribute('width');
            let height = el.getAttribute('height');

            if (!isUndefined(width) && !isUndefined(height))
            {
                let x= 0;
            }
        }
    });

    function isUndefined(value)
    {
        return rvrUtil.isUndefined(value);
    }
})();
