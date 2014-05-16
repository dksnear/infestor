
// 加载指示器

infestor.define('infestor.Indicator',{


	extend:'infestor.Task',
	
	uses:['infestor.cross','infestor.Dom'],
	
	interval:100,
	
	// 显示加载进度 (bool|options:{ show:fn ,change:fn(value) ,hide:fn ,scope:obj})
	indicator:null,
	
	// 显示遮罩 (bool|options:{ show:fn , hide:fn ,scope:obj })
	mask:null,
	
	// 引用对象
	parent:null,
	
	stopNodes:[70,100,150,250,350,450,550,650,750,850,950,999],
		
	stopNeedle:0,
	
	init:function(){
			
		this.on('start',function(){
				
			this.mask && this.showMask.call(this.mask.scope);
						
			this.startPos = infestor.random(0, 10)/10;
			this.stopPos = infestor.random(40, this.stopNodes[this.stopNeedle])/10;

			this.indicator && this.showIndicator.call(this.indicator.scope);		
			this.indicator && this.changeIndicator.call(this.indicator.scope,this.startPos);
			
		
		},this);
		
		
		this.on('tick',function(){
		
			if (!this.indicator)
				return;
			
			if(this.stopPos * 10 >= this.stopNodes[this.stopNeedle] && this.stopNeedle < this.stopNodes.length-1)
				this.stopNeedle++;

			this.stopPos = infestor.random(this.stopPos*10,this.stopNodes[this.stopNeedle])/10;
			this.startPos =	infestor.random(this.startPos*10, this.stopPos*10)/10;
			this.changeIndicator.call(this.indicator.scope,this.startPos);
		
		},this);
		
		this.on('stop',function(){
	
		
			this.indicator && this.changeIndicator.call(this.indicator.scope,100);

			this.indicator && infestor.delay(function () {

				this.hideIndicator.call(this.indicator.scope);			
				this.changeIndicator.call(this.indicator.scope,0);

			}, 200,this);
			
			this.mask && this.hideMask.call(this.mask.scope);
		
		},this);
		
		this.initIndicator();
		this.initMask();
	
	},
	
	initIndicator:function(){
	
		if(!this.indicator) return this;
		
		if(infestor.isBoolean(this.indicator) && this.indicator)
			this.indicator = {};
		
		this.showIndicator = this.indicator.show || this.showIndicator;
		this.hideIndicator = this.indicator.hide || this.hideIndicator;
		this.changeIndicator = this.indicator.change || this.changeIndicator;
		
		this.indicator.scope = this.indicator.scope || this;
		
		return this;

	},
	
	initMask:function(){
	
		if(!this.mask ||(infestor.isBoolean(this.mask) && this.mask)) return this;
		
		this.showMask = this.mask.show;
		this.hideMask = this.mask.hide;
		
		this.mask.scope = this.mask.scope || this;
		
		return this;
	
	},
	
	createIndicator:function(opts){
	
		return infestor.Dom.div().css(infestor.append({

			position : 'fixed',
			width : '0%',
			height : '5px',
			top : 0,
			left : 0,
			'background-color' : 'orange'

		},opts));
	
	},
	
	showIndicator:function(){
		
		infestor.Indicator.elementIndicator = infestor.Indicator.elementIndicator || this.createIndicator().appendTo(infestor.Dom.getBody());

		infestor.Indicator.elementIndicator.zIndex().show();
	
	},
	
	changeIndicator:function(value){
	
		if (!infestor.Indicator.elementIndicator)
			return;

		infestor.isRawObject(value) ? infestor.Indicator.elementIndicator.css(value) : infestor.Indicator.elementIndicator.css('width', value + '%');
	
	},
	
	hideIndicator:function(){
		
		infestor.Indicator.elementIndicator && infestor.Indicator.elementIndicator.hide();

	},
	
	showMask:function(){
	
		infestor.cross.showMask();
	
	},
	
	hideMask:function(){
		
		infestor.cross.hideMask();
	
	}
	
});