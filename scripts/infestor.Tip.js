

infestor.define('infestor.Tip', {

	alias:'tip',

	extend : 'infestor.Element',

	cssUses : ['infestor.Tip'],
	
	statics:{
	
		globalTip:null,
			
		init:function(){
			
			if(!infestor.Tip.globalTip){
			
				infestor.Tip.globalTip = infestor.create('infestor.Tip',{ 
				
					hidden:true,
					hideWithResize:true 
					
				}).renderTo(infestor.Dom.getBody());
			
			};
	
			return infestor.Tip.globalTip;
		},
		
		show:function(text){
		
			infestor.Tip.init();
			infestor.Tip.globalTip.show();		
			!infestor.isUndefined(text) && infestor.Tip.globalTip.setText(text);
		
		},
		
		hide:function(){
		
			infestor.Tip.globalTip && infestor.Tip.globalTip.hide();
		}
	
	},
	
	cssClsElement : 'infestor-tip',
	cssClsArrowTop : 'arrow-top',
	cssClsArrowBottom : 'arrow-bottom',
	cssClsArrowLeft : 'arrow-left',
	cssClsArrowRight : 'arrow-right',
	cssClsContent : 'content',

	elementContent : null,

	currentArrowCls : null,

	//top,left,right,bottom
	arrowPosition : 'bottom',
	
	// 当浏览器窗口大小改变时隐藏tip
	hideWithResize:false,

	initElement : function () {

		this.callParent();

		this.createDomElement(this.createDomElement(this.element, null, 's'), null, 'i');

		this.elementContent = this.createDomElement(this.element, this.cssClsContent);

		this.elementInnerContainer = this.elementContent;

		this.setArrowPosition();
		
		this.bindHideWithResize();
	},
	
	bindHideWithResize :function(){
	
		if(!this.hideWithResize) return this;
		
		this.hideWithResizeHandler = this.hideWithResizeHandler || infestor.throttle(function(){
					
			this.hide();
				
		});
		
		infestor.Dom.getWindow().on('resize',this.hideWithResizeHandler,this);
		
		return this;
		
	
	},
	
	unbindHideWithResize :function(){
	
		this.hideWithResizeHandler && infestor.Dom.getWindow().un('resize',this.hideWithResizeHandler);
		
		return this;
	},

	setArrowPosition : function (pos, opposite) {

		if(opposite)
			pos = {
			
				top:'bottom',
				bottom:'top',
				left:'right',
				right:'left'
			
			}[pos];

		this.arrowPosition = pos || this.arrowPosition;

		this.posClsMap = this.posClsMap || {

			top : this.cssClsArrowTop,
			bottom : this.cssClsArrowBottom,
			left : this.cssClsArrowLeft,
			right : this.cssClsArrowRight

		};

		this.currentArrowCls && this.element.removeClass(this.currentArrowCls);
		this.currentArrowCls = this.posClsMap[this.arrowPosition];
		this.element.addClass(this.currentArrowCls);

		return this;

	},

	autoPosition : function () {

		var pos = this.callParent();

		this.setArrowPosition(pos, true);

		return pos;

	},
	
	destroy:function(){
	
		this.unbindHideWithResize();
		this.callParent();
	}

});
