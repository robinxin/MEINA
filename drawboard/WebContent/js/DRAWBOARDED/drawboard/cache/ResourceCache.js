/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.cache.ResourceCache"]){dojo._hasResource["drawboard.cache.ResourceCache"]=true;dojo.provide("drawboard.cache.ResourceCache");dojo.require("common.Cache");(function(){dojo.declare("drawboard.cache.ResourceCache",common.Cache,{createCache:function(){return {};},getResource:function(_1){return this.getCache()[_1];},addResource:function(_2,_3){var _4=this.getCache();_4[_2]=_3;},removeResource:function(_5){var _6=this.getCache();_6[_5]=null;delete _6[_5];}});if(drawboard.resourceCenter==null){drawboard.resourceCenter=new drawboard.cache.ResourceCache();}})();}