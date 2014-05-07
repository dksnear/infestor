
// 基本窗口类

infestor.define('infestor.Window', {

	alias : 'window',
	extend : 'infestor.Panel',
	uses:'infestor.Button',
	cssUses : ['infestor.Window'],

	statics : {
	
		// 提醒
		alert:function(msg,parent){
		
			var win = infestor.create('infestor.Window',{

				dock:'center',
				modal:false,
				closable:true,
				titleText:'提示',
				modal:false,
				items:[{
				
					alias:'element',
					cssClsElement:infestor.Element.prototype.cssClsElementText,
					text:msg
				
				}]
			});
				
			parent = parent || infestor.Dom.getBody();
			
			win.renderTo(parent);
			
			//win.show();
			
			return win;
		
		},
	
		// 确认
		confirm:function(msg,confirmFn,parent,scope){
			
		
			var win = infestor.create('infestor.Window',{

				dock:'center',
				modal:false,
				closable:true,
				titleText:'确认',
				modal:false,
				items:[{
				
					alias:'element',
					cssClsElement:infestor.Element.prototype.cssClsElementText,
					text:msg
				
				}],
				rear:{
				
					alias:'element',
					items:[{
					
						alias:'button',
						boxShadow:true,
						position:'absolute',
						top:0,
						right:0,
						text:'确定',
						events:{
						
							click:function(){
							
								confirmFn && confirmFn.call(scope || this);
								
								win.close();
							
							}
						}
					
					}]
					
				}

			});
			
			parent = parent || infestor.Dom.getBody();
			
			win.renderTo(parent);
			
			//win.show();
			
			return win;
		
		},
		
		// 抉择
		choice:function(msg,ayeFn,nayFn,parent,scope){
		
			var win = infestor.create('infestor.Window',{

				dock:'center',
				modal:false,
				closable:true,
				titleText:'抉择',
				modal:false,
				items:[{
				
					alias:'element',
					cssClsElement:infestor.Element.prototype.cssClsElementText,
					text:msg
				
				}],
				rear:{
				
					alias:'element',		
					items:[{
					
						alias:'element',
						itemLayout:'horizon',
						position:'absolute',
						top:0,
						right:0,
						itemsOpts:{
					
							alias:'button',
							boxShadow:true
					
						},
						items:[{
							
							margin:'0 10 0 0',
							text:'是',
							events:{
							
								click:function(){
								
									ayeFn && ayeFn.call(scope || this);
									
									win.close();
								
								}
							}
						
						},{
									
							text:'否',
							events:{
							
								click:function(){
								
									nayFn && nayFn.call(scope || this);
									
									win.close();
								
								}
							}
						
						}]
								
					}]
					
				}

			});
			
			parent = parent || infestor.Dom.getBody();
			
			win.renderTo(parent);
			
			//win.show();
			
			return win;
		},
		
		error:function(msg,confirm){
		
		}
	},

	cssClsElement : 'infestor-window',
	cssClsHead : 'infestor-window-head',
	cssClsBody : 'infestor-window-body',
	cssClsRear : 'infestor-window-rear',
	cssClsTitle : 'infestor-window-title',
	boxShadow : true,
	dock:'center',

	// 模态窗口(bool)
	modal : true,

	initElement : function () {

		this.callParent();
		
		this.show();

	},

	show : function () {

		if (!this.element)
			return this;

		this.modal && infestor.Element.showMask();

		this.element.zIndex().show();

		return this;

	},

	hide : function () {

		if (!this.element)
			return this;

		this.modal && infestor.Element.hideMask();

		this.element.hide();

		return this;
	},


	destroy : function () {

		return this.hide() && this.callParent();

	}

});
