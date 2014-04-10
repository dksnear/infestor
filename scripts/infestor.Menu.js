

infestor.define('infestor.Menu', {

	alias:'menu',
	extend : 'infestor.Element',
	cssUses : 'infestor.Menu',

	cssClsElement : 'infestor-menu',
	cssClsMenuItemElement : 'infestor-menu-item',
	cssClsMenuItemCt : 'infestor-menu-item-ct',
	cssClsMenuArrow : 'infestor-menu-item-arrow',
	cssClsMenuHead : 'infestor-menu-item-head',
	cssClsMenuBody : 'infestor-menu-item-body',
	cssClsMenuXSeparator : 'infestor-memu-x-separator',
	cssClsMenuChild : 'sub-menu',
	cssClsMenuHover : 'hover',
	
	mode: 'normal', //right

    //
    element:null,

	initElement : function () {

		this.callParent();

	}

});
