

infestor.define('infestor.widget.CircularMenu', {

	alias : 'circularmenu',

	extend : 'infestor.Element',

	cssUses : 'infestor.Widget',

	cssClsElement : 'infestor-widget-circular-menu',
	cssClsCMenuContainer :'infestor-widget-circular-menu-container',
	cssClsCMenuItem:'infestor-widget-circular-menu-item',
	cssClsCMenuItemHidden:'infestor-widget-circular-menu-item-hidden',
	
	cssClsCMenuItems:{
	
		center:'infestor-widget-circular-menu-item-center',
		north:'infestor-widget-circular-menu-item-north',
		south:'infestor-widget-circular-menu-item-south',
		east:'infestor-widget-circular-menu-item-east',
		west:'infestor-widget-circular-menu-item-west',
		northEast:'infestor-widget-circular-menu-item-ne',
		northWest:'infestor-widget-circular-menu-item-nw',
		southEast:'infestor-widget-circular-menu-item-se',
		southWest:'infestor-widget-circular-menu-item-sw'
	
	},
	
	// cssClsCMenuItemCenter:'infestor-widget-circular-menu-item-center',
	// cssClsCMenuItemNorth:'infestor-widget-circular-menu-item-north',
	// cssClsCMenuItemSouth:'infestor-widget-circular-menu-item-south',
	// cssClsCMenuItemEast:'infestor-widget-circular-menu-item-east',
	// cssClsCMenuItemWest:'infestor-widget-circular-menu-item-west',
	// cssClsCMenuItemNorthWest:'infestor-widget-circular-menu-item-nw',
	// cssClsCMenuItemNorthEast:'infestor-widget-circular-menu-item-ne',
	// cssClsCMenuItemSouthWest:'infestor-widget-circular-menu-item-sw',
	// cssClsCMenuItemSouthEast:'infestor-widget-circular-menu-item-se',
	
	draggable : true,
	
	btnConfig:{
	
		north:{
		
			name:'north',
			cssCls:'infestor-widget-circular-menu-item-north',
			prompt:'north-prompt'
			
		},
		south:{
			
			name:'south',
			cssCls:'infestor-widget-circular-menu-item-south',
			prompt:'south-prompt'
		
		},
		west:{
			
			name:'west',
			cssCls:'infestor-widget-circular-menu-item-west',
			prompt:'west-prompt'
		
		},
		east:{
		
			name:'east',
			cssCls:'infestor-widget-circular-menu-item-east',
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
		
		// this.delegate(this,'mouseover',true,function(inst,e){
		
			// this.circularContainer.show(true);
		
		// },this);
		
		// this.delegate(this,'mouseout',true,function(inst,e){
		
			// this.circularContainer.hide(true);
		
		// },this);
		
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
			
				var config = this.btnConfig[name],
					cls = config ? (config.cssCls || this.cssClsCMenuItems[name]) : this.cssClsCMenuItemHidden;
				
				config && (config.cssCls = cls);
				
				return {
				
					cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,cls].join(' '),
					name:name,
					tipTrend:'bottom',
					tipDrift:'14',
					tip:config && config.prompt || false,
					floatData : config || false
					
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
		
		mi.element.removeClass(mi.floatData.cssCls);
		si.element.removeClass(si.floatData.cssCls);
		
		sw = mi.floatData;
		mi.floatData = si.floatData;
		si.floatData = sw;
		
		mi.tip = mi.floatData.prompt;
		si.tip = si.floatData.prompt;
	
		mi.element.addClass(mi.floatData.cssCls);
		si.element.addClass(si.floatData.cssCls);
	
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
