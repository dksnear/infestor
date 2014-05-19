
infestor.define('infestor.field.Combo',{
	
	alias:'combo',

	extend:'infestor.field.Field',
	
	cssUses:'infestor.Form',
		
	cssClsElement:'infestor-field infestor-combo-field',
	cssClsComboFieldDropDownTrigger:'infestor-combo-field-drop-down-trigger',
	cssClsComboFieldDropDownPanel:'infestor-combo-field-drop-down-panel',
	cssClsComboFieldDropDownItem:'infestor-combo-field-drop-down-item',
	cssClsComboFieldDropDownActiveItem:'infestor-combo-field-drop-down-active-item',
	
	// 下拉按钮
	dropDownTrigger:true,
	dropDownPanel:true,
	
	group:false,

	autoComplete:false,
	
	autoLoad:true,
	
	dataConfig:{
	
		remote:false
	
	},

	initElement:function(){
	
		this.callParent();
		
		this.createDropDownTrigger();
		this.createDropDownPanel();
	
	},
	
	initEvents:function(){
	
		this.on('focus',function(){
		
			this.isFocus = true;
			this.showDropDown();
		
		},this);
		
		this.on('blur',function(){
		
			this.actived = false;		
			this.dropDownPanel.hide();
			this.activeItem && this.activeItem.element.removeClass(this.cssClsComboFieldDropDownActiveItem);
			this.activeItem = null;
		
		});
		
		this.on('keydown',function(e){
			
			//e.preventDefault();
								
			if(e.keyCode != infestor.keyCode.up && e.keyCode != infestor.keyCode.down)
				return;
			
			if(!this.actived){
			
				if(!this.showDropDown())
					return;
				this.activeItem = this.dropDownPanel.getItem(0);
				this.activeIndex = 0;
				this.activeItem && this.activeItem.element.addClass(this.cssClsComboFieldDropDownActiveItem);
				this.actived = true;
				
				return;
			};
			
			
			if(this.dropDownPanel.count<2)
				return;
			
			this.activeItem.element.removeClass(this.cssClsComboFieldDropDownActiveItem);
			
			if(e.keyCode == infestor.keyCode.up)
				this.activeIndex = this.activeIndex==0 ? this.dropDownPanel.count-1 : this.activeIndex-1;
					
			if(e.keyCode == infestor.keyCode.down)
				this.activeIndex = this.activeIndex==this.dropDownPanel.count-1 ? 0 : this.activeIndex+1;
			
			this.activeItem = this.dropDownPanel.getItem(this.activeIndex);
			
			this.activeItem && this.activeItem.element.addClass(this.cssClsComboFieldDropDownActiveItem) && this.setValue(this.activeItem.text);
			
		},this);
		
		this.dataSet && this.dataSet.on('load',function(){
		
			this.dropDownPanel.items = this.dataSet.getData();
			this.dropDownPanel.initItems();
		
		},this);
		
		this.delegate(this.dropDownPanel,'mouseover',function(inst,e){
		
			return inst instanceof infestor.Element && inst.element.hasClass(this.cssClsComboFieldDropDownItem);
		
		},function(inst,e){
			
			this.actived = true;
			this.activeItem && this.activeItem.element.removeClass(this.cssClsComboFieldDropDownActiveItem);
			this.activeItem = inst;
			this.activeIndex = inst.$index;
			inst.element.addClass(this.cssClsComboFieldDropDownActiveItem);
			this.setValue(this.activeItem.text);
		
		},this);
	
	},
	
	createDropDownTrigger:function(){
	
		if(!this.dropDownTrigger) return this;
		
		this.elementDropDownTrigger = this.createDomElement(this.elementFieldContent,this.cssClsComboFieldDropDownTrigger);
		
		infestor.Dom.triangle({
		
			hypotenuse:5,
			bevelTrend:'bottom',
			color:'blue'
		
		}).appendTo(this.elementDropDownTrigger);
		
		this.elementDropDownTrigger.on('click',function(){
					
			this.isFocus ? this.blur() : this.focus();
		
		},this);
		
		return this;
	
	},
	
	createDropDownPanel:function(){
	
		var me=this;
	
		this.dropDownPanel = this.createElement('dropDownPanel', infestor.Dom.getBody(), {
		
			hidden:true,
			itemsConstructMode:'method',
			cssClsElement:this.cssClsComboFieldDropDownPanel,
			boxShadow:true,
			createItem:function(opts){
			
				return infestor.create('infestor.Element',infestor.append({
				
					cssClsElement:me.cssClsComboFieldDropDownItem
					
				},opts));
			
			}
			
		
		}, 'infestor.Panel');
		
	
		return this;
	
	},
	
	showDropDown:function(){
	
		if(!this.dropDownPanel.hasItem())
			return false;
		
		this.dropDownPanel.show(true).autoPosition(this.elementFieldContent,'bottom','0 2');
		
		return true;
	
	}

});
