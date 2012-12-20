dojo.provide("drawboard.graph.strategy.electricity.AmplifierStrategy");
dojo.require("drawboard.graph.strategy.GraphStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.electricity.AmplifierStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var ps = gp.getGraphCoordinates(runtime);
		if(geometry.isPointInSegment(ps[0],ps[1],point) 
			|| geometry.isPointInPolyn([ps[2],ps[3],ps[4]],point)
			|| geometry.isPointInSegment(ps[3],ps[5],point)){
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
					{command:p.LINE,points:cache[1]},
					//triangle
					{command:p.MOVE,points:cache[4]},
					{command:p.LINE,points:cache[3]},
					{command:p.LINE,points:cache[2]},
					{command:p.LINE,points:cache[4]},
					//east
					{command:p.LINE,points:cache[5]},
					//+
					{command:p.MOVE,points:cache[6]},
					{command:p.LINE,points:cache[7]},
					{command:p.MOVE,points:cache[8]},
					{command:p.LINE,points:cache[9]},
					//-
					{command:p.MOVE,points:cache[10]},
					{command:p.LINE,points:cache[11]}
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
			unit = w>>4,
			d = runtime.getDistance();
		return [
		        //west start
		        {x:x,y:y + (h>>1)},
				//west end
				{x:x + unit,y:y + (h>>1)},
		        //in the northern of western triangle 
		        {x:x + unit,y:y},
		        //in the southern of western triangle 
		        {x:x + unit,y:y + h},
		        //eastern triagnle
		        {x:x + w - unit,y:y + (h>>1)},
				//east end
				{x:x + w,y:y + (h>>1)},
				//+
				{x:x + unit,y:y + (h>>1) - d},
				{x:x + unit + d,y:y + (h>>1) - d},
				{x:x + unit + (d>>1),y:y + (h>>1) - d - (d>>1)},
				{x:x + unit + (d>>1),y:y + (h>>1) - (d>>1)},
				//-
				{x:x + unit,y:y + (h>>1) + d},
				{x:x + unit + d,y:y + (h>>1) + d}
		        ];
	}
});
})();