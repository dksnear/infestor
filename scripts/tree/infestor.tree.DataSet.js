

infestor.define('infestor.tree.DataSet',{


	extend : 'infestor.DataSet',
	
	indicator : false,
	
	// 数据类型
	// 数组数据类型 array { id:'',pid:'',$text:'',...}
	// 树对象数据类型(不支持异步模式) tree { $text:'' ,children:[] ,..}
	type :'array',
	
	// 根节点数据父标识(数组数据模型)
	rootPId : '0',
	
	// 数据模型(数组数据模型)
	model : {
	
		$nodeId : 'id',
		$parentNodeId: 'pId',
		$text : 'text'
	
	},
	
	init : function(){
	
		this.callParent();
	
	},	
	
	setData : function(data){
	
		if(this.type =='array')
			return this.map(data);
		
		if(this.type == 'tree')
			return this.object2array(data,true);
	},
	
	// 按照数据模型格式化一个数据行
	map : function(rowData) {
		
		var set = [],o = {
		
			rawData : rowData
		
		};
	
		if(infestor.isArray(rowData))
			return infestor.each(rowData,function(idx,rowData){
				
				set.push(this.map(rowData));
			
			},this),set;
			
		this.$modelMap = this.$modeMap || infestor.kvSwap(this.model);
			
		return infestor.each(rowData,function(name,data){
		
			if(this.$modelMap.hasOwnProperty(name))
				return o[this.$modelMap[name]] = data,true;
			
			o[name] = data;
		
		},this),o;
	
	},
	
	// 按照数据模型反格式化一个数据行
	reverse : function(rowData){
	
		if(infestor.isArray(rowData))
			return infestor.map(rowData,function(){  return this.rawData; });
		
		return rowData.rawData;
	
	},
	
	// 将数组型数据结构转换为树型对象数据结构
	array2object : function(data,rootPId) {
	
		var data = data || this.data,rootNode,getNode = function(pId){
		
			var node,i=0,len = data.length;
		
			for(;i<len;i++){
			
				if(data[i].$parentNodeId === pId)
				    return node = data.splice(i,1)[0] || false;
			}
			
			return false;
		
		};
		
		if(!infestor.isArray(data)) return [];
		
		data = this.map(data);
		
		rootNode = getNode(rootPId || this.rootPId);
		
		(function(node){
		
			var child;
		
			while((child = getNode(node.$nodeId))!==false){
			
				node.children = node.children || [];
				node.children.push(child);
				arguments.callee(child);
			}
		
		})(rootNode);
		
		
		return rootNode;
		
	
	},

	// 将树型对象数据结构转换为数组型数据结构
	object2array : function(node,map){
	
		var data = [],genId = 0;
		
		(function(node,pNodeId){
		
			var caller = arguments.callee,o={},scope = this,nodeId;
		
			node.rawData && data.push(node.rawData);
			
			if(!node.rawData){
			
				o[this.model.$parentNodeId] =  pNodeId || this.rootPId;
				o[this.model.$nodeId] = nodeId = String(genId++);
				
				o = infestor.appendIf(o,node,['children'],null,true);
				
				map && (o = this.map(o));
					
				data.push(o);
			}
			
			node.children && node.children.length && infestor.each(node.children,function(){
			
				caller.call(scope,this,nodeId);
			
			});
			
		
		}).call(this,node,this.rootPId);
		
		
		return data;
	
	}
	

});