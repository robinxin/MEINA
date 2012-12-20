/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["common.Cache"]){dojo._hasResource["common.Cache"]=true;dojo.provide("common.Cache");dojo.declare("common.Cache",null,{_cache:null,getCache:function(){if(!this._cache){this._cache=this.createCache();}return this._cache;},createCache:function(){},clearCache:function(){this._cache=null;delete this._cache;}});}