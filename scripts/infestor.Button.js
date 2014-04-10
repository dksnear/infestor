

infestor.define('infestor.Button',{

	alias:'button',
	extend:'infestor.Element',
	cssUses:'infestor.Button',
	
	cssClsElement:'infestor-button',
	elementButtonContainer:null,
	
	layout:'inline-block',
	
	// 声明事件
	events:{
	
		onClick:null,
	
	},
	
	initElement:function(){
	
		this.callParent();
		
		this.elementButtonContainer=this.createDomElement();
		
		this.elementInnerContainer = this.elementButtonContainer;
	
	},
	
	initEvents:function(){
	
		var me=this;
	
		this.elementButtonContainer.click(function(){ me.emit('onClick',arguments); });
	}

})