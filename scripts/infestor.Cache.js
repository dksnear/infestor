

//基本对象类

infestor.define('infestor.Cache', {

	alias : 'cache',

	extend : 'infestor.Object',
	
	// string:cookie|userData|localStorage
	cacheType: '',
	// init:unit(day)
	expires: 1,
	
	statics :{
	
		isStorageExpiresChecked : false,
		
		localStorageSupport : function(){
	
			try{
			
				return 'localStorage' in window && window.localStorage;
				
			}catch(e){
			
				return false;
			}

		},
	
        userDataSupport : function(){

			return document.documentElement.addBehavior;

		}
	
	},
	
	init:function(){
	
		this.setCacheType();
		this.cleanExpiresStorage();
	},
	
	// #public
	
	get:function(value){
	
		return (({
		
			userData:this.getUserData,
			localStorage:this.getStorage,
			cookie:this.getCookie
		
		})[this.cacheType] || function(){ return null;  }).apply(this,arguments);
	
	},
	
	set:function(key,value){
	
		return (({
		
			userData:this.setUserData,
			localStorage:this.setStorage,
			cookie:this.setCookie
		
		})[this.cacheType] || function(){ return null;  }).apply(this,arguments);
	
	},
	
	remove:function(key){
	
		return (({
		
			userData:this.removeUserData,
			localStorage:this.removeStorage,
			cookie:this.removeCookie
		
		})[this.cacheType] || function(){ return null;  }).apply(this,arguments);
	
	},
	
	clear:function(){
	
		return (({
		
			userData:this.clearUserData,
			localStorage:this.clearStorage,
			cookie:this.clearCookie
		
		})[this.cacheType] || function(){ return null;  }).apply(this,arguments);
	
	},
	
	// private #all
	
	setCacheType : function(type){
	
		this.cacheType = type || this.cacheType;
	
		if(this.cacheType && /localstorage|userData|cookie/.test(this.cacheType))
			return this.cacheType;
	
		if(this.statics.localStorageSupport())
			return this.cacheType = 'localStorage';
		
		if(this.statics.userDataSupport())
			return this.cacheType = 'userData';
		
		return this.cacheType = 'cookie';
	
	},
	
	serialize:function(value){
	
		return escape(infestor.jsonEncode(value));
	
	},
	
	deserialize:function(value){
	
		try{
		
			return infestor.jsonDecode(unescape(value));
			
		}catch(e){
		
			return null;
		}
	},
	
	formatExpires:function(date,utc){
	
		var d;

		if (infestor.isDate(date))
			d = date;

		if (infestor.isNumber(date)) {

			d = new Date();
			d.setTime(d.getTime() + (date * 24 * 60 * 60 * 1000));
		}
		
		if(utc) return d.toUTCString();

		return d;
	
	},
	
	// private #userData
	
	loadUserData:function(action,storageName){
	
		var loader,
			storageName = storageName || 'user_data_storage';
	
		if(!this.statics.userDataSupport() || !action)
			return false;
			
		try {
		
			loader = new ActiveXObject('htmlfile');
			loader.open();
			loader.write('<script>document.window = window;</script><iframe src="/favicon.ico"></iframe>');
			loader.close();
			loader = loader.window.frames[0].document;
			loader = loader.appendChild(loader.createElement('div'));
		
		} catch(e){
		
			loader = document.body.appendChild(document.createElement('div'));
		
		}
		
		loader.addBehavior('#default#userData');
		loader.expires = this.formatExpires(this.expires,true);
		loader.load(storageName);
		
		action.call(this,loader,storageName,loader.XMLDocument.documentElement.attributes);
		
		loader.parentNode.removeChild(loader);
		
		return true;
		
	
	},
	
	getUserData:function(key){
	
		var value = null;
		
		if(arguments.length < 1)
			return (value = {}) && this.loadUserData(function(loader,name,attrs){ 
		
				infestor.each(attrs,function(name,attr){
				
					 value[attr.name] = this.deserialize(loader.getAttribute(attr.name));
				
				},this);
							
			}),value;
			
		
		this.loadUserData(function(loader){ 
		
			value = loader.getAttribute(this.userDataKeyFix(key));
		
		});
		
		return this.deserialize(value);

	},
			
	setUserData:function(key,value){
	
		return this.loadUserData(function(loader,name){ 
		
			loader.setAttribute(this.userDataKeyFix(key),this.serialize(value));
			loader.save(name);
		
		});
	
	},
	
	removeUserData:function(key){
	
		return this.loadUserData(function(loader,name){ 
		
			loader.removeAttribute(this.userDataKeyFix(key));
			loader.save(name);
		
		});
	
	},
	
	clearUserData:function(){
	
		return this.loadUserData(function(loader,name,attrs){ 
		
			infestor.each(attrs,function(){
			
				loader.removeAttribute(this.name);
			
			});
			
			loader.save(name);
		
		});
	
	},
	
	userDataKeyFix:function(key){
	
		return key.replace(/[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]/g,'');
	
	},
	
	// private #localstorage
	
	getStorage:function(key,raw){
	
		var value;
	
		if(!this.statics.localStorageSupport())
			return null;
		
		if(!key) return (value ={}) && infestor.each(window.localStorage,function(key){  
			
			key = window.localStorage.key(key);
			value[key] = this.getStorage(key); 
			
		},this),value;
		
		value = window.localStorage.getItem(key);
		
		if(!value) return null;
		
		value = this.deserialize(value);
		
		if(!value || !value.$data) return null;
	
		if(raw)
			return value;
	
		return value.$data;
	
	},
	
	setStorage:function(key,value){
	
		var expires;
	
		if(!this.statics.localStorageSupport())
			return null;
		
		expires = this.formatExpires(this.expires);
		
		if(expires.getTime() < (new Date()).getTime())
			return null;
			
		return window.localStorage.setItem(key,this.serialize({ $data:value, $expires:expires }));
	
	},
	
	removeStorage:function(key){
	
		if(!this.statics.localStorageSupport())
			return null;
		
		return window.localStorage.removeItem(key);
	
	},
	
	clearStorage:function(){
	
		return window.localStorage.clear(),true;
	
	},
	
	cleanExpiresStorage:function(){
	
		if(this.cacheType != 'localStorage' || this.statics.isStorageExpiresChecked)
			return false;
		
		this.statics.isStorageExpiresChecked = true;
		
		infestor.each(window.localStorage,function(keyIndex){
		
			var value = this.getStorage(window.localStorage.key(keyIndex),true);
			
			if(!value || !value.$expires)
				return true;
					
			if(value.$expires < infestor.dateFormat(new Date(), 'yyyy-MM-ddTHH:mm:ss.SZ'))
				this.removeStorage(key);
		
		},this);
		
		return true;
	
	},
	
	// private #cookie
	
	getCookie:function(key,raw){
	
		if (!document.cookie)
			return null;

		var grp = document.cookie.split('; '),
			idx = 0,
			len = grp.length,
			regx = /([^=]+)=(.+)/,
			map = {},
			cap;

		for (; idx < len; idx++) {

			cap = regx.exec(grp[idx]);

			map[cap[1]] = raw ? cap[2] : this.deserialize(cap[2]);
		}

		if (!key) return map;

		return map[key];
	
	},
	
	setCookie:function(key,value,expires,path,domain,secure){
	
		var token = [key + '=' + this.serialize(value)],
			opts = {
		
				expires: this.formatExpires(expires || this.expires),
				path:path,
				domain:domain,
				secure:secure	
			};
		
		infestor.each(opts,function(name,value){
		
			if(!opts.hasOwnProperty(name))
				return true;
			
			if(name == 'secure')
				return value && token.push('secure'),true;
			
			value && token.push(name + '=' + value);
		
		});
		
		document.cookie = token.join('; ');
	
		return true;
	},
	
	removeCookie:function(key){
	
		return this.setCookie(key,false,-1);
	
	},
	
	clearCookie:function(){
	
		return infestor.each(this.getCookie(null,true),function(key){ this.removeCookie(key); },this);
		
	}

},function(Cache){


	Cache.cookie = new Cache({ cacheType : 'cookie', expires : 7 });

	Cache.storage = new Cache({ expires : 30 });

});
