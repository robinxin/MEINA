/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.TriangleStrategy"]){dojo._hasResource["drawboard.graph.strategy.TriangleStrategy"]=true;dojo.provide("drawboard.graph.strategy.TriangleStrategy");dojo.require("drawboard.graph.strategy.GraphStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.TriangleStrategy",drawboard.graph.strategy.GraphStrategy,{isIn:function(gp,_3,_4){return _1.isPointInPolyn(gp.getGraphCoordinates(_4),_3);},draw:function(gp,gf,_5){var p=_2.Path,_6=gp.getGraphCoordinates(_5);return gf.drawPath([{command:p.MOVE,points:_6[0]},{command:p.LINE,points:_6[1]},{command:p.LINE,points:_6[2]}],this.getStyle(gp,_5));},getGraphCoordinates:function(gp,_7){var _8=gp.getCoordinate(_7),w=gp.getWidth(_7),h=gp.getHeight(_7),x=_8.x,y=_8.y;return [{x:x+(w>>1),y:y},{x:x,y:y+h},{x:x+w,y:y+h}];},getMarkCoordinates:function(gp,_9){var _a=gp.getCoordinate(_9),w=gp.getWidth(_9),h=gp.getHeight(_9),_b=gp.getRealMarks(_9),x=_a.x,y=_a.y;if(!_b){return [{x:x+(w>>1),y:y},{x:x,y:y+h},{x:x+w,y:y+h},{x:x+(w>>1),y:y+(h>>1)}];}var _c=[_b[0]||{x:x+(w>>1),y:y},_b[1]||{x:x,y:y+h},_b[2]||{x:x+w,y:y},_b[3]||{x:x+(w>>1),y:y+(h>>1)}];for(var i=4;i<_b.length;i++){_c.push(_b[i]);}return _c;}});})();}