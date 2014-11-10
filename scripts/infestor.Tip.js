

infestor.define('infestor.Tip', {

	alias:'tip',
	extend : 'infestor.Element',
	
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
	
	// 当浏览器窗口大小改变时自动隐藏tip
	hideWithResize:false,
	
	// 当丢失焦点时自动隐藏tip
	hideWithBlur:false,
	
	// 当设置丢失焦点自动隐藏时 阻塞tip Click事件的冒泡行为
	blockBubble:true,

	initElement : function () {

		this.callParent();
		
		this.elementArrow = this.createDomElement(this.element,this.cssClsArrow,'s');
		
		this.elementArrowMask = this.createDomElement(this.elementArrow,this.cssClsArrowMask,'i');

		this.elementContent = this.createDomElement(this.element, this.cssClsContent);

		this.elementInnerContainer = this.elementContent;

		this.setArrowPosition();
				
		this.bindHideEvent();
	},
	
	
	bindHideEvent : function(){
	
		if(this.hideWithResize){
		
			this.hideWithResizeHandler = this.hideWithResizeHandler || infestor.throttle(function(){
				
				
				if(this.hidden) return;
				
				this.emit('beforehide',[this,this.hideWithResize,this.hideWithBlur]);
				this.hide();
				this.emit('afterhide',[this,this.hideWithResize,this.hideWithBlur]);
					
			});
			
			infestor.Dom.getWindow().on('resize',this.hideWithResizeHandler,this);
		
		}
		
		if(this.hideWithBlur){
		
			
			this.hideWithBlurHandler = this.hideWithBlurHandler || infestor.throttle(function(){
				
				if(this.hidden) return;
				
				this.emit('beforehide',[this,this.hideWithResize,this.hideWithBlur]);
				this.hide();
				this.emit('afterhide',[this,this.hideWithResize,this.hideWithBlur]);
					
			});
			
			this.element.on('click',function(e){
			
				this.blockBubble && infestor.stopPropagation(e);
			
			},this);
			
			infestor.Dom.getBody().on('click',this.hideWithBlurHandler,this);
		
		}
		
		return this;
	
	},
	
	unbindHideEvent : function(){
	
		this.hideWithResizeHandler && infestor.Dom.getWindow().un('resize',this.hideWithResizeHandler);
		this.hideWithBlurHandler && infestor.Dom.getWindow().un('resize',this.hideWithBlurHandler);
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
		
			right : !leftTrend ? 'auto' : infestor.px(drift),
			left : leftTrend ? 'auto' : infestor.px(drift)
		
		});
		
		/left|right/.test(pos) && drift && this.elementArrow.css({
		
			bottom : !topTrend ? 'auto' : infestor.px(drift),
			top : topTrend ? 'auto' : infestor.px(drift)
		
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
	
		//this.unbindHideWithResize();
		this.unbindHideEvent();
		this.callParent();
	}

});
