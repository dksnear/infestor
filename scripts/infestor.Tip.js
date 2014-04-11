

infestor.define('infestor.Tip', {

	alias:'tip',

	extend : 'infestor.Element',

	cssUses : ['infestor.Tip'],
	
	statics:{
	
		globalTip:null,
		
		init:function(){
			
			if(!this.globalTip){
			
				this.globalTip = infestor.create('infestor.Tip').renderTo(infestor.Dom.getBody());
				this.globalTip.hide();
				infestor.Dom.get(window).resize(infestor.throttle(function(){
					
					this.globalTip.hide();
				
				}),this);
			
			};
	
			return this.globalTip;
		},
		
		show:function(text){
		
			this.init();
			this.globalTip.show();		
			!infestor.isUndefined(text) && this.globalTip.setText(text);
		
		},
		
		hide:function(){
		
			this.globalTip && this.globalTip.hide();
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

	initElement : function () {

		this.callParent();

		this.createDomElement(this.createDomElement(this.element, null, 's'), null, 'i');

		this.elementContent = this.createDomElement(this.element, this.cssClsContent);

		this.elementInnerContainer = this.elementContent;

		this.setArrowPosition();
	},

	setArrowPosition : function (pos, reverse) {

	
		if(reverse)
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

	setPosition : function (top, left) {

		this.element.css({

			top : infestor.px(top || 0),
			left : infestor.px(left || 0)
		});

		return this;
	},

	autoPosition : function () {

		var pos = this.callParent();

		this.setArrowPosition(pos, true);

		return pos;

	}

});
