dojo.provide("drawboard.graph.strategy.RectangleStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RectangleStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//west north corner
					{command:p.MOVE,points:cache[0]},
					//east north corner
					{command:p.LINE,points:cache[1]},
					//east south corner
					{command:p.LINE,points:cache[2]},
					//west south corner
					{command:p.LINE,points:cache[3]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        //west north corner
		        {x:x,y:y},
		        //east north corner
		        {x:x + w,y:y},
		        //east south corner
		        {x:x + w,y:y + h},
		        //west south corner
		        {x:x,y:y + h}
		        ];
	}
});
})();