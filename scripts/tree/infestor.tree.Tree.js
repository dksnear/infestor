infestor.define('infestor.tree.Tree',{

	alias : 'tree',
	
	extend : 'infestor.grid.Grid',
	
	uses : ['infestor.tree.DataSet','infestor.tree.TreeColumn'],
	
	dataSetClsName : 'infestor.tree.DataSet',
	
	async : false,
	
	asyncParamName : '',
	
	// 表格树 
	multiColumn : false,

	// 根节点可见
	rootVisible : false,
	
	// 树结构列
	treeColumn : null,
	
	// rewrite
	initEvents : function () {

		this.dataSet && this.dataSet.on('load', function (data,params) {
		
			this.rootPId = this.rootPId || this.dataSet.rootPId;
			
			!this.rootRow && this.createTree(data);
			
			if(!this.dataSet.remote) return;
			
			if(!this.async) return;
			
			this.addRow(data);
			
			if(!data || data.length<1)			
				this.fixNode(params[this.asyncParamName || this.dataSet.modelMap.$parentNodeId || 'pId']);
					
			if(!this.currentLoadingNode) return;
			
			this.currentLoadingNode.nodeExpand();
			
			infestor.each(this.currentLoadingNode.childNodes,function(idx,node){ this.asyncLoadNode(node.nodeId); },this);
			
			this.currentLoadingNode = null;

		
		},this);
		
	},
	
	createGridHead  : function(){
	
		if(!this.multiColumn) return;
		
		this.callParent();
	
	},
	
	createColumns : function(){
	
	
		if(!this.multiColumn){
		
			this.treeColumn = infestor.grid.Grid.createColumn({
			
				type:'infestor.tree.TreeColumn',
				name:this.dataSet.modelMap.$text,
				width:'100%'
			
			});
		
			return;
		
		}
		
	
		this.gridColumns = this.gridColumns || {};
	
		infestor.each(this.columnsOptions,function(idx,options){
		
			if(options.type == 'infestor.tree.TreeColumn' || options.alias =='treecolumn')
				return this.treeColumn = infestor.grid.Grid.createColumn(options),true;
		
			this.gridColumns[options.name] = infestor.create(options.type || 'infestor.grid.Column',{ columnOptions : options });
			
		
		},this);
		
		this.treeColumn && this.treeColumn.createColumnHead(this.gridHead);
		infestor.each(this.gridColumns,function(idx,column){  column.createColumnHead(this.gridHead); },this);
	
	},
	
	createTree : function(data){
	
		var data,getChildNode;
		
		this.gridRows = [];
		
		this.rootRow = this.addRow({
		
			$nodeId:this.rootPId,
			$parentNodeId:null
			
		},this.rootVisible);
		
		if(this.async){
		
			// 展开根节点
			this.asyncLoadNode(this.rootRow.treeNode.nodeId);				
			this.currentLoadingNode = this.rootRow.treeNode;
		
			return;
		
		}
				
		data = data && infestor.map(data,function(){ return this; });
		getChildNode = function(pId){
		
			var node,i=0,len = data.length;
		
			for(;i<len;i++){
			
				if(data[i].$parentNodeId === pId)
					return node = data.splice(i,1)[0] || false;
			}
			
			return false;
		
		};
	
		(function(pId){
		
			var child,row;
		
			while((child = getChildNode(pId))!==false){	
		
				row = this.addRow(child);
				
				row && arguments.callee.call(this,row.id);
				
			}

		}).call(this,this.rootRow.id);
		
	
		// 展开根节点
		this.rootRow.treeNode.nodeExpand();
	
	},
	
	// 异步加载node
	asyncLoadNode : function(nodeId){
	
		var params = {
					
			params:{}
		};

		params.params[this.asyncParamName || this.dataSet.modelMap.$parentNodeId || 'pId'] = nodeId;
		
		this.dataSet.load(params);
	
	},
	
	fixNode : function(nodeId){
	
		this.gridRows[nodeId].treeNode.changeNodeIcon();
	
	},

	addNode : function(rawData,visible){
		
		var rowData = this.dataSet && this.dataSet.addData(rawData) || rawData;
		
		return this.addRow(rowData,visible).treeNode;
	
	},
	
	deleteNode : function(nodeId){
	
		if(arguments.length < 1)
			nodeId = this.activeNode && this.activeNode.nodeId;
	
		return nodeId && this.removeRow(nodeId);
	
	},
	
	addRow : function(rowData,visible){
	
		var id = rowData.$nodeId,
			pId = rowData.$parentNodeId,
			isRoot = infestor.isNull(pId),
			isBranch = rowData.hasOwnProperty('$leaf') ? !rowData.$leaf : false,
			row = {},
			parentRow,
			finalNode,
			tree = this;
			
		if(infestor.isArray(rowData))
			return infestor.each(rowData,function(idx,data){ this.addRow(data,visible);  },this), true,
				
		this.gridRows = this.gridRows || {};
		
		if(this.gridRows[id]) return false;
		
		parentRow = this.gridRows[pId];
		
		if(!parentRow && !isRoot) return false;
		
		row.id = id;
		row.depth = isRoot ? 1 : (parentRow.depth +1);
		row.data = rowData;
		row.cells = {};
		row.container = infestor.create('infestor.Element',{ hidden:!visible, cssClsElement:this.cssClsGridBodyRow ,tagName:'tr'});
		
		isRoot && row.container.renderTo(this.gridBodyContainer);
		
		if(!isRoot){
			
			finalNode = parentRow.treeNode.getFinalNode();
			
			if(finalNode)
				row.container.element.after(this.gridRows[finalNode.nodeId].container.element);
			else row.container.element.after(parentRow.container.element);
		
		}
			
		row.treeNode = this.treeColumn.createColumnCell(rowData.rawData,rowData,row.container,row);
	
		row.treeNode.nodeId = row.id;
		row.treeNode.isExpand = visible;
		row.treeNode.isCollapse = !visible;
		row.treeNode.isRoot = isRoot;
		row.treeNode.isLeaf = !isRoot;
		row.treeNode.isBranch = isBranch;
				
		row.treeNode.on({
		
			nodeTextClick : function(txt,e,node){
			
				tree.emit('nodeTextClick',[txt,e,node,tree]);
			
			},
		
			nodeIconClick : function(icon,e,node){
			
				tree.activeNode && tree.activeNode.blur();			
				tree.activeNode = node.focus();
				
				tree.emit('nodeIconClick',[icon,e,node,tree]);
			
			},
			
			nodeSwitchClick : function(sw,e,node){
			
				if(tree.async && !node.isLeaf && !node.isLoaded){
									
					tree.asyncLoadNode(node.nodeId);
					
					tree.currentLoadingNode = node;
					
					return;
				}
				
				 node.isExpand ? node.nodeCollapse() : node.nodeExpand();
			
			},
			
			nodeExpand : function(){
			
				tree.async && (this.isLoaded = true);
			
				infestor.each(this.childNodes,function(idx,node){
				
					node = tree.gridRows[node.nodeId];
					node && node.container && node.container.show();
					
				});
			},
			
			nodeCollapse : function(){
			
				infestor.each(this.childNodes,function(idx,node){
				
					node = tree.gridRows[node.nodeId];
					node && node.container && node.container.hide();
					node && node.treeNode.nodeCollapse();
				
				});
			
			},
			
			removeNode : function(pnode,node){
			
				var row = tree.gridRows[node.nodeId];
				
				row.container.destroy();
			 
				delete tree.gridRows[node.nodeId];
				
				tree.dataSet.deleteData(node.nodeId);
			
			}
		
		});
		
		row.treeNode.changeNodeIcon(this.async);
		
		!isRoot && parentRow.treeNode.addChildNode(row.treeNode);
		
		this.multiColumn && infestor.each(this.gridColumns,function(name,column){
		
			row.cells[name] = column.createColumnCell(rowData.rawData && rowData.rawData[name],rowData.rawData,row.container,row);
		
		},this);
		
		this.gridRows[id] = row;
		
		return row;
		
	},

	removeRow : function(rowId,force){
	
		var row = this.gridRows && this.gridRows[rowId];
		
		if(!row) return this;
		
		row.treeNode.removeNode();
			
		return this;
	
	},
	
	destroy : function(){
	
		this.removeRow();
		this.callParent();	
	}
	
});