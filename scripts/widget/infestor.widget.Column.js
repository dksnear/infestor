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
	addCell : function(opts){
	
	
		opts = infestor.append({},this.columnOptions,opts);
		
	
	},
	
	removeCell : function(){
	
	
	}
	
	
	
	
});