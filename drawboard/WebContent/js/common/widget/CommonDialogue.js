dojo.provide("common.widget.CommonDialogue");
dojo.require("dijit.Dialog");
dojo.require("dijit._Widget");
dojo.require("dijit.form.Button");
dojo.declare("common.widget.CommonDialogue",null,{
	dialogue:null,
	buttons:null,			//[{label,clickFunction}]
	visible4Cancel:true,
	visible4OK:true,
	OKLabel:"确认",
	CancelLabel:"取消",
	okBtn:null,
	cancelBtn:null,
	contentCss:"DialogContent",
	title:null,
	warning:null,
	errCss:"DialogError",
	footCss:"DialogFoot",
	errorObj:null,
	constructor: function(params){
		if(params){
			dojo.mixin(this,params);
		}
	},
	/**params/**{title,OKLabel,CancelLabel,visible4OK,visible4Cancel,contentCss,buttons<Array>}*/
	postCreate: function(){ //可能直接调用。
		this.createDialogue();
	},
	createDialogue:function(){
		var dialgoueDiv = document.createElement("div");
		if(this.contentCss){
			dojo.addClass(dialgoueDiv,this.contentCss);
		}
		var innerDiv = document.createElement("div");
		dojo.attr(innerDiv,"style","overflow:auto;");
		innerDiv.appendChild(this.createContent());
		dialgoueDiv.appendChild(innerDiv);
		dialgoueDiv.appendChild(this.createFoot());
		this.dialogue = new dijit.Dialog({title:this.title,style:"overflow:visible;outline:none;"},dialgoueDiv);
		dojo.connect(this.dialogue,"onCancel",dojo.hitch(this,"onCancel"));
		dojo.connect(this.dialogue.domNode,"onkeypress",dojo.hitch(this,"onKeyPress"));
		
	},
	/*NODE*/createContent:function(){
		//override by subclass for content constructs.
	},
	createFoot:function(){
		var foot = document.createElement("div");
		dojo.addClass(foot,this.footCss);
		var error = document.createElement("div");
		dojo.addClass(error,this.errCss);
		this.errorObj = error;
		this.hidWarn();
		foot.appendChild(error);
		if(this.visible4OK){
			var okBtn = new dijit.form.Button({label: this.OKLabel});
			foot.appendChild(okBtn.domNode);
			dojo.connect(okBtn,"onClick",dojo.hitch(this,"onOK"));
			this.okBtn = okBtn;
		}
		if(this.visible4Cancel){
			var cancelBtn = new dijit.form.Button({label: this.CancelLabel});
			foot.appendChild(cancelBtn.domNode);
			dojo.connect(cancelBtn,"onClick",dojo.hitch(this,"onCancel"));
			this.cancelBtn = cancelBtn;
		}
		if(this.buttons){
			dojo.forEach(this.buttons,function(button){
				var btn = new dijit.form.Button({label:button.label});
				foot.appendChild(btn.domNode);
				if(button.clickFunction){
					dojo.connect(btn,"onClick",dojo.hitch(this,button.clickFunction));
				}
			});
		}
		return foot;
	},
	warn:function(msg){
		this.errorObj.innerHTML = msg;
		this.errorObj.style.display = "";
	},
	hidWarn:function(){
		this.errorObj.innerHTML = "";
		this.errorObj.style.display = "none";
	},
	show:function(){
		if(this.dialogue){
			this.dialogue.show();
		}
	},
	hide:function(){
		if(this.dialogue){
			this.dialogue.hide();
		}
	},
	destroy:function(){
		if(this.dialogue){
			this.dialogue.destroy();
		}
	},
	onOK:function(e){
		var ok = this._check(e);
		if(ok){
			this.hide();
			this._onOK(e);
		}
	},
	onCancel:function(e){
		this.hide();
		this._onCancel(e);
	},
	onKeyPress:function(e){
		var event = e || window.event;
		this._onKeyPress(e);
		if(event.keyCode == dojo.keys.ENTER){
			this.onOK(e);
			return;
		}
		if(event.keyCode == dojo.keys.ESCAPE){
			this.onCancel(e);
		}
	},
	_check:function(e){
		//override by subclass when on click event is triggered.
		return true;
	},
	_onOK:function(e){
		//override by subclass when on click event is triggered.
	},
	_onCancel:function(e){
		//override by subclass when on click event for cancel is triggered.
	},
	_onKeyPress:function(e){
		//override by subclass when on click event for key press is triggered.
	}
});