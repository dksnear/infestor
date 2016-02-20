

// 快捷方法

infestor.define('infestor.Hot',{
	
	uses : ['infestor.Window'],

	statics : {
		
		showMask : function(){
			
			infestor.Element.showMask();
		},
		
		hideMask : function(){
		
			infestor.Element.hideMask();
		
		},
		
		choice : function(msg,aye,nay,parent,scope){
		
			infestor.Window.choice.apply(scope || window,arguments).show();
		
		},
		
		error:function(msg){

			infestor.Window.alert(msg).show();			
		},
		
		prompt:function(msg){
		
			infestor.Window.alert(msg).show().initAutoHide(3,false);
		}

	}
	
});