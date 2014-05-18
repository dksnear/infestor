
infestor.define('infestor.field.Combo',{
	
	alias:'combo',

	extend:'infestor.field.Field',
	
	cssUses:'infestor.Form',
	
	statics:{
	
		groupMap:{},
		
		clearGroup:function(name){
		
		
			if(arguments.length < 1)
				infestor.each(infestor.field.Combo.groupMap,function(name){
				
					infestor.field.Combo.clearGroup(name);
				
				});
		
			if(!infestor.field.Combo.groupMap[name])
				return false;
			
			infestor.each(infestor.field.Combo.groupMap[name],function(){
			
				(this instanceof infestor.Element || this instanceof infestor.Dom) && this.destroy();
			
			});
			
			return delete infestor.field.Combo.groupMap[name];
			
		
		},
		
		addGroup:function(name,contents){
		
			infestor.field.Combo.groupMap[name] = infestor.field.Combo.groupMap[name] || {};
			
			infestor.append(infestor.field.Combo.groupMap[name],contents);
		
		}
	
	},
	
	cssClsElement:'infestor-field infestor-combo-field',
	cssClsFieldComboTrigger:'infestor-combo-field-trigger',
	
	// 下拉按钮
	trigger:true,
	
	group:false,
	
	comboPanel:null,
	
	autoComplete:false,

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
	
	},
	
	createComboPanel:function(){
	
	
	}



});
