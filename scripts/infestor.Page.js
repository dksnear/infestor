

// 页面接口

infestor.define('infestor.Page', {

	extend : 'infestor.Panel',
	
	uses:'infestor.HashManager',
	
	hashManager:null,
	
	initElement : function () {

		this.callParent();
		this.renderTo(infestor.Dom.getBody());

	},
	
	show : function(args){
		
		return this.callParent();
	},
	
	hide : function(){
		
		return this.callParent();
	},
	
	redirect : function(){
		
		this.hashManager && this.hashManager.redirect.apply(this.hashManager,arguments);
	},
	
	hashRedirect : function(name){
		
		location.hash = '#/'+name.replace(/\./g,'/');
	}
	
});
