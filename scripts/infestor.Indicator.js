
// 加载指示器

infestor.define('infestor.Indicator',{


	extend:'infestor.Task',
	
	uses:'infestor.Dom',
	
	cssUses:'infestor.Element',
	
	interval:100,
	
	// 步长
	step:0,
	
	stopNodes:[70,100,150,250,350,450,550,650,750,850,950],
	
	// 显示遮罩 (bool)
	mask:true,
			
	stopNeedle:0,
	
	init:function(){
		
		this.initStep();
		
		this.on('start',function(){
					
			this.mask && this.showMask();
				
			this.startPos = infestor.random(0, 10)/10;
			this.stopPos = infestor.random(40, this.stopNodes[this.stopNeedle])/10;
			
			this.showIndicator();
			this.changeIndicator(this.startPos);
			
		
		},this);
				
		this.on('tick',function(){
		
			if(this.stopPos * 10 >= this.stopNodes[this.stopNeedle] && this.stopNeedle < this.stopNodes.length-1)
				this.stopNeedle++;

			this.stopPos = infestor.random(this.stopPos*10,this.stopNodes[this.stopNeedle])/10;
			this.startPos =	infestor.random(this.startPos*10, this.stopPos*10)/10;
			
			this.changeIndicator(this.startPos);
		
		},this);
		
		this.on('stop',function(){

			this.startPos = 100;	
			this.changeIndicator(this.startPos);
				
			infestor.delay(function () {

				this.hideIndicator();			
				this.changeIndicator(0);

			}, 200,this);
			
			this.mask && this.hideMask();
		
		},this);
			
	},
	
	initStep:function(){
	
		var start = 50;
		
		if(!this.step)
			return;
		
		this.stopNodes = [];
		
		this.step = this.step < 30 ? 30 : this.step;
		this.step = this.step > 100 ? 100 : this.step;
		
		while(start<900){
		
			start += this.step;
			this.stopNodes.push(start);
		
		}
		
	
	},
	
	createIndicator:function(opts){
		
		var indicator = infestor.Dom.div(); 
	
		
		if(infestor.isRawObject(opts)) {
			
			return indicator.css(infestor.append({

				position : 'fixed',
				width : '0%',
				height : '5px',
				top : 0,
				left : 0,
				'background-color' : 'orange'

			},opts));
		}
		
		return indicator.addClass(opts || 'infestor-element-global-indicator');
	
	},
	
	showIndicator:function(){
		
		infestor.Indicator.elementIndicator = infestor.Indicator.elementIndicator || this.createIndicator().appendTo(infestor.Dom.getBody());
		infestor.Indicator.elementIndicator.zIndex().show();
	
	},
	
	changeIndicator:function(value){
	
		infestor.isRawObject(value) ? infestor.Indicator.elementIndicator.css(value) : infestor.Indicator.elementIndicator.css('width', value + '%');
	
	},
	
	hideIndicator:function(){
		
		infestor.Indicator.elementIndicator && infestor.Indicator.elementIndicator.hide();

	},
	
	showMask:function(){
	
		infestor.Indicator.elementMask =  infestor.Indicator.elementMask || infestor.Dom.div().addClass(infestor.bRouter({ 
		
			 ie7minus : 'infestor-element-global-mask-ie7minus',
			 otherwise : 'infestor-element-global-mask'
			 
		})).appendTo(infestor.Dom.getBody());
		
		infestor.Indicator.elementMask.zIndex().show();

	},
	
	hideMask:function(){
		
		infestor.Indicator.elementMask && infestor.Indicator.elementMask.hide();
	
	},
	
	getCurrentProgress:function(){
	
		return this.startPos || 0;
	}
	
});