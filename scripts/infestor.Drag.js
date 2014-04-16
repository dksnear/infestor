
// 拖动处理类

infestor.define('infestor.Drag', {

	extend : 'infestor.Object',

	uses : ['infestor.Dom'],

	// 拖放对象(DOM)
	element : null,

	// 设置触发对象(DOM)(不设置则使用拖放对象)
	elementTrigger : null,

	// 指定限制在容器内(DOM)
	elementContainer : null,

	posX : 0,
	posY : 0,

	// 锁定水平方向拖放
	lockX : false,
	// 锁定垂直方向拖放
	lockY : false,
	// 锁定
	lock : false,
	// 透明
	transparent : false,
	// 是否设置范围限制(为true时下面参数有用,可以是负数)
	limit : false,
	// 左边限制
	maxLeft : 0,
	// 右边限制
	maxRight : 9999,
	// 上边限制
	maxTop : 0,
	// 下边限制
	maxBottom : 9999,

	marginTop : 0,
	marginLeft : 0,

	// 移动时鼠标样式
	cursor : 'move',

	statics : {
	
		// 当前实例id
		currentInstId : null,
		
		// 实例管理器
		instMap : {}

	},

	events : {

		// @params this.element.offsetTop,this.element.offsetLeft
		// @this this
		start : null,
		move : null,
		stop : null

	},

	init : function () {

		var me = this;

		this.id = this.getId();

		infestor.Drag.instMap[this.id] = this;

		this.elementTrigger = this.elementTrigger || this.element;

		this.elementContainer = this.elementContainer || document.documentElement;
		//记录源dom对象的position样式,用来还原
		// this.elbakPos = infestor.Dom.use(this.element).css('position');
		this.ctbakPos = this.elementContainer && infestor.Dom.use(this.elementContainer).css('position');
		this.element.style.position = 'absolute';

		this.moveEventHandler = function (e) {

			// 同一时刻只允许一个实例移动
			if (me.id != infestor.Drag.currentInstId)
				return;

			me.move(e || window.event);
		};
		this.stopEventHandler = function () {
			me.stop();
		}
		this.startEventHandler = function (e) {
			me.start(e);
		}

		infestor.on(this.elementTrigger, 'mousedown', this.startEventHandler, true);
	},

	start : function (event) {

		if (this.lock)
			return;

		infestor.Drag.currentInstId = this.id;

		this.fix();

		this.posX = event.clientX - this.element.offsetLeft;
		this.posY = event.clientY - this.element.offsetTop;

		this.marginLeft = parseInt(infestor.Dom.use(this.element).css('marginLeft')) || 0;
		this.marginTop = parseInt(infestor.Dom.use(this.element).css('marginTop')) || 0;

		infestor.on(document, 'mousemove', this.moveEventHandler, true);
		infestor.on(document, 'mouseup', this.stopEventHandler, true);

		if (infestor.isIE()) {

			infestor.on(this.elementTrigger, 'losecapture', this.stopEventHandler, true);
			this.elementTrigger.setCapture();

		} else {

			infestor.on(window, 'blur', this.stopEventHandler, true);
			event.preventDefault();
		};

		infestor.Dom.use(this.element).zIndex();

		if (this.cursor) {

			this.bakCursor = infestor.Dom.use(this.element).css('cursor');
			this.element.style.cursor = this.cursor;

		}

		this.emit('start', [this.element.offsetTop, this.element.offsetLeft], this);
	},

	move : function (event) {

		if (this.lock)
			return this.stop(), undefined;
		//清除选择
		infestor.clearSelection();

		var left = event.clientX - this.posX,
		top = event.clientY - this.posY,
		maxLeft = this.maxLeft,
		maxTop = this.maxTop,
		maxRight = this.maxRight,
		maxBottom = this.maxBottom;

		if (this.limit) {

			if (this.elementContainer) {

				maxLeft = Math.max(maxLeft, 0);
				maxTop = Math.max(maxTop, 0);
				maxRight = Math.min(maxRight, this.elementContainer.clientWidth);
				maxBottom = Math.min(maxBottom, this.elementContainer.clientHeight);
			}

			left = Math.max(Math.min(left, maxRight - this.element.offsetWidth), maxLeft);
			top = Math.max(Math.min(top, maxBottom - this.element.offsetHeight), maxTop);

		};

		if (!this.lockX)
			this.element.style.left = (left - this.marginLeft) + 'px';

		if (!this.lockY)
			this.element.style.top = (top - this.marginTop) + 'px';

		this.emit('move', [this.element.offsetTop, this.element.offsetLeft], this)

	},

	stop : function () {

		infestor.un(document, 'mousemove', this.moveEventHandler, true);
		infestor.un(document, 'mouseup', this.stopEventHandler, true);

		if (infestor.isIE()) {

			infestor.un(this.elementTrigger, 'losecapture', this.stopEventHandler, true);
			this.elementTrigger.releaseCapture();
		} else
			infestor.un(window, 'blur', this.stopEventHandler, true);

		this.cursor && (this.element.style.cursor = this.bakCursor);

		this.emit('stop', [this.element.offsetTop, this.element.offsetLeft], this);

	},

	fix : function () {

		if (!this.limit)
			return;

		var elementContainer = this.elementContainer && infestor.Dom.use(this.elementContainer);
		this.maxRight = Math.max(this.maxRight, this.maxLeft + this.element.offsetWidth);
		this.maxBottom = Math.max(this.maxBottom, this.maxTop + this.element.offsetHeight);
		elementContainer && (elementContainer.css('position') != 'relative' || elementContainer.css('position') != 'absolute') && elementContainer.css('position', 'relative');
	},

	destroy : function () {

		infestor.un(this.elementTrigger, 'mousedown', this.startEventHandler, true);
		//this.element.style.position = this.elbakPos;
		if (this.ctbakPos && this.elementContainer)
			this.elementContainer.style.position = this.ctbakPos;

		delete infestor.Drag.instMap[this.id];
	}

});
