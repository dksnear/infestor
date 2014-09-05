infestor.define('infestor.widget.TreeNode',{


	alias : 'treeNode',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget.Tree',

	cssClsElement : 'infestor-tree-node',

	cssClsNodeSpaceCell : '',
	
	cssClsNodeExpandSwitchCell : '',
	
	cssClsNodeCollapseSwitchCell : '',
	
	cssClsNodeCheckCell : '',
	
	cssClsNodeUnCheckCell : '',
	
	cssClsNodeHalfCheckCell : '' ,
	
	cssClsNodeExpandIconCell : '',
	
	cssClsNodeCollapseIconCell : '',
	
	cssClsNodeNormalIconCell : '',

	cssClsNodeTextCell : '',
	
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
	
	prarentNode : null,
	
	previousSiblingNode : null,
	
	nextSiblingNode : null,
	
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