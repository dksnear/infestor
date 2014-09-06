infestor.define('infestor.tree.Tree',{

	alias : 'tree',
	
	extend : 'infestor.grid.Grid',
	
	uses : ['infestor.tree.DataSet','infestor.tree.TreeColumn'],
	
	dataSetClsName : 'infestor.tree.DataSet',
	
	// 表格树 
	multiColumn:true,
	
	addRow : function(rowData,id){
	
		id = id || this.rowId ++;
		
		this.gridRows = this.gridRows || {};
		
		if(this.gridRows[id]) return this;
		
		this.gridRows[id] = {};
		this.gridRows[id].data = rowData;
		this.gridRows[id].container = infestor.create('infestor.Element',{ cssClsElement:this.cssClsGridBodyRow ,tagName:'tr'}).renderTo(this.gridBodyContainer);
		this.gridRows[id].cells = {};
		
		infestor.each(this.gridColumns,function(name,column){
		
			this.gridRows[id].cells[name] = column.createColumnCell(rowData[name],rowData,this.gridRows[id].container,this.gridRows[id]);
		
		},this);
		
		return this;
	
	}
	
});