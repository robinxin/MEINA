/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.OvalStrategy"]){dojo._hasResource["drawboard.graph.strategy.OvalStrategy"]=true;dojo.provide("drawboard.graph.strategy.OvalStrategy");dojo.require("drawboard.graph.strategy.RectangleStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.OvalStrategy",drawboard.graph.strategy.RectangleStrategy,{isIn:function(gp,_3,_4){return _1.isPointInPolyn(gp.getOutletCoordinates(_4),_3);},draw:function(gp,gf,_5){var _6=gp.getGraphCoordinates(_5),w=gp.getWidth(_5),h=gp.getHeight(_5),p=_2.Path,_7=[],_8=gp.getGraphRotator(_5),a=_8.angle,_9=_8.coordinate,_a=["translate("+_9.x+","+_9.y+")","rotate("+a+")","translate("+-_9.x+","+-_9.y+")"];gf.drawEllipse(gp.getCoordinate(_5),w,h,(a!=0)&&{transform:_a},this.getStyle(gp,_5));},getGraphCoordinates:function(gp,_b){var p=gp.getCoordinate(_b),w=gp.getWidth(_b),h=gp.getHeight(_b),_c=[{x:p.x+w,y:p.y+h}];return _c;}});})();}