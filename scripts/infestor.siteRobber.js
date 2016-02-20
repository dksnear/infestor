

// support chrome only

infestor.define('infestor.SiteRobber',{
	
	uses : ['infestor.Dom'],

	statics : {

		domainMap : {
			
			'http://www.ed2000.com' : 'ed2k',
			'http://tjjd.avicsec.com' : 'avicsec tjjd'
			
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
				
			},
			
			'avicsec tjjd' : {
				
				showWeight : function(){
					
					var radios = infestor.Dom.query('input[type=radio]');
					// var score = infestor.Dom.span().css('color','red').appendTo(infestor.Dom.get(infestor.Dom.query('.hdjl h2')[0]));		
					var score = infestor.Dom.div().css({
						
						color : 'red',
						position : 'fixed',
						top : '100px',
						right : '0'
						
					}).appendTo(infestor.Dom.getBody());		
					
					var handle = function(e){
						
						if(e.target.tagName.toLowerCase() != 'input')
							return;
						
						var p = 0;
						
						radios.forEach(function(el){
							
							if(el.checked)
								p += Number(infestor.Dom.use(el).val());
							
						});
						
						score.text(p);
					};
					
					radios.forEach(function(el){
						
						el = infestor.Dom.get(el);
						infestor.Dom.span().css({
							
							color : 'red',
							paddingLeft : '2px'
							
						}).text(el.val()).insertAfter(el.next(3));
					});
					
					infestor.Dom.use(infestor.Dom.query('.hdjl_tab')[0]).un('click',handle).on('click',handle);
					
				}
				
			}
			
		},
		
		exec : function(domain,action){
			
			var handler = this.handlers[this.domainMap[domain] || domain];
			
			handler = handler && handler[action];
			
			if(!handler) return false;
			
			return handler.apply(handler,Array.prototype.slice.call(arguments,2));
		},
		
		qExec : function(action){
			
			return this.exec.apply(this,[[location.protocol,location.host].join('//')].concat(Array.prototype.slice.call(arguments)));
		},
		
		aExec : function(){
			
			var domain = [location.protocol,location.host].join('//');
			var handlers = this.handlers[this.domainMap[domain] || domain];
			
			if(!handlers) return false;
			
			infestor.each(handlers,function(){ infestor.isFunction(this) && this.call(handlers);  });
			
			return true;
				
		}

	}
	
});