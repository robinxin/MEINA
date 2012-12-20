dojo.provide("window.Entrance");
dojo.require("common.calc.Geometry");
dojo.require("drawboard.DrawBoard");
dojo.require("drawboard.ZoomDrawBoard");
dojo.require("common.utils.BrowerUtils");
dojo.require("drawboard.graphic.SVGGraphic");
dojo.require("drawboard.graphic.CanvasGraphic");
(function(){
var geometry = common.calc.Geometry,
	rotate = geometry.rotation;
window.Entrance = {
	graphic:null,
	test:function(){
		var browerType = common.utils.BrowerUtils.getBrowerType(),
			version = browerType.ie,
			graphicClass = drawboard.graphic.SVGGraphic;
		if(version){
			version = version.substr(0,1);
			if(version == "8" || version == "7" || version == "6" || version == "5"){
				graphicClass = drawboard.graphic.SVGIEGraphic;
			}
		}
        this.graphic = new graphicClass();
		this.testGraphClassPanel();
		this.ready();
	},
	ready:function(){
	    if(this.db.ready()){
			this.db.draw();
		    return;
		}
		setTimeout(dojo.hitch(this,"ready"),300);
	},
	/**
	 * create drawboard
	 */
	/*DrawBoard*/createDrawboard:function(){
		var db = this.db,
			box = common.utils.BrowerUtils.getWindowBox(),div,
			fixNode = document.getElementById("graphNode");
		if(!db){
			div = dojo.create("div",{},dojo.byId("graphNode"));
			div.style.width = box.w - 191 + "px";
			div.style.height = box.h - 39 + "px";
			div.style.border = "1px solid black";
			this.db = new drawboard.DrawBoard({w:(box.w - 191),h:(box.h - 39),graphicClass:drawboard.graphic.SVGIEGraphic,_graphic:this.graphic,fixNode:fixNode},dojo.create("div",null,div));
		}
		return this.db;
	},

	/*DrawBoard*/getZoomWindow:function(){
		if(!this.zoomWindow){
			var box = common.utils.BrowerUtils.getWindowBox(),
				db = this.createDrawboard(),
				div = dojo.create("div",{},dojo.byId("graphNode"),"last");
			div.style.height = db.h*0.5 + 4 + "px";
			div.style.width = db.w*0.5 + 4 + "px";
			div.style.border = "1px solid black";
			div.style.position = "relative";
			this.zoomWindow = new drawboard.ZoomDrawBoard({drawboard:db,w:db.w*0.5,h:db.h*0.5},dojo.create("div",{},div));
		}
		return this.zoomWindow;
	},
	/**
	 * test graph panel
	 */
	/*void*/testGraphClassPanel:function(){		
		var box = common.utils.BrowerUtils.getWindowBox(),
			graphContainer,dbToolbar,db;
		dojo.byId("graphNode").style.width = (box.w - 192) + "px";
		dojo.byId("graphNode").style.height = (box.h - 30) + "px";
		graphContainer = new window.widget.GraphChooseContainer({width:"192px",height:(box.h - 30) + "px"},dojo.create("div",null,dojo.byId("toolsNode")));
		dbToolbar = new window.widget.Toolbar({},dojo.create("div",null,dojo.byId("navigator")));
		db = this.db = this.createDrawboard();
		graphContainer.setDrawboard(db);
		dbToolbar.drawboard = db;
	}
};
})();
