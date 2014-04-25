
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
	
	dataConfig:{
	
		submitConfig:{},
		loadConfig:{}
	
	},

	init : function () {

		this.callParent();

		this.feed();

	},

	initEvents : function () {

		this.dataSet && this.dataSet.on('load', function () {
		
			this.setField(this.dataSet.next());
		
		},this);

	},
	
	addField :function(opts,feed){
	
		if(!opts) return null;
		
		var item = this.addItem(opts);
		
		field.formLevel = 1;
		
		if(!feed)
			return (this.fieldsMap[item.fieldName] = item);
		
		return this.feed(),item;
	
	},
	
	removeField : function (fieldName) {
	
		var field = this.getField(fieldName);
		
		if(!field) return this;
		
		if(infestor.isRawObject(field))
			return infestor.each(field,function(fieldName,field){
			
				delete this.fieldsMap[fieldName];
				this.removeItem(field.name);
			
			},this),this;
		
		return  delete this.fieldsMap[fieldName] && this.removeItem(field.name);
		
	
	},

	setField : function (fieldName,value) {
	
		if(!this.fieldsMap) 
			return this;
		
		if(infestor.isRawObject(fieldName))	
			return infestor.each(fieldName,function(name,value){
			
				this.fieldsMap[name] && this.fieldsMap[name].setValue(value);
			
			},this),this;
		
		this.fieldsMap[name] && this.fieldsMap[name].setValue(value);
		
		return this;
	
	
	},

	getField : function (fieldName) {
	
		if(arguments.length<1)
			return this.fieldsMap;
	
		return this.fieldsMap && this.fieldsMap[fieldName];
	
	},

	hideField:function(fieldName){
	
		var field = this.getField.apply(this,arguments);
		
		if(!field) return this;
		
		if(infestor.isRawObject(field))
			return infestor.each(field,function(){
				this.hide();
			}),this;
	
		return field.hide();
	},
	
	showField:function(fieldName){
	
		var field = this.getField.apply(this,arguments);
		
		if(!field) return this;
		
		if(infestor.isRawObject(field))
			return infestor.each(field,function(){
				this.show();
			}),this;
	
		return field.show();
	
	},
	
	// 抽取有效字段
	feed : function(){
	
		return this.eachFields(this,function (fieldName, field, level) {

			this.fieldsMap = this.fieldsMap || {};
			this.fieldsMap[fieldName] = field;
			field.formLevel = level;

		}),this;
	},
	
	// 扫描字段
	// @target 扫描对象
	// @func: (function) @params (fieldName,field,level(当前扫描深度)) @scope scope @return false(停止扫描)|true
	// @level 当前扫描深度
	// @scope 作用域
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
