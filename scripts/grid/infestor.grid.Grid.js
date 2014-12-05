
infestor.define('infestor.grid.Grid',{


	alias : 'grid',

	extend : 'infestor.Panel',

	uses : ['infestor.grid.Column'],
	
	cssUses : 'infestor.Grid',
	
	statics : {
	
		// 通过类型或别名创建实例
		createColumn : function (opts) {

			!opts.type && !opts.alias && (opts.type = 'infestor.grid.Column');
		
			if (opts && opts.type)
				return infestor.create(opts.type, { columnOptions : opts });
				
			if (opts && opts.alias)
				return infestor.createByAlias(opts.alias,{ columnOptions : opts });

		}
	
	},

	cssClsElement : 'infestor-grid',
	
	cssClsGridHead : 'infestor-grid-head',
	
	cssClsGridBody : 'infestor-grid-body',
	
	cssClsGridBodyContainer : 'infestor-grid-body-container',
	
	cssClsGridBodyRow : 'infestor-grid-body-row',
	
	columnsOptions : null,
	
	gridHead : null,
	
	gridBody : null,
	
	gridRows : null,
	
	gridColumns : null,
	
	autoLoad : true,

	rowId : 1,
		
	events : {
	
		// @params item,target,eventArgs 
		// @this chainMenu
		itemClick:null
	
	},
	
	initEvents : function () {

		this.dataSet && this.dataSet.on('load', function (data) {
		
			infestor.each(data,function(idx,rowData){
			
				this.addRow(rowData);
			
			},this);
		
		},this);
		

	},
	
	initElement : function(){
	

		this.callParent();
		
		this.createGridHead();
		this.createColumns();
		this.createGridBody();
		
	
	},
	
	
	createGridHead : function(){
	
		this.gridHead = this.gridHead || infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridHead }).renderTo(this);
			
	},
	
	
	createGridBody : function(){
	
		this.gridBody = this.gridBody || infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridBody }).renderTo(this);
		this.gridBodyContainer = this.gridBodyContainer || infestor.create('infestor.Element',{ tagName:'table',cssClsElement:this.cssClsGridBodyContainer }).renderTo(this.gridBody);
	
	},
	
	createColumns : function(){
	
		this.gridColumns = this.gridColumns || {};
	
		infestor.each(this.columnsOptions,function(idx,options){
		
			this.gridColumns[options.name] = infestor.grid.Grid.createColumn(options);
			
			this.gridColumns[options.name].createColumnHead(this.gridHead);
		
		},this);
	
	},
	
	getRow : function(id){
	
		if(arguments.length < 1)
			return this.gridRows;
	
		return this.gridRows && this.gridRows[id];
	
	},
	
	addRow : function(rowData,id){
	
		id = id || this.rowId ++;
		
		this.gridRows = this.gridRows || {};
		
		if(this.gridRows[id]) return this;
		
		this.gridRows[id] = {};
		this.gridRows[id].id = id;
		this.gridRows[id].data = rowData;
		this.gridRows[id].container = infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridBodyRow ,tagName:'tr'}).renderTo(this.gridBodyContainer);
		this.gridRows[id].cells = {};
		
		infestor.each(this.gridColumns,function(name,column){
		
			this.gridRows[id].cells[name] = column.createColumnCell(rowData[name],rowData,this.gridRows[id].container,this.gridRows[id]);
		
		},this);
		
		return this;
	
	},
	
	removeRow : function(id){
	
		if(!id)
			return infestor.each(this.gridRows,function(id,row){
			
				this.removeRow(id);
			
			},this),this;
	
		if(!this.gridRows[id]) return this;
		
		infestor.each(this.gridRows[id].cells,function(name,cell){
		
			cell.destroy();
			
		});
		
		this.gridRows[id].container.destroy();
		
		delete this.gridRows[id];
		
		return this;
	
	},
	
	showRow : function() {
	
	
	
	},
	
	hideRow : function (){
	
	
	},
	
	destroy:function(){
	
		this.removeRow();
		this.callParent();
	}
		
});