
infestor.define('infestor.Panel', {

	alias : 'panel',
	extend : 'infestor.Element',

	cssClsElement : 'infestor-panel',
	cssClsPanelControl:'infestor-panel-control',
	cssClsPanelControlItemHorizon:'infestor-panel-control-item-horizon',
	cssClsPanelControlItemVertical:'infestor-panel-control-item-vertical',
	cssClsPanelControlItemClose:'infestor-panel-control-item-close',
	cssClsPanelControlItemMax:'infestor-panel-control-item-max',
	cssClsPanelControlItemMin:'infestor-panel-control-item-min',
	cssClsPanelControlItemRestore:'infestor-panel-control-item-restore',
	cssClsHead : 'infestor-panel-head',
	cssClsBody : 'infestor-panel-body',
	cssClsRear : 'infestor-panel-rear',
	cssClsTitle : 'infestor-panel-title',

	height : null,
	width : null,

	title : null,
	titleText : '',

	head : null,
	rear : null,
	body : true,
	
	// 关闭类型(hide|destory)
	closeType : 'destory',
	closable:false,
	maxable:false,
	miniable:false,
	// vertical|horizon
	controlLayout:'horizon',
		
	// 内部元素布局模式 (vertical|horizon|table|inline-block|float|block)
	// vertical = block
	// horizon = inline-block
	layout : 'block',

	initElement : function () {

		this.callParent();

		var inner = this.elementInnerContainer,layout='block',layoutMap={
		
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
			
		this.createHead().createTitle().createBody().createRear().createControl();
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

		if(this.title && !this.head)
			(this.head = true) && this.createHead();
			
		this.title = this.createElement('title', this.head, {
			cssClsElement : this.cssClsTitle,
			text : this.titleText
		});

		return this;

	},
	
	createControl:function(){
	
		var sizable = this.closable || this.maxable || this.miniable,
			cssClsItem = this.controlLayout == 'horizon' ? (this.cssClsPanelControlItemHorizon + ' ' + this.cssClsElementInlineBlock) : this.cssClsPanelControlItemVertical;
	
		if(!sizable) return this;
		
		this.sizeControl = true;
		
		this.sizeControl = this.createElement('sizeControl',this.element,{
		
			cssClsElement:this.cssClsPanelControl + ' ' + this.cssClsElementRemoveSpace
		
		});
		
		cssClsItem = this.cssClsGlobalIcon16 + ' ' + cssClsItem;
		
		if(this.miniable)
			this.sizeControl.elementMini = this.sizeControl.createDomElement(null,cssClsItem+' '+this.cssClsPanelControlItemMin,null,{ title:'最小化' }).click(function(){
			
				this.min();
			
			},this);
		
		if(this.maxable)
			this.sizeControl.elementMax = this.sizeControl.createDomElement(null,cssClsItem+' '+this.cssClsPanelControlItemMax,null,{ title:'最大化' }).click(function(){
			
				this.max();
			
			},this);
		
		// 还原
		if(this.miniable || this.maxable)
			this.sizeControl.elementRestore = this.sizeControl.createDomElement(null,cssClsItem+' '+this.cssClsPanelControlItemRestore,null,{ title:'还原' }).click(function(){
			
				this.restore();
			
			},this);
			
		if(this.closable)
			this.sizeControl.elementClose = this.sizeControl.createDomElement(null,cssClsItem+' '+this.cssClsPanelControlItemClose,null,{ title:'关闭' }).click(function(){
			
				this.close();
			
			},this);
		
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
	
	
	}

	
});
