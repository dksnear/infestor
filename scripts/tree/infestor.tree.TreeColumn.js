infestor.define('infestor.tree.TreeColumn',{


	alias : 'treecolumn',

	extend : 'infestor.grid.Column',
	
	uses : 'infestor.tree.TreeNode',

	cssUses : ['infestor.Grid'],
	

	// 列单元格创建接口
	createColumnCell : function(cellData,rowData,cellsCt,row,floatSpace){
	
		this.columnCells = this.columnCells || {};
		
		return this.columnCells[row.id] = infestor.create('infestor.Element',{
	
			tagName:'td',	
			hidden : this.columnOptions.hidden,
			items : {
				
				alias : 'treenode',
				name : 'inner-cell',
				width : this.columnOptions.width || 60,
				text : cellData && cellData[this.columnOptions.name] || rowData.$text,
				nodeDepth : row.depth,
				//hidden : this.columnOptions.hidden,
				nodeFloatSpace : floatSpace || 0
			}
				
		}).renderTo(cellsCt);
			
	}
	
});