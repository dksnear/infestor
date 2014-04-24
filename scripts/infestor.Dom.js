
// dom元素类
// 密封类 sealed class

infestor.define('infestor.Dom', {

	alias : 'dom',
	extend : 'infestor.Event',

	statics : {

		element : null,

		zIndex : 100,

		get : function (id) {

			return infestor.create('infestor.Dom', infestor.isString(id) ? document.getElementById(id) : id);
		},

		use : function (id) {

			infestor.Dom.element = infestor.Dom.element || new infestor.Dom();

			infestor.Dom.element.element = infestor.isString(id) ? document.getElementById(id) : id;

			return infestor.Dom.element;
		},

		create : function (tagName, attrs) {

			var element = infestor.isString(tagName) ? new infestor.Dom(document.createElement(tagName)) : infestor.Dom.get(tagName);

			attrs && element.attr(attrs);

			return element;
		},

		getBody : function () {

			return infestor.Dom.get(document.body);

		},

		// ie条件注释
		// 只在在文档加载前有效
		ieif : function (content, range) {

			return infestor.create('infestor.Dom', document.createComment(infestor.stringFormat('[if {0}]>{1}<![endif]',
						range || 'IE',
						(content instanceof infestor.Dom) ? content.outerHtml() : content)));

		},

		getZIndex : function () {

			return infestor.Dom.zIndex++;
		},

		setZIndex : function (element) {

			element.css('z-index', infestor.Dom.getZIndex());
		},

		clientWidth : function () {

			return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		},

		clientHeight : function () {

			return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
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
				}
				[event.button]);

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

	emit : function (eventName) {

		if (!this.element || !this.domEventsMap || !this.domEventsMap[eventName])
			return this;

		this.$ownerCls.$superClass.emit.call(this, eventName, eventArgs, scope || this);

		return this;
	},

	trigger : function (eventName, eventArgs, scope) {

		return this.emit.apply(this, arguments);

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

			}
			[name] || name;

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

	css : function (name, value) {

		var element = this.element,
		filter = function (name) {
			return name.replace(/-\w?/g, function (s) {
				return s.substring(1).toUpperCase();
			});
		},
		getStyle = function (name) {
			return element && (window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle)[filter(name)];
		},
		setStyle = function (name, value) {

			try {
				element && (element.style[filter(name)] = value);
			} catch (err) {}
		};

		if (infestor.isString(name) && infestor.isUndefined(value))
			return getStyle(name);

		if (infestor.isString(name) && !infestor.isUndefined(value))
			return setStyle(name, value), this;

		if (infestor.isObject(name))
			return element && infestor.each(name, function (name, value) {
				setStyle(name, value);
			}), this;

		return this;

	},

	css3 : function (name, value) {

		
		if(infestor.isIE8Minus()) return this;
		
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
		},this);

		return this;

	},

	//	attrs(p:padding m:margin b:border)
	height : function (attrs) {

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

	hasClass : function (cls) {

		var className = this.element && this.element.className || '';

		if (!className || !cls)
			return false;

		return new RegExp('\\b' + cls + '\\b', 'i').test(className);

	},

	addClass : function (cls) {

		var me = this,
		mutiCls;

		if (!this.element || !cls)
			return this;

		if (infestor.isObject(cls))
			return this.addClass(infestor.boe(cls));

		mutiCls = cls.split(' ');

		if (mutiCls.length > 1)
			return infestor.each(mutiCls, function () {
				me.addClass(String(this));
			}), this;

		cls = mutiCls[0];

		cls && !this.hasClass(cls) && (this.element.className ? (this.element.className += ' ' + cls) : (this.element.className = cls));

		return this;
	},

	removeClass : function (cls) {

		var me = this,
		mutiCls;

		if (!this.element || !cls)
			return this;

		if (infestor.isObject(cls))
			return this.addClass(infestor.boe(cls));

		mutiCls = cls.split(' ');

		if (mutiCls.length > 1)
			return infestor.each(mutiCls, function () {
				me.removeClass(String(this));
			}), this;

		cls = mutiCls[0];

		this.hasClass(cls) && (this.element.className = this.element.className.replace(new RegExp('\\b\\s?' + cls + '\\b', 'i'), '').replace(/^\s/, ''));

		return this;
	},

	val : function (val) {

		if (!this.element || !this.element.tagName.toLowerCase == 'input')
			return this;

		if (val)
			return this.element.value = val, this;

		return this.element.value;
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
			offsetParent = this.element.offsetParent;

		while (offsetParent) {

			top += offsetParent.offsetTop;
			left += offsetParent.offsetLeft;
			borderTop += infestor.parseNumeric(offsetParent.style.borderTopWidth);
			borderLeft += infestor.parseNumeric(offsetParent.style.borderLeftWidth);
			offsetParent = offsetParent.offsetParent;
		}

		return {

			rawTop : this.element.offsetTop,
			rawLeft : this.element.offsetLeft,
			top : top,
			left : left,
			rawBorderTop: infestor.parseNumeric(this.element.style.borderTopWidth),
			rawBorderLeft: infestor.parseNumeric(this.element.style.borderLeftWidth),
			borderTop:borderTop,
			borderLeft:borderLeft,
			height : this.element.offsetHeight,
			width : this.element.offsetWidth

		};
	},

	scroll : function () {

		return this.element && {

			top : this.element.scollTop,
			left : this.element.scollLeft,
			height : this.element.scrollHeight,
			width : this.element.scrollWidth
		};
	},

	client : function () {

		return this.element && {

			top : this.element.clientTop,
			left : this.element.clientLeft,
			height : this.element.clientHeight,
			width : this.element.clientWidth

		}

	},

	appendTo : function (parent) {

		parent.append(this);
		return this;
	},

	append : function (child) {
	
		var parentElement = this.element,childElement = child.getElement();
		
		if(!parent || !childElement) return this;
		
		if(infestor.isIE7Minus()){
		
			if(parentElement.nodeName.toLowerCase()=='table' && childElement.nodeName.toLowerCase()=='tr')
				return (child.element = parentElement.insertRow(parentElement.rows.length||0)),this;
			if(parentElement.nodeName.toLowerCase()=='tr' && childElement.nodeName.toLowerCase()=='td')
				return (child.element = parentElement.insertCell(parentElement.cells.length||0)),this;
		}
			
		return parentElement.appendChild(childElement),this;
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

		if (arguments.length < 1)
			return infestor.Dom.setZIndex(this), this;

		return this.css('z-index', index);

	},

	hide : function () {

		return this.element && this.css('display', 'none'),
		this;
	},

	show : function () {

		return this.element && this.css('display', 'block'),
		this;
	},

	remove : function () {

		this.element && this.element.parentNode && this.element.parentNode.removeChild(this.element);
		return null;
	},

	destroy : function () {

	    return this.remove();
		
	}

},
	function (cls) {

	//类创建完成后回掉方法


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

			return infestor.isFunction(eventHandle) ? cls.prototype.addEventListener.call(this, eventName, eventHandle, scope) : cls.prototype.emit.call(this, eventName,eventHandle,scope);
		}

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
