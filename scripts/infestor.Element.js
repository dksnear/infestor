
//基本控件元素类

infestor.define('infestor.Element', {

	// 类别名
	// 通过别名创建类 infestor.createByAlias(alias,options);
	alias : 'element',

	// 父类引用
	extend : 'infestor.Object',

	// 关联类引用
	uses : ['infestor.DataSet', 'infestor.Dom'],

	// css 文件引用
	cssUses : ['infestor.Element'],

	statics : {
	
		cssClsElementGlobalMask:'infestor-element-global-mask',

		// 通过类型或别名创建实例
		create : function (opts, def) {

			if (opts && opts.xtype)
				return infestor.create(opts.xtype, opts);
			if (opts && opts.alias)
				return infestor.createByAlias(opts.alias, opts);
			if (def)
				return infestor.create(def, opts);
		},

		// 全局遮罩
		showMask : function () {
		
			this.elementGlobalMask =  this.elementGlobalMask || infestor.Dom.div().addClass(this.cssClsElementGlobalMask).appendTo(infestor.Dom.getBody());
			this.elementGlobalMask.zIndex().show();
			
			return this;
			
		},
		
		hideMask:function(){
		
			this.elementGlobalMask && this.elementGlobalMask.hide();
			
			return this;
		
		}

	},

	// 元素样式
	cssClsElement : '',
	cssClsElementMask : 'infestor-element-mask',
	cssClsElementInlineBlock : 'infestor-element-inline-block',
	cssClsElementBlock : 'infestor-element-block',
	cssClsElementFloat : 'infestor-element-float',
	cssClsElementClear : 'infestor-element-clear',
	cssClsElementBFC : 'infestor-element-bfc',
	cssClsElementBoxShadow : 'infestor-element-box-shadow',
	cssClsElementBorder : 'infestor-element-border',
	cssClsElementPositionAbsolute : 'infestor-element-position-absolute',
	cssClsElementPositionRelative : 'infestor-element-position-relative',
	cssClsElementPositionFixed : 'infestor-element-position-fixed',
	cssClsElementPositionClear : 'infestor-element-position-clear',
	cssClsElementPositionSouth : 'infestor-element-position-south',
	cssClsElementPositionNorth : 'infestor-element-position-north',
	cssClsElementPositionEast : 'infestor-element-position-east',
	cssClsElementPositionWest : 'infestor-element-position-west',
	cssClsElementPositionCenter : 'infestor-element-position-center',
	cssClsElementPositionSouthEast : 'infestor-element-position-south-east',
	cssClsElementPositionSouthWest : 'infestor-element-position-south-west',
	cssClsElementPositionNorthEast : 'infestor-element-position-north-east',
	cssClsElementPositionNorthWest : 'infestor-element-position-north-west',
	cssClsResizableTrigger : 'infestor-element-resizable-trigger',
	cssClsDraggableTrigger : 'infestor-element-draggable-trigger',

	// 控件元素的容器接口(infestor.Dom)
	element : null,

	// 控件元素的外层元素容器接口(infestor.Dom)
	elementOuterContainer : null,

	// 控件元素的子元素容器接口(infestor.Dom)
	elementInnerContainer : null,

	// 遮罩元素接口(infestor.Dom)
	elementMask : null,

	// 控件元素的父容器
	parent : null,

	// 控件元素容器标签
	tagName : 'div',

	// 控件元素标签属性
	attrs : null,

	// 控件元素的样式属性
	css : null,

	// 元素停靠位置 (north|south|west|center|east|north-east|south-east|north-west|north-east)
	dock : false,

	boxShadow : false,

	text : null,

	// 元素尺寸属性(#styleFormat|auto)

	height : null,
	width : null,
	padding : null,
	margin : null,
	border : null,

	// 元素排列模式 (absolute|relative|fixed|block|inline-block|float|none)
	layout : 'none',

	// (block|inline-block|float)
	layoutDisplay : null,

	// (absolute|relative|fixed|static)
	layoutPosition : null,

	// 元素定位属性(#styleFormat|auto)
	top : null,
	left : null,
	right : null,
	bottom : null,

	// 允许移动
	draggable : false,

	// 允许调整大小
	resizable : false,

	// 大小调整及移动限制容器(Dom|infestor.Dom|infestor.Element|fn)
	limitContainer : null,

	// 大小调整限制尺寸
	minHeight : 100,
	minWidth : 100,
	maxHeight : 9999,
	maxWidth : 9999,

	// 子元素定义数组
	items : null,

	// 子元素数量
	count : 0,

	// 子元素默认配置属性
	itemsOpts : null,

	// 对象销毁时要同时清理的属性列表
	destroyList : null,

	// 数据集对象(infestor.DataSet)
	dataSet : null,

	// 数据集对象配置(obj)
	dataConfig : null,

	// 类初始化接口
	init : function () {

		// 如果配置了实例id则注册托管实例 否则不托管实例
		// 对于已托管实例 可通过eks.getInst(id)方法全局获取实例
		this.id && infestor.mgr.addInstance(this.id, this);
		this.id = this.id || this.getId();

		// 元素初始化接口
		this.initElement();

		// 初始化数据
		this.initDataSet();

		// 初始化事件
		this.initEvents && this.initEvents();

		this.setText().setLayout().setPosition().setDimension();

		// 条件初始化
		this.initTip().initDraggable().initResizable();

		// this.delayInit();

		// 子元素初始化接口
		this.initItems();
		
		this.setDock();

	},

	// delayInit : function () {

	// this.dock&&(/north|south|west|center|east/.test(this.dock)?this.delayReg(function(){ this.setDock();}):this.setDock());

	// return this;

	// },

	initElement : function () {

		// 创建控件元素容器
		this.element = this.element || infestor.Dom.create(this.tagName, this.attr).css(this.css || {});

		this.element.element.$infestor = this;

		// 设置控件元素容器样式
		this.element && this.element.addClass(this.cssClsElement);

		// 将控件元素容器插入外部容器中
		this.elementOuterContainer && this.element.appendTo(this.elementOuterContainer);

		this.elementInnerContainer = this.elementInnerContainer || this.element;

		this.boxShadow && this.element.addClass(this.cssClsElementBoxShadow);

	},

	initDataSet : function () {

		this.dataSet = this.dataSet || this.dataConfig && infestor.create('infestor.DataSet', this.dataConfig);

	},

	load : function () {

		this.dataSet && this.dataSet.load.apply(this.dataSet, arguments);
	},

	renderTo : function (element, parent) {

		element = element || infestor.Dom.getBody();

		if (this.elementOuterContainer)
			infestor.error(infestor.stringFormat('实例嵌入失败,{0}类id为{1}实例已经有父容器!', element.$clsName, element.id));

		this.parent = parent || element || this;

		if (element instanceof infestor.Dom)
			this.elementOuterContainer = element;

		if (element instanceof infestor.Element)
			this.elementOuterContainer = element.elementInnerContainer;

		this.element.appendTo(this.elementOuterContainer);

		return this;

	},

	render : function (element) {

		if (element instanceof infestor.Element)
			return element.renderTo(this);

		return this;
	},

	//设置元素排列模式
	// (absolute|relative|fixed|block|inline-block|float|none)|{ position:*|display:* }
	setLayout : function (opts) {

		var match = /(absolute|relative|fixed)?\s?(block|inline-block|float|none)?/,
		map = {

			absolute : this.cssClsElementPositionAbsolute,
			relative : this.cssClsElementPositionRelative,
			fixed : this.cssClsElementPositionFixed,
			block : this.cssClsElementBlock,
			float : this.cssClsElementFloat,
			'inline-block' : this.cssClsElementInlineBlock
		},
		p = [map.absolute, map.relative, map.fixed].join(' '),
		d = [map.block, map['inline-block'], map.float].join(' ');

		this.layout = opts || this.layout;

		if (infestor.isString(this.layout)) {

			match = match.exec(this.layout);

			if (!match[0])
				return this;

			this.layoutPosition = match[1] || null;
			this.layoutDisplay = match[2] || null;

		} else {

			this.layoutPosition = opts && opts.position;
			this.layoutDisplay = opts && opts.display;
		}

		if (this.layoutDisplay == 'float')
			this.elementOuterContainer && this.elementOuterContainer.addClass(this.cssClsElementBFC);
		else
			this.elementOuterContainer && this.elementOuterContainer.removeClass(this.cssClsElementBFC);

		if (this.layoutDisplay == 'none')
			this.element.removeClass(p).removeClass(d);

		this.layoutPosition && this.element.removeClass(p.replace(map[this.layoutPosition], '')).addClass(map[this.layoutPosition]);
		this.layoutDisplay && this.element.removeClass(d.replace(map[this.layoutDisplay], '')).addClass(map[this.layoutDisplay]);

		return this;
	},

	// 设定元素尺寸样式
	// opts { width|height|padding|border|margin }
	setDimension : function (opts) {

		var list = ['width', 'height', 'padding', 'border', 'margin'];

		// 给对象属性赋值 并确保只赋值width|height|padding|border|margin属性
		opts && infestor.appendIf(this, opts , list);

		// 给对象设定尺寸样式
		infestor.each(list, function (idx, name) {

			!infestor.isNull(this[name]) && this.element.css(name, infestor.styleFormat(this[name]));

		}, this);

		return this;

	},

	// 设定元素位置样式
	// opts { top|left|right|bottom }
	setPosition : function (opts) {

		var list = ['top', 'right', 'left', 'bottom'],
		isSet;

		// 给对象属性赋值 并确保只赋值top|right|left|bottom属性
		opts && infestor.appendIf(this, opts, list); 

		// 给对象设定位置样式
		infestor.each(list, function (idx, name) {

			!infestor.isNull(this[name]) && this.element.css(name, infestor.styleExpr(this[name])) && (isSet = true);

		}, this);

		// 上下左右中有一个属性不是null 则设置定位
		isSet && this.elementOuterContainer.addClass(this.cssClsElementPositionRelative) && !this.layoutPosition && this.element.addClass(this.cssClsElementPositionRelative);

		return this;

	},

	// 设置停靠
	//pos (north|south|west|center|east|north-east|south-east|north-west|north-east)
	//mode (absolute|relative|fixed|clear)
	setDock : function (dock, mode) {

		this.dock = dock || this.dock;
		mode = mode || 'absolute';

		if (!this.dock)
			return this;

		this.element.addClass({

			absolute : this.cssClsElementPositionAbsolute,
			relative : this.cssClsElementPositionRelative,
			fixed : this.cssClsElementPositionFixed,
			clear : this.cssClsElementPositionClear

		}
			[mode]);

		if (mode == 'clear')
			return this;

		return ({

			north : function () {
				this.element.addClass(this.cssClsElementPositionNorth).css('margin-left', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetWidth) / 2));
			},
			south : function () {
				this.element.addClass(this.cssClsElementPositionSouth).css('margin-left', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetWidth) / 2));
			},
			west : function () {
				this.element.addClass(this.cssClsElementPositionWest).css('margin-top', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetHeight) / 2));
			},
			east : function () {
				this.element.addClass(this.cssClsElementPositionEast).css('margin-top', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetHeight) / 2)); ;
			},
			center : function () {

				this.element.addClass(this.cssClsElementPositionCenter).css({
					'margin-left' : infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetWidth) / 2),
					'margin-top' : infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetHeight) / 2)
				});
			},
			'north-east' : function () {
				this.element.addClass(this.cssClsElementPositionNorthEast);
			},
			'north-west' : function () {
				this.element.addClass(this.cssClsElementPositionNorthWest);
			},
			'south-east' : function () {
				this.element.addClass(this.cssClsElementPositionSouthEast);
			},
			'south-west' : function () {
				this.element.addClass(this.cssClsElementPositionSouthWest);
			}

		}
			[this.dock] || infestor.emptyFn).call(this),
		this;

	},

	setText : function (text) {

		this.text = infestor.isUndefined(text) ? this.text : text;
		!infestor.isUndefined(this.text) && !infestor.isNull(this.text) && this.elementInnerContainer.text(this.text);

		return this;
	},

	clearDock : function () {

		return this.element
		 && this.element.removeClass([this.cssClsElementPositionAbsolute, this.cssClsElementPositionRelative, this.cssClsElementPositionFixed, this.cssClsElementPositionClear].join(' ')),
		this;
	},

	hideContainer : function () {

		return this.elementInnerContainer && this.elementInnerContainer.hide(),
		this;

	},

	showContainer : function () {

		return this.elementInnerContainer && this.elementInnerContainer.show(),
		this;
	},

	hide : function () {

		return this.element && this.element.hide(),
		this;
	},

	show : function (top) {

		if (!this.element)
			return this;

		top && this.element.zIndex();

		return this.element.show(),
		this;

	},

	showMask : function () {
	
		if(!this.element) return this;
		
		this.$orgElementPostion = this.element.css('position');
		
		!/absolute|fixed|relative/.test(this.$orgElementPostion) && this.element.css('position','relative');
		
		this.elementMask = this.elementMask || infestor.Dom.div().addClass(this.cssClsElementMask).appendTo(this.element);
		
		this.elementMask.zIndex().show();
		
		return this;
	},

	hideMask : function () {
	
		if(!this.element) return this;

		this.elementMask && this.elementMask.hide();
		
		!/absolute|fixed|relative/.test(this.orgElementPostion) && this.element.css('position',this.$orgElementPostion);
		
		return this;
	},

	// 初始化子元素
	initItems : function () {

		this.items && infestor.each(this.items, function (idx, opts) {
			this.addItem(opts);
		}, this);

		return this;
	},

	hasItem : function (name) {

		// 判断该对象是否含有子元素
		if (infestor.isUndefined(name))
			return this.count > 0;

		// 判断该对象是否含有id为id的子元素
		return this.hasItem() && this.itemsMap[name]instanceof infestor.Element;

	},

	itemCount : function () {

		return this.count;

	},

	// 子元素构建接口
	createItem : function (opts) {
		return false;
	},

	// 添加子元素
	addItem : function (opts) {

		var item;

		if (!this.items)
			return;

		this.itemsMap = this.itemsMap || {};

		!opts.name && (opts.name = this.getId());

		if (this.hasItem(opts.name))
			infestor.error(infestor.stringFormat('类"{0}"的实例"{1}"已添加子元素"{2}"', this.$clsName, this.name, opts.name));

		// 是类的实例 直接添加子元素
		if (opts instanceof infestor.Element)
			return ++this.count && (this.itemsMap[opts.name] = this.render(opts));

		// 非类的实例 根据配置创建子元素再添加
		opts = infestor.append({}, this.itemsOpts, opts);

		// 按类名或别名创建并添加元素
		if (opts.xtype || opts.alias) {

			item = infestor.Element.create(opts).renderTo(this);
			this.itemsMap[item.name] = item;
			return ++this.count && item;
		}

		// 使用模板创建
		// 未实现


		// 使用构建方法创建
		item = this.createItem(opts);

		if (item) {

			item.renderTo(this);
			this.itemsMap[item.name] = item;
			return ++this.count && item;
		}

	},

	// 移除子元素
	removeItem : function (name) {

		if (!this.items)
			return;

		// 删除所有子元素
		if (infestor.isUndefined(name) && this.hasItem())
			return infestor.each(this.itemsMap, function (name) {
				this.removeItem(name);
			}, this);

		// 删除一个子元素
		if (this.hasItem(name)) {

			this.itemsMap[name].destroy();
			delete this.itemsMap[name];
			this.count--;
		}

	},

	// 隐藏子元素
	hideItem : function (name) {

		!infestor.isUndefined(name) & this.itemsMap[name] && this.itemsMap[name].hnamee && this.itemsMap[name].hnamee();

		// 隐藏所有子元素
		infestor.isUndefined(name) && this.hasItem() && infestor.each(this.itemsMap, function (name) {
			this.hideItem(name);
		}, this);
	},

	// 显示子元素
	showItem : function (name) {

		!infestor.isUndefined(name) && this.itemsMap[name] && this.itemsMap[name].show && this.itemsMap[name].show();

		// 显示所有子元素
		infestor.isUndefined(name) && this.hasItem() && infestor.each(this.itemsMap, function (name) {
			this.showItem(name);
		}, this);
	},

	// 向上查找符合条件的父节点
	parents : function (keyword, type) {

		var parent = this.parent,
		max = 5;
		while (parent && max > 0) {

			if (infestor.isFunction(keyword) && keyword.call(this, parent))
				return parent;
			if (type == 'css' && parent.cssClsElement == keyword)
				return parent;
			if ((type == 'cls' || type == 'class') && parent.$clsName == keyword)
				return parent;

			max--;

			parent = parent.parent;
		};

		return null;

	},

	getElement : function () {

		return this.element;
	},

	getDom : function () {

		return this.element && this.element.element;

	},

	// 创建元素
	createDomElement : function (parent, cls, tag, attr, predicate) {

		if (!infestor.isUndefined(predicate)) {

			if (!predicate)
				return null;
			if (infestor.isFunction(predicate) && !predicate())
				return null;
		};

		var dom = infestor.Dom.create(tag || 'div', attr).appendTo(parent || this.element).addClass(cls);

		dom.element.$infestor = this;

		return dom;

	},

	// 创建类的属性元素
	createElement : function (attrName, container, opts) {

		var element = this[attrName],
		renderTo = function (element) {

			if (container instanceof infestor.Element)
				element.renderTo(container);
			if (container instanceof infestor.Dom)
				element.renderTo(container, this);

			return element;
		};

		if (!element || !container)
			return element;

		if (element instanceof infestor.Element)
			return renderTo.call(this, element);

		if (infestor.isBoolean(element))
			return renderTo.call(this, infestor.create('infestor.Element', opts));

		if (infestor.isRawObject(element))
			return renderTo.call(this, infestor.Element.create(element));

	},

	//给一个对象委托事件
	//@eventName 委托事件名
	//@target 委托目标
	//@pradicate 委托条件
	//@handle 委托方法
	//@scope 委托方法执行域
	delegate : function (target, eventName, pradicate, handle, scope) {

		var me = this;

		if (target instanceof infestor.Element)
			target = target.element;

		scope = scope || this;

		target[eventName](function (e) {

			e.target = e.target || e.srcElement;

			var args = [e.target.$infestor].concat(infestor.argsToArray(arguments));

			if (infestor.isFunction(pradicate))
				pradicate.apply(scope, args) && handle.apply(scope, args);

		});

	},

	// 使当前元素定位在目标元素附近
	// @target 目标元素或坐标({ top:0,left:0,height:0,width:0})
	// @pos 默认位置 (top|left|right|bottom)
	// @offset 偏移量 浮动距离和分开距离  ({ drift:(0|head|middle|rear),depart:0})
	// @strict 按照默认位置定位 不自动左右/上下切换 (true|false)
	// @mode 定位模式 (fixed|absolute|relative|static)
	// #return 返回最终出现位置 @pos (top|left|right|bottom|false)
	autoPosition : function (target, pos, offset, mode, strict) {

		var css = {
			position : 'fixed',
			top : 'auto',
			left : 'auto',
			right : 'auto',
			bottom : 'auto'
		},
		driftMap = {
			head : -17,
			middle : 0,
			rear : 0
		},
		defaultDepart = 7,
		clientHeight = document.documentElement.clientHeight,
		clientWidth = document.documentElement.clientWidth;

		if (!this.element)
			return false;

		if (target instanceof infestor.Element)
			target = target.element;
		if (target instanceof infestor.Dom)
			target = target.offset();

		target = infestor.append({
				top : 0,
				left : 0,
				height : 0,
				width : 0
			}, target);
		target.right = clientWidth - parseFloat(target.left);
		target.bottom = clientHeight - parseFloat(target.top);
		target.leftTrend = (parseFloat(target.left) + parseFloat(target.width)) > parseFloat(target.right);
		target.topTrend = (parseFloat(target.top) + parseFloat(target.height)) > parseFloat(target.bottom);

		if (!strict && (pos == 'left' || pos == 'right'))
			pos = target.leftTrend ? 'left' : 'right';

		if (!strict && (pos == 'top' || pos == 'bottom'))
			pos = target.topTrend ? 'top' : 'bottom';

		//处理offset参数
		if (infestor.isString(offset))
			offset = {
				drift : offset.split(' ')[0],
				depart : offset.split(' ')[1] || defaultDepart
			};

		if (pos == 'left' || pos == 'right') {

			driftMap.middle = driftMap.head + Math.ceil(parseFloat(target.height) / 2);
			driftMap.rear = driftMap.head + parseFloat(target.height);
		}

		if (pos == 'top' || pos == 'bottom') {

			driftMap.middle = driftMap.head + Math.ceil(parseFloat(target.width) / 2);
			driftMap.rear = driftMap.head + parseFloat(target.width);
		}

		offset.drift = driftMap[offset.drift] || offset.drift || 0;

		offset = infestor.append({
				drift : 0,
				depart : defaultDepart
			}, offset);

		mode && (css.position = mode);

		if (pos == 'right')
			this.element.css(infestor.append(css, {

					top : infestor.px(parseFloat(target.top) + parseFloat(offset.drift)),
					left : infestor.px(parseFloat(target.left) + parseFloat(target.width) + parseFloat(offset.depart))

				}));

		if (pos == 'left')
			this.element.css(infestor.append(css, {

					top : infestor.px(parseFloat(target.top) + parseFloat(offset.drift)),
					right : infestor.px(parseFloat(target.right) + parseFloat(offset.depart))
				}));

		if (pos == 'top')
			this.element.css(infestor.append(css, {

					left : infestor.px(parseFloat(target.left) + parseFloat(offset.drift)),
					bottom : infestor.px(parseFloat(target.bottom) + parseFloat(offset.depart))

				}));

		if (pos == 'bottom')
			this.element.css(infestor.append(css, {

					left : infestor.px(parseFloat(target.left) + parseFloat(offset.drift)),
					top : infestor.px(parseFloat(target.top) + parseFloat(target.height) + parseFloat(offset.depart))
				}));

		return pos;

	},

	// 下面的方法为条件引入

	// 条件引入Tip
	initTip : function (tip) {

		this.tip = tip || this.tip;

		if (infestor.isString(this.tip))
			this.tipText = this.tip;

		if (!this.tip)
			return this;

		infestor.mgr.require('infestor.Tip', function () {

			this.tip = infestor.Tip.init();

			this.element.on('mouseover', infestor.throttle(function () {

					this.tip.setText(this.tipText);
					this.tip.show();
					this.tip.autoPosition(this.element, 'left', 'middle');

				}), this);

			this.element.on('mouseleave', function () {

				this.tip.hide();

			}, this);

		}, this);

		return this;

	},

	disableTip : function () {

		return this;

	},

	initDraggable : function () {

		if (!this.draggable)
			return this;

		!this.$drag && infestor.mgr.require('infestor.Drag', infestor.debounce(function () {

				var me = this;

				this.$drag = this.$drag || infestor.create('infestor.Drag', {

						element : this.element.getElement(),
						elementContainer : this.getLimitContainer(),
						limit : true
					});

			}, 100), this);

		return this;

	},

	disableDraggable : function () {

		this.$drag = this.$drag && this.$drag.destroy();

	},

	initResizable : function () {

		if (!this.resizable)
			return this;

		this.$resize && this.$resize.init();

		!this.$resize && infestor.mgr.require('infestor.Resize', infestor.debounce(function () {

				var me = this;

				this.$resize = this.$resize || infestor.create('infestor.Resize', {

						element : this.getDom(),
						elementContainer : this.getLimitContainer(),
						cssClsElementTrigger : this.cssClsResizableTrigger,
						miniWidth : this.miniWidth,
						miniHeight : this.miniHeight,
						maxWidth : this.maxWidth,
						maxHeight : this.maxHeight,
						events : {

							beforeStart : function () {

								me.disableDraggable();

							},
							afterStop : function () {

								me.initDraggable();

							}

						}

					});

			}, 100), this);

		return this;
	},

	disableResizable : function () {

		this.$resize = this.$resize && this.$resize.destroy();

	},

	// 大小调整及移动限制容器(Dom)
	getLimitContainer : function () {

		var container = infestor.isFunction(this.limitContainer) ? this.limitContainer() : this.limitContainer;

		if (container instanceof infestor.Element)
			container = container.getDom();
		if (container instanceof infestor.Dom)
			container = container.getElement();

		return container || document.documentElement;

	},

	// 销毁实例
	destroy : function () {

		//  注销托管列表实例
		this.destroyList && infestor.each(this.destroyList, function () {

			this.destroy && this.destroy();

		});

		// 销毁子元素
		this.removeItem();

		// 注销移动和尺寸修改实例
		this.disableDraggable();
		this.disableResizable();

		// 销毁Dom元素
		this.element && this.element.destroy();

		// 注销实例托管
		infestor.mgr.removeInstance(this.id);

		return null;

	}

});
