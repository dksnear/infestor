
infestor.define('infestor.DataSet', {

	extend : 'infestor.Object',

	uses : ['infestor.request', 'infestor.Dom', 'infestor.Task'],

	statics : {

		showIndicator : function () {

			this.elementIndicator = this.elementIndicator || infestor.Dom.div().css({

					position : 'fixed',
					width : '0%',
					height : '5px',
					top : 0,
					left : 0,
					'background-color' : 'orange'

				}).appendTo(infestor.Dom.getBody());

			this.elementIndicator.zIndex().show();

			return this;

		},
		changeIndicator : function (value) {

			if (!this.elementIndicator)
				return;

			infestor.isRawObject(value) ? this.elementIndicator.css(value) : this.elementIndicator.css('width', value + '%');

			return this;

		},
		hideIndicator : function () {

			this.elementIndicator && this.elementIndicator.hide();

			return this;

		}

	},

	url : null,

	params : null,

	// get post jsonp
	method : 'get',

	remote : true,

	data : null,

	count : 0,

	current : 0,

	isLoaded : false,
	
	globalIndicator: true,

	events : {

		load : null,
		error : null,
		complete : null

	},

	setData : function (data) {

		this.current = 0;
		this.data = infestor.isFunction(data) ? data.call(this) : data;
		this.count = this.data && this.data.length || this.count;
		
		return this.data;

	},
	
	clearData : function(){
	
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
		task;

		if (!this.remote) {

			this.emit('load', arguments);
			return;
		}

		task = infestor.create('infestor.Task', {

				indicatorStart : infestor.random(0,15),
				indicatorStop : infestor.random(35,85),
				interval : 20,

				events : {

					start : function () {
					
						infestor.DataSet.showIndicator().changeIndicator(this.indicatorStart);
					
					},
					turn : function () {

						this.indicatorStart = infestor.random(this.indicatorStart, this.indicatorStop);
						infestor.DataSet.changeIndicator(this.indicatorStart);

					},
					stop : function () {
					
						infestor.DataSet.changeIndicator(100);
						
						infestor.delay(function(){
							
							infestor.DataSet.hideIndicator().changeIndicator(0);
						
						},200);
						
					
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

					me.emit('load', [me.setData(data)]);
					me.isLoaded = true;
					task.stop();
				},
				error : function () {
				
					me.emit('error', arguments);
				},
				complete : function () {

					task.stop();
					me.emit('complete', arguments);
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
	}

});
