dojo.provide("drawboard.graph.decorate.MotionAnchor");
dojo.require("drawboard.graph.decorate.Decorator");
dojo.require("drawboard.Constant");
(function(){
var	constant = drawboard.Constant;
dojo.declare("drawboard.graph.decorate.MotionAnchor",drawboard.graph.decorate.Decorator,{
	/*Constant*/_type:constant.Decorate.MOTIONANCHOR,
	/**
	 * draw the skeleton
	 */
	/*void*/draw:function(/*Graphic*/gp,/*String*/style,/*ExecuteRuntime*/runtime){
		var p = this.getCoordinate(),
			path = constant.Path,
			paths = [
			        {command:path.MOVE,points:p[0]},
			        {command:path.LINE,points:p[1]},
			        {command:path.LINE,points:p[2]},
			        {command:path.LINE,points:p[3]}
			        ];
		gp.drawPath(paths,style);
	}
});
})();