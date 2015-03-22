

infestor.define('infestor.tree.DataSet',{
	
	extend : 'infestor.DataSet',
	
	indicator : false,
	
	// 数据类型
	// 数组数据类型 array { id:'',pid:'',$text:'',...}
	// 树对象数据类型(不支持异步模式) tree { $text:'' ,children:[] ,..}
	type :'array',
	
	// 根节点数据父标识(数组数据模型)
	rootPId : '0',
	
	// 数据模型映射(数组数据模型)
	modelMap : {
	
		$nodeId : 'id',
		$parentNodeId: 'pId',
		$text : 'text',
		$root : 'root',
		$branch: 'branch',
		$leaf:'leaf',
		$hasChild:'hasChild'
	
	},
	
	// #rewrite
	
	init : function(){
	
		this.callParent();
	
	},
	
	initData : function(data){
	
		if(!this.data || !infestor.isArray(this.data))
			this.data = [];
	
		if(!data)	
			return this.data;
	
		if(this.type =='array')
			data = this.mapData(data);
		
		if(this.type == 'tree')
			data = this.object2array(data,true);
		
		if(this.remote || (this.loadConfig && this.loadConfig.remote))
			this.data = this.data.concat(data);
		else this.data = data;
		
		this.count = this.data.length;
		
		return data;
	
	},
	
	hasData : function(filter,map){
	
		if(!map || !filter)
			return this.callParent(filter);
		
		return this.callParent(this.mapData(filter,true));
	
	},
	
	setData : function(id,name,value){
	
		var rowData = this.searchData('$nodeId',id),newData={};
		
		if(infestor.isNull(rowData)) return false;
		
		if(rowData.$delete) return false;
		
		if(infestor.isString(name))
			newData[name] = value;
		else newData = infestor.append(newData,name);
		
		infestor.each(newData,function(name,value){
		
			if(!rowData.hasOwnProperty(name)) return true;	
			rowData[name] = value;
			rowData.rawData[this.modelMap[name]] = value;
		
		},this);
		
		if(!rowData.$add)
			rowData.$update = true;
			
		return rowData;
	},
		
	addData : function(rowData){
	
		if(!rowData) return null;
		
		rowData = this.callParent(rowData);
		
		!rowData.$$clearTag && (rowData.$add = true);
		
		return rowData;
	
	},
	
	getData : function(){
	
		var data = this.callParent();
		
		if(!data) return data;
		
		return this.reverse(data);
	
	},
	
	// 按照数据模型格式化一个数据行
	mapData : function(rawData,strict) {
		
		var set = [],rowData = strict ? {} : {
		
			rawData : rawData
		
		};
	
		if(infestor.isArray(rawData))
			return infestor.each(rawData,function(idx,rawData){
				
				set.push(this.mapData(rawData));
			
			},this),set;
			
		this.reverseModelMap = this.reverseModeMap || infestor.kvSwap(this.modelMap);
			
		return infestor.each(rawData,function(name,data){
		
			if(this.reverseModelMap.hasOwnProperty(name))
				return rowData[this.reverseModelMap[name]] = data,true;
			
			rowData[name] = data;
		
		},this),rowData;
	
	},
	
	// #new
	
	// @keyword 关键字
	// @range 搜寻字段数据对象中数据元素的有效键名数组
	// @persistent(bool) 将搜寻结果持久化为当前数据集中的数据对象
	// @mode(regexp|*) regexp 关键字识别为正则表达式字符串 * 关键字识别为一般字符串
	filterData : function(keyword,range,mode,persistent){
		
		var data = this.data,
			matchedData,
			rangeMap,
			parentNodesMap = {},
			parentNodesData = [],
			kwfr;
		
		if(!data || data.length < 1) return [];
		
		kwfr = keyword && (mode == 'regexp' ? new RegExp(keyword,'ig')
			: new RegExp(String(keyword).replace(/(\[|\]|\(|\)|\$|\^|\?|\*|\+|\.|\||\:|\=|\\|\!|\{|\}|\,)/g,'\\$1'),'ig'));
		
		if(!kwfr) return [];
			
		range = range && (infestor.isArray(range) ? range : [range]);
		
		if(range) (rangeMap = {}) && infestor.each(range,function(){ rangeMap[String(this)] = true ; });
		
		if(!range) rangeMap = { $text: true };
		
		matchedData = infestor.filter(data,function(idx,obj){
			
			var matched = false;
			
			if(!obj.rawData)
				return false;
			
			infestor.each(rangeMap,function(name){
																
				if(!infestor.isString(obj.rawData[name]))
					return true;
				
				if(obj.rawData[name].match(kwfr))
					return matched = true,false;
				
			},this);
			
			return matched;
			
		},this);
		
		if(matchedData.length < 1){
			
			if(persistent){
				
				this.data = [];
				this.count = 0;
			}
			
			return [];
		}
			
		infestor.each(matchedData,function(idx,row){
						
			(function(row){

				var caller = arguments.callee;
			
				infestor.each(data,function(idx,obj){ 
			
					 if(obj.$nodeId == row.$parentNodeId){
						 
						if(parentNodesMap[obj.$nodeId])
							 return false;
						 
						parentNodesMap[obj.$nodeId] = true;
						parentNodesData.push(obj);
						caller(obj);
						return false
					
					 }
						 
				});
				
			})(row);
				
		});
		
		data = matchedData.concat(parentNodesData);
		
		if(persistent){
			
			this.data = data;
			this.count = this.data.length;
		}
		
		return data;
		
	},
	
	deleteData : function(id,force){
	
		var rowData = this.searchData('$nodeId',id);
		
		if(infestor.isNull(rowData)) return false;
		
		if(force || rowData.$add)
			return this.removeData(rowData.$floatIdx);
			
		if(rowData.$update)
			delete rowData.$update;
		
		return rowData.$delete = true,rowData;
		
	},
	
	clearDataTag : function(){
	
		infestor.each(this.data,function(idx,row){
		
			if(row.$$depth)
				delete row.$$depth;
			if(row.$add)
				delete row.$add;
			if(row.$update)
				delete row.$update;
			if(row.$delete){
				delete row.$delete;
				row.$unusable = true;
			}
		
		});
		
		this.removeData(function(idx,row){
		
			return row.$unusable;
			
		});
	
	},
	
	getSubmitParams : function(uncoded){
	
		var set = [];
		
		infestor.each(this.data,function(idx,row){
		
			row = this.reverse(row);
			if(row.$add || row.$update || row.$delete)
				set.push(row);
		
		},this);
		
		if(uncoded) return set;
		
		return { data : infestor.jsonEncode(set) };
	
	},
	
	// 按照数据模型反格式化一个数据行
	reverse : function(rowData){
	
		var set = [],data = {};
	
		if(infestor.isArray(rowData))
			return infestor.each(rowData,function(idx,row){  set.push(this.reverse(row));   },this),set;
		
		rowData.$add && (data.$add = rowData.$add);
		rowData.$update && (data.$update = rowData.$update);
		rowData.$delete && (data.$delete = rowData.$delete);
		rowData.$$depth && (data.$$depth = rowData.$$depth);
		
		infestor.append(data,rowData.rawData);
		
		return data;
	
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
		
		data = this.mapData(data);
		
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
			
				o[this.modelMap.$parentNodeId] =  pNodeId || this.rootPId;
				o[this.modelMap.$nodeId] = nodeId = String(genId++);
				
				o = infestor.appendIf(o,node,['children'],null,true);
				
				map && (o = this.mapData(o));
					
				data.push(o);
			}
			
			node.children && node.children.length && infestor.each(node.children,function(){
			
				caller.call(scope,this,nodeId);
			
			});
			
		
		}).call(this,node,this.rootPId);
		
		
		return data;
	
	},
	
	// simulate remote load
	simulateLoad:function(opts){
		
		var data,params;
		
		if(this.remote || this.loadConfig.remote)
			return false;
		
		this.emit('beforeLoad',[opts],this);
		
		if(!opts.params || !this.data)
			return this.emit('load',[this.data || [],{}],this);
		
		params = infestor.appendIf({},opts.params,function(name){ return !/^\$/.test(name);  });
		
		params = this.mapData(params,true);
		
		data = infestor.filter(this.data,function(idx,obj){
			
			var matched = true;
			
			infestor.each(params,function(name,value){
				
				if(obj[name] != value)
					return matched = false;
				
			},this);
			
			return matched;
			
		},this);
		
		infestor.delay(function(){
			
			this.emit('load',[data,opts.params],this);
			
		},200,this);
		
		// this.emit('load',[data,opts.params],this);
		
		return true;
		
	}
	

});