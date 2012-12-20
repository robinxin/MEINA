/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.decorate.Decorator"]){dojo._hasResource["drawboard.graph.decorate.Decorator"]=true;dojo.provide("drawboard.graph.decorate.Decorator");dojo.require("dijit._Widget");dojo.declare("drawboard.graph.decorate.Decorator",dijit._Widget,{_type:null,coordinate:null,center:null,index:0,getIndex:function(){return this.index;},setIndex:function(_1){this.index=_1;},getType:function(){return this._type;},getCoordinate:function(){return this.coordinate;},setCoordinate:function(_2){this.coordinate=_2;},getCenter:function(){return this.center;},setCenter:function(_3){this.center=_3;},draw:function(gp,_4,_5){},equal:function(d){if(d.getIndex()!=this.getIndex()){return false;}var _6=true,ps=this.getCoordinate();dojo.some(d.getCoordinate(),function(_7,_8){if(_7!=ps[_8]){_6=false;return true;}},this);return _6;}});}