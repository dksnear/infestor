

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

		hashchange:null
	},

	init : function(){
		
		this.pages = {};
		this.initEvents();
		
	},
	
	initEvents : function(){
		
		var me = this;
		
		infestor.addEventListener(window,'hashchange',function(){
			
			var hash = location.hash;
			
			if(!hash){
				
				me.redirect(me.mainPageName);
				me.emit('hashchange',[huri,hargs],me);
				return;
			}
			
			var	match = hash.match(/^#(.*?)(\?.*)$/);
			var	huri = match && match[1] || hash.match(/#(.*)/)[1];
			var	hargs = match && match[2];
			var	hargs = hargs && infestor.param(hargs);
			var	name = huri.replace(/\//g,'.').substr(1);
			
			me.emit('hashchange',[huri,hargs],me);
			
			me.redirect(name,hargs);
			
		});
	},
	
	loadPage : function(name,opts,callback){
		
		var me = this;
		
		infestor.Loader.loadClass(name,function(){
			
			callback.call(me,infestor.create(name,infestor.append({ hashManager:me },opts)));
			
		});
		
	},
	
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
		
	}

});
