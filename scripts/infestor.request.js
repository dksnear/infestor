

infestor.namespace('infestor.request', {

	settings : {

		cache : true,
		contentType : 'application/x-www-form-urlencoded',
		timeout: 60*1000,
		error:null,
		success:null,
		complete:null
	},

	ajax : function (opts) {

		var xhr,timeoutId,
			method = (opts.method || 'get').toLowerCase(),
			url = opts.url || '#',
			params = infestor.isString(opts.params) && infestor.param(opts.params) || opts.params || {},
			async = opts.async || true,
			error = opts.error || this.settings.error,
			complete = opts.complete || this.settings.complete,
			success = opts.success || this.settings.success,
			dataType = opts.dataType || 'json',
			scope = opts.scope || window,
			jsonpCallbackParamName = opts.jsonpCallbackParamName || 'callback',
			jsonpCallbackFnName = opts.jsonpCallbackFnName || infestor.$$libName + '.request.$jsonp',
			script = null,
			request = this,
			timeout = opts.timeout || this.settings.timeout,
			dataConvertHandle = function(type,data){
			
				switch(type){
				
					case 'json':
						return infestor.jsonDecode(data);
					default:
						return data;
				
				}
			
			},
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
		
		// for xdebug
		(infestor.xdebug || params.$xdebug) && infestor.append(params,{ XDEBUG_SESSION_START:1 });
		
		// for jsonp
		(method == 'jsonp') && (params[jsonpCallbackParamName] = jsonpCallbackFnName);
		
		// params obj to params string
		params = infestor.param(params);

		if (method != 'post') {

			params && (url += '?' + params);
			params = null;
			
		}
		
		if(method == 'jsonp'){
		
			script = infestor.loadScript(url, function () {

				timeoutId && clearTimeout(timeoutId);
				success && success.call(scope, request.$data);
				request.$data = null;
				script.parentNode.removeChild(script);			
				complete && complete.call(scope,true);
					
			},function(e){
			
				// ie8minus not support
				error && error.call(scope,e);
				complete && complete.call(scope,false,e);
			
			});
						
			return true;
		
		}
		
		timeout && (timeoutId = setTimeout(function(){
		
			error && error.call(scope,{ timeout:true });
			complete && complete.call(scope,false,{ timeout:true });
			
			success = null;
			error = null;
			complete = null;
		
		},timeout));
		
		xhr = window.ActiveXObject ? activeXhr() : standardXhr();

		if (!xhr)
			return false;

		xhr.onreadystatechange = function () {
		
			var succeed = false;

			if (xhr.readyState === 4) {
			
				timeoutId && clearTimeout(timeoutId);

				if (((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
				   (succeed = true) && success && success.call(scope,dataConvertHandle(dataType,xhr.responseText), xhr);
				
				!succeed && error && error.call(scope,xhr);

				complete && complete.call(scope,succeed,xhr);
			}

		};

		xhr.open(method, url, async, opts.username || undefined, opts.password || undefined);

		xhr.setRequestHeader('Content-Type', opts.contentType || this.settings.contentType);
		(!this.settings.cache || opts.cache === false) && xhr.setRequestHeader('Cache-Control', 'no-cache');
		// xhr.setRequestHeader('If-Modified-Since', '0');//禁止缓存

		xhr.send(params);

		return true;
		
	},

	get : function (url, params, success, error, complete, scope) {

		this.ajax({
			url : url,
			params : params,
			method : 'get',
			success : success,
			error : error,
			complete : complete
		});
	},

	post : function (url, params, success, error, complete, scope) {

		this.ajax({
			url : url,
			params : params,
			method : 'post',
			success : success,
			error : error,
			complete : complete
		});
	},
	
	jsonp : function (url, params, success, error, complete, scope) {

		this.ajax({
			url : url,
			params : params,
			method : 'jsonp',
			success : success,
			error : error,
			complete : complete
		});
	},

	$jsonp : function (data) {

		this.$data = data;
	}

});
