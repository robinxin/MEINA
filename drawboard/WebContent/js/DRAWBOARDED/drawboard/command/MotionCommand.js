/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.MotionCommand"]){dojo._hasResource["drawboard.command.MotionCommand"]=true;dojo.provide("drawboard.command.MotionCommand");dojo.require("drawboard.command.Command");dojo.declare("drawboard.command.MotionCommand",drawboard.command.Command,{getType:function(){return this.getConstant().MOTIONCOMMAND;},positive:function(){var _1=this.getExecutor(),_2=this.getMemo(),_3=this.getRuntime(),ma=_2.decorator;(!_2.oldP)&&(_2.oldP=ma.getCenter());_1.moveMotionAnchor(ma,_2.p,_3);},negative:function(){var _4=this.getExecutor(),_5=this.getMemo(),_6=this.getRuntime();_4.moveMotionAnchor(_5.decorator,_5.oldP,_6);_4.normalize(_5.decorator,_6);},_merge:function(_7){var _8=this.getMemo(),ma=_8.decorator,_9=_7.getMemo(),_a=_9.decorator;if(ma.getIndex()==_a.getIndex()){_8.p=_9.p;return true;}return false;}});}