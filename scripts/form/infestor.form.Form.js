
// 基本表单类

infestor.define('infestor.form.Form', {

	alias : 'form',

	extend : 'infestor.Panel',

	uses : [
		'infestor.Indicator',
		'infestor.request', 
		'infestor.form.field.Field',
		'infestor.form.field.Captcha',
		'infestor.form.field.CandidateCaptcha',
		'infestor.form.field.Combo'
	],

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
	
	indicator:true,
	
	init : function () {

		this.callParent();

		this.initIndicator();
		
		this.feed();

	},
	
	initIndicator : function(){
	
		if(!this.dataSet || !this.indicator) return;
		
		var me = this;
	
		this.dataSet.loadIndicator = infestor.create('infestor.Indicator',{
		
			mask : true,
		
			showMask : function(){
				
				me.showMask();
				
			},
			
			hideMask : function(){
			
				me.hideMask();
			
			},
		
			showIndicator:function(){
			
				var scope = me;
			
				scope.elementLoadIndicator = scope.elementLoadIndicator || this.createIndicator({
					
						position:'absolute'
					
				}).appendTo(scope.getElement());

				scope.elementLoadIndicator.show();
			
			},
			hideIndicator:function(){
			
				var scope = me;
				
				scope.elementLoadIndicator && scope.elementLoadIndicator.hide();
			
			},
			changeIndicator:function(value){
			
				var scope = me;
				
				scope.elementLoadIndicator && scope.elementLoadIndicator.css('width', value + '%');
				
			}
		
		});
		
		this.dataSet.submitIndicator = infestor.create('infestor.Indicator',{
		
			showMask : function(){
				
				me.showMask();
				
			},
			
			hideMask : function(){
			
				me.hideMask();
			
			},
		
			showIndicator:function(){
			
				var scope = me;
			
				scope.elementSubmitIndicator = scope.elementSubmitIndicator || this.createIndicator({
				
					position:'absolute',
					bottom:0,
					top:'auto',
					'background-color':'green'
				
				}).appendTo(scope.getElement());

				scope.elementSubmitIndicator.show();
			
			},
			hideIndicator:function(){
			
				var scope = me;
				
				scope.elementSubmitIndicator && scope.elementSubmitIndicator.hide();
			
			},
			changeIndicator:function(value){
			
				var scope = me;
				
				scope.elementSubmitIndicator && scope.elementSubmitIndicator.css('width', value + '%');
				
			}
		
		});
	
	},

	initEvents : function () {

		this.dataSet && this.dataSet.on('load', function () {
		
			this.setField(this.dataSet.next());
		
		},this);
		
		this.dataSet && this.dataSet.on('beforeLoad', function () {
		
			this.setFieldReadOnly(true);
		
		},this);
		
		this.dataSet && this.dataSet.on('loadComplete', function () {
		
			this.setFieldReadOnly(false);
		
		},this);
		
		this.dataSet && this.dataSet.on('beforeSubmit', function () {
		
			this.setFieldReadOnly(true);
		
		},this);
		
		this.dataSet && this.dataSet.on('submitComplete', function () {
		
			this.setFieldReadOnly(false);
		
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
	
		if(infestor.isUndefined(fieldName))
			return this.fieldsMap;
	
		return this.fieldsMap && this.fieldsMap[fieldName];
	
	},
	
	callFieldMethod:function(fieldName,methodName,args){
	
		var field = this.getField(fieldName);
		
		if(!field) return this;
		
		if(infestor.isRawObject(field))
			return infestor.each(field,function(){
				 this[methodName] && this[methodName].apply(this,args||[]);
			}),this;
	
		return field[methodName] && field[methodName].apply(field,args||[]);
	
	},

	hideField:function(fieldName){
	
		return this.callFieldMethod(fieldName,'hide');

	},
	
	showField:function(fieldName){
	
		return this.callFieldMethod(fieldName,'show');
	
	},
	
	disableField:function(fieldName){
	
		return this.callFieldMethod(fieldName,'disable');
		
	},
	
	enableField:function(fieldName){
	
		return this.callFieldMethod(fieldName,'enable');
	
	},
	
	setFieldReadOnly:function(fieldName,readOnly){
	
		return this.callFieldMethod(fieldName,'setReadOnly',[readOnly]);
	
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

			if (item instanceof infestor.form.field.Field) {

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
		
			if(!this.checked){
			
				checked = false;
				//this.emit('focus');
				this.focus();
				return false;
			}
		
		});
			
		this.checked = checked;
		
		return this.checked;
	
	},

	submit : function (opts,rewrite) {
	
		if(!this.check())
			return false;
			
		// 同步数据集数据
		this.getData();
		
		return this.dataSet.submit(opts,rewrite),true;
	
	}

});
