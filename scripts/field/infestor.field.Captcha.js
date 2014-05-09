
infestor.define('infestor.field.Captcha', {

	alias : 'captcha',

	extend : 'infestor.field.Field',

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-field infestor-captcha-field',

	// 字段名
	fieldName : null,

	promptMsg : '输入图片上显示的数字和字母[忽略大小写];点击图片或按[Enter]键可重新获取!',
	errorMsg : '验证码错误!',

	checked : false,

	value : null,
	
	// 获取验证码的连接地址
	captchaUrl : '',
	// 验证验证码的连接地址
	captchaVUrl:'',
	// 获取上一个验证码的连接地址
	captchaLastUrl : '',
	
	checkInterval:2500,
	
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
		
		this.refresh();

	},

	initElement : function () {

		this.callParent();
		this.createCaptchaImage();
		this.createCaptchaTip();
		this.eventBindInput();

	},

	createCaptchaImage : function () {

		var parent = (this.labelPos == 'top' || this.labelPos == 'left') ? this.rear : this.head;

		if (!this.label || !parent)
			return;

		this.elementFieldCaptcha = this.createDomElement(parent, null, 'img', {

			alt : this.altText
			
		}).click(infestor.throttle(function () {

			this.refresh();

		}, 2000), this);
		
		(this.labelPos == 'left') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);
		(this.labelPos == 'right') && this.elementFieldCaptcha.addClass(this.cssClsFieldLeft);
		(this.labelPos == 'top') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);
		
		return this;

	},
	
	createCaptchaTip:function(){
		
		this.captchaTip = this.captchaTip || infestor.create('infestor.Tip',{ 
			
				hidden:true,
				hideWithResize:true

		}).renderTo(infestor.Dom.getBody());	
							
		return this;
	
	},
	
	eventBindInput:function(){
	
		this.elementFieldInput.focus(infestor.throttle(function () {

			this.$tempImage = this.$tempImage || this.captchaTip.createDomElement(this.captchaTip, null, 'img');
			
			if(this.isCaptchaChange){
			
				this.$tempImage.attr({

					src:this.captchaLastUrl+'?'+this.getId(),
					alt:this.altText
			
				});
				
				this.isCaptchaChange = false;
			
			}

			this.captchaTip.show();
			this.captchaTip.autoPosition(this.element, 'right', 'middle');

		}, 100), this).blur(function () {

			this.captchaTip.hide();

		}, this).keydown(infestor.throttle(function(event){
		
			(event.which==13) && this.refresh();
			
		},2000),this);
		
		return this;
	
	},

	refresh : function () {

		var me = this;
		
		this.setError();
		
		this.isCaptchaChange = true;

		this.elementFieldCaptcha.attr({
		
			src:this.captchaUrl + '?' + this.getId()
		
		});

		this.elementFieldCaptcha.element.onload = function () {

			me.$tempImage && me.$tempImage.attr({
		
				src: me.captchaLastUrl+'?'+me.getId()
		
			});
		}

	},
	
	destroy:function(){
	
		this.captchaTip = this.captchaTip && this.captchaTip.destroy();
		this.callParent();
	
	}

});
