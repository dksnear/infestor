
(function(assert){

	var Indicator = function(assert){

		this.init(assert);

	};
	
	Indicator.prototype = {

		constructor:Indicator,
		
		assert:null,
		
		interval:100,
		
		stopNodes:[70,100,150,250,350,450,550,650,750,850,950,999],
		
		stopNeedle:0,
		
		init:function(assert){
		
			this.assert = assert;
			this.regist();
			
		},
		
		regist:function(){
		
			(function(fn,scope){
			
				window.attachEvent
					? window.attachEvent('onload',function(){ fn.call(scope); })
					: window.addEventListener('load',function(){ fn.call(scope); });
					
			})(function(){
					
				this.startTask();
			
			},this);
		
		},
		
		startTask:function(){
		
			this.createIndicator();
		
			this.startPos = this.random(0, 10)/10;
			this.stopPos = this.random(40, this.stopNodes[this.stopNeedle])/10;
			
		
			this.taskId = (function(fn,interval,scope){ 
			
				return setInterval(function(){
			
					fn.call(scope);
			
				},interval)
				
			})(function(){
			
				if(this.stopPos * 10 >= this.stopNodes[this.stopNeedle] && this.stopNeedle < this.stopNodes.length-1)
					this.stopNeedle++;
				
				this.stopPos = this.random(this.stopPos*10,this.stopNodes[this.stopNeedle])/10;
				this.startPos =	this.random(this.startPos*10, this.stopPos*10)/10;
				this.change(this.startPos);
				if(this.assert()){
						
					clearInterval(this.taskId);
					this.change(100);
					
					(function(fn,interval,scope){
					
						setTimeout(function(){
						
							fn.call(scope);
						
						},interval);
					
					})(function(){
					
						this.destroy();
					
					},1000,this);
					
				}
				
			
			},this.interval,this);
		
		},
		
		createMask:function(){
		
			this.mask = this.mask || document.createElement('div');
			
			this.cover(this.mask.style, {
			
				position:'fixed',
				height:'100%',
				width:'100%',
				top:'0px',
				left:'0px',
				zIndex:1000,
				backgroundColor:'#FFFFFF'
			
			});
			
			document.body.appendChild(this.mask);
			
		
		},
		
		createIndicator:function(){
		
			
			!this.mask && this.createMask();
			
			this.indicator = this.indicator || document.createElement('div');
			
			this.cover(this.indicator.style,{
			
				position:'relative',
				height:'5px',
				width:'400px',
				margin:'100px auto 0'
			
			});
			
			this.mask.appendChild(this.indicator);
			
			this.indicatorSlider = this.indicatorSlider || document.createElement('div');
			
			this.cover(this.indicatorSlider.style,{
			
				backgroundColor:'orange',
				width:'0%',
				height:'100%'
			
			});
			
			this.indicator.appendChild(this.indicatorSlider);
			
			this.indicatorText = this.indicatorText || document.createElement('div');
			
			this.cover(this.indicatorText.style,{
			
				position:'absolute',
				color:'red',
				top:'-50px',
				left:0,
				height:'24px',
				lineHeight:'24px'		
			
			});
			
			this.indicator.appendChild(this.indicatorText);
		
		},


		change:function(pos){
		
			this.indicatorSlider.style.width = pos+'%';
			
			this.changeText(this.indicatorText,'...加载中 '+pos+'%');
		
		},
		
		
		cover:function(target,source){

			for(var name in target){
			
				target[name] = source[name] || target[name];
			
			};
		
			return target;
		
		},
		
		random : function (lower, upper) {

			return Math.floor(Math.random() * (upper - lower + 1) + lower);

		},
		
		changeText:function(element,text){

			element.$textNode && element.removeChild(element.$textNode);
			
			element.$textNode = document.createTextNode(text);
			
			element.appendChild(element.$textNode);
			
			return this;
			
		},

		destroy:function(){
		
			//this.mask && document.body.removeChild(this.mask);
			//Indicator = null;
		
		}
		
	};
	
	 new Indicator(assert);

})(function(){

	window.elapsed = window.elapsed || 1000;
	window.count = window.count && ++window.count || 1;
	return --window.elapsed == 0;

});


