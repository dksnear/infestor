

infestor.define('infestor.widget.ChainMenu', {

	alias : 'chainMenu',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget.ChainMenu',

	cssClsElement : 'infestor-chain-menu',
	cssClsLine : 'infestor-chain-menu-line',
	cssClsNode : 'infestor-chain-menu-node',
	cssClsNodeHover : 'infestor-chain-menu-node-hover',
	
	events:{
	
		// @params item,target,eventArgs 
		// @this chainMenu
		itemClick:null
	
	},
	
	initEvents:function(){
	
		this.delegate(this,'click',function(inst,e){
		
			return inst && inst.cssClsElement == this.cssClsNode;
			
		},function(inst,e){
		
			this.emit('itemClick',[inst.parent,inst,e],this);
		
		},this);
	
	},

	createItem : function (opts) {

		if (!this.count) {

			return infestor.create('infestor.Element', infestor.appendIf({

				items : [{
				
					alias : 'element',
					cssClsElement : this.cssClsNode,
					tip: opts.tip
				}]

			},opts,'tip',null,true));
		}

		return infestor.create('infestor.Element', infestor.appendIf({

			items : [{

				alias : 'element',
				cssClsElement : this.cssClsLine,
				items : [{

					alias : 'element',
					tagName : 'span'

				}]
			}, {

				alias : 'element',
				cssClsElement : this.cssClsNode,
				tip: opts.tip
			}]

		},opts,'tip',null,true));

	}

});
