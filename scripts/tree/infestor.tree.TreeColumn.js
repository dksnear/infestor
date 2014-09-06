infestor.define('infestor.tree.TreeColumn',{


	alias : 'treeColumn',

	extend : 'infestor.grid.Column',
	
	uses : 'infestor.tree.TreeNode',

	cssUses : ['infestor.grid','infestor.tree'],
	
	

	
	// 列单元格创建接口
	createColumnCell : function(cellData,rowData,cellsCt,row){
	
		this.columnCells = this.columnCells || {};
		
		return this.columnCells[row.id] = infestor.create('infestor.TreeNode',{
		
			tagName:'td',	
			width : this.columnOptions.width || 60,
			text : cellData.text,
			nodeDepth : cellData.depth,
			hidden : this.columnOptions.hidden
			
		}).renderTo(cellsCt);
			
	}
	
});