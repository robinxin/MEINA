/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard._Event"]){dojo._hasResource["drawboard._Event"]=true;dojo.provide("drawboard._Event");dojo.require("drawboard.Constant");dojo.require("drawboard.Constant");dojo.require("common.calc.Geometry");(function(){var _1=common.calc.Geometry,_2=drawboard.Constant.ActionStatus,_3=drawboard.Constant;dojo.declare("drawboard._Event",null,{_start:null,_end:null,boxCache:null,_marks:null,getBoxCache:function(){if(!this.boxCache){var _4=(this.fixNode||this.domNode),_5={left:_4.offsetLeft,top:_4.offsetTop};this.boxCache=_5;}return this.boxCache;},refreshBoxCache:function(){this.boxCache=null;},fetchCoordinate:function(e){var _6=this.getBoxCache(),_7=this.domNode;return {x:e.pageX-_6.left+_7.scrollLeft,y:e.pageY-_6.top+_7.scrollTop};},showMarkActive:function(gp,d,_8){var _9=d||gp.getActiveAnchors(_8),_a,_b,_c;if((d&&!gp.isAnchor(d))||!_9){return;}(!dojo.isArray(_9))&&(_9=[_9]);_a=drawboard.markController;dojo.forEach(_9,function(s){_c=_a.cross(s,gp,this,_8);if(_c){!_b&&(_b=[])&&(this._marks=_b);_b.push(_c);}},this);_a=_8.getContext().getStyleCtrl();!_b&&(this._marks=null);if(_b){var _d=[];dojo.forEach(_b,function(m){this.push(m.d);gp=m.gp;},_d);_a.setActives(_d,gp);return;}_a.setActives(null);},doClick:function(e){this.inherited(arguments);},doMouseMove:function(e){this.inherited(arguments);this._end&&(this._start=this._end);this._end=this.fetchCoordinate(e);var gp=this.getActive(),_e=this._start,_f=this._end,_10=this.getActionStatus(),_11=this.getDecorate(),_12,_13,a,_14=this.getRuntime(),_15=this.getSelectRect(),_16=_3.Command,_17=dojo.hitch(this,this.addCommand),_18=true;if(_10!=_2.NONE&&gp){_12=dojo.clone(gp.getRotator(_14));_13=_12.coordinate;}_15&&!gp&&(gp=_15);if(!gp&&_10!=_2.DRAWING&&_10!=_2.SELECTING&&_10!=_2.TEXT){return;}switch(_10){case _2.RESIZING:_17(_16.RESIZECOMMAND,gp,{decorate:_11,start:_e,end:_f});this.showMarkActive(gp,drawboard.skeletonController.createItem(gp.getSkeletonCoordinates(_14)[_11.getIndex()],_11.getIndex()),_14);break;case _2.MOVING:_17(_16.MOVECOMMAND,gp,{start:_e,end:_f});this.showMarkActive(gp,null,_14);break;case _2.DRAWING:case _2.SELECTING:case _2.TEXT:var _19=this.getDrawEntity(true);_19.width=_f.x-_19.x;_19.height=_f.y-_19.y;break;case _2.MOTION:_17(_16.MOTIONCOMMAND,gp,{decorator:_11,p:_f});break;case _2.ROTATING:case _2.POLEMOVING:if(_10==_2.ROTATING){_12.angle=_1.angle({x:_13.x,y:_13.y-_14.getContext().getParamsCtrl().getRotateDistance()},_13,this._end);_17(_16.ROTATECOMMAND,gp,_12);}else{_11.pole=_12.coordinate=_f;gp.setRotator(_12,_14);}break;case _2.NONE:default:_18=false;break;}_18&&this.draw();},doMouseDown:function(e){this.inherited(arguments);var _1a=this.fetchCoordinate(e),_1b=this.getActionStatus(),_1c;if(_1b==_2.DRAWING||_1b==_2.SELECTING||_1b==_2.TEXT){_1c=this.getDrawEntity(true);_1c.x=_1a.x;_1c.y=_1a.y;}this._start=_1a;},doMouseOver:function(e){this.inherited(arguments);},doMouseUp:function(e){var _1d=this._marks,_1e=this.getRuntime(),_1f=this.getActionStatus(),_20=(_1f==_2.DRAWING||_1f==_2.TEXT)?false:true,_21=drawboard.relationController,gp=this.getActive(),_22=this.getDecorate();gp&&(gp.normalize(_22,_1e));if(gp&&_21.containRestrain(gp,_22,_1e)){this.addCommand(_3.Command.ADDVSDELTECONSTRAINCOMMAND,_21,[{restrainedGp:gp,restrainedD:_22}],true);}if(_1d){var _23=[];dojo.forEach(_1d,function(_24){if(!_21.containRestrain(_24.restrainedGp,_24.restrainedD,_1e)){_23.push(_24);}},this);(_23.length>0)&&this.addCommand(_3.Command.ADDVSDELTECONSTRAINCOMMAND,_21,_23);}if(this._status==_2.TEXT){var _25=this.getDrawEntity(),_26=this.getTextBoard();_26.clearText();_26.show(_25);this.setDrawType("drawboard.graph.strategy.TextStrategy");}this.getRuntime().getContext().getStyleCtrl().setActives(null);this._start=null;this._end=null;this._marks=null;this.clearDrawEntity(_20);this.inherited(arguments);this.clearCommand();this.draw();dojo.publish("/drawboard/mouseup");}});})();}