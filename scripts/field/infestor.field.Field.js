
infestor.define('infestor.field.Field', {

	alias : 'field',

	extend : 'infestor.Panel',

	cssUses : ['infestor.Form'],
	
	cssClsElement : 'infestor-field',

	cssClsFieldLabel : 'infestor-field-label',
	cssClsFieldLabelLeft : 'infestor-field-label-left',
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

	//(top|left|right)
	labelPos : 'left',

	// 字段名
	fieldName : null,
	
	promptMsg : '',
	errorMsg : '',

	layout:'horizon',
	
	
	init:function(){
	
		this.fieldName = this.fieldName || this.getId();
		
		this.label && (this.labelPos == 'left' || this.labelPos == 'top') && (this.head = true);
		this.label && (this.labelPos == 'right') && (this.rear = true);
		
		this.callParent();
	},

	initElement : function () {

		this.callParent();
		
		this.createLabel().createContent().createInput();

	},
	
	
	createLabel:function(){
	
		var parent= (this.labelPos == 'top'||this.labelPos=='left') ? this.head : this.rear;
	
		if(!this.label || !parent) return;
		
		this.elementFieldLabel = this.createDomElement(parent,this.cssClsFieldLabel,'label',{
		
			'for':this.id
		});
		
		this.elementFieldLabel.text(this.label);
	
		return this;
	
	},
	
	createContent:function(){
	
		this.elementFieldContent= this.createDomElement(this.body,this.cssClsFieldContent);
		
		return this;
	
	},
	
	createInput:function(){
	
		this.elementFieldInput=this.createDomElement(this.elementFieldContent,'','input',{
			
			type : 'text',
			id : this.id,
			name : this.fieldName
		});
	
		return this;
	
	}

});
