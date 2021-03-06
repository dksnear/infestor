infestor.define('infestor.grid.Column',{


	alias : 'column',

	extend : 'infestor.Element',

	cssUses : 'infestor.grid',
	
	cssClsColumnHeadCell :'infestor-grid-column-head-cell',
	
	cssClsColumnInnerCell : 'infestor-grid-column-inner-cell',
	
	// { name : , title : , type : , hidden: , sort: , width: ,template : string|fn, }
	columnOptions: null,
	
	columnCells : null,
	
	columnHead : null,
	
	// 列表头单元格创建接口
	createColumnHead : function(headCt){
			
		return this.columnHead = headCt.addItem({
			
			name : this.columnOptions.name,
			cssClsElement: this.cssClsColumnHeadCell,
			width : this.columnOptions.width || 60,
			text : this.columnOptions.title || '',
			hidden : this.columnOptions.hidden,
			css:{
			
				textAlign:this.columnOptions.textAlign || 'center'
			}

		});
	
	},
	
	// 列单元格创建接口
	createColumnCell : function(cellData,rowData,cellsCt,row){
	
		this.columnCells = this.columnCells || {};
		
		return this.columnCells[row.id] = infestor.create('infestor.Element',{
		
			tagName:'td',	
			hidden : this.columnOptions.hidden,
			items :{
			
				cssClsElement : this.cssClsColumnInnerCell,
				name : 'inner-cell',
				text : cellData,
				width : this.columnOptions.width || 60,
				css:{
			
					textAlign:this.columnOptions.textAlign || 'center'
				}
			
			}
			
		}).renderTo(cellsCt);
	
		
	},
	
	clearColumnCell : function(){
	
	
	},
	
	hide : function(){
	
	
	},
	
	
	show : function(){
	
	
	},
	
	destroy : function(){
	
		this.callParent();
	
	}
	

});