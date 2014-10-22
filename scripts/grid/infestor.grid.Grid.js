
infestor.define('infestor.grid.Grid',{


	alias : 'grid',

	extend : 'infestor.Element',

	uses : ['infestor.grid.Column'],
	
	cssUses : 'infestor.Grid',

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
		this.createGridBody();
	
	},
	
	
	createGridHead : function(){
	
		this.gridHead = this.gridHead || infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridHead }).renderTo(this);
		this.createColumns();
	
	},
	
	
	createGridBody : function(){
	
		this.gridBody = this.gridBody || infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridBody }).renderTo(this);
		this.gridBodyContainer = this.gridBodyContainer || infestor.create('infestor.Element',{ tagName:'table',cssClsElement:this.cssClsGridBodyContainer }).renderTo(this.gridBody);
	
	},
	
	createColumns : function(){
	
		this.gridColumns = this.gridColumns || {};
	
		infestor.each(this.columnsOptions,function(idx,options){
		
			this.gridColumns[options.name] = infestor.create(options.type || 'infestor.grid.Column',{ columnOptions : options });
			
			this.gridColumns[options.name].createColumnHead(this.gridHead);
		
		},this);
	
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
	
	
	}
		
});