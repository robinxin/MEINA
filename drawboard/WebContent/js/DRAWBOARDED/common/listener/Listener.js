/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["common.listener.Listener"]){dojo._hasResource["common.listener.Listener"]=true;dojo.provide("common.listener.Listener");dojo.declare("common.listener.Listener",null,{_listeners:null,constructor:function(){this._listeners=new dojox.collections.ArrayList();},containsListener:function(_1){if(this._listeners.contains(_1)){return true;}return false;},addListener:function(_2,_3){var _4={funct:_2,env:_3};if(!this.containsListener(_4)){this._listeners.add(_4);}},fireListener:function(_5){this.forInListeners(function(_6,_7){_6.funct.apply(_6.env||window,_5||[]);},this);},removeListener:function(_8){this.forInListeners(function(_9,_a){if(_9.env==_8){this.remove(_a);}},this,true);},forInListeners:function(f,o,_b){if(!f){return;}o=o||this;var _c=this._listeners.toArray();dojo.forEach(_b?_c.reverse():_c,f,o);},clear:function(){this._listeners.clear();}});}