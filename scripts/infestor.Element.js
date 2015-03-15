
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
	
		cssClsElementGlobalMask:infestor.bRouter({ 
		
			 ie7minus : 'infestor-element-global-mask-ie7minus',
			 otherwise : 'infestor-element-global-mask'
		}),
		
		// 通过类型或别名创建实例
		create : function (opts, name) {

			!opts.xtype && !opts.alias && (opts.xtype = 'infestor.Element');
		
			if (opts && opts.xtype)
				return infestor.create(opts.xtype, opts);
			if (opts && opts.alias)
				return infestor.createByAlias(opts.alias, opts);
			if (name)
				return infestor.create(name, opts);
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
	cssClsElementInlineBlock : infestor.bRouter({ 
		 ie7minus:'infestor-element-inline-block-ie7minus',
		 otherwise: 'infestor-element-inline-block'
	}),
	// 在父容器添加去除inline-block带来的间距
	cssClsElementRemoveSpace:'infestor-element-remove-space',
	cssClsElementBlock : 'infestor-element-block',
	cssClsElementFloat : 'infestor-element-float',
	cssClsElementClear : 'infestor-element-clear',
	cssClsElementBFC : 'infestor-element-bfc',
	cssClsElementTable:'infestor-element-table',
	cssClsElementTableCell:'infestor-element-table-cell',
	
	cssClsElementBoxShadow : infestor.bRouter({ 
		 ie8minus:'infestor-element-box-shadow-ie8minus',
		 otherwise: 'infestor-element-box-shadow'
	}),
	
	cssClsElementText:'infestor-element-text',
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
	
	
	// #icon
	cssClsGlobalIcon16 : 'infestor-global-icon-16',
	cssClsGlobalIconHover16 : 'infestor-global-icon-hover-16',
	cssClsGlobalIconFocus16 : 'infestor-global-icon-focus-16',
	cssClsGlobalIconDisabled16 : 'infestor-global-icon-disabled-16',
	cssClsGlobalIcon32 : 'infestor-global-icon-32',
	cssClsGlobalIconHover32 : 'infestor-global-icon-hover-32',
	cssClsGlobalIconFocus32 : 'infestor-global-icon-focus-32',
	cssClsGlobalIconDisabled32 : 'infestor-global-icon-disabled-32',
	
	cssClsGlobalIconBlockPseudo : 'infestor-global-icon-block-pseudo',	
	cssClsGlobalIconBlockPseudoHover : 'infestor-global-icon-block-pseudo-hover',
	cssClsGlobalIconBlockPseudoFocus : 'infestor-global-icon-block-pseudo-focus',
	cssClsGlobalIconBlockPseudoDisabled : 'infestor-global-icon-block-pseudo-disabled',
	
	// #button
	cssClsGlobalButton : 'infestor-global-button',
	cssClsGlobalButtonHover : 'infestor-global-button-hover',
	cssClsGlobalButtonFocus : 'infestor-global-button-focus',
	cssClsGlobalButtonDisabled : 'infestor-global-button-disabled',	
	cssClsGlobalButtonInline :'infestor-global-inline-button',
	cssClsGlobalButtonHorizon : 'infestor-global-horizon-button',
	

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
	attr : null,

	// 控件元素的样式属性
	css : null,

	// 元素停靠位置 (north|south|west|center|east|north-east|south-east|north-west|north-east)
	dock : false,
	
	// 停靠模式 (fixed|absolute|relative)
	dockMode:'fixed',

	// 边框阴影
	boxShadow : false,

	// 文本内容
	text : null,

	// tip
	tip : null,
	
	// 图标名 
	// 设置该项后将提供系统图标背景
	// 系统图标设定函数setIcon
	// 系统图标定义
	icon : null,
	
	// 图标大小
	// 系统只提供 16|32
	iconSize : 16,
	
	// 贴士出现位置 (top|left|bottom|right)
	tipTrend:'left',
	
	// 控制贴士指针位置
	tipDrift:'head',
	
	// 固定贴士显示的z-index (默认为系统自增长)
	tipZIndex: true,

	// 元素尺寸属性(#styleFormat|auto)

	height : null,
	width : null,
	padding : null,
	margin : null,
	border : null,

	// 元素定位属性(#styleFormat|auto)
	position : null,
	top : null,
	left : null,
	right : null,
	bottom : null,
	
	// 不显示该元素
	hidden:false,

	// 允许移动
	draggable : false,

	// 允许调整大小
	resizable : false,

	// 大小调整限制尺寸
	minHeight : 100,
	minWidth : 100,
	maxHeight : 9999,
	maxWidth : 9999,

	// 子元素定义数组
	// 子元素名称不能重复 且不能为纯数字
	items : null,
	
	// 子元素存储映射表 包含名称映射和索引映射
	itemsMap:null,
	
	// 子元素索引序列计数器
	itemsIndex:0,

	// 子元素数量
	count : 0,

	// 子元素默认配置属性
	itemsOpts : null,
		
	// 子元素布局模式 (vertical|horizon|table|inline-block|float|block)
	// vertical=block
	// horizon=inline-block
	itemLayout:'block',
	
	// 子元素构造模式 (options[通过构造选项构造]|method[通过createItem(opts)接口方法构造]|template[通过字符串模板构造(未实现)])
	itemsConstructMode:'options',

	// 对象销毁时要同时清理的属性列表
	destroyList : null,
	
	// 标识一个Element对象已经销毁 避免已销毁的对象副本重复销毁
	destroyed:false,

	// 数据集对象(infestor.DataSet)
	dataSet : null,
	
	// 数据集对象类名(infestor.DataSet或其子类)
	dataSetClsName : 'infestor.DataSet',

	// 数据集对象配置(obj) 参考infestor.DataSet
	dataConfig : null,
	
	// 自动加载数据
	autoLoad:false,
	
	// 当浏览器窗口大小改变时自动隐藏元素
	hideWithResize:false,
	
	// 当丢失焦点时自动隐藏元素
	hideWithBlur:false,
	
	// 当设置丢失焦点自动隐藏(hideWithBlur=true)时 阻塞Click事件的冒泡行为
	blockBubble:true,
	
	// 类初始化接口
	init : function () {

		// 如果配置了实例id则注册托管实例 否则不托管实例
		// 对于已托管实例 可通过infestor.getInst(id)方法全局获取实例
		this.id && infestor.mgr.addInstance(this.id, this);
		this.id = this.id || this.getId();
		
		// 数据对象初始化
		this.initDataSet();
		
		// 元素初始化
		this.initElement();
		
		// 子元素初始化
		this.initItems();
		
		// 设置 内容/位置/尺寸 
		this.setText();
		this.setPosition();
		this.setDimension();
	
		// 设置停靠
		this.setDock();
			
		// 初始化全局事件(body)
		this.initGlobalEvents();
		
		// 初始化自定义事件
		this.initEvents && this.initEvents();
	
		// 自动加载数据
		this.autoLoad && this.load();
		
		// 条件初始化
		this.initTip();
		this.initDraggable();
		this.initResizable();

	},

	initElement : function () {

		// 创建控件元素容器
		this.element = this.element || infestor.Dom.create(this.tagName, this.attr).css(this.css || {});
		
		this.hidden && this.element.hide();

		this.element.element.$infestor = this;

		// 设置控件元素容器样式
		this.element && this.element.addClass(this.cssClsElement);

		// 将控件元素容器插入外部容器中
		this.elementOuterContainer && this.element.appendTo(this.elementOuterContainer);

		this.elementInnerContainer = this.elementInnerContainer || this.element;

		this.boxShadow && this.element.addClass(this.cssClsElementBoxShadow);
		
		this.setIcon();
		
	},
	
	initDataSet : function () {
	
		var cls = this.$ownerCls.prototype,ownCfg,protoCfg;
	
		if(this.dataSet)
			return this.dataSet.owner = this;
				
		if(this.hasOwnProperty('dataConfig') && cls.dataConfig){
		
			ownCfg = infestor.isRawObject(this.dataConfig) ? this.dataConfig.loadConfig : {};
			protoCfg = infestor.isRawObject(cls.dataConfig) ? cls.dataConfig.loadConfig : {};
			this.dataConfig.loadConfig = infestor.append({},protoCfg,ownCfg);
			
			ownCfg = infestor.isRawObject(this.dataConfig) ? this.dataConfig.submitConfig : {};
			protoCfg = infestor.isRawObject(cls.dataConfig) ? cls.dataConfig.submitConfig : {};
			this.dataConfig.submitConfig = infestor.append({},protoCfg,ownCfg);
			
			this.dataConfig = infestor.append({},cls.dataConfig,this.dataConfig);
	
		}		
			
		this.dataSet = this.dataConfig && infestor.create(this.dataSetClsName, this.dataConfig);
		
		this.dataSet && (this.dataSet.owner = this);
		
		return this;

	},

	load : function () {

		this.dataSet && this.dataSet.load.apply(this.dataSet, arguments);
	},

	renderTo : function (element, parent) {

		element = element || infestor.Dom.getBody();

		if (this.elementOuterContainer || this.isRendered)
			infestor.error(infestor.stringFormat('实例嵌入失败,{0}类id为{1}实例已经有父容器!', element.$clsName, element.id));

		this.parent = parent || element || this;

		if (element instanceof infestor.Dom)
			this.elementOuterContainer = element;

		if (element instanceof infestor.Element)
			this.elementOuterContainer = element.elementInnerContainer;

		
		this.isRendered = true;
		
		this.element.appendTo(this.elementOuterContainer);

		return this;

	},

	render : function (element) {

		if (element instanceof infestor.Element)
			return element.renderTo(this);

		return this;
	},
		
	setCss : function(list,opts){
	
		list = list || [];
	
		// 给对象属性赋值 并确保只赋值list中列出的属性
		opts && infestor.appendIf(this, opts , list);

		// 给对象设定尺寸样式
		infestor.each(list, function (idx, name) {

			!infestor.isNull(this[name]) && this.element.css(name, infestor.styleFormat(this[name]));

		}, this);

		return this;
	
	
	},

	// 设置图标 
	setIcon : function(name,size){
	
		var logicPos,realPos;
	
		this.icon = name || this.icon;
	
		if(!this.icon) return false;
		
		logicPos = infestor.isRawObject(this.icon) ? this.icon : this.$iconNameMap[this.icon];
		
		if(!logicPos) return false;
		
		this.iconSize = parseInt(size || this.iconSize);
		this.iconSize = /16|32/.test(this.iconSize) && this.iconSize || 16;
		
		realPos = this.$iconRealPosConvertor(logicPos,this.iconSize);
		
		if(!realPos) return false;

		this.element.addClass(this.iconSize == 16 ? this.cssClsGlobalIcon16 : this.cssClsGlobalIcon32);
		this.element.css('background-position',realPos);
		
		return true;
		
	
	},
	
	// 设定元素尺寸样式
	// opts { width|height|padding|border|margin }
	setDimension : function (opts) {

		return this.setCss(['width', 'height', 'padding', 'border', 'margin'],opts);

	},

	// 设定元素位置样式
	// opts { top|left|right|bottom }
	setPosition : function (opts) {
	
		return this.setCss(['top', 'right', 'left', 'bottom', 'position'],opts);
	},

	// 设置停靠
	//pos (north|south|west|center|east|north-east|south-east|north-west|north-east)
	//mode (absolute|relative|fixed|clear)
	setDock : function (dock, mode) {
	
		var wait = 10;

		this.dock = dock || this.dock;
		this.dockMode =  mode || this.dockMode;

		if (!this.dock)
			return this;

		this.element.addClass({

			absolute : this.cssClsElementPositionAbsolute,
			relative : this.cssClsElementPositionRelative,
			fixed : this.cssClsElementPositionFixed,
			clear : this.cssClsElementPositionClear

		}[this.dockMode]);

		if (this.dockMode == 'clear')
			return this;

		return ({

			north : function () {
			
				return infestor.debounce(function(){
			
					this.element.addClass(this.cssClsElementPositionNorth).css('margin-left', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetWidth) / 2));
					
				},wait).call(this);
				
			},
			south : function () {
			
				return infestor.debounce(function(){
			
					this.element.addClass(this.cssClsElementPositionSouth).css('margin-left', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetWidth) / 2));
					
				},wait).call(this);
		
			},
			west : function () {
			
				return infestor.debounce(function(){
			
					this.element.addClass(this.cssClsElementPositionWest).css('margin-top', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetHeight) / 2));
					
				},wait).call(this);
							
			},
			east : function () {
			
				return infestor.debounce(function(){
			
					this.element.addClass(this.cssClsElementPositionEast).css('margin-top', infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetHeight) / 2));
					
				},wait).call(this);
				
			},
			center : function () {

				return infestor.debounce(function() {	
				
					this.element.addClass(this.cssClsElementPositionCenter).css({
						'margin-left' : infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetWidth) / 2),
						'margin-top' : infestor.px(-1 * infestor.parseNumeric(this.element.element.offsetHeight) / 2)
					});
					
				},wait).call(this);
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

		}[this.dock] || infestor.emptyFn).call(this),this;

	},

	setText : function (text) {

		this.text = infestor.isUndefined(text) ? this.text : text;
		!infestor.isUndefined(this.text) && !infestor.isNull(this.text) && this.elementInnerContainer.text(this.text);

		return this;
	},

	clearDock : function () {

		return this.element && this.element.removeClass([this.cssClsElementPositionAbsolute, this.cssClsElementPositionRelative, this.cssClsElementPositionFixed, this.cssClsElementPositionClear].join(' ')),this;
	},

	hideContainer : function () {

		return this.elementInnerContainer && this.elementInnerContainer.hide(),this;

	},

	showContainer : function () {

		return this.elementInnerContainer && this.elementInnerContainer.show(),this;
	},

	hide : function () {
	
		if(this.hidden || !this.element)
			return this;
			
		this.hidden = true;

		return this.element && this.element.hide(),this;
	},

	show : function (top) {
	
		top && this.element.zIndex(infestor.isNumber(top) && top || false);
	
		if(!this.hidden || !this.element)
			return this;

		this.hidden = false;

		return this.element.show(),this;

	},

	showMask : function () {
	
		if(!this.element) return this;
		
		!/absolute|fixed|relative/.test(this.element.css('position')) && this.element.css('position','relative');
		
		this.elementMask = this.elementMask || infestor.Dom.div().addClass(this.cssClsElementMask).appendTo(this.element);
		
		this.elementMask.zIndex().show();
		
		return this;
	},

	hideMask : function () {
	
		if(!this.element) return this;

		this.elementMask && this.elementMask.hide();
		
		return this;
	},
	
	// 初始化子元素
	initItems : function (items) {

		this.items = items || this.items || [];
		
		this.items = infestor.isArray(this.items) ? this.items : [this.items];
		
		this.removeItem();
		
		infestor.each(this.items, function (idx, opts) {
			opts && this.addItem(opts);
		}, this);
		
		this.items = [];

		return this;
	},

	hasItem : function (name) {

		// 判断该对象是否含有子元素
		if (infestor.isUndefined(name))
			return this.itemCount() > 0;
		
		return this.hasItem() && this.itemsMap[name] instanceof infestor.Element;

	},

	itemCount : function () {

		this.cleanItems();
	
		return this.count;

	},

	// 添加子元素
	addItem : function (opts) {

		var item,
			container = this,
			inner = this.elementInnerContainer,
			layout='block',
			layoutMap={
		
				vertical:'block',
				horizon:'inline-block',
				table:'table',
				block:'block',
				'inline-block':'inline-block',
				'float':'float'
			
			};

		if (!this.items || !opts)
			return null;

		this.itemsMap = this.itemsMap || {};

		!opts.name && (opts.name = this.getId());

		if (this.hasItem(opts.name))
			return infestor.error(infestor.stringFormat('类"{0}"的实例"{1}"已添加子元素"{2}"', this.$clsName, this.name, opts.name));

		if(!(opts instanceof infestor.Element))
			opts = infestor.append({}, this.itemsOpts, opts);
			
		//设置布局
		
		layout = layoutMap[this.itemLayout] || layout;
		
		if((layout == layoutMap.table) && !this.isItemsLayoutSet){
		
			this.elementItemsContainerTable = infestor.Dom.table().appendTo(inner);
			this.elementItemsContainerTableRow = infestor.Dom.tr().appendTo(this.elementItemsContainerTable);
			this.elementInnerContainer = this.elementItemsContainerTableRow;
		}
		
		if(layout == layoutMap.table){
		
			container = infestor.Dom.td().appendTo(this.elementInnerContainer);
			opts.elementItemCellContainer = container;
		
		}
	
		
		this.isItemsLayoutSet = true;
		
			
		// 是类的实例 直接添加子元素
		if (opts instanceof infestor.Element)		
			item = opts;
			
		// 非类的实例 根据配置创建子元素再添加

		// 使用构建方法创建
		else if (this.itemsConstructMode == 'method' && this.createItem)
			item = this.createItem(opts);
			
		// 使用模板创建
		// 未实现
		else if (this.itemsConstructMode == 'template' && this.itemTemplate)
			return infestor.error(infestor.stringFormat('类"{0}"的实例"{1}"意图使用模板添加子元素"{2}"失败! 该模式尚未实现', this.$clsName, this.name, opts.name));	

		// 按类名或别名创建并添加元素
		else 
			item = infestor.Element.create(opts);
			
		if(!item)
			return infestor.error(infestor.stringFormat('类"{0}"的实例"{1}"添加子元素"{2}"失败!', this.$clsName, this.name, opts.name));
		
		
		// 修改布局样式
		
		if(layout == layoutMap['inline-block']){
			this.elementInnerContainer.addClass(this.cssClsElementRemoveSpace);
			item.element.addClass(this.cssClsElementInlineBlock);
		}
		
		if(layout == layoutMap['float'])
			item.element.addClass(this.cssClsElementFloat);
		
		this.itemsIndex = this.itemsIndex || 0;
		item.$index = this.itemsIndex++;
		
		this.itemsMap[item.name] = item;
		this.itemsMap[item.$index] = item;
	
		return ++this.count && item.renderTo(container,this);

	},

	// 移除子元素
	removeItem : function (name) {

		// 删除所有子元素
		if (infestor.isUndefined(name) && this.hasItem())
			return this.cleanItems(true);
			
		if(!this.itemsMap || !this.itemsMap[name])
			return this;

		// 删除一个子元素
		this.itemsMap[name].destroy();
		
		this.cleanItems();
		
		return this;

	},

	getItem : function(name){

		if(arguments.length < 1)
			return this.itemsMap;
	
		this.cleanItems();
		
		return this.itemsMap && this.itemsMap[name] || null;
	
	},
	
	lastItem : function (){
	
		return this.getItem(this.itemsIndex-1);
	
	},
	
	getItemsArray : function(){
	
		var arr = [];
		
		this.eachItems(function(idx,item){
		
			arr.push(item);
		
		},this,'num');
	
		return arr;
	},
	
	getItemsMap : function(){
	
		var map = {};
		
		this.eachItems(function(name,item){
		
			map[name] = item;
		
		},this,'name');
		
		return map;
	
	},
	
	cleanItems : function(force){
		
		var count = 0;
		
		if(this.count < 1)
			return this;
	
		this.itemsMap && infestor.each(this.itemsMap,function(mix,item){
		
			!item.destroyed && force && item.destroy();
		
			if(!item.destroyed && !force)
				return true;
				
			delete this.itemsMap[mix];
			count++;
	
		},this);
		
		this.count = force ? 0 : (this.count - Math.ceil(count/2));
		
		// 重置子元素索引序列
		!this.count && (this.itemsIndex = 0);
		
		return this;
	
	},

	// 遍历所有子元素
	// @fn(idx[索引],item[元素]) 委托方法
	// @scope @fn的作用域
	// @mode all(所有) num(数值索引) name(关联名索引)
	// @allowDestroyed 允许扫描已析构的对象
	eachItems : function(fn,scope,mode,allowDestroyed){
	
		if(!fn) return this;
		
		mode = mode || 'name';
		scope = scope || this;
	
		this.hasItem() && infestor.each(this.itemsMap,function(idx,item){
			
			if(item.destroyed && !allowDestroyed)
				return true;
			
			(mode == 'num')  &&  !isNaN(idx) && fn.call(scope,idx,item);
			(mode == 'name') && isNaN(idx) && fn.call(scope,idx,item);
			(mode == 'all') && fn.call(scope,idx,item);
		
		
		},this);
		
		return this;
	
	},

	// 隐藏子元素
	hideItem : function (name) {

		!infestor.isUndefined(name) & this.itemsMap[name] && this.itemsMap[name].hide && this.itemsMap[name].hide();

		// 隐藏所有子元素
		infestor.isUndefined(name) && this.eachItems(function(name){
		
			this.hideItem(name);
			
		},this,'name');
		
	},

	// 显示子元素
	showItem : function (name) {

		!infestor.isUndefined(name) && this.itemsMap[name] && this.itemsMap[name].show && this.itemsMap[name].show();

		// 显示所有子元素	
		infestor.isUndefined(name) && this.eachItems(function(name){
		
			this.showItem(name);
			
		},this,'name');
		
	},

	// 向上查找符合条件的父节点
	climbUp : function (keyword, type, max) {

		var parent = this.parent, max = max || 10;
		
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
	createDomElement : function (parent, cssCls, tag, attr, predicate) {

		if (!infestor.isUndefined(predicate)) {

			if (!predicate)
				return null;
			if (infestor.isFunction(predicate) && !predicate())
				return null;
		};
		
		if(parent instanceof infestor.Element)
			parent = parent.getElement();

		var dom = infestor.Dom.create(tag || 'div', attr).appendTo(parent || this.element).addClass(cssCls);

		dom.element.$infestor = this;

		return dom;

	},

	// 创建类的属性元素
	createElement : function (attrName, container, opts, clsName) {

		var element = this[attrName],
			clsName = clsName || 'infestor.Element',
			renderTo = function (element) {
			
				if(element.isRendered)
					infestor.error(infestor.stringFormat('实例嵌入失败,{0}类id为{1}实例已经有父容器!', element.$clsName, element.id));
				
				if (container instanceof infestor.Element)
					element.renderTo(container);
				if (container instanceof infestor.Dom)
					element.renderTo(container, this);
				
				this[attrName] = element;
				
				return element;
			};
		
		
		if(!attrName || this['is'+attrName+'created'])
			return null;
			
		this['is'+attrName+'created'] = true;

		if (!element || !container)
			return element;

		if (element instanceof infestor.Element)
			return renderTo.call(this, element);

		if (infestor.isBoolean(element) && element)
			return renderTo.call(this, infestor.create(clsName, opts));
		
		if (infestor.isRawObject(element))
			return renderTo.call(this, infestor.Element.create(infestor.append({},opts,element)));
			
		return null;

	},

	//给一个对象委托事件
	//@eventName 委托事件名
	//@target 委托目标
	//@pradicate :true|fn(inst,event) 委托条件
	//@handle :fn(inst,event) 委托方法
	//@scope 委托方法执行域
	//@stopBubble 阻止事件冒泡
	delegate : function (target, eventName, pradicate, handle, scope, stopBubble) {

		if(!target) return this;

		if (target instanceof infestor.Element)
			target = target.element;

		scope = scope || this;

		target[eventName](function (e) {
		
			stopBubble && infestor.stopPropagation(e);

			e.target = e.target || e.srcElement;
		
			var args = [e.target.$infestor].concat(infestor.argsToArray(arguments));

			if (infestor.isFunction(pradicate))
			 	return pradicate.apply(scope, args) && handle.apply(scope, args);

			if(pradicate)
				return handle.apply(scope, args);
		});
		
		return this;

	},

	// 使当前元素定位在目标元素附近
	// @target 目标元素或坐标({ top:0,left:0,height:0,width:0})
	// @pos 默认位置 (top|left|right|bottom)
	// @offset  ({ drift:(0|head|middle|rear),depart:0}) 偏移量 drift决定了目标元素上的指示器出现的位置(如Tip的指示标签) , depart为当前元素和目标元素之间的分开距离
	// @strict 按照默认位置定位 不自动左右/上下切换 (true|false)
	// @mode 定位模式 (fixed|absolute|relative|static)
	// #return 返回最终出现位置 @pos (top|left|right|bottom|false)
	autoPosition : function (target, pos, offset, mode, strict) {

		var css = {
		
				position : mode || 'fixed',
				top : 'auto',
				left : 'auto',
				right : 'auto',
				bottom : 'auto'
			},
			driftMap = {
				head : 3,
				middle : 0,
				rear : 0
			},
			defaultDepart = 9,
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
			
		target.right = clientWidth - parseFloat(target.left) + parseFloat(target.scrollLeft);
		target.bottom = clientHeight - parseFloat(target.top) + parseFloat(target.scrollTop);
		target.leftTrend = (parseFloat(target.left) + parseFloat(target.width)) > parseFloat(target.right);
		target.topTrend = (parseFloat(target.top) + parseFloat(target.height)) > parseFloat(target.bottom);
		
		target.topClose = parseFloat(target.top) < clientHeight/2;
		target.topDock = target.topClose && (parseFloat(target.bottom) < this.getDom().offsetHeight);
		target.bottomDock = !target.topClose && (parseFloat(target.top) < this.getDom().offsetHeight);

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
		
		offset.depart = offset.depart || defaultDepart;
		
		if (pos == 'right' && target.topTrend)
			this.element.css(infestor.append(css, {

				bottom : infestor.px(clientHeight - parseFloat(target.top) - parseFloat(target.height)),
				left : infestor.px(parseFloat(target.left) + parseFloat(target.width) + parseFloat(offset.depart))

			}));
				
		if (pos == 'right' && !target.topTrend)
			this.element.css(infestor.append(css, {

				top : infestor.px(parseFloat(target.top)),
				left : infestor.px(parseFloat(target.left) + parseFloat(target.width) + parseFloat(offset.depart))

			}));
		
		if (pos == 'left' && target.topTrend)
			this.element.css(infestor.append(css, {

				bottom : infestor.px(clientHeight - parseFloat(target.top) - parseFloat(target.height)),
				right : infestor.px(parseFloat(target.right) + parseFloat(offset.depart))
			}));
		

		if (pos == 'left' && !target.topTrend)
			this.element.css(infestor.append(css, {

				top : infestor.px(parseFloat(target.top)),
				right : infestor.px(parseFloat(target.right) + parseFloat(offset.depart))
			}));
				
				
		if(pos == 'top' && target.leftTrend)
			this.element.css(infestor.append(css, {

				right : infestor.px(clientWidth - parseFloat(target.left) - parseFloat(target.width)),
				bottom : infestor.px(parseFloat(target.bottom) + parseFloat(offset.depart))

			}));

		if (pos == 'top' && !target.leftTrend)
			this.element.css(infestor.append(css, {

				left : infestor.px(parseFloat(target.left)),
				bottom : infestor.px(parseFloat(target.bottom) + parseFloat(offset.depart))

			}));
				
		if (pos == 'bottom' && target.leftTrend)
			this.element.css(infestor.append(css, {

				right : infestor.px(clientWidth - parseFloat(target.left) - parseFloat(target.width)),
				top : infestor.px(parseFloat(target.top) + parseFloat(target.height) + parseFloat(offset.depart))

			}));

		if (pos == 'bottom' && !target.leftTrend)
			this.element.css(infestor.append(css, {

				left : infestor.px(parseFloat(target.left)),
				top : infestor.px(parseFloat(target.top) + parseFloat(target.height) + parseFloat(offset.depart))
			}));
				
				
		if (pos == 'left' || pos == 'right') {

			driftMap.middle = Math.ceil(parseFloat(this.getDom().offsetHeight) / 2) - 10;
			driftMap.rear = parseFloat(this.getDom().offsetHeight) - 21;
		}

		if (pos == 'top' || pos == 'bottom') {

			driftMap.middle = Math.ceil(parseFloat(this.getDom().offsetWidth) / 2) - 10;
			driftMap.rear = parseFloat(this.getDom().offsetWidth) - 21;
		}
			
		
		offset.drift = parseFloat(driftMap[offset.drift] || offset.drift || 0);
		
		target.topDock && this.element.css({
			
			top:0,
			bottom:'auto'
		
		}) && (offset.drift += parseFloat(target.top));
		
		
		target.bottomDock && this.element.css({
		
			top:'auto',
			bottom:0
			
		}) && (offset.drift += this.getDom().offsetHeight - parseFloat(target.bottom));

		return {
		
			pos : pos,
			drift : offset.drift,
			depart : offset.depart,
			leftTrend : target.leftTrend,
			topTrend : target.topTrend,
			trend : target.topTrend || target.leftTrend || false,
			dock : target.topDock || target.bottomDock || false
		
		};

	},

	
	// 初始化全局事件
	
	initGlobalEvents : function(){
	
		if(this.hideWithResize){
		
			this.hideWithResizeHandler = this.hideWithResizeHandler || infestor.throttle(function(){
				
				if(this.hidden) return;
				
				this.emit('beforehide',[this,{ hideWithResize:true }]);
				this.hide();
				this.emit('afterhide',[this,{ hideWithResize:true }]);
					
			});
			
			infestor.Dom.getWindow().on('resize',this.hideWithResizeHandler,this);
		
		}
		
		if(this.hideWithBlur){
		
			this.hideWithBlurHandler = this.hideWithBlurHandler || infestor.throttle(function(){
				
				if(this.hidden) return;
				
				this.emit('beforehide',[this,{ hideWithBlur:true }]);
				this.hide();
				this.emit('afterhide',[this,{ hideWithBlur:true }]);
					
			});
			
			this.element.on('click',function(e){
			
				this.blockBubble && infestor.stopPropagation(e);
			
			},this);
			
			infestor.Dom.getBody().on('click',this.hideWithBlurHandler,this);
		
		}
		
		return this;
	
	},
	
	RemoveGlobalEvents : function(){
	
		this.hideWithResizeHandler && infestor.Dom.getWindow().un('resize',this.hideWithResizeHandler);
		this.hideWithBlurHandler && infestor.Dom.getWindow().un('resize',this.hideWithBlurHandler);
		return this;
	
	},
	
	// 下面的方法为条件引入

	// 条件引入Tip组件
	initTip : function (tip) {

		if (!this.tip)
			return this;
			
		this.tipDisabled = false;

		infestor.mgr.require('infestor.Tip', function () {
		
			if(this.$tip) return;

			this.$tip = this.$tip || infestor.Tip.init();

			this.element.on('mouseover', infestor.throttle(function () {

				if(this.tipDisabled)
					return;
		
				this.$tip.setText(this.tip);
				this.$tip.autoPosition(this.element, this.tipTrend, this.tipDrift);
				this.$tip.show(this.tipZIndex);

			},150), this);
			
			this.element.on('click',function(){
			
				if(this.tipDisabled)
					return;
			
				this.$tip.setText('');
				this.$tip.hide();
			
			},this);

			this.element.on('mouseleave', function () {

				if(this.tipDisabled)
					return;
					
				this.$tip.setText('');
				this.$tip.hide();

			}, this);

		}, this);

		return this;

	},

	disableTip : function () {

		if(this.$tip){
		
			this.$tip.setText('');
			this.$tip.hide();
		}
	
		this.tipDisabled = true;
		return this;

	},

	// 条件引入Drag组件
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

	// 条件引入Resize组件
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

	// 动态获取大小调整及移动的限制容器(Dom)
	getLimitContainer : function () {

		return document.documentElement;

	},

	// 销毁实例
	destroy : function () {
	
		if(this.destroyed)
			return null;

		// 注销托管列表实例
		this.destroyList && infestor.each(this.destroyList, function () {

			this.destroy && this.destroy();

		});

		// 销毁子元素
		this.removeItem();
		
		// 注销全局事件
		this.RemoveGlobalEvents();

		// 注销移动和尺寸修改实例
		this.disableDraggable();
		this.disableResizable();

		// 销毁Dom元素
		this.element && this.element.destroy();
		
		// 如果是table布局 销毁封装该元素相应的td
		this.elementItemCellContainer && this.elementItemCellContainer.destroy();

		// 注销实例托管
		infestor.mgr.removeInstance(this.id);
		
		this.dataSet && this.dataSet.destroy();
			
		this.destroyed = true;
		
		this.callParent();

		return null;

	}

},function(Element){

	// # icon

	var iconNameMap = {},iconLogicPosMap = {};

	infestor.each(('flag expand share love comment list arrange folder eyes clock link sun moon contrast document'
		+	' ' + 'add minus multiply divide upload download rewind forward play pause stop record accept decline move'
		+	' ' + 'notes shutdown monitor music warning lock photographs stats location calendar battery mail drop star wayfinder'
		+	' ' + 'sound dashboard bookmark search film inbox game locate transform send lighting cloud zip settings smiley'
		+	' ' + 'experiments activity credit-card gear phone balance music-player image camera calculator mic compass temperature edit columns'
		+	' ' + 'wallet cube drawer conversation headphone wrong zoom shrink user users terminal up down back front'
		+	' ' + 'rss twitter dribbble facebook portfolio skype anchor film-reel analytics home transfer video wrench alarm eject').split(' '),		
	function(idx,name){
	
		var logicPos = {
		
			x : (idx%15 + 1) || idx,
			y : Math.floor(idx/15) + 1,
			name : name
		
		};
	
		iconNameMap[name] = logicPos;
		
		iconLogicPosMap[logicPos.y] = iconLogicPosMap[logicPos.y] || {};
		iconLogicPosMap[logicPos.y][logicPos.x] = logicPos;
	
	});
				
	infestor.override(Element,{
	
		$iconNameMap : iconNameMap,
		$iconLogicPosMap : iconLogicPosMap,
		$iconRealPosConvertor : function(logicPos,size){
		
			var x=logicPos.x,y=logicPos.y;
		
			if(!this.$iconLogicPosMap[y][x])
				return false;
			
			if(size == 16)
				return ['-',(14+(x-1)*25),'px -',(16+(y-1)*40),'px'].join(''); 
			
			if(size == 32)
				return ['-',(14*2+(x-1)*25*2),'px -',(16*2+(y-1)*40*2),'px'].join('');
			
			return false;
		
		}
	
	});


});
