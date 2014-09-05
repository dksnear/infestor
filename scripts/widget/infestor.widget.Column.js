infestor.define('infestor.widget.Column',{


	alias : 'column',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget.Grid',
	
	cssClsColumnHeadCell : infestor.boe({ 
	
		 ie7minus: 'infestor-grid-column-head-cell-ie7minus',
		 otherwise: 'infestor-grid-column-head-cell'
	}),
	
	// { name : , title : , type : , hidden: , sort: , width: ,template : string|fn, }
	columnOptions: null,
	
	columnCells : null,
	
	columnHead : null,
	
	createColumnHead : function(headCt){
	
		return this.columnHead = infestor.create('infestor.Element',{
		
			cssClsElement:this.cssClsColumnHeadCell,
			width : this.columnOptions.width || 60,
			text : this.columnOptions.title || '',
			hidden : this.columnOptions.hidden
		
		}).renderTo(headCt);
	
	},
	
	// 
	createColumnCell : function(cellData,rowData,cellsCt,row){
	
		this.columnCells = this.columnCells || {};
		
		return this.columnCells[row.id] = infestor.create('infestor.Element',{
		
			tagName:'td',	
			width : this.columnOptions.width || 60,
			text : cellData,
			hidden : this.columnOptions.hidden//,
			// items :{
			
				// alias:'element',
				// text:cellData
			
			// }
			
		}).renderTo(cellsCt);
	
		
	},
	
	clearColumnCell : function(){
	
	
	},
	
	hide : function(){
	
	
	},
	
	
	show : function(){
	
	
	},
	
	destroy : function(){
	
	
	
	}
	

});