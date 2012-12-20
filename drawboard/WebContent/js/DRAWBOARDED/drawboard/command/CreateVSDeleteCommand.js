/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.CreateVSDeleteCommand"]){dojo._hasResource["drawboard.command.CreateVSDeleteCommand"]=true;dojo.provide("drawboard.command.CreateVSDeleteCommand");dojo.require("drawboard.command.Command");dojo.declare("drawboard.command.CreateVSDeleteCommand",drawboard.command.Command,{_info:null,index:null,getType:function(){return this.getConstant().CREATEVSDELETECOMMAND;},positive:function(){var _1=this.getExecutor(),_2=this.getMemo(),_3=this._info,_4=this.getRuntime(),_5=_4.getContext().getStyleCtrl(),_6=this.index;_6===null?_1.add(_2):_1.insert(this.index,_2);if(_3){dojo.forEach(_3,function(_7){_1.insert(_7.index,_7.gp);_7.gs&&_5.addItem(_7.gp.getIdty(),_7.gs);_2.add(_7.gp,_4);},this);_2.resetRelations();}},negative:function(){var _8=this.getExecutor(),_9=this.getMemo(),_a,_b=this.getRuntime(),_c=_b.getContext().getStyleCtrl();if(_9.isComposite()){if(!this._info){this._info=[];}_a=this._info;var gp;_9.forInItems(function(_d){gp=_d.gp;_a.push({gp:gp,gs:_c.getItem(gp.getIdty()),index:_8.indexOf(gp)});},this);}this.index=_8.indexOf(_9);_8.removeGraph(_9);},_merge:function(_e){return false;}});}