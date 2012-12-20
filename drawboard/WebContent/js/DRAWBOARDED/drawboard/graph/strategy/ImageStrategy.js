/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.ImageStrategy"]){dojo._hasResource["drawboard.graph.strategy.ImageStrategy"]=true;dojo.provide("drawboard.graph.strategy.ImageStrategy");dojo.require("drawboard.controller.StyleController");dojo.require("drawboard.graph.strategy.GraphStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.ImageStrategy",drawboard.graph.strategy.GraphStrategy,{getGraphCoordinates:function(gp,_3){var _4=gp.getCoordinate(_3),w=gp.getWidth(_3),h=gp.getHeight(_3),x=_4.x,y=_4.y;return [{x:x,y:y},{x:x+w,y:y},{x:x+w,y:y+h},{x:x,y:y+h}];},isIn:function(gp,_5,_6){return _1.isPointInPolyn(gp.getGraphCoordinates(_6),_5);},draw:function(gp,gf,_7){var p=_2.Path,_8=gp.getGraphRotator(_7),a=_8.angle,_9=_8.coordinate,_a=["translate("+_9.x+","+_9.y+")","rotate("+a+")","translate("+-_9.x+","+-_9.y+")"];gf.drawImage(gp.getCoordinate(_7),gp.getWidth(_7),gp.getHeight(_7),gp.getUrl(),(a!=0)&&{transform:_a},this.getStyle(gp,_7));}});})();}