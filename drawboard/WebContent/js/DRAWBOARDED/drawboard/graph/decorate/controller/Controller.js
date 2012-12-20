/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.decorate.controller.Controller"]){dojo._hasResource["drawboard.graph.decorate.controller.Controller"]=true;dojo.provide("drawboard.graph.decorate.controller.Controller");dojo.require("drawboard.controller.StyleController");dojo.declare("drawboard.graph.decorate.controller.Controller",null,{draw:function(gp,_1){},active:function(gp,_2,_3){},create:function(ps){return null;},getStyle:function(gp,_4,_5){return _5.getContext().getStyleCtrl().getStyle(this.type,gp,_4);}});}