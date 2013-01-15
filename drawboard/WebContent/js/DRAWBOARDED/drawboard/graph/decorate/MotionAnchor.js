/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.decorate.MotionAnchor"]){dojo._hasResource["drawboard.graph.decorate.MotionAnchor"]=true;dojo.provide("drawboard.graph.decorate.MotionAnchor");dojo.require("drawboard.graph.decorate.Decorator");dojo.require("drawboard.Constant");(function(){var _1=drawboard.Constant;dojo.declare("drawboard.graph.decorate.MotionAnchor",drawboard.graph.decorate.Decorator,{_type:_1.Decorate.MOTIONANCHOR,draw:function(gp,_2,_3){var p=this.getCoordinate(),_4=_1.Path,_5=[{command:_4.MOVE,points:p[0]},{command:_4.LINE,points:p[1]},{command:_4.LINE,points:p[2]},{command:_4.LINE,points:p[3]},{command:_4.LINE,points:p[0]}];gp.drawPath(_5,_2);}});})();}