
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
	candidateNum : 16,	
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

	
	// #rewite methods
	
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
	
	initEvents : function(){
	
		// this.callParent();
		
		this.on('focus',infestor.throttle(function () {
		
			if(this.disabled || this.readOnly) return;
		
			this.captchaTip.autoPosition(this.element, 'right', 'middle');
			this.captchaTip.show();

		}, 100), this);
		
		
		// this.on('blur',function () {

			// this.captchaTip.hide();

		// }, this);
		
		
		this.controlPanel && this.delegate(this.controlPanel.body,'click',function(inst,e){
		
			 return inst && inst.element.hasClass('infestor-model-captcha-control-panel-body-cell');
		
		},function(inst,e){
		
			this.setValue(inst.pos);
		
		},this);
		
	
		this.controlPanel && this.delegate(this.controlPanel.head,'click',function(inst,e){
		
		
		},function(inst,e){
		
		
		
		},this);
	
	},
	
	createInput : function(){
	
		this.fieldInput = this.fieldInput || infestor.create('infestor.Element',{
		
			cssClsElement:'infestor-model-captcha-input',
			attr:{
			
				tabindex:-1
			},
			items:infestor.genArray(this.codeNum,function(i){
			
				return {
				
					cssClsElement:'infestor-model-captcha-input-cell ' + this.cssClsElementInlineBlock
					
				
				};
				
			
			},this)
				
		
		}).renderTo(this.elementFieldContent);
		
		
		this.fieldInput.element.focus(function(){
		
			this.emit('focus',arguments,this);
		
		},this).blur(function(){
		
			this.emit('blur',arguments,this);
		
		},this);
		
		return this;
	
	},
	
	focus:function(){
	
		this.fieldInput && this.fieldInput.getDom().focus();
		this.isFocus = true;
		
		return this;
	
	},
	
	blur:function(){
	
		this.fieldInput && this.fieldInput.getDom().blur();		
		this.isFocus = false;
		
		return this;
	
	},
	
	getValue : function(){
	
		return this.value;
	
	},
	
	setValue : function(value){
	
		var pos,item;

		if(infestor.isArray(value))
			return infestor.each(value,function(v){ this.setValue(v); },this),this;
			
		this.valueSet = this.valueSet || [];
		
		if(!this.currentUrl || !infestor.isNumber(value) || value < 0 || this.valueSet.length >= this.codeNum) return this;
		
		value = value > this.candidateNum ? this.candidateNum : value;
			
		pos = this.getCandidatePos(value);
		
		item = this.fieldInput.getItem(this.valueSet.length);
		
		if(!item) return this;
			
		item.element.css({
		
			backgroundImage:'url('+ this.currentUrl +')',
			backgroundPosition:infestor.px(pos.x) + ' ' + infestor.px(pos.y),
			backgroundRepeat:'no-repeat'
		
		});
		
		this.valueSet.push(value);
		this.value = this.valueSet.join('');
		
		return this;
	
	},
	
	clearValue : function(last){
	
		var pos,item;
		
		if(!this.valueSet || this.valueSet.length < 1) return this;
		
		if(!last) {
		
			while (this.valueSet.length > 0)
				this.clearValue(true);
			
			return this;
		
		};
		
		item = this.fieldInput.getItem(this.valueSet.length-1);
		
		if(!item) return this;
			
		item.element.css({
		
			backgroundImage:'',
			backgroundPosition:'',
			backgroundRepeat:''
		
		});
		
		this.valueSet.pop();
		this.value = this.valueSet.join('');
		
	
		return this;
	},
	
	setReadOnly : function(readOnly){
	
		this.readOnly =  readOnly ? true : false;
	
		return this;
	
	},
	
	disable : function(){
	
		this.disabled = true;
		
		return this;
	},
	
	enable : function(){
	
		this.disabled = false;
		
		return this;

	},
	
	
	// #new methods

	createControlPanel : function(){
			
				
		var pos = this.getCaptchaPos();
		
		pos = infestor.px(pos.x) + ' ' + infestor.px(pos.y);
		
		
		this.controlPanel = this.controlPanel || infestor.create('infestor.Panel',{
		
			cssClsBody :'infestor-model-captcha-control-panel-body',
		
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
			
			items:infestor.genArray(this.candidateNum,function(i){
			
				var pos = this.getCandidatePos(i);
			
				return {
			
					cssClsElement:'infestor-model-captcha-control-panel-body-cell ' + this.cssClsElementInlineBlock,
					pos:i,
					css:{
					
						backgroundImage:'url('+ this.currentUrl +')',
						backgroundPosition:infestor.px(pos.x) + ' ' + infestor.px(pos.y),
						backgroundRepeat:'no-repeat'
					
					}
				};
			
			},this)
			
		
		});
		
							
		return this;
	
	},
	
	
	// 获取验证码图片坐标（可根据需要在创建对象时重写）
	getCaptchaPos : function(){
	
		return {
		
			x:-10,
			y:0
		};
	
	},
	
	// 获取备选字坐标 （可根据需要在创建对象时重写）
	getCandidatePos : function(index){
	
		return {
		
			x:-10-30*index,
			y:-45
		
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
	
	// # rewite methods
	
	destroy:function(){
	
		this.captchaTip = this.captchaTip && this.captchaTip.destroy();
		this.callParent();
	
	}

});
