

infestor.define('infestor.widget.CircularMenu', {

	alias : 'circularmenu',

	extend : 'infestor.Element',

	cssUses : 'infestor.Widget',

	cssClsElement : 'infestor-widget-circular-menu',
	cssClsCMenuContainer :'infestor-widget-circular-menu-container',
	cssClsCMenuItem:'infestor-widget-circular-menu-item',
	cssClsCMenuItemCenter:'infestor-widget-circular-menu-item-center',
	cssClsCMenuItemNorth:'infestor-widget-circular-menu-item-north',
	cssClsCMenuItemSouth:'infestor-widget-circular-menu-item-south',
	cssClsCMenuItemEast:'infestor-widget-circular-menu-item-east',
	cssClsCMenuItemWest:'infestor-widget-circular-menu-item-west',
	cssClsCMenuItemNorthWest:'infestor-widget-circular-menu-item-nw',
	cssClsCMenuItemNorthEast:'infestor-widget-circular-menu-item-ne',
	cssClsCMenuItemSouthWest:'infestor-widget-circular-menu-item-sw',
	cssClsCMenuItemSouthEast:'infestor-widget-circular-menu-item-se',
	
	initElement : function(){
	
		this.callParent();
		this.createCircularContainer();
	},
	
	initEvents : function(){

		this.delegate(this,'click',true,function(inst,e){
		
			this.circularContainer.show(true);
		
		},this,true);
		
		this.delegate(this.circularContainer,'click',true,function(inst,e){
		
			if(!inst || !inst.element || !inst.element.hasClass(this.cssClsCMenuItem))
				return;
			
			switch(inst.name){
			
				case 'center':
					this.circularContainer.hide();
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
		
			items:[{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemNorthWest].join(' '),
				name:'north-west'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemNorth].join(' '),
				name:'north'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemNorthEast].join(' '),
				name:'north-east'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemWest].join(' '),
				name:'west'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemCenter].join(' '),
				name:'center'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemEast].join(' '),
				name:'east'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemSouthWest].join(' '),
				name:'south-west'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemSouth].join(' '),
				name:'south'
			
			},{
				
				cssClsElement:[this.cssClsElementInlineBlock,this.cssClsCMenuItem,this.cssClsCMenuItemSouthEast].join(' '),
				name:'south-east'
			
			}]
		
		}).renderTo(this);
		
		return this;
	
	},
	
	destroy : function(){
	
		this.circularContainer = this.circularContainer && this.circularContainer.destroy();
		
		this.callParent();
	
	}
	
});
