/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.Command"]){dojo._hasResource["drawboard.command.Command"]=true;dojo.provide("drawboard.command.Command");dojo.require("common.command.Command");dojo.require("common.exception.Exception");dojo.require("drawboard.Constant");(function(){var _1=drawboard.Constant.Command;dojo.declare("drawboard.command.Command",common.command.Command,{_memo:null,_executor:null,_runtime:null,_description:{},constructor:function(_2,_3,_4){if(!_2){new common.exception.Exception({msg:"the executor must be exist in the command!"});return;}this._executor=_2;this._memo=_3;if(!_4){this.execute=this.positive;this.unexecute=this.negative;}else{this.execute=this.negative;this.unexecute=this.positive;}},getType:function(){return "";},getConstant:function(){return _1;},setMemo:function(_5){this._memo=_5;},getMemo:function(){return this._memo;},setRuntime:function(_6){this._runtime=_6;},getRuntime:function(){var _7=this._runtime;if(!_7){new common.exception.Exception({msg:"the runtime must be exist in the command!"});}return _7;},getExecutor:function(){return this._executor;},setExecutor:function(_8){this._executor=_8;},execute:function(){},unexecute:function(){},positive:function(){},negative:function(){},setDescription:function(_9,_a){this._description={first:_9,second:_a};},isPositive:function(){if(this.execute==this.positive){return true;}return false;},isCancelOut:function(){return false;},getDesciption:function(){var _b=this._description;if(this.isPositive()){return _b.first;}return _b.second;},merge:function(_c){if(this.getType()!=_c.getType()||this.getExecutor()!=_c.getExecutor()){return false;}return this._merge(_c);},_merge:function(_d){}});})();}