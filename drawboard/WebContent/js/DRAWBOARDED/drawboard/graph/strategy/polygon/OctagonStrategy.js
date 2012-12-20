/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.polygon.OctagonStrategy"]){dojo._hasResource["drawboard.graph.strategy.polygon.OctagonStrategy"]=true;dojo.provide("drawboard.graph.strategy.polygon.OctagonStrategy");dojo.require("drawboard.graph.strategy.GraphStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.polygon.OctagonStrategy",drawboard.graph.strategy.GraphStrategy,{getGraphCoordinates:function(gp,_3){var _4=gp.getCoordinate(_3),h=gp.getHeight(_3),w=gp.getWidth(_3),x=_4.x,y=_4.y,h3=h/3,w3=w/3;return [{x:x+w3,y:y},{x:x+(w3<<1),y:y},{x:x+w,y:y+h3},{x:x+w,y:y+(h3<<1)},{x:x+(w3<<1),y:y+h},{x:x+w3,y:y+h},{x:x,y:y+(h3<<1)},{x:x,y:y+h3}];},isIn:function(gp,_5,_6){return _1.isPointInPolyn(gp.getGraphCoordinates(_6),_5);},draw:function(gp,gf,_7){var p=_2.Path,_8=gp.getGraphCoordinates(_7);gf.drawPath([{command:p.MOVE,points:_8[0]},{command:p.LINE,points:_8[1]},{command:p.LINE,points:_8[2]},{command:p.LINE,points:_8[3]},{command:p.LINE,points:_8[4]},{command:p.LINE,points:_8[5]},{command:p.LINE,points:_8[6]},{command:p.LINE,points:_8[7]}],this.getStyle(gp,_7));}});})();}