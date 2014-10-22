infestor.define('infestor.tree.TreeNode',{

	alias : 'treenode',

	extend : 'infestor.Element',

	cssUses : 'infestor.Tree',

	cssClsElement : 'infestor-tree-node',
	
	cssClsNodeCell : 'infestor-tree-node-cell',

	cssClsNodeSpaceCell : 'infestor-tree-node-space-cell',
	
	cssClsNodeExpandSwitchCell : 'infestor-tree-node-expand-switch-cell',
	
	cssClsNodeCollapseSwitchCell : 'infestor-tree-node-collapse-switch-cell',
	
	cssClsNodeNonSwichCell : 'infestor-tree-node-non-switch-cell',
	
	cssClsNodeCheckCell : 'infestor-tree-node-check-cell',
	
	cssClsNodeUnCheckCell : 'infestor-tree-node-uncheck-cell',
	
	cssClsNodeHalfCheckCell : 'infestor-tree-node-half-check-cell' ,
	
	cssClsNodeExpandIconCell : 'infestor-tree-node-expand-icon-cell',
	
	cssClsNodeCollapseIconCell : 'infestor-tree-node-collapse-icon-cell',
	
	cssClsNodeNormalIconCell : 'infestor-tree-node-normal-icon-cell',

	cssClsNodeTextCell : 'infestor-tree-node-text-cell',
	
	nodeSpaceCells : null,
	
	nodeSwitchCell : null,
	
	nodeCheckCell : null,
	
	nodeIconCell : null,
	
	nodeTextCell : null,

	// 树的深度 从1开始
	nodeDepth : 1,
	
	isRoot : false,
	
	isBranch : false,
	
	isLeaf : true,

	isLast : true,
	
	isExpand : true,
	
	isCollapse : false,
	
	// 异步加载节点完成
	isLoaded : false,
	
	nodeId : null,
	
	parentNodeId : null,
	
	parentNode : null,
	
	previousSiblingNode : null,
	
	nextSiblingNode : null,
	
	lastChildNode : null,
	
	childNodes : null,
	
	
	// rewite
	
	initElement:function(){
	
		this.callParent();
		
		this.createNodeSpaceCells().createNodeSwitchCell().createNodeCheckCell().createNodeIconCell().createNodeTextCell();
		
	
	},
	
	setText : function (text) {

		this.text = infestor.isUndefined(text) ? this.text : text;
		this.nodeTextCell.setText(this.text);
		
		return this;
	},

	// ui construct
	
	
	createNodeSpaceCells : function(){
	
		this.nodeSpaceCells = this.nodeSpaceCells || [];
		
		for(var i=0;i<this.nodeDepth-1;i++)
			this.nodeSpaceCells.push(infestor.create('infestor.Element',{ cssClsElement: [this.cssClsElementInlineBlock,this.cssClsNodeCell,this.cssClsNodeSpaceCell].join(' ') }).renderTo(this));
	
		return this;
	},
	
	createNodeSwitchCell : function(){
	
		this.nodeSwitchCell = infestor.create('infestor.Element',{ cssClsElement: [this.cssClsElementInlineBlock,this.cssClsNodeCell,this.cssClsNodeNonSwichCell].join(' ') }).renderTo(this);
		
		return this;
	
	},
	
	createNodeCheckCell : function(){
	
		
		return this;
	
	},
	
	createNodeIconCell : function(){
	
		var cssCls = this.cssClsNodeExpandIconCell;
	
		this.nodeIconCell = infestor.create('infestor.Element',{ cssClsElement: [this.cssClsElementInlineBlock,this.cssClsNodeCell,this.cssClsNodeNormalIconCell].join(' ') }).renderTo(this);
		
		return this;
	
	},
	
	createNodeTextCell : function(){
	
		this.nodeTextCell = infestor.create('infestor.Element',{ cssClsElement: this.cssClsElementInlineBlock  + ' ' + this.cssClsNodeTextCell }).renderTo(this);
		
		return this;
	
	
	},
	
	changeNodeIcon :function(){
	
	
	},
	
	changeNodeSwichIcon:function(){
	
	
	},
	

	
	// construct node
	
	
	addChildNode : function(node,fn){
	
	
		if(node instanceof infestor.tree.TreeNode) 
			return false;
	
		this.childNodes = this.childNodes || [];
		
		node.nodeDepth = this.nodeDepth + 1;
		node.parentNode = this;
		node.previousSiblingNode = this.isBranch ? this.childNodes[this.childNodes.length-1] : null;	
		node.previousSiblingNode && (node.previousSiblingNode.nextSiblingNode = node) && (node.previousSiblingNode.isLast = false);
		
		
		this.lastChildNode = node;
		this.isBranch = true;
		this.isLeaf = false;
		
		
		this.changeNodeIcon();
		this.changeNodeSwichIcon();
		
		fn && fn.call(this,node);
		
		return node;
		
	
	},
	
	
	// 删除一个节点标识为@nodeId子节点
	// @nodeId为空则删除最后一个子节点
	removeChildNode : function(nodeId,fn){
	
		var i=0,len,node;
		
		if(!this.childNodes) return false;
		
		len = this.childNodes.length;
		
		if(nodeId){
		
			for(;i<len;i++){
			
				if(this.childNodes[i].nodeId == nodeId){
					node = this.childNodes.splice(i,1);
					break;
				}
			}
		}
		
		if(!nodeId) 
			node = this.childNodes.pop();
		
		
		if(!node) return false;
		
		if(node.isBranch){
		
			len = node.childNodes.length;
			while(len){
			
				node.removeChildNode(null,fn);
				len--;
			}
		
		};
				
			
		node.nextSiblingNode && (node.nextSiblingNode.previousSiblingNode = node.previousSiblingNode);
		
		node.previousSiblingNode && (node.previousSiblingNode.nextSiblingNode = node.nextSiblingNode);
		
		if(node.isLast) {
		
			this.lastChildNode = node.previousSiblingNode;
			this.lastChildNode.isLast = true;
		}
		
		this.changeNodeIcon();
		this.changeNodeSwichIcon();
		
		fn && fn.call(this,node);
		
		return node;
	
	},
	
	removeNode:function(fn){
	
		return this.parentNode && this.parentNode.removeChildNode(this.nodeId,fn);
	
	},
		
	// manipulate node
	
	nodeExpand : function(){
	
		
	
	},
	
	
	nodeCollapse : function(){
	
	
	}

});