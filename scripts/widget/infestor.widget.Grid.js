
infestor.define('infestor.widget.Grid',{


	alias : 'grid',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget.Grid',

	statics : {
	
		// 列类型映射 如果需要使用列类型简称 在此处注册
		columnTypeMap:{
		
			tree : 'infestor.widget.TreeColumn'
		
		}
	
	},

	cssClsElement : 'infestor-grid',
	
	cssClsGridHead : 'infestor-grid-head',
	
	cssClsGridBody : 'infestor-grid-body',
	
	columnsConfig : null,
	
	gridHead : null,
	
	gridBody : null,
	
	gridRows : null,
	
	gridColumns : null,
		
	events : {
	
		// @params item,target,eventArgs 
		// @this chainMenu
		itemClick:null
	
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
	
	initElement : function(){
	

		this.callParent();
		
		this.createGridHead();
		this.createGridBody();
	
	},
	
	
	createGridHead : function(){
	
		
	
	},
	
	
	createGridBody : function(){
	
	
	
	},
	
	addRow : function(){
	
	
	
	},
	
	removeRow : function(){
	
	
	
	},
	
	showRow : function() {
	
	
	
	},
	
	hideRow : function (){
	
	
	}
	
	
});