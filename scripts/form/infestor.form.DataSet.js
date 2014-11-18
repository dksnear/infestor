
infestor.define('infestor.form.DataSet',{

	extend : 'infestor.DataSet',
	
	submitParamName : '',
	
	setData : function (data) {

		if(this.data)
			this.addData(data);
			
		else this.data = data;
		
		return this.data;

	},
	
	hasData : function(name){
	
		if(!name)
			return !!this.data;
		
		return this.data && !!this.data[name];
	},
	
	addData :function(item){
	
		this.data && infestor.append(this.data,item);
		
		return item;
	
	},

	getData : function (name) {
	
		if(!name)
			return this.data;
		
		return this.data && this.data[name];
		
	},

	removeData:function(name){
	
	    return this.hasData(name) && delete this.data[name];
		
	},
	
	clearData : function () {

		return this.data = null;
		
	},

	setCurrent : function (current) {

		return false;

	},

	next : function () {

		return false;
	},

	previous : function () {

		return false;
	},
	
	getSubmitParams : function(){
	
		var params = {};
		
		if(!this.submitParamName)
			return this.getData() || {};
		
		params[this.submitParamName] = infestor.jsonEncode(this.getData());
	
		return params;
	
	}

});