dojo.provide("drawboard.graph.strategy.RounderSquareStrategy");
dojo.require("drawboard.graph.strategy.SquareStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RounderSquareStrategy",drawboard.graph.strategy.SquareStrategy,{
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			r = runtime.getRounder(),
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gp.getGraphCoordinates(runtime);
		gf.drawRect(gp.getCoordinate(runtime),min,min,r,(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	}
});
})();