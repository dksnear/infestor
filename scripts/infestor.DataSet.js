
infestor.define('infestor.DataSet', {

	extend : 'infestor.Object',

	uses : ['infestor.request', 'infestor.cross', 'infestor.Dom', 'infestor.Task'],

	statics : {

		showIndicator : function () {

			infestor.DataSet.elementIndicator = infestor.DataSet.elementIndicator || infestor.Dom.div().css({

					position : 'fixed',
					width : '0%',
					height : '5px',
					top : 0,
					left : 0,
					'background-color' : 'orange'

				}).appendTo(infestor.Dom.getBody());

			infestor.DataSet.elementIndicator.zIndex().show();

			return this;

		},

		changeIndicator : function (value) {

			if (!infestor.DataSet.elementIndicator)
				return;

			infestor.isRawObject(value) ? infestor.DataSet.elementIndicator.css(value) : infestor.DataSet.elementIndicator.css('width', value + '%');

			return this;

		},

		hideIndicator : function () {

			infestor.DataSet.elementIndicator && infestor.DataSet.elementIndicator.hide();

			return this;

		}

	},

	// 远程请求
	remote : true,

	// 请求地址
	url : null,

	// 请求参数 (obj)
	params : null,

	// 远程请求方法 (get|post|jsonp)
	method : 'get',

	// 数据对象 (array)
	data : null,

	// 数据对象长度
	count : 0,

	// 当前数据
	current : 0,

	// 已载入
	isLoaded : false,

	// 显示加载进度 (bool|options:{ show:fn ,change:fn(value) ,hide:fn ,scope:obj})
	indicator : true,

	// 显示遮罩 (bool|options:{ show:fn , hide:fn ,scope:obj })
	mask : true,

	events : {

		// for load
	
		// @params data
		// @scope this
		load : null,
		
		//@scope this
		error : null,
		complete : null,
		
		
		// for submit
		
		beforeSubmit:null,
		afterSubmit:null,
		submitComplete:null,
		submitError:null

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
		task,
		mask,
		indicator;

		if (!this.remote) {

			this.emit('load', [me.setData(opts)],this);
			this.emit('complete',[],this);
			return;
		}

		mask = this.mask ? {

			show : infestor.isBoolean(this.mask) ? infestor.cross.showMask : function () {

				me.mask.show.call(me.mask.scope || window);

			},
			hide : infestor.isBoolean(this.mask) ? infestor.cross.hideMask : function () {

				me.mask.hide.call(me.mask.scope || window);
			}

		}
		 : this.mask;

		indicator = this.indicator ? {

			show : infestor.isBoolean(this.indicator) ? infestor.DataSet.showIndicator : function () {

				me.indicator.show.call(me.indicator.scope || window)
			},
			hide : infestor.isBoolean(this.indicator) ? infestor.DataSet.hideIndicator : function () {

				me.indicator.hide.call(me.indicator.scope || window);
			},
			change : infestor.isBoolean(this.indicator) ? infestor.DataSet.changeIndicator : function () {

				me.indicator.change.apply(me.indicator.scope || window, arguments);

			}

		}
		 : this.indicator;

		task = infestor.create('infestor.Task', {

				indicatorStart : infestor.random(0, 15),
				indicatorStop : infestor.random(35, 85),
				interval : 20,

				events : {

					start : function () {

						mask && mask.show();

						indicator && indicator.show();
						indicator && indicator.change(this.indicatorStart);

					},

					tick : function () {

						if (!indicator)
							return;

						this.indicatorStart = infestor.random(this.indicatorStart, this.indicatorStop);
						indicator.change(this.indicatorStart);

					},

					stop : function () {

						indicator && indicator.change(100);

						indicator && infestor.delay(function () {

							indicator.hide();
							indicator.change(0);

						}, 200);

						mask && mask.hide();

					}

				}

			});

		opts && opts.params && (opts.params = infestor.append({}, this.params, opts.params));

		this.isLoaded = false;

		opts = infestor.append({

				url : this.url,
				method : this.method,
				params : this.params,
				success : function (data) {

					me.emit('load', [me.setData(data)],me);
					me.isLoaded = true;
					task.stop();
					
					if(me.method == 'jsonp')
						me.emit('complete', arguments, me);
				},
				error : function () {
					
					me.emit('error', arguments,me);
				},
				complete : function () {

					task.stop();
					me.emit('complete', arguments, me);
				}

			}, opts);

		task.start();

		if (this.method != 'jsonp')
			infestor.request.ajax(opts);

		if (this.method == 'jsonp')
			infestor.request.jsonp(opts.url, opts.params, opts.success);

		if (rewrite) {

			this.params = opts.params;
			this.method = opts.method;
			this.url = opts.url;
		}

	},

	reload : function () {

		this.load();
	},

	submit:function(){
	
	
	},
	
	destroy:function(){
	
		this.clearData();
	
	}

});
