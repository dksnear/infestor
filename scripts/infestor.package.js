
infestor.namespace('infestor.package',{

	getLoadedQueue:function(opts){
	
		var queue = [],opts = opts || {};
		
		!opts.ignoreBase && queue.push(infestor.mgr.convertToPath('infestor'));  
		queue = queue.concat(this.getLoadedNsQueue(opts.ignorePkg)).concat(this.getLoadedClassQueue());
		!opts.ignoreStyle && (queue = queue.concat(this.getLoadedStyleQueue()));
	
		return queue;
	
	},

	getLoadedClassQueue:function(){
	
		return infestor.map(infestor.mgr.classDefineOrderQueue,function(idx,name){
		
			return this.hostParse(infestor.mgr.srcMap[name]);
		
		},this);

	},
	
	getLoadedNsQueue:function(ignorePkg){
	
		var queue = [];
		
		infestor.each(infestor.Loader.loadedMap,function(idx,src){
		
			if(!/.js$/.test(src) || infestor.mgr.srcMap[src])
				return true;
			if(ignorePkg && /infestor.package.js/.test(src))
				return true;
			
			queue.push(this.hostParse(src));
		
		},this);
		
		return queue;
		
	},
	
	getLoadedStyleQueue:function(){
	
		return infestor.map(infestor.mgr.styleSrcQueue,function(idx,src){ return this.hostParse(src); },this);
	},
	
	getRelationship:function(){
	
	
	},
	
	hostParse:function(src){
	
		 if(!/^http:\/\//.test(src))
			return	location.protocol + '//' + location.host + '/' + src;
		
		return src;
	}
	
});