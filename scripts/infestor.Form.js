
// 基本表单类

infestor.define('infestor.Form', {

	alias : 'form',

	extend : 'infestor.Panel',

	uses : ['infestor.request', 'infestor.field.Field'],

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-form',

	// 字段深度
	level : 1,
	
	checked : false,

	fieldsMap : null,

	itemsOpts : {

		alias : 'field'

	},

	init : function () {

		this.callParent();

		this.eachFields(this,function (fieldName, field, level) {

			this.fieldsMap = this.fieldsMap || {};
			this.fieldsMap[fieldName] = field;
			field.formLevel = level;

		});

	},

	initEvents : function () {

		this.dataSet && this.dataSet.on('load', function () {});

	},

	loadField : function () {},

	setField : function (fieldName,value) {
	
		
		this.getField(fieldName)
	
	
	},

	getField : function (fieldName) {
	
		if(arguments.length<1)
			return this.fieldsMap;
	
		return this.fieldsMap && this.fieldsMap[fieldName];
	
	},

	removeField : function (fieldName) {},

	hideField:function(fieldName){},
	
	showField:function(fieldName){},
	
	// 扫描字段
	// func: @params fieldName,field,level(扫描深度) @scope scope @return false(停止扫描)|true
	eachFields : function (target, func, level, scope) {

		level = level || 1;
		
		this.level = level;

		target.hasItem() && infestor.each(target.itemsMap, function (itemName, item) {

			var goAhead = true;

			if (item instanceof infestor.field.Field) {

				goAhead = func.call(scope || this, item.fieldName, item, level);
				if (infestor.isBoolean(goAhead) && !goAhead)
					return false;
				return true;
			}

			if (item instanceof infestor.Element)
				this.eachFields.call(this, item, func, level + 1, scope);

		}, this);

	},
	
	check: function(){
	
		var checked = true;
		
		this.fieldsMap && infestor.each(this.fieldsMap,function(){
		
			if(!this.checked)
				return (checked = false);
		
		});
			
		this.checked = checked;
		
		return this.checked
	
	},

	submit : function () {
	
		
	
	}

});
