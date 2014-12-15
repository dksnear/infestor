

infestor.namespace('infestor.cookie', {

	expires : 20, //单位(天)
	path : null, //默认路径
	secure : false,
	domain : null,
	//添加一个cookie主键 key,value
	add : function (key, value, expires) {

		var innerAdd = function (opts) {

				var obj = {};

				obj[opts.key] = escape(opts.value);
				obj.expires = this.$formatDate(opts.expires || this.expires);
				obj.path = opts.path || this.path;
				obj.domain = opts.domain || this.domain;
				obj.secure = opts.secure || this.secure,
				document.cookie = this.$concat(obj, '; ');
			};

		if (infestor.isArray(key))
			return infestor.each(key, function (idx,opts) {
				innerAdd.call(this,opts);
			},this), true;

		if (infestor.isString(key))
			return innerAdd.call(this,{
				key : key,
				value : value,
				expires : expires
			}), true;

		if (infestor.isObject(key))
			return innerAdd.call(this,key), true;

		return false;

	},
	//获取一个cookie主键
	get : function (key) {

		if (!document.cookie)
			return null;

		var grp = document.cookie.split('; '),
			idx = 0,
			len = grp.length,
			regx = /([^=]+)=(.+)/,
			map = {},
			cap;

		for (; idx < len; idx++) {

			cap = regx.exec(grp[idx]);

			map[cap[1]] = unescape(cap[2]);
		}

		if (!key)
			return map;

		return map[key];

	},
	//移除一个cookie主键
	remove : function (key) {

		this.add({

			key : key,
			value : false,
			expires : -1

		});

	},
	//清空所有cookie
	clear : function () {

		var map = this.get(),key;

		for (key in map)
			this.remove(key);

	},

	$concat : function (obj, operator, filter) {

		var name,
			value,
			arr = [];

		for (name in obj) {

			if (!obj.hasOwnProperty(name))
				continue;

			value = obj[name];

			if (value === null || value === undefined)
				continue;

			if (name == 'secure') {
				if (!value)
					continue;
				arr.push('secure');
				continue;
			}

			if (filter)
				value = filter(value);

			arr.push(name + '=' + value);
		}

		return arr.join(operator);

	},

	$formatDate : function (date) {

		var d;

		if (infestor.isDate(date))
			d = date;

		if (infestor.isNumber(date)) {

			d = new Date();
			d.setTime(d.getTime() + (date * 24 * 60 * 60 * 1000));
		}

		return d.toUTCString();

	}

});

infestor.alias(infestor.cookie, 'add', 'infestor.cookieAdd');

infestor.alias(infestor.cookie, 'get', 'infestor.cookieGet');

infestor.alias(infestor.cookie, 'clear', 'infestor.cookieClear');

infestor.alias(infestor.cookie, 'remove', 'infestor.cookieRemove');
