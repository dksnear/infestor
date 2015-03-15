
infestor.define('infestor.form.field.Combo',{
	
	alias:'combo',

	extend:'infestor.form.field.Field',
	
	cssUses:'infestor.Form',
		
	cssClsElement:'infestor-field infestor-combo-field',
	cssClsComboFieldDropDownTrigger:'infestor-combo-field-drop-down-trigger',
	cssClsComboFieldDropDownPanel:'infestor-combo-field-drop-down-panel',
	cssClsComboFieldDropDownItem:'infestor-combo-field-drop-down-item',
	cssClsComboFieldDropDownActive:'infestor-combo-field-drop-down-active',
	cssClsComboFieldDropDownMouseOver:'infestor-combo-field-drop-down-mouse-over',
	
	// 下拉按钮
	dropDownTrigger : true,
	dropDownPanel : true,
	
	// vertical | horizon
	dropDownLayout : 'vertical',
	
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
			
			if(this.autoComplete){
				
				this.dropDownPanel.initItems(this.dataSet.getData());
				if(!this.dropDownPanel.hasItem())
					return;
			}
			
			this.showDropDown();

		},this);
		
		this.on('blur',function(e){
		
			this.checkText();
			//this.dropDownPanel.hide();
		
		},this);
		
		this.on('keydown',function(e){
		
			if(!this.dropDownPanel.hasItem())
				return;
			
			if(e.keyCode == infestor.keyCode.enter || e.keyCode == infestor.keyCode.right){
			
				e.preventDefault();
			
				if(this.dropDownPanel.hidden)
					return;
							
				if(this.activeItem){
				
					this.value = this.activeItem.value;
					this.elementFieldInput.val(this.activeItem.text);
				}
				
				this.dropDownPanel.hide();
				return;
			}
			
			if(e.keyCode == infestor.keyCode.esc || e.keyCode == infestor.keyCode.left){
			
				e.preventDefault();
		
				if(this.dropDownPanel.hidden)
					return;
						
				this.checkText();
				this.dropDownPanel.hide();
				return;
			
			}
			
			if(e.keyCode != infestor.keyCode.up && e.keyCode != infestor.keyCode.down)
				return;
			
			e.preventDefault();
			
			if(this.dropDownPanel.hidden)
				return this.dropDownPanel.show(true);
						
			if(!this.activeItem)
				return this.active(0);
			
			if(e.keyCode == infestor.keyCode.up)
				this.activeIndex = this.activeIndex==0 ? this.dropDownPanel.count-1 : this.activeIndex - 1;
					
			if(e.keyCode == infestor.keyCode.down)
				this.activeIndex = this.activeIndex==this.dropDownPanel.count-1 ? 0 : this.activeIndex + 1;
			
			this.active(this.activeIndex);
			
			this.elementFieldInput.val(this.activeItem.text);
			this.elementFieldInput.setSelectionRange(0,this.activeItem.text.length);
			
			this.mouseOverItem && this.mouseOverItem.element.removeClass(this.cssClsComboFieldDropDownMouseOver);
			
		},this);
		
		this.dataSet && this.dataSet.on('load',function(){
		
			this.dropDownPanel.items = this.dataSet.getData();
			this.dropDownPanel.initItems();
			this.setValue(this.value);
		
		},this);
		
		this.delegate(this.dropDownPanel,'mouseover',function(inst,e){
		
			return inst instanceof infestor.Element && inst.element.hasClass(this.cssClsComboFieldDropDownItem);
		
		},function(inst,e){
			
			this.mouseOverItem  && this.mouseOverItem.element.removeClass(this.cssClsComboFieldDropDownMouseOver);
			
			if(inst.actived)
				return this.mouseOverItem = null;
			
			this.mouseOverItem = inst;
			this.mouseOverItem.element.addClass(this.cssClsComboFieldDropDownMouseOver);
		
		},this);
		
		this.delegate(this.dropDownPanel,'click',function(inst,e){
		
			return inst instanceof infestor.Element && inst.element.hasClass(this.cssClsComboFieldDropDownItem);
		
		},function(inst,e){
		
			this.active(inst.$index);
			this.value = this.activeItem.value;
			this.elementFieldInput.val(this.activeItem.text);
			this.dropDownPanel.hide();
				
		},this,true);
		
		
		if(!this.autoComplete)
			return this;
		
		// autoComplete
		
		this.on('keyup',function(e){
	
			var text;
				
			if(e.keyCode != infestor.keyCode.backspace && !infestor.keyCode.isNumber(e.keyCode) && !infestor.keyCode.isLetter(e.keyCode))
				return;
					
			text = this.elementFieldInput.val();
								
			this.dropDownPanel.initItems(!text ? this.dataSet.getData() : this.autoSearch(text,this.dataSet.getData(),function(idx,obj){ return obj.text;  }));
			
			if(!this.dropDownPanel.hasItem())
				return this.dropDownPanel.hide();
			
			this.active(0);
		
			this.showDropDown();
			
			if(e.keyCode == infestor.keyCode.backspace)
				return;
			
			this.elementFieldInput.val(this.activeItem.text);
			this.elementFieldInput.setSelectionRange(text.length,this.activeItem.text.length);
			
		
		},this);
		
		return this;
	
	},
	
	blur : function(){
		
		this.callParent();
		this.dropDownPanel && this.dropDownPanel.hide();
		
	},
	
	active : function(index){
	
		this.activeItem && this.activeItem.element.removeClass(this.cssClsComboFieldDropDownActive) && (this.activeItem.actived = false);
		this.activeIndex = index;
		this.activeItem = this.dropDownPanel.getItem(index);	
		this.activeItem && this.activeItem.element.addClass(this.cssClsComboFieldDropDownActive) && (this.activeItem.actived = true);
	
	},
	
	checkText : function(){
	
		var text = this.elementFieldInput.val(),value;
	
		if(!text)
			return this.value = '',this;
		
		value = this.dataSet.searchData('text',text,'value');
	
		if(infestor.isNull(value))
			return this.elementFieldInput.val(this.activeItem ? this.activeItem.text : ''),this;
	
		this.value = value;
		
		return this;
	},
	
	getText : function(){
		
		return this.elementFieldInput.val();
		
	},
		
	getValue :function(){
	
		
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
	
	createDropDownTrigger:function(){
	
		if(!this.dropDownTrigger) return this;
		
		this.elementDropDownTrigger = this.createDomElement(this.elementFieldContent,this.cssClsComboFieldDropDownTrigger);
		
		// !this.allowNull && this.elementDropDownTrigger.addClass(this.cssClsFieldStatusNotNull);
		
		infestor.Dom.triangle({
		
			hypotenuse:5,
			bevelTrend:'bottom',
			color:'blue'
		
		}).appendTo(this.elementDropDownTrigger);
		
		this.elementDropDownTrigger.on('click',function(e){
			
			infestor.stopPropagation(e);
			
			if(this.dropDownPanel.hidden){

				if(this.autoComplete){
				
					this.dropDownPanel.initItems(this.dataSet.getData());
					if(!this.dropDownPanel.hasItem())
						return;
				}
				
				this.showDropDown();
				return;
			};
			
			this.dropDownPanel.hide();
			
		},this);
		
		return this;
	
	},
	
	createDropDownPanel:function(){
	
		var me = this;
	
		this.dropDownPanel = this.createElement('dropDownPanel', infestor.Dom.getBody(), {
		
			hidden : true,
			hideWithResize : true,
			hideWithBlur : true,
			blockBubble : false,
			itemsConstructMode : 'method',
			cssClsElement : this.cssClsComboFieldDropDownPanel,
			boxShadow : true,
			itemLayout : this.dropDownLayout,
			events : {
			
				afterhide : function(p,tag){
				
					if(tag.hideWithBlur)
						me.checkText();
				
				}
			
			},
			createItem : function(opts){
			
				return infestor.create('infestor.Element',infestor.append({
				
					cssClsElement:me.cssClsComboFieldDropDownItem
					
				},opts));
			
			}
			
		
		}, 'infestor.Panel');
		
		return this;
	
	},
	
	showDropDown:function(){
	
		var dropWidth = this.dropDownPanel.element.width(),
			contentWidth = this.elementFieldContent.width();
			
		if(dropWidth < contentWidth)
			this.dropDownPanel.element.css('width',infestor.px(contentWidth - this.dropDownPanel.element.width('bp')));
		
		this.dropDownPanel.autoPosition(this.elementFieldContent,'bottom','0 2');
			
		this.dropDownPanel.show(true);
		
		return this;
	
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
