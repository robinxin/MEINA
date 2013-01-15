dojo.provide("drawboard.graph.strategy.TextStrategy");
dojo.require("drawboard.graph.strategy.RectangleStrategy");
(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.TextStrategy",drawboard.graph.strategy.RectangleStrategy,{
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
		return gf.drawText(gp.getCoordinate(runtime),gp.getWidth(runtime),gp.getHeight(runtime),gp.getText(),(a != 0)&&{transform:transform},this.getTextStyle(gp,runtime));
	},
	/*String*/getTextStyle:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return this.getStyleController(runtime).getTextStyle(gp);
	}
});
})();