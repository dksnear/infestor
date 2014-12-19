
//基本事件类

infestor.define('infestor.Event', {

	alias : 'event',

	constructor : function () {

		this.addEventListener.apply(this, arguments);
	},
	
	// 调用父类同名方法
	callParent : function () {

		var method = this.callParent.caller,
			ownerCls = method.$ownerCls,
			parentClass = !!ownerCls ? method.$ownerCls.$superClass : undefined,
			methodName = method.$methodName;

		return parentClass && parentClass[methodName] && parentClass[methodName].apply(this, arguments.length > 0 ? arguments : method.arguments);
	},

	// 添加侦听事件
	addEventListener : function (eventName, eventHandle, scope) {

		if (!eventName)
			return;

		var eventsList = {};

		this.eventsMap = this.eventsMap || {};

		if (infestor.isRawObject(eventName))
			eventsList = eventName;
		else
			eventsList[eventName] = eventHandle;

		infestor.each(eventsList, function (name, handle) {

			if (!handle)
				return true;

			this.eventsMap[name] = this.eventsMap[name] || {};

			handle.$scope = scope;
			
			this.eventsMap[name][infestor.getId()] = handle;

		}, this);
	},

	// 移除侦听事件
	removeEventListener : function (eventName, eventHandle) {

		if (!this.eventsMap)
			return;

		//移除所有事件的侦听器
		if (!eventName)
			return this.eventsMap = {},
		undefined;

		//移除某个事件的所有侦听器
		if (!eventHandle)
			return this.eventsMap[eventName] && delete this.eventsMap[eventName], undefined;

		//移除某个事件的某个侦听器
		this.eventsMap[eventName] && infestor.each(this.eventsMap[eventName], function (name, handle) {

			if (eventHandle === handle) {

				delete this.eventsMap[eventName][name];
				return false;
			}

		}, this);

	},
	
	// 触发侦听事件
	emit : function (eventName, eventArgs, scope) {

		if (!this.eventsMap || !this.eventsMap[eventName])
			return;

		scope = scope || this;

		infestor.each(this.eventsMap[eventName], function () {

			if (!infestor.isFunction(this))
				return true;

			this.apply(this.$scope || scope, (infestor.isArguments(eventArgs) || infestor.isArray(eventArgs)) ? eventArgs : [eventArgs]);

		});
	},

	// 添加侦听事件
	on : function () {

		this.addEventListener.apply(this, arguments);
	},

	// 移除侦听事件
	un : function () {

		this.removeEventListener.apply(this, arguments);
	},
	
	fire : function(){
	
		this.emit.apply(this,arguments);
	
	},

	// 长连接另一个对象 侦听它的某个行为
	// @action 侦听动作
	// @target 侦听目标对象
	// @targetPortMethod 侦听目标的接口方法名 默认为null(可选)
	// @interval 侦听间隔
	// @listenerName 侦听器名称 用于关闭和设置侦听器 默认为侦听任务id (可选)
	// #return 返回侦听任务id
	listen : function(action,target,targetPortMethod,interval,listenerName){
	
		var taskId;
	
		if(!action || !target)
			return false;
		
		targetPortMethod = infestor.isFunction(targetPortMethod) ? targetPortMethod 
			: (infestor.isFunction(target[targetPortMethod]) ? target[targetPortMethod] : null);

		this.$listenerMap = this.$listenerMap || {};
		
		this.$listenerMap[listenerName] && this.stopListen(listenerName);
			
		taskId = infestor.task(function(){
		
			action.call(this,targetPortMethod && targetPortMethod.call(target),target,this);	
		
		},interval || 1000,this);
		
		this.$listenerMap[listenerName || taskId] = taskId;
		
		return taskId;
	
	},
	
	// 移除侦听某个任务 无参数则移除所有侦听任务
	stopListen:function(listenerName){
	
		if(!this.$listenerMap)
			return false;
	
		if(arguments.length < 1)
			return this.each(this.$listenerMap,function(name,taskId){
			
				this.stopListen(name);
				
			},this) && (this.listenerMap = null),true;
		
		return infestor.stopTask(this.$listenerMap[listenerName]);
		
	},
	
	destroy : function () {

		this.stopListen();
		this.eventsMap = null;
	}

});
