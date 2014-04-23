
// 用于处理图片预加载

infestor.define('infestor.ImageLoader', {

	extend : 'infestor.Object',

	uses : ['infestor.DataSet', 'infestor.Task'],

	statics : {
	
		lazy:null
	
	},
	
	// 加载失败替换图片地址
	alt:null,

	// 扫描任务(判定图片集合是否加载完全)
	task : null,

	// 扫描周期
	interval : 40,

	// 超时限制
	timeout : 60000,

	// 加载路径列表(array)
	items : null,

	dataSet : null,

	// 预加载图片对象列表
	preloadList : null,

	// 完成加载的图片对象列表
	loadedList : null,

	// 加载错误的图片对象列表
	unloadList : null,

	// 完全加载
	isComplete : false,

	events : {

		// @params isCompete,this
		// @scope this
		beforeLoad : null,
		afterLoad : null,
		load:null,
		
		// @params img,src
		// @scope this
		beforeItemLoad : null,
		afterItemLoad : null,
		
		// @params errorObj,img,src
		// @scope this
		itemLoadError : null
	},

	init : function () {

		this.dataSet = this.dataSet || infestor.create('infestor.DataSet', {

				indicator : false,
				mask : false,
				remote : false

			});

		this.preloadList = this.preloadList || [];
		this.loadedList = this.loadedList || [];
		this.unloadList = this.unloadList || [];
		
		this.item = this.item || [];
		
		this.add(this.item);

	},

	// add src
	add : function (src,name,alt) {
	
		if(infestor.isArray(src))
			return infestor.each(src,function(idx,src){ 
			
				if(infestor.isRawObject(src))
					return this.add(src.src,src.name,src.alt),true;
					
				this.add(src); 
			
			},this),this;

		var me = this,
			img = new Image();

		this.isComplete = false;
		
		img.alt = alt || this.alt || img.alt;
		
		img.$name = name || this.getId();

		this.emit('beforeItemLoad', [img, src], this);
	
		img.src = src;
		
		img.onload = function () {

			me.loadedList.push(img);
			me.emit('afterItemLoad', [img, src], me);
			img.onload = null;

		};

		img.onerror = function (error) {

			img.complete = true;
			img.error = true;
			me.unloadList.push(img);
			me.emit('itemLoadError', [error,img, src], me);
			img.onerror = null;

		};

		this.dataSet.addData(img);

		this.preloadList.push(img);
		
		return this;

	},

	start : function () {

		var me = this;

		me.emit('beforeLoad',[this.isComplete,this],this);
		
		this.task = this.task || infestor.create('infestor.Task', {

				interval : this.interval,

				startTime : Date.now(),

				events : {

					tick : function () {
					
						me.emit('load',[me.isComplete,me],me);

						if ((Date.now() - this.startTime) > me.timeout){
							me.emit('afterLoad',[me.isComplete,me],me);
							this.stop();
						}
						
						me.scan();
						
						if(this.preloadList.length < 1){
							me.isComplete = true;
							me.emit('afterLoad',[me.isComplete,me],me);
							this.stop();
						}
					}
				}

			});
			
		return this;
	},
	
	// 扫描一次预加载列表 移除已加载的图片对象
	scan:function(){
		
		var i=0,len=this.preloadList.length;
	
		for(; i<len ;){
		
			if(this.preloadList[i].complete){
			
				this.preloadList.splice(i,1);
				--len;
				continue;
			}
			
			i++;
		}
		
		return this;
	
	},
	
	stop : function () {

		return this.task && this.task.stop(),this;

	},

	destroy : function () {

		this.task = this.task && this.task.destroy();
		this.dataSet = this.dataSet && this.dataSet.destroy();
		this.preloadList = null;
		this.loadedList = null;
		this.unloadList = null;

		return null;

	}
});
