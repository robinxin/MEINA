/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.command.CompositeCommand"]){dojo._hasResource["drawboard.command.CompositeCommand"]=true;dojo.provide("drawboard.command.CompositeCommand");dojo.require("common.container.ListContainer");dojo.require("drawboard.command.Command");dojo.declare("drawboard.command.CompositeCommand",[drawboard.command.Command,common.container.ListContainer],{constructor:function(){this.execute=this.positive;this.unexecute=this.negative;},getType:function(){return this.getConstant().COMPOSITECOMMAND;},add:function(_1){var _2=this.last(),_3=this.size();if(_3==0||(_2&&!_2.merge(_1))){drawboard.command.CompositeCommand.superclass.add.call(this,_1);return;}},positive:function(){this.forInItems(function(_4){_4.execute();},this);},negative:function(){this.forInItems(function(_5){_5.unexecute();},this);}});}