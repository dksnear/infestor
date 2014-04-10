
infestor.define('infestor.Draggable', {

	/*
	onStart
	onMove
	onStop
	 */

	extend : 'infestor.Object',

	posX : 0,
	posY : 0,
	//锁定水平方向拖放
	lockX : false,
	//锁定垂直方向拖放
	lockY : false,
	//锁定
	lock : false,
	//透明
	transparent : false,
	//设置触发对象（不设置则使用拖放对象）
	handlerElement : null,
	//拖放对象
	element : null,
	//指定限制在容器内
	container : null,
	//是否设置范围限制(为true时下面参数有用,可以是负数)
	limit : false,
	//左边限制
	maxLeft : 0,
	//右边限制
	maxRight : 9999,
	//上边限制
	maxTop : 0,
	//下边限制
	maxBottom : 9999,

	marginTop : 0,
	marginLeft : 0,

	isIE : infestor.browser.msie,

	initialization : function () {

		var me = this;

		this.handlerElement = this.handlerElement || this.element;

		//记录源dom对象的position样式,用来还原
		this.elbakPos = infestor.Dom.use(this.element).css('position');
		this.ctbakPos = this.container && infestor.Dom.use(this.container).css('position');
		this.element.style.position = 'absolute';

		this.moveEventHandler = function (e) {
			me.move(e || window.event);
		};
		this.stopEventHandler = function () {
			me.stop();
		}
		this.startEventHandler = function (e) {
			me.start(e);
		}

		infestor.on(this.handlerElement, 'mousedown', this.startEventHandler);
	},

	start : function (event) {

		if (this.lock)
			return;

		this.fix();

		this.posX = event.clientX - this.element.offsetLeft;
		this.posY = event.clientY - this.element.offsetTop;

		this.marginLeft = parseInt(infestor.Dom.use(this.element).css('marginLeft')) || 0;
		this.marginTop = parseInt(infestor.Dom.use(this.element).css('marginTop')) || 0;

		infestor.on(document, 'mousemove', this.moveEventHandler);
		infestor.on(document, 'mouseup', this.stopEventHandler);

		if (this.isIE) {

			infestor.on(this.handlerElement, 'losecapture', this.stopEventHandler);
			this.handlerElement.setCapture();

		} else {

			infestor.on(window, 'blur', this.stopEventHandler);
			event.preventDefault();
		};

		this.emit('onStart', [this.element.offsetTop, this.element.offsetLeft], this);
	},

	move : function (event) {

		if (this.lock)
			return this.stop(), undefined;
		//清除选择
		infestor.clearSelection();

		var left = event.clientX - this.posX,
		top = event.clientY - this.posY,
		maxLeft = this.maxLeft,
		maxTop = this.marginTop,
		maxRight = this.maxRight,
		maxBottom = this.maxBottom;

		if (this.limit) {

			if (this.container) {

				maxLeft = Math.max(maxLeft, 0);
				maxTop = Math.max(maxTop, 0);
				maxRight = Math.min(maxRight, this.container.clientWidth);
				maxBottom = Math.min(maxBottom, this.container.clientHeight);
			}

			left = Math.max(Math.min(left, maxRight - this.element.offsetWidth), maxLeft);
			top = Math.max(Math.min(top, maxBottom - this.element.offsetHeight), maxTop);

		};

		if (!this.lockX)
			this.element.style.left = (left - this.marginLeft) + 'px';

		if (!this.lockY)
			this.element.style.top = (top - this.marginTop) + 'px';

		this.emit('onMove', [this.element.offsetTop, this.element.offsetLeft], this)

	},

	stop : function () {

		infestor.un(document, 'mousemove', this.moveEventHandler);
		infestor.un(document, 'mouseup', this.stopEventHandler);

		if (this.isIE) {

			infestor.un(this.handlerElement, 'losecapture', this.stopEventHandler);
			this.handlerElement.releaseCapture();
		} else
			infestor.un(window, 'blur', this.stopEventHandler);

		this.emit('onStop', [this.element.offsetTop, this.element.offsetLeft], this);

	},

	fix : function () {

		if (!this.limit)
			return;

		this.maxRight = Math.max(this.maxRight, this.maxLeft + this.element.offsetWidth);
		this.maxBottom = Math.max(this.maxBottom, this.maxTop + this.element.offsetHeight);

		var container = this.container && infestor.Dom.use(this.container);

		container && (container.css('position') != 'relative' || container.css('position') != 'absolute') && container.css('position', 'relative');
	},

	destroy : function () {

		this.stop();
		infestor.un(this.handlerElement, 'mousedown', this.startEventHandler);
		this.element.style.position = this.elbakPos;
		if (this.ctbakPos && this.container)
			this.container.style.position = this.ctbakPos;
	}

});
