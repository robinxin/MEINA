/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["window.widget.TextDialogue"]){dojo._hasResource["window.widget.TextDialogue"]=true;dojo.provide("window.widget.TextDialogue");dojo.require("common.widget.CommonDialogue");dojo.declare("window.widget.TextDialogue",[dijit._Widget,dijit._Templated,common.widget.CommonDialogue],{templateString:"<div><span dojoAttachPoint='textNode'></span></div>",text:"",postCreate:function(){this.textNode.innerHTML=this.text;this.inherited(arguments);},createContent:function(){return this.domNode;}});}