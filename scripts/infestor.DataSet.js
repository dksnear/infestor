
infestor.define('infestor.DataSet',{

	extend:'infestor.Object',
	
	uses:'infestor.request',
	
	url:null,
	
	params:null,
	
	// get post jsonp
	method:'get',
	
	remote:true,
	
	data:null,
	
	count:0,
	
	current:0,
	
	isLoaded:false,
	
	events:{
	
		load:null,
		error:null,
		complete:null
	
	},
	
	setData:function(data){
		
		if(infestor.isFunction(data))
			this.data = data.call(this);
		else
			this.data = data;
			
		this.current = 0;
		this.count = this.data && this.data.length || this.count;
	
	},
	
	setCurrent:function(current){
	
		if(infestor.isFunction(current)) 
			this.current = current.call(this);
		else
			this.current = current || this.current;
	},
	
	next:function(){
	
		if(++this.current==this.count) 
			this.current=0;
		return this.data && this.data[this.current];
	},
	
	previous:function(){
	
		if(--this.current<0)
			this.current=this.count-1;
		return this.data && this.data[this.current];
	},
	
	load:function(opts,rewrite){
	
		var me=this;
		
		if(!this.remote) {
		
			this.emit('load',arguments);
			return;
		}
		
		opts && opts.params && (opts.params=infestor.append({},this.params,opts.params));
		
		this.isLoaded=false;
		
		opts=infestor.append({
		
			url : this.url,
			method : this.method,
			params:	this.params,
			success:function(data){
				
				me.setData(data);
				me.emit('load',arguments);
				
				me.isLoaded=true;
			},
			error:function(){ 
			
				me.emit('error',arguments);
			},
			complete:function(){
			
				me.emit('complete',arguments);
			}
			
		},opts);
		
		if(this.remote && this.method != 'jsonp') 
			infestor.request.ajax(opts);
			
		if(this.remote && this.method == 'jsonp')
			infestor.request.jsonp(opts.url,opts.params,opts.success);
		
		if(rewrite){
			
			this.params=opts.params;
			this.method=opts.method;
			this.url=opts.url;
		}
	
	},
	
	reload:function(){
	
		this.load();
	}
	
});