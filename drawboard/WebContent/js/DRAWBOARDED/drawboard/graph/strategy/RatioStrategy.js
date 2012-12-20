/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.RatioStrategy"]){dojo._hasResource["drawboard.graph.strategy.RatioStrategy"]=true;dojo.provide("drawboard.graph.strategy.RatioStrategy");dojo.require("drawboard.graph.strategy.GraphStrategy");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant;dojo.declare("drawboard.graph.strategy.RatioStrategy",drawboard.graph.strategy.GraphStrategy,{isIn:function(gp,_3,_4){},draw:function(gp,gf,_5){},getGraphCoordinates:function(gp,_6){var _7=gp.getRatio(),w=gp.getWidth(_6),h=gp.getHeight(_6),_8;if(!_7){return this._getGraphCoordinates(gp,_6,w,h);}_8=h*_7;if(_8>w){h=w/_7;}else{w=_8;}gp.setWidth(w,_6);gp.setHeight(h,_6);return this._getGraphCoordinates(gp,_6,w,h);},_getGraphCoordinates:function(gp,_9,w,h){},sizeChange:function(gp,_a,_b,_c){var d=_2.Direction,_d=gp.getRatio(),p=gp.getCoordinate(_c),w=gp.getWidth(_c),h=gp.getHeight(_c),_e=_a.getDirect(),_f;if(_d){_f=h*_d;if(_f>w){h=w/_d;}else{w=_f;}}switch(_e){case d.NORTH:_b=_b.y;gp.setCoordinate({x:p.x+(_b>>1),y:p.y+(_b)},_c);gp.setWidth(w-(_b),_c);gp.setHeight(h-(_b),_c);break;case d.WESTNORTH:_b=Math.abs(_b.x)>Math.abs(_b.y)?_b.y:_b.x,gp.setCoordinate({x:p.x+_b,y:p.y+_b},_c);gp.setWidth(w-_b,_c);gp.setHeight(h-_b,_c);break;case d.EASTNORTH:_b=_b.y;gp.setCoordinate({x:p.x,y:p.y+_b},_c);gp.setWidth(w-_b,_c);gp.setHeight(h-_b,_c);break;case d.SOUTH:_b=_b.y;gp.setCoordinate({x:p.x-(_b>>1),y:p.y},_c);gp.setWidth(w+(_b),_c);gp.setHeight(h+(_b),_c);break;case d.EASTSOUTH:_b=Math.abs(_b.x)>Math.abs(_b.y)?_b.y:_b.x,gp.setCoordinate({x:p.x,y:p.y},_c);gp.setWidth(w+_b,_c);gp.setHeight(h+_b,_c);break;case d.WESTSOUTH:_b=_b.x;gp.setCoordinate({x:p.x+_b,y:p.y},_c);gp.setWidth(w-_b,_c);gp.setHeight(h-_b,_c);break;case d.WEST:_b=_b.x;gp.setCoordinate({x:p.x+_b,y:p.y+(_b>>1)},_c);gp.setWidth(w-(_b),_c);gp.setHeight(h-(_b),_c);break;case d.EAST:_b=_b.x;gp.setCoordinate({x:p.x,y:p.y-(_b>>1)},_c);gp.setWidth(w+(_b),_c);gp.setHeight(h+(_b),_c);break;case d.END:break;default:break;}}});})();}