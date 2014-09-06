

// 测量器类

infestor.define('infestor.widget.Measurer',{

	
	extend:'infestor.Object',
	
	uses:['infestor.Dom','infestor.Drag'],
	
	xLine:null,
	yLine:null,
	xDrag:null,
	yDrag:null,
	
	init:function(){
	
		this.initXLine().initYLine();
	
	},
	
	initXLine:function(){
	
		var me=this;
	
		this.xLine = this.xLine || infestor.Dom.div().css({
		
			position:'fixed',
			height:'4px',
			width:'100%',
			cursor:'row-resize',
			top:'10px',
			'background-color':'black'
		
		}).appendTo(infestor.Dom.getBody());
		
		
		infestor.debounce(function(){
		
		
			me.xDrag = me.xDrag || infestor.create('infestor.Drag',{
		
				element:me.xLine.getElement(),
				
				limit:true,
				
				lockX:true,
				
				cursor:'row-resize',
				
				events:{
				
				
					start:function(){},
					
					move:function(){},
					
					stop:function(){},
					
						
				}
			
			});
			
		},100)();
	
		
		return this;
		
	
	},
	
	initYLine:function(){
	
		var me = this;
	
		this.yLine = this.yLine || infestor.Dom.div().css({
		
			position:'fixed',
			height:'100%',
			width:'4px',
			cursor:'col-resize',
			left:'10px',
		    'background-color':'black'
		
		}).appendTo(infestor.Dom.getBody());
		
		
		infestor.debounce(function(){
		
				me.yDrag = me.yDrag || infestor.create('infestor.Drag',{
		
		
					element:me.yLine.getElement(),
					
					limit:true,
					
					lockY:true,
					
					cursor:'col-resize',
					
					events:{
					
					
						start:function(){},
						
						move:function(){},
						
						stop:function(){},
						
						
					
					}
				
				});

		},100)();
		

		return this;
	
	},
	
	hideXLine:function(){
	
		return this.xLine && this.xLine.hide(),this;
	
	},
	
	hideYline:function(){
	
		return this.yLine && this.yLine.hide(),this;
	
	},
	
	showXLine:function(){
	
		return this.xLine && this.xLine.show(),this;
	
	},
	
	showYLine:function(){
	
		return this.yLine && this.yLine.show(),this;
	
	},
	
	hideAllLine:function(){
	
		return this.showXLine().showYLine();
	
	},
	
	showAllLine:function(){
	
		return this.hideXLine().hideYline();
	
	},
	
	getPostion:function(){
	
		
	
	},
	
	destroy:function(){
	
		this.xDrag = this.xDrag && this.xDrag.destroy();
		this.yDrag = this.yDrag && this.yDrag.destroy();
		this.xLine.destroy();
		this.yLine.destroy();
		
		return null;
	
	}
		
	

});