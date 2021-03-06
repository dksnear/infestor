

// hash[#]导航管理类
// [uri]?[qs]#[hash-uri]?[hash-qs]

infestor.define('infestor.HashManager', {

	extend : 'infestor.Object',
	
	// 存放已初始化的页面对象[map]
	pages: null,
	
	// 存放当前视图展示的页面名称
	currentPageName : '',
	
	// 存放主页面名称
	mainPageName : '',
	
	events : {

		beforehashchange: null,
		afterhashchange: null
	},

	// @private #rewrite
	init : function(){
		
		this.pages = {};
		this.initEvents();
		
	},
	
	// @private #rewrite
	initEvents : function(){
		
		var me = this;
		
		infestor.addEventListener(window,'hashchange',function(){
			
			var hash = location.hash;
			
			me.emit('beforehashchange',[null,null],me);
			
			if(!hash)
				return me.redirect(name,hargs,null,function(page){			
					me.emit('afterhashchange',[page],me);	
				});
			
			var	match = hash.match(/^#(.*?)(\?.*)$/);
			var	huri = match && match[1] || hash.match(/#(.*)/)[1];
			var	hargs = match && match[2];
			var	hargs = hargs && infestor.param(hargs);
			var	name = huri.replace(/\//g,'.').substr(1);
			
			me.redirect(name,hargs,null,function(page){			
				me.emit('afterhashchange',[page,huri,hargs],me);	
			});
			
			
		});
	},
	
	// @private 
	loadPage : function(name,opts,callback){
		
		var me = this;
		
		infestor.Loader.loadClass(name,function(){
			
			callback.call(me,infestor.create(name,infestor.append({ hashManager:me },opts)));
			
		});
		
	},
	
	// @public
	redirect : function(name,args,opts,callback,isMain){
		
		var page,cpage,show = function(){
			
			this.pages[name] = page;
			this.currentPageName = name;
			cpage && cpage.hide();
			page.show(args);
			this.mainPageName = this.mainPageName || name;
			this.mainPageName = isMain && name || this.mainPageName;
			callback && callback.call(this,page);
		};

		if(!name) return;
		
		if(name == this.currentPageName)
			return;
		
		cpage = this.pages[this.currentPageName];		
		page = this.pages[name];
		
		if(page) return show.call(this);
		
		this.loadPage(name,opts,function(newPage){
			
			page = newPage;
			show.call(this);
			
		});
		
	},
	
	// @public
	hashRedirect : function(name){
		
		location.hash = '#/'+name.replace(/\./g,'/');
	},
	
	// @public #rewrite
	destroy:function(){
	
		infestor.each(this.pages,function(){ this.destroy(); });
		this.pages = null;
		return this.callParent();
	}

});
