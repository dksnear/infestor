
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
				
		infestor.each(infestor.mgr.nsSrcMap,function(name,src){
		
			if(ignorePkg && /infestor.package.js/.test(src))
				return true;
			queue.push(this.hostParse(src));	
		
		},this);
		
		return queue;
		
	},
	
	getLoadedStyleQueue:function(){
	
		return infestor.map(infestor.mgr.styleSrcQueue,function(idx,src){ return this.hostParse(src); },this);
	},
	
	getClassTree:function(clsName){
	
		var cls,tree = {};
		
		clsName = (clsName || 'infestor.Event');
		cls = infestor.mgr.classMap[clsName];
		
		if(!cls) return tree;
		
		tree.name = cls.$clsName;
		tree.cls = cls;
		
		(function(parent){
		
			var caller = arguments.callee;
			
			if(!parent.cls.$extends || !parent.cls.$extends.length)
				return;
			
			parent.children = parent.children || [];
			
			infestor.each(parent.cls.$extends,function(){
			
				var child = {
				
					cls :this,
					name:this.$clsName
				
				};
				
				caller(child);
			
				parent.children.push(child);
			
			});
			
		
		})(tree);
		
		return tree;
	},
	
	printClassTree:function(clsName,detail,log){
	
		var tree = this.getClassTree(clsName);
			log = log || function(text){ console.log(text);  };
			toArray = function(o){ return infestor.isArray(o) ? o : [o];  };
			offsetMark = '    ';
			
		(function(parent,depth){
		
			var caller = arguments.callee;
			
			log(
				// offset mark
				infestor.genArray(depth-1,function(){ return offsetMark; }).join('') 
				// depth 
				+ depth 
				// title
				+ '-' 
				// class name
				+ parent.name
				// class rel (ns or cls)
				+ (detail && parent.cls.prototype.uses ? [' | rel:(',toArray(parent.cls.prototype.uses).join(','),')'].join('') : '')
				// class rel css
				+ (detail && parent.cls.prototype.cssUses ? [' | relCss:(',toArray(parent.cls.prototype.cssUses).join(','),')'].join('') : '')
			);
		
			if(!parent.children || !parent.children.length)
				return;
			
			infestor.each(parent.children,function(){
			
				caller(this,depth + 1);
			
			});
			
	
		})(tree,1);
		
	
	},
	
	printLoadedQueue:function(){
	
		infestor.print(this.getLoadedQueue.apply(this,arguments));
	
	},
	
	filePrintClassTree : function(fileName,clsName,detail){
		
		var content = '';
	
		this.printClassTree(clsName,detail,function(text){
		
			content = content + text + '\r\n';
		
		});
		
		this.filePrint(fileName,content);
	
	},
	
	filePrintLoadedQueue:function(fileName,opts){
	
		this.filePrint(fileName,this.getLoadedQueue(opts).join('\r\n'));
	
	},
	
	
	browserPrintClassTree : function(clsName,detail){

		var content = '';
		
		if(!this.isBlobSupport())
			return;
	
		this.printClassTree(clsName,detail,function(text){
		
			content = content + text + '\r\n';
		
		});
		
		window.open(URL.createObjectURL(new Blob([content])));
	
	},
	
	browserPrintLoadedQueue : function(opts){
	
		if(!this.isBlobSupport())
			return;
		
		window.open(URL.createObjectURL(new Blob([this.getLoadedQueue(opts).join('\r\n')])));
		
	},
	
	filePrint:function(fileName,content){
	
		if(!this.isBlobSupport())
			return;
	
		infestor.mgr.require('infestor.Dom',function(){
		
			infestor.Dom.a().attr({
			
				href:URL.createObjectURL(new Blob([content])),
				download:fileName
			
			}).fire('click');
		
		});
	
	},
	
	isBlobSupport:function(){
	
		var support = !!window.Blob
	
		if(!support) console.log('浏览器不支持blob对象!');
	
		return support;
	
	},
	
	hostParse:function(src){
	
		 if(!/^http:\/\//.test(src))
			return	location.protocol + '//' + location.host + '/' + src;
		
		return src;
	}
	
});