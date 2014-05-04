
// 基本表单类

infestor.define('infestor.Form', {

	alias : 'form',

	extend : 'infestor.Panel',

	uses : ['infestor.request', 'infestor.field.Field'],

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-form',
	
	position:'relative',

	// 字段深度
	level : 1,
	
	checked : false,

	fieldsMap : null,

	itemsOpts : {

		alias : 'field'

	},
	
	dataConfig:{
	
		submitConfig:{
		
			mask:{
				
				show:function(){
				
					this.parent.parent.showMask();
				
				},
				hide:function(){
				
					this.parent.parent.hideMask();
				
				}
			
			},
			indicator:{
			
				show:function(){
				
					var scope = this.parent.parent;
				
					scope.elementIndicator = scope.elementIndicator || this.createIndicator({
					
						position:'absolute',
						'background-color':'green'
					
					}).appendTo(scope.getElement());

					scope.elementIndicator.show();
				
				},
				hide:function(){
				
					var scope = this.parent.parent;
					
					scope.elementIndicator && scope.elementIndicator.hide();
				
				},
				change:function(value){
				
					var scope = this.parent.parent;
					
					scope.elementIndicator && scope.elementIndicator.css('width', value + '%');
					
				}
			}
		
		},
		
		loadConfig:{
		
			mask:{
				
				show:function(){
				
					this.parent.parent.showMask();
				
				},
				hide:function(){
				
					this.parent.parent.hideMask();
				
				}
			
			},
			indicator:{
			
				show:function(){
				
					var scope = this.parent.parent;
				
					scope.elementIndicator = scope.elementIndicator || this.createIndicator({
					
						position:absolute
					
					}).appendTo(scope.getElement());

					scope.elementIndicator.show();
				
				},
				hide:function(){
				
					var scope = this.parent.parent;
					
					scope.elementIndicator && scope.elementIndicator.hide();
				
				},
				change:function(value){
				
					var scope = this.parent.parent;
					
					scope.elementIndicator && scope.elementIndicator.css('width', value + '%');
					
				}
			}
				
		}
	
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
	
	getData:function(name){
	
		var data = null,field;
		
		if(arguments.length<1)
			return infestor.each(this.fieldsMap,function(fieldName,field){
			
				data = data || [];
				data[fieldName] = field.getValue();
			
			}) && (data=infestor.append({},this.dataSet.next(),data)) && this.dataSet.setData(data) && this.dataSet.next();
		
		data = this.dataSet.next() || {};
		
		field = this.getField(name);
		
		return field && (data[field.fieldName] = field.getValue()) && this.dataSet.setData(data) && data[name];
	
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
		
		return this.checked;
	
	},

	submit : function (opts,rewrite) {
	
		if(!check())
			return false;
			
		// 同步数据集数据
		this.getData();
		
		return this.dataSet.submit(opts,rewrite),true;
	
	}

});
