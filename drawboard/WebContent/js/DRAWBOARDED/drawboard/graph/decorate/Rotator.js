/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.decorate.Rotator"]){dojo._hasResource["drawboard.graph.decorate.Rotator"]=true;dojo.provide("drawboard.graph.decorate.Rotator");dojo.require("drawboard.Constant");dojo.require("drawboard.graph.decorate.Decorator");(function(){var _1=drawboard.Constant;dojo.declare("drawboard.graph.decorate.Rotator",drawboard.graph.decorate.Decorator,{_type:_1.Decorate.ROTATOR,pole:null,angle:null,draw:function(gf,_2,_3){var r=_3.getDistance(),p=_1.Path,_4=[],_5=this.getCoordinate();gf.drawCircle(_5[3],r,_2);gf.drawLine(_5[2],_5[1],_2);gf.drawCircle({x:_5[0].x,y:_5[0].y-r},r,_2);}});})();}