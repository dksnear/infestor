
infestor.define('infestor.widget.Grid',{


	alias : 'grid',

	extend : 'infestor.Element',

	uses : ['infestor.widget.Column'],
	
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

	rowId : 1;
		
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
	
		this.gridHead = this.gridHead || infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridHead }).renderTo(this);
		this.createColumns();
	
	},
	
	
	createGridBody : function(){
	
		this.gridBody = this.gridBody || infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridBody }).renderTo(this);
		this.gridBodyContainer = this.gridBodyContainer || infestor.create('infestor.Element',{ tagName:'table' }).renderTo(this.gridBody);
	
	},
	
	createColumns : function(){
	
	
	
	},
	
	addRow : function(rowData,id){
	
		id = id || this.rowId ++;
		
		if(this.gridRows[id]) return this;
		
		this.gridRows[id] = {};
		this.gridRows[id].data = rowData;
		this.gridRows[id].element = infestor.create('infestor.Element',{tagName:'tr'}).renderTo(this.gridBodyContainer);
		this.gridRows[id].items = {};
		
		infestor.each(this.gridColumns,function(name,column){
		
			this.gridRows[id].items[name] = this.gridRows[id].items[name] || {};
			this.gridRows[id].items[name].element = infestor.create('infestor.Element',{tagName:'td'}).renderTo(this.gridRows[id].element);
			this.gridRows[id].items[name].cell = column.addCell(rowData[name],rowData,this.gridRows[id].items[name].element,this.gridRows[id]);
		
		
		},this);
		
		return this;
	
	},
	
	removeRow : function(id){
	
		if(!id)
			return infestor.each(this.gridRows,function(id,row){
			
				this.removeRow(id);
			
			},this),this;
	
		if(!this.gridRows[id]) return this;
		
		infestor.each(this.gridRows[id].items,function(name,item){
		
			item.cell.destroy();
			item.element.destroy();
		
		});
		
		this.gridRows[id].element.destroy();
		
		delete this.gridRows[id];
		
		return this;
	
	},
	
	showRow : function() {
	
	
	
	},
	
	hideRow : function (){
	
	
	},
	
	destroy:function(){
	
	
	}
		
});