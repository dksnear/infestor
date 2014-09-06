
infestor.namespace('infestor.form.validator',{

	$noteMap:{
		
		// regExp 
		integerOrDecimal:'只能输入整数或小数',
		number:'只能输入数字',
		pwd:'以字母开头，长度在6~18之间，只能包含字符、数字和下划线',
		email:'Email格式不正确',
		tel:'正确格式为："XXX-XXXXXXX"、"XXXX- XXXXXXXX"、"XXX-XXXXXXX"、"XXX-XXXXXXXX"、"XXXXXXX"和"XXXXXXXX"',
		mobile:'非法手机号',
		host:'非法主机名',
		url:'非法url',
		ipv4:'非法ipv4',
		ipv6:'非法ipv6',
		specChars:'含有特殊字符 ^%&\',;=?$"',
		chChars:'只能输入汉字',
		idCode:'身份证号码格式错误',
		repeat:'请不要输入重复字符',
		circle:'请不要循环输入',
		date:'非法日期',
		bool:'只能输入 true false 0 1'
	},

	$regExp:{
	
		integerOrDecimal:/^[0-9]+\.{0,1}[0-9]{0,2}$/,
		number:/^[0-9]*$/,
		pwd:/^[a-zA-Z]\w{5,17}$/,
		email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		tel:/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
		mobile:/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
		//host://,
		url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
		ipv4:/^((25[0-5]|2[0-4]\d|[0-1]?\d{1,2})\.){3}(25[0-5]|2[0-4]\d|[0-1]?\d{1,2})$/,
		ipv6:/^\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3})))(%.+)?\s*$/,
		specChars:/[^%&',;=?$\x22]+/,
		chChars:/^[\u4e00-\u9fa5] {0,}$/,
		idCode:/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/,
		repeat:/([.]{2,1000})($1)(2,1000)/,
		circle:/([.])($1){3,1000}/,
		date:/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/,
		bool:/^(true|false|0|1)$/i
		
	},
	
	$func:{
	
		/**********************

			判定密码强度

			from: http://keenwon.com/857.html

			原理主要利用二进制数，数字标记为1，大写字母标记为2，小写字母标记为4，特殊字符标记为8
			位运算OR计算密码的每一位，得到一个四位的二进制数，从而得出密码强度
			0-弱
			1-中
			2-强
		
		************************/
		
		pwdStrength:function(pwd){
		
			var pwd = String(pwd);
				i=0,
				len=pwd.length,
				modes=0,
				promptMap={
				
					0:'密码强度:低',
					1:'密码强度:中',
					2:'密码强度:高'
					
				},
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
			
			return {
			
				promptMsg:promptMap[getLevel(modes)],
				passed:true
			}
		
		},
		
		/**********************
		
			身份证号码严格验证
			
			from: http://www.cnblogs.com/lzrabbit/archive/2011/10/23/2221643.html
			
			身份证号合法性验证 
			支持15位和18位身份证号
			支持地址编码、出生日期、校验位验证
		
		************************/
		
		idCodeStrict:function(code){
		
			var city = {11:'北京',12:'天津',13:'河北',14:'山西',15:'内蒙古',21:'辽宁',22:'吉林',23:'黑龙江 ',31:'上海',32:'江苏',33:'浙江',34:'安徽',35:'福建',36:'江西',37:'山东',41:'河南',42:'湖北 ',43:'湖南',44:'广东',45:'广西',46:'海南',50:'重庆',51:'四川',52:'贵州',53:'云南',54:'西藏 ',61:'陕西',62:'甘肃',63:'青海',64:'宁夏',65:'新疆',71:'台湾',81:'香港',82:'澳门',91:'国外 '},
				msg,passed = true,factor,parity,sum,ai,wi,last,i;
            
            if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code))
				return {
					
					errorMsg:'身份证号格式错误',
					pass:false
				};
			
			if(!city[code.substr(0,2)])
				return {
					
					errorMsg:'地址编码错误',
					pass:false
				};

			//18位身份证需要验证最后一位校验位
			if(code.length == 18){
			
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
				//校验位
				parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
				sum = 0;
				ai = 0;
				wi = 0;
				for (i = 0; i < 17; i++)
				{
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				};
				
				last = parity[sum % 11];
				
				if(parity[sum % 11] != code[17]){
				
					msg = '校验位错误';
					passed = false;
				}
                
            };
			
			return {
			
				errorMsg:msg,
				passed:passed
			
			};
			
		
		}
	
	}
	
	


});

// 装配正则验证器

infestor.each(infestor.form.validator.$regExp,function(name,regExp){

	infestor.form.validator[name] = {
	
		errorMsg:infestor.form.validator.$noteMap[name] || '',
		handle:regExp
	};

});


// 装配方法验证器

infestor.each(infestor.form.validator.$func,function(name,func){

	infestor.form.validator[name] = {
	
		errorMsg:infestor.form.validator.$noteMap[name] || '',
		handle:func
	};

});
