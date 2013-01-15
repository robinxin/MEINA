dojo.provide("drawboard.graph.strategy.electricity.TriphaseStrategy");
dojo.require("drawboard.graph.strategy.SquareStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.electricity.TriphaseStrategy",drawboard.graph.strategy.SquareStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var ps = gp.getGraphCoordinates(runtime),
			w = gp.getWidth(runtime),
			r = w>>2;
		if(geometry.isPointInCircle(point,{coordinate:ps[0],r:r}) 
			|| geometry.isPointInCircle(point,{coordinate:ps[1],r:r}) 
			|| geometry.isPointInCircle(point,{coordinate:ps[2],r:r})){
			return true;
		}
		return false;
	},
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime),
			style = this.getStyle(gp,runtime),
			w = gp.getWidth(runtime),
			r = w>>2, l = [];
		l.push(gf.drawCircle(cache[0],r,style));
		l.push(gf.drawCircle(cache[1],r,style));
		l.push(gf.drawCircle(cache[2],r,style));
		return l;
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
			u = w/3;
		return [
					//first circle center
					{x:x + u,y:y + u},
					//second circle center
					{x:x + (u<<1),y:y + (h>>1)},
					//third circle center
					{x:x + u,y:y + h - u}
		        ];
	}
});
})();