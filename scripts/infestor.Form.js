
// 基本表单类

infestor.define('infestor.Form', {

	alias : 'form',

	extend : 'infestor.Panel',

	uses : ['infestor.request', 'infestor.field.Field'],

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-form',
	
	itemsOpts : {

		alias : 'field'

	},

	submit : function () {}

});
