dojo.provide("drawboard.graph.strategy.electricity.CapacitanceStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.electricity.CapacitanceStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var ps = gp.getGraphCoordinates(runtime);
		if(geometry.isPointInSegment(ps[0],ps[1],point) 
			|| geometry.isPointInSegment(ps[2],ps[3],point)
			|| geometry.isPointInSegment(ps[4],ps[5],point)
			|| geometry.isPointInSegment(ps[6],ps[7],point)){
			return true;
		}
		return false;
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//west
					{command:p.MOVE,points:cache[0]},
					//in the middle of the western part
					{command:p.LINE,points:cache[1]},
					//in the north of the western part
					{command:p.MOVE,points:cache[2]},
					//in the south of the western part
					{command:p.LINE,points:cache[3]},
					//in the north of the eastern part
					{command:p.MOVE,points:cache[4]},
					//in the south of the eastern part
					{command:p.LINE,points:cache[5]},
					//in the middle of the eastern part
					{command:p.MOVE,points:cache[6]},
					//east
					{command:p.LINE,points:cache[7]}
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
			y = start.y,
			unit = w/5;
		return [
		        //west
		        {x:x,y:y + (h>>1)},
				//in the middle of the western part
				{x:x + (unit<<1),y:y + (h>>1)},
		        //in the north of the western part
		        {x:x + (unit<<1),y:y},
		        //in the south of the western part
		        {x:x + (unit<<1),y:y + h},
		        //in the north of the eastern part
		        {x:x + unit*3,y:y},
				//in the south of the eastern part
				{x:x + unit*3,y:y + h},
				//in the middle of the eastern part
				{x:x + unit*3,y:y + (h>>1)},
				//east
				{x:x + w,y:y + (h>>1)}
		        ];
	}
});
})();