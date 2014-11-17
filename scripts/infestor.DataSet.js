
infestor.define('infestor.DataSet', {

	extend : 'infestor.Object',

	uses : ['infestor.request','infestor.Indicator'],

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
	indicator:true,
	
	// 提交选项  options:{ url:string,params:obj,method:get|post|jsonp,indicator:options|obj|true|false}
	submitConfig:null,
	
	// 加载选项 options:{remote:true|false,url:string,params:obj,method:get|post|jsonp,indicator:options|obj|true|false}
	loadConfig:null,
		
	// 拥有者对象
	owner:null,

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
	
		this.loadConfig = infestor.append({
		
			remote:this.remote,
			url:this.url,
			params:this.params,
			method:this.method,
			indicator:this.indicator
			
		},this.loadConfig);
		
		
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

	setData : function (data) {

		this.current = 0;
		
		this.data = data;
				
		this.data = !infestor.isArray(this.data) ? [this.data] : this.data;
			
		this.count = this.data && this.data.length || 0;

		return this.data;

	},
	
	hasData : function(){
	
		return !!this.count;
	},
	
	addData : function(item){
	
		this.data = this.data || [];
	
		this.data.push(item);
		
		this.count++;
		
		return item;
	
	},

	getData : function (idx) {
	
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

		return this.data[idx];
	},

	removeData:function(idx){
	
		if(!this.data) return;
		
		var removed = [];
				
		if(infestor.isFunction(idx)){
		
			var i=0;
			
			for(;i<this.count;){
			
				if(idx.call(this,idx,this.data[idx])){
				
					removed.push(this.data.splice(i,1));
					--this.count;
					continue;
				}
				
				i++;
			}
			
			return removed;
		
		}
		
		
		removed.push(this.data.splice(idx,1));
		
		this.count--;
		
		return removed;
		
	},
	
	clearData : function () {

		return this.setData([]);

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

			this.emit('load', [this.setData(opts || this.data)],this);
			return;
		}

		opts && opts.params && (opts.params = infestor.append({}, config.params, opts.params));

		opts = infestor.append({

			url : config.url,
			method : config.method,
			params : config.params,
			success : function (data) {

				me.emit('load', [me.setData(data),opts.params],me);
				me.emit('afterLoad',[me.data,opts.params],me);

			},
			error : function () {
				
				me.emit('loadError', [config.params].concat(infestor.argsToArray(arguments)),me);
				me.emit('error',[config.params].concat(infestor.argsToArray(arguments)),me);
				
			},
			complete : function () {

				indicator && indicator.stop();
				me.emit('loadComplete', [config.params].concat(infestor.argsToArray(arguments)), me);
			}

		}, opts);

		this.emit('beforeLoad',[opts],this);
		
		indicator && indicator.start();
	
		infestor.request.ajax(opts);

		if (rewrite) {

			config.params = opts.params;
			config.method = opts.method;
			config.url = opts.url;
			
			this.loadConfig = config;
		}

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
		
		opts && opts.params && (opts.params = infestor.append({}, config.params, opts.params));
		
		config.params = infestor.append(config.params,this.getSubmitParams());
		
		opts = infestor.append({

			url : config.url,
			method : config.method,
			params : config.params,
			success : function (data,msg) {

				me.emit('submit', [data,opts.params,msg] ,me);
				me.emit('afterSubmit',[data,opts.params,msg] ,me);

			},
			error : function () {
				
				me.emit('submitError', [config.params].concat(infestor.argsToArray(arguments)),me);
				me.emit('error',[config.params].concat(infestor.argsToArray(arguments)),me);
				
			},
			complete : function () {

				indicator && indicator.stop();
				me.emit('submitComplete', [config.params].concat(infestor.argsToArray(arguments)), me);
			}

		}, opts);

		this.emit('beforeSubmit',[opts],this);
		
		indicator && indicator.start();
	
		infestor.request.ajax(opts);

		if (rewrite) {

			config.params = opts.params;
			config.method = opts.method;
			config.url = opts.url;
			
			this.submitConfig = config;
		}
	
	
	},
	
	destroy:function(){
	
		this.clearData();
		this.submitIndicator = this.submitIndicator && this.submitIndicator.destroy();
		this.loadIndicator = this.loadIndicator && this.loadIndicator.destroy();
		
		this.callParent();
	
	}

});
