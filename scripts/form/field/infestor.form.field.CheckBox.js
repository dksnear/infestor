
infestor.define('infestor.form.field.CheckBox', {

	alias : 'checkboxfield',

	extend : 'infestor.form.field.Field',

	uses : ['infestor.CheckBox'],
	
	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-field',

	// 字段名
	fieldName : null,

	checked : false,
	value : null,	
	layout : 'table',	
	allowNull : false,
	
	tabIndex:-1,
	
	// #rewite methods
	
	initEvents : function(){
	
		
	
	},
	
	createInput : function(){
	
		this.fieldInput = this.fieldInput || infestor.create('infestor.Element',{
		
			cssClsElement:'infestor-candidate-captcha-input',
			attr:{
			
				tabindex:-1
			},
			items:infestor.genArray(this.codeNum,function(i){
			
				return {
				
					cssClsElement:'infestor-candidate-captcha-input-cell ' + this.cssClsElementInlineBlock
								
				};
				
			
			},this)
				
		
		}).renderTo(this.elementFieldContent);
		
		!this.allowNull && this.fieldInput.element.addClass(this.cssClsFieldStatusNotNull);
		
		this.fieldInput.element.focus(function(){
		
			this.emit('focus',arguments,this);
		
		},this).blur(function(){
		
			this.emit('blur',arguments,this);
		
		},this).click(function(e){
		
			infestor.stopPropagation(e);
			
		});
		
		return this;
	
	},
	
	focus:function(){
	
		this.isFocus = true;
		
		return this;
	
	},
	
	blur:function(){
	
		this.isFocus = false;
		
		return this;
	
	},
	
	getValue : function(){
	
		return this.value;
	
	},
	
	setValue : function(value){
	
		
	
	},
	
	clearValue : function(last){
	
	},
	
	setReadOnly : function(readOnly){
	
		this.readOnly =  readOnly ? true : false;
	
		return this;
	
	},
	
	disable : function(){
	
		this.disabled = true;
		
		return this;
	},
	
	enable : function(){
	
		this.disabled = false;
		
		return this;

	},
	
	
	// #new methods
	
	// # rewite methods
	
	destroy:function(){
	
		this.captchaTip = this.captchaTip && this.captchaTip.destroy();
		this.callParent();
	
	}

});
