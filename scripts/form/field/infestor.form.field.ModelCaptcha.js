
infestor.define('infestor.form.field.ModelCaptcha', {

	alias : 'modelcaptcha',

	extend : 'infestor.form.field.Field',

	cssUses : ['infestor.Form'],

	cssClsElement : 'infestor-field infestor-model-captcha-field',

	// 字段名
	fieldName : null,

	promptMsg : '输入图片上显示的数字和字母[忽略大小写];点击图片或按[Enter]键可重新获取!',
	errorMsg : '验证码错误!',

	checked : false,

	value : null,
	
	// 验证字符数目
	codeNum : 5,
	// 备选字符数目
	candidateNum : 9,	
	// 获取验证码的连接地址
	captchaUrl : '',
	// 验证验证码的连接地址
	captchaVUrl: '',	
	// 验证码缓存参数名
	captchaCacheTagName : 'candidate-captcha-cache-tag',
	
	//checkInterval:2500,
	
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
		
		this.createControlPanel().createCaptchaTip();
	},
	
	initEvents:function(){
	
		this.callParent();
		
		this.on('focus',infestor.throttle(function () {


			this.captchaTip.show();
			this.captchaTip.autoPosition(this.element, 'right', 'middle');

		}, 100), this);
		
		
		// this.on('blur',function () {

			// this.captchaTip.hide();

		// }, this);
		
	
	
	},
	

	
	createControlPanel : function(){
			
		
		var cellItems = [],i=0,pos;
		
		for(; i< this.candidateNum;i++){
		
		
			pos = this.getCandidatePos(i);
			
			pos = infestor.px(pos.x) + ' ' + infestor.px(pos.y);
		
			cellItems.push({
			
				cssClsElement:'infestor-model-captcha-control-panel-body-cell ' + this.cssClsElementInlineBlock,
				css:{
				
					backgroundImage:'url('+ this.currentUrl +')',
					backgroundPosition:pos,
					backgroundRepeat:'no-repeat'
				
				}
			
			});
		
		}
		
		pos = this.getCaptchaPos();
		pos = infestor.px(pos.x) + ' ' + infestor.px(pos.y);
		
		
		this.controlPanel = this.controlPanel || infestor.create('infestor.Panel',{
		
			head:{
			
				cssClsElement:'infestor-model-captcha-control-panel-head',
				itemLayout:'horizon',
				items:[{
					
					cssClsElement:'infestor-model-captcha-control-panel-head-captcha',
					name:'captcha-image',
					css:{
					
						backgroundImage:'url('+ this.currentUrl +')',
						backgroundPosition:pos,
						backgroundRepeat:'no-repeat'
					}
					
				
				},{
					cssClsElement:'infestor-model-captcha-control-panel-head-backspace',
					name:'backspace'
				}]
			
			},
			
			cssClsBody :'infestor-model-captcha-control-panel-body',
			
			items:cellItems
			
		
		});
							
		return this;
	
	},
	
	
	// 获取验证码图片坐标（可根据需要在创建对象时重写）
	getCaptchaPos : function(){
	
		return {
		
			x:0,
			y:0
		};
	
	},
	
	// 获取备选字坐标 （可根据需要在创建对象时重写）
	getCandidatePos : function(index){
	
		return {
		
			x:-40*index,
			y:-40
		
		};
	
	},
	
	//
	createCaptchaTip:function(){
		
		this.captchaTip = this.captchaTip || infestor.create('infestor.Tip',{ 
			
				hidden:true,
				hideWithResize:true,
				items : this.controlPanel

		}).renderTo(infestor.Dom.getBody());	
							
		return this;
	
	},
	
	refresh : function () {

		
		// this.setError();
		
		this.currentUrl = this.captchaUrl + '?' + this.captchaCacheTagName + '=' + this.getId();
		
		this.controlPanel.head.getItem('captcha-image').element.css('backgroundImage','url('+ this.currentUrl +')');
		
		this.controlPanel.eachItems(function(idx,item){
		
			item.element.css('backgroundImage','url('+ this.currentUrl +')');
		
		},this,'num');


	},
	
	destroy:function(){
	
		this.captchaTip = this.captchaTip && this.captchaTip.destroy();
		this.callParent();
	
	}

});
