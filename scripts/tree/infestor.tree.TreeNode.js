infestor.define('infestor.tree.TreeNode',{

	alias : 'treenode',

	extend : 'infestor.Element',

	cssUses : 'infestor.Grid',

	cssClsElement : 'infestor-tree-node',
	
	cssClsNodeCell : 'infestor-tree-node-cell',

	cssClsNodeSpace : 'infestor-tree-node-space',
	
	cssClsNodeSwitch : 'infestor-tree-node-switch',
	
	cssClsNodeExpandSwitch : 'infestor-tree-node-expand-switch',
	
	cssClsNodeCollapseSwitch : 'infestor-tree-node-collapse-switch',

	cssClsNodeNonSwitch : 'infestor-tree-node-non-switch',
	
	cssClsNodeCheck : 'infestor-tree-node-check',
	
	cssClsNodeIcon :'infestor-tree-node-icon',
	
	cssClsNodeExpandIcon : 'infestor-tree-node-expand-icon',
	
	cssClsNodeCollapseIcon : 'infestor-tree-node-collapse-icon',
	
	cssClsNodeNormalIcon : 'infestor-tree-node-normal-icon',
	
	cssClsNodeLoadingIcon : 'infestor-tree-node-loading-icon',

	cssClsNodeText : 'infestor-tree-node-text',
	
	cssClsNodeFocus : 'infestor-tree-node-focus',
	
	nodeSpaceCells : null,
	
	nodeSwitchCell : null,
	
	nodeCheckCell : null,
	
	nodeIconCell : null,
	
	nodeTextCell : null,

	// ������� ��1��ʼ
	nodeDepth : 1,
	
	isRoot : false,
	
	isBranch : false,
	
	isLeaf : true,

	isLast : true,
	
	isExpand : false,
	
	isCollapse : true,
	
	// �첽���ؽڵ����
	isLoaded : false,
	
	isFocus : false,
	
	nodeId : null,
	
	parentNodeId : null,
	
	parentNode : null,
	
	previousSiblingNode : null,
	
	nextSiblingNode : null,
	
	lastChildNode : null,
	
	childNodes : null,

	// rewite
	
	initElement : function(){
	
		this.callParent();
		
		this.createNodeSpaceCells().createNodeSwitchCell().createNodeCheckCell().createNodeIconCell().createNodeTextCell();
		this.changeNodeIcon().changeNodeSwitchIcon();
		
	
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
		
		return this;
	},
	
	// ui construct
	
	
	createNodeSpaceCells : function(){
	
		this.nodeSpaceCells = this.nodeSpaceCells || [];
		
		for(var i=0;i<this.nodeDepth-1;i++)
			this.nodeSpaceCells.push(infestor.create('infestor.Element',{ cssClsElement: [this.cssClsElementInlineBlock,this.cssClsNodeCell,this.cssClsNodeSpace].join(' ') }).renderTo(this));
	
		return this;
	},
	
	createNodeSwitchCell : function(){
	
		this.nodeSwitchCell = infestor.create('infestor.Element',{ cssClsElement: [this.cssClsElementInlineBlock,this.cssClsNodeCell,this.cssClsNodeSwitch].join(' ') }).renderTo(this);
		
		return this;
	
	},
	
	createNodeCheckCell : function(){
	
		
		return this;
	
	},
	
	createNodeIconCell : function(){
	
		var cssCls = this.cssClsNodeExpandIcon;
	
		this.nodeIconCell = infestor.create('infestor.Element',{ cssClsElement: [this.cssClsElementInlineBlock,this.cssClsNodeCell,this.cssClsNodeIcon].join(' ') }).renderTo(this);
		
		return this;
	
	},
	
	createNodeTextCell : function(){
	
		this.nodeTextCell = infestor.create('infestor.Element',{ cssClsElement: this.cssClsElementInlineBlock  + ' ' + this.cssClsNodeText }).renderTo(this);
		
		return this;
	
	
	},
	
	changeNodeIcon :function(loading){
	
		var cls = '';
		
		this.isLeaf && (cls = this.cssClsNodeNormalIcon);
		(this.isBranch || this.isRoot) && this.isExpand && (cls = this.cssClsNodeExpandIcon);
		(this.isBranch || this.isRoot) && this.isCollapse && (cls = this.cssClsNodeCollapseIcon);
	
		loading && !this.isRoot && (cls = this.cssClsNodeLoadingIcon);
	
		if(cls && this.currentNodeIconCls == cls)
			return this;
	
		this.nodeIconCell && this.nodeIconCell.element.removeClass(this.currentNodeIconCls || '').addClass(cls);
		
		this.currentNodeIconCls = cls;
		
		return this;
		
	},
	
	changeNodeSwitchIcon:function(){
	
		var cls = '';
		
		this.isLeaf && (cls = this.cssClsNodeNonSwitch);
		(this.isBranch || this.isRoot) && this.isExpand && (cls = this.cssClsNodeExpandSwitch);
		(this.isBranch || this.isRoot) && this.isCollapse && (cls = this.cssClsNodeCollapseSwitch);
		
		if(cls && this.currentNodeSwitchCls == cls)
			return this;
		
		this.nodeSwitchCell && this.nodeSwitchCell.element.removeClass(this.currentNodeSwitchCls || '').addClass(cls);
	
		this.currentNodeSwitchCls = cls;
		
		return this;
	},
	
	focus:function(){
	
		if(this.isFocus)
			return this;
		
		this.nodeIconCell.element.addClass(this.cssClsNodeFocus);
		
		this.isFocus = true;
		
		return this;
	
	},
	
	blur:function(){
	
		if(!this.isFocus)
			return this;
		
		this.nodeIconCell.element.removeClass(this.cssClsNodeFocus);
		
		this.isFocus = false;
		
		return this;
	
	},
	
	// construct node
	
	
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
		
		this.childNodes.push(node);
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
	
		this.emit('addChildNode',[this,node]);
		
		return node;
		
	
	},
	
	
	// ɾ��һ���ڵ��ʶΪ@nodeId�ӽڵ�
	// @nodeIdΪ����ɾ�����һ���ӽڵ�
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
		
		if(node.isBranch){
		
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
			this.lastChildNode.isLast = true;
		}
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
		
		this.emit('removeChildNode',[this,node]);
		
		return node;
	
	},
	
	removeNode:function(){
	
		if(this.parentNode)
			return this.parentNode.removeChildNode(this.nodeId);
		
		this.eachChildNodes(function(node,pnode){
		
			pnode.emit('removeChildNode',[pnode,node]);
		
		});
		
		return this;
	
	},
		
	// manipulate node
	
	// ��Ѱ�ڵ�������ӽڵ�
	eachChildNodes : function(fn,scope){
	
		if(!fn) return this;
		 
		this.childNodes && this.childNodes.length>0 && infestor.each(this.childNodes,function(idx,node){
			
			// 'this' is pnode
			fn.call(scope,node,this);
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
	
		if(this.isExpand || this.isLeaf) return;
	
		this.isExpand = true;
		this.isCollapse = false;
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
		
		this.emit('nodeExpand',this);
	
	},
	
	
	nodeCollapse : function(){
	
		if(this.isCollapse || this.isLeaf) return;
	
		this.isCollapse = true;
		this.isExpand = false;
		
		this.changeNodeIcon();
		this.changeNodeSwitchIcon();
		
		this.emit('nodeCollapse',this);
	}

});