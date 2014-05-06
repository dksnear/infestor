

infestor.define('infestor.Tip', {

	alias:'tip',

	extend : 'infestor.Element',

	cssUses : ['infestor.Tip'],
	
	statics:{
	
		globalTip:null,
		
		init:function(){
			
			if(!infestor.Tip.globalTip){
			
				infestor.Tip.globalTip = infestor.create('infestor.Tip').renderTo(infestor.Dom.getBody());
				infestor.Tip.globalTip.hide();
				infestor.Dom.get(window).resize(infestor.throttle(function(){
					
					infestor.Tip.globalTip.hide();
				
				}));
			
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
