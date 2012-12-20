/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.graph.decorate.controller.CharacterController"]){dojo._hasResource["drawboard.graph.decorate.controller.CharacterController"]=true;dojo.provide("drawboard.graph.decorate.controller.CharacterController");dojo.require("drawboard.graph.decorate.Character");dojo.require("drawboard.graph.decorate.controller.Controller");(function(){dojo.declare("drawboard.graph.decorate.controller.CharacterController",drawboard.graph.decorate.controller.Controller,{type:drawboard.Constant.Decorate.CHARACTER,_create:function(gp,_1){var _2=gp.getMarks(_1),_3=gp.getRotator(_1),_4=new drawboard.graph.decorate.Character({coordinate:pos,rotator:_3}),_5=[],_4,gf=_1.getGraphic();dojo.forEach(_2,function(_6){_4.setCoordinate(_6);_4.setRotator(_3);_4.draw(gf,this.getStyle(gp,_4,_1),_1);_5.push(_4);},this);return _5;}});drawboard._characterController=null;drawboard.characterController=function(){if(!drawboard._characterController){drawboard._characterController=new drawboard.graph.decorate.controller.CharacterController();}return drawboard._characterController;};})();}