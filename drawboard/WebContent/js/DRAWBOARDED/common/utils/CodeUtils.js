/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["common.utils.CodeUtils"]){dojo._hasResource["common.utils.CodeUtils"]=true;dojo.provide("common.utils.CodeUtils");common.utils.CodeUtils={toUnicode:function(s){var _1=[];var _2=s.length-1;while(_2>-1){var ch=s.charCodeAt(_2--);if(!isNaN(ch)){_1.push(ch);}}_1.push("");return _1.reverse().join("&#");},toUnicode2:function(s){var _3=[];var _4=s.length-1;while(_4>-1){var ch=s.charCodeAt(_4--);if(!isNaN(ch)){ch=ch.toString(16);switch(ch.length){case 4:chch=ch;break;case 3:ch="0"+ch;break;case 2:ch="00"+ch;break;case 1:ch="000"+ch;break;default:ch=null;}if(ch!=null){_3.push(ch);}}}_3.push("");return _3.reverse().join("\\u");},toGBK:function(s){var _5=[""];if(s.indexOf("&#")===0){for(var i=1,cs=s.split("&#"),_6=cs.length;i<_6;i++){_5.push(String.fromCharCode(cs[i]));}return _5.join("");}else{if(s.indexOf("\\u")===0){for(var i=1,cs=s.split("\\u"),_6=cs.length;i<_6;i++){_5.push(String.fromCharCode(parseInt(cs[i],16)));}return _5.join("");}}return "";}};}