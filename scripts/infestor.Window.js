
// 基本窗口类

infestor.define('infestor.Window', {

	alias : 'window',
	extend : 'infestor.Panel',
	uses:'infestor.Button',
	cssUses : ['infestor.Window'],

	statics : {
	
		alert:function(msg,confirmFn,parent,scope){
			
		
			var win = infestor.create('infestor.Window',{

				dock:'center',
				draggable:true,
				modal:false,
				itemLayout:'vertical',
				padding:'0 10 10 10',
				closable:true,
				text:msg,
				titleText:'TIPS',
				width:300,
				// height:300,
				modal:false,
				rear:{
				
					alias:'element',
					itemLayout:'horizon',
					position:'relative',
					height:25,
					items:[{
					
						alias:'button',
						boxShadow:true,
						padding:'5 0',
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
		
		confirm:function(msg,confirmFn,canncelFn){
		
			var win = infestor.create('infestor.Window',{

				dock:'center',
				draggable:false,
				modal:false,
				itemLayout:'vertical',
				padding:'0 0 10 0',
				closable:true,
				items:[{
				
					alias:'element',
					itemLayout:'horizon',
					padding:'0 0 0 25',
					
					itemsOpts:{
				
						alias:'button',
						boxShadow:true,
						margin:'0 10 0 0',
						padding:'5 0'
						
					},
					items:[{
					
						text:'提交',
						events:{
						
							click:function(){
							
								viewList.form.submit();
							   //alert(infestor.jsonEncode(viewList.form.getData()));
							
							}
						}
					
					},{
						
						text:'取消'
					}]
					
				}]

			});
			
			win.show();
			
			return win;
		},
		
		error:function(msg,confirm){
		
		}
	},

	cssClsElement : 'infestor-window',
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
