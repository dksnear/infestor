/// <reference path="infestor.js"/>

infestor.define('infestor.Panel', {

	alias : 'panel',
	extend : 'infestor.Element',
	cssUses : 'infestor.Panel',

	cssClsElement : 'infestor-panel',
	cssClsHead : 'infestor-panel-head',
	cssClsBody : 'infestor-panel-body',
	cssClsRear : 'infestor-panel-rear',
	cssClsContent : 'infestor-panel-content',
	cssClsTitle : 'infestor-panel-title',

	height : null,
	width : null,

	title : null,
	titleText : '',

	head : null,
	rear : null,
	body : true,

	initElement : function () {

		this.callParent();

		this.createHead().createBody().createRear().createTitle();

		this.elementInnerContainer = this.body.elementInnerContainer;

	},

	createHead : function () {

		this.head = this.createElement('head', this.element, {
				cssClsElement : this.cssClsHead
			});

		return this;

	},

	createBody : function () {

		this.body = this.createElement('body', this.element, {
				cssClsElement : this.cssClsBody
			});

		return this;

	},

	createRear : function () {

		this.rear = this.createElement('rear', this.element, {
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
