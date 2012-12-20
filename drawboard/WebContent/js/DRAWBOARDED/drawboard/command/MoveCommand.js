/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.MoveCommand"]){dojo._hasResource["drawboard.command.MoveCommand"]=true;dojo.provide("drawboard.command.MoveCommand");dojo.require("drawboard.command.Command");dojo.declare("drawboard.command.MoveCommand",drawboard.command.Command,{getType:function(){return this.getConstant().MOVECOMMAND;},positive:function(){var _1=this.getExecutor(),_2=this.getMemo(),_3=this.getRuntime();_1.move(_2.start,_2.end,_3);},negative:function(){var _4=this.getExecutor(),_5=this.getMemo(),_6=this.getRuntime();_4.move(_5.end,_5.start,_6);},_merge:function(_7){var _8=this.getMemo(),_9=_7.getMemo();_8.end=_9.end;return true;}});}