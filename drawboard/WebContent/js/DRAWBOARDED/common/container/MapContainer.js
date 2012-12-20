/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["common.container.MapContainer"]){dojo._hasResource["common.container.MapContainer"]=true;dojo.provide("common.container.MapContainer");dojo.declare("common.container.MapContainer",null,{map:null,multiple:false,constructor:function(){this.map={};},contains:function(_1){if(this.map[_1]){return true;}return false;},getItem:function(_2){return this.map[_2];},addItem:function(_3,_4){var _5=this.map[_3];if(!_5||!this.multiple){this.map[_3]=_4;return;}!dojo.isArray(_5)&&(_5=[_5]);_5.concat(_4);this.map[_3]=_5;},removeItem:function(_6,_7){var _8=this.map[_6];if(!this.multiple||!dojo.isArray(_8)){delete this.map[_6];return;}_8.remove(_7);},clearItems:function(){this.map=null;this.map={};},forInItems:function(f,o){if(!f){return;}o=o||this;var _9=this.map;for(var _a in _9){if(f.call(o,_9[_a],_a,this)===false){break;}}}});}