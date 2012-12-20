/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.RotateCommand"]){dojo._hasResource["drawboard.command.RotateCommand"]=true;dojo.provide("drawboard.command.RotateCommand");dojo.require("drawboard.command.Command");dojo.declare("drawboard.command.RotateCommand",drawboard.command.Command,{_oriAngle:null,getType:function(){return this.getConstant().ROTATECOMMAND;},positive:function(){var _1=this.getExecutor(),_2=dojo.clone(this.getMemo()),_3=this.getRuntime();if(this._oriAngle===null){this._oriAngle=_1.getRotator(_3).angle;}_1.setRotator(_2,_3);},negative:function(){var _4=this.getExecutor(),_5=dojo.clone(this.getMemo()),_6=this.getRuntime();_5.angle=this._oriAngle;_4.setRotator(_5,_6);},_merge:function(_7){var _8=this.getMemo(),_9=_7.getMemo();_8.angle=_9.angle;return true;}});}