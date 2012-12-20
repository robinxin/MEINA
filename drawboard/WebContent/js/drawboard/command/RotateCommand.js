dojo.provide("drawboard.command.RotateCommand");
dojo.require("drawboard.command.Command");
//the positive and negative are sure.
dojo.declare("drawboard.command.RotateCommand",drawboard.command.Command,{
	/*Double*/_oriAngle:null,
	/*String*/getType:function(){
		return this.getConstant().ROTATECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = dojo.clone(this.getMemo()),	//rotator
			runtime = this.getRuntime();
		if(this._oriAngle === null){
			this._oriAngle = executor.getRotator(runtime).angle;
		}
		executor.setRotator(memo,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = dojo.clone(this.getMemo()),	//rotator
			runtime = this.getRuntime();
		memo.angle = this._oriAngle;
		executor.setRotator(memo,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		memo.angle = cmemo.angle;
		return true;
	}
});