dojo.provide("drawboard.command.CombineVSDevidedCommand");
dojo.require("drawboard.command.Command");
//has problem
dojo.declare("drawboard.command.CombineVSDevidedCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().COMBINEVSDEVIDEDCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo();				//CompositGraphProxy
		executor.combineGraph(memo);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo();				//CompositGraphProxy
		executor.divideGraph(memo);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});