

//基本对象类

infestor.define('infestor.Object', {

	alias : 'object',

	extend : 'infestor.Event',

	constructor : function (options) {

		infestor.append(this, options);

		this.events && this.on(this.events);

		this.init && this.init();

	},

	// 调用父类同名方法
	callParent : function () {

		var method = this.callParent.caller,
		ownerCls = method.$ownerCls,
		parentClass = !!ownerCls ? method.$ownerCls.$superClass : undefined,
		methodName = method.$methodName;

		return parentClass && parentClass[methodName].apply(this, arguments.length > 0 ? arguments : method.arguments);
	},

	getId : function () {

		return infestor.getId();
	},

	// 注册延时执行方法
	delayReg : function (fn, args, scope) {

		infestor.mgr.delayReg(infestor.mgr.loadedMap[this.$clsName], fn, args || [], scope || this);

	},

	printClsName : function () {

		//for test
		alert(this.$clsName);
	}

});
