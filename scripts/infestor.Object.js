

//基本对象类

infestor.define('infestor.Object', {

	alias : 'object',

	extend : 'infestor.Event',

	constructor : function (options) {

		infestor.append(this, options);

		this.events && this.on(this.events);

		this.init && this.init();

	},

	getId : function () {

		return infestor.getId();
	},

	// 注册延时执行方法
	delayReg : function (fn, args, scope) {

		infestor.mgr.delayReg(infestor.mgr.loadedMap[this.$clsName], fn, args || [], scope || this);

	}

});
