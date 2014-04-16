
// 尺寸调整处理类

infestor.define('infestor.Resize', {

	extend : 'infestor.Object',
	uses : ['infestor.Drag'],

	// 尺寸调整触发元素样式(该样式只能设置背景和透明度)
	cssClsElementTrigger : '',

	// 尺寸调整目标(Dom)
	element : null,
	
	// 尺寸调整目标父容器(Dom)
	elementContainer : null,

	// 尺寸调整触发器(infestor.Dom)
	elementTrigger : null,

	// 尺寸调整引导框(infestor.Dom)
	elementGuideRect : null,
	
	// 调整目标尺寸
	offset : null,

	lockX : false,
	lockY : false,

	triggerWidth : 16,
	triggerHeight : 16,

	minHeight : 100,
	minWidth : 100,

	maxHeight : 9999,
	maxWidth : 9999,

	// (infestor.Drag)
	drag : null,

	events : {

		// @params this.elementTrigger.offsetTop,this.elementTrigger.offsetLeft
		// @this this
		beforeStart : null,
		afterStart : null,
		beforeMove : null,
		afterMove : null,
		beforeStop : null,
		afterStop : null

	},

	init : function () {

		if (!this.element)
			return;

		this.elementContainer = this.elementContainer || document.documentElement;
		
		this.containerOffset = infestor.Dom.use(this.elementContainer).offset();
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
				elementContainer : this.elementContainer,
				limit : true,
				lockY : this.lockY,
				lockX : this.lockX,
				cursor : this.cursor,
				maxTop : Math.max(this.minHeight - this.targetBorderTop - this.triggerHeight, 0),
				maxLeft : Math.max(this.minWidth - this.targetBorderLeft - this.triggerWidth, 0),
				events : {

					start : function (top, left) {

						me.emit('beforeStart', [top, left], me);

						me.offset = infestor.Dom.use(me.element).offset();

						this.maxBottom = Math.min(me.elementContainer.clientHeight - me.offset.rawTop - me.targetBorderTop, me.maxHeight - me.targetBorderTop);
						this.maxRight = Math.min(me.elementContainer.clientWidth - me.offset.rawLeft - me.targetBorderLeft, me.maxWidth - me.targetBorderLeft);
					
						me.emit('afterStart', [top, left], me);

					},

					move : function (top, left) {

						me.emit('beforeMove', [top, left], me);

						me.elementGuideRect.css({

							top : infestor.px(me.offset.top + me.containerOffset.borderTop),
							left : infestor.px(me.offset.left + me.containerOffset.borderLeft),
							height : infestor.px(top + me.elementTrigger.height() + me.targetBorderTop - 2),
							width : infestor.px(left + me.elementTrigger.width() + me.targetBorderLeft - 2)

						}).zIndex().show();

						me.emit('afterMove', [top, left], me);

					},

					stop : function (top, left) {

						me.emit('beforeStop', [top, left], me);

						infestor.Dom.use(me.element).css({

							height : infestor.px(top + me.elementTrigger.height() - me.targetBorderBottom),
							width : infestor.px(left + me.elementTrigger.width() - me.targetBorderRight)

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
