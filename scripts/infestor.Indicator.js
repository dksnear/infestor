
// 加载指示器

infestor.define('infestor.Indicator',{


	extend:'infestor.Task',
	
	uses:['infestor.cross','infestor.Dom'],
	
	interval:100,
	
	// 显示遮罩 (bool)
	mask:true,
	
	stopNodes:[70,100,150,250,350,450,550,650,750,850,950,999],
		
	stopNeedle:0,
	
	init:function(){
			
		this.on('start',function(){
					
			this.mask && this.showMask();
				
			this.startPos = infestor.random(0, 10)/10;
			this.stopPos = infestor.random(40, this.stopNodes[this.stopNeedle])/10;
			
			this.showIndicator();
			this.changeIndicator(this.startPos);
			
		
		},this);
		
		
		this.on('tick',function(){
		
			if (!this.indicator)
				return;
			
			if(this.stopPos * 10 >= this.stopNodes[this.stopNeedle] && this.stopNeedle < this.stopNodes.length-1)
				this.stopNeedle++;

			this.stopPos = infestor.random(this.stopPos*10,this.stopNodes[this.stopNeedle])/10;
			this.startPos =	infestor.random(this.startPos*10, this.stopPos*10)/10;
			
			this.changeIndicator(this.startPos);
		
		},this);
		
		this.on('stop',function(){
	
			this.changeIndicator(100);
			
			infestor.delay(function () {

				this.hideIndicator();			
				this.changeIndicator(0);

			}, 200,this);
			
			this.mask && this.hideMask();
		
		},this);
			
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