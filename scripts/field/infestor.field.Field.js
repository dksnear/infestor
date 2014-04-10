
/// <reference path="../../infestor.js"/>

infestor.define('infestor.field.Field', {

	alias : 'field',

	extend : 'infestor.Element',

	cssUses : ['infestor.form'],
	
	cssClsElement : 'infestor-field',
	cssClsFieldLabelLeftFix : 'infestor-field-label-left-fix',
	cssClsFieldLabel : 'infestor-field-label',
	cssClsFieldContent : 'infestor-field-content',

	elementFieldLabel : null,
	elementFieldContent : null,
	elementFieldInput : null,
	elementFieldPlaceHolder : null,
	elementFieldError: null,
	elementFieldPrompt : null,
	elementFieldErrorIcon : null,
	
	boxShadow : true,

	// label 设置标签文字
	// false 不创建标签对象
	label : false,

	labelWidth : 40,

	//(top|left)
	labelPos : 'left',

	name : '',
	promptMsg : '',
	errorMsg : '',

	layout:'inline-block',

	initElement : function () {

		this.callParent();

		this.elementFieldLabel = this.label ? infestor.Dom.label({
				'for' : this.id
			}).addClass(this.cssClsFieldLabel).text(this.label).appendTo(this.element) : null;

		this.elementFieldContent = infestor.Dom.div().addClass(this.cssClsFieldContent).appendTo(this.element);

		this.elementFieldInput = infestor.Dom.input({
				type : 'text',
				id : this.id,
				name : this.name
			}).appendTo(this.elementFieldContent);

		this.labelWidth && this.elementFieldLabel && this.elementFieldLabel.css('width', infestor.styleExpr(this.labelWidth));

		this.setLabelPosition();

	},

	// pos:(top|left)
	setLabelPosition : function (pos) {

		var map = {

			top : 'removeClass',
			left : 'addClass'

		};

		pos = pos || this.labelPos;

		this.elementFieldLabel && map[pos]
		 && (this.labelPos = pos)
		 && this.element[map[pos]](this.cssClsFieldLabelLeftFix)
		 && this.elementFieldLabel[map[pos]](this.cssClsElementInlineBlock)
		 && this.elementFieldContent[map[pos]](this.cssClsElementInlineBlock);

	}

});
