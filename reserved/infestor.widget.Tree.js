infestor.define('infestor.widget.Tree',{

	alias : 'tree',
	
	extend : 'infestor.widget.Grid',
	
	uses : ['infestor.widget.TreeColumn'],
	
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