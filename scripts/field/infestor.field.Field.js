
infestor.define('infestor.field.Field', {

	alias : 'field',

	extend : 'infestor.Panel',
	
	uses:['infestor.Tip','infestor.ValidatePanel','infestor.request'],

	cssUses : ['infestor.Form'],
	
	statics:{
	
		getValidateShower:function(){
		
			infestor.field.Field.validateShower = infestor.field.Field.validateShower || infestor.create('infestor.Tip',{		
		
				width:200,
				hidden:true,
				items:[{
				
					alias:'vpanel',
					name:'vpanel'
				}]
		
			}).renderTo(infestor.Dom.getBody());
			
			return infestor.field.Field.validateShower;
		
		}
	
	},
	
	cssClsElement : 'infestor-field',

	cssClsFieldLabel : 'infestor-field-label',
	cssClsFieldLeft:'infestor-field-left',
	cssClsFieldRight : 'infestor-field-right',
	cssClsFieldTop : 'infestor-field-top',
	cssClsFieldContent : 'infestor-field-content',
	cssClsFieldStatus : 'infestor-field-status',
	cssClsFieldStatusError : 'infestor-field-status-error',
	cssClsFieldStatusPassed: 'infestor-field-status-passed',

	elementFieldLabel : null,
	elementFieldContent : null,
	elementFieldInput : null,
	elementFieldPlaceHolder : null,
	elementFieldError: null,
	elementFieldPrompt : null,
	elementFieldErrorIcon : null,
	
	boxShadow : true,

	// label 设置标签文字
	// false 不创建标签对象
	label : false,

	labelWidth : 45,

	//(top|left|right)
	labelPos : 'left',
	
	// 字段名
	fieldName : null,
	
	promptMsg : '',
	errorMsg : '',
	
	// error passed none
	status:'error',

	layout:'horizon',
	
	checked:false,
	
	value:null,
	
	disabled:false,
	
	readOnly:false,
	
	allowNull:false,
	
	validators:null,
	
	init:function(){
	
		this.fieldName = this.fieldName || this.getId();
		
		this.label && (this.labelPos == 'left' || this.labelPos == 'top') && (this.head = true);
		this.label && (this.labelPos == 'right') && (this.rear = true);
		
		((this.labelPos == 'left' || this.labelPos == 'right') && (this.layout=='none' || !this.layout)) && (this.layout = 'horizon');
		(this.labelPos == 'top' && (this.layout == 'horizon' || this.layout == 'table')) && (this.layout = 'vertical');
		
		this.callParent();
		
		this.setValue(this.value);
		this.setStatus(this.status);
	},

	initElement : function () {

		this.callParent();
		
		this.createLabel().createContent().createInput().createStatusIcon().createValidateShower();
		
		this.setReadOnly(this.readOnly).setDisable();

	},
	
	initEvents:function(){
	
		this.on('change',function(){
		
			this.check();
		
		},this);
		
		this.on('focus',function(e){
			
			//e.preventDefault();
			
			this.validatePanel && this.validatePanel.setError(!this.checked && this.currentErrorMsg).setPrompt(this.promptMsg).setStatus(this.checked ? infestor.ValidatePanel.VALIDATED_PASS : infestor.ValidatePanel.VALIDATING);
			this.validateShower && this.validateShower.show().autoPosition(this.element, 'bottom', 'head');		
			this.$taskId = this.$taskId && infestor.stopTask(this.$taskId);
			this.$taskId = infestor.task(function(){
			
				var value = this.value;			
				this.value = this.getValue();
			    (value !== this.value) && ((this.checked = false) || this.check());

			},2000,this);
			
			//this.check();
		
		},this);
		
		this.on('blur',function(){
		
			this.$taskId = infestor.stopTask(this.$taskId);		
			this.validateShower && this.validateShower.hide();
		
		},this)
	
	},
	
	createLabel:function(){
	
		var parent = (this.labelPos == 'top'||this.labelPos=='left') ? this.head : this.rear;
	
		if(!this.label || !parent) return this;
		
		this.elementFieldLabel = this.createDomElement(parent,this.cssClsFieldLabel,'label',{
		
			'for':this.id
		});
		
		this.labelWidth && this.elementFieldLabel.css('width',infestor.styleFormat(this.labelWidth));
		
		this.elementFieldLabel.text(this.label);
		
		(this.labelPos == 'left') && this.elementFieldLabel.addClass(this.cssClsFieldLeft);
		(this.labelPos == 'right') && this.elementFieldLabel.addClass(this.cssClsFieldRight);
		(this.labelPos == 'top') && this.elementFieldLabel.addClass(this.cssClsFieldTop);
	
		return this;
	
	},
	
	createContent:function(){
	
		this.elementFieldContent = this.createDomElement(this.body,this.cssClsFieldContent);
		
		return this;
	
	},
	
	createInput:function(){
	
		
		this.elementFieldInput = this.createDomElement(this.elementFieldContent,'','input',{
			
			type : 'text',
			id : this.id,
			name : this.fieldName
		});
		
		this.elementFieldInput.change(function(){
		
			this.emit('change',arguments,this);
		
		},this).focus(function(){
		
			this.emit('focus',arguments,this);
		
		},this).blur(function(){
		
			this.emit('blur',arguments,this);
		
		},this);
	
		return this;
	
	},
	
	createStatusIcon:function(){
	
		this.elementStatus = this.createDomElement(this.elementFieldContent,this.cssClsFieldStatus);
		
		return this;
	
	},
	
	createValidateShower:function(){
	
	
		this.validateShower = infestor.field.Field.getValidateShower();
		this.validatePanel = this.validateShower.getItem('vpanel');
		
		return this;
	
	},
	
	focus:function(){
	
		this.elementFieldInput && this.elementFieldInput.element.focus();
	
	},
	
	// 
	setStatus:function(status){
	
		this.status = status;
		
		this.elementStatus.removeClass([this.cssClsFieldStatusError,this.cssClsFieldStatusPassed].join(' '));
		
		if(this.status == 'error')
			this.elementStatus.addClass(this.cssClsFieldStatusError);
		if(this.status == 'passed')
			this.elementStatus.addClass(this.cssClsFieldStatusPassed);
		
		return this;
	
	},

	
	getValue:function(){
		
		if(this.disabled) return null;
	
		return this.elementFieldInput && this.elementFieldInput.val();
	
	},
	
	setValue:function(value){
	
		if(this.disabled || infestor.isNull(value)|| infestor.isUndefined(value))
			return;
		
		this.value = value;
		this.elementFieldInput && this.elementFieldInput.val(value);
	},
	
	setReadOnly:function(readOnly){
	
		if(readOnly){
		
			this.readOnly = true;
			this.elementFieldInput.attr('readonly','readonly');
			
			this.$rchecked = this.checked;
			this.checked = true;
			
			return this;
		}
	
		this.readOnly = false;
		this.elementFieldInput.removeAttr('readonly');
		this.checked = this.$rchecked;
		
		return this;
	
	},
	
	setDisable:function(){
	
		this.disabled = !this.disabled;
		
		if(!this.disabled) 
			this.disable();
		else 
			this.disabled = !this.disabled;
		
		return this;
		
	},
	
	disable:function(){
		
		if(this.disabled)
			return this;
		
		this.disabled = true;
		
		this.elementFieldInput.removeAttr('disabled');
		
		this.$dchecked = this.checked;
		this.checked = true;
	
	},
	
	enable:function(){
	
		if(!this.disabled)
			return this;
		
		this.disabled = false;
		
		this.elementFieldInput.attr('disabled',true);
		
		this.checked = this.$dchecked;
		
		return this;
	},
	
	check:function(){
	
		var value,checked = true,errorMsg,remote = false,prepareFn,afterFn;
				
		value = this.getValue();
		
		this.validatePanel && this.validatePanel.clear();
		
		afterFn = function(checked,errorMsg){
		
			this.currentErrorMsg = errorMsg;
			this.checked = checked;
		
			if(this.validatePanel && !this.validatePanel.hidden){
			
				this.validatePanel.setError(!checked && errorMsg);
				this.validatePanel.setPrompt(this.promptMsg);
				this.validatePanel.setStatus(checked ? infestor.ValidatePanel.VALIDATED_PASS : infestor.ValidatePanel.VALIDATED_ERROR);
			}
			
			this.setStatus(checked ? 'passed':'error');
			
			checked && (this.value = value);
			
			return checked;
		
		};
		
		if(this.checked) return afterFn.call(this,true);
		
		if(!this.allowNull && !value && value!==0)
			return afterFn.call(this,false,'该项不允许为空!');

		
		if(!this.validators) return afterFn.call(this,true);
		
		this.validators = infestor.isArray(this.validators) && this.validators || [this.validators];
		
		prepareFn = function(validator){
		
			var opts = {
			
				type:'',
				errorMsg:this.errorMsg,
				handle:null
			
			};
		
			infestor.isRegExp(validator) && infestor.append(opts,{
			
				type:'regexp',
				handle:validator
			
			});
			
			infestor.isFunction(validator) && infestor.append(opts,{
				
				type:'func',
				handle:validator
			
			});
				
				
			infestor.isString(validator) && infestor.append(opts,{
				
				type:'remote',
				paramName:this.fieldName,
				url:validator
				
			});
				
			infestor.isRawObject(validator) && infestor.append(opts,validator);		
			
			if(opts.type.toLowerCase()=='remote' && !opts.isPrepared){
					
				opts.handle={
					
					scope:this,
					url:opts.url,
					method:opts.method || 'jsonp',
					success:function(data){
					
						afterFn.call(this,!!data,opts.errorMsg);
						
					},
					complete:function(succeed){
					
						!succeed && afterFn.call(this,false,'服务器未响应验证请求!');
					}
				
				};
				
				opts.handle.params = infestor.append({},opts.params);
				
				opts.handle.params[opts.paramName] = value;
				
			
			};
			
			!opts.isPrepared  && (opts.isPrepared = true);
			
			validator = opts;
				
			return validator;
		
		};
				
		infestor.each(this.validators,function(idx,validator){
		
			validator = prepareFn.call(this,validator);
			idx = validator.type.toLowerCase();
			
			if(idx == 'regexp')
				checked = validator.handle.test(value);
			
			if(idx == 'func')
				checked = validator.handle.call(this, value ,this);
			
			if(idx == 'remote')
				return infestor.request.ajax(validator.handle) && (remote = true),false;
				
			if(!checked){
			
				errorMsg = validator.errorMsg;
				return false;
			}
		
		},this);
				
		if(remote && checked)
			return false;
		
		return afterFn.call(this,checked,errorMsg);
		
	},
	
	destroy:function(){
	
		infestor.stopTask(this.$taskId); 
		this.callParent();
	
	}

});
