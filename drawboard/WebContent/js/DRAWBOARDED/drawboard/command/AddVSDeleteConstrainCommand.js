/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.AddVSDeleteConstrainCommand"]){dojo._hasResource["drawboard.command.AddVSDeleteConstrainCommand"]=true;dojo.provide("drawboard.command.AddVSDeleteConstrainCommand");dojo.require("drawboard.command.Command");dojo.declare("drawboard.command.AddVSDeleteConstrainCommand",drawboard.command.Command,{getType:function(){return this.getConstant().ADDVSDELTECONSTRAINCOMMAND;},positive:function(){var _1=this.getExecutor(),_2=this.getMemo(),_3=this.getRuntime();dojo.forEach(_2,function(_4){_1.addListener(_4.gp,_4.d,_4.restrainedGp,_4.restrainedD,_3);},this);},negative:function(){var _5=this.getExecutor(),_6=this.getMemo(),_7=this.getRuntime(),_8;dojo.forEach(_6,function(_9){_8=_5.getRestrainedCache(_9.restrainedGp,_9.restrainedD,_7);if(_8&&_8.length>0){_6=[];this.setMemo(_6);dojo.forEach(_8,function(_a){_6.push({gp:_a.gp,d:_a.decorate,restrainedGp:_9.restrainedGp,restrainedD:_9.restrainedD||_a.restrainedD});},this);}_5.removeListener(_9.restrainedGp,_9.restrainedD,_7);},this);},_merge:function(_b){return false;}});}