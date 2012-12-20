dojo.provide("window.widget.TextDialogue");
dojo.require("common.widget.CommonDialogue");
dojo.declare("window.widget.TextDialogue",[dijit._Widget,dijit._Templated,common.widget.CommonDialogue],{
	/*String*/templateString:"<div><span dojoAttachPoint='textNode'></span></div>",
	/*String*/text:"",
	/*void*/postCreate: function(){
		this.textNode.innerHTML = this.text;
		this.inherited(arguments);
	},
	/*NODE*/createContent:function(){
		return this.domNode;
	}
});
