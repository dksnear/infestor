
// 基本表单类

infestor.define('infestor.Form', {

	alias : 'form',

	extend : 'infestor.Element',

	uses : ['infestor.request', 'infestor.field.Field'],

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-form',
	
	layout:'block',

	itemsOpts : {

		alias : 'field'

	},

	submit : function () {}

});
