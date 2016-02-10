

// 为了避免依赖倒置 提供一些跨越性的访问方法

infestor.namespace('infestor.cross',{

	showMask:function(){
	
		infestor.mgr.require('infestor.Element',function(){
		
			infestor.Element.showMask();
		
		});
	
	},
	
	hideMask:function(){
	
		infestor.mgr.require('infestor.Element',function(){
		
			infestor.Element.hideMask();
		
		});
	
	},
	
	choice : function(msg,aye,nay,parent,scope){
	
		var args = arguments;
	
		infestor.mgr.require('infestor.Window',function(){
		
			infestor.Window.choice.apply(scope || window,args).show();
		
		});
	
	},
	
	error:function(msg){
	
		infestor.mgr.require('infestor.Window',function(){
		
			infestor.Window.alert(msg).show();
		
		});
	
	},
	
	prompt:function(msg){
	
		infestor.mgr.require('infestor.Window',function(){
		
			infestor.Window.alert(msg).show().initAutoHide(3,false);
		
		});
	
	}


});