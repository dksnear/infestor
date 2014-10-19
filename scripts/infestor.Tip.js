

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
	cssClsArrow : infestor.boe({
		webkit : 'infestor-tip-triangle infestor-tip-triangle-chrome-fix',
		otherwise : 'infestor-tip-triangle'
	}),
	cssClsArrowMask : 'infestor-tip-triangle-mask',
	cssClsArrowTop : 'infestor-tip-triangle-top',
	cssClsArrowMaskTop : 'infestor-tip-triangle-mask-top',
	cssClsArrowBottom : 'infestor-tip-triangle-bottom',
	cssClsArrowMaskBottom : 'infestor-tip-triangle-mask-bottom',
	cssClsArrowLeft : 'infestor-tip-triangle-left',
	cssClsArrowMaskLeft : 'infestor-tip-triangle-mask-left',
	cssClsArrowRight : 'infestor-tip-triangle-right',
	cssClsArrowMaskRight : 'infestor-tip-triangle-mask-right',
	cssClsContent : 'infestor-tip-content',

	elementContent : null,

	currentCls : null,

	//top,left,right,bottom
	arrowPosition : 'bottom',
	
	// 当浏览器窗口大小改变时隐藏tip
	hideWithResize:false,

	initElement : function () {

		this.callParent();
		
		this.elementArrow = this.createDomElement(this.element,this.cssClsArrow,'s');
		
		this.elementArrowMask = this.createDomElement(this.elementArrow,this.cssClsArrowMask,'i');

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

	setArrowPosition : function (pos, opposite, drift ,topTrend,leftTrend) {

		if(opposite)
			pos = {
			
				top:'bottom',
				bottom:'top',
				left:'right',
				right:'left'
			
			}[pos];

		this.arrowPosition = pos || this.arrowPosition;

		this.posClsMap = this.posClsMap || {

			top : {
				
				triangle:this.cssClsArrowTop,
				mask:this.cssClsArrowMaskTop
			
			},
			bottom : {
				
				triangle:this.cssClsArrowBottom,
				mask:this.cssClsArrowMaskBottom
			
			},
			left : {
				
				triangle:this.cssClsArrowLeft,
				mask:this.cssClsArrowMaskLeft
			
			},
			right : {
				
				triangle:this.cssClsArrowRight,
				mask:this.cssClsArrowMaskRight
			
			}

		};

		this.currentCls && this.elementArrow.removeClass(this.currentCls.triangle) && this.elementArrowMask.removeClass(this.currentCls.mask);
		this.currentCls = this.posClsMap[this.arrowPosition];
		this.elementArrow.addClass(this.currentCls.triangle) && this.elementArrowMask.addClass(this.currentCls.mask);
		
		/top|bottom/.test(pos) && drift && this.elementArrow.css({
		
			right : !leftTrend ? 'auto' : infestor.px(drift + 30),
			left : leftTrend ? 'auto' : infestor.px(drift + 30)
		
		});
		
		/left|right/.test(pos) && drift && this.elementArrow.css({
		
			bottom : !topTrend ? 'auto' : infestor.px(drift + 10),
			top : topTrend ? 'auto' : infestor.px(drift + 10)
		
		});

		return this;

	},

	autoPosition : function () {

		var pos = this.callParent();

		pos && this.setArrowPosition(pos.pos, true, pos.drift, pos.topTrend,pos.leftTrend);

		return pos;

	},
	
	show:function(){
	
		return this.callParent(true);
	},
	
	destroy:function(){
	
		this.unbindHideWithResize();
		this.callParent();
	}

});
