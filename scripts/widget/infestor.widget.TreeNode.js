infestor.define('infestor.widget.TreeNode',{


	alias : 'treeNode',

	extend : 'infestor.Element',

	cssUses : 'infestor.widget.Grid',

	cssClsElement : 'infestor-grid-tree-node',

	// ������� ��1��ʼ
	depth:1,
	
	isRoot:false,
	
	isBranch:false,
	
	isLeaf:false,

	isLast:false,
	
	isExpand: true,
	
	isCollapse: false,
	
	prarentNode: null,
	
	previousNode: null,
	
	nextNode: null,
	
	childNodes:null

});