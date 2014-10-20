
infestor.define('infestor.form.field.Captcha', {

	alias : 'captcha',

	extend : 'infestor.form.field.Field',

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
	captchaVUrl: '',
	
	// 验证码缓存参数名
	captchaCacheTagName : 'captcha-cache-tag',
	
	checkInterval:2500,
	
	altText:'loading..',
	
	layout : 'table',
	
	allowNull: false,

	init : function () {

		this.head = true;
		this.rear = true;
		
		this.validators = (this.validators = this.validators || []) && infestor.isArray(this.validators) && this.validators || [this.validators];
		
		this.captchaVUrl && this.validators.push(this.captchaVUrl);
		
		this.callParent();
		
		this.refresh();

	},

	initElement : function () {

		this.callParent();
		this.createCaptchaImage();
		this.createCaptchaTip();
	},
	
	initEvents:function(){
	
		this.callParent();
		
		this.on('focus',infestor.throttle(function () {

			this.$tempImage = this.$tempImage || this.captchaTip.createDomElement(this.captchaTip, null, 'img');
			
			this.$tempImage.attr({

				src:this.currentUrl,
				alt:this.altText
			
			});

			this.captchaTip.autoPosition(this.element, 'right', 'middle');
			this.captchaTip.show();

		}, 100), this);
		
		
		this.on('blur',function () {

			this.captchaTip.hide();

		}, this);
		
		
		this.on('keydown',infestor.throttle(function(event){
		
			(event.keyCode==infestor.keyCode.enter) && this.clearValue() && this.refresh();
			
		},2000),this);
	
	
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
	
	refresh : function () {

		var me = this;
		
		this.setError();
		
		this.currentUrl = this.captchaUrl + '?' + this.captchaCacheTagName + '=' + this.getId();

		this.elementFieldCaptcha.attr({
		
			src:this.currentUrl
		
		});

		this.elementFieldCaptcha.element.onload = function () {

			me.$tempImage && me.$tempImage.attr({
		
				src : me.currentUrl
		
			});
		}

	},
	
	destroy:function(){
	
		this.captchaTip = this.captchaTip && this.captchaTip.destroy();
		this.callParent();
	
	}

});
