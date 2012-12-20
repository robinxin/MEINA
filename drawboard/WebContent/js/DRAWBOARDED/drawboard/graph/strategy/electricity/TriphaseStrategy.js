/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.electricity.TriphaseStrategy"]){dojo._hasResource["drawboard.graph.strategy.electricity.TriphaseStrategy"]=true;dojo.provide("drawboard.graph.strategy.electricity.TriphaseStrategy");dojo.require("drawboard.graph.strategy.SquareStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.electricity.TriphaseStrategy",drawboard.graph.strategy.SquareStrategy,{isIn:function(gp,_3,_4){var ps=gp.getGraphCoordinates(_4),w=gp.getWidth(_4),r=w>>2;if(_1.isPointInCircle(_3,{coordinate:ps[0],r:r})||_1.isPointInCircle(_3,{coordinate:ps[1],r:r})||_1.isPointInCircle(_3,{coordinate:ps[2],r:r})){return true;}return false;},draw:function(gp,gf,_5){var p=_2.Path,_6=gp.getGraphCoordinates(_5),_7=this.getStyle(gp,_5),w=gp.getWidth(_5),r=w>>2;gf.drawCircle(_6[0],r,_7);gf.drawCircle(_6[1],r,_7);gf.drawCircle(_6[2],r,_7);},getGraphCoordinates:function(gp,_8){var _9=gp.getCoordinate(_8),w=gp.getWidth(_8),h=gp.getHeight(_8),x=_9.x,y=_9.y,u=w/3;return [{x:x+u,y:y+u},{x:x+(u<<1),y:y+(h>>1)},{x:x+u,y:y+h-u}];}});})();}