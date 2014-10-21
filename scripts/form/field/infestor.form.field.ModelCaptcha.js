
infestor.define('infestor.form.field.ModelCaptcha', {

	alias : 'modelcaptcha',

	extend : 'infestor.form.field.Field',

	uses : ['infestor.Indicator'],
	
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
		
		//this.refresh();

	},

	initElement : function () {

		this.callParent();
		
		this.createControlPanel().createCaptchaTip();
	},
	
	initEvents : function(){
		
		this.on('focus',infestor.throttle(function () {
		
			if(this.disabled || this.readOnly || this.isFocus) return;
			
			this.isFocus = true;
		
			this.captchaTip.autoPosition(this.element, 'right', 'middle');
			this.captchaTip.show();
			
			!this.isActive && this.refresh();
			
			this.isActive = true;

		}, 100), this);
		
		
		this.on('blur',function () {
		
			this.isFocus = false;

		}, this);
		
		this.delegate(this.controlPanel,'click',true,function(inst,e){
		
			if(inst.element.hasClass('infestor-model-captcha-control-panel-body-cell')){
			 	this.setValue(inst.pos);
				return;
			}
			
			if(inst.element.hasClass('infestor-model-captcha-control-panel-head-backspace')){
			
				this.clearValue(true);
				return;
			
			}
			
			if(inst.element.hasClass('infestor-model-captcha-control-panel-head-refresh')){
			
				this.refresh();
				return;
			
			}
			
			if(inst.element.hasClass('infestor-model-captcha-control-panel-head-cancel')){
			
				this.captchaTip.hide();
				return;
				
			}
			
			
		
		},this,true);
		
	
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
		
		},this).click(function(e){
		
			infestor.stopPropagation(e);
			
		});
		
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
					
						backgroundPosition:pos,
						backgroundRepeat:'no-repeat'
					},
					attr:{
					
						title:'验证图片'
					}
					
				
				},{
					cssClsElement:'infestor-model-captcha-control-panel-head-backspace',
					name:'backspace',
					attr:{
					
						title:'退格'
					}
				},{
					cssClsElement:'infestor-model-captcha-control-panel-head-refresh',
					name:'refresh',
					attr:{
					
						title:'刷新验证码'
					}
				},{
					cssClsElement:'infestor-model-captcha-control-panel-head-cancel',
					name:'cancel',
					attr:{
					
						title:'关闭'
					}
				}]
			
			},
			
			items:infestor.genArray(this.candidateNum,function(i){
			
				var pos = this.getCandidatePos(i);
			
				return {
			
					cssClsElement:'infestor-model-captcha-control-panel-body-cell ' + this.cssClsElementInlineBlock,
					pos:i,
					css:{
					
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
				hideWithBlur:true,
				items : this.controlPanel

		}).renderTo(infestor.Dom.getBody());	
							
		return this;
	
	},
	
	refresh : function () {

				
		this.currentUrl = this.captchaUrl + '?' + this.captchaCacheTagName + '=' + this.getId();
			
		this.loadCaptchaImage(this.currentUrl,function(){
		
		
			this.controlPanel.head.getItem('captcha-image').element.css('backgroundImage','url('+ this.currentUrl +')');
		
			this.controlPanel.eachItems(function(idx,item){
			
				item.element.css('backgroundImage','url('+ this.currentUrl +')');
			
			},this,'num');
			
			this.clearValue();
			
		
		},function(){});
		
	
	},
	
	loadCaptchaImage : function(src,onload,onerror){
	
		var me = this,tempImage = new Image();
		
		tempImage.src = src;
			
		this.imageLoadIndicator = this.imageLoadIndicator || infestor.create('infestor.Indicator',{
		
			showMask:function(){ me.controlPanel.showMask(); },
			hideMask:function(){ me.controlPanel.hideMask(); },
			showIndicator:function(){ 
				me.elementImageLoadIndicator = me.elementImageLoadIndicator || infestor.create('infestor.Element',{ 
					css:{  
					
						position : 'absolute',
						width : '0%',
						height : '5px',
						bottom: 0,
						left : 0,
						'background-color' : 'orange'
					
					} 
				}).renderTo(me.controlPanel); 
				
				me.elementImageLoadIndicator.show();
			},
			hideIndicator:function(){
			
				me.elementImageLoadIndicator && me.elementImageLoadIndicator.hide();
			
			},
			changeIndicator:function(value){
			
				me.elementImageLoadIndicator && me.elementImageLoadIndicator.element.css('width', value + '%');
			
			}
		
		});
		
		this.imageLoadIndicator.start();
		
		tempImage.onload = function(){
		
			onload && onload.call(me);
			me.imageLoadIndicator.stop();
		
		};
		
		tempImage.onerror = function(){
		
			onerror && onerror.call(me);
			me.imageLoadIndicator.stop();
		
		};
		
	},
	
	// # rewite methods
	
	destroy:function(){
	
		this.captchaTip = this.captchaTip && this.captchaTip.destroy();
		this.callParent();
	
	}

});
