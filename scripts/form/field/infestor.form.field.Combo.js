
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
	
		remote:false,
		modelMap : {
		
			text:'text',
			value:'value'
		
		}
	
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
			
			this.hideDropDown();
			this.activeItem && this.activeItem.element.removeClass(this.cssClsComboFieldDropDownActiveItem);
			this.activeItem = null;
		
		});
		
		this.on('keydown',function(e){
			
			if(e.keyCode == infestor.keyCode.enter){
			
				if(this.activeItem){
				
					this.value = this.activeItem.value;
					this.elementFieldInput.val(this.activeItem.text);
				}
				
				this.hideDropDown();
				return;
			}
			
			if(e.keyCode == infestor.keyCode.esc){
			
				this.hideDropDown();
				return;
			
			}
			
			if(e.keyCode != infestor.keyCode.up && e.keyCode != infestor.keyCode.down)
				return;
			
			this.dropDownPanel.show();
			
			e.preventDefault();
			
			if(!this.actived){
			
				if(!this.showDropDown())
					return;
				this.activeItem = this.dropDownPanel.getItem(0);
				this.activeIndex = 0;
				this.activeItem && this.activeItem.element.addClass(this.cssClsComboFieldDropDownActiveItem);
				this.value = this.activeItem.value;
				this.elementFieldInput.val(this.activeItem.text);
				
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
			
			this.activeItem && this.activeItem.element.addClass(this.cssClsComboFieldDropDownActiveItem);
			
			this.value = this.activeItem.value;
			this.elementFieldInput.val(this.activeItem.text);
			
		},this);
		
		this.dataSet && this.dataSet.on('load',function(){
		
			this.dropDownPanel.items = this.dataSet.getData();
			this.dropDownPanel.initItems();
		
		},this);
		
		this.delegate(this.dropDownPanel,'mouseover',function(inst,e){
		
			return inst instanceof infestor.Element && inst.element.hasClass(this.cssClsComboFieldDropDownItem);
		
		},function(inst,e){
			
			this.activeItem && this.activeItem.element.removeClass(this.cssClsComboFieldDropDownActiveItem);
			this.activeItem = inst;
			this.activeIndex = inst.$index;
			inst.element.addClass(this.cssClsComboFieldDropDownActiveItem);
			
			this.value = this.activeItem.value;
			this.elementFieldInput.val(this.activeItem.text);
		
		},this);
		
		
		if(!this.autoComplete)
			return this;
		
		// autoComplete
		
		this.on('keyup',function(e){
	
			var text;
				
			if(e.keyCode != infestor.keyCode.backspace && !infestor.keyCode.isNumber(e.keyCode) && !infestor.keyCode.isLetter(e.keyCode))
				return;
					
			text = this.elementFieldInput.val();
						
			this.dropDownPanel.items = !text ? this.dataSet.getData() : this.autoSearch(text,this.dataSet.getData(),function(idx,obj){ return obj.text;  });
			
			if(!this.dropDownPanel.items || this.dropDownPanel.items.length < 1)
				return;
			
			this.dropDownPanel.initItems();
			
			this.activeItem = this.dropDownPanel.getItem(0);
			this.activeIndex = 0;
			this.activeItem && this.activeItem.element.addClass(this.cssClsComboFieldDropDownActiveItem);
		
			this.showDropDown();
		
		},this);
		
		return this;
	
	},
	
	
	getValue :function(){
	
		var value;
		
		if(this.disabled) return null;
		
		return this.value;
	
	},
	
	setValue:function(value){
	
		var text;
		
		if(this.disabled || infestor.isNull(value)|| infestor.isUndefined(value))
			return;
		
		if(!this.dataSet)
			return this.callParent();
		
		text = this.dataSet.searchData('value',value,'text');
	
		if(text!==null){
		
			this.value = value;
			this.elementFieldInput && this.elementFieldInput.val(text);
		}
	},
	
	clearValue:function(){

		this.setValue('');
		
		return this;
	
	},
	
	
	createDropDownTrigger:function(){
	
		if(!this.dropDownTrigger) return this;
		
		this.elementDropDownTrigger = this.createDomElement(this.elementFieldContent,this.cssClsComboFieldDropDownTrigger);
		
		// !this.allowNull && this.elementDropDownTrigger.addClass(this.cssClsFieldStatusNotNull);
		
		infestor.Dom.triangle({
		
			hypotenuse:5,
			bevelTrend:'bottom',
			color:'blue'
		
		}).appendTo(this.elementDropDownTrigger);
		
		this.elementDropDownTrigger.on('click',function(){
					
			this.dropDownPanel.hidden ? this.showDropDown() : this.hideDropDown();
		
		},this);
		
		return this;
	
	},
	
	createDropDownPanel:function(){
	
		var me = this;
	
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
		
		var dropWidth = this.dropDownPanel.element.width(),
			contentWidth = this.elementFieldContent.width();
			
		if(dropWidth < contentWidth)
			this.dropDownPanel.element.css('width',infestor.px(contentWidth));
		
		this.dropDownPanel.autoPosition(this.elementFieldContent,'bottom','0 2');
			
		this.dropDownPanel.show(true);
		
		this.actived = true;
		
		return true;
	
	},
	
	hideDropDown:function(){
	
		this.dropDownPanel.hide();
		this.actived = false;
	
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
