
infestor.namespace('infestor.validator',{



	regExp:{
	
	
	
	},
	
	 /*
	 * from http://keenwon.com/857.html
	 * 
     * 原理主要利用二进制数，数字标记为1，大写字母标记为2，小写字母标记为4，特殊字符标记为8
     * 位运算OR计算密码的每一位，得到一个四位的二进制数，从而得出密码强度
     * 0-弱
     * 1-中
     * 2-强
     */
	pwdStrength:function(pwd){
	
		var pwd = String(pwd);
			i=0,
			len=pwd.length,
			modes=0,
			getModes = function(iN){
		
				if (iN >= 48 && iN <= 57) //数字（U+0030 - U+0039）
					return 1; //二进制是0001
				if (iN >= 65 && iN <= 90) //大写字母（U+0041 - U+005A）
					return 2; //二进制是0010
				if (iN >= 97 && iN <= 122) //小写字母（U+0061 - U+007A）
					return 4; //二进制是0100
					
				//其他算特殊字符
				return 8; //二进制是1000
			},
			getLevel=function(modes){
			
				var level = 0;
				for (i = 0; i < 4; i++) {
					if (modes & 1) //modes不是0的话
						level++; //复杂度+1
					modes >>>= 1; //modes右移1位
				}
				
				return level;
			};
			
		if(len<7)
			return 0;
		
		for(;i<len;i++)
			modes |= getModes(pwd.charCodeAt(i));
		
		return getLevel(modes);
	
	}


});