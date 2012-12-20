/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.CombineVSDevidedCommand"]){dojo._hasResource["drawboard.command.CombineVSDevidedCommand"]=true;dojo.provide("drawboard.command.CombineVSDevidedCommand");dojo.require("drawboard.command.Command");dojo.declare("drawboard.command.CombineVSDevidedCommand",drawboard.command.Command,{getType:function(){return this.getConstant().COMBINEVSDEVIDEDCOMMAND;},positive:function(){var _1=this.getExecutor(),_2=this.getMemo();_1.combineGraph(_2);},negative:function(){var _3=this.getExecutor(),_4=this.getMemo();_3.divideGraph(_4);},_merge:function(_5){return false;}});}