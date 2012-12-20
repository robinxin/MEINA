/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.CircleStrategy"]){dojo._hasResource["drawboard.graph.strategy.CircleStrategy"]=true;dojo.provide("drawboard.graph.strategy.CircleStrategy");dojo.require("drawboard.controller.StyleController");dojo.require("drawboard.graph.strategy.SquareStrategy");(function(){var _1=common.calc.Geometry;dojo.declare("drawboard.graph.strategy.CircleStrategy",drawboard.graph.strategy.SquareStrategy,{isIn:function(gp,_2,_3){var w=gp.getWidth(_3),h=gp.getHeight(_3),r=w>h?h>>1:w>>1;return _1.isPointInCircle(_2,{coordinate:gp.getGraphCoordinates(_3)[0],r:r});},draw:function(gp,gf,_4){var _5=gp.getGraphCoordinates(_4),w=gp.getWidth(_4),h=gp.getHeight(_4),r=w>h?h>>1:w>>1;gf.drawCircle(_5[0],r,this.getStyle(gp,_4));},getGraphCoordinates:function(gp,_6){var p=gp.getCoordinate(_6),w=gp.getWidth(_6),h=gp.getHeight(_6),_7=w>h?h:w,r=_7>>1,_8=[{x:p.x+r,y:p.y+r}];gp.setWidth(_7,_6);gp.setHeight(_7,_6);return _8;}});})();}