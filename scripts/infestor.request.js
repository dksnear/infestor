

infestor.namespace('infestor.request', {

	settings : {

		cache : true,
		contentType : 'application/x-www-form-urlencoded'
	},

	ajax : function (opts) {

		var xhr,
		method = opts.method || 'get',
		url = opts.url || '#',
		params = infestor.isString(opts.params) ? opts.params : infestor.param(opts.params || {}),
		async = opts.async || true,
		error = opts.error || this.settings.error,
		complete = opts.complete || this.settings.complete,
		success = opts.success,
		standardXhr = function () {
			try {
				return new window.XMLHttpRequest();
			} catch (e) {}
		},
		activeXhr = function () {
			try {
				return new window.ActiveXObject('Microsoft.XMLHTTP');
			} catch (e) {}
		};
		
		//for xdebug
		params = infestor.xdebug || param.$xdebug ? infestor.append({},{ XDEBUG_SESSION_START:1 },params) : params;

		xhr = window.ActiveXObject ? activeXhr() : standardXhr();

		if (!xhr)
			return false;

		if (method.toLowerCase() == 'get') {

			params && (url += '?' + params);
			params = null;
		}

		xhr.onreadystatechange = function () {

			if (xhr.readyState === 4) {

				if (((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
					success && success(xhr.responseText, xhr);
				else
					error && error(xhr);

				complete && complete(xhr);
			}

		};

		xhr.open(method, url, async, opts.username || undefined, opts.password || undefined);

		xhr.setRequestHeader('Content-Type', opts.contentType || this.settings.contentType);
		(!this.settings.cache || opts.cache === false) && xhr.setRequestHeader('Cache-Control', 'no-cache');
		// xhr.setRequestHeader('If-Modified-Since', '0');//禁止缓存

		xhr.send(params);

	},

	get : function (url, params, success, error, complete) {

		this.ajax({
			url : url,
			params : params,
			method : 'get',
			success : success,
			error : error,
			complete : complete
		});
	},

	post : function (url, params, success, error, complete) {

		this.ajax({
			url : url,
			params : params,
			method : 'post',
			success : success,
			error : error,
			complete : complete
		});
	},

	/*cross: function (url, params, success, error) {

	var crossFrame = infestor.Dom.create('iframe', { src: url }).on('load', function () {

	success(crossFrame);

	}).hide().appendTo(infestor.Dom.use(document.body));

	},*/

	$jsonp : function (data) {

		this.$data = data;
	},

	jsonp : function (url, params, callback, scope) {

		var params = infestor.append(params, {
				callback : infestor.$$libName + '.request.$jsonp'
			}),
			// for xdebug
			params = infestor.xdebug || params.$xdebug ? infestor.append({},{ XDEBUG_SESSION_START:1 },params) : params;
			request = this,
			script = infestor.loadScript(url + '?' + infestor.param(params), function () {

				callback && callback.call(scope || window, request.$data);
				request.$data = null;
				script.parentNode.removeChild(script);
			});
	}

});
