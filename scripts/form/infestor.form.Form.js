
// 基本表单类

infestor.define('infestor.form.Form', {

	alias : 'form',

	extend : 'infestor.Panel',

	uses : [
		'infestor.Indicator',
		'infestor.Request', 
		'infestor.form.DataSet',
		'infestor.form.field.Field',
		'infestor.form.field.Captcha',
		'infestor.form.field.CandidateCaptcha',
		'infestor.form.field.Combo',
		'infestor.form.field.Checkbox'
	],

	cssUses : ['infestor.form'],

	cssClsElement : 'infestor-form',
	
	dataSetClsName : 'infestor.form.DataSet',
	
	position:'relative',

	// 字段深度
	level : 1,
	
	fieldsMap : null,
	
	formName : null,
	
	autoLoad : false, 
	
	// 跳过字段验证
	skipCheck : false,

	itemsOpts : {

		alias : 'field'

	},
	
	indicator:true,
	
	dataConfig:true,
	
	init : function () {

		this.callParent();

		this.initIndicator();
		
		this.feed();
		
		this.dataSet && (this.dataSet.submitParamName = this.formName);

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
		
			this.setField(this.dataSet.getData());
		
		},this);
		
		this.dataSet && this.dataSet.on('beforeLoad', function () {
		
			this.setFieldReadOnly(true);
		
		},this);
		
		this.dataSet && this.dataSet.on('loadComplete', function () {
		
			this.setFieldReadOnly(false);
		
		},this);
		
		this.dataSet && this.dataSet.on('beforeSubmit', function () {
		
			this.lockSubmit = true;
			this.setFieldReadOnly(true);

		
		},this);
		
		this.dataSet && this.dataSet.on('submitComplete', function () {
		
			this.setFieldReadOnly(false);
			this.lockSubmit = false;
		
		},this);
		

	},
	
	getData:function(name){
	
		var data = {},field;
		
		if(arguments.length<1)
			return infestor.each(this.fieldsMap,function(fieldName,field){
			
				if(!field.allowSubmit)
					return true;
					
				data[fieldName] = field.getValue();
			
			}) && this.dataSet.setData(data) && this.dataSet.getData();
			
		field = this.getField(name);
		
		if(!field.allowSubmit)
			return field.getValue();
		
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
	
		if(!fieldName)
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
	
	blurField:function(fieldName){
	
		return this.callFieldMethod(fieldName,'blur');
	
	},
	
	setFieldReadOnly:function(fieldName,readOnly){
	
		return this.callFieldMethod(fieldName,'setReadOnly',[readOnly]);
	
	},
	
	clearField:function(fieldName){
		
		if(!fieldName)
			return infestor.each(this.fieldsMap,function(name,field){ this.clearField(fieldName);  },this),true;
		
		return this.setField(fieldName,'');
	},
	
	// 抽取有效字段
	feed : function(){
	
		return this.eachFields(this,function (fieldName, field, level) {

			this.fieldsMap = this.fieldsMap || {};
			this.fieldsMap[fieldName] = field;
			field.formLevel = level;
			field.form = this;

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
		
		if(this.skipCheck) return checked;
		
		this.fieldsMap && infestor.each(this.fieldsMap,function(){
		
			if(!this.checked){
			
				checked = false;
				this.focus();
				return false;
			}
		
		});
			
		return checked;
		
	},

	submit : function (opts,rewrite) {
	
		if(this.lockSubmit || !this.check())
			return false;
			
		// 同步数据集数据
		this.getData();
		
		return this.dataSet.submit(opts,rewrite),true;
	
	},
	
	hide : function(){
	
		this.blurField();
	
		return this.callParent();
	
	},
	
	destroy:function(){
	
		this.elementLoadIndicator = this.elementLoadIndicator && this.elementLoadIndicator.destroy();
		this.elementSubmitIndicator = this.elementSubmitIndicator && this.elementSubmitIndicator.destroy();
		
		this.callParent();
		
		return null;
	
	}
	
});
