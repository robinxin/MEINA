/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["window.widget.ToolbarContainer"]){dojo._hasResource["window.widget.ToolbarContainer"]=true;dojo.provide("window.widget.ToolbarContainer");dojo.require("dijit._Widget");dojo.require("dijit._Templated");dojo.require("common.exception.Exception");dojo.declare("window.widget.ToolbarContainer",[dijit._Widget,dijit._Templated],{templateString:"<div dojoAttachPoint=\"toolbar\" class=\"toolbar\">\r\n\t<div dojoAttachPoint=\"floatDiv\" class=\"toolbarFloatCover\"></div>\r\n\t<div dojoAttachPoint=\"containerNode\" class=\"toolbarContainer\"></div>\r\n</div>\r\n",contentBuilder:null,contentBuilderClass:"window.widget._ToolbarBuilder",floatDivAnimate:null,events:null,drawboard:null,widthUnit:36,left:3,top:3,postCreate:function(){this.inherited(arguments);this.contentBuilder=eval("new "+this.contentBuilderClass+"(this)");this.createContent();var _1=this.floatDiv;_1.style.display="none";this.floatDivAnimate=dojo.animateProperty({node:this.floatDiv,duration:1000,properties:{}});this.events=[dojo.connect(this.containerNode,"onclick",this,this.doContentEvent),dojo.connect(this.containerNode,"onmousemove",this,this.doContentEvent)];},createContent:function(){this.containerNode.innerHTML=this.contentBuilder.generateHTML();},getDefinition:function(){if(!this.definition){this.createDefinition();}return this.definition;},setDrawboard:function(db){this.drawboard=db;},getDrawboard:function(){if(!this.drawboard){new common.exception.Exception({msg:"the drawboard doesn't exist!"});return;}return this.drawboard;},createDefinition:function(){this.definition=new dojo.data.ItemFileReadStore({url:drawboardRuntimeSetting.toolbarImgUrl});this.definition._forceLoad();},doContentEvent:function(e){e.dispatch="do"+e.type;this._dispatch(e.dispatch,e);},_dispatch:function(m,e){if(m in this){return this[m](e);}return false;},getMenuNode:function(e){var _2=e.target||e.srcElement;if(dojo.hasClass(_2,"toolbarDiv")){return _2.firstElementChild||_2.childNodes.item(0);}if(dojo.hasClass(_2,"toolbarIcon")){return _2;}return null;},doclick:function(e){var _3=this.getMenuNode(e),_4;if(!_3){return;}_4=dojo.attr(_3,"action");this.drawboard[dojo.trim(_4)]();},domousemove:function(e){var _5=this.getMenuNode(e),_6,_7,_8,_9,s;if(!_5){return;}_6=parseInt(dojo.attr(_5,"index"));_7=this.floatDivAnimate;_7.stop();_8=this.floatDivAnimate.properties,_9=_8.left;s=this.floatDiv.style;s.display="none";if(!_9){_8.left={};_8.left.start=_8.left.end=this.widthUnit*_6+this.left;s.left=this.left+"px";s.top=this.top+"px";return;}_8.left.start=_9.end;_8.left.end=this.widthUnit*_6+this.left;_7.play();return;},destroyComponent:function(){dojo.forEach(this.events,dojo.disconnect);for(var _a in this){if(typeof _a=="function"){continue;}if(this[_a].destroyRecursive){this[_a].destroyRecursive(true);}this[_a]=null;delete this[_a];}}});window.widget._ToolbarBuilder=dojo.extend(function(_b){this.view=_b;},{view:null,zIndex:900,_table:"<ul class=\"toolbarUL\">",constructor:function(_c){this.view=_c;},generateHTML:function(){var _d=[this._table],_e=this.view.getDefinition()._arrayOfAllItems[0],_f;if(!_e){return "";}dojo.forEach(_e.children,function(_10,_11){if(_10){_f=["<li class=\"toolbarDiv\">"];_f.push(this.generateIMG(_10,_11));_f.push("</li>");_d.push(_f.join(" "));}},this);_d.push("</ul>");return _d.join(" ");},generateIMG:function(_12,_13){var _14=["<img index=",_13," class='toolbarIcon ",_12.css[0],"'"," title='",_12.title?_12.title[0]:_12.name[0],"'"," action='",_12.action[0],"'"," src='",drawboardRuntimeSetting,"'","/>"];return _14.join(" ");}});}