
// 尺寸调整处理类

infestor.define('infestor.Resize', {

	extend : 'infestor.Object',
	uses : ['infestor.Drag'],

	// 尺寸调整触发元素样式
	cssClsElementTrigger : '',

	// 尺寸调整目标(Dom)
	element : null,

	// 尺寸调整触发元素(infestor.Dom)
	elementTrigger : null,

	// 尺寸调整引导框(infestor.Dom)
	elementGuideRect : null,

	// 调整目标尺寸
	offset : null,

	triggerBorder : 1,
	triggerWidth : 10,
	triggerHeight : 10,

	// (infestor.Drag)
	drag : null,

	init : function () {

		if (!this.element)
			return;

		this.offset = infestor.Dom.use(this.element).offset();
		this.targetBorderHeight = this.offset.height - infestor.Dom.use(this.element).height();
		this.targetBorderWidth = this.offset.width - infestor.Dom.use(this.element).width();

		this.initDrag();

	},

	initTrigger : function () {

		!this.elementGuideRect && this.initGuideRect();

		this.elementTrigger = this.elementTrigger || infestor.Dom.div().css({

				height : infestor.px(this.triggerHeight),
				width : infestor.px(this.triggerWidth),
				border : infestor.px(this.triggerBorder) + ' solid black',
				cursor : 'se-resize',
				position : 'absolute',
				top : infestor.px(this.offset.top + this.offset.height - 2 * this.triggerBorder - this.triggerHeight),
				left : infestor.px(this.offset.left + this.offset.width - 2 * this.triggerBorder - this.triggerWidth)

			}).appendTo(infestor.Dom.getBody());

	},

	initGuideRect : function () {

		this.elementGuideRect = this.elementGuideRect || infestor.Dom.div().css({

				height : infestor.px(this.offset.height - 2),
				width : infestor.px(this.offset.width - 2),
				border : '1px solid red',
				position : 'absolute',
				top : infestor.px(this.offset.top),
				left : infestor.px(this.offset.left)

			}).appendTo(infestor.Dom.getBody());

	},

	initDrag : function () {

		var me = this;

		!this.elementTrigger && this.initTrigger();

		this.drag = this.drag || infestor.create('infestor.Drag', {

				element : this.elementTrigger.getElement(),
				elementContainer : document.documentElement,
				maxTop : this.offset.top,
				maxLeft : this.offset.left,
				limit : true,
				events : {

					start : function () {},

					move : function (top, left) {

						me.currentHeight = top - me.offset.top + me.triggerHeight;
						me.currentWidth = left - me.offset.left + me.triggerWidth;

						me.elementGuideRect.css({

							height : infestor.px(me.currentHeight),
							width : infestor.px(me.currentWidth)

						});
					},

					stop : function (top, left) {

						infestor.Dom.use(me.element).css({

							height : infestor.px(me.currentHeight - me.targetBorderHeight + (!infestor.isWebkit() ? 0 : 2 * me.triggerBorder)),
							width : infestor.px(me.currentWidth - me.targetBorderWidth + (!infestor.isWebkit() ? 0 : 2 * me.triggerBorder))

						});

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
