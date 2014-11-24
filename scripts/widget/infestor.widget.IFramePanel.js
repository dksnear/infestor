
infestor.define('infestor.widget.IFramePanel', {

	alias : 'iframe',
	extend : 'infestor.Panel',
	uses : ['infestor.Indicator'],
	
	cssClsHead:'infestor-widget-iframe-panel-head',
	cssClsTitle:'infestor-widget-iframe-panel-title',
	cssClsBody:'infestor-widget-iframe-panel-body',
	cssClsHeadItem:'infestor-widget-iframe-panel-head-item',
	
	iframeSrc:'#',
	iframeName:'',
	iframeHeight:'500px',
	iframeWidth:'100%',
	iframeTimeout:15*1000,
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
	
		this.head && this.delegate(this.head,'click',true,function(inst,e){
		
			if(!inst || !inst.element || !inst.element.hasClass(this.cssClsHeadItem))
				return;
			
			switch(inst.name){
				
				case 'reload':
					!this.body.hidden && this.loadIFrame();
					break;
				case 'visible':
					if(this.body.hidden){
					
						this.body.show();
						!this.iframeLoaded && this.loadIFrame();
						inst.setText('隐藏');
						
					} else {
					
						this.body.hide();
						inst.setText('显示');					
					}
					break;
				case 'open':
					window.open(this.iframeSrc);
					break;
				case 'close':
					this.destroy();
					break;
				default:
					break;
			}
			
		
		},this);
		
	},
	
	createTitle :function(){
	
		this.callParent();
		
		this.title && this.title.element.addClass(this.cssClsElementInlineBlock);
		
		return this;
	
	},
	
	createHead : function () {
	
		this.head = this.createElement('head', this, {
			cssClsElement : this.cssClsHead,
			itemLayout:'horizon',
			items:[{
			
				cssClsElement : this.cssClsHeadItem,
				name:'reload',
				text:'刷新'
			
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'visible',
				text:this.iframeHidden ? '显示':'隐藏'
			
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'open',
				text:'在新窗口中打开'
			
			},{
			
				cssClsElement : this.cssClsHeadItem,
				name:'close',
				text:'关闭'
			
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
			
			this.elementIFrame.attr({
			
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
		
		this.iframeLoading = true;
		
		this.delayId = infestor.delay(function(){
		
			this.iframeLoading = false;
			this.iframeLoaded = true;
			this.iFrameLoadIndicator.stop();
			this.elementIFrame.attr('src','#');
			this.emit('timeout',[this.elementIFrame,this]);
			this.emit('error',[null,this.elementIFrame,this]);
			this.emit('complete',[false,null,this.elementIFrame,this]);
			
			
		},this.iframeTimeout,this);
		
		return this;
	},
	
	uniqueSrc:function(src){
			
		return	/\?/.test(src) ? (src + '&' + this.getId()) : (src + '?' + this.getId());
		
	},
	
	destroy:function(){
	
		this.elementIFrameLoadIndicator = this.elementIFrameLoadIndicator && this.elementIFrameLoadIndicator.destroy();
		this.iFrameLoadIndicator = this.iFrameLoadIndicator && this.iFrameLoadIndicator.destroy();
		
		this.callParent();
	}

});
