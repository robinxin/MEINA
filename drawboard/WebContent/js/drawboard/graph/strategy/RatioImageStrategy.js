dojo.provide("drawboard.graph.strategy.RatioImageStrategy");
dojo.require("drawboard.graph.strategy.RatioStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RatioImageStrategy",drawboard.graph.strategy.RatioStrategy,{
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/_getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime,/*Double*/w,/*Double*/h){
		var start = gp.getCoordinate(runtime),
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
	},
	
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	
	/**
	 * draw graph only
	 */
	/*Node*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gp.getGraphCoordinates(runtime);
		return gf.drawImage(gp.getCoordinate(runtime),gp.getWidth(runtime),gp.getHeight(runtime),gp.getUrl(),(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	}
});
})();