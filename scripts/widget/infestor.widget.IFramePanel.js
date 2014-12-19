
infestor.define('infestor.widget.IFramePanel', {

	alias : 'iframe',
	extend : 'infestor.Panel',
	
	cssClsHead:'infestor-widget-iframe-panel-head',
	cssClsTitle:'infestor-widget-iframe-panel-title',
	cssClsBody:'infestor-widget-iframe-panel-body',
	cssClsHeadItem:'infestor-widget-iframe-panel-head-item',
	
	iframeSrc:'#',
	iframeName:'',
	iframeHeight:'500px',
	iframeWidth:'100%',
	iframeTimeout:60*1000,
	iframeAutoLoad:false,
	iframeSandbox:false, 
	iframeHidden:true,
	
	head:true,
	
	events:{
	
		beforeLoad:null,
		load:null,
		afterLoad:null,
		error:null,
		complete:null
	
	},
	
	initElement : function () {

		this.callParent();
		this.createIFrameLoadIndicator();
		
		this.iframeHidden && this.body.hide();
		this.iframeAutoLoad && this.loadIFrame();

	},
	
	initEvents : function(){
	
		this.delegate(this.head,'click',true,function(inst,e){
		
			if(!inst || !inst.element || !inst.element.hasClass(this.cssClsHeadItem))
				return;
			
			switch(inst.name){
				
				case 'reload':
					!this.body.hidden && this.loadIFrame();
					this.head.getItem('stop').show();
					break;
				case 'show':
					this.body.show();
					!this.iframeLoaded && this.loadIFrame();
					this.head.eachItems(function(name,item){  
					
						if(name == 'show')
							item.hide();
						if(/hide|reload/.test(name))
							item.show();
						if(name == 'stop' && !this.iframeLoaded)
							item.show();
							
					},this);
					break;
				case 'hide':
					this.body.hide();
					this.head.eachItems(function(name,item){  
					
						if(name == 'show')
							item.show();
						if(/hide|reload|stop/.test(name))
							item.hide();
					});
					break;
				case 'open':
					window.open(this.iframeSrc);
					break;
				case 'load':
					this.loadIFrame();
					this.head.eachItems(function(name,item){  
						
						if(name == 'load')
							item.hide();
						if(/hide|reload|stop/.test(name))
							item.show();
					});
					break;
				case 'stop':
					this.stopLoadIFrame();
					this.head.eachItems(function(name,item){  
						
						if(name == 'load')
							item.show();
						if(/hide|reload|stop/.test(name))
							item.hide();
					});
					break;
				case 'close':
					this.destroy();
					break;
				default:
					break;
			}
			
		
		},this);
		
		this.on('complete',function(){
		
			this.head && this.head.getItem('stop').hide();
		
		},this);
	},
	
	createTitle :function(){
	
		return this;
	
	},
	
	createHead : function () {
	
		this.createElement('head', this, {
		
			cssClsElement : this.cssClsHead,
			itemLayout:'horizon',
			items:[{
			
				cssClsElement : this.cssClsHeadItem,
				name:'show',
				icon:'eyes',
				hidden:!this.iframeHidden,
				attr:{ title:'显示' }
		
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'hide',
				icon:'wrong',
				hidden:this.iframeHidden,
				attr:{ title:'隐藏' }
			
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'reload',
				icon:'transfer',
				hidden:this.iframeHidden,
				attr:{ title:'刷新' }
				
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'load',
				icon:'play',
				hidden:true,
				attr:{ title:'加载' }
				
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'stop',
				icon:'pause',
				hidden:this.iframeHidden,
				attr:{ title:'停止' }
				
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'open',
				icon:'link',
				attr:{ title:'在新窗口中打开' }
			
			},{		
				cssClsElement : this.cssClsHeadItem,
				name:'close',
				icon:'decline',
				attr:{ title:'关闭' }		
				
			},{
			
				cssClsElement:this.cssClsTitle,
				text:this.titleText,
				hidden:!this.titleText
			
			}]
		});

		return this;

	},
	
	createIFrame : function(){
	
		if(this.elementIFrame)
			return this;
	
		this.elementIFrame = this.createDomElement(this.body, null, 'iframe', {
		
			height:'100%',
			width:'100%',
			frameborder:0,
			scrolling:'auto',
			name:this.id || this.iframeName
			
		});
		
		this.iframeSandbox && this.elementIFrame.attr({
		
			security:'restricted',
			sandbox:''
		
		});
		
		this.elementIFrame.on('load',function(e){
			
			if(!this.iframeLoading)
				return;
			
			this.iframeLoading = false;
			this.iframeLoaded = true;
			
			this.elementIFrame && this.elementIFrame.attr({
			
				height:this.iframeHeight,
				width:this.iframeWidth
			
			});
			
			infestor.stopDelay(this.delayId);
			this.iFrameLoadIndicator.stop();
			this.emit('load',[e,this.elementIFrame,this]);
			this.emit('afterLoad',[e,this.elementIFrame,this]);
			this.emit('complete',[true,e,this.elementIFrame,this]);
		
		},this);
		
		this.elementIFrame.on('error',function(e){
		
			this.iframeLoading = false;
			this.iframeLoaded = true;
			infestor.stopDelay(this.delayId);
			this.iFrameLoadIndicator.stop();
			this.emit('error',[e,this.elementIFrame,this]);
			this.emit('complete',[false,e,this.elementIFrame,this]);
		
		},this);
	
	},
	
	createIFrameLoadIndicator : function(){
		
		var me = this;
	
		this.iFrameLoadIndicator = this.iFrameLoadIndicator || infestor.create('infestor.Indicator',{
		
			interval:50,
			step:50,
			showMask:function(){ me.body.showMask(); },
			hideMask:function(){ me.body.hideMask(); },
			showIndicator:function(){ 
			
				me.elementIFrameLoadIndicator = me.elementIFrameLoadIndicator || infestor.create('infestor.Element',{ 
					css:{  
					
						position : 'absolute',
						width : '0%',
						height : '5px',
						top: 0,
						left : 0,
						'background-color' : 'orange'
					
					} 
				}).renderTo(me.body); 
				
				me.elementIFrameLoadIndicator.show(true);
			},
			hideIndicator:function(){
			
				me.elementIFrameLoadIndicator && me.elementIFrameLoadIndicator.hide();
			
			},
			changeIndicator:function(value){
			
				me.elementIFrameLoadIndicator && me.elementIFrameLoadIndicator.element.css('width', value + '%');
			
			}
		
		});
	
	},
	
	loadIFrame : function(src){
	
		this.iframeSrc = src || this.iframeSrc;
		
		if(!this.iframeSrc) return this;
		
		this.createIFrame();
		
		this.emit('beforeLoad',[this.elementIFrame,this]);
		
		infestor.stopDelay(this.delayId);
		
		this.iFrameLoadIndicator.start();
		
		this.elementIFrame.attr('src',this.uniqueSrc(this.iframeSrc));
		
		this.iframeLoaded = false;
		this.iframeLoading = true;
		
		this.delayId = infestor.delay(function(){
			
			!this.iframeLoaded && this.elementIFrame && this.elementIFrame.attr({
			
				height:this.iframeHeight,
				width:this.iframeWidth
			
			});
		
			this.iframeLoading = false;
			this.iframeLoaded = true;
			this.iFrameLoadIndicator && this.iFrameLoadIndicator.stop();
			this.emit('timeout',[this.elementIFrame,this]);
			this.emit('error',[null,this.elementIFrame,this]);
			this.emit('complete',[false,null,this.elementIFrame,this]);
			
			
		},this.iframeTimeout,this);
		
		return this;
	},
	
	stopLoadIFrame : function(){
	
		infestor.stopDelay(this.delayId);
		this.iFrameLoadIndicator.stop();
		this.elementIFrame = this.elementIFrame && this.elementIFrame.destroy();
		this.iframeLoading = false;
		this.iframeLoaded = false;
	},
	
	uniqueSrc:function(src){
			
		return	/\?/.test(src) ? (src + '&' + this.getId()) : (src + '?' + this.getId());
		
	},
	
	destroy:function(){
	
		this.stopLoadIFrame();
		this.elementIFrameLoadIndicator = this.elementIFrameLoadIndicator && this.elementIFrameLoadIndicator.destroy();
		this.iFrameLoadIndicator = this.iFrameLoadIndicator && this.iFrameLoadIndicator.destroy();
		
		this.callParent();
	}

});
