dojo.provide("myTests.testJs");
dojo.require("common.calc.Geometry");
dojo.require("drawboard.DrawBoard");
dojo.require("drawboard.ZoomDrawBoard");
dojo.require("common.utils.BrowerUtils");
dojo.require("drawboard.graphic.SVGGraphic");
dojo.require("drawboard.graphic.SVGIEGraphic");
//dojo.require("drawboard.graphic.VMLGraphic");
(function(){
var geometry = common.calc.Geometry,
	rotate = geometry.rotation;
myTests.testJs = {
	graphic:null,
	db:null,
	test:function(){
		dojo.require("window.widget.GraphChooseContainer");
		dojo.require("window.widget.Toolbar");
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
		var box = common.utils.BrowerUtils.getWindowBox(),
			graphContainer,dbToolbar,db;
		dojo.byId("graphNode").style.width = (box.w - 192) + "px";
		dojo.byId("graphNode").style.height = (box.h - 30) + "px";
		graphContainer = new window.widget.GraphChooseContainer({width:"192px",height:(box.h - 30) + "px"},dojo.create("div",null,dojo.byId("toolsNode")));
		dbToolbar = new window.widget.Toolbar({},dojo.create("div",null,dojo.byId("navigator")));
		db = this.db = this.createDrawboard();
		graphContainer.setDrawboard(db);
		dbToolbar.drawboard = db;
		this.ready();
	},
	ready:function(){
	    if(this.db.ready()){
			this.draw();
		    return;
		}
		setTimeout(dojo.hitch(this,"ready"),300);
	},
	draw:function(){
		//this.testGraphClassPanel();
		//this.getZoomWindow();
		//this.testDrawImage();
		//this.testDrawStrategyWithParams("drawboard.graph.strategy.TextStrategy",{"_text":"hellow"});
		//this.testDrawStrategy("drawboard.graph.strategy.BrokenLineStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.LineStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.CircleStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.OvalStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.electricity.AmplifierStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.electricity.ResistanceStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.electricity.TriphaseStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.electricity.VariableResistanceStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.MotionCircleStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.arrow.FFDoubleSideArrowStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.arrow.FFOneWayArrowStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.SquareStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.RectangleStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.RounderRectangleStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.polygon.PentagonStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.polygon.HexagonStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.polygon.OctagonStrategy");
		//this.testDrawStrategy("drawboard.graph.strategy.RightTriangleStrategy");
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

	/**
	 * test SquareStrategy
	 */
	/*void*/testDrawStrategyWithParams:function(strategy,attrMaps){
		dojo.require(strategy);
		var db = this.createDrawboard(),
			gs,params = {_coordinate:{x:445,y:185},_w:100,_h:100};
		for(var attr in attrMaps){
			params[attr] = attrMaps[attr];
		}
		gs = new drawboard.graph.GraphStatus(params);
		db.addGraph(gs,strategy);
		db.draw();
	},

	/**
	 * test SquareStrategy
	 */
	/*void*/testDrawStrategy:function(strategy){
		dojo.require(strategy);
		var db = this.createDrawboard(),
			gs;
		gs = new drawboard.graph.GraphStatus({_coordinate:{x:445,y:185},_w:100,_h:100});
		db.addGraph(gs,strategy);
		db.draw();
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
		dojo.require("window.widget.GraphChooseContainer");
		dojo.require("window.widget.Toolbar");
		
		var box = common.utils.BrowerUtils.getWindowBox(),
			db = this.createDrawboard();
		
		dojo.byId("graphNode").style.width = (box.w - 192) + "px";
		dojo.byId("graphNode").style.height = (box.h - 30) + "px";
		new window.widget.GraphChooseContainer({width:"192px",height:(box.h - 30) + "px",drawboard:db},dojo.create("div",null,dojo.byId("toolsNode")));
		new window.widget.Toolbar({drawboard:db},dojo.create("div",null,dojo.byId("navigator")));
		
		/**
		dojo.require("dijit.layout.BorderContainer");
		dojo.require("dojox.layout.ExpandoPane");
		dojo.require("dijit.layout.ContentPane");
		var div = dojo.create("div",null,document.body),
			style = 'height:' + box.h + 'px;width:' + box.w + 'px;border:1px solid black',
			border = new dijit.layout.BorderContainer({style:style},div),
			expandoLeft = new dojox.layout.ExpandoPane({
				splitter:true,
				startExpanded:false,
				region:"left",
				maxWidth:190,
				style:"background:yellow;width:190px;"
			}),
			expandoRight = new dojox.layout.ExpandoPane({
				splitter:true,
				startExpanded:false,
				region:"right",
				maxWidth:170,
				style:"background:yellow;width:170px;"
			}),
			content = new dijit.layout.ContentPane({
				 region:"center",
				 startExpanded:false
			}),
			top = new dijit.layout.ContentPane({
				splitter:false,
				region:"top",
				maxHeight:30,
				style:"background:red;height:30px;"
			});
		expandoLeft.addChild(new window.widget.GraphChooseContainer({width:"190px",height:(box.h - 30) + "px",drawboard:db}));
		content.content = db;
		top.content = new window.widget.Toolbar({drawboard:db});
		border.addChild(expandoLeft);
		border.addChild(content);
		border.addChild(top);
		border.addChild(expandoRight);
		border.startup();*/
	},
	testDrawImage:function(){
		dojo.require("drawboard.DrawBoard");
		dojo.require("drawboard.graph.strategy.ImageStrategy");
		dojo.require("drawboard.graph.GraphStatus");
		var db = this.createDrawboard(),
			gs = new drawboard.graph.GraphStatus({_coordinate:{x:200,y:200},_w:100,_h:100,_url:"images/keyenter.png"});
		db.addGraph(gs,"drawboard.graph.strategy.ImageStrategy");
		db.draw();
	},
	buildStr:function(/*Array*/mat){
		var r = [];
		for(var i = 0;i < 2;i++){
			for(var j = 0;j < 3;j++){
				r.push(mat[j][i]);
			}
		}
		return r.join(",");
	},
	testMatrix:function(){
		var g = this.graphic;
		dojo.byId("graphNode").appendChild(g.createAnchor(1024,768));
		var a = -45,
			cos = Math.cos,
			sin = Math.sin,
//			transform = math.matMatMult([[1,0,100],[0,1,100],[0,0,1]],[[cos(a), -sin(a),0],[sin(a),cos(a),0],[0,0,1]]),
//			transform = math.matMatMult(transform,[[1,0,-100],[0,1,-100],[0,0,1]]),
			transform = [cos(a), sin(a), -sin(a), cos(a), 200, 200],
			c;
		console.info(this.buildStr(transform));
//			transform = [cos(a), sin(a), -sin(a), cos(a), 200, 200],count = 6;
		g.drawImage(null,100,100,"images/keyenter.png",{transform:"matrix(" + transform + ")"});
//		for(var i = 0;i < count;i++){
//			a = i * 45;
//			transform = [cos(a), sin(a), -sin(a), cos(a), 200, 200];
//			g.drawImage(null,100,100,"images/keyenter.png",{transform:"matrix(" + transform.join(",") + ")"});
//		}
		g.drawImage({x:200,y:200},100,100,"images/keyenter.png");
	},

	testCross:function(){
		var g = this.graphic,
			a = {x:200,y:400},
			b = {x:450,y:400},
			c = {x:500,y:300};
		dojo.byId("graphNode").appendChild(g.createAnchor(800,500));
		g.drawLine(a,b,'fill:none;stroke:red;stroke-width:1');
		g.drawCircle(c,5,'fill:none;stroke:blue;stroke-width:1');
		console.info(geometry.vdistP2Lin(a,b,c));
	},
	testAngleInThreePoints:function(){
		var g = this.graphic,
			a = {x:100,y:200},
			c = {x:200,y:500},
			b = {x:400,y:100};
		dojo.byId("graphNode").appendChild(g.createAnchor(800,500));
		g.drawLine(a,b,'fill:none;stroke:red;stroke-width:1');
		g.drawLine(c,b,'fill:none;stroke:blue;stroke-width:1');
		console.info(geometry.angle(a,b,c));
	},
	testSkeletonARotator:function(){
		dojo.require("drawboard.graph.decorate.Skeleton");
		dojo.require("drawboard.graph.decorate.Rotator");
		var g = this.graphic,
			rotator = new drawboard.graph.decorate.Rotator({pole:{x:150,y:150},angle:45});
			s = new drawboard.graph.decorate.Skeleton({coordinate:{x:100,y:100},rotator:rotator});
		dojo.byId("graphNode").appendChild(g.createAnchor(800,500));
		s.draw(g,"fill:none;stroke:red;stroke-width:1");
		rotator.draw(g,"fill:none;stroke:red;stroke-width:1");
	},
	testRotatorHandler:function(){
		var g = this.graphic;
		dojo.byId("graphNode").appendChild(g.createAnchor(800,500));
		var move = function(c,x,y,pole,angle){
				if(angle !== undefined){
					var r = rotate({x:x,y:y},pole,angle);
					x = r.x;
					y = r.y;
				}
				return c + x + " " + y;
			},
			angle,
			count = 7,r = 10,pole = {x:500,y:295},distance = 80;
		path = ["","","","","",""];
		for(var i = count;i >= 0;i--){
			angle = 45 * i;
			console.info(angle);
			path[0] = ["M",pole.x," ",pole.y + r].join("");
			path[1] = ["a",r," ",r," 0 1,1 1 0"].join("");
			path[2] = move("M",pole.x,pole.y - r,pole,angle);
			path[3] = move("L",pole.x,pole.y - distance,pole,angle);
			path[4] = move("M",pole.x,pole.y - distance,pole,angle);
			path[5] = ["a",r," ",r," 0 1,", (angle >= 315 || angle <= 45)?"1":"0" ," 1 0"].join("");
			g.drawPath(path,"fill:none;stroke:red;stroke-width:1");
		}
	},
	testRotateCircle:function(){
		var g = this.graphic;
		dojo.byId("graphNode").appendChild(g.createAnchor(800,800));
		//circle center
		g.drawCircle({x:100,y:100},5,'fill:none;stroke:red;stroke-width:1');
		//circle
		g.drawCircle({x:100,y:100},50,'fill:none;stroke:red;stroke-width:1');
		var p = {x:50,y:100},count = 8;
		for(var i = count;i >0;i--){
			g.drawCircle(p,5,'fill:none;stroke:red;stroke-width:1');
			p = rotate(p,{x:100,y:100},45);
		}
		//draw rectangle
		var rects = [{command:"M",points:{x:20,y:70}},{command:"L",points:{x:80,y:70}},{command:"L",points:{x:80,y:130}},{command:"L",points:{x:20,y:130}}];
		for(var i = count;i >0;i--){
			g.drawPath(rects,'fill:none;stroke:red;stroke-width:1');
			dojo.forEach(rects,function(point,index){
				rects[index].points = rotate(point.points,{x:100,y:100},45);
			},this);
		}
	},
	testRoateSelf:function(){
		var g = this.graphic;
		dojo.byId("graphNode").appendChild(g.createAnchor(800,200));
		var p = {x:50,y:100},count = 2;
		g.drawCircle(p,5,'fill:none;stroke:red;stroke-width:1');
		//draw rectangle
		var rects = [{command:"M",points:{x:20,y:70}},{command:"L",points:{x:80,y:70}},{command:"L",points:{x:80,y:130}},{command:"L",points:{x:20,y:130}}];
		for(var i = count;i >0;i--){
			g.drawPath(rects,'fill:none;stroke:red;stroke-width:1');
			dojo.forEach(rects,function(point,index){
				rects[index].points = rotate(point.points,{x:50,y:100},45);
			},this);
		}
		for(var i = count;i >0;i--){
			g.drawPath(rects,'fill:none;stroke:red;stroke-width:1');
			dojo.forEach(rects,function(point,index){
				rects[index].points = rotate(point.points,{x:50,y:100},-45);
			},this);
		}
	}
};
})();
