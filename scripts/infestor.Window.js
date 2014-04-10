
// 基本窗口类

infestor.define('infestor.Window', {

	alias : 'window',
	extend : 'infestor.Element',
	cssUses : ['infestor.Window'],
	
	cssClsElement : 'infestor-window',
	cssClsWindowTitle : 'infestor-window-title',
	cssClsWindowCtrl : 'infestor-window-ctrl',
	iconCls : 'infestor-icon',
	cssClsWindowBody : 'infestor-window-body',
	cssClsWindowContent : 'infestor-window-body-content',
	cssClsWindowRear : 'infestor-window-rear',

	element : null,
	elementWindowTitle : null,
	elementWindowCtrl : null,
	elementWindowBody : null,
	elementWindowContent : null,
	elementWindowRear : null,

	boxShadow : true,
	title : 'window',
	modal : false,	
	//hide destroy
	closeType : 'hide',
	//top bottom
	ctrlPos : 'bottom',

	initElement : function () {

		this.callParent();

		this.elementWindowTitle = infestor.Dom.div().addClass(this.cssClsWindowTitle).addClass(this.boxShadowCls).text(this.title || '').appendTo(this.element);
		this.elementWindowCtrl = infestor.Dom.div().addClass(this.cssClsWindowCtrl).appendTo(this.element);
		this.elementWindowBody = infestor.Dom.div().addClass(this.cssClsWindowBody).appendTo(this.element);
		this.elementWindowRear = infestor.Dom.div().addClass(this.cssClsWindowRear).appendTo(this.element);
		this.elementWindowContent = infestor.Dom.div().addClass(this.cssClsWindowContent).appendTo(this.elementWindowBody);

		this.elementWindowBody.css('height',infestor.px(infestor.parseNumeric(this.height)-30));
		
		this.elementInnerContainer = this.elementWindowContent;
	},

	show : function () {

		if (this.element) {

			this.modal && this.showMask() && this.element.zIndex();
			this.element.show();
		}
	},

	hide : function () {

		if (this.element) {

			this.modal && this.hideMask();
			this.element.hide();
		}
	},

	close : function () {

		if (this.element)
			return;

		(this.closeType == 'destroy') ? this.destroy() : this.hide();

	},

	destroy : function () {

		this.hideMask();

		return this.callParent();

	}

});
