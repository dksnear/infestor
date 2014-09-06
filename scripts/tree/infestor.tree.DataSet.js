

infestor.define('infestor.tree.DataSet',{


	extend : 'infestor.DataSet',
	
	// 数据模型类型
	// 数组数据模型 array { id:'',pid:'',text:'',...}
	// 树对象数据模型 tree { text:'' ,children:[] ,..}
	type :'array',
	
	// 根节点数据父标识(数组数据模型)
	rootPId : '0',
	
	// 数据模型 (数组数据模型)
	model : {
	
		id : 'id',
		pId : 'pId',
		text : 'text'
	
	},
	
	init : function(){
	
		this.callParent();
	
	},
	
	// 按照数据模型格式化一个数据行
	map : function(rowData) {
		
		var set = [];
	
		if(infestor.isArray(rowData))
			return infestor.each(rowData,function(idx,rowData){
				
				set.push(this.map(rowData));
			
			},this),set;
	
		return {
		
			id : rowData[this.model.id],
			pId : rowData[this.model.pId],
			text : rowData[this.model.text],
			rawData : rowData,
			children : []
		
		};
	
	},
	
	// 将数组型数据结构转换为树型对象数据结构
	format : function(data,rootPId) {
	
		var data = data || this.data,rootNode,getNode = function(pId){
		
			var node;
		
			for(var i=0;i<data.length;i++){
			
				if(data[i].pId === pId)
				    return node = data.splice(i,1)[0] || false;
			}
			
			return false;
		
		};
		
		if(!infestor.isArray(data)) return [];
		
		data = this.map(data);
		
		rootNode = getNode(rootPId || this.rootPId);
		
		(function(node){
		
			var child;
		
			while((child = getNode(node.id))!==false){
			
				node.children.push(child);
				arguments.callee(child);
			}
		
		})(rootNode);
		
		
		return rootNode;
		
	
	},

	// 将树型对象数据结构转换为数组型数据结构
	reverse : function(node){
	
		var data = [],genId = 0;
		
		(function(node,pNode){
		
			var caller = arguments.callee;
		
			node.rawData && data.push(node.rawData);
			
			!node.rawData && data.push(infestor.appendIf({
				
				pId : pNode && pNode.id || String(genId++),
				id : node.id || String(genId++)
						
			},node,['children'],null,true));
			
			node.children && node.children.length && infestor.each(node.children,function(){
			
				caller(this,node);
			
			});
			
		
		})(node,null);
		
		
		return data;
	
	}
	

});