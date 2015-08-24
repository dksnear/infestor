 

infestor.define('infestor.mobile.Menu',{

	alias:'mobile-menu',
	extend:'infestor.Panel',
	cssUses:'infestor.mobile',
	
	cssClsElement:'infestor-mobile-menu',
	cssClsHorizon:'infestor-mobile-menu-h',
	cssClsVertical:'infestor-mobile-menu-v',
	cssClsTrigger:'infestor-mobile-menu-trigger',
	cssClsActive:'infestor-mobile-menu-active',
	
	// horizon|vertical
	orient:'horizon',	
	collapseSize:45,
	isCollapse:true,
	
	// @private #rewrite
	initEvents:function(){
			
		this.adjHandler = infestor.throttle(function(){
				
			this.adjustCollapse();
					
		});
		
		infestor.Dom.getWindow().on('resize',this.adjHandler,this);
		
		this.triggerEl && this.triggerEl.delegate(this,'click',true,function(){
				
			if(this.isCollapse)
				this.expand();
			else {
				this.collapse();
				this.adjustCollapse();
			}
			
		},this);
	
	},
	
	// @private #rewrite
	initElement:function(){
		
		this.callParent();
				
		this.element.addClass(this.orient == 'vertical' ? this.cssClsVertical : this.cssClsHorizon);
		
		this.triggerEl = infestor.create('infestor.Element',{
			
			cssClsElement:this.cssClsTrigger,
			icon:'list',
			iconSize:32,
			
		}).renderTo(this.element);
		
		this.adjustCollapse();
	
	},
	
	// @public
	adjustCollapse : function(force){
				
		if(this.orient == 'vertical'){
			
			this.element.css('margin-top',infestor.px(this.collapseSize-infestor.Dom.clientHeight()));
			
		}else{
			
			this.element.css('margin-left',infestor.px(this.collapseSize-infestor.Dom.clientWidth()));
		}
		
		this.element.zIndex();
		
	},
	
	// @public 
	expand:function(){
		
		if(!this.isCollapse) 
			return;
		
		this.element.zIndex();
		this.element.addClass(this.cssClsActive);
		this.triggerEl.element.addClass(this.cssClsGlobalIconFocus32);
		this.element.css(this.orient == 'vertical' ? 'margin-top' : 'margin-left',0);				
		this.isCollapse = false;
	},
	
	// @public
	collapse:function(){
		
		if(this.isCollapse)
			return;
		
		this.element.removeClass(this.cssClsActive);
		this.triggerEl.element.removeClass(this.cssClsGlobalIconFocus32);
		this.isCollapse = true;
	
	},
	
	// @public #rewrite
	destroy : function(){
		
		this.titleElement = this.titleElement && this.titleElement.destroy();
		this.bodyElement = this.bodyElement && this.bodyElement.destroy();
		this.triggerEl = this.triggerEl && this.triggerEl.destroy();
		
		this.adjHandler && infestor.Dom.getWindow().un('resize',this.adjHandler);
		
		this.callParent();
		
	}
	

});