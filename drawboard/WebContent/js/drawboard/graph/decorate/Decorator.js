dojo.provide("drawboard.graph.decorate.Decorator");
dojo.require("dijit._Widget");
dojo.declare("drawboard.graph.decorate.Decorator",dijit._Widget,{
	/*Constant*/_type:null,
	/*Array<DecorateCoordinateFormatter>*/coordinate:null,
	/*DecorateCoordinateFormatter*/center:null,
	/*Integer*/index:0,
	/*Integer*/getIndex:function(){
		return this.index;
	},
	/*void*/setIndex:function(/*Integer*/index){
		this.index = index;
	},
	/*Constant*/getType:function(){
		return this._type;
	},
	/**
	 * return the coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getCoordinate:function(){
		return this.coordinate;
	},
	/**
	 * set coordinate
	 * @param coordinate
	 */
	/*void*/setCoordinate:function(/*Array<DecorateCoordinateFormatter>*/coordinate){
		this.coordinate = coordinate;
	},
	/**
	 * return the center
	 */
	/*DecorateCoordinateFormatter*/getCenter:function(){
		return this.center;
	},
	/**
	 * set center
	 * @param coordinate
	 */
	/*void*/setCenter:function(/*DecorateCoordinateFormatter*/center){
		this.center = center;
	},
	/**
	 * draw the skeleton
	 */
	/*void*/draw:function(/*Graphic*/gp,/*String*/style,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * whether or not the two decorate are same
	 */
	/*boolean*/equal:function(/*Decorate*/d){
		if(d.getIndex() != this.getIndex()){
			return false;
		}
		var same = true,ps = this.getCoordinate();
		dojo.some(d.getCoordinate(),function(item,index){
			if(item != ps[index]){
				same = false;
				return true;
			}
		},this);
		return same;
	}
});
