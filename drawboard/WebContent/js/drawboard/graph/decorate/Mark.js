dojo.provide("drawboard.graph.decorate.Mark");
dojo.require("drawboard.controller.StyleController");
dojo.require("drawboard.Constant");
dojo.require("drawboard.graph.decorate.Decorator");

(function(){
var constant = drawboard.Constant;
dojo.declare("drawboard.graph.decorate.Mark",drawboard.graph.decorate.Decorator,{
	/*Constant*/_type:constant.Decorate.MARK,
	/**
	 * draw the skeleton
	 */
	/*void*/draw:function(/*Graphic*/gp,/*String*/style,/*ExecuteRuntime*/runtime){
		var p = this.getCoordinate(),
			path = constant.Path,
			paths = [
			        {command:path.MOVE,points:p[0]},
			        {command:path.LINE,points:p[1]},
			        {command:path.MOVE,points:p[2]},
			        {command:path.LINE,points:p[3]},
			        ];
		gp.drawPath(paths,style,true);
	}
});
})();