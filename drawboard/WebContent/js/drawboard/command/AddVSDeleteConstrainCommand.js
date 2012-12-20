dojo.provide("drawboard.command.AddVSDeleteConstrainCommand");
dojo.require("drawboard.command.Command");
//add and delete constrain operation is a part of other commmand in the composite command.Only when the mouse up call will add the constrain.
dojo.declare("drawboard.command.AddVSDeleteConstrainCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().ADDVSDELTECONSTRAINCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//relation controller
			memo = this.getMemo(),				//Array<{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}>
			runtime = this.getRuntime();
		dojo.forEach(memo,function(mark){
			executor.addListener(mark.gp,mark.d,mark.restrainedGp,mark.restrainedD,runtime);
		},this);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//relation controller
			memo = this.getMemo(),				//Array<{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}>
			runtime = this.getRuntime(),
			temps;
		dojo.forEach(memo,function(mark){
			temps = executor.getRestrainedCache(mark.restrainedGp,mark.restrainedD,runtime);
			//only when the negative is a execute function.
			if(temps && temps.length > 0){
				memo = [];
				this.setMemo(memo);
				dojo.forEach(temps,function(item){
					memo.push({gp:item.gp,d:item.decorate,restrainedGp:mark.restrainedGp,restrainedD:mark.restrainedD||item.restrainedD});
				},this);
			}
			executor.removeListener(mark.restrainedGp,mark.restrainedD,runtime);
		},this);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 * old command may be instead of new command;
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});