
infestor.define('infestor.field.Combo',{
	
	alias:'combo',

	extend:'infestor.field.Field',
	
	cssUses:'infestor.Form',
	
	cssClsElement:'infestor-field infestor-combo-field',
	cssClsFieldComboTrigger:'infestor-combo-field-trigger',
	
	// 下拉按钮
	trigger:true,

	initElement:function(){
	
		this.callParent();
		
		this.createComboTrigger();
		
	
	},
	
	initEvents:function(){
	
		
	
	},
	
	createComboTrigger:function(){
	
		if(!this.trigger) return this;
		
		this.elementComboTrigger = this.createDomElement(this.elementFieldContent,this.cssClsFieldComboTrigger);
		
		infestor.Dom.triangle({
		
			hypotenuse:5,
			bevelTrend:'bottom',
			color:'blue'
		
		}).appendTo(this.elementComboTrigger);
		
		return this;
	
	}



});
