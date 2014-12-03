infestor.define('infestor.tree.Tree',{

	alias : 'tree',
	
	extend : 'infestor.grid.Grid',
	
	uses : ['infestor.tree.DataSet','infestor.tree.TreeColumn'],
	
	dataSetClsName : 'infestor.tree.DataSet',
	
	// 异步构造
	async : false,
	
	// 异步构造请求父节点请求参数名 默认值为this.dataSet.modelMap.$parentNodeId
	asyncParamName : '',
	
	// 异步构造严格模式 (每次异步加载请求只加载一层节点)
	// 异步构造非严格模式 (每次异步加载请求加载两层节点 第2层为预加载 用于判定第一层是否有子节点)
 	asyncStrict : false,
	
	// 自动展开深度(int|bool)
	// (int 0 | true) 展开所有节点
	// (int x) 展开深度小于等于x的所有节点
	// (false) 不展开任何节点
	expandDepth : 1,
	
	// 表格树 
	multiColumn : false,

	// 根节点可见
	rootVisible : false,
	
	// 树结构列
	treeColumn : null,
	
	// #rewrite
	
	initEvents : function () {
		
		this.dataSet && this.async && this.dataSet.on('beforeLoad',function(opts){
		
			var currentLoadingNode = this.getNode(opts.params[this.asyncParamName || this.dataSet.modelMap.$parentNodeId || 'pId']);
			
			currentLoadingNode.isLoading = true;
			currentLoadingNode.changeNodeSwitchIcon();
		
		},this);

		this.dataSet && this.dataSet.on('load', function (data,params) {
	
			var currentLoadingNode,needPreload;
	
			if(!this.async) return !this.rootRow && this.createTree(data);

			currentLoadingNode = this.getNode(params[this.asyncParamName || this.dataSet.modelMap.$parentNodeId || 'pId']);
			currentLoadingNode.isLoading = false;		
			currentLoadingNode.changeNodeSwitchIcon();
			
			if(!data || data.length < 1) return;

			this.addRow(data);
			
			needPreload = !this.asyncStrict && this.expandDepth !==0 && this.expandDepth !== true && (this.expandDepth === false || currentLoadingNode.nodeDepth >= this.expandDepth);
			
			if(params.$$preLoadDepth && needPreload){
			
				infestor.each(currentLoadingNode.childNodes,function(idx,node){ 
					this.asyncLoadNode(node.nodeId,params.$$preLoadDepth-1); 
				},this);
									
			}	
	
			if(this.expandDepth === true || this.expandDepth === 0 || currentLoadingNode.nodeDepth < this.expandDepth){
			
				infestor.each(currentLoadingNode.childNodes,function(idx,node){ 
					this.asyncStrict ? this.asyncLoadNode(node.nodeId) : this.asyncLoadNode(node.nodeId,(currentLoadingNode.nodeDepth + 1 == this.expandDepth) && !this.asyncStrict ? 1 : 0);
				},this);
				
			}
	
			if(!params.$$preLoadDepth && needPreload)
				return;	
						
			currentLoadingNode.nodeExpand();
			
		},this);
		
	},
		
	load : function(){
	
		if(!this.dataSet)
			return this;
	
		this.rootPId = this.rootPId || this.dataSet.rootPId;
	
		if(this.async)
			this.createTree();
		else this.callParent();
		
		return this;		
	
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
	
	addRow : function(rowData,visible){
	
		var id = rowData.$nodeId,
			pId = rowData.$parentNodeId,
			isRoot = rowData.$root || infestor.isNull(pId),
			isBranch = rowData.$branch,
			isLeaf = rowData.$leaf,
			hasChild = rowData.$hasChild,
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
		row.depth = rowData.$$depth = isRoot ? 1 : (parentRow.depth +1);
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
		row.treeNode.isRoot = isRoot;
		row.treeNode.isLeaf = isLeaf || !isRoot;
		row.treeNode.isBranch = isBranch || hasChild;
		row.treeNode.hasChild = hasChild;
		
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
			
				 node.isExpand ? node.nodeCollapse() : node.nodeExpand();
			
			},
			
			nodeExpand : function(){
			
				// async expand
				if(tree.async && this.hasChild && !this.isLoaded){
									
					tree.asyncStrict ? tree.asyncLoadNode(this.nodeId) 
						: tree.asyncLoadNode(this.nodeId , (tree.expandDepth!==0 && tree.expandDepth !==true && (tree.expandDepth === false || this.nodeDepth >= tree.expandDepth)) ? 1 : 0) ;
									
					this.isLoaded = true;
					
					// fix expand tag
					this.isExpand = false;
					this.isCollapse = true;
					
					return;
				}
			
				infestor.each(this.childNodes,function(idx,node){
				
				    var row = tree.gridRows[node.nodeId];
					
					row && row.container && row.container.show();
					
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
		
		row.treeNode.refreshIcon();
		
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

	// #news
	
	createTree : function(data){
	
		var data,getChildNode;
		
		this.gridRows = [];
		
		this.rootRow = this.addRow({
		
			$nodeId:this.rootPId,
			$parentNodeId:null,
			$hasChild:this.async || data && data.length>0
			
		},this.rootVisible);
		
		if(this.async)				
			return this.rootRow.treeNode.nodeExpand();
	
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
		
		this.expandDepth = this.expandDepth === true ? 0 : this.expandDepth;
		if(this.expandDepth !== false)
			this.expandNodeToDepth(this.rootRow.treeNode.nodeId,this.expandDepth);
	},
	
	// 异步加载node
	// @nodeId 节点id
	// @depth 加载深度 (用于一次加载多层节点)
	asyncLoadNode : function(nodeId,depth){
	
		var params = {
					
			params:{
			
				$$preLoadDepth:depth || 0
			}
		};

		params.params[this.asyncParamName || this.dataSet.modelMap.$parentNodeId || 'pId'] = nodeId;
		
		this.dataSet.load(params);
	
	},
	
	getNode : function(nodeId){
	
		if(!nodeId)
			return this.rootRow && this.rootRow.treeNode;
	
		return this.gridRows[nodeId] && this.gridRows[nodeId].treeNode;
	
	},
	
	addNode : function(rawData,visible){
		
		var rowData = this.dataSet && this.dataSet.addData(rawData) || rawData;
		
		return this.addRow(rowData,visible).treeNode;
	
	},
	
	expandNode : function(nodeId){
	
		var node = this.getNode(nodeId);
		
		if(!node) return false;
		
		return node.nodeExpand(),true;
	
	
	},
	
	// 非异步加载有效
	expandNodeToDepth : function(nodeId,depth){
	
		var node = this.getNode(nodeId);
		
		if(!node || !node.hasChild || (depth && node.nodeDepth > depth)) return;
		
		node.nodeExpand();
		
		infestor.each(node.childNodes,function(idx,node){
		
			this.expandNodeToDepth(node.nodeId,depth);
			
		},this);
	
	},
	
	deleteNode : function(nodeId){
	
		if(arguments.length < 1)
			nodeId = this.activeNode && this.activeNode.nodeId;
	
		return nodeId && this.removeRow(nodeId);
	
	},
	
	destroy : function(){
	
		this.removeRow();
		this.callParent();	
	}
	
});