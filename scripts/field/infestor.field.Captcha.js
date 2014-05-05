
infestor.define('infestor.field.Captcha',{

	alias : 'captcha',

	extend : 'infestor.field.Field',

	cssUses : ['infestor.Form'],
	
	cssClsElement : 'infestor-field infestor-captcha-field',
		
	// 字段名
	fieldName : null,
	
	promptMsg : '',
	errorMsg : '',
	
	checked:false,
	
	value:null,
	
	captchaUrl:'',
	
	captchaLastUrl:'',
	
	layout:'table',
	
	
	init:function(){
	
		this.head = true;
		this.rear = true;
	
		this.callParent();
	
	},

	initElement : function () {

		this.callParent();
		this.createCaptchaImage();
		

	},
	
	createCaptchaImage:function(){
	
		
		var parent = (this.labelPos == 'top'||this.labelPos=='left') ? this.rear : this.head;
	
		if(!this.label || !parent) return;
		
		this.elementFieldCaptcha = this.createDomElement(parent,null,'img',{
		
			src:this.captchaUrl
			
		}).click(function(){
		
			this.elementFieldCaptcha.attr('src',this.captchaUrl);
		
		},this);
		
		infestor.mgr.require('infestor.Tip', function () {

			this.$tip = this.$tip || infestor.Tip.init();

			this.elementFieldCaptcha.on('mouseover', infestor.throttle(function () {

					this.$tempImage = this.$tip.createDomElement(this.$tip,null,'img',{
					
						src:this.captchaLastUrl || this.captchaUrl
					});
					
					this.$tip.show();
					this.$tip.autoPosition(this.elementFieldCaptcha, 'right', 'middle');

				}), this);

			this.elementFieldCaptcha.on('mouseleave', function () {

				this.$tempImage.remove();
				this.$tip.hide();

			}, this);

		}, this);
		
		(this.labelPos == 'left') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);
		(this.labelPos == 'right') && this.elementFieldCaptcha.addClass(this.cssClsFieldLeft);
		(this.labelPos == 'top') && this.elementFieldCaptcha.addClass(this.cssClsFieldRight);
	
	}
	
});