
infestor.define('infestor.form.field.Checkbox', {

	alias : 'checkboxfield',

	extend : 'infestor.form.field.Field',

	uses : ['infestor.Checkbox'],
	
	cssUses : ['infestor.form'],

	cssClsElement : 'infestor-field',

	// 字段名
	fieldName : null,

	checked : true,
	value : null,	
	layout : 'table',	
	
	tabIndex:-1,
	
	allowCheckStatus:false,
	
	// #rewite methods
	
	initEvents : function(){
	
		this.fieldInput.on('click',function(){
			
			this.value = this.fieldInput.checked ? 1 : 0;
					
		},this);
	
	},
	
	createInput : function(){
	
		this.fieldInput = this.fieldInput || infestor.create('infestor.Checkbox',{
		
			tabIndex : this.tabIndex,
			checked : this.value ? true : false,
			disabled : this.disabled
		
		}).renderTo(this);
				
		return this;
	
	},
	
	focus:function(){
	
		this.isFocus = true;
		
		this.fieldInput.focus();
		
		return this;
	
	},
	
	blur:function(){
	
		this.isFocus = false;
		
		this.fieldInput.blur();
		
		return this;
	
	},
	
	getValue : function(){
	
		return this.value || 0;
	
	},
	
	setValue : function(value){
	
		this.value = value ? 1 : 0;
		
		this.value ? this.fieldInput.check() : this.fieldInput.unCheck();
		
		return this;
	
	},
	
	clearValue : function(last){
	
		this.setValue();
		
		return this;
	},
	
	setReadOnly : function(readOnly){
	
		this.readOnly =  readOnly ? true : false;
		
		if(this.readOnly)
			this.disable();
		else this.enable();
	
		return this;
	
	},
	
	disable : function(){
	
		this.fieldInput.disable();
	
		this.disabled = true;
		
		return this;
	},
	
	enable : function(){
	
		this.fieldInput.enable();
	
		this.disabled = false;
		
		return this;

	},
	
	
	destroy:function(){
	
		this.callParent();
	
	}

});
