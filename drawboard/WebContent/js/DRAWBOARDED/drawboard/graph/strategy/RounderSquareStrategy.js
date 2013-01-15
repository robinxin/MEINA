/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.RounderSquareStrategy"]){dojo._hasResource["drawboard.graph.strategy.RounderSquareStrategy"]=true;dojo.provide("drawboard.graph.strategy.RounderSquareStrategy");dojo.require("drawboard.graph.strategy.SquareStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.RounderSquareStrategy",drawboard.graph.strategy.SquareStrategy,{draw:function(gp,gf,_3){var p=_2.Path,_4=gp.getGraphRotator(_3),a=_4.angle,_5=_4.coordinate,w=gp.getWidth(_3),h=gp.getHeight(_3),_6=w>h?h:w,r=_3.getRounder(),_7=["translate("+_5.x+","+_5.y+")","rotate("+a+")","translate("+-_5.x+","+-_5.y+")"];gp.getGraphCoordinates(_3);return gf.drawRect(gp.getCoordinate(_3),_6,_6,r,(a!=0)&&{transform:_7},this.getStyle(gp,_3));}});})();}