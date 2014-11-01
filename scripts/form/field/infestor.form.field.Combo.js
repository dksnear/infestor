
infestor.define('infestor.form.field.Combo',{
	
	alias:'combo',

	extend:'infestor.form.field.Field',
	
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

	autoComplete:true,
	
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
									
			if(e.keyCode != infestor.keyCode.up && e.keyCode != infestor.keyCode.down)
				return;
				
			e.preventDefault();
			
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
			
			this.activeItem && this.activeItem.element.removeClass(this.cssClsComboFieldDropDownActiveItem);
			
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
		
		
		if(!this.autoComplete)
			return this;
		
		// autoComplete
		
		this.on('keyup',function(e){
	
			var value = this.getValue();
			
			if(this.value == value) return;
			
			this.dropDownPanel.items = !value ? this.dataSet.getData() : this.autoSearch(value,this.dataSet.getData(),function(idx,obj){ return obj.text;  });
			this.dropDownPanel.initItems();
			
			this.activeItem = this.dropDownPanel.getItem(0);
			this.activeIndex = 0;
			this.activeItem && this.activeItem.element.addClass(this.cssClsComboFieldDropDownActiveItem);
			this.actived = true;
		
			this.showDropDown();
		
		},this);
		
		return this;
	
	},
	
	createDropDownTrigger:function(){
	
		if(!this.dropDownTrigger) return this;
		
		this.elementDropDownTrigger = this.createDomElement(this.elementFieldContent,this.cssClsComboFieldDropDownTrigger);
		
		!this.allowNull && this.elementDropDownTrigger.addClass(this.cssClsFieldStatusNotNull);
		
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
		
		this.dropDownPanel.autoPosition(this.elementFieldContent,'bottom','0 2');
		
		this.dropDownPanel.show(true);
		
		return true;
	
	},
	
	autoSearch:function(keyword,set,matchFilter,resultFilter,scope){
		
		var reg,match=[];
		
		if(!keyword) return match;
		
		keyword = String(keyword);
		
		reg = new RegExp('^'+keyword);
		
		infestor.each(set,function(idx,content){
			
			reg.test(infestor.isFunction(matchFilter) ? matchFilter.call(this,idx,content,keyword,reg,set) : content) 
				&& match.push(infestor.isFunction(resultFilter) ? resultFilter.call(this,idx,content,keyword,reg,set) : content);
		
		},scope || this);
		
		return match;
		
	}

});
