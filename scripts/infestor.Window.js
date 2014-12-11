
// 基本窗口类

infestor.define('infestor.Window', {

	alias : 'window',
	extend : 'infestor.Panel',

	// statics : {
	
		// // 提醒
		// alert : function(msg,parent){
		
			// return infestor.create('infestor.Window',{

				// dock:'center',
				// closable:true,
				// titleText:'提示',
				// modal:true,
				// items:{
				
					// name:'monitor-msg',
					// cssClsElement:this.cssClsElementText,
					// text:msg
				
				// }
				
			// }).renderTo(parent);
				
		
		// },
	
		// // 确认
		// confirm : function(msg,confirmFn,parent,scope){
			
			// return infestor.create('infestor.Window',{

				// dock:'center',
				// modal:true,
				// closable:true,
				// titleText:'确认',
				// items:{
				
					// name:'monitor-msg',
					// cssClsElement:this.cssClsElementText,
					// text:msg
				
				// },
				// rear:{
				
					// items:{
					
						// name:'btn-confirm',
						// cssClsElement:this.cssClsGlobalButton,
						// boxShadow:true,
						// position:'absolute',
						// top:0,
						// right:3,
						// text:'确定'					
					// }
					
				// },
				
				// initEvents:function(){
				
					// this.delegate(this.rear.getItem('btn-confirm'),'click',true,function(){
					
						// confirmFn && confirmFn.call(scope || this,this.rear.getItem('btn-confirm'));
						// this.close();
					
					// },this);
				
				// }

			// }).renderTo(parent);
			
		// },
		
		// // 抉择
		// choice:function(msg,ayeFn,nayFn,parent,scope){
		
			// return infestor.create('infestor.Window',{

				// dock:'center',
				// modal:true,
				// closable:true,
				// titleText:'抉择',
				// items:[{
			
					// name:'msg-monitor',
					// cssClsElement:this.cssClsElementText,
					// text:msg
				
				// }],
				// rear:{
					
					// items:[{
					
						// name:'btn-group',
						// itemLayout:'horizon',
						// position:'absolute',
						// top:0,
						// right:3,
						// itemsOpts:{
					
							// cssClsElement:this.cssClsGlobalButtonHorizon
							// boxShadow:true
					
						// },
						// items:[{
							
							// name:'btn-aye',
							// text:'是'
						// },{
							
							// name:'btn-nay',
							// text:'否'
						
						// }]
								
					// }]
					
				// },
				// initEvents:function(){
				
				
					// this.delegate(this.rear.getItem('btn-group'),'click',true,function(inst,e){
					
						// if(!inst || !inst.element || !inst.element.hasClass(this.cssClsGlobalButtonHorizon))
							// return;
							
						// switch(inst.name){
						
							// case 'btn-aye':
								// ayeFn && ayeFn.call(scope || this,inst);
								// break;
							// case 'btn-nay':
								// nayFn && nayFn.call(scope || this,inst);
								// break;
							// default:
								// break;
						
						// }
						
						// this.close();
					
					// },this);
				
				// }

			// }).renderTo(parent);
			
		// }
		
	// },

	cssClsElement : 'infestor-window',
	cssClsHead : 'infestor-window-head',
	cssClsBody : 'infestor-window-body',
	cssClsRear : 'infestor-window-rear',
	cssClsTitle : 'infestor-window-title',
	cssClsAutoHidePlate :'infestor-window-autohide-plate',
	boxShadow : true,
	dock:'center',

	// 模态窗口(bool)
	modal : true,

	initElement : function () {

		this.callParent();
		this.show();

	},
		
	initAutoHide : function(time,nonPlate){
		
		var taskId;
		
		time = time || 5;
	
		if(!nonPlate){
		
			this.countDownPlate = this.countDownPlate || infestor.create('infestor.Element',{
			
				cssClsElement : this.cssClsAutoHidePlate
			
			}).renderTo(this);
		}
		
		taskId = infestor.task(function(){
		
			if(time==0){
				
				infestor.stopTask(taskId);
				this.hide();
			}
		
			!nonPlate && this.countDownPlate.setText(infestor.stringFormat('{0}秒后将关闭窗口',time));
		
			time--;
		
		},1000,this);
		
		return this;
	
	},

	show : function () {

		if (!this.element)
			return this;

		this.modal && infestor.Element.showMask();

		this.element.zIndex().show();

		return this;

	},

	hide : function () {

		if (!this.element)
			return this;

		this.modal && infestor.Element.hideMask();

		this.element.hide();

		return this;
	},
	
	destroy : function () {

		return this.hide() && this.callParent();

	}

},function(cls){


	var proto = cls.prototype;

	// 提醒
	cls.alert = function(msg,parent){
		
		return infestor.create('infestor.Window',{

			dock:'center',
			closable:true,
			titleText:'提示',
			modal:true,
			items:{
			
				name:'monitor-msg',
				cssClsElement:proto.cssClsElementText,
				text:msg
			
			}
			
		}).renderTo(parent);
		
	}
	
	// 确认
	cls.confirm = function(msg,confirmFn,parent,scope){
			
		return infestor.create('infestor.Window',{

			dock:'center',
			modal:true,
			closable:true,
			titleText:'确认',
			items:{
			
				name:'monitor-msg',
				cssClsElement:proto.cssClsElementText,
				text:msg
			
			},
			rear:{
			
				items:{
				
					name:'btn-confirm',
					cssClsElement:proto.cssClsGlobalButton,
					boxShadow:true,
					position:'absolute',
					top:0,
					right:3,
					text:'确定'					
				}
				
			},
			
			initEvents:function(){
			
				this.delegate(this.rear.getItem('btn-confirm'),'click',true,function(){
				
					confirmFn && confirmFn.call(scope || this,this.rear.getItem('btn-confirm'));
					this.close();
				
				},this);
			
			}

		}).renderTo(parent);
		
	}

	// 抉择
	cls.choice = function(msg,ayeFn,nayFn,parent,scope){
		
		return infestor.create('infestor.Window',{

			dock:'center',
			modal:true,
			closable:true,
			titleText:'抉择',
			items:[{
		
				name:'msg-monitor',
				cssClsElement:proto.cssClsElementText,
				text:msg
			
			}],
			rear:{
				
				items:[{
				
					name:'btn-group',
					itemLayout:'horizon',
					position:'absolute',
					top:0,
					right:3,
					itemsOpts:{
				
						cssClsElement:proto.cssClsGlobalButtonHorizon,
						boxShadow:true
				
					},
					items:[{
						
						name:'btn-aye',
						text:'是'
					},{
						
						name:'btn-nay',
						text:'否'
					
					}]
							
				}]
				
			},
			initEvents:function(){
			
			
				this.delegate(this.rear.getItem('btn-group'),'click',true,function(inst,e){
				
					if(!inst || !inst.element || !inst.element.hasClass(proto.cssClsGlobalButtonHorizon))
						return;
						
					switch(inst.name){
					
						case 'btn-aye':
							ayeFn && ayeFn.call(scope || this,inst);
							break;
						case 'btn-nay':
							nayFn && nayFn.call(scope || this,inst);
							break;
						default:
							break;
					
					}
					
					this.close();
				
				},this);
			
			}

		}).renderTo(parent);
		
	}


});
