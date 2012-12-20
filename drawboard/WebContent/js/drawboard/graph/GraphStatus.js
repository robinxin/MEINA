dojo.provide("drawboard.graph.GraphStatus");
dojo.require("common.Identity");
dojo.require("common.calc.Geometry");
dojo.require("dijit._Widget");
dojo.require("common.exception.Exception");
/*
 *	CoordinateFormatter:{
 *		x:double,
 *		y:double
 *	} 
 *  	
 * 	RotatorFormatter:{
 * 		coordinate:CoordinateFormatter,		//coordinate the rotate angle relative to,current version delete this attribute
 * 		angle:double						//rotate angle
 *  }
 * */
(function(){
var geometry = common.calc.Geometry,
	multi = geometry.multiPoint,
	divide = geometry.dividePoint;
dojo.declare("drawboard.graph.GraphStatus",[dijit._Widget,common.Identity],{
	/*CoordinateFormatter*/_coordinate:null,				//graph start coordinate
	/*Double*/_w:null,										//graph's width
	/*Double*/_h:null,										//graph's height
	/*RotatorFormatter*/_rotator:null,						//graph rotator information
	/*Array<Object>*/_motionAnchors:null,					//graph motion nodes via the formula parameters in the graph strategy
	/*boolean*/affectedByZoom:false,						//for motion anchors
	/*Array<CoordinateFormatter>*/_marks:null,				//graph relation nodes
	/*String*/_url:null,									//usable for image
	/*Double*/_ratio:null,									//will be used for the ratio strategy,the value is width/height
	/*String*/_text:null,
	
	/*void*/setRatio:function(/*Double*/ratio){
		return this._ratio = ratio;
	},
	/*Double*/getRatio:function(){
		return this._ratio;
	},
	/*boolean*/isAffectedByZoom:function(/*boolean*/affectedByZoom){
		(affectedByZoom !== undefined) && (this.affectedByZoom = affectedByZoom);
		return this.affectedByZoom;
	},
	/**
	 * set the start coordinate
	 */
	/*void*/setCoordinate:function(/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		this._coordinate =divide(coordinate,this.getZoom(runtime))[0];
	},
	
	/**
	 * get the start coordinate
	 */
	/*CoordinateFormatter*/getCoordinate:function(/*ExecuteRuntime*/runtime){
		return multi(this._coordinate,this.getZoom(runtime))[0];
	},
	/*{x:Double,y:Double}*/getZoom:function(/*ExecuteRuntime*/runtime){
		return runtime.getContext().getZoom();
	},
	/**
	 * set the graph's width
	 */
	/*void*/setWidth:function(/*Double*/w,/*ExecuteRuntime*/runtime){
		this._w = w/this.getZoom(runtime).x;
	},
	
	/**
	 * get the graph's width
	 */
	/*Double*/getWidth:function(/*ExecuteRuntime*/runtime){
		return this._w*this.getZoom(runtime).x;
	},
	
	/**
	 * set the graph's height
	 */
	/*void*/setHeight:function(/*Double*/h,/*ExecuteRuntime*/runtime){
		this._h =  h/this.getZoom(runtime).y;
	},
	
	/**
	 * get the graph's height
	 */
	/*Double*/getHeight:function(/*ExecuteRuntime*/runtime){
		return this._h*this.getZoom(runtime).y;
	},
	
	/**
	 * whether exist the rotator use set 
	 */
	/*boolean*/hasRotator:function(){
		if(this._rotator){
			return true;
		}
		return false;
	},
	/**
	 * set the graph's rotate information
	 */
	/*void*/setRotator:function(/*RotatorFormatter*/rotator){
		this._rotator = rotator;
	},
	
	/**
	 * set the text
	 */
	/*void*/setText:function(/*String*/text){
		this._text = text;
	},
	
	/**
	 * get the text
	 */
	/*String*/getText:function(){
		return this._text;
	},

	/**
	 * get the graph's rotate information
	 */
	/*RotatorFormatter*/getRotator:function(){
		return this._rotator;
	},
	/*double*/getRotateAngle:function(){
		var rotator = this.getRotator();
		if(rotator){
			return rotator.angle;
		}
		return 0;
	},
	/**
	 * set the graph's marks
	 */
	/*void*/setMarks:function(/*Array<CoordinateFormatter>*/marks,/*ExecuteRuntime*/runtime){
		this._marks = divide(marks,this.getZoom(runtime));
	},
	
	/**
	 * get the graph's marks
	 */
	/*Array<CoordinateFormatter>*/getMarks:function(/*ExecuteRuntime*/runtime){
		return this._marks && multi(this._marks,this.getZoom(runtime));
	},
	
	/**
	 * set the graph's motion anchor via the formula parameters
	 */
	/*void*/setMotionAnchors:function(/*Array<Object>*/motionFormula,/*ExecuteRuntime*/runtime){
		this.isAffectedByZoom() && (motionFormula = divide(motionFormula,this.getZoom(runtime)));
		this._motionAnchors = motionFormula;
	},
	/**
	 * get the graph's formula parameters of motion anchor
	 */
	/*Array<Object>*/getMotionAnchors:function(/*ExecuteRuntime*/runtime){
		var motionAnchors = this._motionAnchors;
		this.isAffectedByZoom() && (motionAnchors = multi(motionAnchors,this.getZoom(runtime)));
		return motionAnchors;
	},
	
	/**
	 * get resource url
	 */
	/*String*/getUrl:function(){
		return this._url;
	},
	
	/**
	 * set resource url
	 */
	/*void*/setUrl:function(/*String*/url){
		this._url = url;
	}
});
})();