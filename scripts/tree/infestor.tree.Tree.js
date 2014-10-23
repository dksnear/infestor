infestor.define('infestor.tree.Tree',{

	alias : 'tree',
	
	extend : 'infestor.grid.Grid',
	
	uses : ['infestor.tree.DataSet','infestor.tree.TreeColumn','infestor.tree.TreeNode'],
	
	dataSetClsName : 'infestor.tree.DataSet',
	
	// 表格树 
	multiColumn : true,
	
	// 树结构列
	treeColumn : null,
	
	// rewrite
	
	initEvents : function () {

		this.dataSet && this.dataSet.on('load', function (data) {
		
			this.rootPId = this.dataSet.rootPId;
			
			!this.rootRow ? this.createTree(this.dataSet.map(data)) : this.addRow(this.dataSet.map(data));
		
		},this);
		
		this.delegate(this,'click',true,function(inst,e){
		
		
			if(inst.element.hasClass(infestor.tree.TreeNode.prototype.cssClsNodeSwitchCell)){
				
				 if(inst.parent.isExpand)
					inst.parent.nodeCollapse();
				 else inst.parent.nodeExpand();
				
			}
		
		},this);
		
	},
	
	
	createColumns : function(){
	
		this.gridColumns = this.gridColumns || {};
	
		infestor.each(this.columnsOptions,function(idx,options){
		
			if(options.type == 'infestor.tree.TreeColumn')
				return this.treeColumn = infestor.create(options.type,{ columnOptions : options }),true;
		
			this.gridColumns[options.name] = infestor.create(options.type || 'infestor.grid.Column',{ columnOptions : options });
			
		
		},this);
		
		this.treeColumn && this.treeColumn.createColumnHead(this.gridHead);
		infestor.each(this.gridColumns,function(idx,column){  column.createColumnHead(this.gridHead); },this);
	
	},
	
	createTree : function(data){
	
		var data = data && infestor.map(data,function(){ return this; }),
			getChildNode = function(pId){
		
				var node,i=0,len = data.length;
			
				for(;i<len;i++){
				
					if(data[i].$parentNodeId === pId)
						return node = data.splice(i,1)[0] || false;
				}
				
				return false;
			
			};
		
		this.gridRows = [];
		
		this.rootRow = this.addRow({
		
			$nodeId:this.rootPId,
			$parentNodeId:null
		});
	
		(function(pId){
		
			var child,row;
		
			while((child = getChildNode(pId))!==false){	
		
				row = this.addRow(child);
				
				row && arguments.callee.call(this,row.id);
				
			}

		}).call(this,this.rootRow.id);
		
	
	
	},
	
	addRow : function(rowData){
	
		var id = rowData.$nodeId,
			pId = rowData.$parentNodeId,
			isRoot = infestor.isNull(pId),
			row = {},
			parentRow,
			finalNode,
			rows;
			
		if(infestor.isArray(rowData))
			return infestor.each(rowData,function(idx,data){ this.addRow(data);  },this), true,
				
		this.gridRows = this.gridRows || {};
		
		if(this.gridRows[id]) return false;
		
		parentRow = this.gridRows[pId];
		
		if(!parentRow && !isRoot) return false;
		
		rows = this.gridRows;
		
		row.id = id;
		row.depth = isRoot ? 1 : (parentRow.depth +1);
		row.data = rowData;
		row.cells = {};
		row.container = infestor.create('infestor.Element',{ hidden: !isRoot, cssClsElement:this.cssClsGridBodyRow ,tagName:'tr'});
		
		isRoot && row.container.renderTo(this.gridBodyContainer);
		
		if(!isRoot){
			
			finalNode = parentRow.treeNode.getFinalNode();
			
			if(finalNode)
				row.container.element.after(this.gridRows[finalNode.nodeId].container.element);
			else row.container.element.after(parentRow.container.element);
		
		}
			
		row.treeNode = this.treeColumn.createColumnCell(rowData.rawData,rowData,row.container,row);
		
		row.treeNode.nodeId = row.id;
		
		row.treeNode.isRoot = isRoot;
		
		row.treeNode.on({
		
			addChildNode : function(){
			
				
			},
			removeChildNode :function(){
			
			
			},		
			nodeExpand : function(){
			
				infestor.each(this.childNodes,function(idx,node){
				
					node = rows[node.nodeId];
					node && node.container && node.container.show();
				
				});
			},
			nodeCollapse : function(){
			
				infestor.each(this.childNodes,function(idx,node){
				
					node = rows[node.nodeId];
					node && node.container && node.container.hide();
					node && node.treeNode.nodeCollapse();
				
				});
			
			}
		
		});
		
		!isRoot && parentRow.treeNode.addChildNode(row.treeNode);
		
		infestor.each(this.gridColumns,function(name,column){
		
			row.cells[name] = column.createColumnCell(rowData.rawData && rowData.rawData[name],rowData.rawData,row.container,row);
		
		},this);
		
		this.gridRows[id] = row;
		
		return row;
		
	},
	
	
	destroy : function(){
	
	
	
	}
	
});