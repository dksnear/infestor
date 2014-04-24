
// 基本表单类

infestor.define('infestor.Form', {

	alias : 'form',

	extend : 'infestor.Panel',

	uses : ['infestor.request', 'infestor.field.Field'],

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-form',
	
	// 字段深度
	level:0,
	
	fieldsMap:null,
	
	itemsOpts : {

		alias : 'field'

	},
	
	init:function(){
	
		this.callPrent();
		
		this.eachFields();
	
	},
	
	initEvents:function(){
	
		this.dataSet && this.dataSet.on('load',function(){
		
		
		
		});
	
	},
	
	loadField:function(){
	
	
	},
	
	setField:function(data){
	
	
	},
	
	getField:function(fieldName){
	
		
	
	},
	
	removeField:function(fieldName){
	
	
	},
	
	// 扫描字段
	eachFields:function(){
	
		this.fieldsMap = this.fieldsMap || {};
		
	
	},

	submit : function () {}

});
