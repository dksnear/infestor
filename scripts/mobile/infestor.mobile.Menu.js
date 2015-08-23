 

infestor.define('infestor.mobile.Menu',{

	alias:'mobile-menu',
	extend:'infestor.Element',
	cssUses:'infestor.mobile',
	
	cssClsElement:'infestor-mobile-menu',
	cssClsHorizon:'infestor-mobile-menu-h',
	cssClsVertical:'infestor-mobile-menu-v',
	cssClsTrigger:'infestor-mobile-menu-trigger',
	cssClsBody:'infestor-mobile-menu-body',
	cssClsActive:'infestor-mobile-menu-active',
	
	// horizon|vertical
	layout:'horizon',
	// layout:'vertical',
	
	collapseSize:40,
	isCollapse:true,
	
	events:{
	
		// @params target,eventArgs 
		// @this button
		click:null
	
	},
	
	initEvents:function(){
			
		this.adjHandler = infestor.throttle(function(){
				
			this.adjustCollapse();
					
		});
		
		infestor.Dom.getWindow().on('resize',this.adjHandler,this);
		
		this.triggerEl && this.triggerEl.delegate(this,'click',true,function(){
				
			if(this.isCollapse)
				this.expand();
			else this.collapse();
			
		},this);
	
	},
	
	initElement:function(){
		
		this.callParent();
				
		this.element.addClass(this.layout == 'vertical' ? this.cssClsVertical : this.cssClsHorizon);
		
		this.bodyElement = this.createDomElement(this,this.cssClsBody);
	
		this.triggerEl = infestor.create('infestor.Element',{
			
			cssClsElement:this.cssClsTrigger,
			icon:'list',
			iconSize:32,
			
		}).renderTo(this);
		
		this.adjustCollapse();
		
		this.renderTo();

	},
	
	adjustCollapse : function(){
		
		if(!this.isCollapse) return;
		
		if(this.layout == 'vertical'){
			
			this.element.css('margin-top',infestor.px(this.collapseSize-infestor.Dom.clientHeight()));
			
		}else{
			
			this.element.css('margin-left',infestor.px(this.collapseSize-infestor.Dom.clientWidth()));
		}
		
	},
	
	expand:function(){
		
		if(!this.isCollapse) 
			return;
		
		this.element.addClass(this.cssClsActive);
		
		if(this.layout == 'vertical'){
			
			this.element.css('margin-top',0);
			
		}else{
			
			this.element.css('margin-left',0);
		}
				
		this.isCollapse = false;
	},
	
	collapse:function(){
		
		if(this.isCollapse)
			return;
		
		this.element.removeClass(this.cssClsActive);
		this.isCollapse = true;
		this.adjustCollapse();
	
	},
	
	destroy : function(){
		
		this.titleElement = this.titleElement && this.titleElement.destroy();
		this.bodyElement = this.bodyElement && this.bodyElement.destroy();
		this.triggerEl = this.triggerEl && this.triggerEl.destroy();
		
		this.adjHandler && infestor.Dom.getWindow().un('resize',this.adjHandler);
		
		this.callParent();
		
	}
	

});