infestor.define('infestor.tree.TreeNode',{

	alias : 'treenode',

	extend : 'infestor.Element',

	cssUses : 'infestor.grid',

	cssClsElement : 'infestor-tree-node',

	cssClsNodeCell : 'infestor-tree-node-cell',

	cssClsNodeSpace : 'infestor-tree-node-space',
	
	cssClsNodeSwitch : 'infestor-tree-node-switch',
		
	cssClsNodeLoadingSwitch : 'infestor-tree-node-loading-switch',
	
	cssClsNodeNonSwitchIcon : 'infestor-tree-node-non-switch-icon',
	
	cssClsNodeCheck : 'infestor-tree-node-check',
	
	cssClsNodeIcon :'infestor-tree-node-icon',

	cssClsNodeLoadingIcon : 'infestor-tree-node-loading-icon',

	cssClsNodeText : 'infestor-tree-node-text',
	
	nodeSpaceCells : null,
	
	nodeSwitchCell : null,
	
	nodeCheckCell : null,
	
	nodeIconCell : null,
	
	nodeTextCell : null,

	// 树的深度 从1开始
	nodeDepth : 1,
	
	// 节点前置空格偏移值
	nodeFloatSpace : 0,
	
	isRoot : false,
	
	// 控制分支节点的图标显示
	isBranch : false,
	
	// 控制叶节点的图标显示
	isLeaf : true,

	isLast : true,
	
	isExpand : false,
	
	isCollapse : true,
	
	// 正在异步加载
	isLoading : false,
	
	// 异步加载完成
	isLoaded : false,
	
	isFocus : false,
	
	// 控制节点开关的显示
	hasChild : false,
	
	nodeId : null,
	
	parentNodeId : null,
	
	parentNode : null,
	
	previousSiblingNode : null,
	
	nextSiblingNode : null,
	
	lastChildNode : null,
	
	childNodes : null,
	
	itemLayout:'table',

	// rewite
	
	initItems : function(){
		
		this.callParent();
		this.createNodeSpaceCells().createNodeSwitchCell().createNodeCheckCell().createNodeIconCell().createNodeTextCell();
		this.refreshIcon();
	},
	
	initEvents : function(){
	
		this.delegate(this,'click',true,function(inst,e){
		
			var type;
		
			if(!inst || !inst.element) return;
					
			if(inst.element.hasClass(this.cssClsNodeSwitch))
				(type = 'switch') && this.emit('nodeSwitchClick',[inst,e,this]);
			
			if(inst.element.hasClass(this.cssClsNodeIcon))
				(type = 'icon') && this.emit('nodeIconClick',[inst,e,this]);
			
			if(inst.element.hasClass(this.cssClsNodeText))
				(type = 'text') && this.emit('nodeTextClick',[inst,e,this]);
				
			this.emit('nodeClick',[type,inst,e,this]);
			
		
		},this);
		
		return this;
	
	},
	
	setText : function (text) {

		this.text = infestor.isUndefined(text) ? this.text : text;
		this.nodeTextCell.setText(this.text);
		
		this.nodeTextCell.element.attr('title',this.text);
		
		return this;
	},
	
	setSearchText : function(searchText,searchTextMode){
	
	  	return this.nodeTextCell.setSearchText(searchText,searchTextMode);
	},
	
	// ui construct
	
	createNodeSpaceCells : function(){
	
		var i=0,len = this.nodeDepth - 1 + this.nodeFloatSpace;
	
		this.nodeSpaceCells = this.nodeSpaceCells || [];
		
		for(; i<len; i++)
			this.nodeSpaceCells.push(this.addItem({ cssClsElement: [this.cssClsNodeCell,this.cssClsNodeSpace].join(' ') }));
	
		return this;
	},
	
	createNodeSwitchCell : function(){
	
		this.nodeSwitchCell = this.addItem({ cssClsElement: [this.cssClsNodeCell,this.cssClsNodeSwitch].join(' ') });
		
		return this;
	
	},
	
	createNodeCheckCell : function(){
	
		
		return this;
	
	},
	
	createNodeIconCell : function(){
	
		var cssCls = this.cssClsNodeExpandIcon;
	
		this.nodeIconCell = this.addItem({ cssClsElement: [this.cssClsNodeCell,this.cssClsNodeIcon].join(' ') });
			
		return this;
	
	},
	
	createNodeTextCell : function(){
	
		this.nodeTextCell = this.addItem({ cssClsElement: this.cssClsNodeText });
		
		return this;

	},
	
	refreshIcon : function(){
	
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
	
	},
	
	changeNodeIcon :function(){
		
		// normal
		this.isLeaf && this.nodeIconCell.setIcon('document');
		// expand
		(this.isBranch || this.isRoot) && this.isExpand && this.nodeIconCell.setIcon('folder'); 
		// collapse
		(this.isBranch || this.isRoot) && this.isCollapse && this.nodeIconCell.setIcon('portfolio'); 
			
		return this;
		
	},
	
	changeNodeSwitchIcon:function(){
	
		!this.isLoading && this.nodeSwitchCell.element.removeClass(this.cssClsNodeLoadingSwitch);
		
		// normal
		!(this.hasChild || this.isBranch) && this.nodeSwitchCell.element.addClass(this.cssClsNodeNonSwitchIcon);
		
		// expand
		(this.hasChild || this.isBranch) && this.isExpand && this.nodeSwitchCell.element.removeClass(this.cssClsNodeNonSwitchIcon) && this.nodeSwitchCell.setIcon('down');
		 
		// collapse
		(this.hasChild || this.isBranch) && this.isCollapse && this.nodeSwitchCell.element.removeClass(this.cssClsNodeNonSwitchIcon) && this.nodeSwitchCell.setIcon('front');
		
		// loading
		this.isLoading && !this.isRoot && this.nodeSwitchCell.element.cssClear('background-position').removeClass(this.cssClsNodeNonSwitchIcon).addClass(this.cssClsNodeLoadingSwitch);
		
		
		return this;
	},
	
	focus:function(){
	
		if(this.isFocus)
			return this;
		
		this.nodeIconCell.element.addClass(this.cssClsGlobalIconFocus16);
		
		this.isFocus = true;
		
		return this;
	
	},
	
	blur:function(){
	
		if(!this.isFocus)
			return this;
		
		this.nodeIconCell.element.removeClass(this.cssClsGlobalIconFocus16);
		
		this.isFocus = false;
		
		return this;
	
	},
	
	//# construct node
	
	addChildNode : function(node){
	
	
		if(!node instanceof infestor.tree.TreeNode) 
			return false;
	
		this.childNodes = this.childNodes || [];
		
		node.parentNodeId = this.nodeId;
		node.nodeDepth = this.nodeDepth + 1;
		node.parentNode = this;
		node.previousSiblingNode = this.isBranch ? this.childNodes[this.childNodes.length-1] : null;	
		node.previousSiblingNode && (node.previousSiblingNode.nextSiblingNode = node) && (node.previousSiblingNode.isLast = false);
		
		
		this.lastChildNode = node;
		this.isBranch = true;
		this.isLeaf = false;
		this.hasChild = true;
		
		this.childNodes.push(node);
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
	
		this.emit('addNode',[this,node]);
		
		return node;
		
	
	},

	// 删除一个节点标识为@nodeId子节点
	// @nodeId为空则删除最后一个子节点
	removeChildNode : function(nodeId){
	
		var i=0,len,node;
		
		if(!this.childNodes) return false;
		
		len = this.childNodes.length;
		
		if(nodeId){
		
			for(;i<len;i++){
			
				if(this.childNodes[i].nodeId == nodeId){
					node = this.childNodes.splice(i,1)[0];
					break;
				}
			}
		}
		
		if(!nodeId) 
			node = this.childNodes.pop();
		
		
		if(!node) return false;
		
		if(node.hasChild && node.childNodes){
		
			len = node.childNodes.length;
			while(len){
			
				node.removeChildNode(null);
				len--;
			}
		
		};
						
		node.nextSiblingNode && (node.nextSiblingNode.previousSiblingNode = node.previousSiblingNode);
		
		node.previousSiblingNode && (node.previousSiblingNode.nextSiblingNode = node.nextSiblingNode);
		
		if(node.isLast) {
		
			this.lastChildNode = node.previousSiblingNode;
			this.lastChildNode && (this.lastChildNode.isLast = true);
			!this.lastChildNode && (this.hasChild = false);
		}
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
		
		this.emit('removeNode',[this,node]);
		
		return node;
	
	},
	
	removeNode:function(){
	
		if(this.parentNode)
			return this.parentNode.removeChildNode(this.nodeId);
				
		this.eachChildNodes(function(node,pnode){
		
			pnode.emit('removeNode',[pnode,node]);
		
		});
		
		this.emit('removeNode',[null,this]);
		
		return this;
	
	},
		
	// manipulate node
	
	// 搜寻节点的所有子节点
	eachChildNodes : function(fn,scope){
	
		if(!fn) return this;
		 
		this.childNodes && this.childNodes.length>0 && infestor.each(this.childNodes,function(idx,node){
			
			// 'this' is pnode
			if(fn.call(scope,node,this) === false)
				return false;
			node.eachChildNodes(fn,scope);
			
		},this);
			
		return this;
			
	
	},
	
	getFinalNode : function(){
	
		var last = this.lastChildNode,pre = null;
		
		while(last){
			pre = last;
			last = last.lastChildNode;
		}
		
		return pre;
	
	},
	
	nodeExpand : function(){
	
		if(this.isExpand || !(this.hasChild || this.isBranch) || this.isLoading) return;
	
		this.isExpand = true;
		this.isCollapse = false;
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
		
		this.emit('nodeExpand',this);
	
	},
		
	nodeCollapse : function(){
	
		if(this.isCollapse || !(this.hasChild || this.isBranch) || this.isLoading) return;
	
		this.isCollapse = true;
		this.isExpand = false;
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
		
		this.emit('nodeCollapse',this);
	}

});