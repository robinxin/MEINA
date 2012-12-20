/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.GraphStrategy"]){dojo._hasResource["drawboard.graph.strategy.GraphStrategy"]=true;dojo.provide("drawboard.graph.strategy.GraphStrategy");dojo.require("common.calc.Geometry");dojo.require("drawboard.Constant");dojo.require("common.exception.Exception");(function(){var _1=drawboard.Constant;dojo.declare("drawboard.graph.strategy.GraphStrategy",null,{type:_1.Decorate.Graph,_hasRotator:true,hasRotator:function(){return this._hasRotator;},getRotatorCoordinate:function(gp,_2){return null;},getActiveAnchors:function(gp,_3){return null;},isAnchor:function(d){return false;},isIn:function(gp,_4,_5){},draw:function(gp,gf,_6){},normalize:function(gp,_7,_8){return false;},sizeChange:function(gp,_9,_a,_b){var d=_1.Direction,p=gp.getCoordinate(_b),w=gp.getWidth(_b),h=gp.getHeight(_b),_c=_a.x,_d=_a.y,_e=_9.getDirect();switch(_e){case d.NORTH:gp.setCoordinate({x:p.x,y:p.y+_d},_b);gp.setHeight(h-_d,_b);break;case d.SOUTH:gp.setHeight(h+_d,_b);break;case d.WEST:gp.setCoordinate({x:p.x+_c,y:p.y},_b);gp.setWidth(w-_c,_b);break;case d.EAST:gp.setWidth(w+_c,_b);break;case d.WESTNORTH:gp.setCoordinate({x:p.x+_c,y:p.y+_d},_b);gp.setWidth(w-_c,_b);gp.setHeight(h-_d,_b);break;case d.EASTNORTH:gp.setCoordinate({x:p.x,y:p.y+_d},_b);gp.setWidth(w+_c,_b);gp.setHeight(h-_d,_b);break;case d.EASTSOUTH:gp.setWidth(w+_c,_b);gp.setHeight(h+_d,_b);break;case d.WESTSOUTH:gp.setCoordinate({x:p.x+_c,y:p.y},_b);gp.setWidth(w-_c,_b);gp.setHeight(h+_d,_b);break;case d.END:break;default:break;}this._sizeChange(gp,_9,_a,_b);},_sizeChange:function(gp,_f,_10,_11){},getGraphCoordinates:function(gp,_12){},getSkeletonCoordinates:function(gp,_13){var _14=gp.getCoordinate(_13),w=gp.getWidth(_13),h=gp.getHeight(_13),x=_14.x,y=_14.y;return [{x:x,y:y,css:"mover_nw"},{x:x+w,y:y,css:"mover_ne"},{x:x,y:y+h,css:"mover_sw"},{x:x+w,y:y+h,css:"mover_se"},{x:x+(w>>1),y:y,css:"mover_n"},{x:x+(w>>1),y:y+h,css:"mover_s"},{x:x,y:y+(h>>1),css:"mover_w"},{x:x+w,y:y+(h>>1),css:"mover_e"}];},calcMotionAnchor:function(gp,_15,_16,_17){},getMotionAnchorCoordinates:function(gp,_18){},getMarkCoordinates:function(gp,_19){var _1a=gp.getCoordinate(_19),w=gp.getWidth(_19),h=gp.getHeight(_19),_1b=gp.getRealMarks(_19),x=_1a.x,y=_1a.y;if(!_1b){return [{x:x+(w>>1),y:y},{x:x+(w>>1),y:y+h},{x:x,y:y+(h>>1)},{x:x+w,y:y+(h>>1)}];}var _1c=[_1b[0]||{x:x+(w>>1),y:y},_1b[1]||{x:x+(w>>1),y:y+h},_1b[2]||{x:x,y:y+(h>>1)},_1b[3]||{x:x+w,y:y+(h>>1)}];for(var i=4;i<_1b.length;i++){_1c.push(_1b[i]);}return _1c;},getStyleController:function(_1d){return _1d.getContext().getStyleCtrl();},getStyle:function(gp,_1e){return this.getStyleController(_1e).getStyle(this.type,gp);}});})();}