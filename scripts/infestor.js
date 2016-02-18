/******************************

infestor js

 ********************************/

(function (window, libName, alias) {
	
	if(!!window[libName])
		return;

	var document = window.document,
		navigator = window.navigator,
		global = function (handle, scope) {

			global.loader.using(handle, scope || window);

		};

	global.$$libName = libName;

	global.$globalId = 1;

	global.emptyFn = function () {};

	global.getId = function () {

		global.$prefix = global.$prefix || (global.randomCode(4,'word') + '-');

		return global.$prefix + global.$globalId ++;
	};

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
		};

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

	// 拷贝@predicate(method)返回true的属性
	// 拷贝@predicate(array)包含的属性
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

		consolePrint : function(o){
		
			if(global.isArray(o))
				return global.each(o,function(){ global.print(this); });
			
			if(!console || !console.log)
				return o;
			
			console.log(String(o));
			
			return true;
			
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
				return true;

			if (isObj) {
				for (name in object)
					if (callback.call(scope || object[name], name, object[name]) === false)
						break;
			} else {
				for (; i < length; i++)
					if (callback.call(scope || object[i], i, object[i]) === false)
						break;
			}
			
			return true;
		},

		// 获取@predicate方法返回true的元素
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

				arr.push(func.call(scope || val, idx, val));
			});

			return arr;

		},
		
		// 生成一个数组
		genArray : function (len,fn,scope){
		
			var i=0,arr=[];
			
			fn = fn || function(idx){
			
				return idx;
			};
			
			for(;i<len;i++){
			
				arr.push(fn.call(scope,i));
			
			}
			
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

		// from jQuery isPlainObject
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

		toArray : function (args) {

			return Array.prototype.slice.call(args);

		},

		param : function (obj,esc) {

			if (!obj || global.isString(obj)) {

				var url = obj || document.location.search,
					url = url.replace(/&amp;/gi, '&'),
					args = {};
									
				url.replace(/(?:\?|&)(.*?)=(.*?)(?=&|$)/g,function(m,g1,g2){
					
					try {
						args[decodeURIComponent(g1)] = decodeURIComponent(g2);
					} catch (e) {
						args[unescape(g1)] = unescape(g2);
					}
				});

				return args;

			}

			var paramArr = [];

			global.each(obj, function (name, val) {

				if (!obj.hasOwnProperty(name))
					return true;
				
				esc ? paramArr.push(escape(name) + '=' + escape(val)) : paramArr.push(name + '=' + val);

			});

			return paramArr.join('&');

		},
		
		browser : (function () {

			var ua = navigator.userAgent.toLowerCase(),
				browser = {},
				match = [];
			
			// for ie11 
			match = (match =/rv:([\d.]+)\) like gecko/.exec(ua)) && match[1] && (match[2] = match[1]) && (match[1] = 'msie') && match;
			
			// from jQuery browser
			match = !match && (/(webkit)[ \/]([\w.]+)/.exec(ua) ||
				/(chrome)[ \/]([\w.]+)/.exec(ua) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
				match || [];
				
			// for tencent | 360 | maxthon | avant | sogou | the world	
			// 这些webkit浏览器的ua有些带msie 7.0的字符串 会产生误判
			// /(tencent|360se|360ee|maxthon|avant|sogou|sogoumse|the world)/.test(ua) && (match[1]='webkit');
			
			// 没有匹配到 默认webkit
			match[1] = match[1] || 'webkit';		
			browser[match[1]] = true;
			browser.name = match[1];
			browser.version = match[2] || '0'

			return browser;

		})(),

		// 返回一个键值互换的对象
		kvSwap : function(target){
		
			var o = {};
			
			global.each(target,function(k,v){
			
				o[String(v)] = k;
			
			});
			
			return o;
		
		},
		
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

			date = new Date(date);

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
	
		// 将连字符分隔的变量名改为标准驼峰名
		stdn : function(name,sep){
			
			if(!name) return '';
						
			return name.replace(new RegExp('\\'+ (sep || '-') +'\\w','gm'), function (match) {
				return match.substr(1).toUpperCase();
			});
			
		},
		
		trim:function(str){
		
			return String(str).replace(/(^\s*)|(\s*$)/,'');
		
		},
		
		triml:function(str){
		
			return String(str).replace(/^\s*/,'');
		
		},
		
		trimr:function(str){
		
			return String(str).replace(/\s*$/,'');
		
		},

		guid : function () {

			var g = function () {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};

			return [g() + g(), g(), g(), g(), g() + g() + g()].join('-').toUpperCase();

		},

		// 包含 @lower,@upper
		random : function (lower, upper) {

			return Math.floor(Math.random() * (upper - lower + 1) + lower);

		},

		// type:num|word|mix,default mix
		randomCode : function (len,type) {

			var dict = {
					mix:'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
					num:'0123456789',
					word:'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
				}[type] || type,
				len = len || 6,
				i = 0,
				rs = '';
			
			dict = dict || dict.mix;

			for (; i < len; i++)
				rs += dict.charAt(Math.floor(Math.random() * 100000000) % dict.length);

			return rs;

		},

		jsonEncode : function (obj, rules) {

			var parse;
		
			if (window.JSON && !rules)
				return window.JSON.stringify(obj);

			parse = function (o) {
				
				var args = [o,parse].concat(Array.prototype.slice.call(arguments,2));

				if (global.isUndefined(o))
					return rules.undefinedParser.apply(rules,args);
				if (global.isNull(o))
					return rules.nullParser.apply(rules,args);
				if (global.isString(o))
					return rules.stringParser.apply(rules,args);
				if (global.isArray(o))
					return rules.arrayParser.apply(rules,args);
				if (global.isBoolean(o))
					return rules.booleanParser.apply(rules,args);
				if (global.isDate(o))
					return rules.dateParser.apply(rules,args);
				if (global.isNumber(o))
					return rules.numberParser.apply(rules,args);
				if (global.isFunction(o))
					return rules.functionParser.apply(rules,args);
				if (global.isRegExp(o))
					return rules.regExpParser.apply(rules,args);
				if (global.isRawObject(o))
					return rules.objectParser.apply(rules,args);

				return '';

			};
				
			rules = global.append({

				arrayParser : function (o,parse) {

					var str = [];

					global.each(o, function (idx, item) {
						str.push(parse(item));
					});

					return '[' + str.join(',') + ']';
				},
				objectParser : function (o,parse) {

					var str = [];

					global.each(o, function (name, value) {
						o.hasOwnProperty(name) && str.push('"' + name + '":' + parse(value));
					});

					return '{' + str.join(',') + '}';
				},
				booleanParser : function (o,parse) {
					return Boolean.prototype.toString.call(o,parse);
				},
				dateParser : function (o,parse) {
					return '"' + global.dateFormat(o, 'yyyy-MM-ddTHH:mm:ss.SZ') + '"';
				},
				regExpParser : function (o,parse) {
					return '{}';
				},
				stringParser : function (o,parse) {
					return '"' + String(o) + '"';
				},
				numberParser : function (o,parse) {
					return Number(o);
				},
				functionParser : function (o,parse) {
					return '';
				},
				undefinedParser : function (o,parse) {
					return 'null'
				},
				nullParser : function (o,parse) {
					return 'null'
				}

			}, rules);
			
			return parse(obj);
		
		},

		jsonDecode : function (str) {

			if (window.JSON)
				return window.JSON.parse(str);

			return eval('('+str+')');
		},
		
		jsonEncodeTree : function(obj,action){
			
			var treeArray = [],
				action = action || function( id, pId, type, key, value, depth){		
				
					 treeArray.push({ 
					 
						id: id,
						pId : pId || '0' ,
						type : type, 
						key : depth === 1 ? 'root' : key, 
						value : value,
						text : (depth === 1 ? 'root' : key) + ':' + value,
						depth : depth, 
						leaf : type != 'array' && type !='object',
						branch : type == 'array' || type == 'object' 
						
					});					
				};
			
			global.jsonEncode(obj,{
							
				arrayParser : function (o,parse,pId,key,depth) {
					
					var id = global.getId();
					
					depth = depth || 1;

					action(id, pId,'array',key,'[array]',depth);
				
					global.each(o, function (idx, item) {
						parse(item,parse,id,'[' + idx + ']',depth + 1);				
					});
				},
				objectParser : function (o,parse,pId,key,depth) {
					
					var id = global.getId();
					
					depth = depth || 1;
					
					action(id,pId,'object',key,'[object]',depth);
					
					global.each(o, function (key, value) {
						o.hasOwnProperty(key) && parse(value,parse,id,key,depth + 1);
					});

				},
				booleanParser : function (o,parse,pId,key,depth) {	
					action(global.getId(),pId,'bool',key,Boolean.prototype.toString.call(o,parse),depth);
				},
				dateParser : function (o,parse,pId,key,depth) {
					action(global.getId(),pId,'date',key,global.dateFormat(o, 'yyyy-MM-ddTHH:mm:ss.SZ'),depth);
				},
				regExpParser : function (o,parse,pId,key,depth) {		
					action(global.getId(),pId,'regexp',key,'[regexp]',depth);
				},
				stringParser : function (o,parse,pId,key,depth) {
					action(global.getId(),pId,'string',key,String(o),depth);
				},
				numberParser : function (o,parse,pId,key,depth) {
					action(global.getId(),pId,'number',key,Number(o),depth);
				},
				functionParser : function (o,parse,pId,key,depth) {
					action(global.getId(),pId,'function',key,'[function]',depth);
				},
				undefinedParser : function (o,parse,pId,key,depth) {
					action(global.getId(),pId,'function',key,'[undefined]',depth);
				},
				nullParser : function (o,parse,pId,key,depth) {
					action(global.getId(),pId,'function',key,'[null]',depth);
				}
				
			});
			
			return treeArray;
			
		},
	
		jsonEncodePrint : function(obj){
			
			global.jsonEncodeTree(obj,function(id,pid,type,key,value,depth){
				
				console.log(global.genArray(depth,function(){ return '    '; }).join('') + (depth === 1 ? 'root' : key) + ':' + value);
				
			});
			
		},
	
		delay : function (fn, time, scope) {

			return setTimeout(function () {

				fn.apply(scope || window);

			}, time || 1);

		},
		
		stopDelay : function(id){
		
			if (!id && id !== 0)
				return false;
			
			clearTimeout(id);
			
			return true;
		
		},

		task : function (fn, interval, scope) {

			return setInterval(function () {

				fn.apply(scope || window);

			}, interval || 1000);

		},

		stopTask : function (id) {

			if (!id && id !== 0)
				return false;

			clearInterval(id);
			
			return true;
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

			var last = new Date().getTime();

			wait = wait || 200;

			return function () {

				var now = new Date().getTime();

				if (now - last < wait)
					return alt && alt.apply(this, arguments);

				last = now;

				return fn.apply(this, arguments);

			};

		},
		
		// 反iframe引用
		antiIFrameRef : function(){
		
			if (window.top.location != window.self.location) 
				window.top.location = window.self.location;
		
		}		
	});
	
	// 脚本和样式
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
		loadScript : function (src, load, error) {

			var script = document.createElement('script'),
			head = document.head || document.getElementsByTagName('head')[0];

			head.appendChild(script);
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', src);
		
			if (!global.isIE8Minus()){
			
				script.onerror = error;
				return script.onload = !!load ? load : script.onload, script;
			}

			return script.onreadystatechange = function () {

				// if (script.readyState === 'loaded' || script.readyState === 'complete') {
					// script.onreadystatechange = null;
					// load && load();
				// }
				
				if (script.readyState === 'loaded') {
					script.onreadystatechange = null;
					load && load();
				}

			},
			script;

		},

		//异步加载样式(.css)
		loadStyle : function (href, load) {

			var link = document.createElement('link'),
			head = document.head || document.getElementsByTagName('head')[0];
			head.appendChild(link);

			link.setAttribute('rel', 'stylesheet');
			link.setAttribute('type', 'text/css');
			link.setAttribute('href', href);

			link.onload = load || null;

			return link;

		},
		
		//读取样式表样式
		//unsafe 
		//uncompatible
		getStyleSheet:function(index){
			
			if(arguments.length == 0){
				
				return global.map(document.styleSheets,function(idx,val){
					
					return global.getStyleSheet(idx);
					
				});
				
			};
			
			var sheet = document.styleSheets[index],rawRules,rules=[];
			
			if(!sheet) return rules;
			
			rawRules = sheet.rules || sheet.cssRules;
						
			global.each(rawRules,function(){
					
				var rule = {};
				rule.selector = this.selectorText;
				rule.rules = {};
				global.each(this.style.cssText.replace(/^\s*|\s*$/g,'').split(';'),function(){
				
					var statement = this.split(':');
					statement[0] && (rule.rules[statement[0].replace(/^\s*|\s*$/g,'')] = statement[1].replace(/^\s*|\s*$/g,''));
					
				});
				rules.push(rule);
						
			});
			
			return rules;
				
		}

	});

	//事件
	global.append({

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
				event.initEvent(eventName, propagation || false, preventDefault || false);
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
		
			if(window.getSelection)
				return window.getSelection().removeAllRanges();
			
			if(global.isFunction(document.selection.empty))
				document.selection.empty();
			
			// window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
		}

	});

	//面向对象
	global.append({

		//命名空间管理器
		mgr : {

			// 设定需要加载类的主机名
			host : {},
			// 设定需要加载类的脚本根目录路径
			scriptsPath : {},
			// 设定需要加载样式的样式表文件根目录路径
			cssPath : {},

			defaultHost : '',
			defaultCssPath : 'resources/css',
			defaultScriptsPath : 'scripts',

			// 类管理器(已经创建完成的类映射表)
			classMap : {},
			
			// 记录类的定义顺序
			classDefineOrderQueue:[],
			
			// 按加载顺序记录已加载样式表的路径
			styleSrcQueue:[],

			// 实例映射表
			instanceMap : {},

			// 已托管实例数目
			instanceCount : 0,

			// 类别名映射
			aliasMap : {},

			// 文件载入器映射表
			loaderMap : {},
			
			// 文件源映射表
			srcMap:{},
			
			// 非类文件源映射表
			nsSrcMap:{},
		
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

					var rawName = name,path;

					!isDefaultType && (name = name + type);

					if (this.loaderMap[name])
						return true;
					else {
					
						try {
					
							if(eval(name))
								return true;
					
						}catch(e){}
					}
					
					path = this.convertToPath(rawName, type);

					// 记录加该载文件所用的载入器
					this.loaderMap[name] = loader;
					// 记录载入文件路径
					this.srcMap[name] = path;
	
					this.nsSrcMap[name] = path;

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
					pathFragments.length < 2 ? pathFragments.push(clsName) : (pathFragments[pathFragments.length - 1] = clsName);

				}

				// css
				if (!isDefaultType) {
				
					pathFragments[0] = this.cssPath[pathFragments[0]] || this.defaultCssPath;
					pathFragments.length = 2;
					pathFragments[1] = clsName;

				}

				return host + pathFragments.join('\/') + type;
			}

		},

		// 创建命名空间
		namespace : function (ns, val, rewrite) {

			var nsa = ns.split('.'),pre;

			if (arguments.length < 2)
				val = {};

			for (var i = 0, ln = nsa.length; i < ln; i++) {

				if (i == 0) {
					pre = window[nsa[i]] = window[nsa[i]] || {};
					continue;
				}
				if (i == ln - 1) {
				
					pre = pre[nsa[i]] = rewrite && val || pre[nsa[i]] || val;
					
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
			
			// fix ie8minus constructor			
			global.isIE8Minus() && (cls.prototype.constructor.$ownerCls = cls) && (cls.prototype.constructor.$methodName = 'constructor');
			
		},

		// 定义类
		// @clsNs(str):类名
		// @options(obj):类的方法在这个对象里定义 见global.extend
		// @callback(fn):类定义完成后的委托句柄
		define : function (clsNs, options, callback) {
		
			var extend = options.extend || Object,parent;

			// 等待所有类加载完成后 延时定义
			if (global.mgr.loaderMap[clsNs] && global.mgr.loaderMap[clsNs].isDelay)
				return global.mgr.loaderMap[clsNs].delayDefine.apply(global.mgr.loaderMap[clsNs], arguments);

			options.constructor = options.constructor || function () {
				this.callParent && this.callParent(arguments);
			};

			options.$clsName = options.$clsName || clsNs;

			if (global.isString(extend)) {

				try {
					extend = eval(options.extend);
				} catch (e) {

					global.error(global.stringFormat('"{0}" 定义失败, 父类"{1}"未定义!', options.$clsName, options.extend));
				}
			}
			
			parent = extend;

			extend = global.extend(extend, options);
			
			if(parent != Object){
			
				parent.$extends = parent.$extends || [];
				parent.$extends.push(extend);
				
			}

			extend.$clsName = options.$clsName;

			extend.prototype.$ownerCls = extend;

			extend.prototype.$loader = global.mgr.loaderMap[clsNs];

			// 添加类的静态方法
			options.statics && global.append(extend, options.statics);

			callback && callback.call(extend, extend);

			// 在管理器中注册类
			global.mgr.classMap[clsNs] = extend;
			
			// 注册别名
			options.alias && global.mgr.addAlias(options.alias, clsNs);

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
				global.error(global.stringFormat('"{0}" is not loaded',clsNs));
			
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
			}[methodName] || methodName);
		}
	});

	// 根据配置中的浏览器类型选择执行相应的方法
	// @option(obj) 匹配列表 {ie:fn|value,ie6:fn|value,chrome:fn|value....,otherwise:fn|value}
	// @greedy(bool)  false:匹配到就停止|true:匹配所有选项
	global.bRouter = global.browser.router = function (option, greedy) {

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
	// @option(obj) 匹配列表 {ie:fn,ie6:fn,chrome:fn....,otherwise:fn}
	global.bRouterf = global.browser.routerFunc = function (option) {

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
	global.each('isOthersBrowser isChrome isWebkit isMozilla isOpera isIE isIE6 isIE7 isIE8 isIE9 isIE10 isIE11 isIE6Plus isIE7Plus isIE8Plus isIE9Plus isIE10Plus isIE7Minus isIE8Minus isIE9Minus isIE10Minus isIE11Minus'.split(' '), function (idx, name) {

		var match = /is(OthersBrowser|IE|Chrome|Webkit|Mozilla|Opera)(\d+)?(plus|minus)?/i.exec(name),
			name = match[0],
			browser = match[1] && match[1].toLowerCase(),
			version = global.parseNumeric(match[2]),
			range = match[3] && match[3].toLowerCase();
			
		// 定义浏览器类型判断相关方法
		global.browser.$methods = global.browser.$methods || {};

		if (browser == 'othersBrowser')
			return global[name] = global.browser.$methods[browser] = function () {
				return !global.browser.name;
			},true;

		if (!version)
			return global[name] = global.browser.$methods[browser] = function () {
				return !!global.browser[(browser == 'ie') ? 'msie' : browser];
			},true;

		if (version && !range)
			return global[name] = global.browser.$methods[browser + version] = function () {

				return global.browser.msie && Math.floor(global.browser.version) == version;

			},true;

		if (range == 'minus')
			global[name] = global.browser.$methods[browser + version + range] = global.browser.$methods[browser + version + '-'] = function () {

				return global.browser.msie && Math.floor(global.browser.version) <= version;

			}

		if (range == 'plus')
			global[name] = global.browser.$methods[browser + version + range] = global.browser.$methods[browser + version + '+'] = function () {

				return global.browser.msie && Math.floor(global.browser.version) >= version;
			}

	});
	
	// 创建判断操作系统的系列方法
	global.each('platform isOthersPlatform isUnix isLinux isMac isAndroid isIPad isIPhone isIPod isIOS isWin isWin2000 isWinXp isWin2003 isWinVista isWin7 isWin8 isWin81'.split(' '),function(idx,name){
	
		var ua = navigator.userAgent.toLowerCase(),
			platform = navigator.platform.toLowerCase(),
			match = /(is)?(platform|OthersPlatform|Unix|Linux|Mac|IPad|IPhone|IPod|IOS|Android|Win)(\w+)?/i.exec(name),
			name = match[0],
			os = match[2] && match[2].toLowerCase(),
			version = match[3] && match[3].toLowerCase(),
			regexps = {
				
				// os
				unix:/x11/,
				linux:/linux/,
				mac:/(mac68k|macppc|macintosh|macintel)/,
				win:/(win32|windows)/,
				android:/android/,
				ios:/ios/,
				
				// mobile devices
				ipad:/ipad/,
				iphone:/iphone/,
				ipod:/ipod/,
				
				// windows version
				'2000':/windows nt 5.0/,		
				xp:/windows nt 5.1/,
				'2003':/windows nt 5.2/,
				vista:/windows nt 6.0/,
				'7':/windows nt 6.1/,
				'8':/windows nt 6.2/,
				'81':/windows nt 6.3/
			};
			
		// 定义操作系统判断相关方法
		global.browser.platform = global.browser.platform || {};
		global.browser.platform.$methods = global.browser.platform.$methods || {};
		
		if(os == 'platform')
			return global[name] = function () {
				
				var platform = 'Does not recognize!';
				
				global.each(global.browser.platform.$methods,function(name,method){
				
					if(method())
						return platform = name;
				
				});
				
				return platform;
				
			},true;
		
		if(os == 'othersplatform')
			return global[name] = function () {
				
				var isOthers = true;
				
				global.each(global.browser.platform.$methods,function(){
				
					if(this())
						return isOthers = false;
				
				});
				
				return isOthers;
				
			},true;
						
		if((os == 'win' && !version) || os=='mac')
			return global[name] = global.browser.platform.$methods[os] = function () {
				return regexps[os].test(platform);
			},true;
		
		if(os == 'win' && version)
			return global[name] = global.browser.platform.$methods[os + version]= function () {
				return regexps[os].test(platform) && regexps[version].test(ua);
			},true;
		
		if(/(android|ipad|iphone|ipod)/.test(os))
			return global[name] = global.browser.platform.$methods[os] = function () {
				return regexps[os].test(ua);
			},true;
		
		if(os == 'ios')
			return global[name] = global.browser.platform.$methods[os] = function () {
				return regexps[os].test(ua) || global.isIPad() || global.isIPhone() || global.isIPod();
			},true;
		
		if(os == 'linux')
			return global[name] = global.browser.platform.$methods[os] = function () {
				return regexps[os].test(platform) || global.isAndroid();
			},true;
			
		if(os == 'unix')
			return global[name] = global.browser.platform.$methods[os] = function () {
				return regexps[os].test(platform) || global.isLinux() || global.isMac() || global.isIOS();
			},true;
			
	});
	
	global.keyCode={
	
		$names:['backspace','tab','clear','enter','shift','ctrl','alt','pause','caps','esc','space','pageup','pagedown','end','home','left','up','right','down','print','insert','delete','0','1','2','3','4','5','6','7','8','9',')','!','@','#','$','%','^','&','*','(','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','num0','num1','num2','num3','num4','num5','num6','num7','num8','num9','numMultiply','numAdd','numEnter','numSubtract','numDecimal','numDivide','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12','print','numLock','scroll',';',':','=','+',',','<','-','_','.','>','/','?','`','~','[','{','\\','|',']','}','\'','\"'],
		$codes:[8,9,12,13,16,17,18,19,20,27,32,33,34,35,36,37,38,39,40,44,45,46,48,49,50,51,52,53,54,55,56,57,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,144,145,186,186,187,187,188,188,189,189,190,190,191,191,192,192,219,219,220,220,221,221,222,222],
		isNumber:function(code){
			
			code = Number(code);
		
			return code < 58 && code > 47;
			
		},
		isLetter:function(code){
		
			code = Number(code);
		
			return code > 64 && code < 90;
		
		}
	};
	
	global.each(global.keyCode.$names,function(idx,name){
	
		global.keyCode[name] = global.keyCode.$codes[idx];
	
	});
	
	// 定义加载器类
	global.Loader = global.extend({

		$clsName : global.$$libName + '.Loader',
		
		// 加载完所有脚本
		loaded:false,
		
		// 执行完所有脚本
		complete:false,

		// true:延时创建类
		// false:正常创建类
		// 使用global.mgr.using方法引入类这自动转换为延时创建模式
		isDelay : false,

		// 须延时创建的类集合
		delayDefineSet : {},

		// 延时写入的样式队列
		delayLoadstyleSrcQueue : [],

		// 须延时执行的方法执行环境队列
		delayExecQueue : [],

		// 阻塞方法队列
		blockQueue : [],

		constructor : function (id) {

			this.id = id || global.getId();
			global.Loader.$loaders[this.id] = this;

		},

		// 加载入口
		// @handle(fn) 载入句柄
		// @scope 载入句柄执行域
		load : function (handle, scope) {

			var me = this,
				callback = function () {

					me.delayExec();
					handle && handle.call(this);
					me.blockFree();
					me.delayWriteStyle();
					me.complete = true;

				};
			
			this.loaded = true;

			if (document.readyState == 'complete')
				return callback.call(scope || window);

			return global.addEventListener(window, 'load', callback);
		},

		// 延时定义类
		delayDefine : function (clsNs, options, callback) {

			options.cssUses && global.isBoolean(options.cssUses) && (options.cssUses = clsNs);
			
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

			delete global.mgr.nsSrcMap[clsNs];
			
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
						item && !classMap[name] && (item.isDefined = true) && global.define(item.clsNs, item.options, item.callback) && global.mgr.classDefineOrderQueue.push(item.clsNs)

						// 注册样式
						 && global.mgr.allowLoadCss && item.options.cssUses && (this.delayLoadstyleSrcQueue = this.delayLoadstyleSrcQueue.concat(global.mgr.convertToPath(item.options.cssUses, '.css')));
					}
				}

			}, this);

			this.delayDefineSet = {};

		},

		// 延时加载已注册样式
		delayWriteStyle : function (callback, scope) {

			global.Loader.loadedMap = global.Loader.loadedMap || {};

			global.each(this.delayLoadstyleSrcQueue, function () {

				var path = String(this);
			
				if(global.Loader.loadedMap[path])
					return true;
			
				global.loadStyle(path);
				global.Loader.loadedMap[path] = true;
				global.mgr.styleSrcQueue.push(path);

			});
		
			this.delayLoadstyleSrcQueue = [];

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
		
		// 加载结束后重写方法
		override:function(ns,obj,rewrite){
		
			this.delayReg(function(ns,obj,rewrite){
			
				global.namespace(ns,obj,rewrite);
			
			},arguments);
		
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
		// @params (路径列表[...],加载完成后委托句柄(fn))
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
		loadHandler : function (path, load) {

			global.Loader.loadedMap = global.Loader.loadedMap || {}; //记录已经载入的文件

			var isJs = /.+\.js$/.test(path),
				isCss = /.+\.css$/.test(path),
				doNothing = (!isJs && !isCss) || global.Loader.loadedMap[path];

			if (doNothing)
				return load();

			if (!doNothing)
				global.Loader.loadedMap[path] = true;

			if (isJs)
				global.loadScript(path, load);

			if (isCss)
				global.loadStyle(path, load);

			return null;

		},
		
		// 递归载入器
		iterateLoad : function (lst, i, handle, load, scope) {

			var me = this;
			
			scope = scope || this;
			
			if (i == lst.length) {
			
				load.call(scope);
				return;
			}

			handle.call(me, lst[i], function () {
			
				global.Loader.prototype.iterateLoad.call(me, lst, ++i, handle, load, scope);
			});
		}

	});
	
	// 载入管理器
	global.Loader.$loaders = {};
	
	// 加载单个类
	global.Loader.loadClass = function(className,callback,loaderName,loader){
		
		loader = loader || new global.Loader(loaderName || className);
		
		global.mgr.using(className,null,loader);
		
		loader.using(callback);
	};

	// 默认载入器
	global.loader = new global.Loader('defaultLoader');

	global.mgr.classMap[global.loader.$clsName] = global.Loader;

	window[global.$$libName] = global;

	alias && (window[alias] = global);

	global.alias(global.loader, 'using', global.$$libName + '.using');

	global.alias(global.loader, 'require', global.$$libName + '.require');

	global.alias(global.mgr, 'getInstance', global.$$libName + '.getInst');

	global.alias(global, 'namespace', global.$$libName + '.ns');

})(window, 'infestor');
