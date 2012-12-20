dojo.provide("drawboard.command.MotionCommand");
dojo.require("drawboard.command.Command");
//the positive and negative are sure.
dojo.declare("drawboard.command.MotionCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().MOTIONCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorator:motionAnchor,p:CoordinateFormatter,oldP:CoordinateFormatter}
			runtime = this.getRuntime(),
			ma = memo.decorator;
		(!memo.oldP) && (memo.oldP = ma.getCenter());
		executor.moveMotionAnchor(ma,memo.p,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorator:motionAnchor,p:CoordinateFormatter,oldP:CoordinateFormatter}
			runtime = this.getRuntime();
		executor.moveMotionAnchor(memo.decorator,memo.oldP,runtime);
		executor.normalize(memo.decorator,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			ma = memo.decorator,
			cmemo = command.getMemo(),
			cma = cmemo.decorator;
		if(ma.getIndex() == cma.getIndex()){
			memo.p = cmemo.p;
			return true;
		}
		return false;
	}
});