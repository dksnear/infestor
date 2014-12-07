

infestor.define('infestor.widget.CircularMenu', {

	alias : 'circularmenu',

	extend : 'infestor.Element',

	cssUses : 'infestor.Widget',

	cssClsElement : 'infestor-widget-circular-menu',
	cssClsCMenuContainer :'infestor-widget-circular-menu-container',
	cssClsCMenuItem:'infestor-widget-circular-menu-item',
	
	cssClsCMenuItemPosMap:{
	
		center:'infestor-widget-circular-menu-item-pos-center',
		north:'infestor-widget-circular-menu-item-pos-north',
		south:'infestor-widget-circular-menu-item-pos-south',
		east:'infestor-widget-circular-menu-item-pos-east',
		west:'infestor-widget-circular-menu-item-pos-west',
		northEast:'infestor-widget-circular-menu-item-pos-ne',
		northWest:'infestor-widget-circular-menu-item-pos-nw',
		southEast:'infestor-widget-circular-menu-item-pos-se',
		southWest:'infestor-widget-circular-menu-item-pos-sw'
	
	},
	
	cssClsCMenuItemIconMap:{
	
		center:'infestor-widget-circular-menu-item-icon-center',
		north:'infestor-widget-circular-menu-item-icon-north',
		south:'infestor-widget-circular-menu-item-icon-south',
		east:'infestor-widget-circular-menu-item-icon-east',
		west:'infestor-widget-circular-menu-item-icon-west',
		northEast:'infestor-widget-circular-menu-item-icon-ne',
		northWest:'infestor-widget-circular-menu-item-icon-nw',
		southEast:'infestor-widget-circular-menu-item-icon-se',
		southWest:'infestor-widget-circular-menu-item-icon-sw'
	
	},
	
	draggable : true,
	
	btnConfig:{
	
		north:{
		
			name:'north',
			cssClsIcon:'infestor-widget-circular-menu-item-icon-north',
			prompt:'north-prompt'
			
		},
		south:{
			
			name:'south',
			cssClsIcon:'infestor-widget-circular-menu-item-icon-south',
			prompt:'south-prompt'
		
		},
		west:{
			
			name:'west',
			cssClsIcon:'infestor-widget-circular-menu-item-icon-west',
			prompt:'west-prompt'
		
		},
		east:{
		
			name:'east',
			cssClsIcon:'infestor-widget-circular-menu-item-icon-east',
			prompt:'east-prompt'
			
		},
		center:{
			
			name:'center',
			disabled:true
		
		},
		northWest:{
		
			name:'north-west',
			prompt:'north-west-prompt'
			
		},
		northEast:{
		
			name:'north-east',
			prompt:'north-east-prompt'
			
		},
		southWest:{
		
			name:'south-west',
			prompt:'south-west-prompt'
			
		},
		southEast:{
		
			name:'south-east',
			prompt:'south-east-prompt'
			
		}
	
	},
	
	initElement : function(){
	
		this.callParent();
		this.createCircularContainer();
	},
	
	initEvents : function(){

		this.delegate(this,'click',true,function(inst,e){
		
			this.expand();
		
		},this,true);
				
		this.delegate(this.circularContainer,'click',true,function(inst,e){
		
			if(!inst || !inst.element || !inst.element.hasClass(this.cssClsCMenuItem))
				return;
			
			this.swapFloat(inst);
			
			switch(inst.name){
			
				case 'center':
					this.collapse();
					break;
				default:
					break;
			}
			
		
		},this,true);
		
	
	},
	
	createCircularContainer : function(){
	
		this.circularContainer = this.circularContainer || infestor.create('infestor.Element',{
		
			cssClsElement:this.cssClsCMenuContainer + ' ' + this.cssClsElementRemoveSpace,
		
			hidden:true,
			
			items:infestor.map(['northWest','north','northEast','west','center','east','southWest','south','southEast'],function(idx,name){
			
				var config = this.btnConfig[name];
				
				if(!config)
					return null;
				
				config.cssClsIcon = config.cssClsIcon || this.cssClsCMenuItemIconMap[name];
				config.cssClsPos = this.cssClsCMenuItemPosMap[name];
				
				return {
				
					cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,config.cssClsPos,config.cssClsIcon].join(' '),
					name:name,
					tipTrend:'bottom',
					tipDrift:'14',
					tip:config.prompt || false,
					floatData : config
					
				};
			
			},this)
		
		}).renderTo(this);
		
		return this;
	
	},
	
	swapFloat : function(mi,si){
	
		var sw,quadrant;
		
		if(!si){
		
			quadrant = this.element.clientQuadrant();
			
			if(quadrant == 1 || quadrant == 4)
				si = this.circularContainer.getItem('west');
			if(quadrant == 2 || quadrant == 3)
				si = this.circularContainer.getItem('east');
		
		}
	
		if(!mi || !si || si.name == mi.name || !mi.floatData || !si.floatData || mi.floatData.disabled || si.floatData.disabled)
			return mi;
		
		mi.element.removeClass(mi.floatData.cssClsIcon);
		si.element.removeClass(si.floatData.cssClsIcon);
			
		sw = mi.floatData;
		mi.floatData = si.floatData;
		si.floatData = sw;
		
		mi.tip = mi.floatData.prompt;
		si.tip = si.floatData.prompt;
	
		mi.element.addClass(mi.floatData.cssClsIcon);
		si.element.addClass(si.floatData.cssClsIcon);
	
		return mi;
	
	},
	
	expand:function(){
	
		this.disableDraggable();
		this.circularContainer && this.circularContainer.show(true);
	
	},
	
	collapse:function(){
	
		this.initDraggable();
		this.circularContainer && this.circularContainer.hide();
	
	},
	
	destroy : function(){
	
		this.circularContainer = this.circularContainer && this.circularContainer.destroy();
		this.callParent();
	
	}
	
});
