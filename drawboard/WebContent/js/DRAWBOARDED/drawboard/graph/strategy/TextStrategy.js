/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.TextStrategy"]){dojo._hasResource["drawboard.graph.strategy.TextStrategy"]=true;dojo.provide("drawboard.graph.strategy.TextStrategy");dojo.require("drawboard.graph.strategy.RectangleStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.TextStrategy",drawboard.graph.strategy.RectangleStrategy,{draw:function(gp,gf,_3){var p=_2.Path,_4=gp.getGraphRotator(_3),a=_4.angle,_5=_4.coordinate,_6=["translate("+_5.x+","+_5.y+")","rotate("+a+")","translate("+-_5.x+","+-_5.y+")"];return gf.drawText(gp.getCoordinate(_3),gp.getWidth(_3),gp.getHeight(_3),gp.getText(),(a!=0)&&{transform:_6},this.getTextStyle(gp,_3));},getTextStyle:function(gp,_7){return this.getStyleController(_7).getTextStyle(gp);}});})();}