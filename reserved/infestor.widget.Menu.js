
/// <reference path="../../eks.js" />

eks.define('eks.widget.Menu', {


    extend: 'eks.Object',

    cssUses: 'eks.menu',
	
	uses:'eks.Dom',

    element: null,
    items: null,
    itemsMap: null,
    mode: 'normal',//right
    container: null,

    cls: 'infestor-menu',
    itemCls: 'infestor-menu-item',
    itemCtCls: 'infestor-menu-item-ct',
    arrowCls: 'infestor-menu-item-arrow',
    headCls: 'infestor-menu-item-head',
    bodyCls: 'infestor-menu-item-body',
    xSeparatorCls: 'infestor-memu-x-separator',
    subMenuCls: 'sub-menu',
    hoverCls: 'hover',

    initialization: function () {

        var me = this;

        this.element = this.element || eks.Dom.create('div');
        this.element.addClass(this.cls);

        eks.each(this.items, function () { me.addItem(this); });

        (this.mode == 'right') && this.initRightClickMenu();
    },

    initRightClickMenu: function () {

        var me = this;

        this.container = this.container || eks.Dom.create(document);
        this.element.hide();
        this.on('onClick', function (item) { !item.subMenu && me.element.hide(); })
        this.container.mousedown(function (e) {

            (e.which == 3) && me.element.css({

                top: e.clientY + 'px',
                left: e.clientX + 'px'

            }).show();

        });

        this.container.bind('contextmenu', function (e) {

            e.preventDefault();
        });

        this.element.bind('contextmenu', function (e) {

            e.preventDefault();
        });

        this.documentClickHandle = function () { me.element.hide() };

        eks.on(document, 'click', this.documentClickHandle);

    },

    removeItem: function (name) {


    },

    getItem: function (name) {

        var items = [];

        (function (map) {

            if (!map) return;

            var callee = arguments.callee;

            map[name] && items.push(map[name]);

            eks.each(map, function () {

                this.subMenu && callee(this.subMenu.itemsMap);
            });

        })(this.itemsMap);

        return items;

    },

    addItem: function (options) {

        var me = this, item = {};

        if (eks.isString(options) && options == '-') {

            item = eks.Dom.create('div').addClass(this.xSeparatorCls).appendTo(this.element);
            return;
        };

        item.options = options;
        item.element = eks.Dom.create('div').addClass(this.itemCls).appendTo(this.element).mouseover(function () { this.addClass(me.hoverCls); }).mouseout(function () { this.removeClass(me.hoverCls); });
        item.elementCt = eks.Dom.create('div').addClass(this.itemCtCls).appendTo(item.element);
        item.headElement = eks.Dom.create('div').addClass(this.headCls).appendTo(item.elementCt);
        item.bodyElement = eks.Dom.create('div').addClass(this.bodyCls).appendTo(item.elementCt).text(options.text);

        options.onClick && item.element.click(function () { options.onClick.call(me, item, me); });

        item.element.click(function () { me.emit('onClick', [item, me]); return false; });

        if (options.icon) { }

        if (options.items) {

            item.subMenu = new this.$ownerCls({

                cls: this.subMenuCls,
                items: options.items
            });

            item.arrowElement = eks.Dom.create('div').addClass(this.arrowCls).appendTo(item.element);

            item.element.mouseover(function () { item.subMenu.element.show(); }).mouseout(function () { item.subMenu.element.hide(); });

            item.subMenu.element.appendTo(item.element);

            item.subMenu.on('onClick', function () { me.emit('onClick', arguments); });
        }

        !this.itemsMap && (this.itemsMap = {});

        this.itemsMap[options.name || this.genId()] = item;

    },

    destory: function () {

        this.container && this.container.unbind('contextmenu').unbind('mousedown');
        this.documentClickHandle && eks.un(document, 'click', this.documentClickHandle);
        this.element.remove();

    }

});