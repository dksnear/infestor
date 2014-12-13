
infestor.define('infestor.widget.CircularMenu', {

	alias : 'circularmenu',
	extend : 'infestor.Element',
	cssUses : 'infestor.Widget',

	cssClsElement : 'infestor-widget-circular-menu',
	cssClsCMenuContainer : 'infestor-widget-circular-menu-container',
	cssClsCMenuItem : 'infestor-widget-circular-menu-item',
	
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
	
	cMenuIconMap:{
	
		center : 'shrink',
		north : {x:2,y:1},
		south : {x:3,y:1},
		east : {x:4,y:1},
		west : {x:5,y:1},
		northEast : {x:6,y:1},
		northWest : {x:7,y:1},
		southEast : {x:8,y:1},
		southWest : {x:9,y:1}
	
	},
	
	icon:'zoom',
	iconSize:32,
	
	draggable : true,
	
	tipTrend:'bottom',
	tipDrift:'14',
	tip:'菜单',
	
	// direction:{ name:(必须),prompt:(可选),icon:(可选),cssClsIcon:(可选) }	
	btnConfig:{
	
		north:{
		
			name:'north',
			prompt:'north-prompt'
			
		},
		south:{
			
			name:'south',
			prompt:'south-prompt'
		
		},
		west:{
			
			name:'west',
			prompt:'west-prompt'
		
		},
		east:{
		
			name:'east',
			prompt:'east-prompt'
			
		},
		center:{
			
			name:'center',
			prompt:'center-promt',
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
			
			this.focusBtn && this.focusBtn.element.removeClass(this.cssClsGlobalIconFocus32);
			
			this.focusBtn = this.swapFloatData(inst);
			this.focusBtn.element.addClass(this.cssClsGlobalIconFocus32);
			
			switch(inst.name){
			
				case 'center':
					this.collapse();
					break;
				default:
					break;
			}
			
			this.emit('itemClick',[this.focusBtn && this.focusBtn.floatData.name,this.focusBtn,inst]);
			
		
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
				
				config.icon = config.icon || this.cMenuIconMap[name],
				config.cssClsPos = this.cssClsCMenuItemPosMap[name];
				
				return {
				
					cssClsElement:[this.cssClsCMenuItem,config.cssClsPos,config.cssClsIcon].join(' '),
					name:name,
					iconSize:32,
					icon:config.icon,
					tipTrend:'bottom',
					tipDrift:'14',
					tip:config.prompt || false,
					floatData : config
					
				};
			
			},this)
		
		}).renderTo(this);
		
		return this;
	
	},
	
	swapFloatData : function(mi,si){
	
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
		
		mi.setIcon(mi.floatData.icon);
		si.setIcon(si.floatData.icon);
	
		return si;
	
	},
	
	expand:function(){
	
		this.disableDraggable();
		this.disableTip();
		this.circularContainer && this.circularContainer.show(true);
		infestor.clearSelection();
		
	},
	
	collapse:function(){
	
		this.initDraggable();
		this.initTip();
		this.circularContainer && this.circularContainer.hide();
		this.focusBtn && this.focusBtn.element.removeClass(this.cssClsGlobalIconFocus32);
		infestor.clearSelection();
	
	},
	
	destroy : function(){
	
		this.circularContainer = this.circularContainer && this.circularContainer.destroy();
		this.callParent();
	
	}
	
});
