

infestor.define('infestor.widget.ChainMenu', {

	alias : 'chainmenu',

	extend : 'infestor.Element',

	cssUses : 'infestor.Widget',

	cssClsElement : 'infestor-widget-chain-menu',
	cssClsLine : 'infestor-widget-chain-menu-line',
	cssClsHorizonLine :'infestor-widget-chain-menu-horizon-line',
	cssClsNode : 'infestor-widget-chain-menu-node',
	cssClsNodeHover : 'infestor-widget-chain-menu-node-hover',
	
	itemsConstructMode:'method',
	
	vertical:true,
	
	events:{
	
		// @params item,target,eventArgs 
		// @this chainMenu
		itemClick:null
	
	},
	
	initElement:function(){
	
	
		this.callParent();
		
		if(!this.vertical){
		
			this.tipTrend = 'bottom';
			this.cssClsLine = this.cssClsHorizonLine;
		    this.elementCt = this.createDomElement(this.element,'','table');
			this.elementICt = this.createDomElement(this.elementCt,'','tr');
			this.elementInnerContainer = this.elementICt;
		
		}
	
	},
	
	initEvents:function(){
	
		this.delegate(this,'click',function(inst,e){
		
			return inst && inst.getElement().hasClass(this.cssClsNode);
			
		},function(inst,e){
		
			this.emit('itemClick',[this.getItem(inst.targetName),inst,e],this);
		
		},this);
	
	},
	
	
	createItem:function(opts){
	
		return this.vertical? this.createVerticalItem(opts) : this.createHorizonItem(opts);
	
	},

	createVerticalItem : function (opts) {

		if (!this.count) {

			return infestor.create('infestor.Element', infestor.appendIf({

				items : [{
				
					alias : 'element',
					cssClsElement : this.cssClsNode +' ' + (opts.cssClsTarget || ''),
					targetName:opts.name,
					tip: opts.tip
				}]

			},opts,'tip',null,true));
		}

		return infestor.create('infestor.Element', infestor.appendIf({

			items : [{

				alias : 'element',
				cssClsElement : this.cssClsLine,
				items : [{

					alias : 'element'

				}]
			}, {

				alias : 'element',
				cssClsElement : this.cssClsNode +' '+ (opts.cssClsTarget || ''),
				targetName:opts.name,
				tip: opts.tip
			}]

		},opts,'tip',null,true));

	},
	
	createHorizonItem:function(opts){
	
		if (!this.count) {

			return infestor.create('infestor.Element', infestor.appendIf({

				tagName:'td',
				items : [{
				
					alias : 'element',
					tagName:'table',
					items:[{
					
						alias:'element',
						tagName:'tr',
						items:[{
						
							alias:'element',
							tagName:'td',
							items:[{
							
								alias:'element',
								cssClsElement:this.cssClsNode +' '+ (opts.cssClsTarget || ''),
								targetName:opts.name,
								tip:opts.Tip
							
							}]
						
						}]
					
					}]
				}]

			},opts,'tip',null,true));
		}

		return infestor.create('infestor.Element', infestor.appendIf({

			tagName:'td',
			items : [{
			
				alias : 'element',
				tagName:'table',
				items:[{
				
					alias:'element',
					tagName:'tr',
					items:[{
					
						alias:'element',
						tagName:'td',
						items:[{
						
							alias:'element',
							cssClsElement:this.cssClsLine,
							items:[{
							
								alias:'element'
							
							}]
						
						}]
								
					},{
					
						alias:'element',
						tagName:'td',
						items:[{
						
							alias:'element',
							cssClsElement:this.cssClsNode +' '+ (opts.cssClsTarget || ''),
							targetName:opts.name,
							tip:opts.Tip
						
						}]
					
					}]
				
				}]
			}]

		},opts,'tip',null,true));
	
	
	}

});
