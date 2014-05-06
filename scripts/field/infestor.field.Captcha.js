
infestor.define('infestor.field.Captcha', {

	alias : 'captcha',

	extend : 'infestor.field.Field',

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-field infestor-captcha-field',

	// 字段名
	fieldName : null,

	promptMsg : '',
	errorMsg : '',

	checked : false,

	value : null,

	captchaUrl : '',
	captchaLastUrl : '',
	altText:'loading..',
	layout : 'table',

	init : function () {

		this.head = true;
		this.rear = true;

		this.callParent();

	},

	initElement : function () {

		this.callParent();
		this.createCaptchaImage();

	},

	createCaptchaImage : function () {

		var parent = (this.labelPos == 'top' || this.labelPos == 'left') ? this.rear : this.head;

		if (!this.label || !parent)
			return;

		this.elementFieldCaptcha = this.createDomElement(parent, null, 'img', {

				src : this.captchaUrl,
				alt : this.altText

			}).click(infestor.throttle(function () {

					this.refresh();

				}, 2000), this);

		infestor.mgr.require('infestor.Tip', function () {
		
			this.$tip = this.$tip || infestor.create('infestor.Tip').renderTo(infestor.Dom.getBody());	
			this.$tip.hide();
			
			this.elementFieldCaptcha.on('mouseover', infestor.throttle(function () {

					this.$tempImage = this.$tempImage || this.$tip.createDomElement(this.$tip, null, 'img');
					
					this.$tempImage.attr({
		
						src:this.captchaLastUrl || this.captchaUrl,
						alt:this.altText
					
					});

					this.$tip.show();
					this.$tip.autoPosition(this.elementFieldCaptcha, 'right', 'middle');

				}, 100), this);

			this.elementFieldCaptcha.on('mouseleave', function () {

				this.$tempImage = this.$tempImage && this.$tempImage.remove();
				this.$tip.hide();

			}, this);

		}, this);

		this.elementFieldInput.focus(function () {

			this.elementFieldCaptcha.mouseover();

		}, this).blur(function () {

			this.elementFieldCaptcha.mouseleave();

		}, this);

		(this.labelPos == 'left') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);
		(this.labelPos == 'right') && this.elementFieldCaptcha.addClass(this.cssClsFieldLeft);
		(this.labelPos == 'top') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);

	},

	refresh : function () {

		var me = this;

		this.elementFieldCaptcha.attr({
		
			src:this.captchaUrl,
			alt:this.altText
		
		});

		this.elementFieldCaptcha.element.onload = function () {

			me.$tip && !me.$tip.hidden && me.$tempImage.attr({
		
				src: me.captchaLastUrl || me.captchaUrl,
				alt: me.altText
		
			});
		}

	}

});
