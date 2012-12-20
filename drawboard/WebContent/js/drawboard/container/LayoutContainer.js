/*
 *this container control the layout of the graph
 *the graph layout is according to the index of graph in array
 */
dojo.provide("drawboard.container.LayoutContainer");
dojo.require("common.container.ListContainer");
dojo.require("dijit._Widget");
dojo.declare("drawboard.container.LayoutContainer",[dijit._Widget,common.container.ListContainer],{
	/**
	 * the graph layout will add
	 */
	/*void*/up:function(/*GraphProxy*/gs){
		var index = this.indexOf(gs);
		this.move(index,index + 1);
	},
	
	/**
	 * the graph layout will subtract 
	 */
	/*void*/down:function(/*GraphProxy*/gs){
		var index = this.indexOf(gs);
		this.move(index,index - 1);
	},
	
	/**
	 * the graph layout will be top now
	 */
	/*void*/top:function(/*GraphProxy*/gs){
		var index = this.indexOf(gs);
		this.move(index,this.size());
	},
	
	/**
	 * the graph layout will be bottom now
	 */
	/*void*/bottom:function(/*GraphProxy*/gs){
		var index = this.indexOf(gs);
		this.move(index,0);
	}
});