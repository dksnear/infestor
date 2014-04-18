
// 基本窗口类

infestor.define('infestor.Window', {

	alias : 'window',
	extend : 'infestor.Panel',
	cssUses : ['infestor.Window'],

	statics : {},

	cssClsElement : 'infestor-window',
	boxShadow : true,

	// 关闭类型(hide|destory)
	closeType : 'hide',

	// 模态窗口(bool)
	modal : true,

	initElement : function () {

		this.callParent();
		
		this.show();

	},

	show : function () {

		if (!this.element)
			return this;

		this.modal && infestor.Element.showMask();

		this.element.zIndex().show();

		return this;

	},

	hide : function () {

		if (!this.element)
			return this;

		this.modal && infestor.Element.hideMask();

		this.element.hide();

		return this;
	},

	close : function () {

		if (this.element)
			return this;

		(this.closeType == 'destroy') ? this.destroy() : this.hide();

		return this;

	},

	destroy : function () {

		return this.hide() && this.callParent();

	}

});
