/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.container.LayoutContainer"]){dojo._hasResource["drawboard.container.LayoutContainer"]=true;dojo.provide("drawboard.container.LayoutContainer");dojo.require("common.container.ListContainer");dojo.require("dijit._Widget");dojo.declare("drawboard.container.LayoutContainer",[dijit._Widget,common.container.ListContainer],{up:function(gs){var _1=this.indexOf(gs);this.move(_1,_1+1);},down:function(gs){var _2=this.indexOf(gs);this.move(_2,_2-1);},top:function(gs){var _3=this.indexOf(gs);this.move(_3,this.size());},bottom:function(gs){var _4=this.indexOf(gs);this.move(_4,0);}});}