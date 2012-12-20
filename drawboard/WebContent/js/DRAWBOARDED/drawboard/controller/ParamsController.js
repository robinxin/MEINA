/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.controller.ParamsController"]){dojo._hasResource["drawboard.controller.ParamsController"]=true;dojo.provide("drawboard.controller.ParamsController");(function(){dojo.declare("drawboard.controller.ParamsController",null,{_distance:5,rotate_distance:20,rounder:10,getDistance:function(){return this._distance;},setDistance:function(_1){this._distance=_1;},getRotateDistance:function(){return this.rotate_distance;},setRotateDistance:function(_2){this.rotate_distance=_2;},getRounder:function(){return this.rounder;}});})();}