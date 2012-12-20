dojo.provide("drawboard.command.MoveCommand");
dojo.require("drawboard.command.Command");
//the positive and negative are sure.
dojo.declare("drawboard.command.MoveCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().MOVECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{start,end}
			runtime = this.getRuntime();
		executor.move(memo.start,memo.end,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{start,end}
			runtime = this.getRuntime();
		executor.move(memo.end,memo.start,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		memo.end = cmemo.end;
		return true;
	}
});