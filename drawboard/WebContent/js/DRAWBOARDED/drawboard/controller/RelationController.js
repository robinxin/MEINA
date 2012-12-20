/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.controller.RelationController"]){dojo._hasResource["drawboard.controller.RelationController"]=true;dojo.provide("drawboard.controller.RelationController");dojo.require("drawboard.Constant");dojo.require("common.container.MapContainer");dojo.require("common.utils.CollectionUtils");dojo.require("common.Cache");(function(){var _1=drawboard.Constant.Symbol,_2=common.utils.CollectionUtils.hasAttr;dojo.declare("drawboard.controller.RelationController",[common.container.MapContainer,common.Cache],{addListener:function(gp,d,_3,_4,_5){var _6=gp.getIdty(),_7=this.getItem(_6),_8,_9=false,_a=d.getType()+_1.concat+d.getIndex();if(!_7){_7={};this.addItem(_6,_7);}_8=_7[_a];if(!_8){_8=[];_7[_a]=_8;}dojo.some(_8,function(i){if(i.gp==_3){_9=true;return true;}},this);if(!_9){_8.push({gp:_3,decorate:_4});this.addRestrainedCache(gp,d,_3,_4,_5);}},removeListener:function(_b,_c,_d){var _e=this.removeRestrainedCache(_b,_c,_d),_f,_10,_11,_12,id;dojo.forEach(_e,function(_13){id=_13.id;_f=this.getItem(id);if(!_f){return;}_12=[];_11=_13.decorate.getType()+_1.concat+_13.decorate.getIndex();_13=_f[_11];dojo.forEach(_13,function(_14,_15){if(_14.gp!=_b){return;}if(!_c||(_c&&_14.decorate.equal(_c))){_12.push(_15);}},this);dojo.forEach(_12.reverse(),function(_16){_13.splice(_16,1);},this);delete _f[_11];if(!_2(_f)){this.removeItem(id);}},this);},fireEvent:function(_17,d,_18,_19,_1a){var _1b=this.getItem(_17),_1c,_1d;if(!_1b){return;}_1c=_1b[d.getType()+_1.concat+d.getIndex()];_1c&&dojo.forEach(_1c,function(i){if(_1a&&!_1a(i.gp)){return;}_1d=_18.concat();_1d.unshift(i.decorate);_1d.push(null);_1d.push(_19);i.gp.sizeChange.apply(i.gp,_1d);},this);},addRestrainedCache:function(gp,d,_1e,_1f,_20){var _21=gp.getIdty(),_22=this.getCache(_20),_23=_22[_1e.getIdty()],_24=_1f.getType()+_1.concat+_1f.getIndex();if(!_23){_23={};_22[_1e.getIdty()]=_23;}!_23[_24]&&(_23[_24]={id:_21,gp:gp,decorate:d,restrainedGp:_1e,restrainedD:_1f});},containRestrain:function(_25,_26,_27){var _28=this.getRestrainedCache(_25,_26,_27);if(_28&&_28.length>0){return true;}return false;},getRestrainedCache:function(_29,_2a,_2b){var _2c=this.getCache(_2b),_2d=_2c[_29.getIdty()],_2e;if(!_2d){return _2e;}if(_2a){var _2f=_2a.getType()+_1.concat+_2a.getIndex();_2d[_2f]&&(_2e=[_2d[_2f]]);return _2e;}_2e=[];for(var _30 in _2d){_2e.push(_2d[_30]);}return _2e;},removeRestrainedCache:function(_31,_32,_33){var _34=this.getCache(_33),_35=_34[_31.getIdty()],_36;if(!_35){return _36;}if(_32){var _37=_32.getType()+_1.concat+_32.getIndex();_35[_37]&&(_36=[_35[_37]]);delete _35[_37];if(!_2(_35)){delete _34[_31.getIdty()];}return _36;}_36=[];for(var _38 in _35){_36.push(_35[_38]);}delete _34[_31.getIdty()];return _36;},createCache:function(){return {};}});if(drawboard.relationController==null){drawboard.relationController=new drawboard.controller.RelationController();}})();}