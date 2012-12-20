/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.context.ExecuteContext"]){dojo._hasResource["drawboard.context.ExecuteContext"]=true;dojo.provide("drawboard.context.ExecuteContext");dojo.require("common.calc.Geometry");dojo.require("common.exception.Exception");dojo.require("dijit._Widget");(function(){var _1=common.calc.Geometry;dojo.declare("drawboard.context.ExecuteContext",dijit._Widget,{zoom:{x:100,y:100},paramsCtrl:null,styleCtrl:null,commandCtrl:null,drawProcessor:null,getZoom:function(){return _1.dividePoint(this.zoom,{x:100,y:100})[0];},setZoom:function(_2){var _3=_1.add2Points(this.zoom,_2);if(_3.x<0||_3.y<0||_3.x>200||_3.y>200){return false;}this.zoom=_3;return true;},getParamsCtrl:function(){if(!this.paramsCtrl){new common.exception.Exception({msg:"the parameters controller in context doesnt' exist!"});}return this.paramsCtrl;},setParamsCtrl:function(_4){this.paramsCtrl=_4;},getCommandCtrl:function(){if(!this.commandCtrl){new common.exception.Exception({msg:"the command controller in context doesnt' exist!"});}return this.commandCtrl;},setCommandCtrl:function(_5){this.commandCtrl=_5;},setStyleCtrl:function(_6){if(!this.styleCtrl){new common.exception.Exception({msg:"the style controller in context doesnt' exist!"});}this.styleCtrl=_6;},getStyleCtrl:function(){return this.styleCtrl;},getDrawProcessor:function(){if(!this.drawProcessor){new common.exception.Exception({msg:"the draw processor in context doesnt' exist!"});}return this.drawProcessor;},setDrawProcessor:function(_7){this.drawProcessor=_7;}});})();}