
infestor.define('infestor.DataSet', {

	extend : 'infestor.Object',

	uses : ['infestor.Request','infestor.Indicator','infestor.Cache'],

	// 数据模型映射
	modelMap : null,
	
	// 远程加载请求
	remote : true,

	// 加载请求地址
	url : null,

	// 加载请求参数 (obj)
	params : null,

	// 加载请求方法 (get|post|jsonp)
	method : 'get',

	// 加载数据对象 (array)
	data : null,

	// 数据对象长度
	count : 0,

	// 当前数据
	current : 0,

	// 显示加载进度 (bool|infestor.Indicator|options:{})
	indicator : false,
	
	// 提交选项  options:{ url:string,params:obj,method:get|post|jsonp,indicator:options|obj|true|false}
	submitConfig : null,
	
	// 加载选项 options:{remote:true|false,url:string,params:obj,method:get|post|jsonp,indicator:options|obj|true|false}
	loadConfig : null,
	
	// 分页选项(远程加载有效) true|options:{ size:num,start:0|num,paramMap:{ size:string,current:string }  }
	pageConfig : null,
		
	// 拥有者对象
	owner : null,
	
	// 缓存
	cache : null,
	
	cacheKey: null,
	
	isLoading : false,
	
	isSubmitting : false,

	events : {

		// @scope this
		
		// for load
	
		// @params this.data
		
		beforeLoad:null,
		afterLoad:null,
		load : null,
		
		// @params ajaxComplete
		
		LoadError : null,
		LoadComplete : null,
		
		// 页面溢出 (当分页加载数据为空时触发)
		pageout : null,
		
		// for submit	

		// @params submitOptions
		beforeSubmit:null,
		
		// @params data
		afterSubmit:null,
		submit:null,
		
		// @params ajaxComplete
		submitComplete:null,
		submitError:null,
		
		// for all
		
		error:null

	},
		
	init : function(){
		
		this.initCache();
	
		this.pageConfig = infestor.isBoolean(this.pageConfig) && this.pageConfig && {
			
			// 页面大小
			size:10,
			// 初始位置
			start:0,
			// 请求参数名映射
			paramMap:{
			
				// 页面大小参数
				size:'size',
				// 当前位置参数
				current:'current'
			
			}
	
		} || this.pageConfig;
	
		// 加载配置
		this.loadConfig = infestor.append({
		
			// 远程请求
			remote:this.remote,
			// 请求地址 不要在地址中包含参数
			url:this.url,
			// 请求参数
			params:this.params,
			// 请求方法
			method:this.method,
			// 请求指示器
			indicator:this.indicator,
			// 分页配置
			pageConfig:this.pageConfig
			
		},this.loadConfig);
		
		// 提交配置
		this.submitConfig = infestor.append({
		
			remote:true
			
		},this.submitConfig);
			
		this.loadIndicator =  this.loadIndicator ||  this.initIndicator(this.loadConfig.indicator);
		
		this.submitIndicator = this.submitIndicator ||  this.initIndicator(this.submitConfig.indicator);
		
	},
	
	initIndicator : function(opts){
	
		if(infestor.isBoolean(opts) && opts)
			return infestor.create('infestor.Indicator');
			
		if(infestor.isRawObject(opts))
			return infestor.create('infestor.Indicator',opts);
		
		if(opts instanceof infestor.Indicator)
			return opts;
			
		return null;
	
	},
	
	initCache : function(cache){
		
		this.cache = cache || this.cache;
		
		if(infestor.isBoolean(this.cache) && this.cache)
			return this.cache = infestor.create('infestor.Cache',{
				
				// string:cookie|userData|localStorage
				cacheType: 'localStorage',
				// init:unit(day)
				expires: 30
							
			});
			
		if(infestor.isRawObject(this.cache))
			return this.cache = infestor.create('infestor.Cache',this.cache);
		
		if(this.cache instanceof infestor.Cache)
			return this.cache;
		
		return this.cache = null;
		
	},
	
	getCacheKey : function(){
		
		if(this.remote)
			return this.cacheKey || this.loadConfig.url;
		
		return this.cacheKey;
	},

	getCache : function(key){
		
		if(!this.cache) return null;
		
		key = key || this.getCacheKey();
		
		if(!key) return null;
		
		return this.cache.get(key);
		
	},
	
	setCache : function(key,value){
		
		if(!this.cache) return null;
		
		key = key || this.getCacheKey();
		
		if(!key) return null;
				
		return this.cache.set(key,value || this.data);
		
	},
	
	removeCache : function(key){
		
		if(!this.cache) return null;
		
		key = key || this.getCacheKey();
		
		if(!key) return null;
		
		return this.cache.removeCache(key);
		
	},
	
	initData : function(rawData){
	
		this.current = 0;
		
		var cacheData = this.getCache();
		
		if(cacheData){
			
			 this.data = cacheData;
			 this.count = this.data.length;
			 
			 return this.data;
		}
		
		if(!rawData)
			return this.data = null;
			
		this.data = infestor.isArray(rawData) ? rawData : [rawData];
		
		this.data = this.mapData(this.data);
		
		this.count = this.data.length;
		
		this.setCache();
		
		return this.data;
	
	},
	
	setData : function (data,idx,name) {

		if(idx > this.count-1)
			return null;
		
		if(!name) 
			this.data[idx] = data;	
		else this.data[idx][name] = data;
		
		this.setCache();

		return data;

	},
	
	hasData : function(filter){
	
		var matched = true;
	
		if(!this.count)
			return false;
		
		if(!filter && this.count)
			return true;
	
		infestor.each(this.data,function(idx,row){

			matched = true;
		
			infestor.each(filter,function(name,value){
			
				if(row[name] !== value)
					return matched = false;
						
			});
			
			if(matched) 
				return matched = {
				
					index : idx,
					data : row
				
				}, false;
		
		});
		
		return matched;
		
	},
	
	addData : function(rowData,head){
	
		this.data = this.data || [];
	
		rowData = this.mapData(rowData);
	
		head ? this.data.unshift(rowData) : this.data.push(rowData);
		
		this.count++;
		
		this.setCache();
		
		return rowData;
	
	},

	getData : function (idx,name) {
	
		var data=[];
	
		if (!this.data)
			return null;

		if (arguments.length < 1)
			return this.data;
			
		if(infestor.isFunction(idx)){
		
			infestor.each(this.data,function(i,item){
			
				idx.call(this,i,item) && data.push(item);
				
			},this);
			
			return data;
		
		}	
			
		idx = idx > this.count - 1 ? this.count - 1 : idx;
		
		this.current = idx;
		
		if(this.count < 1)
			return null;

		return name ? this.data[idx][name] : infestor.append({},this.data[idx]);
	},
	
	searchData : function (sKey,sValue,rKey){
	
		var result = null;
	
		if(!sKey || !this.data) return result;
	
		infestor.each(this.data,function(idx,row){
		
			if(row.hasOwnProperty(sKey) && row[sKey] == sValue){
				result = rKey ? row[rKey] : row;
				result.$floatIdx = idx;
				return false;
			}
		
		});
		
		return result;
	
	},
	
	mapData : function(rowData,reverse){
	
		var map = this.modelMap;
	
		if(!map) 
			return rowData;
		
		if(infestor.isArray(rowData))
			return infestor.each(rowData,function(idx,rowData){
			
				this.mapData(rowData,reverse);
			
			},this),rowData;
		
		if(reverse){
		
			this.reverseModelMap = this.reverseModelMap || infestor.kvSwap(this.modelMap);
			map = this.reverseModelMap;
		}
		
		infestor.each(map,function(mapName,name){
		
			if(!!name && name == mapName)
				return true;
			
			rowData[mapName] = rowData[name];
			delete rowData[name];
		
		});
		
		return rowData;
		
	
	},
	
	removeData:function(idx){
	
		if(!this.data) return;
		
		var removed = [];
				
		if(infestor.isFunction(idx)){
		
			var i=0;
			
			for(;i<this.count;){
			
				if(idx.call(this,i,this.data[i])){
				
					removed.push(this.data.splice(i,1));
					--this.count;
					continue;
				}
				
				i++;
			}
			
			this.setCache();
			
			return removed;
		
		}
			
		removed.push(this.data.splice(idx,1));
		
		this.count--;
		
		this.setCache();
		
		return removed;
		
	},
	
	clearData : function () {

		this.count = 0;
		this.current = 0;
		this.data =[];
		
		this.setCache();
		
		return this.data;

	},

	getSubmitParams : function(){
		
		return {
		
			data : infestor.jsonEncode(this.getData())
		
		};
	
	},
	
	setCurrent : function (current) {

		this.current = infestor.isFunction(current) ? current.call(this) : (current || this.current);

	},

	next : function () {

		if (this.current == this.count)
			this.current = 0;
		return this.data && this.data[this.current++];
	},

	previous : function () {

		if (this.current < 0)
			this.current = this.count - 1;
		return this.data && this.data[this.current--];
	},

	load : function (opts, rewrite) {

		var me = this,
			config = this.loadConfig,
			indicator = this.loadIndicator;
			
		if (!config.remote) {

			this.emit('load', [this.initData(opts || this.data)],this);
			return;
		}

		// 设置自定义参数	
		opts = infestor.append({},opts);	
		opts.params = infestor.append({}, config.params, opts.params);
		
		// 设置分页参数
		if(config.pageConfig){
		
			this.pageSize = this.pageSize || config.pageConfig.size || 10;
			this.pageStart = this.pageStart || config.pageConfig.start || 0;
			this.pageCurrent = this.pageCurrent || config.pageConfig.start || 0;
			
			opts.params[config.pageConfig.paramMap && config.pageConfig.paramMap.current || 'current'] = this.pageCurrent;
			opts.params[config.pageConfig.paramMap && config.pageConfig.paramMap.size || 'size'] = this.pageSize;
		}
	
		opts = infestor.append({

			url : config.url,
			method : config.method,
			params : config.params,
			success : function (data) {
								
				me.emit('load', [me.initData(data),opts.params],me);
				
				// 设置当前页面位置
				me.pageSize && !me.hasData() && me.emit('pageout',[me.pageCurrent,opts.params],me);
				me.pageSize && (me.pageCurrent =  me.hasData() ? (me.pageCurrent + me.count) : 0);
				
				me.emit('afterLoad',[me.data,opts.params],me);

			},
			error : function () {
				
				me.emit('loadError', [opts.params].concat(infestor.toArray(arguments)),me);
				me.emit('error',[opts.params].concat(infestor.toArray(arguments)),me);
				
			},
			complete : function () {

				indicator && indicator.stop();
				me.isLoading = false;
				me.loadingOptions = null;
				me.emit('loadComplete', [opts.params].concat(infestor.toArray(arguments)), me);
			}

		}, opts);

		this.emit('beforeLoad',[opts],this);
		
		indicator && indicator.start();
		
		this.isLoading = true;
		this.loadingOptions = opts;
	
		infestor.Request.ajax(opts);

		if (rewrite)
			this.loadConfig = infestor.append({},config,opts);

	},

	reload : function () {

		this.load();
	},

	submit:function(opts, rewrite){
	
		var me = this,
			config = this.submitConfig,
			indicator = this.submitIndicator;

		if (!config.remote)
			return;

		config.params = config.params || {};
		
		// 设置提交数据参数
		config.params = infestor.append({},config.params,this.getSubmitParams());
		
		// 设置自定义参数
		opts = infestor.append({},opts);	
		opts.params = infestor.append({}, config.params, opts.params);
				
		opts = infestor.append({

			url : config.url,
			method : config.method,
			params : config.params,
			success : function (data,msg) {

				me.emit('submit', [data,opts.params,msg] ,me);
				me.emit('afterSubmit',[data,opts.params,msg] ,me);

			},
			error : function () {
				
				me.emit('submitError', [opts.params].concat(infestor.toArray(arguments)),me);
				me.emit('error',[opts.params].concat(infestor.toArray(arguments)),me);
				
			},
			complete : function () {

				indicator && indicator.stop();
				me.isSubmitting = false;
				me.submittingOptions = null;
				me.emit('submitComplete', [opts.params].concat(infestor.toArray(arguments)), me);
			}

		}, opts);

		this.emit('beforeSubmit',[opts],this);
		
		indicator && indicator.start();
		
		this.isSubmitting = true;
		this.submittingOptions = opts;
	
		infestor.Request.ajax(opts);

		if (rewrite) 	
			this.submitConfig = infestor.append({},config,opts);	
	
	},
	
	destroy:function(){
	
		this.clearData();
		this.submitIndicator = this.submitIndicator && this.submitIndicator.destroy();
		this.loadIndicator = this.loadIndicator && this.loadIndicator.destroy();
		
		this.callParent();
	
	}

});
