
infestor.define('infestor.field.Field', {

	alias : 'field',

	extend : 'infestor.Panel',
	
	uses:['infestor.Tip','infestor.ValidatePanel','infestor.request'],

	cssUses : ['infestor.Form'],
	
	statics:{
	
		getValidateShower:function(){
		
			return infestor.field.Field.validateShower || infestor.create('infestor.Tip',{		
		
				width:200,
				hidden:true,
				items:[{
				
					alias:'vpanel',
					name:'vpanel'
				}]
		
			}).renderTo(infestor.Dom.getBody());
		
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
		
			this.checked = false;
			this.check();
		
		},this);
		
		this.on('focus',function(){
		
			if(this.validateShower){
			
				this.validateShower.show();
				this.validateShower.autoPosition(this.element, 'bottom', 'head');
			}
			this.check();
		
		},this);
		
		this.on('blur',function(){
		
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
			return this;
		}
		
		this.readOnly = false
		this.elementFieldInput.removeAttr('readonly');
		
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
	
	},
	
	enable:function(){
	
		if(!this.disabled)
			return this;
		
		this.disabled = false;
		
		this.elementFieldInput.attr('disabled',true);
		
		return this;
	},
	
	check:function(){
	
		var value,checked = true,errorMsg,remote = false,prepareFn,afterFn;
				
		value = this.getValue();
		
		afterFn = function(checked,errorMsg){
		
			if(this.validatePanel && !this.validatePanel.hidden){
			
				this.validatePanel.setError(!checked && errorMsg);
				this.validatePanel.setPrompt(this.promptMsg);
				this.validatePanel.setStatus(checked ? infestor.ValidatePanel.VALIDATED_PASS : infestor.ValidatePanel.VALIDATED_ERROR);
			}
			
			this.setStatus(checked ? 'passed':'error');
		
		};
		
		if(this.checked) return afterFn.call(this,this.checked),true;
		
		if(!this.allowNull && !value && value!==0){
		
			this.checked = false;
			errorMsg = '该项不允许为空!';
			afterFn.call(this,this.checked,errorMsg)
			return false;
		
		};
		
		if(!this.validators) return true;
		
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
				handle:validator
				
			});
				
			infestor.isRawObject(validator) && infestor.append(opts,validator);
			
			
			if(opts.type.toLowerCase()=='remote' && !opts.isPrepared){
			
			
			}
			
			!opts.isPrepared  && (opts.isPrepared = true);
			
			validator = opts;
				
			return validator;
		
		};
				
		infestor.each(this.validators,function(idx,validator){
		
			validator = prepareFn.call(this,validator);
			
			if(validate.type.toLowerCase() == 'regexp')
				checked = validator.handle.test(value);
			
			if(infestor.type.toLowerCase() == 'func')
				checked = validator.handle.call(this, value ,this);
			
			if(infestor.type.toLowerCase() == 'remote')
				return infestor.request.ajax(validator.handle) && (remote = true),false;
				
			if(!checked){
			
				errorMsg = validator.errorMsg;
				return false;
			}
		
		},this);
				
		if(remote && checked)
			return false;
		
		this.checked = checked;
		
		afterFn.call(this,this.checked,errorMsg);
		
		return this.checked;
	
	}

});
