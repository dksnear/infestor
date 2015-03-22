
// 基本窗口类

infestor.define('infestor.Window', {

	alias : 'window',
	extend : 'infestor.Panel',
	
	cssClsElement : 'infestor-window',
	cssClsHead : 'infestor-window-head',
	cssClsBody : 'infestor-window-body',
	cssClsRear : 'infestor-window-rear',
	cssClsTitle : 'infestor-window-title',
	cssClsAutoHidePlate :'infestor-window-autohide-plate',
	boxShadow : true,
	dock:'center',
	
	bodyHeight : null,
	bodyWidth : null,
	
	hidden : true,

	// 模态窗口(bool)
	modal : true,

	initElement : function () {

		this.callParent();

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

	setDimension : function (opts) {
	
		this.bodyHeight = opts && opts.bodyHeight || this.bodyHeight;
		this.bodyWidth = opts && opts.bodyWidth || this.bodyWidth;

		this.body && this.body.setDimension({
		
			height:this.bodyHeight,
			width:this.bodyWidth
		
		});
	
		return this.callParent();

	},
	
	show : function () {

		if (!this.element)
			return this;

		// show window global mask
		if(this.modal){
			
			infestor.Window.elementGlobalMask =  infestor.Window.elementGlobalMask || infestor.Dom.div().addClass(infestor.Element.cssClsElementGlobalMask).appendTo(infestor.Dom.getBody());
			infestor.Window.elementGlobalMask.zIndex().show();
			
		}

		this.setDock();
		
		this.element.zIndex().show();

		return this;

	},

	hide : function () {

		if (!this.element)
			return this;
		
		// hide window global mask
		this.modal && infestor.Window.elementGlobalMask && infestor.Window.elementGlobalMask.hide();

		this.element.hide();

		return this;
	},
	
	destroy : function () {

		return this.hide() && this.callParent();

	}

},function(Window){


	var pInst = Window.prototype;

	// 提醒
	Window.alert = function(msg,parent,winOpts){
		
		return infestor.create('infestor.Window',infestor.append({

			dock:'center',
			closable:true,
			titleText:'提示',
			modal:true,
			items:{
			
				name:'monitor-msg',
				cssClsElement:pInst.cssClsElementText,
				text:msg
			
			}
			
		},winOpts)).renderTo(parent);
		
	}
	
	// 确认
	Window.confirm = function(msg,confirmFn,parent,scope,winOpts){
			
		return infestor.create('infestor.Window',infestor.append({

			dock:'center',
			modal:true,
			closable:true,
			titleText:'确认',
			items:{
			
				name:'monitor-msg',
				cssClsElement:pInst.cssClsElementText,
				text:msg
			
			},
			rear:{
			
				items:{
				
					name:'btn-confirm',
					cssClsElement:pInst.cssClsGlobalButton,
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

		},winOpts)).renderTo(parent);
		
	}

	// 抉择
	Window.choice = function(msg,ayeFn,nayFn,parent,scope,winOpts){
		
		return infestor.create('infestor.Window',infestor.append({

			dock:'center',
			modal:true,
			closable:true,
			titleText:'抉择',
			items:[{
		
				name:'msg-monitor',
				cssClsElement:pInst.cssClsElementText,
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
				
						cssClsElement:pInst.cssClsGlobalButtonHorizon,
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
				
					if(!inst || !inst.element || !inst.element.hasClass(pInst.cssClsGlobalButtonHorizon))
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

		},winOpts)).renderTo(parent);
		
	}


});
