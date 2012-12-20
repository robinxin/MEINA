dojo.provide("drawboard.board.TextBoard");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.declare("drawboard.board.TextBoard",[dijit._Widget,dijit._Templated],{
	/*String*/templateString:"<div style='position:absolute;display:none;'><textarea dojoAttachPoint='textContentNode'></textarea></div>",
	/*DrawBoard*/_db:null,
	/*void*/postCreate:function(){
		this.inherited(arguments);
	},
	/*void*/setText:function(/*String*/text){
		this.textContentNode.value = text;
	},
	/*void*/clearText:function(){
		this.textContentNode.value = "";
	},
	/*void*/show:function(/*GraphProxy|{}*/gp){
		var style = this.domNode.style,
			runtime = this._db.getRuntime(),
			coordinate = gp.getCoordinate?gp.getCoordinate(runtime):{x:gp.x,y:gp.y};
		style.left = coordinate.x + "px";
		style.top = coordinate.y + "px";
		this.textContentNode.style.width = style.width = (gp.getWidth?gp.getWidth(runtime): gp.width) + "px";
		this.textContentNode.style.height = style.height = (gp.getHeight?gp.getHeight(runtime):gp.height) + "px";
		style.display = "";	
	},
	/*void*/hide:function(){
		var style = this.domNode.style;
		if(style.display == ""){
			var db = this._db,
			    text = this.textContentNode.value;
			db.setText(text);
			this.clearText();
		}
		style.display = "none";
		
	}
});