/// <reference path="infestor.js"/>

infestor.define('infestor.Panel', {

	alias : 'panel',
	extend : 'infestor.Element',
	cssUses : 'infestor.Panel',

	cssClsElement : 'infestor-panel',
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
		
		if(layout == layoutMap['inline-block']){
		
			this.elementInnerContainer.addClass(this.cssClsElementRemoveSpace);
			this.cssClsHead = (this.cssClsHead || '') + ' ' + this.cssClsElementInlineBlock;
			this.cssClsBody = (this.cssClsBody || '') + ' ' + this.cssClsElementInlineBlock;
			this.cssClsRear = (this.cssClsRear || '') + ' ' + this.cssClsElementInlineBlock;
			
		}
		
		if(layout == layoutMap['float']){
		
			this.cssClsHead = (this.cssClsHead || '') + ' ' + this.cssClsElementFloat;
			this.cssClsBody = (this.cssClsBody || '') + ' ' + this.cssClsElementFloat;
			this.cssClsRear = (this.cssClsRear || '') + ' ' + this.cssClsElementFloat;
			
		}
		
		this.isLayoutSet = true;
			
		this.createHead().createBody().createRear().createTitle();
		this.elementInnerContainer = this.body.elementInnerContainer;

	},

	createHead : function () {
	
		var container = this.element;
	
		if(this.layout == 'table' && this.head){
		
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
	
		if(this.layout == 'table' && this.body){
		
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
	
		if(this.layout == 'table' && this.rear){
		
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

		if (this.title && !this.head)
			this.createHead();

		this.title = this.createElement('title', this.head, {
				cssClsElement : this.cssClsTitle,
				text : this.titleText
			});

		return this;

	}

});
