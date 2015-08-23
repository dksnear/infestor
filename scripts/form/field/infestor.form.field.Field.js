
infestor.define('infestor.form.field.Field', {

	alias : 'field',

	extend : 'infestor.Panel',
	
	uses:['infestor.Tip','infestor.form.ValidatePanel','infestor.form.validator','infestor.request'],

	cssUses : ['infestor.form'],
	
	statics:{
		
		groupMap:{},
		
		clearGroup:function(name){
		
		
			if(arguments.length < 1)
				infestor.each(infestor.form.field.Field.groupMap,function(name){
				
					infestor.form.field.Field.clearGroup(name);
				
				});
		
			if(!infestor.form.field.Field.groupMap[name])
				return false;
			
			infestor.each(infestor.form.field.Field.groupMap[name],function(){
			
				(this instanceof infestor.Element || this instanceof infestor.Dom) && this.destroy();
			
			});
			
			return delete infestor.form.field.Field.groupMap[name];
			
		
		},
		
		addGroup:function(name,contents){
		
			infestor.form.field.Field.groupMap[name] = infestor.form.field.Field.groupMap[name] || {};
			
			infestor.append(infestor.form.field.Field.groupMap[name],contents);
		
		},
	
		getValidateMonitor:function(news){
		
			var create = function(){
			
				return infestor.create('infestor.Tip',{		
		
					width:200,
					hidden:true,
					hideWithResize:true,
					items:[{
					
						alias:'vpanel',
						name:'vpanel'
					}]
			
				}).renderTo(infestor.Dom.getBody());
			
			
			};
			
			if(news) return create();
		
			infestor.form.field.Field.validateMonitor = infestor.form.field.Field.validateMonitor || create();
			
			return infestor.form.field.Field.validateMonitor;
		
		}
	
	},
	
	cssClsElement : infestor.bRouter({ 	
		 ie7minus : 'infestor-field-ie7minus',
		 otherwise : 'infestor-field'
	}),
	cssClsFieldLabel : 'infestor-field-label',
	cssClsFieldLeft:'infestor-field-left',
	cssClsFieldRight : 'infestor-field-right',
	cssClsFieldTop : 'infestor-field-top',
	cssClsFieldContent : 'infestor-field-content',
	cssClsFieldStatus : 'infestor-field-status',
	cssClsFieldStatusLeft : 'infestor-field-status-left',
	cssClsFieldStatusRight : 'infestor-field-status-right',
	cssClsFieldStatusNotNull:'infestor-field-status-not-null',

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

	labelWidth : 50,
	
	inputStyle: {},

	//(top|left|right)
	labelPos : 'left',
	
	// 字段名
	fieldName : null,
	
	promptMsg : '',
	
	errorMsg : '',
	
	layout:'horizon',
	
	checked:false,
	
	// 输入检查间隔时间
	checkInterval:1000,
	
	value:null,
	
	disabled:false,
	
	readOnly:false,
	
	// 允许空
	allowNull:true,
	
	// 允许由form提交
	allowSubmit:true,
	
	// 允许显示验证状态
	allowCheckStatus:true,
	
	// 获取表单值时去除空格
	trim:false,
	
	validators:null,
	
	inputType:'text',
	
	hideOtherDropdownWithFocus : false,
	
	init:function(){
	
		this.fieldName = this.fieldName || this.getId();
		
		this.label && (this.labelPos == 'left' || this.labelPos == 'top') && (this.head = true);
		this.label && (this.labelPos == 'right') && (this.rear = true);
		
		((this.labelPos == 'left' || this.labelPos == 'right') && (this.layout=='none' || !this.layout)) && (this.layout = 'horizon');
		(this.labelPos == 'top' && (this.layout == 'horizon' || this.layout == 'table')) && (this.layout = 'vertical');
		
		this.callParent();
		
		this.setValue(this.value);
		this.status = this.checked ? 'passed':'error';
		this.setStatus(this.status);
		this.setReadOnly(this.readOnly).setDisable();

	},

	initElement : function () {

		this.callParent();
		
		this.createLabel().createContent().createInput().createStatusIndicator().createValidateMonitor();
		
	},
	
	initEvents:function(){
	
		this.on('focus',function(e){
			
			this.isFocus = true;
			this.validatePanel && this.validatePanel.setError(!this.checked && this.currentErrorMsg).setPrompt(this.promptMsg).setStatus(this.checked ? infestor.form.ValidatePanel.VALIDATED_PASS : infestor.form.ValidatePanel.VALIDATED_ERROR);
			this.showValidateMonitor()
			this.$taskId = this.$taskId && infestor.stopTask(this.$taskId);
			this.$taskId = infestor.task(function(){
			
				if(!this.isFocus) return;
				
			    (this.value !== this.getValue()) && ((this.checked = false) || this.check());
				
				this.showValidateMonitor()

			},this.checkInterval || 600,this);
		
		},this);
		
		this.on('blur',function(){
		
			this.isFocus = false;
			this.$taskId = infestor.stopTask(this.$taskId);		
			this.hideValidateMonitor();
			(this.value !== this.getValue()) && ((this.checked = false) || this.check());
		
		},this);
		
		this.on('keyup',function(){
		
			(this.value !== this.getValue()) && this.validatePanel.setStatus(infestor.form.ValidatePanel.VALIDATING);
		
		},this);
	
	},
	
	createLabel:function(){
	
		var parent = (this.labelPos == 'top'||this.labelPos=='left') ? this.head : this.rear;
	
		if(!this.label || !parent) return this;
		
		this.elementFieldLabel = this.createDomElement(parent,this.cssClsFieldLabel,'label',{ 'for':this.id });
		
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
			
			type : this.inputType,
			id : this.id,
			name : this.fieldName
			
		}).css(this.inputStyle);
		
		// !this.allowNull && this.elementFieldInput.addClass(this.cssClsFieldStatusNotNull);
 		
		this.elementFieldInput.change(function(){
		
			this.emit('change',arguments,this);
		
		},this).focus(function(){
		
			// for hide all field dropdown without this
			this.hideOtherDropdownWithFocus && infestor.Dom.getBody().fire('click');
			this.emit('focus',arguments,this);
		
		},this).blur(function(){
		
			this.emit('blur',arguments,this);
		
		},this).keydown(function(){
		
			this.emit('keydown',arguments,this);
		
		},this).keyup(function(){
		
			this.emit('keyup',arguments,this);
		
		},this).click(function(e){
		
			// for forbid hide this dropdown
			infestor.stopPropagation(e);
		
		});
	
		return this;
	
	},
	
	createStatusIndicator:function(){
	
		if(!this.allowCheckStatus)
			return this;
	
		this.statusIndicator = infestor.create('infestor.Element',{
		
			cssClsElement : [this.cssClsGlobalIconDisabled16,this.cssClsFieldStatus, this.labelPos=='right'? this.cssClsFieldStatusLeft : this.cssClsFieldStatusRight].join(' '),
			icon : this.checked ? 'accept' : 'edit'
		
		}).renderTo(this.elementFieldContent);
		
		return this;
	
	},
	
	createValidateMonitor:function(){
	
	
		this.validateMonitor = infestor.form.field.Field.getValidateMonitor();
		this.validatePanel = this.validateMonitor.getItem('vpanel');
		
		return this;
	
	},
	
	showValidateMonitor:function(){
	
		!this.checked && this.validateMonitor && this.validateMonitor.autoPosition(this.element, 'bottom', '10') && this.validateMonitor.show(true);
		
		return this;
	},
	
	hideValidateMonitor:function(){
	
		this.validateMonitor && this.validateMonitor.hide();
		
		return this;
	},
	
	focus:function(){
	
		if(this.isFocus) return this;
	
		this.elementFieldInput && this.elementFieldInput.element.focus();
		this.isFocus = true;
		
		return this;
	
	},
	
	blur:function(){
	
		if(!this.isFocus) return this;
	
		this.elementFieldInput && this.elementFieldInput.element.blur();		
		this.isFocus = false;
		
		return this;
	
	},
		
	setStatus:function(status){
	
		if(!this.statusIndicator) return this;
	
		this.status = status;
		
		if(this.status == 'error')
			this.statusIndicator.setIcon('edit');
		if(this.status == 'passed')
			this.statusIndicator.setIcon('accept');
		
		return this;
	
	},

	getValue :function(){
	
		var value;
		
		if(this.disabled) return null;
		
		value = this.elementFieldInput && this.elementFieldInput.val() || '';
	
		return this.trim ? infestor.trim(value) : value;
	
	},
	
	setValue:function(value){
	
		if(this.disabled || infestor.isNull(value)|| infestor.isUndefined(value))
			return;
		
		this.value = String(value);
		this.elementFieldInput && this.elementFieldInput.val(this.value);
	},
	
	clearValue:function(){

		this.setValue('');
		
		return this;
	
	},
	
	reset:function(){
	
		this.isFocus = false;
		this.checked = false;
		this.clearValue();
		this.check();
		
		return this;
	
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
		this.checked = infestor.isBoolean(this.$rchecked) ?  this.$rchecked : this.checked;
		
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
		
		this.checked = infestor.isBoolean(this.$dchecked) ?  this.$dchecked : this.checked;
		
		return this;
	},
	
	// 立刻置为错误状态
	setError:function(){
	
		this.checked = false;
		
		this.setStatus('error');
		
		// 阻塞正在进行的异步检查
		this.blockCheck = true;
		
		this.isFocus && this.validatePanel && this.validatePanel.setError(this.currentErrorMsg || this.errorMsg).setPrompt(this.promptMsg).setStatus(infestor.form.ValidatePanel.VALIDATED_ERROR);
		
		return this;
	
	},
	
	// 立刻置为通过状态
	setPassed:function(){
	
		this.checked = true;
		
		this.setStatus('passed');
		
		// 阻塞正在进行的异步检查
		this.blockCheck = true;
		
		this.isFocus && this.validatePanel && this.validatePanel.setError(false).setPrompt(this.promptMsg).setStatus(infestor.form.ValidatePanel.VALIDATED_PASS);
		
		return this;
	
	},
	
	check : function(){
	
		var value,checked = true,errorMsg,promptMsg,remote = false,prepareFn,afterFn;
		
		this.blockCheck = false;
		
		value = this.getValue();
		
		this.validatePanel && this.validatePanel.setStatus(infestor.form.ValidatePanel.VALIDATING);
		
		afterFn = function(checked,errorMsg,promptMsg){
		
			this.currentErrorMsg = errorMsg;
			this.currentPromptMsg = promptMsg;
			this.checked = checked;
		
			// isFocus judgement for validatePanel with single instance
			if(this.validatePanel && !this.validatePanel.hidden && this.isFocus){
			
				this.validatePanel.setError(!checked && errorMsg);
				this.validatePanel.setPrompt(promptMsg || this.promptMsg);
				this.validatePanel.setStatus(checked ? infestor.form.ValidatePanel.VALIDATED_PASS : infestor.form.ValidatePanel.VALIDATED_ERROR);
			}
			
			this.setStatus(checked ? 'passed':'error');
			
			//checked && (this.value = value);
			
			this.value = value;
			
			if(checked)
				infestor.delay(function(){ this.hideValidateMonitor(); },500,this);
			
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
				promptMsg:this.promptMsg,
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
			
			!opts.type && infestor.isRegExp(opts.handle) && (opts.type = 'regexp');
			!opts.type && infestor.isFunction(opts.handle) && (opts.type = 'func');
			!opts.type && infestor.isString(opts.handle) && (opts.type = 'remote');
					
			if(opts.type.toLowerCase()=='remote' && !opts.isPrepared){
			
				opts.url = opts.url || opts.handle;
				opts.paramName = opts.paramName || this.fieldName;
			
				opts.handle={
					
					scope:this,
					url:opts.url,
					method:opts.method || 'jsonp',
					success:function(data){
					
						!this.blockCheck && afterFn.call(this,!!data,opts.errorMsg);
						this.emit('remoteCheckSuccess',[data,this],this);
						
					},
					complete:function(succeed){
					
						!this.blockCheck && !succeed && afterFn.call(this,false,'服务器未响应验证请求!');
						this.emit('remoteCheckComplete',[succeed,this],this);
					}
				
				};
				
				opts.handle.params = infestor.append({},opts.params);
				
				opts.handle.params[opts.paramName] = value;
				
			
			};
			
			if(!opts.handle)
				return null;
			
			!opts.isPrepared  && (opts.isPrepared = true);
			
			validator = opts;
				
			return validator;
		
		};
				
		infestor.each(this.validators,function(idx,validator){
		
			validator = prepareFn.call(this,validator);
			
			if(!validator)
				return true;
			
			idx = validator.type.toLowerCase();
			
			errorMsg = validator.errorMsg || this.errorMsg;
			promptMsg = validator.promptMsg || this.promptMsg;
			
			if(idx == 'regexp')
				checked = validator.handle.test(value);
			
			if(idx == 'func'){
				checked = validator.handle.call(this, value ,this);
				if(infestor.isRawObject(checked)){
					
					errorMsg = checked.errorMsg || errorMsg;
					promptMsg = checked.promptMsg || promptMsg;
					checked = checked.passed;
				
				}
			}
			
			// 只接受一个远程验证器
			if(idx == 'remote')
				return !remote && infestor.request.ajax(validator.handle) && (remote = true),false;
				
			if(!checked){
			
				return false;
			}
					
		},this);
		
		if(remote && checked)
			return false;
		
		return afterFn.call(this,checked,errorMsg,promptMsg);
		
	},
	
	destroy:function(){
	
		infestor.stopTask(this.$taskId); 
		this.callParent();
	
	}

});
