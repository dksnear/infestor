
// 用于处理表单验证

infestor.define('infestor.ValidatePanel',{


	alias : 'vpanel',
	extend : 'infestor.Panel',
	cssUses : 'infestor.Panel',
	
	statics:{
	
		// 状态码
		validating:1,
		validated:2,
		error:3
	
	},

	cssClsValidateElement : 'infestor-validate-panel',
	cssClsValidateTitle:'infestor-validate-panel-title',
	cssClsValidateBody : 'infestor-validate-panel-body',
	cssClsValidateBodyErrorText:'infestor-validate-panel-error-text',
	cssClsValidateBodyPromptText:'infestor-validate-panel-prompt-text',
	
	// 用于显示提示
	promptPanel:true,
	// 用于显示错误
	errorPanel:true,
	// 用于显示验证状态
	statusPanel:true,
	
	promptText:'',
	errorText:'',
	status:1,
	
	
	initElement:function(){
	
		this.callParent();		
		
		this.createStatusPanel();
		this.createErrorPanel();
		this.createPromptPanel();
			
		this.setPrompt(this.promptText);
		this.setError(this.errorText);
	
	},
	
	createPromptPanel:function(){
	
		this.promptPanel = this.createElement('promptPanel',this,{
		
			cssClsElement :this.cssClsValidateElement,
			cssClsTitle:this.cssClsValidateTitle,
			cssClsBody : [this.cssClsValidateBody,this.cssClsValidateBodyPromptText].join(' '),
			//titleText:'PROMPT',
			titleText:'提示'
			
		
		},'infestor.Panel');
		
		return this;
	
	},
	
	createErrorPanel:function(){
	
		this.errorPanel = this.createElement('errorPanel',this,{
		
			cssClsElement : this.cssClsValidateElement,
			cssClsTitle:this.cssClsValidateTitle,
			cssClsBody : [this.cssClsValidateBody,this.cssClsValidateBodyErrorText].join(' '),
			//titleText:'ERROR',
			titleText:'错误'
		
		},'infestor.Panel');
		
		return this;
	
	},
	
	createStatusPanel:function(){
	
		this.statusPanel = this.createElement('statusPanel',this,{
		
			cssClsElement : 'infestor-validate-panel',
			cssClsTitle:this.cssClsValidateTitle,
			cssClsBody : 'infestor-validate-body',
			//titleText:'STATUS',
			titleText:'状态'
		
		},'infestor.Panel');
		
		return this;
	
	},
	
	setPrompt:function(text){
	
		this.promptText = text;
		
		!this.promptText && this.promptPanel && this.promptPanel.hide();
		this.promptPanel && this.promptPanel.setText(this.promptText);
		
	},
	
	setError:function(text){
	
		this.errorText = text;
		!this.errorText && this.errorPanel && this.errorPanel.hide();
		this.errorPanel && this.errorPanel.setText(this.errorText);
	
	},
	
	
	// @status (validating(1)|validated(2)|error(3))
	setStatus:function(status){
	
	
	}



});