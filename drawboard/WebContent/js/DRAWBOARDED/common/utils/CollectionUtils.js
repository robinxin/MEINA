/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["common.utils.CollectionUtils"]){dojo._hasResource["common.utils.CollectionUtils"]=true;dojo.provide("common.utils.CollectionUtils");common.utils.CollectionUtils={sliceRange:function(_1,_2,_3){var _4=[],_5=(_2+_3>_1.length-1)?_1.length-1:_2+_3;for(;_5>=_2;_5--){_4[--_3]=_1[_5];}return _4;},copy4Attrs:function(_6,to,_7){for(var _8 in _6){if((_7&&_7[_8])||(typeof _6[_8]=="function")){continue;}to[_8]=_6[_8];}},hasAttr:function(o){var _9=false;for(var _a in o){_9=true;}return _9;}};}