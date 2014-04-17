/******************************

infestor js

 ********************************/

(function (window, libName, alias) {

	var document = window.document,
	navigator = window.navigator,
	global = function (handle, scope) {

		global.loader.using(handle, scope || window);

	};

	global.$$libName = libName;

	global.$globalId = 1;

	global.emptyFn = function () {};

	global.getId = function () {

		global.$prefix = global.$prefix || (global.randomCode(4) + '-');

		return global.$prefix + global.$globalId++;
	},

	global.append = function (des, src) {

		var action = function (d, s) {

			if (!s)
				return d;
			if (!d)
				return s;

			var isArray = d instanceof Array,
			isObj = (typeof d === 'function' || typeof d === 'object') && !isArray;

			if (isArray)
				for (var i = 0, ln = s.length; i < ln; i++)
					d.push(s[i]);

			if (isObj)
				for (var item in s)
					d[item] = s[item];

			return d;
		}

		if (typeof des === 'string') {

			this[des] = {};
			this[des].append = arguments.callee;
			return this[des];
		}

		if (arguments.length === 1)
			return action(this, des);

		if (arguments.length === 2)
			return action(des, src);

		if (arguments.length > 2) {

			for (var i = 1, ln = arguments.length; i < ln; i++)
				action(des, arguments[i]);
			return des;
		}
	};

	global.appendIf = function (des, src, predicate, scope, reverse) {

		global.isString(predicate) && (predicate = [predicate]);

		var predicateArr = global.isArray(predicate) ? predicate : null;

		predicate = !predicateArr ? predicate : function (name, item, src, des) {

			if (reverse)
				return global.inArray(name, predicateArr) == -1;
			if (!reverse)
				return global.inArray(name, predicateArr) != -1;

			return false;

		};

		predicate = predicate || function (name, item, src, des) {

			return !des.hasOwnProperty(name);

		};

		for (var name in src)
			predicate.call(scope || src[name], name, src[name], src, des) && (des[name] = src[name]);

		return des;
	};

	//基本方法
	global.append({

		error : function (msg, thw) {

			var stackInfo = '',
			caller = arguments.callee,
			depth = 20,
			stack = true;

			if (msg && !global.isString(msg)) {

				depth = msg.depth || depth;
				stack = global.isUndefined(msg.stack) ? stack : false;
				msg = msg.msg;

			};
			while (stack && caller && depth > 0) {

				caller.$clsName && (stackInfo += global.stringFormat('#   className: {0}  instId: {1}  instName:{2}\n', caller.$clsName, caller.id, caller.name));

				caller = caller.caller;
				--depth;

			};

			msg = !stack ? msg : (msg + '\n\n# stackInfo:\n\n' + stackInfo);

			msg = '错误信息:' + msg;

			window.console && window.console.log(msg);

			if (!thw) {

				throw msg;
			}
		},

		eval : function (statement) {

			if (!/\S/.test(statement))
				return;

			(window.execScript || function (statement) {
				window['eval'].call(window, statement)
			})(statement);

		},

		each : function (object, callback, scope) {

			var name,
			i = 0,
			length = object && object.length,
			isObj = length === undefined || typeof object === 'function';

			if (!object)
				return;

			if (isObj) {
				for (name in object)
					if (callback.call(scope || object[name], name, object[name]) === false)
						break;
			} else {
				for (; i < length; i++)
					if (callback.call(scope || object[i], i, object[i]) === false)
						break;
			}
		},

		/* 获取predicate返回true的元素 */
		filter : function (obj, predicate, scope) {

			var newObj;

			if ((obj instanceof Array) && predicate) {

				newObj = [];

				global.each(obj, function (idx, val) {

					if (!predicate.call(scope || val, idx, val))
						return true;

					newObj.push(val);
				});

				return newObj;
			}

			if ((typeof obj == 'object') && predicate) {

				newObj = {};

				global.each(obj, function (name, val) {

					if (!predicate.call(scope || val, name, val))
						return true;

					newObj[name] = val;
				});

				return newObj;
			}

			return obj;

		},

		map : function (obj, func, scope) {

			var arr = [];

			global.each(obj, function (idx, val) {

				newObj.push(func.call(scope || val, idx, val));
			});

			return arr;

		},

		uniqueArray : function (arr) {

			if (!global.isArray(arr))
				return;

			var newArr = [],
			uniqueMap = {};

			global.each(arr, function () {
				global.uniquePush(newArr, this, uniqueMap);
			});

			return newArr;
		},

		uniquePush : function (arr, item, uniqueMap) {

			if (!global.isArray(arr))
				return;

			if (uniqueMap[item])
				return;

			arr.push(item);

			uniqueMap[item] = true;
		},

		// form jQuery inArray
		inArray : function (val, arr, i) {

			if (!global.isArray(arr))
				return false;

			if (Array.prototype.indexOf)
				return Array.prototype.indexOf.call(arr, val, i);

			var len = arr.length;

			i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

			for (; i < len; i++) {
				if (i in arr && arr[i] === val) {
					return i;
				}
			}

			return -1;
		},

		type : function (obj) {

			this.typeMap = this.typeMap || (function () {

					var map = {};

					global.each('Boolean Number String Function Array Date RegExp Object Arguments'.split(' '), function (i, name) {

						map['[object ' + name + ']'] = name.toLowerCase();
					});

					return map;

				})();

			return this.typeMap[Object.prototype.toString.call(obj)] || null;

		},

		isObject : function (obj) {
			return typeof obj == 'object';
		},

		isArray : function (obj) {
			return this.type(obj) === 'array';
		},

		isNumber : function (obj) {
			return this.type(obj) === 'number';
		},

		isNumeric : function (obj) {
			return !isNaN(parseFloat(obj)) && isFinite(obj);
		},

		isString : function (obj) {
			return this.type(obj) === 'string';
		},

		isFunction : function (obj) {
			return this.type(obj) === 'function';
		},

		isBoolean : function (obj) {
			return this.type(obj) === 'boolean';
		},

		isUndefined : function (obj) {
			return obj === undefined
		},

		isNull : function (obj) {
			return obj === null;
		},

		isDate : function (obj) {
			return this.type(obj) === 'date';
		},

		isRegExp : function (obj) {
			return this.type(obj) === 'regexp';
		},

		isArguments : function (obj) {

			if (obj && this.type(arguments) != 'arguments')
				return !this.isUndefined(obj.length) && !this.isUndefined(obj.callee);

			return this.type(obj) === 'arguments';
		},

		// form jQuery isPlainObject
		isRawObject : function (obj) {

			var hasOwn = Object.prototype.hasOwnProperty,
			key;

			// Must be an Object. 必须是Object对象
			// Because of IE, we also have to check the presence of the constructor property. 如果是IE还要考虑constuctor属性的存在
			// Make sure that DOM nodes and window objects don't pass through, as well 确保DOM节点对象和window对象也不能通过

			if (!obj || global.type(obj) !== "object" || obj.nodeType || global.isWindow(obj)) {
				return false;
			}

			try {
				// Not own constructor property must be Object 对象本身不存在constructor属性一定是Object
				if (obj.constructor &&
					!hasOwn.call(obj, 'constructor') &&
					!hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
					return false;
				}
			} catch (e) {
				// IE8,9 Will throw exceptions on certain host objects #9897 IE8,9会在某些本地对象上抛出异常
				return false;
			}

			// Own properties are enumerated firstly, so to speed up, 本身属性会优先枚举 所以遍历
			// if last one is own, then all properties are own. 假如最后一个属性也是自己的 那所有的属性也是自己的

			for (key in obj) {}

			return key === undefined || hasOwn.call(obj, key);
		},

		// from jQuery isWindow
		isWindow : function (obj) {

			return obj && typeof obj === "object" && "setInterval" in obj;
		},

		isEmptyObject : function (obj) {

			for (var i in obj) {
				if (obj.hasOwnProperty(i))
					return false;
			}

			return true;
		},

		alias : function (target, method, name) {

			global.namespace(name, function () {

				return target[method].apply(target, arguments);
			});

		},

		argsToArray : function (args) {

			return Array.prototype.slice.call(args);

		},

		param : function (obj) {

			if (!obj || global.isString(obj)) {

				var url = obj || document.location.search,
				url = url.replace(/&amp;/gi, '&'),
				reg = /(?:^\?|&)(.*?)=(.*?)(?=&|$)/g,
				temp,
				args = {};
				while ((temp = reg.exec(url)) != null) {
					try {
						args[decodeURIComponent(temp[1])] = decodeURIComponent(temp[2]);
					} catch (e) {
						args[unescape(temp[1])] = unescape(temp[2]);
					}
				}

				return args;

			}

			var paramArr = [];

			global.each(obj, function (name, val) {

				if (!obj.hasOwnProperty(name))
					return true;
				paramArr.push(name + '=' + val);

			});

			return paramArr.join('&');

		},

		// from jQuery browser
		browser : (function () {

			var ua = navigator.userAgent.toLowerCase(),
			result = {},
			match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
				[];

			match[1] && (result[match[1]] = true);
			result.name = match[1] || '';
			result.version = match[2] || '0'

				return result;

		})(),

		parseNumeric : function (s) {

			s = parseFloat(s);

			return isNaN(s) ? 0 : s;

		},

		// 格式化样式字符串
		styleFormat : function (expr) {

			var expr = String(expr).split(' '),
			match = /(\d+\.?\d*|.+)(px|em|ex|%|mm|cm|in|rem|deg|rad|grad)?/i,
			unit,
			size,
			result = [];

			global.each(expr, function (idx, expr) {

				expr = match.exec(expr);
				unit = expr && expr[2] || 'px';
				expr = expr && expr[1];
				size = parseFloat(expr);
				expr = isNaN(size) ? expr : (size + unit);

				result.push(expr);

			});

			return result.join(' ');

		},

		dateFormat : function (date, format) {

			if (!global.isDate(date))
				return date;

			var o = {
				'M+' : date.getMonth() + 1, //month
				'd+' : date.getDate(), //day
				'H+' : date.getHours(), //hour
				'm+' : date.getMinutes(), //minute
				's+' : date.getSeconds(), //second
				'q+' : Math.floor((date.getMonth() + 3) / 3), //quarter
				'S' : date.getMilliseconds() //millisecond
			};

			if (/(y+)/.test(format))
				format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

			for (var k in o)
				if (new RegExp('(' + k + ')').test(format))
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));

			return format;
		},

		stringFormat : function (str) {

			if (arguments.length < 1)
				return '';
			var i = 1,
			len = arguments.length;
			for (; i < len; i++)
				str = str.replace(new RegExp('\\{' + (i - 1) + '\\}', 'gm'), arguments[i]);
			return str;

		},

		// 位数格式化
		digitFormat : function (num, digit) {

			if (!global.isNumber(num))
				return '';

			var s = String(num),
			d = digit || 3,
			l = s.length,
			dif = l - d,
			p = '0';

			if (dif > 0)
				return s.substr(dif);

			if (dif < 0) {
				while (dif !== 0) {

					s = p + s;
					dif++;
				}

				return s;
			};

			return s;

		},

		guid : function () {

			var g = function () {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}

			return [g() + g(), g(), g(), g(), g() + g() + g()].join('-');

		},

		random : function (lower, upper) {

			return Math.floor(Math.random() * (upper - lower + 1) + lower);

		},

		randomCode : function (len) {

			var dict = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
			len = len || 6,
			i = 0,
			rs = '';

			for (; i < len; i++)
				rs += dict.charAt(Math.floor(Math.random() * 100000000) % dict.length);

			return rs;

		},

		jsonEncode : function (obj, rules) {

			if (window.JSON && !rules)
				return window.JSON.stringify(obj);

			var rules = global.append({

					arrayParser : function (o) {

						var str = [];

						global.each(o, function (idx, item) {
							str.push(parser(item));
						});

						return '[' + str.join(',') + ']';
					},
					objectParser : function (o) {

						var str = [];

						global.each(o, function (name, value) {
							o.hasOwnProperty(name) && str.push('"' + name + '":' + parser(value));
						});

						return '{' + str.join(',') + '}';
					},
					booleanParser : function (o) {
						return Boolean.prototype.toString.call(o);
					},
					dateParser : function (o) {
						return '"' + global.dateFormat(o, 'yyyy-MM-ddTHH:mm:ss.SZ') + '"';
					},
					regExpParser : function (o) {
						return '{}';
					},
					stringParser : function (o) {
						return '"' + String(o) + '"';
					},
					numberParser : function (o) {
						return Number(o);
					},
					functionParser : function (o) {
						return '';
					},
					undefinedParser : function (o) {
						return 'null'
					},
					nullParser : function (o) {
						return 'null'
					}

				}, rules);

			return (function (o) {

				if (global.isUndefined(o))
					return rules.undefinedParser(o);
				if (global.isNull(o))
					return rules.nullParser(o);
				if (global.isString(o))
					return rules.stringParser(o);
				if (global.isArray(o))
					return rules.arrayParser(o);
				if (global.isBoolean(o))
					return rules.booleanParser(o);
				if (global.isDate(o))
					return rules.dateParser(o);
				if (global.isNumber(o))
					return rules.numberParser(o);
				if (global.isFunction(o))
					return rules.functionParser(o);
				if (global.isRegExp(o))
					return rules.regExpParser(o);
				if (global.isRawObject(o))
					return rules.objectParser(o);

				return '';

			})(obj);

		},

		jsonDecode : function (str) {

			if (window.JSON)
				return window.JSON.parse(str);

			return eval(str);
		},

		delay : function (fn, time, scope) {

			setTimeout(function () {

				fn.apply(scope || window);

			}, time || 1);

		},

		task : function (fn, interval, scope) {

			return setInterval(function () {

				fn.apply(scope || window);

			}, interval || 1000);

		},

		stopTask : function (id) {

			if (!id && id !== 0)
				return;

			clearInterval(id);
		},

		// 防抖(方法被调用时 等待一定时间(wait)后再执行方法(fn))
		// @fn(fn) 待执行方法
		// @wait(numeric) 等待时间
		// @asap(bool) 直接执行
		debounce : function (fn, wait, asap) {

			var timeout = null;

			wait = wait || 200;

			return function () {

				var scope = this,
				args = arguments;

				timeout && clearTimeout(timeout);

				asap && fn.apply(this, arguments);

				timeout = setTimeout(function () {

						!asap && fn.apply(scope, args);
						timeout = null;

					}, wait)

			};

		},

		// 节流(方法(fn)第一次被调用时直接执行方法 之后一定时间内(wait)的调用将被屏蔽)
		// @fn(fn) 待执行方法
		// @wait(numeric) 等待时间
		// @alt(fn) 等待时间内的替换方法
		throttle : function (fn, wait, alt) {

			var last = Date.now();

			wait = wait || 200;

			return function () {

				var now = Date.now();

				if (now - last < wait)
					return alt && alt.apply(this, arguments);

				last = now;

				return fn.apply(this, arguments);

			};

		}

	});

	global.append({

		//同步加载脚本
		writeScript : function (path, raw) {

			path = raw ? path : location.protocol + '\/\/' + location.host + path;
			document.write('<script type="text/javascript" src="' + path + '"></script>');

		},

		//同步加载样式
		writeStyle : function (path, raw) {

			path = raw ? path : location.protocol + '\/\/' + location.host + path;
			document.write('<link href="' + path + '" rel="stylesheet" type="text/css" />');
		},

		//异步加载脚本(.js)
		loadScript : function (src, callback) {

			var script = document.createElement('script'),
			head = document.head || document.getElementsByTagName('head')[0];

			head.appendChild(script);
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', src);

			if (!global.isIE() || global.isIE9Plus())
				return script.onload = !!callback ? callback : script.onload, script;

			return script.onreadystatechange = function () {

				if (script.readyState === 'loaded' || script.readyState === 'complete') {
					script.onreadystatechange = null;
					callback && callback();
				}

			},
			script;

		},

		//异步加载样式(.css)
		loadStyle : function (href, callback) {

			var link = document.createElement('link'),
			head = document.head || document.getElementsByTagName('head')[0];
			head.appendChild(link);

			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('href', href);

			link.onload = callback || null;

			return link;

		},

		addEventListener : function (target, eventName, eventHandler, capture) {

			if (target.addEventListener)
				return target.addEventListener(eventName, eventHandler, capture), eventHandler;
			if (target.attachEvent)
				return target.attachEvent('on' + eventName, eventHandler), eventHandler;
		},

		reomveEventListener : function (target, eventName, eventHandler, capture) {

			if (target.removeEventListener)
				return target.removeEventListener(eventName, eventHandler, capture), eventHandler;
			if (target.detachEvent)
				return target.detachEvent('on' + eventName, eventHandler), eventHandler;
		},

		// 触发DOM事件
		dispatchEvent : function (target, eventName, propagation, preventDefault) {

			var event;

			// otherwise IE8-

			if (document.createEvent) {
				event = document.createEvent('HTMLEvents');
				event.initEvent(eventName, propagation, preventDefault);
				event.eventType = 'message';
				target.dispatchEvent(event);
				return event;
			};

			// for IE8-

			if (document.createEventObject) {

				event = document.createEventObject();
				event.eventType = 'message';
				target.fireEvent('on' + eventName, event);
			};

			return event;

		},

		on : function () {

			return global.addEventListener.apply(this, arguments);
		},

		un : function () {

			return global.reomveEventListener.apply(this, arguments);
		},

		emit : function () {

			return global.dispatchEvent.apply(this, arguments);

		},

		stopPropagation : function (e) {

			if (e && e.stopPropagation)
				return e.stopPropagation(), undefined;

			(e || window.event).cancelBubble = true;
		},

		preventDefault : function (e) {

			if (e && e.preventDefault)
				return e.preventDefault(), undefined;

			(e || window.event).returnValue = false;
		},

		clearSelection : function () {

			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		}

	});

	//面向对象
	global.append({

		//命名空间管理器
		mgr : {

			host : {},
			scriptsPath : {},
			cssPath : {},

			defaultHost : '',
			defaultCssPath : 'resources/css',
			defaultScriptsPath : 'scripts',

			// 类管理器(已经创建完成的类映射表)
			classMap : {},

			// 实例映射表
			instanceMap : {},

			// 已托管实例数目
			instanceCount : 0,

			// 类别名映射
			aliasMap : {},

			// 文件载入器映射表
			loadedMap : {},

			// 允许加载类中引用的css
			allowLoadCss : true,

			// 给类添加别名
			addAlias : function (aliasName, clsName) {

				if (this.aliasMap[aliasName])
					aliasName = aliasName + global.guid();

				this.aliasMap[aliasName] = clsName;

			},

			// 注册托管实例
			addInstance : function (id, instance) {

				this.getInstance(id) && global.error('名为"' + id + '"的实例已存在');

				return ++this.instanceCount && (this.instanceMap[id] = instance);

			},

			// 获取托管实例
			getInstance : function (id) {

				if (this.instanceCount < 1)
					return null;
				return this.instanceMap[id] || null;
			},

			// 注销托管实例
			removeInstance : function (id) {

				if (!this.getInstance(id))
					return false;

				return delete this.instanceMap[id];
			},

			// 注册须引入的类
			using : function (clsName, type, loader) {

				var defaultType = '.js',
				type = type || defaultType,
				isDefaultType = type == defaultType;

				loader = loader || global.loader;

				global.isString(clsName) && (clsName = [clsName]);

				// 转换为延时创建类模式
				loader.isDelay = true;

				global.each(clsName, function (idx, name) {

					var rawName = name,
					path;

					!isDefaultType && (name = name + type);

					if (!!this.loadedMap[name])
						return true;

					// 记录加该载文件所用的载入器
					this.loadedMap[name] = loader;

					path = this.convertToPath(rawName, type);

					isDefaultType && loader.using(path);

					!isDefaultType && global.loadStyle(path);

				}, this);

				return this;
			},

			// 动态引入类
			require : function (clsName, handle, scope) {

				var loader,
				predicate = function () {

					var lock = false;

					global.isString(clsName) && (clsName = [clsName]);

					global.each(clsName, function () {

						if (!global.mgr.classMap[clsName])
							lock = true;

					});

					return !lock;

				};

				// 如果类已经加载则直接执行委托方法
				if (predicate())
					return handle.apply(scope || window), this;

				// 类未加载则创建加载器
				loader = new global.Loader();

				// 注册加载器
				//global.loaders = global.loaders || {};

				//global.loaders[loader.id] = loader;

				this.using(clsName, null, loader);

				// 阻塞委托方法 直到所有依赖类加载完毕再执行
				loader.block(handle, predicate, null, scope);

				// 执行加载器
				loader.using();

				return this;

			},

			// 注册载入完成后执行的环境
			delayReg : function (loader, method, args, scope) {

				loader && loader.delayReg(method, args, scope);

			},

			convertToPath : function (clsName, type) {

				if (global.isArray(clsName)) {

					var ret = [];

					global.each(clsName, function (idx, name) {

						ret.push(this.convertToPath(name, type));

					}, this)

					return ret;

				};

				var pathFragments = clsName && clsName.split('.'),
				defaultType = '.js',
				type = type || defaultType,
				isDefaultType = type == defaultType,
				host = '';

				if (!pathFragments)
					return '';

				host = this.host[pathFragments[0]] || this.defaultHost;
				host = host && (host + '/') || host;

				// js
				if (isDefaultType) {

					pathFragments[0] = this.scriptsPath[pathFragments[0]] || this.defaultScriptsPath;

					pathFragments[pathFragments.length - 1] = clsName;

				}

				// css
				if (!isDefaultType) {

					pathFragments[0] = this.cssPath[pathFragments[0]] || this.defaultCssPath;

					if (pathFragments.length > 1) {

						pathFragments.length = 2;
						pathFragments[1] = clsName;
					}

				}

				return host + pathFragments.join('\/') + type;
			}

		},

		// 创建命名空间
		namespace : function (ns, val) {

			var nsa = ns.split('.'),
			pre;

			if (arguments.length < 2)
				val = {};

			for (var i = 0, ln = nsa.length; i < ln; i++) {

				if (i == 0) {
					pre = window[nsa[i]] = window[nsa[i]] || {};
					continue;
				}
				if (i == ln - 1) {
					pre = pre[nsa[i]] = pre[nsa[i]] || val;
					break;
				}
				pre = pre[nsa[i]] = pre[nsa[i]] || {};
			}

			return pre;
		},

		// 创建类|继承类 from extJs extend
		// @superClass(fn):父类
		// @option(obj):类定义列表
		extend : function (superClass, options) {

			if (!options) {

				options = superClass;
				superClass = Object;
			}

			var $class = function () {},
			$instance = options.constructor != Object.prototype.constructor ? options.constructor : function () {
				superClass.apply(this, arguments);
			};

			$class.prototype = $instance.$superClass = superClass.prototype;

			$instance.prototype = new $class();

			$instance.prototype.constructor = $instance;

			$instance.override = function (options) {

				global.override(this, options);
			};

			$instance.extend = function (options) {
				global.extend(this, options);
			};

			global.override($instance, options);

			return $instance;
		},

		// 重写类中的方法
		// @cls(fn|str):类对象|类名
		// @options(obj):重写的方法列表
		// @isExtend(bool):以扩展的方式重写方法(先执行原方法再执行扩展方法)
		override : function (cls, options, isExtend) {

			if (global.isString(cls))
				cls = eval(cls);

			global.each(options, function (name, obj) {

				if (global.isFunction(obj)) {

					if (isExtend && cls.prototype[name]) {

						var ofn = cls.prototype[name],
						nfn = obj,
						or,
						nr;

						obj = function () {

							or = ofn.apply(this, arguments);
							nr = nfn.apply(this, [].concat(Array.prototype.slice.call(arguments), or));

							return nr;
						}
					}

					obj.$methodName = name;
					obj.$ownerCls = cls;

				}

				cls.prototype[name] = obj;
			});
		},

		// 定义类
		// @clsNs(str):类名
		// @options(obj):类的方法在这个对象里定义 见global.extend
		// @callback(fn):类定义完成后的委托句柄
		define : function (clsNs, options, callback) {

			// 等待所有类加载完成后 延时定义
			if (global.mgr.loadedMap[clsNs] && global.mgr.loadedMap[clsNs].isDelay)
				return global.mgr.loadedMap[clsNs].delayDefine.apply(global.mgr.loadedMap[clsNs], arguments);

			options.constructor = options.constructor || function () {
				this.callParent && this.callParent(arguments);
			};

			options.$clsName = options.$clsName || clsNs;

			var extend = options.extend || Object;

			if (global.isString(extend)) {

				try {
					extend = eval(options.extend);
				} catch (e) {

					global.error(global.stringFormat('"{0}" 定义失败, 父类"{1}"未定义!', options.$clsName, options.extend));
				}
			}

			extend = global.extend(extend, options);

			extend.$clsName = options.$clsName;

			extend.prototype.$ownerCls = extend;

			extend.prototype.$loader = global.mgr.loadedMap[clsNs];

			// 添加类的静态方法
			options.statics && global.append(extend, options.statics);

			callback && callback.call(extend, extend);

			// 在管理器中注册类
			global.mgr.classMap[clsNs] = extend;

			if (global.isString(clsNs)) {

				global.namespace(clsNs, extend);
				return extend;
			}

			return extend;

		},

		// 创建实例
		// clsNs(str):类名
		// options(obj):对象的属性在这个对象里定义
		create : function (clsNs, options) {

			var cls = global.isString(clsNs) ? global.namespace(clsNs) : clsNs;

			if (!global.isFunction(cls))
				return cls;

			return new cls(options);
		},

		// 通过类的别名创建实例
		createByAlias : function (alias, options) {

			var clsName = global.mgr.aliasMap[alias];

			return clsName && this.create(clsName, options);
		}

	});

	// 定义尺寸单位处理方法
	global.each('px em ex percent mm cm inch rem deg rad grad'.split(' '), function () {

		var methodName = String(this);

		global[methodName] = function (size) {

			return global.parseNumeric(size) + ({
				percent : '%',
				inch : 'in'
			}
				[methodName] || methodName);
		}
	});

	// 定义浏览器类型判断相关方法
	global.browser.$methods = {};

	// 根据配置中的浏览器类型选择执行相应的方法
	// @option(obj) 匹配列表 {isIE:fn|value,isIE6:fn|value,isChrome:fn|value....,otherwise:fn|value}
	// @greedy(bool)  false:匹配到就停止|true:匹配所有选项
	global.boe = global.browser.optionExec = function (option, greedy) {

		var matched = false,
		result;

		global.each(option, function (name, method) {

			var match = global.browser.$methods[name];

			if (match && match()) {

				result = global.isFunction(method) ? method.apply(this) : method;
				matched = true;
			}

			if (!greedy && matched)
				return false;

		}, this);

		if (!matched && option.otherwise)
			return global.isFunction(option.otherwise) ? option.otherwise.apply(this) : option.otherwise;

		return result;

	};

	// 根据配置中的浏览器类型选择生成相应的方法
	// @option(obj) 匹配列表 {isIE:fn,isIE6:fn,isChrome:fn....,otherwise:fn}
	global.bof = global.browser.optionFunc = function (option) {

		var fn = function () {

			global.isFunction(option.otherwise) && option.otherwise.apply(this, arguments);

		};

		global.each(option, function (name, method) {

			var match = global.browser.$methods[name];

			match && match() && global.isFunction(method) && (fn = function () {

				method.apply(this, arguments);
			});

		}, this);

		return fn;

	};

	// 创建判断浏览器类型的系列方法
	global.each('isOthersBrowser isChrome isWebkit isMozilla isOpera isIE isIE6 isIE7 isIE8 isIE9 isIE10 isIE6Plus isIE7Plus isIE8Plus isIE9Plus isIE10Plus isIE9 isIE7Minus isIE8Minus isIE9Minus isIE10Minus'.split(' '), function (idx, name) {

		var match = /is(OthersBrowser|IE|Chrome|Webkit|Mozilla|Opera)(\d+)?(plus|minus)?/i.exec(name),
		name = match[0],
		browser = match[1] && match[1].toLowerCase(),
		version = global.parseNumeric(match[2]),
		range = match[3] && match[3].toLowerCase();

		if (browser == 'othersBrowser')
			return global[name] = global.browser.$methods[browser] = function () {
				return !global.browser.name;
			},
		true;

		if (!version)
			return global[name] = global.browser.$methods[browser] = function () {
				return !!global.browser[(browser == 'ie') ? 'msie' : browser];
			},
		true

		if (version && !range)
			return global[name] = global.browser.$methods[browser + version] = function () {

				return global.browser.msie && Math.floor(global.browser.version) == version;

			},
		true;

		if (range == 'minus')
			global[name] = global.browser.$methods[browser + version + range] = global.browser.$methods[browser + version + '-'] = function () {

				return global.browser.msie && Math.floor(global.browser.version) <= version;

			}

		if (range == 'plus')
			global[name] = global.browser.$methods[browser + version + range] = global.browser.$methods[browser + version + '+'] = function () {

				return global.browser.msie && Math.floor(global.browser.version) >= version;
			}

	});

	// 定义加载器类
	global.Loader = global.extend({

			$clsName : global.$$libName + '.Loader',

			// true:延时创建类
			// false:正常创建类
			// 使用global.mgr.using方法引入类这自动转换为延时创建模式
			isDelay : false,

			// 须延时创建的类集合
			delayDefineSet : {},

			// 延时写入的样式队列
			delayLoadStyleQueue : [],

			// 须延时执行的方法执行环境队列
			delayExecQueue : [],

			// 阻塞方法队列
			blockQueue : [],

			constructor : function (id) {

				this.id = id || global.getId();

			},

			// 加载入口
			// @handle(fn) 载入句柄
			// @scope 载入句柄执行域
			load : function (handle, scope) {

				var me = this,
				callback = function () {

					handle && handle.call(this);
					me.blockFree();
					me.delayExec();
					me.delayWriteStyle();
					// me.delayWriteStyle(function () {

					// me.delayExec();

					// });

				};

				if (document.readyState == 'complete')
					return callback.call(scope || window);

				return global.addEventListener(window, 'load', callback);
			},

			// 延时定义类
			delayDefine : function (clsNs, options, callback) {

				options.cssUses && global.isBoolean(options.cssUses) && (options.cssUses = clsNs);

				options.alias && global.mgr.addAlias(options.alias, clsNs);

				options.uses && global.mgr.using(options.uses, null, this);

				options.extend && global.isString(options.extend) && global.mgr.using(options.extend, null, this);

				options.$delayDefine = true;

				options.$clsName = options.$clsName || clsNs;

				this.delayDefineSet[options.$clsName] = {

					clsNs : options.$clsName,
					options : options,
					callback : callback,
					isDefined : false
				};

				return null;

			},

			// 根据依赖关系延时加载类
			delayLoad : function () {

				if (!this.isDelay)
					return;

				this.isDelay = false;

				var classMap = global.mgr.classMap,
				defineSet = this.delayDefineSet,
				buffer = [],
				search = function (item) {

					var depends = [];

					if (!item || !item.options)
						return;

					item.options.uses && (depends = depends.concat(item.options.uses));
					item.options.extend && (depends = depends.concat(item.options.extend));

					global.each(depends, function (idx, name) {

						var index = global.inArray(name, buffer);

						if (!name || classMap[name])
							return true;

						(index != -1) && buffer.splice(index, 1);
						buffer.push(name);
						search(defineSet[name]);

					});
				};

				global.each(defineSet, function (name, item) {

					if (!classMap[name] && !item.isDefined) {

						buffer.push(name);
						search(item);
						while (name = buffer.pop()) {

							item = defineSet[name];

							// 创建类
							item && !classMap[name] && (item.isDefined = true) && global.define(item.clsNs, item.options, item.callback)

							// 注册样式
							 && global.mgr.allowLoadCss && item.options.cssUses && (this.delayLoadStyleQueue = this.delayLoadStyleQueue.concat(global.mgr.convertToPath(item.options.cssUses, '.css')));
						}
					}

				}, this);

				this.delayDefineSet = {};

			},

			// 延时加载已注册样式
			delayWriteStyle : function (callback, scope) {

				// if (this.delayLoadStyleQueue.length > 0)
				// return (new global.Loader).using(this.delayLoadStyleQueue).using(function () {

				// callback && callback.call(scope || window);
				// this.delayLoadStyleQueue = [];

				// }, this), this;

				// return callback && callback.call(scope || window),
				// this;

				global.each(this.delayLoadStyleQueue, function () {

					global.loadStyle(String(this));

				});

				this.delayLoadStyleQueue = [];

			},

			// 阻塞委托方法
			// @method(fn) 委托方法
			// @predicate(fn) 委托方法执行断言
			// @args(array) 委托方法执行参数
			// @scope(obj) 委托方法执行域
			block : function (method, predicate, args, scope) {

				this.blockQueue.push({

					method : method,
					predicate : predicate,
					args : args || [],
					scope : scope || window,
					block : true

				});

			},

			// 执行被阻塞的委托方法
			blockFree : function () {

				var len = this.blockQueue.length;

				global.each(this.blockQueue, function () {

					if (this.block && this.predicate.apply(this.scope, this.args)) {

						this.block = false;
						this.method.apply(this.scope, this.args);
						len--;
					}

				});

				!len && (this.blockQueue = []);

			},

			// 注册载入完成后执行的环境
			delayReg : function (method, args, scope) {

				this.delayExecQueue.push({

					method : method,
					scope : scope || window,
					args : args || []

				});

			},

			// 执行延时方法队列中的程序
			delayExec : function () {

				var obj;
				while (obj = this.delayExecQueue.shift())
					obj.method.apply(obj.scope, obj.args);

			},

			// 加载声明
			// @path(str|array) 需加载的路径列表
			// @path(fn) 加载完毕后委托句柄
			// @scope(obj) 加载完成后委托句柄执行域
			using : function (path, scope) {

				this.loadList = this.loadList || [];
				this.loadListUniqueMap = this.loadListUniqueMap || {};

				global.isString(path) && (path = [path]);

				global.isArray(path) && global.each(path, function (idx, item) {
					global.uniquePush(this.loadList, item, this.loadListUniqueMap);
				}, this);

				(!path || global.isFunction(path)) && this.iterateLoad(this.loadList, 0, this.loadHandler, function () {

					this.loadList = [];
					this.loadListUniqueMap = {};
					this.delayLoad();
					this.load(path, scope);

				}, this);

				return this;
			},

			// 加载请求
			// @param (路径列表[...],加载完成后委托句柄(fn))
			require : function () {

				if (arguments.length < 1)
					return;
				if (arguments.length < 2)
					arguments[0].call(window);

				var me = this,
				argLen = arguments.length,
				callback = arguments[argLen - 1],
				i = 0,
				lst = [],
				uniqueMap = {};

				for (; i < argLen - 1; i++) {

					if (arguments[i]instanceof Array)
						global.each(arguments[i], function () {
							global.uniquePush(lst, this, uniqueMap)
						});

					global.uniquePush(lst, arguments[i], uniqueMap);
				}

				this.iterateLoad(lst, 0, this.loadHandler, function () {
					this.load(callback);
				}, this);

			},

			// 载入句柄
			loadHandler : function (target, callback) {

				global.Loader.loadedMap = global.Loader.loadedMap || {}; //记录已经载入的文件

				var isJs = /.+\.js$/.test(target),
				isCss = /.+\.css$/.test(target),
				doNothing = (!isJs && !isCss) || global.Loader.loadedMap[target];

				if (doNothing)
					return callback();

				if (!doNothing)
					global.Loader.loadedMap[target] = true;

				if (isJs)
					global.loadScript(target, callback);

				if (isCss)
					global.loadStyle(target, callback);

				return null;

			},

			// 递归载入器
			iterateLoad : function (lst, i, handle, callback, scope) {

				var me = this;

				if (i == lst.length) {
					callback.call(scope || me);
					return;
				}

				handle.call(me, lst[i], function () {
					global.Loader.prototype.iterateLoad.call(me, lst, ++i, handle, callback, scope);
				});
			}

		});

	// 默认载入器
	global.loader = new global.Loader('defaultLoader');

	// 载入器管理器
	global.loaders = {};

	global.loaders[global.loader.id] = global.loader;

	global.mgr.classMap[global.loader.$clsName] = global.Loader;

	window[global.$$libName] = global;

	alias && (window[alias] = global);

	global.alias(global.loader, 'using', global.$$libName + '.using');

	global.alias(global.loader, 'require', global.$$libName + '.require');

	global.alias(global.mgr, 'getInstance', global.$$libName + '.getInst');

	global.alias(global.mgr, 'getInstance', global.$$libName + '.getInstance');

	global.alias(global, 'namespace', global.$$libName + '.ns');

})(window, 'infestor', 'inf');
