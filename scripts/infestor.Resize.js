
// 尺寸调整处理类

infestor.define('infestor.Resize',{

	extend:'infestor.Object',
	uses:['infestor.Drag'],
	
	// 尺寸调整触发元素样式
	cssClsElementTrigger:'',
	
	// 尺寸调整目标(Dom)
	element:null,
	
	// 尺寸调整触发元素(infestor.Dom)
	elementTrigger:null,
	
	drag:null,
	
	
	init:function(){
	
		if(!this.element) return;
		this.initTrigger();
	},
	
	initTrigger:function(){
	
		var offset = infestor.Dom.use(this.element).offset();
		
		this.elementTrigger = infestor.Dom.div().css({
			
			height:'10px',
			width:'10px',
			border:'1px solid black',
			cursor:'se-resize',
			position:'absolute',
			top:infestor.px(offset.top + offset.height),
			left:infestor.px(offset.left + offset.width)
		
		}).appendTo(infestor.Dom.getBody());
		
		
		this.drag = infestor.create('infestor.Drag',{
		
			element:this.elementTrigger.getElement(),
			
			elementContainer:document.documentElement,
			limit:true
		
		});
	
	}



});