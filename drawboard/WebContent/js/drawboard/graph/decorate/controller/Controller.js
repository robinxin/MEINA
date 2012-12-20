//current we only use the get type function
dojo.provide("drawboard.graph.decorate.controller.Controller");
dojo.require("drawboard.controller.StyleController");
dojo.declare("drawboard.graph.decorate.controller.Controller",null,{
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		//override by subclass.
	},
	
	/**
	 * if point is in the decorate,then return decorate,otherwise return null
	 */
	/*Mark*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		//override by subclass.
	},
	
	/**
	 * create decorate by coordinates
	 */
	/*Array<Decorate>*/create:function(/*Array<Array<CoordinateFormatter>>*/ps){
		return null;
	},
	
	/**
	 * get style
	 */
	/*String*/getStyle:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*ExecuteRuntime*/runtime){
		return runtime.getContext().getStyleCtrl().getStyle(this.type,gp,decorate);
	}
});