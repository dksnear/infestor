

// 

infestor.namespace('infestor.siteRobber',{

	siteMap : {
		
		'http://www.ed2000.com' : 'ed2k'
		
	},
	
	handlers : {
		
		'ed2k' : {
			
			grab : function(){
				
				return Array.prototype.slice.call(document.querySelectorAll('.CommonListCell a')).filter(function(item){
	
					return /(?!.*\.rmvb)^ed2k:\/\//.test(item.getAttribute('href'));
					
				}).map(function(item){
					
					return item.getAttribute('href');
					
				});
			}
			
		}
		
	},
	
	exec : function(site,action){
		
		var handler = this.handlers[this.siteMap[site] || site];
		
		handler = handler && handler[action];
		
		if(!handler) return false;
		
		return handler.apply(handler,Array.prototype.slice.call(arguments,2));
	},
	
	qexec : function(action){
		
		return this.exec.apply(this,[[location.protocol,location.host].join('//')].concat(Array.prototype.slice.call(arguments)));
	}

});