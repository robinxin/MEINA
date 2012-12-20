dojo.provide("drawboard.graph.strategy.GraphStrategyFactory");
dojo.require("common.container.MapContainer");
(function(){
dojo.declare("drawboard.graph.strategy.GraphStrategyFactory",common.container.MapContainer,{
	/*GraphStrategy*/getGraphStrategy:function(/*String*/graphStrategyClass){
		if(!this.contains(graphStrategyClass)){
			var instance = eval("new " + graphStrategyClass + "()");
			this.addItem(graphStrategyClass,instance);
		}
		return this.getItem(graphStrategyClass);
	}
});
if(!drawboard.GraphStrategyFactory){
	drawboard.GraphStrategyFactory = new drawboard.graph.strategy.GraphStrategyFactory();
}
})();