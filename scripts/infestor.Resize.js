
// 尺寸调整处理类

infestor.define('infestor.Resize', {

	extend : 'infestor.Object',
	uses : ['infestor.Drag'],

	// 尺寸调整触发元素样式(该样式不能设置边框(border))
	cssClsElementTrigger : '',

	// 尺寸调整目标(Dom)
	element : null,

	// 尺寸调整触发器(infestor.Dom)
	elementTrigger : null,

	// 尺寸调整引导框(infestor.Dom)
	elementGuideRect : null,

	// 调整目标尺寸
	offset : null,

	lockX : false,
	lockY : false,

	// 触发器边框样式
	triggerBorder : '0px solid black',
	
	triggerWidth : 10,
	triggerHeight : 10,
	
	miniHeight:15,
	miniWidth:15,
	
	maxHeight:9999,
	maxWidth:9999,

	// (infestor.Drag)
	drag : null,

	events : {

		// @params this.elementTrigger.offsetTop,this.elementTrigger.offsetLeft
		// @this this
		beforeStart : null,
		afterStart: null,
		beforeMove : null,
		afterMove : null,
		beforeStop: null,
		afterStop: null

	},

	init : function () {

		if (!this.element)
			return;

		this.offset = infestor.Dom.use(this.element).offset();
		this.targetBorderTop = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-top-width'));
		this.targetBorderLeft = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-left-width'));
		this.targetBorderBottom = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-bottom-width'));
		this.targetBorderRight = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-right-width'));
		this.cursor = this.lockX ? 's-resize' : this.lockY ? 'e-resize' : 'se-resize';

		this.initDrag();

	},

	initTrigger : function () {

		!this.elementGuideRect && this.initGuideRect();

		this.elementTrigger = this.elementTrigger || infestor.Dom.div().css({

				height : infestor.px(this.triggerHeight),
				width : infestor.px(this.triggerWidth),
				cursor : this.cursor,
				position : 'absolute',
				right : infestor.px(this.targetBorderRight * -1),
				bottom : infestor.px(this.targetBorderBottom * -1)

			}).addClass(this.cssClsElementTrigger).appendTo(infestor.Dom.use(this.element)).zIndex();
		
		this.triggerBorder && this.elementTrigger.css('border',this.triggerBorder);
		this.triggerBorder = parseFloat(this.triggerBorder) || 0;

	},

	initGuideRect : function () {

		this.elementGuideRect = this.elementGuideRect || infestor.Dom.div().css({

				height : infestor.px(this.offset.height - 2),
				width : infestor.px(this.offset.width - 2),
				border : '1px solid red',
				position : 'absolute',
				top : infestor.px(this.offset.top),
				left : infestor.px(this.offset.left)

			}).appendTo(infestor.Dom.getBody()).hide();

	},

	initDrag : function () {

		var me = this;

		!this.elementTrigger && this.initTrigger();

		this.drag = this.drag || infestor.create('infestor.Drag', {

				element : this.elementTrigger.getElement(),
				elementContainer : document.documentElement,
				limit : true,
				lockY : this.lockY,
				lockX : this.lockX,
				cursor: this.cursor,
				maxTop: 0,
				maxLeft: 0,
				events : {

					start : function (top, left) {
					
						me.emit('beforeStart', [top, left], me);

						me.offset = infestor.Dom.use(me.element).offset();

						this.maxBottom = document.documentElement.clientHeight - me.offset.top - me.targetBorderTop; 
						this.maxRight = document.documentElement.clientWidth - me.offset.left - me.targetBorderLeft; 

						me.emit('afterStart', [top, left], me);

					},

					move : function (top, left) {
					
						me.emit('beforeMove', [top, left], me);
						
						me.elementGuideRect.css({

							top : infestor.px(me.offset.top),
							left : infestor.px(me.offset.left),
							height : infestor.px(top + me.elementTrigger.height() + me.targetBorderTop),
							width : infestor.px(left + me.elementTrigger.width() + me.targetBorderLeft - (infestor.isWebkit() ? 0 : 2 * me.triggerBorder))

						}).zIndex().show();
						
						me.emit('afterMove', [top, left], me);

					},

					stop : function (top, left) {
					
						me.emit('beforeStop', [top, left], me);

						infestor.Dom.use(me.element).css({

							height : infestor.px(top + me.elementTrigger.height() - me.targetBorderBottom + 2 * me.triggerBorder),
							width : infestor.px(left + me.elementTrigger.width() - me.targetBorderRight + (!infestor.isWebkit() ? 0 : 2 * me.triggerBorder))

						});

						me.elementGuideRect.hide();
						infestor.Dom.use(me.element).zIndex();
						
						me.emit('afterStop', [top, left], me);

					}

				}

			});

		this.elementTrigger.zIndex();

	},

	destroy : function () {

		this.drag = this.drag && this.drag.destroy();
		this.elementTrigger = this.elementTrigger && this.elementTrigger.destroy();
		this.elementGuideRect = this.elementGuideRect && this.elementGuideRect.destroy();

		return null;

	}

});
