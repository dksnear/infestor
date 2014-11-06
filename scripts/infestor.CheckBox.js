 

infestor.define('infestor.Checkbox',{

	alias:'checkbox',

	extend:'infestor.Element',
	
	//cssUses:['infestor.Checkbox'],
		
	cssClsElement:'infestor-checkbox',
	cssClsChecked :'infestor-checkbox-checked',
	cssClsHalfChecked :'infestor-checkbox-half-checked',
	cssClsDisabled :'infestor-checkbox-disabed',
	cssClsFocus:'infestor-checkbox-focus',
	
	disableEvent: false,
	
	disabled :false,
	
	checked : false,
	
	isfocus : false,
	
	halfChecked :false,
	
	tabIndex :-1,
	
	events:{
	
		// @params target,eventArgs 
		// @this button
		click:null
	
	},
	
	init:function(){
	
		this.callParent();
		
	
	},
	
	initEvents:function(){
	
		if(this.disableEvent) return;
	
		this.delegate(this,'click',true,function(inst,e){
		
			this.emit('click',[this.checked,inst,e],this);
			this.checked ? this.unCheck() : this.check();
		
		},this);
	
	},
	
	initElement:function(){
	
		this.callParent(); 
		
		this.element.attr('tabindex',this.tabIndex);
		
		if(this.disabed)
			return this.addClass(this.cssClsDisabled);
		
		this.isFocus && this.addClass(this.cssClsFocus);
		this.checked && this.addClass(this.cssClsChecked);
		this.halfChecked && this.addClass(this.cssClsHalfChecked);
	
	},
	
	setText:function(){
	
		return this;
	},
	
		
	disable:function(){
	
		if(this.disabled) return this;
		
		this.element.addClass(this.cssClsDisabled);
		
		this.disabled = true;
		
		return this;
	
	},
	
	
	enable:function(){
	
		if(!this.disabled) return this;
		
		this.element.removeClass(this.cssClsDisabled);
		
		this.disabled = false;
		
		return this;
	
	},
	
	focus:function(){
	
		if(this.disabed || this.isFocus) return this;
		
		this.element.addClass(this.cssClsFocus);
		
		this.isFocus = true;
		
		return this;
	
	},
	
	blur:function(){
	
		if(this.disabed || !this.isFocus) return this;
		
		this.element.removeClass(this.cssClsFocus);
		
		this.isFocus = false;
		
		return this;
	
	},

	
	check:function(){
	
		if(this.disabled || this.checked) return this;
		
		this.element.addClass(this.cssClsChecked);
		
		this.checked = true;
		
		return this;
		
	
	},
	
	unCheck:function(){
	
		if(this.disabled || !this.checked) return this;
		
		this.element.removeClass(this.cssClsChecked);
		
		this.checked = false;
		
		return this;
	
	},
	
	halfCheck:function(){
	
		if(this.disabled || this.halfChecked) return this;
		
		this.element.addClass(this.cssClsHalfChecked);
		
		this.halfChecked = true;
		
		return this;
	
	},
	
	unHalfCheck:function(){
	
		if(this.disabled || !this.halfChecked) return this;
		
		this.element.removeClass(this.cssClsHalfChecked);
	
		this.halfChecked = false;
		
		return this;
	
	}
	

});