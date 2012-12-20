dojo.provide("common.utils.BrowerUtils");
(function(){
var fontNode = null;
common.utils.BrowerUtils = {
	browerType:null,
	/*void*/copyClipboard:function(/*String*/txt){  
	    if(window.clipboardData){  
	        window.clipboardData.clearData();  
	        window.clipboardData.setData("Text",txt);  
	    }else if(navigator.userAgent.indexOf("Opera")!=-1){  
	        window.location=txt;  
	    }else if(window.netscape){  
	        try{  
	            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
	        }catch(e){  
	            alert("您的firefox安全限制限制您进行剪贴板操作，请打开’about:config’将  signed.applets.codebase_principal_support’设置为true’之后重试，相对路径为firefox根目录 /greprefs/all.js");  
	            return false;  
	        }  
	        var clip=Components.classes['@mozilla.org/widget/clipboard;1'].createInstance (Components.interfaces.nsIClipboard);  
	        if(!clip)return;  
	        var trans=Components.classes['@mozilla.org/widget/transferable;1'].createInstance (Components.interfaces.nsITransferable);  
	        if(!trans)return;  
	        trans.addDataFlavor('text/unicode');  
	        var str=new Object();  
	        var len=new Object();  
	        var str=Components.classes["@mozilla.org/supports-string;1"].createInstance (Components.interfaces.nsISupportsString);  
	        var copytext=txt;  
	        str.data=copytext;  
	        trans.setTransferData("text/unicode",str,copytext.length*2);  
	        var clipid=Components.interfaces.nsIClipboard;  
	        if(!clip)return false;  
	        clip.setData(trans,null,clipid.kGlobalClipboard);  
	    }  
	},
	getWindowBox:function(){
		return viewport = dojo.window.getBox();
	},
	getFontNode:function(){
		if(!fontNode){
			fontNode = document.createElement("div");
			document.body.appendChild(fontNode);
		}
		return fontNode;
	},
	/*Double*/getFontHeight:function(/*String*/text,/*String*/style){
		var s = "padding:0;visibility:hidden;position:absolute;top:10000000px;",h;
		s += style;
		dojo.attr(this.getFontNode(),"style",s);
		fontNode.innerHTML=text;
		h = fontNode.offsetHeight;
		fontNode.innerHTML = "";
		return h;
	},
	getBrowerType:function(){
		if(!this.browerType){
			var Sys = {},   
				ua = navigator.userAgent.toLowerCase(),
				s;   
			(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]
			: (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1]    
			: (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1]    
			: (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1]    
			: (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
			this.browerType = Sys;
		}
		return this.browerType;
	}
};
})();