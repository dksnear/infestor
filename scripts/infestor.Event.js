
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

		return parentClass && parentClass[methodName].apply(this, arguments.length > 0 ? arguments : method.arguments);
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
	
	fire:function(){
	
		this.emit.apply(this,arguments);
	
	},

	destroy : function () {

		this.eventsMap = null;
	}

});
