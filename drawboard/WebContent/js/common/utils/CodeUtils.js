dojo.provide("common.utils.CodeUtils");
common.utils.CodeUtils = {
	/*String*/toUnicode:function(/*String*/s){  
	    var res = [];  
	    var len = s.length - 1;  
	    while (len > -1) {  
	        var ch = s.charCodeAt(len--);  
	        if (!isNaN(ch)) {  
	            res.push(ch);  
	        }  
	    }  
	    res.push('');  
	    return res.reverse().join('&#');  
	},
	/*String*/toUnicode2:function(/*String*/s) {  
	    var res = [];  
	    var len = s.length - 1;  
	    while (len > -1) {  
	        var ch = s.charCodeAt(len--);  
	        if (!isNaN(ch)) {  
	            ch = ch.toString(16);  
	            switch (ch.length) {  
	                case 4 : {  
	                    chch = ch;  
	                }  
	                    break;  
	                case 3 : {  
	                    ch = '0' + ch;  
	                }  
	                    break;  
	                case 2 : {  
	                    ch = '00' + ch;  
	                }  
	                    break;  
	                case 1 : {  
	                    ch = '000' + ch;  
	                }  
	                    break;  
	                default :  
	                    ch = null;  
	            }  
	            if (ch != null) {  
	                res.push(ch);  
	            }  
	        }  
	    }  
	    res.push('');  
	    return res.reverse().join('\\u');  
	},
	/*String*/toGBK:function(/*String*/s) {  
	    var res = [''];  
	    if (s.indexOf('&#') === 0) {  
	        for (var i = 1, cs = s.split('&#'), len = cs.length; i < len; i++) {  
	            res.push(String.fromCharCode(cs[i]));  
	        }  
	        return res.join('');  
	    } else if (s.indexOf('\\u') === 0) {  
	        for (var i = 1, cs = s.split('\\u'), len = cs.length; i < len; i++) {  
	            res.push(String.fromCharCode(parseInt(cs[i], 16)));  
	        }  
	        return res.join('');  
	    }  
	    return '';  
	}
		
};