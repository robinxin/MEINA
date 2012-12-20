dojo.provide("drawboard.command.ZoomCommand");
dojo.require("drawboard.command.Command");
dojo.require("common.calc.Geometry");
//the positive and negative are sure.
dojo.declare("drawboard.command.ZoomCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().ZOOMCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//zoom rate
			runtime = this.getRuntime();
		executor.zoom(memo,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//zoom rate
			runtime = this.getRuntime();
		executor.zoom({x:-memo.x,y:-memo.y},runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		this.setMemo(common.calc.Geometry.add2Points(memo , cmemo));
		return true;
	}
});