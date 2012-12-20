dojo.provide("drawboard.command.StyleCommand");
dojo.require("drawboard.command.Command");
//the positive and negative are sure.
dojo.declare("drawboard.command.StyleCommand",drawboard.command.Command,{
	/*String*/_style:null,
	/*String*/getType:function(){
		return this.getConstant().STYLECOMMAND;
	},
	/*Json*/getStyle:function(){
		var style = this._style;
		if(!style){
			this._style = style = {};
		}
		return style;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//style controller
			memo = this.getMemo();				//{gp:graph proxy,attr:style attribute,value:style value,isText:boolean}
		if(!this._style && executor.containGraphStyle(memo.gp)){
			this._style = executor.getGraphStyleValue(memo.gp,memo.attr);
		}
		executor.addGraphStyle(memo.gp,memo.attr,memo.value,memo.isText);
		if(memo.gp.isComposite()){
			var style = this.getStyle();
			memo.gp.forInItems(function(/*GraphItemFormatter*/item){
				if(executor.containGraphStyle(item.gp)){
					style[item.gp.getIdty()] = executor.getGraphStyleValue(item.gp,memo.attr);
				}
				executor.addGraphStyle(item.gp,memo.attr,memo.value,memo.isText);
			},this);
		}
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//style controller
			memo = this.getMemo();				//{gp:graph proxy,attr:style value:attribute,style value,isText:boolean}
		if(memo.gp.isComposite()){
			var style = this.getStyle(),value;
			memo.gp.forInItems(function(/*GraphItemFormatter*/item){
				value = style[item.gp.getIdty()];
				if(value){
					executor.addGraphStyle(item.gp,memo.attr,value,memo.isText);
					return;
				}
				executor.removeGraphStyle(item.gp,memo.attr);
			},this);
			return;
		}
		if(this._style){
			executor.addGraphStyle(memo.gp,memo.attr,this._style,memo.isText);
			return;
		}
		executor.removeGraphStyle(memo.gp,memo.attr);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});