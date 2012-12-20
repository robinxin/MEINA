/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["common.Identity"]){dojo._hasResource["common.Identity"]=true;dojo.provide("common.Identity");dojo.require("dojo.dnd.common");dojo.declare("common.Identity",null,{idty:null,preIdt:null,getIdty:function(){if(!this.idty){this.idty=this.generateIdty();}return this.idty;},generateIdty:function(){var _1=dojo.dnd.getUniqueId();return this.preIdt?this.preIdt+"_"+_1:_1;}});}