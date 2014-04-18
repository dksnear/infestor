

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
	
	}


})