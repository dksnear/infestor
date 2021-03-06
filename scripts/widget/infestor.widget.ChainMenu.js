

infestor.define('infestor.widget.ChainMenu', {

	alias : 'chainmenu',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget',

	cssClsElement : 'infestor-widget-chain-menu .infestor-element-remove-space',
	cssClsChnMenuHSeparator : 'infestor-widget-chain-menu-separator-h',
	cssClsChnMenuVSeparator : 'infestor-widget-chain-menu-separator-v',
	cssClsChnMenuNode : 'infestor-widget-chain-menu-node',
	cssClsChnMenuItem : 'infestor-widget-chain-menu-item',
	cssClsChnMenuItemVertical : 'infestor-widget-chain-menu-item-vertical',
	
	itemsConstructMode:'method',
	
	// vertical|horizon
	orientation:'vertical',
	
	events:{
	
		// @params item,target,eventArgs 
		// @this chainMenu
		itemClick:null
	
	},
	
	initEvents:function(){
	
		this.delegate(this,'click',function(inst,e){
		
			return inst && inst.getElement().hasClass(this.cssClsChnMenuNode);
			
		},function(inst,e){
		
			this.emit('itemClick',[this.getItem(inst.targetName),inst,e]);
		
		},this);
	
	},

	createItem : function (opts) {

		if (!this.count) {

			return infestor.create('infestor.Element', infestor.appendIf({

				cssClsElement : this.orientedCssClsFix(this.cssClsChnMenuItem),
				
				items : [{
				
					cssClsElement : this.orientedCssClsFix(this.cssClsChnMenuNode) + ' ' + (opts.cssClsTarget || ''),
					targetName:opts.name,
					icon:opts.icon || 'list',
					iconSize:32,
					tip: opts.tip,
					tipPos:this.orientation == 'vertical' ? 'left' : 'bottom',
					tipOffset:this.orientation == 'vertical' ? '8 9 4' : '15'
				}]

			},opts,['tip','icon'],null,true));
		}

		return infestor.create('infestor.Element', infestor.appendIf({

			cssClsElement : this.orientedCssClsFix(this.cssClsChnMenuItem),
		
			items : [{

				name:'saparator',
				cssClsElement : this.orientedCssClsFix(this.orientation == 'vertical' ? this.cssClsChnMenuVSeparator : this.cssClsChnMenuHSeparator)
			
			}, {

				cssClsElement : this.orientedCssClsFix(this.cssClsChnMenuNode) +' '+ (opts.cssClsTarget || ''),
				targetName:opts.name,
				icon:opts.icon || 'list',
				iconSize:32,
				tip: opts.tip,
				tipPos:this.orientation == 'vertical' ? 'left' : 'bottom',
				tipOffset:this.orientation == 'vertical' ? '8 9 4' : '15'
			}]

		},opts,['tip','icon'],null,true));

	},
	
	orientedCssClsFix:function(cssCls){
	
		if(this.orientation == 'horizon')
			return cssCls + ' ' + this.cssClsElementInlineBlock + ' ' + this.cssClsElementRemoveSpace;
		
		if(this.orientation == 'vertical')
			return cssCls + ' ' + this.cssClsChnMenuItemVertical;
		
		return cssCls;
	
	}

});
