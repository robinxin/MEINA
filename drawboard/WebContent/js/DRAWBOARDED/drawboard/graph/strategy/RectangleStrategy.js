/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.RectangleStrategy"]){dojo._hasResource["drawboard.graph.strategy.RectangleStrategy"]=true;dojo.provide("drawboard.graph.strategy.RectangleStrategy");dojo.require("drawboard.graph.strategy.GraphStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.RectangleStrategy",drawboard.graph.strategy.GraphStrategy,{isIn:function(gp,_3,_4){return _1.isPointInPolyn(gp.getGraphCoordinates(_4),_3);},draw:function(gp,gf,_5){var p=_2.Path,_6=gp.getGraphCoordinates(_5);gf.drawPath([{command:p.MOVE,points:_6[0]},{command:p.LINE,points:_6[1]},{command:p.LINE,points:_6[2]},{command:p.LINE,points:_6[3]}],this.getStyle(gp,_5));},getGraphCoordinates:function(gp,_7){var _8=gp.getCoordinate(_7),w=gp.getWidth(_7),h=gp.getHeight(_7),x=_8.x,y=_8.y;return [{x:x,y:y},{x:x+w,y:y},{x:x+w,y:y+h},{x:x,y:y+h}];}});})();}