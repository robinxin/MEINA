/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.strategy.GraphStrategyFactory"]){dojo._hasResource["drawboard.graph.strategy.GraphStrategyFactory"]=true;dojo.provide("drawboard.graph.strategy.GraphStrategyFactory");dojo.require("common.container.MapContainer");(function(){dojo.declare("drawboard.graph.strategy.GraphStrategyFactory",common.container.MapContainer,{getGraphStrategy:function(_1){if(!this.contains(_1)){var _2=eval("new "+_1+"()");this.addItem(_1,_2);}return this.getItem(_1);}});if(!drawboard.GraphStrategyFactory){drawboard.GraphStrategyFactory=new drawboard.graph.strategy.GraphStrategyFactory();}})();}