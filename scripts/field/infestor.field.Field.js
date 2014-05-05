
infestor.define('infestor.field.Field', {

	alias : 'field',

	extend : 'infestor.Panel',

	cssUses : ['infestor.Form'],
	
	cssClsElement : 'infestor-field',

	cssClsFieldLabel : 'infestor-field-label',
	cssClsFieldLeft:'infestor-field-left',
	cssClsFieldRight : 'infestor-field-right',
	cssClsFieldTop : 'infestor-field-top',
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

	labelWidth : 45,

	//(top|left|right)
	labelPos : 'left',
	
	// 字段名
	fieldName : null,
	
	promptMsg : '',
	errorMsg : '',

	layout:'horizon',
	
	checked:false,
	
	value:null,
	
	disabled:false,
	
	readOnly:false,
	
	allowNull:false,
	
	init:function(){
	
		this.fieldName = this.fieldName || this.getId();
		
		this.label && (this.labelPos == 'left' || this.labelPos == 'top') && (this.head = true);
		this.label && (this.labelPos == 'right') && (this.rear = true);
		
		((this.labelPos == 'left' || this.labelPos == 'right') && (this.layout=='none' || !this.layout)) && (this.layout = 'horizon');
		(this.labelPos == 'top' && (this.layout == 'horizon' || this.layout == 'table')) && (this.layout = 'vertical');
		
		this.callParent();
		
		this.setValue(this.value);
	},

	initElement : function () {

		this.callParent();
		
		this.createLabel().createContent().createInput();
		
		this.setReadOnly(this.readOnly).setDisable();

	},
	
	initEvents:function(){
	
		this.on('change',function(){
		
			this.check();
		
		},this);
	
	},
	
	createLabel:function(){
	
		var parent = (this.labelPos == 'top'||this.labelPos=='left') ? this.head : this.rear;
	
		if(!this.label || !parent) return;
		
		this.elementFieldLabel = this.createDomElement(parent,this.cssClsFieldLabel,'label',{
		
			'for':this.id
		});
		
		this.labelWidth && this.elementFieldLabel.css('width',infestor.styleFormat(this.labelWidth));
		
		this.elementFieldLabel.text(this.label);
		
		(this.labelPos == 'left') && this.elementFieldLabel.addClass(this.cssClsFieldLeft);
		(this.labelPos == 'right') && this.elementFieldLabel.addClass(this.cssClsFieldRight);
		(this.labelPos == 'top') && this.elementFieldLabel.addClass(this.cssClsFieldTop);
	
		return this;
	
	},
	
	createContent:function(){
	
		this.elementFieldContent = this.createDomElement(this.body,this.cssClsFieldContent);
		
		return this;
	
	},
	
	createInput:function(){
	
		
		this.elementFieldInput = this.createDomElement(this.elementFieldContent,'','input',{
			
			type : 'text',
			id : this.id,
			name : this.fieldName
		});
		
		this.elementFieldInput.change(function(){
		
			this.emit('change',arguments,this);
		
		},this);
	
		return this;
	
	},
	
	getValue:function(){
		
		if(this.disabled) return null;
	
		return this.elementFieldInput && this.elementFieldInput.val();
	
	},
	
	setValue:function(value){
	
		if(this.disabled || infestor.isNull(value)|| infestor.isUndefined(value))
			return;
		
		this.value = value;
		this.elementFieldInput && this.elementFieldInput.val(value);
	},
	
	setReadOnly:function(readOnly){
	
		if(readOnly){
		
			this.readOnly = true;
			this.elementFieldInput.attr('readonly','readonly');
			return this;
		}
		
		this.readOnly = false
		this.elementFieldInput.removeAttr('readonly');
		
		return this;
	
	},
	
	setDisable:function(){
	
		this.disabled = !this.disabled;
		
		if(!this.disabled) 
			this.disable();
		else 
			this.disabled = !this.disabled;
		
		return this;
		
	},
	
	disable:function(){
		
		if(this.disabled)
			return this;
		
		this.disabled = true;
		
		this.elementFieldInput.removeAttr('disabled');
	
	},
	
	enable:function(){
	
		if(!this.disabled)
			return this;
		
		this.disabled = false;
		
		this.elementFieldInput.attr('disabled',true);
		
		return this;
	},
	
	check:function(){
	
		this.checked = true;
	
	}

});
