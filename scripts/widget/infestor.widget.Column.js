infestor.define('infestor.widget.Column',{


	alias : 'column',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget.Grid',

	cssClsElement : 'infestor-grid',
	
	// { name : , title : , type : , hidden: , sort ,template : string|fn, }
	columnOptions: null,
	
	columnCells : null
	
	columnHead : null,
	
	// 
	addCell : function(cellData,rowData,cellCt,row){
	
		return columnCells[row.id] = infestor.create('infestor.Element',{ text : cellData.text}).renderTo(cellCt);
		
	},
	
	clearCell : function(){
	
	
	}
	

});