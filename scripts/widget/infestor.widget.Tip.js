
/// <reference path="../../eks.js" />


eks.define('eks.widget.Tip', {

    extend: 'eks.Object',

    cssUses: true,

    element: null,
    content: null,
    container: null,
    currentArrowCls: null,
    text: '',
    //top,left,right,bottom
    arrowPosition: 'bottom',

    cls: 'infestor-tip',
    contentCls: 'content',
    arrowTopCls: 'arrow-top',
    arrowBottomCls: 'arrow-bottom',
    arrowLeftCls: 'arrow-left',
    arrowRightCls: 'arrow-right',

    statics: {

        z_index: 100
    },

    initialization: function () {


        this.element = eks.Dom.create('span').addClass(this.cls).css('z-index', this.getZIndex());
        this.content = this.content || eks.Dom.create('span');
        this.arrow = eks.Dom.create('s').appendTo(this.element);
        this.arrowMask = eks.Dom.create('i').appendTo(this.arrow);

        this.content.addClass(this.contentCls).appendTo(this.element).html(this.text);
        this.container && this.container.css({ position: 'relative' }) && this.element.appendTo(this.container);

        this.setArrowPosition();


    },

    setArrowPosition: function (pos) {

        this.arrowPosition = pos || this.arrowPosition;

        !this.posClsMap && (this.posClsMap = {
            top: this.arrowTopCls,
            bottom: this.arrowBottomCls,
            left: this.arrowLeftCls,
            right: this.arrowRightCls
        });

        this.currentArrowCls && this.element.removeClass(this.currentArrowCls);
        this.currentArrowCls = this.posClsMap[this.arrowPosition];
        this.element.addClass(this.currentArrowCls);

    },

    setPosition: function (top, left) {

        this.element.css({

            top: top || 0,
            left: left || 0
        });
    },

    getZIndex: function () {

        return this.$ownerCls.z_index++;

    }


});