infestor.define('infestor.tree.TreeColumn',{


	alias : 'treecolumn',

	extend : 'infestor.grid.Column',
	
	uses : 'infestor.tree.TreeNode',

	cssUses : ['infestor.Grid'],
	

	// 列单元格创建接口
	createColumnCell : function(cellData,rowData,cellsCt,row){
	
		this.columnCells = this.columnCells || {};
		
		return this.columnCells[row.id] = infestor.create('infestor.tree.TreeNode',{
	
			tagName:'td',	
			width : this.columnOptions.width || 60,
			text : cellData && cellData[this.columnOptions.name],// cellData.$text,
			nodeDepth : row.depth,
			hidden : this.columnOptions.hidden
			
		}).renderTo(cellsCt);
			
	}
	
});