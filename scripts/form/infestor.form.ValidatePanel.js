
// 用于处理表单验证

infestor.define('infestor.form.ValidatePanel',{


	alias : 'vpanel',
	extend : 'infestor.Panel',
	
	statics:{
	
		// 状态码
		VALIDATING:0,
		VALIDATED_PASS:1,
		VALIDATED_ERROR:2
	
	},

	cssClsValidateElement : 'infestor-validate-panel',
	cssClsValidateTitle:'infestor-validate-panel-title',
	cssClsValidateBody : 'infestor-validate-panel-body',
	cssClsValidateBodyErrorText:'infestor-validate-panel-error-text',
	cssClsValidateBodyPromptText:'infestor-validate-panel-prompt-text',
	
	cssClsValidateStatusPanel:'infestor-validate-status-panel',
	cssClsValidateStatusPanelHead:'infestor-validate-status-panel-head',
	cssClsValidateStatusPanelBody:'infestor-validate-status-panel-body',
	cssClsValidateStatusValidating:'infestor-validate-panel-status-validating',
	
	// 用于显示提示
	promptPanel:true,
	// 用于显示错误
	errorPanel:true,
	// 用于显示验证状态
	statusPanel:true,
	
	promptTitle:'提示',
	errorTitle:'错误',
	promptText:'',
	errorText:'',
	status:0,
	statusTexts:['正在验证...','已通过验证!','未通过验证!'],
	
	
	initElement:function(){
	
		this.callParent();
		this.createStatusPanel();
		this.createErrorPanel();
		this.createPromptPanel();
			
		this.setPrompt(this.promptText);
		this.setError(this.errorText);
		this.setStatus(this.status);
	
	},
	
	createPromptPanel:function(){
	
		this.promptPanel = this.createElement('promptPanel',this,{
		
			cssClsElement :this.cssClsValidateElement,
			cssClsTitle:this.cssClsValidateTitle,
			cssClsBody : [this.cssClsValidateBody,this.cssClsValidateBodyPromptText].join(' '),
			titleText:this.promptTitle
			
		
		},'infestor.Panel');
		
		return this;
	
	},
	
	createErrorPanel:function(){
	
		this.errorPanel = this.createElement('errorPanel',this,{
		
			cssClsElement : this.cssClsValidateElement,
			cssClsTitle:this.cssClsValidateTitle,
			cssClsBody : [this.cssClsValidateBody,this.cssClsValidateBodyErrorText].join(' '),
			titleText:this.errorTitle
		
		},'infestor.Panel');
		
		return this;
	
	},
	
	createStatusPanel:function(){
	
		this.statusPanel = this.createElement('statusPanel',this,{
		
			cssClsElement : this.cssClsValidateStatusPanel,
			cssClsHead:this.cssClsValidateStatusPanelHead,
			cssClsBody: this.cssClsValidateStatusPanelBody,
			head:true,
			text:this.statusTexts[this.status],
			layout:'horizon'
		
		},'infestor.Panel');
		
		return this;
	
	},
	
	setPrompt:function(text){
	
		this.promptText = text;
		
		!this.promptText && this.promptPanel && this.promptPanel.hide();
		this.promptText && this.promptPanel && this.promptPanel.setText(this.promptText).show();
		
		return this;
		
	},
	
	setError:function(text){
	
		this.errorText = text;
		!this.errorText && this.errorPanel && this.errorPanel.hide();
		this.errorText && this.errorPanel && this.errorPanel.setText(this.errorText).show();
		
		return this;
	
	},
	
	
	// @status (validating(0)|validatedPass(1)|validatedError(2))
	setStatus:function(status){
	
		if(!this.statusPanel || this.status === status) return this;
		
		switch(status){
		
			case infestor.form.ValidatePanel.VALIDATING:
				this.statusPanel.head.element.cssClear('background-position').addClass(this.cssClsValidateStatusValidating);
				this.statusPanel.setText(this.statusTexts[infestor.form.ValidatePanel.VALIDATING]);
				this.status = status;
				break;
			case infestor.form.ValidatePanel.VALIDATED_PASS:
				this.statusPanel.head.element.removeClass(this.cssClsValidateStatusValidating).removeClass(this.cssClsGlobalIconHover16).addClass(this.cssClsGlobalIconFocus16);
				this.statusPanel.head.setIcon('accept');
				this.statusPanel.setText(this.statusTexts[infestor.form.ValidatePanel.VALIDATED_PASS]);
				this.status = status;
				break;
			case infestor.form.ValidatePanel.VALIDATED_ERROR:
				this.statusPanel.head.element.removeClass(this.cssClsValidateStatusValidating).removeClass(this.cssClsGlobalIconFocus16).addClass(this.cssClsGlobalIconHover16);
				this.statusPanel.head.setIcon('warning');
				this.statusPanel.setText(this.statusTexts[infestor.form.ValidatePanel.VALIDATED_ERROR]);
				this.status = status;
				break;
			
			default: break;
		
		}

		return this;
	},
	
	clear:function(){
	
	
		return this.setPrompt().setError().setStatus(infestor.form.ValidatePanel.VALIDATING);
	
	},
	
	destroy:function(){
	
		this.statusPanel = this.statusPanel && this.statusPanel.destroy();
		this.promptPanel = this.promptPanel && this.promptPanel.destroy();
		this.errorPanel = this.errorPanel && this.errorPanel.destroy();
		
		this.callParent();
	
	}



});