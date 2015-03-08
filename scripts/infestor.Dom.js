
// dom元素类
// 密封类 sealed class

infestor.define('infestor.Dom', {

	alias : 'dom',
	extend : 'infestor.Event',

	statics : {

		element : null,
	
		get : function (id) {

			return infestor.create('infestor.Dom', infestor.isString(id) ? document.getElementById(id) : id);
		},

		use : function (id) {

			infestor.Dom.element = infestor.Dom.element || new infestor.Dom();

			infestor.Dom.element.element = infestor.isString(id) ? document.getElementById(id) : id;

			return infestor.Dom.element;
		},

		create : function (tagName, attrs) {

			var element = infestor.create('infestor.Dom',document.createElement(tagName));

			attrs && element.attr(attrs);
			
			// 用于修正ie6-7 table 标记 appendChild 方法无效问题
			if(infestor.isIE7Minus() && tagName.toLowerCase()==='table')
				 element.$tbody = infestor.Dom.create('tbody').appendTo(element);

			return element;
		},

		getBody : function () {

			infestor.Dom.$body = infestor.Dom.$body || infestor.Dom.get(document.body);
			
			return infestor.Dom.$body;

		},
		
		getWindow:function(){
		
			infestor.Dom.$window = infestor.Dom.$window || infestor.Dom.get(window);
			
			return infestor.Dom.$window;
		
		},

		// ie条件注释
		// 只在在文档加载前有效
		ieif : function (content, range) {

			return infestor.create('infestor.Dom', document.createComment(infestor.stringFormat('[if {0}]>{1}<![endif]',
				range || 'IE',(content instanceof infestor.Dom) ? content.outerHtml() : content)));

		},

		initZIndex : function(){
			
			infestor.Dom.$zIndex = 100;
		
		},
		
		getZIndex : function () {
		
			if(!infestor.Dom.$zIndex || infestor.Dom.$zIndex > 9999)
				infestor.Dom.initZIndex();
				
			return infestor.Dom.$zIndex++;
		},

		setZIndex : function (element) {

			element.css('z-index', infestor.Dom.getZIndex());
		},

		clientWidth : function () {

			return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		},

		clientHeight : function () {

			return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		},
		
		autoScroll:function(opts){
		
			infestor.Dom.stopScroll();
		
			// x&y轴同时滚动不支持循环
			opts = infestor.append({
			
				// x轴循环滚动
				xCircle:false,
				// x轴滚动步长
				xStepSize:0,
				// x轴向前滚动(true) x轴向后滚动(false)
				xForward:true,
				// y轴循环滚动
				yCircle:false,
				// y轴滚动步长
				yStepSize:200,
				// y轴向前滚动(true) y轴向后滚动(false)
				yForward:true,			
				// 滚动间隔时间
				interval:1500
						
			},opts);
			
			infestor.Dom.$scrollTaskId = infestor.task(function(){
			
				var offset = infestor.Dom.getBody().offset(),
					scroll = {
					
						top : offset.rawScrollTop,
						left : offset.rawScrollLeft,
						height : offset.scrollHeight,
						width : offset.scrollWidth
					
					},
					isXend = opts.xForward ? scroll.left == scroll.width - infestor.Dom.clientWidth() : scroll.left == 0,
					isYend = opts.yForward ? scroll.top == scroll.height - infestor.Dom.clientHeight() : scroll.top == 0;
				
				if(!opts.xStepSize && isYend)
					return opts.yCircle ? window.scrollTo(0,opts.yForward ? 0 : scroll.top ) : infestor.Dom.stopScroll();
			
				if(!opts.yStepSize && isXend)
					return opts.xCircle ? window.scrollTo(opts.xForward ? 0 : scroll.left,0) : infestor.Dom.stopScroll();
				
				// x&y轴同时滚动不支持循环
				if(opts.xStepSize && opts.yStepSize && isXend && isYend)
					return infestor.Dom.stopScroll();
			
				opts.xForward ? (scroll.left += opts.xStepSize) : (scroll.left -= opts.xStepSize);
				opts.yForward ? (scroll.top += opts.yStepSize) : (scroll.top -= opts.yStepSize);

				window.scrollTo(scroll.left,scroll.top);
			
			},opts.interval);
			
		
		},
		
		stopScroll:function(){
		
			infestor.stopTask(infestor.Dom.$scrollTaskId);
		
		},
		
		// 构造一个等腰三角形
		triangle:function(opts){
		
			opts = infestor.append({
			
				// 斜边长
				hypotenuse:10,
				// 斜角方向 (top|left|bottom|right)
				bevelTrend:'top',
				// 颜色
				color:'gray',	
				// 其他样式
				css:null
			
			},opts);
			
			
			return infestor.Dom.create('div').css(infestor.append({
			
				width : '0px',
				height : '0px',
				borderWidth:{
					left : infestor.stringFormat('{0}px {1}px {2}px {3}px',opts.hypotenuse,opts.hypotenuse,opts.hypotenuse,0),
					right : infestor.stringFormat('{0}px {1}px {2}px {3}px',opts.hypotenuse,0,opts.hypotenuse,opts.hypotenuse),
					top : infestor.stringFormat('{0}px {1}px {2}px {3}px',0,opts.hypotenuse,opts.hypotenuse,opts.hypotenuse),
					bottom : infestor.stringFormat('{0}px {1}px {2}px {3}px',opts.hypotenuse,opts.hypotenuse,0,opts.hypotenuse)
				}[opts.bevelTrend],
				borderStyle:{ 
					left : 'dashed solid',
					right : 'dashed solid',
					top : 'solid dashed',
					bottom : 'solid dashed'
				}[opts.bevelTrend],
				borderColor:{
					left : 'transparent ' + opts.color,
					right: 'transparent ' + opts.color,
					top : opts.color  + ' transparent',
					bottom : opts.color  + ' transparent'
				}[opts.bevelTrend]
			
			},opts.css));
		
		}

	},

	element : null,

	constructor : function (element) {

		this.element = element;
		this.id = infestor.getId();

	},

	getElement : function () {

		return this.element;
	},

	addEventListener : function (eventName, eventHandle, scope) {

		var me = this,
			fixEvent = function (event) {

				if (!event)
					return;

				//ie6-8

				infestor.isUndefined(event.which) && !infestor.isUndefined(event.button) && (event.which = {
					0 : 2,
					1 : 1,
					2 : 3
				}[event.button]);

				infestor.isUndefined(event.preventDefault) && (event.preventDefault = function () {
					event.returnValue = false;
				});
				infestor.isUndefined(event.stopPropagation) && (event.stopPropagation = function () {
					event.cancelBubble = true;
				});
			};

		if (!this.element)
			return this;
		
		scope = scope || this;
		this.domEventsMap = this.domEventsMap || {};

		if (!this.domEventsMap[eventName]) {

			this.domEventsMap[eventName] = function () {

				fixEvent(arguments[0]);
				me.$ownerCls.$superClass.emit.call(me, eventName, arguments, scope);
			};

			infestor.addEventListener(this.element, eventName, this.domEventsMap[eventName]);
		}

		this.$ownerCls.$superClass.addEventListener.apply(this, arguments);

		return this;
	},

	removeEventListener : function (eventName, eventHandle) {
	
		if (!this.element || !this.domEventsMap || !this.domEventsMap[eventName])
			return this;

		this.$ownerCls.$superClass.removeEventListener.apply(this, arguments);

		if (!eventHandle) {

			infestor.reomveEventListener(this.element, eventName, this.domEventsMap[eventName]);
			delete this.domEventsMap[eventName];

		}

		return this;

	},

	// 非浏览器模拟指派事件
	emit : function (eventName, eventArgs, scope) {

		if (!this.element || !this.domEventsMap || !this.domEventsMap[eventName])
			return this;

		this.$ownerCls.$superClass.emit.call(this, eventName, eventArgs, scope || this);

		return this;
	},

	trigger : function () {

		return this.emit.apply(this, arguments);

	},
	
	// 浏览器模拟指派事件
	dispatch : function(eventName,propagation,preventDefault){
	
		this.element && infestor.dispatchEvent(this.element, eventName, propagation, preventDefault);
		
		return this;
	
	},
	
	fire : function(){
	
		return this.dispatch.apply(this,arguments);
		
	},

	bind : function () {

		return this.addEventListener.apply(this, arguments);
	},

	unbind : function () {

		return this.removeEventListener.apply(this, arguments);
	},

	on : function () {

		return this.addEventListener.apply(this, arguments);
	},

	un : function () {

		return this.removeEventListener.apply(this, arguments);
	},

	parent : function () {

		return new infestor.Dom(this.getElement().parentNode);
	},

	children : function () {

		if (!this.element.hasChildNodes())
			return [];

		var children = [];

		infestor.each(this.element.childNodes, function () {

			infestor.Dom.isElement(this) && children.push(infestor.Dom.get(this));
		});

		return children;

	},

	previous : function () {

		return this.element && infestor.Dom.get(this.element.previousSibling);
	},

	next : function () {

		return this.element && infestor.Dom.get(this.element.nextSibling);
	},

	attr : function (name, value) {

		var element = this.element,
			ieFix = function (name) {

				if (!infestor.browser.msie)
					return name;

				return {

					acceptcharset : 'acceptCharset',
					accesskey : 'accessKey',
					allowtransparency : 'allowTransparency',
					bgcolor : 'bgColor',
					cellpadding : 'cellPadding',
					cellspacing : 'cellSpacing',
					'class' : 'className',
					colspan : 'colSpan',
					checked : 'defaultChecked',
					selected : 'defaultSelected',
					'for' : 'htmlFor',
					frameborder : 'frameBorder',
					hspace : 'hSpace',
					longdesc : 'longDesc',
					maxlength : 'maxLength',
					marginwidth : 'marginWidth',
					marginheight : 'marginHeight',
					noresize : 'noResize',
					noshade : 'noShade',
					readonly : 'readOnly',
					rowspan : 'rowSpan',
					tabindex : 'tabIndex',
					valign : 'vAlign',
					vspace : 'vSpace'

				}[name] || name;

			};

		if (infestor.isString(name) && infestor.isUndefined(value))
			return element && element.getAttribute(ieFix(name));

		if (infestor.isString(name) && infestor.isNull(value))
			return element && element.removeAttribute(ieFix(name)), this;

		if (infestor.isString(name) && !infestor.isUndefined(value))
			return element && element.setAttribute(ieFix(name), value), this;

		if (infestor.isObject(name))
			return element && infestor.each(name, function (name, value) {
				element.setAttribute(ieFix(name), value)
			}), this;

		return this;
	},

	removeAttr : function (name) {

		return this.attr(name, null);

	},

	css : function (name, value) {

		var element = this.element,
			getStyle = function (name) {
				return element && (window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle)[infestor.stdn(name)];
			},
			setStyle = function (name, value) {

				try {
					element && (element.style[infestor.stdn(name)] = value);
				} catch (err) {}
			};

		if (infestor.isString(name) && infestor.isUndefined(value))
			return getStyle(name);

		if (infestor.isString(name) && !infestor.isUndefined(value))
			return setStyle(name, value), this;

		if (infestor.isObject(name))
			return element && infestor.each(name, function (name, value) { setStyle(name, value); }), this;

		return this;

	},

	css3 : function (name, value) {

		if (infestor.isIE8Minus())
			return this;

		var prefix = {

			chrome : '-webkit-',
			webkit : '-webkit-',
			opera : '-o-',
			//msie: '-ms-',
			mozilla : '-moz-'

		}[infestor.browser.name] || '';

		infestor.isString(name) && this.css(prefix + name, value);

		infestor.isRawObject(name) && infestor.each(name, function (name, value) {
			this.css(prefix + name, value);
		}, this);

		return this;

	},

	// 清除样式
	cssClear : function(name){
	
		var css;
		
		if(!this.element)
			return this;
	
		if(arguments.length < 1)
			return infestor.each(this.element.style,function(name,value){ this.element.style[name] = '';  },this),this;
		
		name = infestor.isString(name) ? name.split(' ') : name;
		
		if(name.length < 1)
			return this;
		
		return this.css((css = {}) && infestor.each(name,function(){ css[String(this)] = ''; }) && css);

	},
	
	//	attrs(p:padding m:margin b:border)
	height : function (attrs) {
	
		if(!attrs) 
			return infestor.parseNumeric(this.element.offsetHeight);

		var m = /m/i.test(attrs),
			b = /b/i.test(attrs),
			p = /p/i.test(attrs),
			oh = infestor.parseNumeric(this.element.offsetHeight),
			ph = infestor.parseNumeric(this.css('padding-top')) + infestor.parseNumeric(this.css('padding-bottom')),
			bh = infestor.parseNumeric(this.css('border-top-width')) + infestor.parseNumeric(this.css('border-bottom-width')),
			mh = infestor.parseNumeric(this.css('margin-top')) + infestor.parseNumeric(this.css('margin-bottom')),
			h = oh - ph - bh;

		if (!attrs)
			return h < 0 ? 0 : h;

		m && (h += mh);
		b && (h += bh);
		p && (h += ph);

		return h < 0 ? 0 : h;

	},

	//	attrs(p:padding m:margin b:border)
	width : function (attrs) {
	
		if(!attrs)
			return infestor.parseNumeric(this.element.offsetWidth);

		var m = /m/i.test(attrs),
			b = /b/i.test(attrs),
			p = /p/i.test(attrs),
			ow = infestor.parseNumeric(this.element.offsetWidth),
			pw = infestor.parseNumeric(this.css('padding-left')) + infestor.parseNumeric(this.css('padding-right')),
			bw = infestor.parseNumeric(this.css('border-left')) + infestor.parseNumeric(this.css('border-right')),
			mw = infestor.parseNumeric(this.css('margin-left')) + infestor.parseNumeric(this.css('margin-right')),
			w = ow - pw - bw;

		if (!attrs)
			return w < 0 ? 0 : w;

		m && (w += mw);
		b && (w += bw);
		p && (w += pw);

		return w < 0 ? 0 : w;

	},

	transform : function (value) {

		if (arguments.length > 0)
			return this.css3('transform', value);

		if (!this.$transformStyle)
			return this;

		this.css3('transform', this.$transformStyle.join(' '));

		return this.$transformStyle = null,
		this;
	},
	
	getClass : function(){
	
		return  this.element && this.element.className || '';
	},

	hasClass : function (cls) {

		var className = this.element && this.element.className || '';

		if (!className || !cls)
			return false;

		return new RegExp('\\b' + cls + '\\b', 'i').test(className);

	},

	addClass : function (cls) {

		var mutiCls;

		if (!this.element || !cls)
			return this;

		if (infestor.isObject(cls))
			return this.addClass(infestor.bRouter(cls));

		mutiCls = cls.split(' ');

		if (mutiCls.length > 1)
			return infestor.each(mutiCls, function (idx,cls) {
				this.addClass(String(cls));
			},this), this;

		cls = mutiCls[0];

		cls && !this.hasClass(cls) && (this.element.className ? (this.element.className += ' ' + cls) : (this.element.className = cls));

		return this;
	},

	removeClass : function (cls) {

		var mutiCls;

		if (!this.element || !cls)
			return this;

		if (infestor.isObject(cls))
			return this.removeClass(infestor.bRouter(cls));

		mutiCls = cls.split(' ');

		if (mutiCls.length > 1)
			return infestor.each(mutiCls, function (idx,cls) {
				this.removeClass(String(cls));
			},this), this;

		cls = mutiCls[0];

		this.hasClass(cls) && (this.element.className = this.element.className.replace(new RegExp('\\b\\s?' + cls + '\\b', 'i'), '').replace(/^\s/, ''));

		return this;
	},

	val : function (val) {

		if (!this.element || !/input|textarea/i.test(this.element.tagName))
			return this;

		if (arguments.length > 0)
			return this.element.value = val, this;

		return this.element.value;
	},
	
	setSelectionRange : function(start,end){
	
		var range;
	
		if (!this.element || !/input|textarea/i.test(this.element.tagName))
			return this;
			
		start = parseInt(start);
		end = parseInt(end);
		
		start = start < 0 ? 0 : start;
		end = end < 0 ? 0 : end;
		
		if(start == end)
			return this;
 			
		if(this.element.createTextRange){
			
			range = this.element.createTextRange();
			range.moveStart('character',start);
			range.moveEnd('character',end);
			range.select();
		
		}else{
		
			this.element.setSelectionRange(start,end);
			this.element.focus();
		
		}	
		
		return this;
	
	},

	html : function (html) {

		if (!this.element)
			return this;

		if (infestor.isUndefined(html))
			return this.element.innerHTML;

		return this.element.innerHTML = html,
		this;
	},

	outerHtml : function () {

		return this.element && this.element.outerHTML;
	},

	offset : function () {

		if (!this.element)
			return null;

		var top = this.element.offsetTop,
			left = this.element.offsetLeft,
			borderTop = infestor.parseNumeric(this.element.style.borderTopWidth),
			borderLeft = infestor.parseNumeric(this.element.style.borderLeftWidth),
			scrollTop = this.element.scrollTop,
			scrollLeft = this.element.scrollLeft,
			offsetParent = this.element.offsetParent;
			
		while (offsetParent) {

			top += offsetParent.offsetTop;
			left += offsetParent.offsetLeft;
			scrollTop += offsetParent.scrollTop;
			scrollLeft += offsetParent.scrollLeft;
			borderTop += infestor.parseNumeric(offsetParent.style.borderTopWidth);
			borderLeft += infestor.parseNumeric(offsetParent.style.borderLeftWidth);
			offsetParent = offsetParent.offsetParent;
		}

		return {

			rawTop : this.element.offsetTop,
			rawLeft : this.element.offsetLeft,
			top : top,
			left : left,
			height : this.element.offsetHeight,
			width : this.element.offsetWidth,
			rawBorderTop : infestor.parseNumeric(this.element.style.borderTopWidth),
			rawBorderLeft : infestor.parseNumeric(this.element.style.borderLeftWidth),
			borderTop : borderTop,
			borderLeft : borderLeft,		
			rawScrollTop: this.element.scrollTop,
			rawScrollLeft : this.element.scrollLeft,
			scrollTop: scrollTop,
			scrollLeft : scrollLeft,
			scrollHeight : this.element.scrollHeight,
			scrollWidth : this.element.scrollWidth,
			clientTop : this.element.clientTop,
			clientLeft : this.element.clientLeft,
			clientHeight : this.element.clientHeight,
			clientWidth : this.element.clientWidth

		};
	},

	// 返回元素位置在以浏览器中心为坐标原点的平面直角坐标系中的所属象限
	// @return 0:无法判定  1:右上 2:左上 3:左下 4:右下
	clientQuadrant : function(){
	
		var clientWidth = document.documentElement.clientWidth,
			clientHeight = document.documentElement.clientHeight,
			offset = this.offset(),
			y = offset.top + offset.height/2,
			x = offset.left + offset.width/2;
			
		if(x < clientWidth/2 && y < clientHeight/2)
			return 2;
		
		if(x >= clientWidth/2 && y < clientHeight/2)
			return 1;
		
		if(x < clientWidth/2 && y >= clientHeight/2)
			return 3;
		
		if(x >= clientWidth/2 && y >= clientHeight/2)
			return 4;
		
		return 0;
			
	},
	
	appendTo : function (parent) {

		parent.append(this);
		return this;
	},

	append : function (child) {

		var parentElement = this.element,
		childElement = child.getElement();

		if (!parentElement || !childElement)
			return this;
	
		// 修正ie6-7 table 标记 appendChild 方法无效问题
		if (infestor.isIE7Minus() && parentElement.nodeName.toLowerCase() == 'table' && childElement.nodeName.toLowerCase() == 'tr')
			return this.$tbody.element.appendChild(childElement),this;

		return parentElement.appendChild(childElement),this;
	},
	
	before : function(afterSibling){
	
		return afterSibling.insertBefore(this);
	
	},
	
	after : function(beforeSibling){
	
		return beforeSibling.insertAfter(this);
	},
	
	insertBefore : function(beforeSibling) {
	
		if(!this.element.parentNode) return this;
	
		return this.element.parentNode.insertBefore(beforeSibling.element,this.element),this;
	
	},
	
	insertAfter : function(afterSibling) {
	
		if(!this.element.parentNode) return this;
	
		if(!this.element.nextSibling)
			return infestor.Dom.get(this.element.parentNode).append(afterSibling);
	
		return infestor.Dom.get(this.element.nextSibling).insertBefore(afterSibling);		
	},

	text : function (text) {

		if (infestor.isUndefined(text))
			return this.textNode && this.textNode.textContent || '';

		this.textNode && this.element.removeChild(this.textNode);

		this.textNode = document.createTextNode(text);

		this.element.appendChild(this.textNode);

		return this;
	},

	zIndex : function (index) {

		if (!index) return infestor.Dom.setZIndex(this), this;

		return this.css('z-index', String(index));

	},

	hide : function () {

		return this.element && this.css('display', 'none'),this;
	},

	show : function () {
	
		return this.element && this.css('display',''),this;
	},

	remove : function () {
	
		// 处理iframe被销毁时产生的内存泄漏
		if(this.element && this.element.nodeName.toLowerCase() == 'iframe'){
		
			try {
				
				// this.element.src = location.href ; //'about:blank';
				this.element.src = 'about:blank';
				this.element.contentWindow.document.write('');
				//this.element.contentWindow.document.close();
				this.element.contentWindow.document.clear();
				this.element.contentWindow.close();
			
			}catch(e){
			
			}
			
		}

		this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element);
		
		this.element = null;
	},

	destroy : function () {

		this.remove();

		return this.element = null;

	}

},function (cls) {

	//类创建完成后回调方法


	// 创建判断节点类型方法集合
	infestor.each({

		isElement : 1,
		isAttribute : 2,
		isText : 3,
		isComment : 8,
		isDocument : 9

	}, function (name, value) {

		//静态方法

		cls[name] = function (element) {

			element = element instanceof cls ? element.element : element;

			return element && element.nodeType == value;

		};

		//实例方法

		var clsMethods = {};

		clsMethods[name] = function () {

			return cls[name](this);

		};

		infestor.override(cls, clsMethods);

	});

	// 创建所有DTD对象静态方法集合
	infestor.each(('a abbr acronym address applet area article aside audio ' +
			'b base basefont bdi bdo big blockquote body br button ' +
			'canvas caption center cite code col colgroup command ' +
			'datalist dd del details dfn dir div dl dt ' +
			'em embed ' +
			'fieldset figcaption figure font footer form frame frameset ' +
			'h1 h2 h3 h4 h5 h6 head header hgroup hr html ' +
			'i iframe img input ins keygen kbd label legend li link ' +
			'map mark menu meta meter ' +
			'nav noframes noscript ' +
			'object ol optgroup option output ' +
			'p param pre progress ' +
			'q ' +
			'rp rt ruby ' +
			's samp script section select small source span strike strong style sub summary sup ' +
			'table tbody td textarea tfoot th thead time title tr track tt ' +
			'u ul ' +
			'var video ' +
			'wbr').split(' '), function () {

		var tagName = String(this);

		cls[tagName] = function (attrs) {

			return cls.create(tagName, attrs);
		}
	});

	// 创建绑定事件方法集合
	infestor.each(('blur focus focusin focusout load resize scroll unload click dblclick ' +
			'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
			'change select submit keydown keypress keyup error contextmenu').split(' '), function () {

		var eventName = String(this),
			methods = {};

		methods[eventName] = function (eventHandle, scope) {

			return infestor.isFunction(eventHandle) ? cls.prototype.addEventListener.call(this, eventName, eventHandle, scope) : cls.prototype.emit.call(this, eventName, eventHandle, scope);
		};

		infestor.override(cls, methods);
	});

	// 创建修改3d样式方法集合
	infestor.each(('matrix matrix3d rotate rotate3d rotateX rotateY rotateZ scale scale3d scaleX scaleY scaleZ ' +
			'skew skewX skewY translate translate3d translateX translateY translateZ perspective').split(' '), function () {

		var methodName = String(this),
		methods = {};

		methods[methodName] = function () {

			if (arguments.length < 1)
				return this;

			if (!this.$transformStyle)
				this.$transformStyle = [];

			this.$transformStyle.push(infestor.stringFormat(methodName + '({0})', Array.apply(null, arguments).join(',')));

			return this;
		};

		infestor.override(cls, methods);

	});

});
