
infestor.define('infestor.field.Captcha', {

	alias : 'captcha',

	extend : 'infestor.field.Field',

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-field infestor-captcha-field',

	// 字段名
	fieldName : null,

	promptMsg : '输入图片上显示的数字和字母(忽略大小写),点击图片可重新获取!',
	errorMsg : '验证码错误!',

	checked : false,

	value : null,
	
	// 获取验证码的连接地址
	captchaUrl : '',
	// 验证验证码的连接地址
	captchaVUrl:'',
	// 获取上一个验证码的连接地址
	captchaLastUrl : '',
	
	altText:'loading..',
	
	layout : 'table',
	
	allowNull: false,

	init : function () {

		this.head = true;
		this.rear = true;
		
		this.captchaLastUrl || this.captchaUrl;
		
		this.validators = (this.validators = this.validators || []) && infestor.isArray(this.validators) && this.validators || [this.validators];
		
		this.captchaVUrl && this.validators.push(this.captchaVUrl);
		
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

				src : this.captchaUrl+'?'+this.getId(),
				alt : this.altText

			}).click(infestor.throttle(function () {

					this.refresh();

				}, 2000), this);

		infestor.mgr.require('infestor.Tip', function () {
		
			this.$tip = this.$tip || infestor.create('infestor.Tip',{ hidden:true }).renderTo(infestor.Dom.getBody());	
			
			this.elementFieldInput.focus(infestor.throttle(function () {

				this.$tempImage = this.$tempImage || this.$tip.createDomElement(this.$tip, null, 'img');
				
				this.$tempImage.attr({
	
					src:this.captchaLastUrl+'?'+this.getId(),
					alt:this.altText
				
				});

				this.$tip.show();
				this.$tip.autoPosition(this.element, 'right', 'middle');

			}, 100), this).blur(function () {

				this.$tempImage = this.$tempImage && this.$tempImage.remove();
				this.$tip.hide();

			}, this);
				

		}, this);

		
		(this.labelPos == 'left') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);
		(this.labelPos == 'right') && this.elementFieldCaptcha.addClass(this.cssClsFieldLeft);
		(this.labelPos == 'top') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);

	},

	refresh : function () {

		var me = this;
		
		this.checked = false;
		this.check();

		this.elementFieldCaptcha.attr({
		
			src:this.captchaUrl+'?'+this.getId(),
			alt:this.altText
		
		});

		this.elementFieldCaptcha.element.onload = function () {

			me.$tip && !me.$tip.hidden && me.$tempImage.attr({
		
				src: me.captchaLastUrl+'?'+me.getId(),
				alt: me.altText
		
			});
		}

	}

});
