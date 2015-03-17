
infestor.define('infestor.Panel', {

	alias : 'panel',
	extend : 'infestor.Element',

	cssClsElement : 'infestor-panel',

	cssClsHead : 'infestor-panel-head',
	cssClsBody : 'infestor-panel-body',
	cssClsRear : 'infestor-panel-rear',
	cssClsTitle : 'infestor-panel-title',
	
	cssClsPanelSizeControl : 'infestor-panel-size-control',
	cssClsPanelSizeControlItem : 'infestor-panel-size-control-item',

	height : null,
	width : null,

	title : null,
	titleText : '',

	head : null,
	rear : null,
	body : true,
	
	// # sizable
	closable:false,
	maxable:false,
	miniable:false,
	
	// 关闭类型(hide|destory)
	closeType : 'destory',

	// head rear body三个元素布的局模式 (vertical|horizon|table|inline-block|float|block), vertical as block, horizon as inline-block
	layout : 'block',

	initElement : function () {

		this.callParent();

		var inner = this.elementInnerContainer,
			layout='block',
			layoutMap={
		
				vertical:'block',
				horizon:'inline-block',
				table:'table',
				block:'block',
				'inline-block':'inline-block',
				'float':'float'
			
			};
		
		// layout
		
		layout = this.layout = layoutMap[this.layout] || layout;
		
		if((layout == layoutMap.table) && !this.isLayoutSet){
		
			this.elementContainerTable = infestor.Dom.table().appendTo(inner);
			this.elementContainerTableRow = infestor.Dom.tr().appendTo(this.elementContainerTable);
			this.elementInnerContainer = this.elementContainerTableRow;
		}
		
		if(layout == layoutMap['inline-block'])
			this.elementInnerContainer.addClass(this.cssClsElementRemoveSpace);
		
		this.isLayoutSet = true;
			
		this.createTitle();
		this.createHead();
		this.createBody();
		this.createRear();
		this.createSizeControl();
		
		this.elementInnerContainer = this.body.elementInnerContainer;
		
		if(layout == layoutMap['inline-block']){
		
			this.head && this.head instanceof infestor.Element && this.head.element.addClass(this.cssClsElementInlineBlock);
			this.body && this.body instanceof infestor.Element && this.body.element.addClass(this.cssClsElementInlineBlock);
			this.rear && this.rear instanceof infestor.Element && this.rear.element.addClass(this.cssClsElementInlineBlock);
			
		}
		
		if(layout == layoutMap['float']){
				
			this.head && this.head instanceof infestor.Element && this.head.element.addClass(this.cssClsElementFloat);
			this.body && this.body instanceof infestor.Element && this.body.element.addClass(this.cssClsElementFloat);
			this.rear && this.rear instanceof infestor.Element && this.rear.element.addClass(this.cssClsElementFloat);
	
		}

	},
	
	createHead : function () {
	
		var container = this.element;
	
		if(this.layout == 'table' && this.head && !this.elementHeadCellContainer){
		
			container = infestor.Dom.td().appendTo(this.elementInnerContainer);
			this.elementHeadCellContainer = container;
		
		}

		this.head = this.createElement('head', container, {
			cssClsElement : this.cssClsHead
		});

		return this;

	},

	createBody : function () {
	
		var container = this.element;
	
		if(this.layout == 'table' && this.body && !this.elementBodyCellContainer){
		
			container = infestor.Dom.td().appendTo(this.elementInnerContainer);
			this.elementBodyCellContainer = container;
		
		}

		this.body = this.createElement('body', container, {
			cssClsElement : this.cssClsBody
		});

		return this;

	},

	createRear : function () {

		var container = this.element;
	
		if(this.layout == 'table' && this.rear && !this.elementRearCellContainer){
		
			container = infestor.Dom.td().appendTo(this.elementInnerContainer);
			this.elementRearCellContainer = container;
		
		}
	
		this.rear = this.createElement('rear', container, {
			cssClsElement : this.cssClsRear
		});

		return this;

	},

	createTitle : function () {
	
		if (this.titleText && !this.title)
			this.title = true;

		this.title = this.createElement('title', this.element, {
			cssClsElement : this.cssClsTitle,
			text : this.titleText
		});

		return this;

	},
	
	createSizeControl:function(){
	
		var sizable = this.closable || this.maxable || this.miniable;
		
		if(!sizable) return this;
	
		this.sizeControl = infestor.create('infestor.Element',{
		
			cssClsElement : this.cssClsPanelSizeControl,
			itemLayout : 'horizon',
			itemsOpts : {
				
				cssClsElement : this.cssClsPanelSizeControlItem
			},
			initEvents : function(){
			
				this.delegate(this,'click',true,function(inst,e){
				
					if(!inst || !inst.element || !inst.element.hasClass(this.itemsOpts.cssClsElement))
						return;
					
					switch(inst.name){
					
						case 'min':
							this.parent.min();
							break;
						case 'max':
							this.parent.max();
							break;
						case 'restore':
							this.parent.restore();
							break;
						case 'close':
							this.parent.close();
							break;
						default:
							break;
					
					}
					
				},this);
			
			}
			
		}).renderTo(this);
		
		this.miniable && this.sizeControl.addItem({
			
			name:'min',
			icon:'minus',
			attr:{ title : '最小化' }
		
		});
		
		this.maxable && this.sizeControl.addItem({
			
			name:'max',
			icon:'record',
			attr:{ title : '最大化' }
			
		});
		
		
		(this.miniable || this.maxable) && this.sizeControl.addItem({
			
			name:'restore',
			icon:'photographs',
			attr:{ title : '还原' }
		
		});
		
		this.closable && this.sizeControl.addItem({
			
			name:'close',
			icon:'multiply',
			attr:{ title : '关闭' }
		
		});
	
				
		return this;
			
	},
	
	close : function () {

	   return (this.closeType == 'destroy') ? this.destroy() : this.hide(),this;
	   
	},
	
	max :function(){
	
	
	},
	
	min:function(){
	
	
	},
	
	restore:function(){
	
	
	},
	
	destory:function(){
		
		this.head = this.head && this.head.destory();
		this.rear = this.rear && this.rear.destory();
		this.body = this.body && this.body.destory();
		this.callParent();
	}

	
});
