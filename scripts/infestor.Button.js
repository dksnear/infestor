

infestor.define('infestor.Button',{

	alias:'button',

	extend:'infestor.Panel',
	
	cssUses:['infestor.Button'],
	
	cssClsElement:'infestor-button',
	
	cssClsHead : 'infestor-button-head',
	cssClsBody : 'infestor-button-body',
	cssClsRear : 'infestor-button-rear',
	
	cssClsIcon:'infestor-button-icon',
	cssClsIconImage:'infestor-button-icon-image',
		
	// 图标位置 (center|left|right|false)
	// 图标在中央则无法设置按钮文本
	// false 不设置图标
	icon:false,
	
	layout:'table',
	
	// 图标尺寸 (12|16|25|..)
	iconSize:16,
	
	events:{
	
		// @params target,eventArgs 
		// @this button
		click:null
	
	},
	
	init:function(){
	
		if(this.icon=='left'){
		
			this.head = true;
			this.cssClsHead = [this.cssClsHead,this.cssClsIcon,this.cssClsIconImage].join(' ');
		
		}
		
		if(this.icon=='right'){
		
			this.rear = true;
			this.cssClsRear = [this.cssClsRear,this.cssClsIcon,this.cssClsIconImage].join(' ');
		
		}
		
		if(this.icon=='center'){
		
			this.center = true;
			this.layout = 'vertical';
			this.cssClsBody = [this.cssClsBody,this.cssClsIcon,this.cssClsIconImage].join(' ');
		
		}
		
		
		this.callParent();
	
	},
	
	initEvents:function(){
	
		this.delegate(this,'click',true,function(inst,e){
		
			this.emit('click',[inst,e],this);
		
		},this)
	
	},
	
	initElement:function(){
	
		this.callParent();
		
		this.icon && (this.head || this.rear || this.body).setDimension({ height:infestor.px(this.iconSize),width:infestor.px(this.iconSize) }); 
	
	},
	
	setText:function(){
	
		return (this.icon != 'center') && this.callParent(),this;
	}



});