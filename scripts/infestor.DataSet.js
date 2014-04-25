
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

	// 显示加载进度 (bool|options:{ show:fn ,change:fn(value) ,hide:fn ,scope:obj})
	indicator:true,
	
	// 显示加载遮罩 (bool|options:{ show:fn , hide:fn ,scope:obj })
	mask:true,
	
	// 提交选项  options:{ url:string,params:obj,indicator:options|true|false,mask:options|true|false}
	submitConfig:null,
	
	// 加载选项 options:{remote:true|false,url:string,params:obj,method:get|post|jsonp,indicator:options|true|false,mask:options|true|false}
	loadConfig:null,

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
			indicator:this.indicator,
			mask:this.mask
			
		},this.loadConfig);
		
		
		this.submitConfig = infestor.append({
		
			remote:true,
		    method:'post'
			
		},this.submitConfig);
		
		
		this.loadIndicator =  this.loadIndicator || infestor.create('infestor.Indicator',{ 

			indicator:this.loadConfig.indicator,
			mask:this.loadConfig.mask

		});
		
		this.submitIndicator = this.submitIndicator || infestor.create('infestor.Indicator',{
		
			indicator:this.submitConfig.indicator,
			mask:this.submitConfig.mask
		
		});
		
		
	},

	setData : function (data) {

		this.current = 0;
		
		this.data = infestor.isFunction(data) ? data.call(this) : data;
		
		this.data = !infestor.isArray(data) ? [this.data] : this.data;
			
		this.count = this.data && this.data.length || 0;

		return this.data;

	},
	
	addData :function(item){
	
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

			this.emit('load', [this.setData(opts)],this);
			return;
		}

		opts && opts.params && (opts.params = infestor.append({}, config.params, opts.params));

		opts = infestor.append({

				url : config.url,
				method : config.method,
				params : config.params,
				success : function (data) {

					me.emit('load', [me.setData(data)],me);
					indicator && indicator.stop();
					me.emit('afterLoad',[me.data],me);
					if(config.method == 'jsonp')
						me.emit('loadComplete', arguments, me);
				},
				error : function () {
					
					me.emit('loadError', arguments,me);
					me.emit('error',arguments,me);
					
				},
				complete : function () {

					indicator && indicator.stop();
					me.emit('loadComplete', arguments, me);
				}

			}, opts);

		this.emit('beforeLoad',[opts],this);
		
		indicator && indicator.start();
	
		if (config.method != 'jsonp')
			infestor.request.ajax(opts);

		if (config.method == 'jsonp')
			infestor.request.jsonp(opts.url, opts.params, opts.success);

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

		config.params.data = this.getData();	
			
		opts && opts.params && (opts.params = infestor.append({}, config.params, opts.params));
		
		opts = infestor.append({

				url : config.url,
				method : config.method,
				params : config.params,
				success : function (data) {

					me.emit('submit', data ,me);
					indicator && indicator.stop();
					me.emit('afterSubmit',data ,me);

				},
				error : function () {
					
					me.emit('submitError', arguments,me);
					me.emit('error',arguments,me);
					
				},
				complete : function () {

					indicator && indicator.stop();
					me.emit('submitComplete', arguments, me);
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
