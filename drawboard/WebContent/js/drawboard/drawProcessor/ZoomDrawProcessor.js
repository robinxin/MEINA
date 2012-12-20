dojo.provide("drawboard.drawProcessor.ZoomDrawProcessor");
dojo.require("drawboard.drawProcessor.DrawProcessor");
dojo.require("drawboard.Constant");
(function(){
dojo.declare("drawboard.drawProcessor.ZoomDrawProcessor",drawboard.drawProcessor.DrawProcessor,{
	/**
	 * draw a graph
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExcuteRuntime*/runtime){
		gp.draw(runtime);
	}
});
})();
