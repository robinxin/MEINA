dojo.provide("drawboard.graph.decorate.Skeleton");
dojo.require("drawboard.Constant");
dojo.require("drawboard.graph.decorate.Decorator");
dojo.require("drawboard.graph.strategy.RectangleStrategy");
(function(){
var constant = drawboard.Constant;
dojo.declare("drawboard.graph.decorate.Skeleton",drawboard.graph.decorate.Decorator,{
	/*Constant*/_type:constant.Decorate.SKELETON,
	/*Constant*/_direct:null,						//skeleton direction
	/*boolean*/_isAnchored:false,					//if it is anchor,can be relative to mark anchor
	/*void*/anchored:function(/*boolean*/anchor){
		this._isAnchored = anchor;
	},
	/*boolean*/isAnchored:function(){
		return this._isAnchored;
	},
	/**
	 * get the direction of graph
	 */
	/*Constant*/getDirect:function(){
		var direct = this._direct,t;
		if(typeof direct == "number"){return direct;}
		if(direct !== null && direct !== undefined){
			var d = constant.Direction;
			switch(direct){
				case "mover_n":
					t = d.NORTH;
					break;
				case "mover_s":
					t = d.SOUTH;
					break;
				case "mover_w":
					t = d.WEST;
					break;
				case "mover_e":
					t = d.EAST;
					break;
				case "mover_nw":
					t = d.WESTNORTH;
					break;
				case "mover_ne":
					t = d.EASTNORTH;
					break;
				case "mover_sw":
					t = d.WESTSOUTH;
					break;
				case "mover_se":
					t = d.EASTSOUTH;
					break;
				default:
					t = d.NORTH;
					break;
			}
			this._direct = t;
		}
		return t;
	},
	/**
	 * draw the skeleton
	 */
	/*void*/draw:function(/*Graphic*/gp,/*String*/style,/*ExecuteRuntime*/runtime){
		var p = this.getCoordinate(),
			path = constant.Path;
			paths = [
			        {command:path.MOVE,points:p[0]},
			        {command:path.LINE,points:p[1]},
			        {command:path.LINE,points:p[2]},
			        {command:path.LINE,points:p[3]},
					{command:path.LINE,points:p[0]}
			        ];
		gp.drawPath(paths,style);
	}
});
})();