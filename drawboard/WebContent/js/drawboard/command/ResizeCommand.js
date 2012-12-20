dojo.provide("drawboard.command.ResizeCommand");
dojo.require("drawboard.command.Command");
//the positive and negative are sure.
dojo.declare("drawboard.command.ResizeCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().RESIZECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorate,start,end}
			runtime = this.getRuntime();
		executor.sizeChange(memo.decorate,memo.start,memo.end,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorate,start,end}
			runtime = this.getRuntime();
		executor.sizeChange(memo.decorate,memo.end,memo.start,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		if(memo.decorate != cmemo.decorate){
			return false;
		}
		memo.end = cmemo.end;
		return true;
	}
});