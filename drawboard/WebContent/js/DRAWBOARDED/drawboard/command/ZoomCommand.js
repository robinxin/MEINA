/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.ZoomCommand"]){dojo._hasResource["drawboard.command.ZoomCommand"]=true;dojo.provide("drawboard.command.ZoomCommand");dojo.require("drawboard.command.Command");dojo.require("common.calc.Geometry");dojo.declare("drawboard.command.ZoomCommand",drawboard.command.Command,{getType:function(){return this.getConstant().ZOOMCOMMAND;},positive:function(){var _1=this.getExecutor(),_2=this.getMemo(),_3=this.getRuntime();_1.zoom(_2,_3);},negative:function(){var _4=this.getExecutor(),_5=this.getMemo(),_6=this.getRuntime();_4.zoom({x:-_5.x,y:-_5.y},_6);},_merge:function(_7){var _8=this.getMemo(),_9=_7.getMemo();this.setMemo(common.calc.Geometry.add2Points(_8,_9));return true;}});}