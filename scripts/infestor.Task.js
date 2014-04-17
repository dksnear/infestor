
infestor.define('infestor.Task',{


	extend:'infestor.Object',
	
	task:null,
	
	interval:100,
		
	start:function(){
	
		if(this.isStart) return;
		
		this.task = infestor.task(function(){
		
			this.emit('turn',[]);
		
		},this.interval,this);
		
		this.isStart = true;
		
		this.emit('start',[]);
	
	},
	
	stop:function(){
	
		if(!this.isStart) return;
				
		infestor.stopTask(this.task);
		
		this.isStart = false;
		
		this.emit('stop',[]);
	
	},
	
	
	destroy:function(){
	
	}
	

});