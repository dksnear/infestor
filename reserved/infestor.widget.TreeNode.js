infestor.define('infestor.widget.TreeNode',{

	alias : 'treeNode',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget.Tree',

	cssClsElement : 'infestor-tree-node',

	cssClsNodeSpaceCell : 'infestor-tree-node-sapce-cell',
	
	cssClsNodeExpandSwitchCell : 'infestor-tree-node-expand-switch-cell',
	
	cssClsNodeCollapseSwitchCell : 'infestor-tree-node-collapse-switch-cell',
	
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
	
	prarentNode : null,
	
	previousSiblingNode : null,
	
	nextSiblingNode : null,
	
	lastNode : null,
	
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
		
		for(var i=0;i<this.nodeDepth;i++)
			this.nodeSpaceCells.push(infestor.create('infestor.Element',{ cssClsElement: this.cssClsElementInlineBlock  + ' ' + this.cssClsNodeSpaceCell }).renderTo(this));
	
		return this;
	},
	
	createNodeSwitchCell : function(){
	
		var cssCls = this.isExpand ? this.cssClsNodeExpandSwitchCell : this.cssClsNodeCollapseSwitchCell;
	
		this.switchCell = infestor.create('infestor.Element',{ cssClsElement: this.cssClsElementInlineBlock  + ' ' + cssCls }).renderTo(this);
		
		return this;
	
	},
	
	createNodeCheckCell : function(){
	
		
		return this;
	
	},
	
	createNodeIconCell : function(){
	
		var cssCls = this.cssClsNodeExpandIconCell;
	
		this.iconCell = infestor.create('infestor.Element',{ cssClsElement: this.cssClsElementInlineBlock  + ' ' + cssCls }).renderTo(this);
		
		return this;
	
	},
	
	createNodeTextCell : function(){
	
		this.textCell = infestor.create('infestor.Element',{ cssClsElement: this.cssClsElementInlineBlock  + ' ' + this.cssClsNodeTextCell }).renderTo(this);
		
		return this;
	
	
	},
	

	
	// construct node
	
	createNode : function(opts){
	
		return infestor.create('infestor.widget.TreeNode',infestor.append({
		
			childNodes : [];
		
		},opts));
	
	},
	
	addChildNode : function(opts){
	
		return this.childNodes.push(this.createNode(infestor.append({
			
			parentNode : this,
			nodeDepth : this.nodeDepth + 1
			
		},opts)));
	
	},
	
	
	// manipulate node
	
	nodeExpand : function(){
	
	},
	
	
	nodeCollapse : function(){
	
	
	}

});