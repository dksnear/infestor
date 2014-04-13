
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

	lockX : false,
	lockY : false,

	triggerBorder : 1,
	triggerWidth : 10,
	triggerHeight : 10,

	// (infestor.Drag)
	drag : null,

	events : {

		// @params this.elementTrigger.offsetTop,this.elementTrigger.offsetLeft
		// @this this
		start : null,
		move : null,
		stop : null

	},

	init : function () {

		if (!this.element)
			return;

		this.offset = infestor.Dom.use(this.element).offset();
		this.targetBorderHeight = this.offset.height - infestor.Dom.use(this.element).height();
		this.targetBorderWidth = this.offset.width - infestor.Dom.use(this.element).width();
		
		this.targetBorderTop = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-top'));
		this.targetBorderLeft = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-left'));
		this.targetBorderBottom = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-bottom'));
		this.targetBorderRight = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-right'));

		this.initDrag();

	},

	initTrigger : function () {

		!this.elementGuideRect && this.initGuideRect();

		this.elementTrigger = this.elementTrigger || infestor.Dom.div().css({

				height : infestor.px(this.triggerHeight),
				width : infestor.px(this.triggerWidth),
				border : infestor.px(this.triggerBorder) + ' solid black',
				cursor : this.lockX ? 's-resize' : this.lockY ? 'e-resize' : 'se-resize',
				position : 'absolute',
				right : '-2px', //infestor.px(this.targetBorderRight*-1),
				bottom : '-1px'//infestor.px(this.targetBorderBottom*-1)
				// top : infestor.px(this.offset.top + this.offset.height - 2 * this.triggerBorder - this.triggerHeight),
				// left : infestor.px(this.offset.left + this.offset.width - 2 * this.triggerBorder - this.triggerWidth)

			}).appendTo(infestor.Dom.use(this.element)).zIndex();

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
				events : {

					start : function (top, left) {

						me.offset = infestor.Dom.use(me.element).offset();

						me.targetBorderTop = 10; //infestor.parseNumeric(infestor.Dom.use(this.element).css('border-top'));
						me.targetBorderLeft = 5;// infestor.parseNumeric(infestor.Dom.use(this.element).css('border-left'));
						me.targetBorderBottom = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-bottom'));
						me.targetBorderRight = infestor.parseNumeric(infestor.Dom.use(this.element).css('border-right'));
						//this.maxTop = me.triggerBorder*-2;
						//this.maxLeft = me.triggerBorder*-2;
						this.maxBottom = document.documentElement.clientHeight-me.offset.top-me.targetBorderTop; //52
						this.maxRight= document.documentElement.clientWidth -me.offset.left-me.targetBorderLeft; //102
						
						me.elementGuideRect.zIndex().show();
						me.elementTrigger.zIndex();

						me.emit('start', [top, left], me);

					},

					move : function (top, left) {

						me.elementGuideRect.css({

							height : infestor.px(top + me.elementTrigger.height() + me.targetBorderTop -2),
							width : infestor.px(left + me.elementTrigger.width() + me.targetBorderLeft -2)

						});

						me.emit('move', [top, left], me);
					},

					stop : function (top, left) {

						infestor.Dom.use(me.element).css({

							// height : infestor.px(top + me.elementTrigger.height() - me.targetBorderBottom + (!infestor.isWebkit() ? 0 : 2 * me.triggerBorder)),
							// width : infestor.px(left + me.elementTrigger.width() - me.targetBorderRight + (!infestor.isWebkit() ? 0 : 2 * me.triggerBorder))

							height : infestor.px(top + me.elementTrigger.height() - 1 + (!infestor.isWebkit() ? 0 : 2 * me.triggerBorder)),
							width : infestor.px(left + me.elementTrigger.width() - 2 + (!infestor.isWebkit() ? 0 : 2 * me.triggerBorder))

						});

						me.elementGuideRect.hide();
						infestor.Dom.use(me.element).zIndex();

						me.emit('stop', [top, left], me);

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
