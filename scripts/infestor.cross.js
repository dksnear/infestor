

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
	
	alert:function(){
	
	
	},
	
	
	error:function(msg){
	
		infestor.mgr.require('infestor.Window',function(){
		
			infestor.Window.alert(msg).show();
		
		});
	
	},
	
	prompt:function(){
	
	
	}


})