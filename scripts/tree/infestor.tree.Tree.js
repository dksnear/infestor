infestor.define('infestor.tree.Tree',{

	alias : 'tree',
	
	extend : 'infestor.grid.Grid',
	
	uses : ['infestor.tree.DataSet','infestor.tree.TreeColumn','infestor.Tip'],

	cssUses : 'infestor.grid',
	
	cssClsElement : 'infestor-tree',
	
	cssClsNodeEditor : 'infestor-tree-node-editor',
	cssClsNodeEditorItem : 'infestor-tree-node-editor-item',
	cssClsNodeEditorItemInput : 'infestor-tree-node-editor-item-input',
	
	dataSetClsName : 'infestor.tree.DataSet',
	
	// 异步构造
	async : false,
	
	// 异步构造请求父节点请求参数名 默认值为this.dataSet.modelMap.$parentNodeId
	asyncParamName : '',
	
	// 异步构造严格模式 (每次异步加载请求只加载一层节点)
	// 异步构造非严格模式 (每次异步加载请求加载两层节点 第2层为预加载 用于判定第一层是否有子节点)
 	asyncStrict : false,
	
	// 初始化时自动展开深度(int|bool)
	// (int 0) 展开所有节点
	// (int x) 展开深度小于等于x的所有节点
	// (bool false) 不展开任何节点
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
			
			// 设置加载中等待样式
			currentLoadingNode.isLoading = true;
			currentLoadingNode.changeNodeSwitchIcon();
		
		},this);

		this.dataSet && this.dataSet.on('load', function (data,params) {
	
			var currentLoadingNode,needPreload,expandDepth;
	
			if(!this.async) return !this.rootRow && this.createTree(data);

			currentLoadingNode = this.getNode(params && params[this.asyncParamName || this.dataSet.modelMap.$parentNodeId || 'pId']);
			currentLoadingNode.isLoading = false;	
			currentLoadingNode.isBranch && !currentLoadingNode.hasChild && (currentLoadingNode.isBranch = false) && (currentLoadingNode.isLeaf = true);
			currentLoadingNode.refreshIcon();
			
			if(!data || data.length < 1)
				return;
			
			this.addRow(data);
			
			expandDepth = (currentLoadingNode.$asyncExpandDepth===0 || this.expandDepth===0) ? 0 : undefined;
			
			expandDepth = expandDepth === 0 ? 0 : (infestor.isUndefined(currentLoadingNode.$asyncExpandDepth) || currentLoadingNode.$asyncExpandDepth < this.expandDepth) ? 
				this.expandDepth : currentLoadingNode.$asyncExpandDepth;
			
			needPreload = !this.asyncStrict && expandDepth !==0 && (currentLoadingNode.nodeDepth >= expandDepth);
			
			if(params.$$preLoadDepth && needPreload){
			
				infestor.each(currentLoadingNode.childNodes,function(idx,node){ 
					this.asyncLoadNode(node.nodeId,params.$$preLoadDepth-1); 
				},this);
									
			}	
			
			if(expandDepth === 0 || currentLoadingNode.nodeDepth < expandDepth){
			
				infestor.each(currentLoadingNode.childNodes,function(idx,node){ 
					this.asyncStrict ? this.asyncLoadNode(node.nodeId) 
						: this.asyncLoadNode(node.nodeId,(currentLoadingNode.nodeDepth + 1 == expandDepth) && !this.asyncStrict ? 1 : 0);
					node.isLoaded = true;
					!infestor.isUndefined(currentLoadingNode.$asyncExpandDepth) && (node.$asyncExpandDepth = currentLoadingNode.$asyncExpandDepth);
				},this);
				
			}
	
			if(!params.$$preLoadDepth && needPreload)
				return;	
			
			// fix node status
			currentLoadingNode.isLoaded = true;
			currentLoadingNode.isExpand = false;
			currentLoadingNode.isCollapse = true;
						
			currentLoadingNode.nodeExpand();
			
		},this);
		
	},
	
	// @init 当树异步本地加载时 自动初始化dataSet中的数据 用于模拟远程异步 
	load : function(data,init){
	
		if(!this.dataSet)
			return this;
	
		this.rootPId = this.rootPId || this.dataSet.rootPId;
	
		if(this.async && !this.dataSet.remote)
			init && this.dataSet.initData(data);
	
		if(this.async)
			this.createTree();
		
		if(!this.async)
			this.callParent();
		
		this.loaded = true;
		
		return this;		
	
	},
	
	
	// @clear 清理数据集中的数据 清理搜寻状态
	reload : function(data,clear){
	
		if(!this.loaded)
			return this.load.apply(this,arguments);
		
		this.removeRow();
		this.rootRow = null;
		this.activedNode = null;
		this.loaded = false;
		
		clear && this.searchClear();
		clear && this.dataSet.clearData();
		
		return this.load.apply(this,arguments);
	
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
				row.container.element.insertAfter(this.gridRows[finalNode.nodeId].container.element);
			else row.container.element.insertAfter(parentRow.container.element);
		
		}
			
		row.treeNode = this.treeColumn.createColumnCell(rowData.rawData,rowData,row.container,row,this.rootVisible ? 0 : -1).getItem('inner-cell');
		
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
			
				tree.activeNode(node.nodeId);
				
				tree.emit('nodeIconClick',[icon,e,node,tree]);
			
			},
			
			nodeSwitchClick : function(sw,e,node){
			
				 node.isExpand ? node.nodeCollapse() : node.nodeExpand();
			
			},
			
			nodeExpand : function(){
				
				// async expand
				if(tree.async && (this.hasChild || this.isBranch) && !this.isLoaded){
					
					var expandDepth = (this.$asyncExpandDepth ===0 || tree.expandDepth ===0 ) ? 0 : undefined;
					
					expandDepth = expandDepth === 0 ? 0 : (infestor.isUndefined(this.$asyncExpandDepth) || this.$asyncExpandDepth < tree.expandDepth) ? 
						tree.expandDepth : this.$asyncExpandDepth;
						
							
					return tree.asyncStrict ? tree.asyncLoadNode(this.nodeId) 
						: tree.asyncLoadNode(this.nodeId, 
							(expandDepth !==0 && (this.nodeDepth >= expandDepth)) ? 1 : 0);
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
		
		this.isSearching && (!this.treeSearchRange || infestor.inArray(this.treeColumn.columnOptions.name,this.treeSearchRange) != -1) && row.treeNode.setSearchText(this.treeSearchText,this.treeSearchMode);
		
		this.multiColumn && infestor.each(this.gridColumns,function(name,column){
		
			row.cells[name] = column.createColumnCell(rowData.rawData && rowData.rawData[name],rowData.rawData,row.container,row);
			this.isSearching && this.treeSearchRange && (infestor.inArray(name,this.treeSearchRange) != -1) && row.cells[name].getItem('inner-cell').setSearchText(this.treeSearchText,this.treeSearchMode);
		
		},this);
		
		this.gridRows[id] = row;
		
		return row;
		
	},

	removeRow : function(rowId){
	
		var rowId = infestor.isUndefined(rowId) && this.rootRow && this.rootRow.id || rowId,
			row = this.gridRows && this.gridRows[rowId];
		
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
			return (this.expandDepth !== false) && this.rootRow.treeNode.nodeExpand();
	
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
		
		if(this.expandDepth !== false)
			this.expandNodeToDepth(this.rootRow.treeNode.nodeId,this.expandDepth);
	},
	
	createNodeEditor : function() {
	
		var tree = this;
	
		this.nodeEditor = this.nodeEditor || infestor.create('infestor.Tip',{
		
			hidden:true,
			hideWithResize:true,
			hideWithBlur:true,
			initEvents:function(){
			
				this.on('afterhide',function(){
				
					tree.emit('nodeEditorAfterHide',this);
					tree.hideMask();
				
				});
				
				this.getItem('node-editor').getItem('text-in').element.on('keydown',function(e){
				
					if(e.keyCode == infestor.keyCode.enter){
						
						tree.emit('nodeEditorBtnConfirmClick',this);
						tree.hideMask();
						this.hide();
					}
					
					if(e.keyCode == infestor.keyCode.esc){
						
						tree.emit('nodeEditorBtnCancelClick',this);
						tree.hideMask();
						this.hide();
					}
		
				},this);
			
				this.delegate(this.getItem('node-editor'),'click',true,function(inst,e){
				
					if(!inst || !inst.element) return;
					
					switch(inst.name){
					
						case 'btn-confirm':
							tree.emit('nodeEditorBtnConfirmClick',this);
							tree.hideMask();
							this.hide();
							break;
						case 'btn-cancel':
							tree.emit('nodeEditorBtnCancelClick',this);
							tree.hideMask();
							this.hide();
							break;
						default:
							break;
					
					}
					
				
				},this,true);
			},
			items:{
			
				name:'node-editor',
				cssClsElement:this.cssClsNodeEditor,
				itemLayout:'horizon',
				items:[{
				
					name:'text-in',
					cssClsElement:this.cssClsNodeEditorItem + ' ' + this.cssClsNodeEditorItemInput,
					tagName:'input'
				
				},{
				
					name:'btn-confirm',
					cssClsElement:this.cssClsNodeEditorItem,
					icon:'accept',
					attr:{ title:'确定' }
				
				},{
				
					name:'btn-cancel',
					cssClsElement:this.cssClsNodeEditorItem,
					icon:'multiply',
					attr:{ title:'取消' }
				}]
			
			}
		
		}).renderTo();
		
		return this;
	
	},
	
	showNodeEditor : function(nodeId){
	
		var node = this.getNode(nodeId),text,input;
		
		if(!node) return false;
		
		!this.nodeEditor && this.createNodeEditor();
	
		this.showMask();
		
		text = node.nodeTextCell.text;
		input = this.nodeEditor.getItem('node-editor').getItem('text-in');

		input.element.val(text);
		input.element.setSelectionRange(0,text.length);
		
		this.nodeEditor.autoPosition(node.nodeTextCell,'bottom','13');
		this.nodeEditor.show(true);
			
		return true;
	
	},
	
	// 异步加载node
	// @nodeId 节点id
	// @depth 加载深度 (用于一次加载多层节点)
	asyncLoadNode : function(nodeId,depth){
	
		var	opts = {
					
			params : {
			
				$$preLoadDepth:depth || 0
			}
		};
		
		opts.params[this.asyncParamName || this.dataSet.modelMap.$parentNodeId || 'pId'] = nodeId;
		
		this.dataSet.remote ? this.dataSet.load(opts) : this.dataSet.simulateLoad(opts);
		
	
	},
	
	activeNode : function(nodeId){
	
		var node = this.getNode(nodeId);
		
		if(!node)
			return null;
	
		this.activedNode && this.activedNode.blur();			
		this.activedNode = node.focus();
		
		return node;
	},
	
	getNode : function(nodeId){
	
		if(!nodeId)
			return this.rootRow && this.rootRow.treeNode;
	
		return this.gridRows[nodeId] && this.gridRows[nodeId].treeNode;
	
	},
	
	getNodeByDepth : function(depth){
	
		var nodes = [];
		
		if(!this.rootRow) return nodes;
		
		this.rootRow.treeNode.eachChildNodes(function(node){
		
			if(node.nodeDepth === depth)
				nodes.push(node);
			
			if(node.nodeDepth > depth)
				return false;
		
		});
		
		return nodes;
	
	},
	
	addNode : function(rawData,visible){
		
		var rowData = this.dataSet && this.dataSet.addData(rawData) || rawData;
		
		return this.addRow(rowData,visible).treeNode;
	
	},
	
	updateNode : function(nodeId,rawData){
	
		var rowData,node = this.getNode(nodeId);
	
		if(!this.dataSet || !node) return false;
		
		rowData = this.dataSet.mapData(rawData,true);	
		this.dataSet.setData(nodeId,rowData);
		
		if(rowData.$text)
			node.setText(rowData.$text);
	
		return node;
		
	},
	
	deleteNode : function(nodeId){
	
		if(arguments.length < 1){
		
			nodeId = this.activedNode && this.activedNode.nodeId;
			this.activedNode = this.activedNode && this.activedNode.previousSiblingNode || this.activedNode.parentNode || null;
			this.activedNode && this.activedNode.focus();
		}
	
		return nodeId && this.removeRow(nodeId);
	
	},
	
	expandNode : function(nodeId){
	
		var node = this.getNode(nodeId);
		
		if(!node) return false;
		
		return node.nodeExpand(),true;
	
	
	},
	
	// 展开一个节点到根节点的@depth深度
	// @depth 为0则展开到根节点的最大深度
	expandNodeToDepth : function(nodeId,depth){
	
		var node = this.getNode(nodeId);
		
		if(!node || !(node.hasChild || node.isBranch) || (depth && node.nodeDepth > depth)) return;
		
		if(this.async && !node.isLoaded){

			node.$asyncExpandDepth = depth || 0;
			node.nodeExpand();
			
			return;
		}
		
		node.nodeExpand();
		
		infestor.each(node.childNodes,function(idx,node){
		
			this.expandNodeToDepth(node.nodeId,depth);
			
		},this);
	
	},
	
	collapseNode : function(nodeId){
		
		var node = this.getNode(nodeId);
		
		if(!node) return;
		
		if(!this.rootVisible && this.rootRow && this.rootRow.treeNode == node)
			return infestor.each(node.childNodes,function(idx,node){  this.collapseNode(node.nodeId);  },this);
		
		node.nodeCollapse();
		
	},

	search : function(keyword,range,mode,allowEmpty){
		
		range = range && (infestor.isArray(range) ? range : [range]);
		
		if(!keyword && !this.isSearching)
			return false;
		
		if(!keyword && this.isSearching)
			return this.searchStop() && false;
		
		if(this.isSearching && this.treeSearchText == keyword && ((!range && !this.treeSearchRange) || (range && range.join(',') == this.treeSearchRange.join(','))))
			return false;
		
		return this.searchClear() && this.searchOn(keyword,range,mode,allowEmpty);
				
	},
	
	// @allowEmpty 无搜寻结果仍然重新加载树
	searchOn : function(keyword,range,mode,allowEmpty){
		
		var searchDataSet,len = 0;
	
		if(!this.loaded || this.dataSet.remote || this.isSearching) return false;
				
		searchDataSet = infestor.create('infestor.tree.DataSet',this.dataConfig);
		searchDataSet = infestor.append(searchDataSet,this.dataSet);		
		len = searchDataSet.filterData(keyword,range,mode,true).length;
		
		if(!allowEmpty && !len)
			return len;
	
		this.$dataSet = this.dataSet;		
		this.dataSet = searchDataSet;
		this.treeSearchText = keyword;
		this.treeSearchRange = range && (infestor.isArray(range) ? range : [range]);
		this.treeSearchMode = mode;
		this.isSearching = true;
		this.reload();

		return len;
		
	},
	
	searchStop : function(){
		
		if(!this.isSearching) return false;
			
		this.searchClear();
		this.reload();
		
		return true;
		
	},
	
	searchClear : function(){
		
		this.$dataSet && (this.dataSet = this.$dataSet);
		this.treeSearchText = '';
		this.treeSearchRange = [];
		this.treeSearchMode = '';
		this.isSearching = false;
		
		return true;
	},
	
	reset : function(){
		
		this.removeRow();
		this.rootRow = null;
		this.activedNode = null;
		this.loaded = false;
	
	},
	
	destroy : function(){
	
		this.removeRow();
		this.callParent();	
	}
	
});