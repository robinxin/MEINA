dojo.provide("drawboard.controller.ParamsController");
(function(){
dojo.declare("drawboard.controller.ParamsController",null,{
	/*Double*/_distance:5,			//controllable nodes' radius of rectangle and circle
	/*Double*/rotate_distance:20,
	/*Double*/rounder:10,
	/*Double*/getDistance:function(){
		return this._distance;
	},
	/*void*/setDistance:function(/*Double*/distance){
		this._distance = distance;
	},
	/*Double*/getRotateDistance:function(){
		return this.rotate_distance;
	},
	/*void*/setRotateDistance:function(/*Double*/rotateDistance){
		this.rotate_distance = rotateDistance;
	},
	/*void*/getRounder:function(){
		return this.rounder;
	}
});
})();