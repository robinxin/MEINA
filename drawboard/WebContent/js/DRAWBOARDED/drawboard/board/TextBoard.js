/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["drawboard.board.TextBoard"]){dojo._hasResource["drawboard.board.TextBoard"]=true;dojo.provide("drawboard.board.TextBoard");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.declare("drawboard.board.TextBoard",[dijit._Widget,dijit._Templated],{templateString:"<div style='position:absolute;display:none;'><textarea dojoAttachPoint='textContentNode'></textarea></div>",_db:null,postCreate:function(){this.inherited(arguments);},setText:function(_1){this.textContentNode.value=_1;},clearText:function(){this.textContentNode.value="";},show:function(gp){var _2=this.domNode.style,_3=this._db.getRuntime(),_4=gp.getCoordinate?gp.getCoordinate(_3):{x:gp.x,y:gp.y};_2.left=_4.x+"px";_2.top=_4.y+"px";this.textContentNode.style.width=_2.width=(gp.getWidth?gp.getWidth(_3):gp.width)+"px";this.textContentNode.style.height=_2.height=(gp.getHeight?gp.getHeight(_3):gp.height)+"px";_2.display="";},hide:function(){var _5=this.domNode.style;if(_5.display==""){var db=this._db,_6=this.textContentNode.value;db.setText(_6);this.clearText();}_5.display="none";}});}