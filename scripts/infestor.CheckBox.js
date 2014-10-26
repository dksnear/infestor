 

infestor.define('infestor.Checkbox',{

	alias:'checkbox',

	extend:'infestor.Element',
	
	cssUses:['infestor.Checkbox'],
		
	cssClsElement:'infestor-checkbox',
	cssClsChecked :'infestor-checkbox-checked',
	cssClsHalfChecked :'infestor-checkbox-half-checked',
	cssClsDisabled :'infestor-checkbox-disabed',
	
	disableEvent: false,
	
	disabled :false,
	
	checked : false,
	
	halfChecked :false,
	
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
	
	},
	
	setText:function(){
	
		return this;
	},
	
	enable:function(){
	
		if(!this.disabled) return this;
		
		this.element.removeClass(this.cssClsDisabled);
		
		this.disabled = false;
	
	},
	
	disable:function(){
	
		if(this.disabled) return this;
		
		this.element.addClass(this.cssClsDisabled);
		
		this.disabled = true;
	
	},
	
	check:function(){
	
		if(this.disabled || this.checked) return this;
		
		this.element.addClass(this.cssClsChecked);
		
		this.checked = true;
		
	
	},
	
	unCheck:function(){
	
		if(this.disabled || !this.checked) return this;
		
		this.element.removeClass(this.cssClsChecked);
		
		this.checked = false;
	
	},
	
	halfCheck:function(){
	
		if(this.disabled || this.halfChecked) return this;
		
		this.element.addClass(this.cssClsHalfChecked);
		
		this.halfChecked = true;
	
	},
	
	unHalfCheck:function(){
	
		if(this.disabled || !this.halfChecked) return this;
		
		this.element.removeClass(this.cssClsHalfChecked);
	
		this.halfChecked = false;
	
	}
	

});