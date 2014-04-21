
infestor.define('infestor.Task',{


	extend:'infestor.Object',
	
	// 任务Id
	taskId:null,
	
	// 任务执行间隔时间
	interval:100,
	
	// 已经开始
	isStart:false,
		
	start:function(){
	
		if(this.isStart) return;
		
		this.taskId = infestor.task(function(){
		
			this.emit('tick',[],this);
		
		},this.interval,this);
		
		this.isStart = true;
		
		this.emit('start',[],this);
	
	},
	
	stop:function(){
	
		if(!this.isStart) return;
				
		infestor.stopTask(this.taskId);
		
		this.isStart = false;
		
		this.emit('stop',[],this);
	
	},
	
	
	destroy:function(){
	
		this.taskId && infestor.stopTask(this.taskId);
		this.isStart = false;
		
		return null;
	
	}
	

});