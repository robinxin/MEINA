/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["common.exception.Exception"]){dojo._hasResource["common.exception.Exception"]=true;dojo.provide("common.exception.Exception");dojo.require("dijit._Widget");dojo.require("common.Constant");dojo.declare("common.exception.Exception",dijit._Widget,{msg:"",type:common.Constant.Exception.WARNNING,postCreate:function(){var _1=common.Constant.Exception,_2=this.msg;switch(this.type){case _1.WARNNING:this.printMessage();break;case _1.ERROR:this.throwMessage();break;}},throwMessage:function(_3){throw _3;},printMessage:function(_4){}});}