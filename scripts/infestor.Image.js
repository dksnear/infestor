
infestor.define('infestor.Image',{

	extend:'infestor.Object',
	
	uses:['infestor.Dom','infestor.DataSet','infestor.Task'],
	
	statics:{},
	
	// 扫描任务(判定图片是否加载完全)
	task:null,
	
	// 加载路径列表(array)
	items:null,
	
	dataSet:null,
	
	// 完全加载
	isComplete:false,
	
	events:{
	
	
	},
	
	init:function(){
	
		
	
	},

	start:function(){
	
		this.task = this.task || infestor.create('infestor.Task',{
		
			events:{
			
				start:function(){},
				tick:function(){},
				stop:function(){}
			}
		
		});
	},
	
	scan:function(){
	
	
	},
	
	stop:function(){},
	
	destroy:function(){
	
		this.task = this.task && this.task.destroy();
		
		return null;
	
	}
});