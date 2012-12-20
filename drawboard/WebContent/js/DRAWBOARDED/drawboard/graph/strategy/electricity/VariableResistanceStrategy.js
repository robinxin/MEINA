/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.electricity.VariableResistanceStrategy"]){dojo._hasResource["drawboard.graph.strategy.electricity.VariableResistanceStrategy"]=true;dojo.provide("drawboard.graph.strategy.electricity.VariableResistanceStrategy");dojo.require("drawboard.graph.strategy.GraphStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.electricity.VariableResistanceStrategy",drawboard.graph.strategy.GraphStrategy,{isIn:function(gp,_3,_4){var ps=gp.getGraphCoordinates(_4);if(_1.isPointInSegment(ps[0],ps[1],_3)||_1.isPointInPolyn([ps[2],ps[3],ps[4],ps[5]],_3)||_1.isPointInSegment(ps[6],ps[7],_3)||_1.isPointInSegment(ps[8],ps[9],_3)||_1.isPointInSegment(ps[10],ps[11],_3)){return true;}return false;},draw:function(gp,gf,_5){var p=_2.Path,_6=gp.getGraphCoordinates(_5);gf.drawPath([{command:p.MOVE,points:_6[0]},{command:p.LINE,points:_6[1]},{command:p.MOVE,points:_6[2]},{command:p.LINE,points:_6[3]},{command:p.LINE,points:_6[4]},{command:p.LINE,points:_6[5]},{command:p.LINE,points:_6[2]},{command:p.MOVE,points:_6[6]},{command:p.LINE,points:_6[7]},{command:p.MOVE,points:_6[8]},{command:p.LINE,points:_6[9]},{command:p.MOVE,points:_6[10]},{command:p.LINE,points:_6[11]}],this.getStyle(gp,_5));},getGraphCoordinates:function(gp,_7){var _8=gp.getCoordinate(_7),w=gp.getWidth(_7),h=gp.getHeight(_7),x=_8.x,y=_8.y,uw=w>>3,uh=h>>3;return [{x:x,y:y+(h>>1)},{x:x+uw,y:y+(h>>1)},{x:x+uw,y:y+uh},{x:x+uw,y:y+h-uh},{x:x+w-uw,y:y+h-uh},{x:x+w-uw,y:y+uh},{x:x+w-uw,y:y+(h>>1)},{x:x+w,y:y+(h>>1)},{x:x+(w>>1),y:y},{x:x+(w>>1),y:y+(uh>>1)},{x:x+(w>>1)-(uw>>1),y:y+(uh>>1)},{x:x+(w>>1)+(uw>>1),y:y+(uh>>1)}];}});})();}