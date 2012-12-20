/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

if(!dojo._hasResource["drawboard.board.TextBoard"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.board.TextBoard"] = true;
dojo.provide("drawboard.board.TextBoard");


dojo.declare("drawboard.board.TextBoard",[dijit._Widget,dijit._Templated],{
	/*String*/templateString:"<div style='position:absolute;display:none;'><textarea dojoAttachPoint='textContentNode'></textarea></div>",
	/*DrawBoard*/_db:null,
	/*void*/postCreate:function(){
		this.inherited(arguments);
	},
	/*void*/setText:function(/*String*/text){
		this.textContentNode.value = text;
	},
	/*void*/clearText:function(){
		this.textContentNode.value = "";
	},
	/*void*/show:function(/*GraphProxy|{}*/gp){
		var style = this.domNode.style,
			runtime = this._db.getRuntime(),
			coordinate = gp.getCoordinate?gp.getCoordinate(runtime):{x:gp.x,y:gp.y};
		style.left = coordinate.x + "px";
		style.top = coordinate.y + "px";
		this.textContentNode.style.width = style.width = (gp.getWidth?gp.getWidth(runtime): gp.width) + "px";
		this.textContentNode.style.height = style.height = (gp.getHeight?gp.getHeight(runtime):gp.height) + "px";
		style.display = "";	
	},
	/*void*/hide:function(){
		var style = this.domNode.style;
		if(style.display == ""){
			var db = this._db,
			    text = this.textContentNode.value;
			db.setText(text);
			this.clearText();
		}
		style.display = "none";
		
	}
});

}

if(!dojo._hasResource["drawboard.graphic.Graphic"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graphic.Graphic"] = true;
//interface of the graphic to draw kinds of graphs.
dojo.provide("drawboard.graphic.Graphic");
dojo.declare("drawboard.graphic.Graphic",null,{
	/*Node*/createAnchor:function(/*Double*/w,/*Double*/h,/*Node*/parent){},
	/*boolean*/ready:function(){return true},
	/*Node|void*/setStyle:function(/*String*/style){},
	/*Node|void*/drawLine:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/style){},
	/*Node|void*/drawRect:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/style){},
	/*Node|void*/drawCircle:function(/*CoordinateFormatter*/coordinate,/*Double*/r,/*String*/style){},
	/*Node|void*/drawEllipse:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Map*/attrs,/*String*/style){},
	/*Node|void*/drawPath:function(/*Array<{command:"",points:[CoordinateFormatter]|CoordinateFormatter}>*/coordinates,/*String*/style){},
	/*Node|void*/drawImage:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/url,/*Map*/attrs,/*String*/style){},
	/*Node|void*/drawText:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/textConent,/*Map*/attrs){},
	/*void*/setSize:function(/*Double*/w,/*Double*/h){},
	/*void*/clear:function(){}
});

}

if(!dojo._hasResource["drawboard.graphic.SVGGraphic"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graphic.SVGGraphic"] = true;
/**
 * draw kinds of graphs by SVG
 * style formatter : fill:none;stroke:(color);stroke-width:(double)
 */
dojo.provide("drawboard.graphic.SVGGraphic");


(function(){
var svgNS = "http://www.w3.org/2000/svg",
	xlinkNS="http://www.w3.org/1999/xlink",
	attr = dojo.attr,
	pathName = window.location.pathname,
	rootName = pathName.substring(0, pathName.indexOf("/",1) + 1),
	/*void*/attrNS = function(/*Node*/node,/*String*/ns,/*String*/attribute,/*String*/value){
		node.setAttributeNS?node.setAttributeNS(ns,attribute,value):node.setAttribute(attribute,value);
	},
	/*Node*/createNS = function(/*String*/ele){
		return document.createElementNS?document.createElementNS(svgNS,ele):document.createElement(ele);
	},
	utils = common.utils.BrowerUtils;
dojo.declare("drawboard.graphic.SVGGraphic",drawboard.graphic.Graphic,{
	/*Node*/anchor:null,
	/*Node*/createAnchor:function(/*Double*/w,/*Double*/h,/*Node*/parent){
		var node = createNS("svg"); 
		w && attr(node,"width", w);
		h && attr(node,"height",h);
		this.anchor = node;
		parent && (parent.appendChild(node));
		return node;
	},
	/*void*/setSize:function(/*Double*/w,/*Double*/h){
		var node = this.anchor;
		w && attr(node,"width", w);
		h && attr(node,"height",h);
	},
	/*Node|void*/drawPath:function(/*Array<{command:"",points:[CoordinateFormatter]|String}>*/coordinates,/*String*/style,/*boolean*/open){
		var path = createNS("path"),d = [],ps;
		dojo.forEach(coordinates,function(item){
			if(!item){return;}
			if(typeof item == "string"){
				this.push(item);
			}else{
				this.push(item.command);
				ps = item.points;
				(!dojo.isArray(ps)) && (ps = [ps]);
				dojo.forEach(ps,function(p){
					this.push((p.x?(p.y?p.x + "," + p.y:p.x):p.y) + " ");
				},this);
			}
		},d);
		!open && d.push("Z");
		attr(path,"d",d.join(""));
		style && attr(path,"style",style);
		this.anchor.appendChild(path);
		return path;
	},
	/*Node|void*/drawCircle:function(/*CoordinateFormatter*/coordinate,/*Double*/r,/*String*/style){
		var circle = createNS("circle");
		attr(circle,"cx",coordinate.x);
		attr(circle,"cy",coordinate.y);
		attr(circle,"r",r);
		style && attr(circle,"style",style);
		this.anchor.appendChild(circle);
		return circle;
	},
	/*Node|void*/drawEllipse:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Map*/attrs,/*String*/style){
		var ellipse = createNS("ellipse"),
			w = (w>>1),
			h = (h>>1);
		attr(ellipse,"cx",coordinate.x + w);
		attr(ellipse,"cy",coordinate.y + h);
		attr(ellipse,"rx",w);
		attr(ellipse,"ry",h);
		style && attr(ellipse,"style",style);
		if(attrs){
			for(var item in attrs){
				//transform attribute is a array like [translate(x,y),rotate(a),translate(z,k)]
				attr(ellipse,item,((attrs[item] instanceof Array) ? attrs[item].join(" "):attrs[item]));
			}
		}
		this.anchor.appendChild(ellipse);
		return ellipse;
	},
	/*Node|void*/drawLine:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2,/*String*/style){
		var line = createNS("line");
		attr(line,"x1",p1.x);
		attr(line,"y1",p1.y);
		attr(line,"x2",p2.x);
		attr(line,"y2",p2.y);
		style && attr(line,"style",style);
		this.anchor.appendChild(line);
		return line;
	},
	/*Node|void*/drawRect:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Double*/rx,/*Map*/attrs,/*String*/style){
		var rect = createNS("rect");
		attr(rect,"x",coordinate.x);
		attr(rect,"y",coordinate.y);
		attr(rect,"width",w);
		attr(rect,"height",h);
		if(attrs){
			for(var item in attrs){
				//transform attribute is a array like [translate(x,y),rotate(a),translate(z,k)]
				attr(rect,item,((attrs[item] instanceof Array) ? attrs[item].join(" "):attrs[item]));
			}
		}
		(rx !== undefined && rx != null) && (attr(rect,"rx",rx)); 
		style && attr(rect,"style",style);
		this.anchor.appendChild(rect);
		return rect;
	},
	/*Node|void*/drawImage:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/url,/*Map*/attrs){
		var image = createNS("image");
		coordinate && attr(image,"x",coordinate.x);
		coordinate && attr(image,"y",coordinate.y);
		attr(image,"width",w);
		attr(image,"height",h);
		attrNS(image,xlinkNS,"xlink:href",rootName + url);
		if(attrs){
			for(var item in attrs){
				attr(image,item,attrs[item] instanceof Array?attrs[item].join(' '):attrs[item]);
			}
		}
		this.anchor.appendChild(image);
		return image;
	},
	/*Node|void*/drawText:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/textContent,/*Map*/attrs,/*String*/style){
		var text = createNS("text"),
			s = style,content,
			texts = textContent && textContent.split("\n")
			x = coordinate && coordinate.x + (w>>1),
			y = coordinate && coordinate.y + (h>>1),
			unitHeight = textContent && utils.getFontHeight(textContent,style);
		x && attr(text,"x",x);
		y && attr(text,"y",y);
		attr(text,"width",w);
		attr(text,"height",h);
		if(attrs){
			for(var item in attrs){
				attr(text,item,attrs[item] instanceof Array?attrs[item].join(' '):attrs[item]);
			}
		}
		s && (s.indexOf("text-anchor") == -1) && (s += ";text-anchor:middle;");
		!s && (s = "text-anchor:middle;");
		s && attr(text,"style",s);
		texts && dojo.forEach(texts,function(t,index){
			content = createNS("tspan");
			attr(content,"x",x);
			attr(content,"y",y + unitHeight * index);
			content.textContent = t;
			text.appendChild(content);
		},this);
		this.anchor.appendChild(text);
		return text;
	},
	/*void*/clear:function(){
		var anchor = this.anchor;
		while(anchor.lastChild) 
		{
			anchor.removeChild(anchor.lastChild);
		}
	}
});
})();

}

if(!dojo._hasResource["drawboard.graphic.SVGIEGraphic"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graphic.SVGIEGraphic"] = true;
/**
 * draw kinds of graphs by SVG
 * style formatter : fill:none;stroke:(color);stroke-width:(double)
 */
dojo.provide("drawboard.graphic.SVGIEGraphic");


(function(){
var svgNS = "http://www.w3.org/2000/svg",
	xlinkNS="http://www.w3.org/1999/xlink",
	attr = dojo.attr,
	pathName = window.location.pathname,
	rootName = pathName.substring(0, pathName.indexOf("/",1) + 1),
	/*void*/attrNS = function(/*Node*/node,/*String*/ns,/*String*/attribute,/*String*/value){
		node.setAttributeNS(ns,attribute,value);
	},
	utils = common.utils.BrowerUtils;
dojo.declare("drawboard.graphic.SVGIEGraphic",drawboard.graphic.Graphic,{
	/*Node*/anchor:null,
	/*Node*/embed:null,
	/*Double*/_w:null,
	/*Double*/_h:null,
	/*Document*/doc:null,
	/*Node*/createAnchor:function(/*Double*/w,/*Double*/h,/*Node*/parent){
        var node = document.createElement("embed"),
			cover = document.createElement("div"),
			style = cover.style;
        node.type = "image/svg+xml";
        node.src = "empty.svg"; 
		node.wmode = "Transparent";
		w && (this._w = w) && attr(node,"width", w);
		h && (this._h = h) && attr(node,"height",h);
		this.embed = node;
		w && (style.width = w);
		h && (style.height = h);
		style.position = "absolute";
		style.background = "white";
		style["z-index"] = 100;
		style.filter = "alpha(opacity=0)";
		parent.appendChild(cover);
		parent.appendChild(node);
		this.setSVGDoc();
		return cover;
	},
	/*boolean*/ready:function(){
		if(this.doc){
			return true;
		}else{
			return false;	
		}
	},
	/*void*/setSVGDoc:function(){
		var embed = this.embed;
		if("getSVGDocument" in embed){
			var doc = embed.getSVGDocument(),
				svg = doc.documentElement;
			attr(svg,"width", this._w);
			attr(svg,"height", this._h);
			this.anchor = svg;
			this.doc = doc;
			return;
		}
		setTimeout(dojo.hitch(this,"setSVGDoc"),300);
	},
	/*Node*/createNS:function(/*String*/ele){
		var doc = this.doc;
		return doc.createElementNS(svgNS,ele);
	},
	/*void*/setSize:function(/*Double*/w,/*Double*/h){
		var node = this.anchor;
		w && attr(node,"width", w);
		h && attr(node,"height",h);
	},
	/*Node|void*/drawPath:function(/*Array<{command:"",points:[CoordinateFormatter]|String}>*/coordinates,/*String*/style,/*boolean*/open){
		var path = this.createNS("path"),d = [],ps;
		dojo.forEach(coordinates,function(item){
			if(!item){return;}
			if(typeof item == "string"){
				this.push(item);
			}else{
				this.push(item.command);
				ps = item.points;
				(!dojo.isArray(ps)) && (ps = [ps]);
				dojo.forEach(ps,function(p){
					this.push((p.x?(p.y?p.x + "," + p.y:p.x):p.y) + " ");
				},this);
			}
		},d);
		!open && d.push("Z");
		attr(path,"d",d.join(""));
		style && attr(path,"style",style);
		this.anchor.appendChild(path);
		return path;
	},
	/*Node|void*/drawCircle:function(/*CoordinateFormatter*/coordinate,/*Double*/r,/*String*/style){
		var circle = this.createNS("circle");
		attr(circle,"cx",coordinate.x);
		attr(circle,"cy",coordinate.y);
		attr(circle,"r",r);
		style && attr(circle,"style",style);
		this.anchor.appendChild(circle);
		return circle;
	},
	/*Node|void*/drawEllipse:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Map*/attrs,/*String*/style){
		var ellipse = this.createNS("ellipse"),
			w = (w>>1),
			h = (h>>1);
		attr(ellipse,"cx",coordinate.x + w);
		attr(ellipse,"cy",coordinate.y + h);
		attr(ellipse,"rx",w);
		attr(ellipse,"ry",h);
		style && attr(ellipse,"style",style);
		if(attrs){
			for(var item in attrs){
				//transform attribute is a array like [translate(x,y),rotate(a),translate(z,k)]
				attr(ellipse,item,((attrs[item] instanceof Array) ? attrs[item].join(" "):attrs[item]));
			}
		}
		this.anchor.appendChild(ellipse);
		return ellipse;
	},
	/*Node|void*/drawLine:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2,/*String*/style){
		var line = this.createNS("line");
		attr(line,"x1",p1.x);
		attr(line,"y1",p1.y);
		attr(line,"x2",p2.x);
		attr(line,"y2",p2.y);
		style && attr(line,"style",style);
		this.anchor.appendChild(line);
		return line;
	},
	/*Node|void*/drawRect:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Double*/rx,/*Map*/attrs,/*String*/style){
		var rect = this.createNS("rect");
		attr(rect,"x",coordinate.x);
		attr(rect,"y",coordinate.y);
		attr(rect,"width",w);
		attr(rect,"height",h);
		if(attrs){
			for(var item in attrs){
				//transform attribute is a array like [translate(x,y),rotate(a),translate(z,k)]
				attr(rect,item,((attrs[item] instanceof Array) ? attrs[item].join(" "):attrs[item]));
			}
		}
		(rx !== undefined && rx != null) && (attr(rect,"rx",rx)); 
		style && attr(rect,"style",style);
		this.anchor.appendChild(rect);
		return rect;
	},
	/*Node|void*/drawImage:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/url,/*Map*/attrs){
		var image = this.createNS("image");
		coordinate && attr(image,"x",coordinate.x);
		coordinate && attr(image,"y",coordinate.y);
		attr(image,"width",w);
		attr(image,"height",h);
		attrNS(image,xlinkNS,"xlink:href",rootName + url);
		if(attrs){
			for(var item in attrs){
				attr(image,item,attrs[item] instanceof Array?attrs[item].join(' '):attrs[item]);
			}
		}
		this.anchor.appendChild(image);
		return image;
	},
	/*Node|void*/drawText:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/textContent,/*Map*/attrs,/*String*/style){
		var text = this.createNS("text"),
			s = style,content,
			texts = textContent && textContent.split("\n")
			x = coordinate && coordinate.x + (w>>1),
			y = coordinate && coordinate.y + (h>>1),
			unitHeight = textContent && utils.getFontHeight(textContent,style);
		x && attr(text,"x",x);
		y && attr(text,"y",y);
		attr(text,"width",w);
		attr(text,"height",h);
		if(attrs){
			for(var item in attrs){
				attr(text,item,attrs[item] instanceof Array?attrs[item].join(' '):attrs[item]);
			}
		}
		s && (s.indexOf("text-anchor") == -1) && (s += ";text-anchor:middle;");
		!s && (s = "text-anchor:middle;");
		s && attr(text,"style",s);
		texts && dojo.forEach(texts,function(t,index){
			content = this.createNS("tspan");
			attr(content,"x",x);
			attr(content,"y",y + unitHeight * index);
			content.textContent = t;
			text.appendChild(content);
		},this);
		this.anchor.appendChild(text);
		return text;
	},
	/*void*/clear:function(){
		var anchor = this.anchor;
		while(anchor.lastChild) 
		{
			anchor.removeChild(anchor.lastChild);
		}
	}
});
})();

}

if(!dojo._hasResource["drawboard.Constant"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.Constant"] = true;
dojo.provide("drawboard.Constant");
drawboard.Constant = {
	MouseAction:{
		NONE:0,
		MOUSEDOWN:1,
		MOUSEMOVE:2,
		MOUSEUP:3,
		MOUSEOVER:4,
		MOUSECLICK:5,
		MOUSEOUT:6
	},
	ActionStatus:{
		NONE:0,
		SELECTING:1,
		DRAWING:2,
		MOVING:3,
		MARKING:4,
		RESIZING:5,
		ROTATING:6,
		POLEMOVING:7,
		MOTION:8,
		TEXT:9
	},
	Decorate:{
		SKELETON:0,
		MARK:1,
		ROTATOR:2,
		MOTIONANCHOR:3,
		CHARACTER:4,
		Graph:5,
		CENTER:6,
		OUTLET:7
	},
	Direction:{
		EAST:0,
		EASTNORTH:1,
		NORTH:2,
		WESTNORTH:3,
		WEST:4,
		WESTSOUTH:5,
		SOUTH:6,
		EASTSOUTH:7,
		END:8
	},
	Path:{
		NONE:"",
		MOVE:"M",
		RMOVE:"m",		//R present relative
		LINE:"L",
		RLINE:"l",
		HORIZON:"H",	//present horizontal line without y coordinate
		RHORIZON:"h",
		VERTICAL:"V",	//present vertical line without x coordinate
		RVERTICAL:"v",
		CUBIC:"C",		
		RCUBIC:"c",
		CUBICSMOOTH:"S",
		CUBICRSMOOTH:"s",
		QUADRATIC:"Q",
		RQUADRATIC:"q",
		QUADRATICSMOOTH:"T",
		RQUADRATICSMOOTH:"t",
		ARC:"A",
		RARC:"a",
		CLOSE:"Z",
		RCLOSE:"z"
	},
	Command:{
		CREATEVSDELETECOMMAND:"createvsdelete",
		RESIZECOMMAND:"resize",
		MOVECOMMAND:"move",
		ROTATECOMMAND:"rotate",
		ZOOMCOMMAND:"zoom",
		STYLECOMMAND:"style",
		ADDVSDELTECONSTRAINCOMMAND:"addvsdeleteconstrain",
		COMBINEVSDEVIDEDCOMMAND:"combinevsdevided",
		COMPOSITECOMMAND:"composite",
		MOTIONCOMMAND:"motion"
	},
	Symbol:{
		concat:"&&"
	},
	Toolbar:{
		COLORPALETTE:0,
		DROPDOWNLIST:1,
		DIALOGUE:2
	}
};

}

if(!dojo._hasResource["drawboard.graph.strategy.GraphStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.GraphStrategy"] = true;
dojo.provide("drawboard.graph.strategy.GraphStrategy");



(function(){
var	constant = drawboard.Constant;
/*
 * DecorateCoordinateFormatter extends CoordinateFormatter{
 * 		css:String
 * }
 */
dojo.declare("drawboard.graph.strategy.GraphStrategy",null,{
	/*Constant*/type:constant.Decorate.Graph,
	/*boolean*/_hasRotator:true,
	/**
	 * whether or not the rotator is shown 
	 */
	/*boolean*/hasRotator:function(){
		return this._hasRotator;
	},
	/**
	 * only use when rotator is not shown for ever.
	 */
	/*CoordinateFormatter*/getRotatorCoordinate:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	},
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	},
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return false;
	},
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * draw graph content on shown
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	/**
	 * this function will be called in case of mouse up event call
	 * if return true,then clear cache,otherwise not do it.
	 */
	/*boolean*/normalize:function(/*GraphProxy*/gp,/*Decorator*/decorator,/*ExecuteRuntime*/runtime){
		//override by subclass
		return false;
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			deltaX = delta.x,
			deltaY = delta.y,
			direct = decorate.getDirect();
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				gp.setCoordinate({x:p.x,y:p.y + deltaY},runtime);
				gp.setHeight(h - deltaY,runtime);
				break;
			case d.SOUTH:
				gp.setHeight(h + deltaY,runtime);
				break;
			case d.WEST:
				gp.setCoordinate({x:p.x + deltaX,y:p.y},runtime);
				gp.setWidth(w - deltaX,runtime);
				break;
			case d.EAST:
				gp.setWidth(w + deltaX,runtime);
				break;
			case d.WESTNORTH:
				gp.setCoordinate({x:p.x + deltaX,y:p.y + deltaY},runtime);
				gp.setWidth(w - deltaX,runtime);
				gp.setHeight(h - deltaY,runtime);
				break;
			case d.EASTNORTH:
				gp.setCoordinate({x:p.x,y:p.y + deltaY},runtime);
				gp.setWidth(w + deltaX,runtime);
				gp.setHeight(h - deltaY,runtime);
				break;
			case d.EASTSOUTH:
				gp.setWidth(w + deltaX,runtime);
				gp.setHeight(h + deltaY,runtime);
				break;
			case d.WESTSOUTH:
				gp.setCoordinate({x:p.x + deltaX,y:p.y},runtime);
				gp.setWidth(w - deltaX,runtime);
				gp.setHeight(h + deltaY,runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
		this._sizeChange(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime);
	},
	/**
	 * reset the graph size
	 */
	/*void*/_sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw"},
		    		//east north corner
		    		{x:x + w,y:y,css:"mover_ne"},
		    		//west south corner
		    		{x:x,y:y + h,css:"mover_sw"},
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se"},
		    		//north middle
		    		{x:x + (w>>1),y:y,css:"mover_n"},
		    		//south middle
		    		{x:x + (w>>1),y:y + h,css:"mover_s"},
		    		//west middle
		    		{x:x,y:y + (h>>1),css:"mover_w"},
		    		//east middle
		    		{x:x + w,y:y + (h>>1),css:"mover_e"}	        	
		        ];
	},
	
	/**
	 * motion anchor arithmetic
	 */
	/*CoordinateFormatter*/calcMotionAnchor:function(/*GraphProxy*/gp,/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		//override by subclass
	},
	
	/**
	 * fetch the marks' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			marks = gp.getRealMarks(runtime),
			x = start.x,
			y = start.y;
		if(!marks){
			return [
			    	//north middle
		    		{x:x + (w>>1),y:y},
		    		//south middle
		    		{x:x + (w>>1),y:y + h},
		    		//west middle
		    		{x:x,y:y + (h>>1)},
		    		//east middle
		    		{x:x + w,y:y + (h>>1)}
			        ];
		}
		var marksList = [
							//north middle
							marks[0] || {x:x + (w>>1),y:y},
							//south middle
							marks[1] || {x:x + (w>>1),y:y + h},
							//west middle
							marks[2] || {x:x,y:y + (h>>1)},
							//east middle
							marks[3] || {x:x + w,y:y + (h>>1)}
		                 ];
		for(var i = 4;i < marks.length;i++){
			marksList.push(marks[i]);
		}
		return marksList;
	},
	/*StyleController*/getStyleController:function(/*ExecuteRuntime*/runtime){
		return runtime.getContext().getStyleCtrl();
	},
	/*String*/getStyle:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return this.getStyleController(runtime).getStyle(this.type,gp);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.RectangleStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.RectangleStrategy"] = true;
dojo.provide("drawboard.graph.strategy.RectangleStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RectangleStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//west north corner
					{command:p.MOVE,points:cache[0]},
					//east north corner
					{command:p.LINE,points:cache[1]},
					//east south corner
					{command:p.LINE,points:cache[2]},
					//west south corner
					{command:p.LINE,points:cache[3]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        //west north corner
		        {x:x,y:y},
		        //east north corner
		        {x:x + w,y:y},
		        //east south corner
		        {x:x + w,y:y + h},
		        //west south corner
		        {x:x,y:y + h}
		        ];
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.TextStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.TextStrategy"] = true;
dojo.provide("drawboard.graph.strategy.TextStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.TextStrategy",drawboard.graph.strategy.RectangleStrategy,{
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gf.drawText(gp.getCoordinate(runtime),gp.getWidth(runtime),gp.getHeight(runtime),gp.getText(),(a != 0)&&{transform:transform},this.getTextStyle(gp,runtime));
	},
	/*String*/getTextStyle:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return this.getStyleController(runtime).getTextStyle(gp);
	}
});
})();

}

if(!dojo._hasResource["drawboard.controller.StyleController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.controller.StyleController"] = true;
dojo.provide("drawboard.controller.StyleController");

(function(){
dojo.declare("drawboard.controller.StyleController",common.container.MapContainer,{
	/*String*/_style:"fill:none;stroke:black;stroke-width:1",			//default style information
	/*String*/_activeStyle:"fill:none;stroke:red;stroke-width:1",
	/*String*/resultIdentity:"serializeStr",
	/*Array<Decorate>*/actives:null,
	/*GraphProxy*/activedGp:null,
	/*void*/setActives:function(/*Array<Decorate>*/actives,/*GraphProxy*/gp){
		this.actives = actives;
		this.activedGp && this.activedGp.isActived(false);
		gp && gp.isActived(true)&&(this.activedGp = gp);
	},
	/*Array<Decorate>*/getActives:function(){
		return this.actives;
	},
	/*void*/init:function(/*String*/style){
		this._style = style;
	},
	/*String*/getDefaultStyle:function(){
		return this._style;
	},
	//because the text default style is different of graph style.
	/*String*/getTextStyle:function(/*GraphProxy*/gp){
		var gs = this.getItem(gp.getIdty());
		if(!gs){return "";}
		return gs[this.resultIdentity];
	},
	/**
	 * get graph style
	 * @param gp
	 */
	/*String*/getGraphStyle:function(/*GraphProxy*/gp){
		var gs = this.getItem(gp.getIdty());
		if(!gs){return this.getDefaultStyle(gp);}
		return gs[this.resultIdentity];
	},
    /*String*/getGraphStyleValue:function(/*GraphProxy*/gp,/*String*/styleAttr){
		var styleStr = this.getItem(gp.getIdty());
		if(styleStr){
			return styleStr[styleAttr];
		}
		return null;
	},
	/*boolean*/containGraphStyle:function(/*GraphProxy*/gp){
		var gs = this.getItem(gp.getIdty());
		if(!gs){
			return false;
		}
		return true;
	},
	/**
	 * add graph  specific style
	 * @param gp
	 * @param styleAttr
	 * @param style
	 */
	/*void*/addGraphStyle:function(/*GraphProxy*/gp,/*String*/styleAttr,/*String*/style,/*boolean*/isText){
		if(gp.isComposite()){
			return;
		}
		var gs = this.getItem(gp.getIdty());
		if(!gs){
			gs = {};
			this.addItem(gp.getIdty(),gs);
		}
		gs[styleAttr] = style;
		gs[this.resultIdentity] = this.serialize(gs,isText);
	},
	/**
	 * remove graph specify style
	 */
	/*void*/removeGraphStyle:function(/*GraphProxy*/gp,/*String*/styleAttr){
		if(gp.isComposite()){
			return;
		}
		var gs = this.getItem(gp.getIdty());
		if(!gs || !gs[styleAttr]){return;}
		delete gs[styleAttr];
		gs[this.resultIdentity] = this.serialize(gs);
	},
	/**
	 * remove graph style
	 */
	/*void*/removeGraph:function(/*GraphProxy*/gp){
		var idty = gp.getIdty(),
			gs = this.getItem(idty);
		if(!gs){return;}
		this.removeItem(idty);
	},
	/**
	 * generate style string
	 * @param sj
	 */
	/*String*/serialize:function(/*JSON*/sj,/*boolean*/isText){
		var str = [];
		for(var attr in sj){
			if(attr != this.resultIdentity){
				str.push([attr,":",sj[attr]].join(""));
			}
		}
		if(!isText){			
			if(!sj["stroke"]){
				str.push(["stroke",":","black"].join(""));
			}
			if(!sj["stroke-width"]){
				str.push(["stroke-width",":","1"].join(""));
			}
			if(!sj["fill"]){
				str.push(["fill",":","none"].join(""));
			}
		}
		return str.join(";");
	},
	/*String*/getStyle:function(/*Constant*/type,/*GraphProxy*/gp,/*Decorate*/d){
		var actives = this.getActives(),isActive = false;
		if(d && actives){
			dojo.some(actives,function(active){
				if(active.equal(d)){
					isActive = true;
				}
			},this);
			if(isActive){
				return this._activeStyle;
			}
		}
		return this.getGraphStyle(gp);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.BrokenLineStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.BrokenLineStrategy"] = true;
dojo.provide("drawboard.graph.strategy.BrokenLineStrategy");


(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant,
	relationCtrl = drawboard.relationController;
dojo.declare("drawboard.graph.strategy.BrokenLineStrategy",drawboard.graph.strategy.GraphStrategy,{
	/*boolean*/_hasRotator:false,
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			motionAnchors = gp.getRealMotionAnchors(runtime),
			pointInSegment = dojo.hitch(geometry,"isPointInSegment"),
			max = motionAnchors.length,next;
		if((max == 0) && pointInSegment(p,{x:p.x + w,y:p.y + h},point)){
			return true;
		}
		for(var i = 0;i < max;i++){
			next = ((i + 1 == max)?{x:p.x + w,y:p.y + h}:motionAnchors[i + 1]);
			if(i == 0){
				if(pointInSegment(p,motionAnchors[i],point)||pointInSegment(motionAnchors[i],next,point)){
					return true;
				}
			}else if(i == max - 1){
				if(pointInSegment(motionAnchors[i],{x:p.x + w,y:p.y + h},point)){
					return true;
				}
			}else{
				if(pointInSegment(motionAnchors[i],next,point)){
					return true;
				}
			}
		}
		return false;
	},
	
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return true;
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime),
			max = cache.length - 1,path = [];
		for(var i = 0;i < max;i++){
			(i == 0)?path.push({command:p.MOVE,points:cache[i]},{command:p.LINE,points:cache[i+1]}): path.push({command:p.LINE,points:cache[i]},{command:p.LINE,points:cache[i+1]});
		}
		gf.drawPath(path,this.getStyle(gp,runtime),true);
	},
	
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			deltaX = delta.x,
			deltaY = delta.y,
			direct = decorate.getDirect(),
			motionAnchors = gp.getRealMotionAnchors(runtime),
			isHorizontal = true,anchor,tmp,
			setMotionAnchors = dojo.hitch(gp.getGraphStatus(),"setMotionAnchors");
		//decorate is a Skeleton instance
		switch(direct){
			case d.WESTNORTH:
				gp.setCoordinate({x:p.x + deltaX,y:p.y + deltaY},runtime);
				gp.setWidth(w - deltaX,runtime);
				gp.setHeight(h - deltaY,runtime);
				if(motionAnchors.length == 0){
					tmp = {x:p.x + w,y:p.y + h};
					motionAnchors.push({x:tmp.x,y:p.y + deltaY});
					break;
				}
				anchor = motionAnchors[0];
				(anchor.x == p.x)? (isHorizontal = true):(isHorizontal = false);
				if((anchor.x == p.x) && (anchor.y == p.y)){
					tmp = motionAnchors[1];
					!tmp && (tmp = {x:p.x + w,y:y + h});
					(anchor.x == tmp.x)? (isHorizontal = false):(isHorizontal = true);
				}
				(isHorizontal) && ((anchor.x += deltaX)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				(!isHorizontal) && ((anchor.y += deltaY)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				break;
			case d.EASTSOUTH:
				gp.setWidth(w + deltaX,runtime);
				gp.setHeight(h + deltaY,runtime);
				if(motionAnchors.length == 0){
					tmp = {x:p.x + w + deltaX,y:p.y + h + deltaY};
					motionAnchors.push({x:p.x,y:p.y + h + deltaY});
					break;
				}
				anchor = motionAnchors[motionAnchors.length -1];
				(anchor.x == (p.x + w))? (isHorizontal = true):(isHorizontal = false);
				if((anchor.x == (p.x + w)) && (anchor.y == (p.y + h))){
					tmp = motionAnchors[motionAnchors.length -2]||{x:p.x,y:p.y};
					(anchor.x == tmp.x)? (isHorizontal = false):(isHorizontal = true);
				}
				(isHorizontal) && ((anchor.x += deltaX)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				(!isHorizontal) && ((anchor.y += deltaY)!=null)&&(setMotionAnchors(motionAnchors,runtime));
				break;
			case d.END:
				break;
			default:
				break;
		}
		this._sizeChange(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime);
	},
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return drawboard.skeletonController.create(gp.getSkeletonCoordinates(runtime));
	},
	
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw"},
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se"}
		        ];
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var cache = this.getMotionAnchorCoordinates(gp,runtime);
			start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y,
			graphs = [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw",isAnchored:true}
					];
		dojo.forEach(cache,function(item){
			graphs.push({x:item.x,y:item.y});
		},this);
   		//east south corner
		graphs.push({x:x + w,y:y + h,css:"mover_se",isAnchored:true});
		return graphs;
	},
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	},
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			cache = [],
			start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y,
			preTmp = start,lastTmp;
		(!motionAnchors)&& ((motionAnchors = [{x:x+(w>>1),y:y},{x:x+(w>>1),y:y+h}])&&gp.getGraphStatus().setMotionAnchors(motionAnchors,runtime));
		//(!motionAnchors)&& ((motionAnchors = [{x:x,y:y + h}])&&gp.getGraphStatus().setMotionAnchors(motionAnchors,runtime));
		if(motionAnchors.length == 0){
			cache.push({x:start.x + (w>>1),y:start.y + (h>>1)});
			return cache;
		}
		dojo.forEach(motionAnchors,function(coordinate,index){
			((preTmp.x == coordinate.x)||
				(cache.push({x:preTmp.x + ((coordinate.x - preTmp.x)>>1),y:preTmp.y},{x:coordinate.x,y:coordinate.y})&&false))&&
				(cache.push({x:preTmp.x,y:preTmp.y + ((coordinate.y - preTmp.y)>>1)},{x:coordinate.x,y:coordinate.y}));
			preTmp = coordinate;
		},this);
		lastTmp = motionAnchors[motionAnchors.length - 1];
		(lastTmp.x == (x + w)) && (cache.push({x:lastTmp.x,y:lastTmp.y + ((y + h - lastTmp.y)>>1)}));
		(lastTmp.y == (y + h)) && (cache.push({x:lastTmp.x + ((x + w - lastTmp.x)>>1),y:lastTmp.y}));
		return cache;
	},
	/**
	 * motion anchor arithmetic
	 */
	/*Object*/calcMotionAnchor:function(/*GraphProxy*/gp,/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			activeAnchors = this.getActiveAnchors(gp,runtime),
			relationCtrl = drawboard.relationController,
			start = gp.getCoordinate(runtime),
			index = anchor.getIndex(),
			pIndex = Math.floor(index/2),
			len = motionAnchors.length,
			fixStart = relationCtrl.containRestrain(gp,activeAnchors[0],runtime),
			fixEnd = relationCtrl.containRestrain(gp,activeAnchors[1],runtime),
			preTmp = ((pIndex == 0)? start : motionAnchors[pIndex - 1]),
			nextTmp = ((pIndex == len - 1) ? {x:start.x + w,y:start.y + h} : motionAnchors[pIndex + 1]),
			anchorTmp = motionAnchors[pIndex],tmp,preStatus;//if status is true,it indicate that the direction is horintal
		//the motion anchors only store the corner points.
		//update the motion anchors
		if(index%2 == 0){
			//in the middle of line
			if(index == 0){
				//first point
				(!anchorTmp) && (anchorTmp = {x:start.x + w,y:start.y + h});
				if(fixStart){
					if(!fixEnd){
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:start.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>2)}))&&(len > 0?(nextTmp.y = point.y):(gp.setHeight(point.y - start.y,runtime)));
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>2),y:start.y},{x:start.x + ((anchorTmp.x - start.x)>>2),y:point.y}))&&(len > 0?(nextTmp.x = point.x):(gp.setWidth(point.x - start.x,runtime)));
						anchor.setIndex(3);
					}else{
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:start.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)},{x:start.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)}));
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>2),y:start.y},{x:start.x + ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:start.y}));
						anchor.setIndex(4);
					}
				}else if(fixEnd){
					if(!fixStart){
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>1)},{x:anchorTmp.x,y:start.y + ((anchorTmp.y - start.y)>>1)}))&&(start.x = point.x);
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>1),y:point.y},{x:start.x + ((anchorTmp.x - start.x)>>1),y:anchorTmp.y}))&&(start.y = point.y);
						gp.setCoordinate(start,runtime);
						anchor.setIndex(1);
					}else{
						(anchorTmp.x == start.x) &&(motionAnchors.splice(0,0,{x:start.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:start.y + ((anchorTmp.y - start.y)>>2)},{x:point.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)},{x:start.x,y:anchorTmp.y - ((anchorTmp.y - start.y)>>2)}));
						(anchorTmp.y == start.y) &&(motionAnchors.splice(0,0,{x:start.x + ((anchorTmp.x - start.x)>>2),y:start.y},{x:start.x + ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:point.y},{x:anchorTmp.x - ((anchorTmp.x - start.x)>>2),y:start.y}));
						anchor.setIndex(4);
					}
				}else{
					(start.x == anchorTmp.x)&&(gp.setWidth(gp.getWidth(runtime) + (start.x - point.x),runtime)||((start.x = anchorTmp.x = point.x) != null)&&(gp.setCoordinate(start,runtime)));
					(start.y == anchorTmp.y)&&(gp.setHeight(gp.getHeight(runtime) + (start.y - point.y),runtime)||((start.y = anchorTmp.y = point.y) != null)&&(gp.setCoordinate(start,runtime)));
				}
			}else if(pIndex == len){
				//last point
				anchorTmp = (len == 0)?{x:start.x,y:start.y}:motionAnchors[pIndex - 1];
				if(fixEnd){
					if(!fixStart){
						((start.x + w) == anchorTmp.x)&&(motionAnchors.push({x:point.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)},{x:anchorTmp.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)}))&&(preTmp.x = point.x);
						((start.y + h) == anchorTmp.y)&&(motionAnchors.push({x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:point.y},{x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:anchorTmp.y}))&&(preTmp.y = point.y);
						(len == 0)&&(gp.setCoordinate(preTmp));
						anchor.setIndex(index);
					}else{
						((start.x + w) == anchorTmp.x)&&(motionAnchors.push({x:anchorTmp.x,y:anchorTmp.y + ((start.y + h - anchorTmp.y)>>2)},{x:point.x,y:anchorTmp.y + ((start.y + h - anchorTmp.y)>>2)},{x:point.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)},{x:anchorTmp.x,y:start.y + h - ((start.y + h - anchorTmp.y)>>2)}));
						((start.y + h) == anchorTmp.y)&&(motionAnchors.push({x:anchorTmp.x + ((start.x + w - anchorTmp.x)>>2),y:anchorTmp.y},{x:anchorTmp.x + ((start.x + w - anchorTmp.x)>>2),y:point.y},{x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:point.y},{x:start.x + w - ((start.x + w - anchorTmp.x)>>2),y:anchorTmp.y}));
						anchor.setIndex(index + 4);
					}
				}else{
					((start.x + w) == anchorTmp.x)&&(((anchorTmp.x = point.x) != null)&&(gp.setWidth(point.x - start.x,runtime)));
					((start.y + h) == anchorTmp.y)&&(((anchorTmp.y = point.y) != null)&&(gp.setHeight(point.y - start.y,runtime)));
				}
			}else{
				preTmp = motionAnchors[pIndex - 1];
				(preTmp.x == anchorTmp.x) && (anchorTmp.x = preTmp.x = point.x);
				(preTmp.y == anchorTmp.y) && (anchorTmp.y = preTmp.y = point.y);
			}
		}else{
			//the point is one of double sides of line
			var end = {x:start.x+w,y:start.y+h},fixPoint,newPoint,isHorizontal = false,idxTmp;
			if(((pIndex == 0) && fixStart) || ((pIndex == len - 1) && fixEnd)){
				(
				  ((preTmp.x == anchorTmp.x) && (isHorizontal = false) || (point.x == preTmp.x))
					||((preTmp.y == anchorTmp.y) && (isHorizontal = true) && (point.y == preTmp.y))
					||(
						((pIndex == 0)&&(isHorizontal?
							(fixStart?(motionAnchors.unshift({x:preTmp.x + ((anchorTmp.x - preTmp.x)>>1),y:preTmp.y},{x:preTmp.x + ((anchorTmp.x - preTmp.x)>>1),y:point.y})):((((start.y = point.y)!=null) && (gp.setCoordinate(start,runtime))||true) && motionAnchors.splice(1,0,{x:point.x,y:anchorTmp.y + ((nextTmp.y - anchorTmp.y)>>1)},{x:nextTmp.x,y:anchorTmp.y + ((nextTmp.y - anchorTmp.y)>>1)}))):
							(fixStart?motionAnchors.unshift({x:preTmp.x,y:preTmp.y + ((anchorTmp.y - preTmp.y)>>1)},{x:point.x,y:preTmp.y + ((anchorTmp.y - preTmp.y)>>1)}):
								((((start.x = point.x)!=null)&&(gp.setCoordinate(start,runtime))||true)&& motionAnchors.splice(1,0,{x:anchorTmp.x + ((nextTmp.x - anchorTmp.x)>>1),y:point.y},{x:anchorTmp.x + ((nextTmp.x - anchorTmp.x)>>1),y:nextTmp.y})&&(idxTmp = 1))))&&
						(fixStart?(motionAnchors[2] = point):(motionAnchors[0] = point))&&(anchor.setIndex(idxTmp||5)))
						||((pIndex == len - 1) && (pIndex != 0) && 
						(isHorizontal?
							motionAnchors.push({x:point.x,y:anchorTmp.y + ((end.y - anchorTmp.y)>>1)},{x:end.x,y:anchorTmp.y + ((end.y - anchorTmp.y)>>1)}):
							motionAnchors.push({x:anchorTmp.x + ((end.x - anchorTmp.x)>>1),y:point.y},{x:anchorTmp.x + ((end.x - anchorTmp.x)>>1),y:end.y}))&&(motionAnchors[pIndex] = point)|| true)
						||true)
				)&&(
				  ((pIndex == len - 1)?(isHorizontal?(preTmp.y = point.y):(preTmp.x = point.x)):(isHorizontal?(nextTmp.x = point.x):(nextTmp.y = point.y)))
				);
			}else{		
				(
					((preTmp.x == anchorTmp.x)&&(preTmp.y == anchorTmp.y))?(
						(
						(((pIndex < 2)?((pIndex == 1)&&(tmp = start)):(tmp = motionAnchors[pIndex - 2]))&&(tmp && (preStatus = (tmp.x == preTmp.x))||true)) 
						 ||(((pIndex < len - 2)?(tmp = motionAnchors[pIndex + 2]):((pIndex == len - 2)&&(tmp = end)))&&(tmp && (preStatus = !(tmp.x == nextTmp.x)) || true))
						 )
					):((preTmp.x == anchorTmp.x)?(preStatus = false):(preStatus = true))	
				);
				if(!preStatus){
					(((preTmp.x = point.x)!=null)&&((nextTmp.y = point.y)!=null)&&
						((pIndex == 0)&&(gp.setCoordinate(start,runtime)||gp.setWidth(end.x - start.x,runtime))))||
						((pIndex == len - 1)&&(gp.setHeight(nextTmp.y - start.y,runtime)));
				}else{
					(((preTmp.y = point.y)!=null)&&((nextTmp.x = point.x)!=null)&&
						((pIndex == 0)&&(gp.setCoordinate(start,runtime)||gp.setHeight(end.y - start.y,runtime))))||
						((pIndex == len - 1)&&(gp.setWidth(nextTmp.x - start.x,runtime)));
				}
				((anchorTmp.x = point.x)!=null)&&(anchorTmp.y = point.y);
			}
		}
		return null;
	},
	/**
	 * this function will be called in case of mouse up event call
	 */
	/*boolean*/normalize:function(/*GraphProxy*/gp,/*Decorator*/decorator,/*ExecuteRuntime*/runtime){
		gp && decorator && this.updateMotionAnchors(gp,runtime,decorator);
		return true;
	},
	/*
	 * update the motion anchors,if more than two points are in the same direction line,then delete the poins in the middle.
	 */
	/*void*/updateMotionAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime,/*MotionAnchor*/anchor){
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			start = gp.getCoordinate(runtime),	
			delPs = [],delIndexs = [],pIndex,preTmp,
			index = anchor && anchor.getIndex(),
			isCorner=false,preStatus,curStatus;				//if status is true,it indicate that the direction is horintal
		(pIndex = -1)&&(preTmp = {x:start.x,y:start.y});
		dojo.forEach(motionAnchors.concat({x:start.x + gp.getWidth(runtime),y:start.y + gp.getHeight(runtime)}),function(manchor,mIndex){
			if((preTmp.x == manchor.x) && (preTmp.y == manchor.y)){
				delPs.push(mIndex);
				return;
			}
			if(preTmp.x == manchor.x){
				curStatus = false;
			}else{
				curStatus = true;
			}
			(preStatus === undefined) && delPs.push(mIndex);
			(preStatus !== undefined) && (((preStatus == curStatus) && delPs.push(mIndex))||((delPs.length > 1) && delIndexs.push(delPs)&&false)||(delPs = [mIndex]));
			preStatus = curStatus;
			preTmp = manchor;
			/**
			(((preTmp.x == manchor.x)&&((preTmp.y = null)||(delete preTmp.y)&&(curStatus = true)))
			  ||((preTmp.y == manchor.y)&&((preTmp.x = null)||(delete preTmp.x)&&(curStatus = false)||true))
			  ||(((pIndex = mIndex) != null)&&((preTmp = dojo.clone(manchor))!=null)&&(isCorner = true)&&(((delPs.length > 2)&&(delIndexs.push(delPs)))||true)&&((preStatus = curStatus = !curStatus)!=null)&&(delPs = [mIndex])&&false))
				&&((((preStatus!=null) && isCorner && (curStatus == preStatus)&& (delPs[0] - 1 != -1) && delPs.unshift(delPs[0] - 1))||true)&&(isCorner = false)||(delPs.push(mIndex)));
			*/
		},this);
		(delPs.length > 1)&&delIndexs.push(delPs);
		dojo.forEach(delIndexs.reverse(),function(/*Array*/item){
			dojo.forEach(item.reverse(),function(dindex,pos){
				(pos != 0) && (motionAnchors.splice(dindex,1)) && (index != null) && ((index > dindex)&&((index = index - 2)!=null) && anchor.setIndex(index));
			},this);	
		},this);
		gp.getGraphStatus().setMotionAnchors(motionAnchors,runtime);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.ImageStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.ImageStrategy"] = true;
dojo.provide("drawboard.graph.strategy.ImageStrategy");


(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.ImageStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        //west north corner
		        {x:x,y:y},
		        //east north corner
		        {x:x + w,y:y},
		        //east south corner
		        {x:x + w,y:y + h},
		        //west south corner
		        {x:x,y:y + h}
		        ];
	},
	
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gf.drawImage(gp.getCoordinate(runtime),gp.getWidth(runtime),gp.getHeight(runtime),gp.getUrl(),(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.RatioStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.RatioStrategy"] = true;
dojo.provide("drawboard.graph.strategy.RatioStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RatioStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		//must be override by subclass
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		//must be override by subclass
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var ratio = gp.getRatio(),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),temp;
		if(!ratio){
			return this._getGraphCoordinates(gp,runtime,w,h);
		}
		temp = h*ratio;
		if(temp > w){
			h = w/ratio;
		}else{
			w = temp;
		}
		gp.setWidth(w,runtime);
		gp.setHeight(h,runtime);
		return this._getGraphCoordinates(gp,runtime,w,h);
	},
	/*Array<DecorateCoordinateFormatter>*/_getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime,/*Double*/w,/*Double*/h){
		//must be override by subclass
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			ratio = gp.getRatio(),
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			direct = decorate.getDirect(),
			temp;
		if(ratio){
			temp = h*ratio;
			if(temp > w){
				h = w/ratio;
			}else{
				w = temp;
			}
		}
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x + (delta>>1),y:p.y + (delta)},runtime);
				gp.setWidth(w - (delta),runtime);
				gp.setHeight(h - (delta),runtime);
				break;
			case d.WESTNORTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x + delta,y:p.y + delta},runtime);
				gp.setWidth(w - delta,runtime);
				gp.setHeight(h - delta,runtime);
				break;
			case d.EASTNORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x,y:p.y + delta},runtime);
				gp.setWidth(w - delta,runtime);
				gp.setHeight(h - delta,runtime);
				break;
			case d.SOUTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x - (delta>>1),y:p.y},runtime);
				gp.setWidth(w + (delta),runtime);
				gp.setHeight(h + (delta),runtime);
				break;
			case d.EASTSOUTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x,y:p.y},runtime);
				gp.setWidth(w + delta,runtime);
				gp.setHeight(h + delta,runtime);
				break;
			case d.WESTSOUTH:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y},runtime);
				gp.setWidth(w - delta,runtime);
				gp.setHeight(h - delta,runtime);
				break;
			case d.WEST:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y + (delta>>1)},runtime);
				gp.setWidth(w - (delta),runtime);
				gp.setHeight(h - (delta),runtime);
				break;
			case d.EAST:
				delta = delta.x;
				gp.setCoordinate({x:p.x,y:p.y - (delta>>1)},runtime);
				gp.setWidth(w + (delta),runtime);
				gp.setHeight(h + (delta),runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.RatioImageStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.RatioImageStrategy"] = true;
dojo.provide("drawboard.graph.strategy.RatioImageStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RatioImageStrategy",drawboard.graph.strategy.RatioStrategy,{
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/_getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime,/*Double*/w,/*Double*/h){
		var start = gp.getCoordinate(runtime),
			x = start.x,
			y = start.y;
		return [
		        //west north corner
		        {x:x,y:y},
		        //east north corner
		        {x:x + w,y:y},
		        //east south corner
		        {x:x + w,y:y + h},
		        //west south corner
		        {x:x,y:y + h}
		        ];
	},
	
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gp.getGraphCoordinates(runtime);
		gf.drawImage(gp.getCoordinate(runtime),gp.getWidth(runtime),gp.getHeight(runtime),gp.getUrl(),(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.SquareStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.SquareStrategy"] = true;
dojo.provide("drawboard.graph.strategy.SquareStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.SquareStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//west north corner
					{command:p.MOVE,points:cache[0]},
					//east north corner
					{command:p.LINE,points:cache[1]},
					//east south corner
					{command:p.LINE,points:cache[2]},
					//west south corner
					{command:p.LINE,points:cache[3]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			x = start.x,
			y = start.y;
		gp.setWidth(min,runtime);
		gp.setHeight(min,runtime);
		return [
		        //west north corner
		        {x:x,y:y},
		        //east north corner
		        {x:x + min,y:y},
		        //east south corner
		        {x:x + min,y:y + min},
		        //west south corner
		        {x:x,y:y + min}
		        ];
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			direct = decorate.getDirect();
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x + (delta>>1),y:p.y + (delta)},runtime);
				gp.setWidth(min - (delta),runtime);
				gp.setHeight(min - (delta),runtime);
				break;
			case d.WESTNORTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x + delta,y:p.y + delta},runtime);
				gp.setWidth(min - delta,runtime);
				gp.setHeight(min - delta,runtime);
				break;
			case d.EASTNORTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x,y:p.y + delta},runtime);
				gp.setWidth(min - delta,runtime);
				gp.setHeight(min - delta,runtime);
				break;
			case d.SOUTH:
				delta = delta.y;
				gp.setCoordinate({x:p.x - (delta>>1),y:p.y},runtime);
				gp.setWidth(min + (delta),runtime);
				gp.setHeight(min + (delta),runtime);
				break;
			case d.EASTSOUTH:
				delta = Math.abs(delta.x) > Math.abs(delta.y)?delta.y:delta.x,
				gp.setCoordinate({x:p.x,y:p.y},runtime);
				gp.setWidth(min + delta,runtime);
				gp.setHeight(min + delta,runtime);
				break;
			case d.WESTSOUTH:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y},runtime);
				gp.setWidth(min - delta,runtime);
				gp.setHeight(min - delta,runtime);
				break;
			case d.WEST:
				delta = delta.x;
				gp.setCoordinate({x:p.x + delta,y:p.y + (delta>>1)},runtime);
				gp.setWidth(min - (delta),runtime);
				gp.setHeight(min - (delta),runtime);
				break;
			case d.EAST:
				delta = delta.x;
				gp.setCoordinate({x:p.x,y:p.y - (delta>>1)},runtime);
				gp.setWidth(min + (delta),runtime);
				gp.setHeight(min + (delta),runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.OvalStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.OvalStrategy"] = true;
dojo.provide("drawboard.graph.strategy.OvalStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.OvalStrategy",drawboard.graph.strategy.RectangleStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getOutletCoordinates(runtime),point);
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var cache = gp.getGraphCoordinates(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			p = constant.Path,
			path = [],
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gf.drawEllipse(gp.getCoordinate(runtime),w,h,(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			cache = [//circle center
				     {x:p.x + w,y:p.y + h}];
		return cache;
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.CircleStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.CircleStrategy"] = true;
dojo.provide("drawboard.graph.strategy.CircleStrategy");


(function(){
var	geometry = common.calc.Geometry;
dojo.declare("drawboard.graph.strategy.CircleStrategy",drawboard.graph.strategy.SquareStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1;
		return geometry.isPointInCircle(point,{coordinate:gp.getGraphCoordinates(runtime)[0],r:r});
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var cache = gp.getGraphCoordinates(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1;
		gf.drawCircle(cache[0],r,this.getStyle(gp,runtime));
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			r = min>>1,
			cache = [//circle center
				     {x:p.x + r,y:p.y + r}];
		gp.setWidth(min,runtime);
		gp.setHeight(min,runtime);	
		return cache;
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.MotionCircleStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.MotionCircleStrategy"] = true;
dojo.provide("drawboard.graph.strategy.MotionCircleStrategy");


(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.MotionCircleStrategy",drawboard.graph.strategy.SquareStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1;
		return geometry.isPointInCircle(point,{coordinate:gp.getGraphCoordinates(runtime)[0],r:r});
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1,
			cache = gp.getGraphCoordinates(runtime),
			motionAnchors = gp.getMotionAnchorCoordinates(runtime),
			a = geometry.angle(motionAnchors[0][0],cache[0],motionAnchors[1][0]),
			arc = [p.ARC + r,r,0,(a < 180?0:1) + ",1",motionAnchors[1][0].x + " " + motionAnchors[1][0].y];
		gf.drawPath([
					//first motion anchor
					{command:p.MOVE,points:motionAnchors[0][0]},
					arc.join(" ")
					],this.getStyle(gp,runtime),true);
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1,
			min = w > h?h:w,
			cache = [//circle center
				     {x:p.x + r,y:p.y + r}
				     ];
		gp.setWidth(min,runtime);
		gp.setHeight(min,runtime);
		return cache;
	},
	
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		//only have two motion anchors
		var motionAnchors = gp.getRealMotionAnchors(runtime),
			cache = [],gs,
			w = gp.getWidth(runtime),
			fixCoordinate = gp.getCoordinate(runtime),
			rotate = geometry.rotation,
			center = gp.getGraphCoordinates(runtime)[0];
		fixCoordinate.x += (w>>1);
		if(!motionAnchors){
			motionAnchors = [10,100];
			gs = gp.getGraphStatus();
			gs.setMotionAnchors(motionAnchors,runtime);
		}
		dojo.forEach(motionAnchors,function(anchor){
			cache.push(rotate(fixCoordinate,center,anchor));
		},this);
		return cache;
	},
	
	/**
	 * motion anchor arithmetic
	 */
	/*Object*/calcMotionAnchor:function(/*GraphProxy*/gp,/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			r = w > h?h>>1:w>>1,
			fixCoordinate = gp.getCoordinate(runtime),
			cache = gp.getGraphCoordinates(runtime),
		    newp = geometry.intersectCircleLine(cache[0],r,cache[0],point)[0];
		fixCoordinate.x += (w>>1);
		return geometry.angle(fixCoordinate,cache[0],newp);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.RounderRectangleStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.RounderRectangleStrategy"] = true;
dojo.provide("drawboard.graph.strategy.RounderRectangleStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RounderRectangleStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			h = gp.getHeight(runtime),
			w = gp.getWidth(runtime),
			x = start.x,
			y = start.y;
		return [
		        //west north corner
		        {x:x,y:y},
		        //east north corner
		        {x:x + w,y:y},
		        //east south corner
		        {x:x + w,y:y + h},
		        //west south corner
		        {x:x,y:y + h}
		        ];
	},
	
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			r = runtime.getRounder(),
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gf.drawRect(gp.getCoordinate(runtime),gp.getWidth(runtime),gp.getHeight(runtime),r,(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.RounderSquareStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.RounderSquareStrategy"] = true;
dojo.provide("drawboard.graph.strategy.RounderSquareStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RounderSquareStrategy",drawboard.graph.strategy.SquareStrategy,{
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			rotator = gp.getGraphRotator(runtime),
			a = rotator.angle,
			pole = rotator.coordinate,
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			min = w > h?h:w,
			r = runtime.getRounder(),
			transform = ["translate(" + pole.x + "," + pole.y  + ")",
			             "rotate(" + a + ")",
			             "translate(" + -pole.x + "," + -pole.y  + ")"];
		gp.getGraphCoordinates(runtime);
		gf.drawRect(gp.getCoordinate(runtime),min,min,r,(a != 0)&&{transform:transform},this.getStyle(gp,runtime));
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.TriangleStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.TriangleStrategy"] = true;
dojo.provide("drawboard.graph.strategy.TriangleStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.TriangleStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//north corner
					{command:p.MOVE,points:cache[0]},
					//east south corner
					{command:p.LINE,points:cache[1]},
					//west south corner
					{command:p.LINE,points:cache[2]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        //north corner
		        {x:x + (w>>1),y:y},
		        //east south corner
		        {x:x,y:y + h},
		        //west south corner
		        {x:x + w,y:y + h}
		        ];
	},
	/**
	 * fetch the marks' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			marks = gp.getRealMarks(runtime),
			x = start.x,
			y = start.y;
		if(!marks){
			return [
			    	//north middle
		    		{x:x + (w>>1),y:y},
		    		//south west
		    		{x:x,y:y + h},
		    		//south east
		    		{x:x + w,y:y + h},
		    		//center
		    		{x:x + (w>>1),y:y + (h>>1)}
			        ];
		}
		var marksList = [
							//north middle
							marks[0] || {x:x + (w>>1),y:y},
							//south west
							marks[1] || {x:x,y:y + h},
							//south east
							marks[2] || {x:x + w,y:y},
							//center
							marks[3] || {x:x + (w>>1),y:y + (h>>1)}
		                 ];
		for(var i = 4;i < marks.length;i++){
			marksList.push(marks[i]);
		}
		return marksList;
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.RightTriangleStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.RightTriangleStrategy"] = true;
dojo.provide("drawboard.graph.strategy.RightTriangleStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.RightTriangleStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//west north corner
					{command:p.MOVE,points:cache[0]},
					//east south corner
					{command:p.LINE,points:cache[1]},
					//west south corner
					{command:p.LINE,points:cache[2]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        //west north corner
		        {x:x,y:y},
		        //east south corner
		        {x:x + w,y:y + h},
		        //west south corner
		        {x:x,y:y + h}
		        ];
	},
	/**
	 * fetch the marks' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			marks = gp.getRealMarks(runtime),
			x = start.x,
			y = start.y;
		if(!marks){
			return [
			    	//west north corner
		    		{x:x,y:y},
		    		//east south corner
		    		{x:x + w,y:y + h},
		    		//west south corner
		    		{x:x,y:y + h},
		    		//center
		    		{x:x + (w>>1),y:y + (h>>1)}
			        ];
		}
		var marksList = [
							//west north corner
							marks[0] || {x:x,y:y},
							//east south corner
							marks[1] || {x:x + w,y:y + h},
							//west south corner
							marks[2] || {x:x,y:y + h},
							//center
							marks[3] || {x:x + (w>>1),y:y + (h>>1)}
		                 ];
		for(var i = 4;i < marks.length;i++){
			marksList.push(marks[i]);
		}
		return marksList;
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.LineStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.LineStrategy"] = true;
dojo.provide("drawboard.graph.strategy.LineStrategy");


(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.LineStrategy",drawboard.graph.strategy.GraphStrategy,{
	/*boolean*/_hasRotator:false,
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var cache = gp.getGraphCoordinates(runtime);
		return geometry.isPointInSegment(cache[0],cache[1],point);
	},
	
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return true;
	},
	
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawLine(cache[0],cache[1],this.getStyle(gp,runtime));
	},
	
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return drawboard.skeletonController.create(gp.getSkeletonCoordinates(runtime));
	},
	
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw"},
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se"}
		        ];
	},
	
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        	//west north corner
		        	{x:x,y:y,css:"mover_nw",isAnchored:true},
		    		//east south corner
		    		{x:x + w,y:y + h,css:"mover_se",isAnchored:true}
		        ];
	},
	
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return null;
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.DiamondStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.DiamondStrategy"] = true;
dojo.provide("drawboard.graph.strategy.DiamondStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.DiamondStrategy",drawboard.graph.strategy.GraphStrategy,{
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//in the middle of northern
					{command:p.MOVE,points:cache[0]},
					//in the middle of western
					{command:p.LINE,points:cache[1]},
					//in the middle of southern
					{command:p.LINE,points:cache[2]},
					//in the middle of eastern
					{command:p.LINE,points:cache[3]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		        //in the middle of northern
		        {x:x + (w>>1),y:y},
		        //in the middle of western
		        {x:x,y:y + (h>>1)},
		        //in the middle of southern
		        {x:x + (w>>1),y:y + h},
		        //in the middle of eastern
		        {x:x + w,y:y + (h>>1)}
		        ];
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.arrow.FFOneWayArrowStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.arrow.FFOneWayArrowStrategy"] = true;
dojo.provide("drawboard.graph.strategy.arrow.FFOneWayArrowStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.arrow.FFOneWayArrowStrategy",drawboard.graph.strategy.GraphStrategy,{
	/*boolean*/_hasRotator:false,
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/*boolean*/isAnchor:function(/*Decorate*/d){
		if(d.getIndex() == 2){
			return true;
		}
		return false;
	},
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var skeletons = gp.getSkeletonCoordinates(runtime),actives = [skeletons[2]];
		return drawboard.skeletonController.create(actives);
	},
	/**
	 * only use when rotator is not shown for ever.
	 */
	/*CoordinateFormatter*/getRotatorCoordinate:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return this.getGraphCoordinates(gp,runtime)[0];
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//array header
					{command:p.MOVE,points:cache[0]},
					//on the left size of array header
					{command:p.LINE,points:cache[1]},
					{command:p.LINE,points:cache[2]},
					{command:p.LINE,points:cache[3]},
					//on the right size of array header
					{command:p.LINE,points:cache[4]},
					{command:p.LINE,points:cache[5]},
					{command:p.LINE,points:cache[6]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y,
			h3 = h/3;
		return [
		        //array header
		        {x:x,y:y + (h>>1),isAnchored:true},
		        //on the left size of array header
		        {x:x + (h>>1),y:y},
		        {x:x + (h>>1),y:y + h3},
		        {x:x + w,y:y + h3},
		        //on the right size of array header
		        {x:x + w,y:y + (h3<<1)},
		        {x:x + (h>>1),y:y + (h3<<1)},
		        {x:x + (h>>1),y:y + h}
		        ];
	},
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		    		//north middle
		    		{x:x + (w>>1),y:y,css:"mover_n"},
		    		//south middle
		    		{x:x + (w>>1),y:y + h,css:"mover_s"},
		    		//west middle
		    		{x:x,y:y + (h>>1),css:"mover_w"}
		        ];
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			deltaX = delta.x,
			deltaY = delta.y,
			direct = decorate.getDirect();
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				gp.setCoordinate({x:p.x,y:p.y + (deltaY)},runtime);
				gp.setHeight(h - (deltaY<<1),runtime);
				break;
			case d.SOUTH:
				gp.setCoordinate({x:p.x,y:p.y - (deltaY)},runtime);
				gp.setHeight(h + (deltaY<<1),runtime);
				break;
			case d.WEST:
				var preEm = gp.getMotionAnchorCoordinates(runtime)[0][0],
					start,wm,em,
					rotator = gp.getRotator(runtime);
				gp.setCoordinate({x:p.x + deltaX,y:p.y + deltaY},runtime);
				start = gp.getCoordinate(runtime);
				wm = {x:start.x,y:start.y + (h>>1)};				//west middle coordinate
				em = {x:start.x + w,y:start.y + (h>>1)};
				rotator.angle = geometry.angle(em,wm,preEm);
				gp.setWidth(geometry.getDistant(preEm,wm),runtime);
				gp.setRotator(rotator,runtime);
				break;
			case d.EAST:
				var preEm = gp.getSkeletonCoordinates(runtime)[3][0],
					start =  gp.getCoordinate(runtime),
					wm,em,curEm,
					rotator = gp.getRotator(runtime);
				wm = {x:start.x,y:start.y + (h>>1)};				//west middle coordinate
				em = {x:start.x + w,y:start.y + (h>>1)};
				curEm = {x:preEm.x + deltaX,y:preEm.y + deltaY};
				rotator.angle = geometry.angle(em,wm,curEm);
				gp.setWidth(geometry.getDistant(curEm,wm),runtime);
				gp.setRotator(rotator,runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
	},
	/**
	 * motion anchor arithmetic
	 */
	/*CoordinateFormatter*/calcMotionAnchor:function(/*GraphProxy*/gp,/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			wm = {x:start.x,y:start.y + (gp.getHeight(runtime)>>1)},	//west middle coordinate
			em = {x:start.x + gp.getWidth(runtime),y:start.y + (gp.getHeight(runtime)>>1)},
			angle = geometry.angle(em,wm,point),rotator;
		rotator = gp.getRotator(runtime);
		rotator.angle = angle;
		gp.setWidth(geometry.getDistant(wm,point),runtime);
		gp.setRotator(rotator,runtime);
		return point;
	},
	
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [//east middle
	    		{x:x + w,y:y + (h>>1)}
	    	   ];
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.strategy.arrow.FFDoubleSideArrowStrategy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.arrow.FFDoubleSideArrowStrategy"] = true;
dojo.provide("drawboard.graph.strategy.arrow.FFDoubleSideArrowStrategy");

(function(){
var	geometry = common.calc.Geometry,
	constant = drawboard.Constant;
dojo.declare("drawboard.graph.strategy.arrow.FFDoubleSideArrowStrategy",drawboard.graph.strategy.GraphStrategy,{
	/*boolean*/_hasRotator:false,
	/**
	 * whether or not point is in the graph
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(gp.getGraphCoordinates(runtime),point);
	},
	/*boolean*/isAnchor:function(/*Decorate*/d){
		if(d.getIndex() == 2 || d.getIndex() == 3){
			return true;
		}
		return false;
	},
	/**
	 * return a array of decorate,which can be relative to mark anchor
	 */
	/*Array<Decorate>*/getActiveAnchors:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var skeletons = gp.getSkeletonCoordinates(runtime),actives = [skeletons[2],skeletons[3]];
		return drawboard.skeletonController.create(actives);
	},
	/**
	 * only use when rotator is not shown for ever.
	 */
	/*CoordinateFormatter*/getRotatorCoordinate:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		return this.getGraphCoordinates(gp,runtime)[0];
	},
	/**
	 * draw graph only
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*Graphic*/gf,/*ExecuteRuntime*/runtime){
		var p = constant.Path,
			cache = gp.getGraphCoordinates(runtime);
		gf.drawPath([
					//array header
					{command:p.MOVE,points:cache[0]},
					//on the left size of array header
					{command:p.LINE,points:cache[1]},
					{command:p.LINE,points:cache[2]},
					//on the left size of another array header
					{command:p.LINE,points:cache[3]},
					{command:p.LINE,points:cache[4]},
					//another array header
					{command:p.LINE,points:cache[5]},
					//on the right size of another array header
					{command:p.LINE,points:cache[6]},
					{command:p.LINE,points:cache[7]},
					//on the right size of array header
					{command:p.LINE,points:cache[8]},
					{command:p.LINE,points:cache[9]}
		            ],this.getStyle(gp,runtime));
	},
	/**
	 * calculate the graph' coordinate
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y,
			h3 = h/3;
		return [
		        //array header
		        {x:x,y:y + (h>>1),isAnchored:true},
		        //on the left size of array header
		        {x:x + (h>>1),y:y},
		        {x:x + (h>>1),y:y + h3},
		        //on the left size of another array header
		        {x:x + (w - (h>>1)),y:y + h3},
		        {x:x + (w - (h>>1)),y:y},
		        //another array header
		        {x:x + w,y:y + (h>>1),isAnchored:true},
		        //on the right size of another array header
		        {x:x + (w - (h>>1)),y:y + h},
		        {x:x + (w - (h>>1)),y:y + (h3<<1)},
		        //on the right size of array header
		        {x:x + (h>>1),y:y + (h3<<1)},
		        {x:x + (h>>1),y:y + h}
		        ];
	},
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var start = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			x = start.x,
			y = start.y;
		return [
		    		//north middle
		    		{x:x + (w>>1),y:y,css:"mover_n"},
		    		//south middle
		    		{x:x + (w>>1),y:y + h,css:"mover_s"},
		    		//west middle
		    		{x:x,y:y + (h>>1),css:"mover_w"},
		    		//east middle
		    		{x:x + w,y:y + (h>>1),css:"mover_e"}
		        ];
	},
	/**
	 * reset the graph size
	 */
	/*void*/sizeChange:function(/*graphProxy*/gp,/*Decorate*/decorate,/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var d = constant.Direction,
			p = gp.getCoordinate(runtime),
			w = gp.getWidth(runtime),
			h = gp.getHeight(runtime),
			deltaX = delta.x,
			deltaY = delta.y,
			direct = decorate.getDirect();
		//decorate is a Skeleton instance
		switch(direct){
			case d.NORTH:
				gp.setCoordinate({x:p.x,y:p.y + (deltaY)},runtime);
				gp.setHeight(h - (deltaY<<1),runtime);
				break;
			case d.SOUTH:
				gp.setCoordinate({x:p.x,y:p.y - (deltaY)},runtime);
				gp.setHeight(h + (deltaY<<1),runtime);
				break;
			case d.WEST:
				var preEm = gp.getSkeletonCoordinates(runtime)[3][0],
					start,wm,em,
					rotator = gp.getRotator(runtime);
				gp.setCoordinate({x:p.x + deltaX,y:p.y + deltaY},runtime);
				start = gp.getCoordinate(runtime);
				wm = {x:start.x,y:start.y + (h>>1)};				//west middle coordinate
				em = {x:start.x + w,y:start.y + (h>>1)};
				rotator.angle = geometry.angle(em,wm,preEm);
				gp.setWidth(geometry.getDistant(preEm,wm),runtime);
				gp.setRotator(rotator,runtime);
				break;
			case d.EAST:
				var preEm = gp.getSkeletonCoordinates(runtime)[3][0],
					start =  gp.getCoordinate(runtime),
					wm,em,curEm,
					rotator = gp.getRotator(runtime);
				wm = {x:start.x,y:start.y + (h>>1)};				//west middle coordinate
				em = {x:start.x + w,y:start.y + (h>>1)};
				curEm = {x:preEm.x + deltaX,y:preEm.y + deltaY};
				rotator.angle = geometry.angle(em,wm,curEm);
				gp.setWidth(geometry.getDistant(curEm,wm),runtime);
				gp.setRotator(rotator,runtime);
				break;
			case d.END:
				break;
			default:
				break;
		}
	}
});
})();

}

if(!dojo._hasResource["drawboard.command.Command"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.Command"] = true;
dojo.provide("drawboard.command.Command");



(function(){
var commandType = drawboard.Constant.Command;
dojo.declare("drawboard.command.Command",common.command.Command,{
	/*Memo*/_memo:null,				//store a state information for execute,as parameters of the function execute.
	/*Object*/_executor:null,		//a executor which to use this state information
	/*Runtime*/_runtime:null,
	/*String*/_description:{},		//{0:positive description,1:negative description}
	/*void*/constructor:function(/*Object*/executor,/*Memo*/memo,/*boolean*/isNegative){
		if(!executor){
			new common.exception.Exception({msg:"the executor must be exist in the command!"});
			return;
		}
		this._executor = executor;
		this._memo = memo;
		if(!isNegative){
			this.execute = this.positive;
			this.unexecute = this.negative;
		}else{
			this.execute = this.negative;
			this.unexecute = this.positive;
		}
	},
	/*String*/getType:function(){
		//override by subclass
		return "";
	},
	/*Constant*/getConstant:function(){
		return commandType;
	},
	/*void*/setMemo:function(/*Memo*/memo){
		this._memo = memo;
	},
	/*Memo*/getMemo:function(){
		return this._memo;
	},
	/*void*/setRuntime:function(/*Runtime*/runtime){
		this._runtime = runtime;
	},
	/*Runtime*/getRuntime:function(){
		var runtime = this._runtime;
		if(!runtime){
			new common.exception.Exception({msg:"the runtime must be exist in the command!"});
		}
		return runtime;
	},
	/*Object*/getExecutor:function(){
		return this._executor;
	},
	/*void*/setExecutor:function(/*Object*/executor){
		this._executor = executor;
	},
	/*void*/execute:function(){
		//override by subclass
	},
	/*void*/unexecute:function(){
		//override by subclass
	},
	/*void*/positive:function(){
		//override by subclass
	},
	/*void*/negative:function(){
		//override by subclass
	},
	/*void*/setDescription:function(/*String*/desp0,/*String*/desp1){
		this._description = {first:desp0,second:desp1};
	},
	/*boolean*/isPositive:function(){
		if(this.execute == this.positive){
			return true;
		}
		return false;
	},
	/**
	 *	whether or not this command will be cancel out by another command which is in the same type.
	 */
	/*boolean*/isCancelOut:function(){
		return false;
	},
	/*void*/getDesciption:function(){
		var desp = this._description;
		if(this.isPositive()){
			return desp.first;
		}
		return desp.second;
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/merge:function(/*Command*/command){
		if(this.getType() != command.getType() || this.getExecutor() != command.getExecutor()){
			return false;
		}
		return this._merge(command);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		//override by subclass
	}
});
})();

}

if(!dojo._hasResource["drawboard.command.AddVSDeleteConstrainCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.AddVSDeleteConstrainCommand"] = true;
dojo.provide("drawboard.command.AddVSDeleteConstrainCommand");

//add and delete constrain operation is a part of other commmand in the composite command.Only when the mouse up call will add the constrain.
dojo.declare("drawboard.command.AddVSDeleteConstrainCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().ADDVSDELTECONSTRAINCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//relation controller
			memo = this.getMemo(),				//Array<{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}>
			runtime = this.getRuntime();
		dojo.forEach(memo,function(mark){
			executor.addListener(mark.gp,mark.d,mark.restrainedGp,mark.restrainedD,runtime);
		},this);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//relation controller
			memo = this.getMemo(),				//Array<{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}>
			runtime = this.getRuntime(),
			temps;
		dojo.forEach(memo,function(mark){
			temps = executor.getRestrainedCache(mark.restrainedGp,mark.restrainedD,runtime);
			//only when the negative is a execute function.
			if(temps && temps.length > 0){
				memo = [];
				this.setMemo(memo);
				dojo.forEach(temps,function(item){
					memo.push({gp:item.gp,d:item.decorate,restrainedGp:mark.restrainedGp,restrainedD:mark.restrainedD||item.restrainedD});
				},this);
			}
			executor.removeListener(mark.restrainedGp,mark.restrainedD,runtime);
		},this);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 * old command may be instead of new command;
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});

}

if(!dojo._hasResource["drawboard.command.CombineVSDevidedCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.CombineVSDevidedCommand"] = true;
dojo.provide("drawboard.command.CombineVSDevidedCommand");

//has problem
dojo.declare("drawboard.command.CombineVSDevidedCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().COMBINEVSDEVIDEDCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo();				//CompositGraphProxy
		executor.combineGraph(memo);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo();				//CompositGraphProxy
		executor.divideGraph(memo);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});

}

if(!dojo._hasResource["drawboard.command.CompositeCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.CompositeCommand"] = true;
dojo.provide("drawboard.command.CompositeCommand");


dojo.declare("drawboard.command.CompositeCommand",[drawboard.command.Command,common.container.ListContainer],{
	/*void*/constructor:function(){
		this.execute =  this.positive;
		this.unexecute = this.negative;
	},
	/*String*/getType:function(){
		return this.getConstant().COMPOSITECOMMAND;
	},
	/*void*/add:function(/*Command*/command){
		var last = this.last(),
			len = this.size();
		if(len == 0 ||(last && !last.merge(command))){
			drawboard.command.CompositeCommand.superclass.add.call(this,command);
			return;
		}
	},
	/*void*/positive:function(){
		this.forInItems(function(/*Command*/command){
			command.execute();
		},this);
	},
	/*void*/negative:function(){
		this.forInItems(function(/*Command*/command){
			command.unexecute();
		},this);
	}
});

}

if(!dojo._hasResource["drawboard.command.CreateVSDeleteCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.CreateVSDeleteCommand"] = true;
dojo.provide("drawboard.command.CreateVSDeleteCommand");

dojo.declare("drawboard.command.CreateVSDeleteCommand",drawboard.command.Command,{
	/*{[{gp:GraphProxy,gs:JSON]}*/_info:null,
	/*Integer*/index:null,
	/*String*/getType:function(){
		return this.getConstant().CREATEVSDELETECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//graph proxy
			info = this._info,
			runtime = this.getRuntime(),
			styleCtrl = runtime.getContext().getStyleCtrl(),
			index = this.index;
		index === null ? executor.add(memo): executor.insert(this.index,memo);
		if(info){
			dojo.forEach(info,function(item){
				executor.insert(item.index,item.gp);
				item.gs && styleCtrl.addItem(item.gp.getIdty(),item.gs);
				memo.add(item.gp,runtime);
			},this);	
			memo.resetRelations();
		}
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//graph proxy
			info,runtime = this.getRuntime(),
			styleCtrl = runtime.getContext().getStyleCtrl();
		if(memo.isComposite()){
			if(!this._info){
				this._info = [];
			}
			info = this._info;
			var gp;
			memo.forInItems(function(/*GraphItemFormatter*/item){
				gp = item.gp;
				info.push({gp:gp,gs:styleCtrl.getItem(gp.getIdty()),index:executor.indexOf(gp)});
			},this);
		}
		this.index = executor.indexOf(memo);
		executor.removeGraph(memo);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});

}

if(!dojo._hasResource["drawboard.command.MoveCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.MoveCommand"] = true;
dojo.provide("drawboard.command.MoveCommand");

//the positive and negative are sure.
dojo.declare("drawboard.command.MoveCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().MOVECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{start,end}
			runtime = this.getRuntime();
		executor.move(memo.start,memo.end,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{start,end}
			runtime = this.getRuntime();
		executor.move(memo.end,memo.start,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		memo.end = cmemo.end;
		return true;
	}
});

}

if(!dojo._hasResource["drawboard.command.ResizeCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.ResizeCommand"] = true;
dojo.provide("drawboard.command.ResizeCommand");

//the positive and negative are sure.
dojo.declare("drawboard.command.ResizeCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().RESIZECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorate,start,end}
			runtime = this.getRuntime();
		executor.sizeChange(memo.decorate,memo.start,memo.end,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorate,start,end}
			runtime = this.getRuntime();
		executor.sizeChange(memo.decorate,memo.end,memo.start,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		if(memo.decorate != cmemo.decorate){
			return false;
		}
		memo.end = cmemo.end;
		return true;
	}
});

}

if(!dojo._hasResource["drawboard.command.RotateCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.RotateCommand"] = true;
dojo.provide("drawboard.command.RotateCommand");

//the positive and negative are sure.
dojo.declare("drawboard.command.RotateCommand",drawboard.command.Command,{
	/*Double*/_oriAngle:null,
	/*String*/getType:function(){
		return this.getConstant().ROTATECOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = dojo.clone(this.getMemo()),	//rotator
			runtime = this.getRuntime();
		if(this._oriAngle === null){
			this._oriAngle = executor.getRotator(runtime).angle;
		}
		executor.setRotator(memo,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = dojo.clone(this.getMemo()),	//rotator
			runtime = this.getRuntime();
		memo.angle = this._oriAngle;
		executor.setRotator(memo,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		memo.angle = cmemo.angle;
		return true;
	}
});

}

if(!dojo._hasResource["drawboard.command.StyleCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.StyleCommand"] = true;
dojo.provide("drawboard.command.StyleCommand");

//the positive and negative are sure.
dojo.declare("drawboard.command.StyleCommand",drawboard.command.Command,{
	/*String*/_style:null,
	/*String*/getType:function(){
		return this.getConstant().STYLECOMMAND;
	},
	/*Json*/getStyle:function(){
		var style = this._style;
		if(!style){
			this._style = style = {};
		}
		return style;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//style controller
			memo = this.getMemo();				//{gp:graph proxy,attr:style attribute,value:style value,isText:boolean}
		if(!this._style && executor.containGraphStyle(memo.gp)){
			this._style = executor.getGraphStyleValue(memo.gp,memo.attr);
		}
		executor.addGraphStyle(memo.gp,memo.attr,memo.value,memo.isText);
		if(memo.gp.isComposite()){
			var style = this.getStyle();
			memo.gp.forInItems(function(/*GraphItemFormatter*/item){
				if(executor.containGraphStyle(item.gp)){
					style[item.gp.getIdty()] = executor.getGraphStyleValue(item.gp,memo.attr);
				}
				executor.addGraphStyle(item.gp,memo.attr,memo.value,memo.isText);
			},this);
		}
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//style controller
			memo = this.getMemo();				//{gp:graph proxy,attr:style value:attribute,style value,isText:boolean}
		if(memo.gp.isComposite()){
			var style = this.getStyle(),value;
			memo.gp.forInItems(function(/*GraphItemFormatter*/item){
				value = style[item.gp.getIdty()];
				if(value){
					executor.addGraphStyle(item.gp,memo.attr,value,memo.isText);
					return;
				}
				executor.removeGraphStyle(item.gp,memo.attr);
			},this);
			return;
		}
		if(this._style){
			executor.addGraphStyle(memo.gp,memo.attr,this._style,memo.isText);
			return;
		}
		executor.removeGraphStyle(memo.gp,memo.attr);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		return false;
	}
});

}

if(!dojo._hasResource["drawboard.command.ZoomCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.ZoomCommand"] = true;
dojo.provide("drawboard.command.ZoomCommand");


//the positive and negative are sure.
dojo.declare("drawboard.command.ZoomCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().ZOOMCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//zoom rate
			runtime = this.getRuntime();
		executor.zoom(memo,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//drawboard
			memo = this.getMemo(),				//zoom rate
			runtime = this.getRuntime();
		executor.zoom({x:-memo.x,y:-memo.y},runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			cmemo = command.getMemo();
		this.setMemo(common.calc.Geometry.add2Points(memo , cmemo));
		return true;
	}
});

}

if(!dojo._hasResource["drawboard.command.MotionCommand"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.command.MotionCommand"] = true;
dojo.provide("drawboard.command.MotionCommand");

//the positive and negative are sure.
dojo.declare("drawboard.command.MotionCommand",drawboard.command.Command,{
	/*String*/getType:function(){
		return this.getConstant().MOTIONCOMMAND;
	},
	/*void*/positive:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorator:motionAnchor,p:CoordinateFormatter,oldP:CoordinateFormatter}
			runtime = this.getRuntime(),
			ma = memo.decorator;
		(!memo.oldP) && (memo.oldP = ma.getCenter());
		executor.moveMotionAnchor(ma,memo.p,runtime);
	},
	/*void*/negative:function(){
		var executor = this.getExecutor(),		//graph proxy
			memo = this.getMemo(),				//{decorator:motionAnchor,p:CoordinateFormatter,oldP:CoordinateFormatter}
			runtime = this.getRuntime();
		executor.moveMotionAnchor(memo.decorator,memo.oldP,runtime);
		executor.normalize(memo.decorator,runtime);
	},
	/**
	 * if merging return true represent merge success,otherwise fail.
	 */
	/*boolean*/_merge:function(/*Command*/command){
		var memo = this.getMemo(),
			ma = memo.decorator,
			cmemo = command.getMemo(),
			cma = cmemo.decorator;
		if(ma.getIndex() == cma.getIndex()){
			memo.p = cmemo.p;
			return true;
		}
		return false;
	}
});

}

if(!dojo._hasResource["drawboard.PreRequire"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.PreRequire"] = true;
dojo.provide("drawboard.PreRequire");

































}

if(!dojo._hasResource["drawboard._Event"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard._Event"] = true;
dojo.provide("drawboard._Event");



(function(){
var geometry = common.calc.Geometry,
	actionStatus = drawboard.Constant.ActionStatus,
	constant = drawboard.Constant;
dojo.declare("drawboard._Event",null,{
	/*CoordinateFormatter*/_start:null,		//the coordinate of mouse down or mouse move
	/*CoordinateFormatter*/_end:null,		//the coordinate of mouse move
	/*{left:Double,top:Double}*/boxCache:null,//current drawboard box coordinate
	/*Array<{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}>*/_marks:null,
											//mark which can be relative to,has the context
	/**
	 * get current drawboard panel box information
	 */
	/*void*/getBoxCache:function(){
		if(!this.boxCache){
			var node = (this.fixNode||this.domNode),
				cache = {left:node.offsetLeft,top:node.offsetTop};
			this.boxCache = cache;
		}
		return this.boxCache;
	},
	/**
	 * clear cache
	 */
	/*void*/refreshBoxCache:function(){
		this.boxCache = null;
	},
	/**
	 * get the coordinate of current mouse position in the drawboard panel
	 */
	/*CoordinateFormatter*/fetchCoordinate:function(/*Event*/e){
		var box = this.getBoxCache(),domNode = this.domNode;
		return {x:e.pageX - box.left + domNode.scrollLeft,y:e.pageY - box.top + domNode.scrollTop};
	},
	
	/*void*/showMarkActive:function(/*GraphProxy*/gp,/*Decorate*/d,/*ExecuteRuntime*/runtime){
		var activeAnchors = d || gp.getActiveAnchors(runtime),
			controller,marks,mark;
		if((d && !gp.isAnchor(d))||!activeAnchors){
			return;
		}
		(!dojo.isArray(activeAnchors))&&(activeAnchors = [activeAnchors]);
		controller = drawboard.markController;
		dojo.forEach(activeAnchors,function(/*Decorate<Skeleton>*/s){
			mark = controller.cross(s,gp,this,runtime);
			if(mark){
				!marks && (marks = []) && (this._marks = marks);
				marks.push(mark);
			}
		},this);
		controller = runtime.getContext().getStyleCtrl();
		!marks &&(this._marks = null); 
		if(marks){
			var actives = [];
			dojo.forEach(marks,function(m){
				this.push(m.d);
				gp = m.gp;
			},actives);
			controller.setActives(actives,gp);
			return;
		}
		controller.setActives(null);
	},
	
	/******************************************************
	 * 			Event Action
	 *****************************************************/
	/*void*/doClick:function(e){
		this.inherited(arguments);
	},
	/*void*/doMouseMove:function(e){
		this.inherited(arguments);
		this._end && (this._start = this._end);
		this._end = this.fetchCoordinate(e);
		var gp = this.getActive(),
			start = this._start,
			end = this._end,
			status = this.getActionStatus(),
			decorator = this.getDecorate(),rotator,pole,a,
			runtime = this.getRuntime(),
			selectRect = this.getSelectRect(),
			commandConstant = constant.Command,
			addCommand = dojo.hitch(this,this.addCommand),
			update = true;
		if(status != actionStatus.NONE && gp){
			rotator = dojo.clone(gp.getRotator(runtime));
			pole = rotator.coordinate;
		}
		selectRect && !gp && (gp = selectRect);
		if(!gp && status != actionStatus.DRAWING && status != actionStatus.SELECTING && status != actionStatus.TEXT){
			return;
		}
		switch(status){
			case actionStatus.RESIZING:
				addCommand(commandConstant.RESIZECOMMAND,gp,{decorate:decorator,start:start,end:end});
				//gp.sizeChange(decorator,start,end,runtime);
				this.showMarkActive(gp,drawboard.skeletonController.createItem(gp.getSkeletonCoordinates(runtime)[decorator.getIndex()],decorator.getIndex()),runtime);
				break;
			case actionStatus.MOVING:
				addCommand(commandConstant.MOVECOMMAND,gp,{start:start,end:end});
				//gp.move(start,end,runtime);
				this.showMarkActive(gp,null,runtime);
				break;
			case actionStatus.DRAWING:
			case actionStatus.SELECTING:
			case actionStatus.TEXT:
				var entity = this.getDrawEntity(true);
				entity.width = end.x - entity.x;
				entity.height = end.y - entity.y;
				break;
			case actionStatus.MOTION:
				addCommand(commandConstant.MOTIONCOMMAND,gp,{decorator:decorator,p:end});
				//gp.moveMotionAnchor(decorator,end,runtime);
				break;
			case actionStatus.ROTATING:
			case actionStatus.POLEMOVING:
				if(status == actionStatus.ROTATING){
					rotator.angle = geometry.angle({x:pole.x,y:pole.y - runtime.getContext().getParamsCtrl().getRotateDistance()},pole,this._end);
					addCommand(commandConstant.ROTATECOMMAND,gp,rotator);
					//gp.setRotator(rotator,runtime);
				}else{
					decorator.pole = rotator.coordinate = end;
					gp.setRotator(rotator,runtime);
				}
				break;
			case actionStatus.NONE:
			default:
				update = false;
				break;
		}
		update && this.draw();
	},
	/*void*/doMouseDown:function(e){
		this.inherited(arguments);
		var start = this.fetchCoordinate(e),
			status = this.getActionStatus(),
			entity;
		if(status == actionStatus.DRAWING || status == actionStatus.SELECTING || status == actionStatus.TEXT){
			entity = this.getDrawEntity(true);
			entity.x = start.x;
			entity.y = start.y;
		}
		this._start = start;
	},
	/*void*/doMouseOver:function(e){
		this.inherited(arguments);
	},
	/*void*/doMouseUp:function(e){
		var marks = this._marks,
			runtime = this.getRuntime(),
			astatus = this.getActionStatus(),
			isSelect = (astatus == actionStatus.DRAWING || astatus == actionStatus.TEXT)?false:true,
			relationCtrl = drawboard.relationController,
			gp = this.getActive(),
			decorator = this.getDecorate();
		gp && (gp.normalize(decorator,runtime));
		if(gp && relationCtrl.containRestrain(gp,decorator,runtime)){
			this.addCommand(constant.Command.ADDVSDELTECONSTRAINCOMMAND,relationCtrl,[{restrainedGp:gp,restrainedD:decorator}],true);
		}
		if(marks){
			var temps = [];
			dojo.forEach(marks,function(mark){
				if(!relationCtrl.containRestrain(mark.restrainedGp,mark.restrainedD,runtime)){
					temps.push(mark);
				}
			},this);
			(temps.length > 0) && this.addCommand(constant.Command.ADDVSDELTECONSTRAINCOMMAND,relationCtrl,temps);
		}
		if(this._status == actionStatus.TEXT){
			var entity = this.getDrawEntity(),
				textBoard = this.getTextBoard();
			textBoard.clearText();
			textBoard.show(entity);
			this.setDrawType("drawboard.graph.strategy.TextStrategy");
		}
		this.getRuntime().getContext().getStyleCtrl().setActives(null);
		this._start = null;
		this._end = null;
		this._marks = null;
		this.clearDrawEntity(isSelect);
		this.inherited(arguments);
		this.clearCommand();
		this.draw();
		dojo.publish("/drawboard/mouseup");
	}
});
})();

}

if(!dojo._hasResource["drawboard.container.LayoutContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.container.LayoutContainer"] = true;
/*
 *this container control the layout of the graph
 *the graph layout is according to the index of graph in array
 */
dojo.provide("drawboard.container.LayoutContainer");


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

}

if(!dojo._hasResource["drawboard.graph.strategy.GraphStrategyFactory"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.strategy.GraphStrategyFactory"] = true;
dojo.provide("drawboard.graph.strategy.GraphStrategyFactory");

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

}

if(!dojo._hasResource["drawboard.controller.RelationController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.controller.RelationController"] = true;
dojo.provide("drawboard.controller.RelationController");




(function(){
var symbol = drawboard.Constant.Symbol,
	hasAttr = common.utils.CollectionUtils.hasAttr;
dojo.declare("drawboard.controller.RelationController",[common.container.MapContainer,common.Cache],{
	/**
	 *	add listener
	 * @param gp			the graph proxy which contain the parameter d
	 * @param d				the decorate of mark
	 * @param restrainedGp  restrained graph proxy to the another graph proxy which contain the mark decorate
	 * @param restrainedGp	restrained decorate of graph proxy to the another graph proxy which contain the mark decorate
	 * @param runtime
	 */
	/*void*/addListener:function(/*GraphProxy*/gp,/*Decorate*/d,/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var idty = gp.getIdty(),
			relation = this.getItem(idty),item,
			exist = false,
			symbolStr = d.getType() + symbol.concat + d.getIndex();
		if(!relation){
			relation = {};
			this.addItem(idty,relation);
		}
		item = relation[symbolStr];
		if(!item){
			item = [];
			relation[symbolStr] = item;
		}
		dojo.some(item,function(i){
			if(i.gp == restrainedGp){
				exist = true;
				return true;
			}
		},this);
		if(!exist){
			item.push({gp:restrainedGp,decorate:restrainedD});
			this.addRestrainedCache(gp, d, restrainedGp, restrainedD,runtime);
		}
	},
	/**
	 * remove listener according to the restrained proxy graph,if decorate exist,will remove relation by the decorate,otherwize
	 * remove all relation of the proxy graph
	 *@param restrainedGp	proxy graph which be contrained by the mark decorate
	 *@param restrainedD	the decorate of the proxy graph above
	 *@param runtime
	 */
	/*void*/removeListener:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var restraineds = this.removeRestrainedCache(restrainedGp, restrainedD,runtime),relation,item,symbolStr,dels,id;
		dojo.forEach(restraineds,function(item){
			id = item.id;
			relation = this.getItem(id);
			if(!relation){
				return;
			}
			dels = [];
			symbolStr = item.decorate.getType() + symbol.concat + item.decorate.getIndex();
			item = relation[symbolStr];
			dojo.forEach(item,function(restrained,index){
				if(restrained.gp != restrainedGp){
					return;
				}
				if(!restrainedD || (restrainedD && restrained.decorate.equal(restrainedD))){
					dels.push(index);
				}
			},this);
			dojo.forEach(dels.reverse(),function(index){
				item.splice(index,1);
			},this);
			delete relation[symbolStr];
			if(!hasAttr(relation)){
				this.removeItem(id);
			}
		},this);
	},
	
	/*void*/fireEvent:function(/*String*/idty,/*Decorate*/d,/*Array*/params,/*ExecuteRuntime*/runtime,/*Function*/isUpdateFunct){
		var relation = this.getItem(idty),item,temp;
		if(!relation){return;}
		item = relation[d.getType() + symbol.concat + d.getIndex()];
		item && dojo.forEach(item,function(i){
			if(isUpdateFunct && !isUpdateFunct(i.gp)){
				return;
			}
			temp = params.concat();
			temp.unshift(i.decorate);
			temp.push(null);
			temp.push(runtime);
			i.gp.sizeChange.apply(i.gp,temp);
		},this);
	},
	/*void*/addRestrainedCache:function(/*GraphProxy*/gp,/*Decorate*/d,/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var idty = gp.getIdty(),
			cache = this.getCache(runtime),
			restrained = cache[restrainedGp.getIdty()],
			symbolStr = restrainedD.getType() + symbol.concat + restrainedD.getIndex();
		if(!restrained){
			restrained = {};
			cache[restrainedGp.getIdty()] = restrained;
		}
		!restrained[symbolStr] &&(restrained[symbolStr] = {id:idty,gp:gp,decorate:d,restrainedGp:restrainedGp,restrainedD:restrainedD});
	},
	/*boolean*/containRestrain:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var restrains = this.getRestrainedCache(restrainedGp,restrainedD,runtime);
		if(restrains && restrains.length > 0){
			return true;
		}
		return false;
	},
	/*Array<{id:idty,gp:GraphProxy,decorate:d}>*/getRestrainedCache:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),restrained = cache[restrainedGp.getIdty()],restraineds;
		if(!restrained){return restraineds;}
		if(restrainedD){
			var symbolStr = restrainedD.getType() + symbol.concat + restrainedD.getIndex();
			restrained[symbolStr] && (restraineds = [restrained[symbolStr]]);
			return restraineds;
		}
		restraineds = [];
		for(var dIdty in restrained){
			restraineds.push(restrained[dIdty]);
		}
		return restraineds;
	},
	/*Array<{id:idty,decorate:d}>*/removeRestrainedCache:function(/*GraphProxy*/restrainedGp,/*Decorate*/restrainedD,/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),restrained = cache[restrainedGp.getIdty()],restraineds;
		if(!restrained){return restraineds;}
		if(restrainedD){
			var symbolStr = restrainedD.getType() + symbol.concat + restrainedD.getIndex();
			restrained[symbolStr] && (restraineds = [restrained[symbolStr]]);
			delete restrained[symbolStr];
			if(!hasAttr(restrained)){
				delete cache[restrainedGp.getIdty()];
			}
			return restraineds;
		}
		restraineds = [];
		for(var dIdty in restrained){
			restraineds.push(restrained[dIdty]);
		}
		delete cache[restrainedGp.getIdty()];
		return restraineds;
	},
	/**
	 * create cache by subclass
	 */
	/*Object*/createCache:function(){
		return {};
	}
});
if(drawboard.relationController == null){
	drawboard.relationController = new drawboard.controller.RelationController();
}
})();

}

if(!dojo._hasResource["drawboard.graph.decorate.Decorator"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.Decorator"] = true;
dojo.provide("drawboard.graph.decorate.Decorator");

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

}

if(!dojo._hasResource["drawboard.graph.decorate.Mark"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.Mark"] = true;
dojo.provide("drawboard.graph.decorate.Mark");




(function(){
var constant = drawboard.Constant;
dojo.declare("drawboard.graph.decorate.Mark",drawboard.graph.decorate.Decorator,{
	/*Constant*/_type:constant.Decorate.MARK,
	/**
	 * draw the skeleton
	 */
	/*void*/draw:function(/*Graphic*/gp,/*String*/style,/*ExecuteRuntime*/runtime){
		var p = this.getCoordinate(),
			path = constant.Path,
			paths = [
			        {command:path.MOVE,points:p[0]},
			        {command:path.LINE,points:p[1]},
			        {command:path.MOVE,points:p[2]},
			        {command:path.LINE,points:p[3]},
			        ];
		gp.drawPath(paths,style,true);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.GraphProxy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.GraphProxy"] = true;
dojo.provide("drawboard.graph.GraphProxy");








/**
 * we can get the rotator of graph status instance,by it only cause the start coordinate of graph change.
 * any other graph content will change by the rotator of the same angle with before,but pole is the center of the graph.
 */
(function(){
var constant = drawboard.Constant,
	decorateConstant = constant.Decorate,
	graphStrategyFactory = drawboard.GraphStrategyFactory,
	geometry = common.calc.Geometry,
	divide = geometry.dividePoint,
	add = geometry.add2Points,
	subtract = geometry.subtract2Points,
	rotate = geometry.rotation;
dojo.declare("drawboard.graph.GraphProxy",null,{
	/*GraphStatus*/_graphStatus:null,
	/*String*/_graphStrategyClass:null,
	/*boolean*/_isActive:false,
	/*boolean*/_isActived:false,
	/*boolean*/_isComposite:false,
	/*boolean*/_showMark:false,				//show mark in the graph shown,for selecting operation this value will be false
	
	/*void*/constructor:function(/*GraphStatus*/graphStatus,/*String*/graphStrategyClass){		
		graphStrategyClass = dojo.trim(graphStrategyClass);
		//dojo.require(pgraphStrategyClass);	
		this._graphStrategyClass = graphStrategyClass;
		this._graphStatus = graphStatus;
	},
	/*GraphStrategy*/getGraphStrategy:function(){
		return graphStrategyFactory.getGraphStrategy(this.getGraphStrategyClass());
	},
	/*String*/getGraphStrategyClass:function(){
		if(!this._graphStrategyClass){
			new common.exception.Exception({msg:"graph proxy must have an graph strategy class!"});
		}
		return this._graphStrategyClass;
	},
	/*GraphStatus*/getGraphStatus:function(){
		if(!this._graphStatus){
			new common.exception.Exception({msg:"graph status proxy must have an graph status instance!"});
		}
		return this._graphStatus;
	},
	/*void*/setRatio:function(/*Double*/ratio){
		return this.getGraphStatus().setRatio(ratio);
	},
	/*Double*/getRatio:function(){
		return this.getGraphStatus().getRatio();
	},
	/*void*/setText:function(/*String*/text){
		this.getGraphStatus().setText(text);
	},
	/*String*/getText:function(){
		return this.getGraphStatus().getText();
	},
	/*boolean*/isComposite:function(){
		return this._isComposite;
	},
	/*boolean*/showMark:function(/*boolean*/showMark){
		if(showMark !== undefined){
			this._showMark = showMark;
		}
		return this._showMark;
	},
	/**
	 * get the graph identity
	 */
	/*String*/getIdty:function(){
		return this.getGraphStatus().getIdty();
	},
	/*boolean*/isActive:function(/*boolean*/active){
		if(active !== null && active !== undefined){
			this._isActive = active;
		}
		return this._isActive;
	},
	/*boolean*/isActived:function(/*boolean*/active){
		if(active !== null && active !== undefined){
			this._isActived = active;
		}
		return this._isActived;
	},
	/**
	 * get the center coordinate in the graph
	 */
	/*CoordinateFormatter*/getCenter:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			center = cache[decorateConstant.CENTER];
		if(!center){
			var gs = this.getGraphStatus(),
				c = gs.getCoordinate(runtime),
				w = gs.getWidth(runtime),
				h = gs.getHeight(runtime);
			cache[decorateConstant.CENTER] = center = {x:c.x + (w>>1),y:c.y + (h>>1)};
		}
		return center;
	},
	/**
	 * get the start coordinate
	 */
	/*CoordinateFormatter*/getCoordinate:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getCoordinate(runtime);
	},
	/**
	 * set the start coordinate
	 */
	/*void*/setCoordinate:function(/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		this.getGraphStatus().setCoordinate(coordinate,runtime);
	},
	/**
	 * the pole of rotator will get by the rate of width
	 */
	/*void*/reset:function(/*CoordinateFormatter*/delta,/*ExecuteRuntime*/runtime){
		var gs = this.getGraphStatus(),
			marks = gs.getMarks(runtime),
			motionAnchors = gs.getMotionAnchors(runtime);
//		delta = divide([delta],runtime.getContext().getZoom())[0];
		if(marks){
			dojo.forEach(marks,function(item){
				if(item){
					item.x += delta.x;
					item.y += delta.y;
				}
			},this);
			gs.setMarks(marks,runtime);
		}
		if(motionAnchors && !gs.isAffectedByZoom()){
			dojo.forEach(motionAnchors,function(mitem){
				if(mitem){
					mitem.x += delta.x;
					mitem.y += delta.y;
				}
			},this);
			gs.setMotionAnchors(motionAnchors,runtime);
		}
	},
	/**
	 * get the graph's width
	 */
	/*void*/getWidth:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getWidth(runtime);
	},
	/**
	 * set the graph's width
	 */
	/*void*/setWidth:function(/*Double*/w,/*ExecuteRuntime*/runtime){
		this.getGraphStatus().setWidth(w,runtime);
	},
	/**
	 * get the graph's height
	 */
	/*void*/getHeight:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getHeight(runtime);
	},
	/**
	 * set the graph's height
	 */
	/*void*/setHeight:function(/*Double*/h,/*ExecuteRuntime*/runtime){
		this.getGraphStatus().setHeight(h,runtime);
	},
	/**
	 * set rotator
	 */
	/*void*/setRotator:function(/*Rotator*/rotator,/*ExecuteRuntime*/runtime,/*boolean*/maintain){
		var gs = this.getGraphStatus(),
			gRotator = gs.getRotator();
		//the pole of the rotator may be not exist.
		(!gRotator)&&(gRotator = {angle:0});
		if(rotator.angle != gRotator.angle){
			gRotator.angle = rotator.angle;
		    gs.setRotator(gRotator);
		}else{
		    
		}
		!maintain && this.refresh(runtime);
	},
	/**
	 * get the graph's rotate information
	 */
	/*RotatorFormatter*/getRotator:function(/*ExecuteRuntime*/runtime){
		var gs = this.getGraphStatus(),
			rotator = gs.getRotator(),
			coordinate = gs.getCoordinate(runtime),
			h = gs.getHeight(runtime),
			w = gs.getWidth(runtime);
		return  {coordinate:{x:coordinate.x + (w>>1),y:coordinate.y + (h>>1)},angle:rotator?rotator.angle:0};
	},
	/**
	 * get the graph's rotate information,only for graph drawing according to the center of graph.
	 */
	/*RotatorFormatter*/getGraphRotator:function(/*ExecuteRuntime*/runtime){
		var gs = this.getGraphStatus(),
			strategy = this.getGraphStrategy(),
			angle = gs.getRotateAngle(),
			center = this.getCenter(runtime);
		if(!strategy.hasRotator()){
			return {coordinate:strategy.getRotatorCoordinate(this,runtime)||center,angle:angle};
		}
		return {coordinate:center,angle:angle};
	},
	/**
	 * get the graph's marks
	 */
	/*Array<CoordinateFormatter>*/getRealMarks:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStatus().getMarks(runtime);
	},
	/**
	 * get the graph's motion anchor
	 */
	/*Array<Object>*/getRealMotionAnchors:function(/*ExecuteRuntime*/runtime){
		return  this.getGraphStatus().getMotionAnchors(runtime); 
	},
	/**
	 * get resource url
	 */
	/*String*/getUrl:function(){
		return this.getGraphStatus().getUrl();
	},
	/**
	 * only for the composite proxy to fix position to the north west corner coordinate.
	 * @param runtime
	 * @returns
	 */
	/*CoordinateFormatter*/getNWCoordinate:function(/*ExecuteRuntime*/runtime){
		var rotator = this.getGraphRotator(runtime),
			pole = rotator.coordinate,
			a = rotator.angle;
		return rotate(this.getCoordinate(runtime),pole,a);
	},
	/**
	 * only for the composite proxy to fix position to the south east corner coordinate.
	 * @param runtime
	 * @returns
	 */
	/*CoordinateFormatter*/getSECoordinate:function(/*ExecuteRuntime*/runtime){
		var rotator = this.getGraphRotator(runtime),
			pole = rotator.coordinate,
			a = rotator.angle,
			coordinate = this.getCoordinate(runtime),
			w = this.getWidth(runtime),
			h = this.getHeight(runtime);
		return rotate({x:coordinate.x + (w>>1),y:coordinate.y + (h>>1)},pole,a);
	},
	/**
	 * get the coordinates,and then calculate the four corner of the point.
	 */
	/*Array<DecorateCoordinateFormatter>*/getCoordinatesByDeal:function(/*Function*/coordinatesGet,/*ExecuteRuntime*/runtime){
		var	coordinates = coordinatesGet(this,runtime);
		if(!coordinates || coordinates.length == 0){return null;}
		var r = runtime.getDistance(),
			rotator = this.getGraphRotator(runtime),
			pole = rotator.coordinate,
			copy4Attrs = common.utils.CollectionUtils.copy4Attrs,
			a = rotator.angle,p = coordinates[0],
			delta,temp;
		temp = rotate(p,pole,a);
		copy4Attrs(p,temp,{x:1,y:1});
		coordinates[0] = [temp,
		                //west north corner
						rotate({x:p.x - r,y:p.y - r},pole,a),
						//east north corner
				        rotate({x:p.x + r,y:p.y - r},pole,a),
				        //east south corner
				        rotate({x:p.x + r,y:p.y + r},pole,a),
				        //west south corner
				        rotate({x:p.x - r,y:p.y + r},pole,a)];
		dojo.forEach(coordinates,function(point,index){
			if(index != 0){
				temp = rotate(point,pole,a);
				copy4Attrs(point,temp,{x:1,y:1});
				delta = subtract(temp,coordinates[0][0]);
				coordinates[index] = [temp,
				                    add(coordinates[0][1],delta),
				                    add(coordinates[0][2],delta),
				                    add(coordinates[0][3],delta),
				                    add(coordinates[0][4],delta)];
			}
		},this);
		return coordinates;
	},
	/**
	 * calculate the graph' coordinate,will be call by the strategy
	 */
	/*Array<DecorateCoordinateFormatter>*/getGraphCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			graphCache = cache[decorateConstant.Graph];
		if(!graphCache){
			var graphStrategy = this.getGraphStrategy(),
				rotator = this.getGraphRotator(runtime),
				pole = rotator.coordinate,
				a = rotator.angle,
				coordinates = graphStrategy.getGraphCoordinates(this,runtime);
			dojo.forEach(coordinates,function(item,index){
				coordinates[index] = rotate(item,pole,a);
			},this);
			cache[decorateConstant.Graph] = coordinates;
			return coordinates;
		}
		return graphCache;
	},
	/**
	 * calculate the skeletons' coordinate,will be call by the controller
	 */
	/*Array<DecorateCoordinateFormatter>*/getSkeletonCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			skeletonsCache = cache[decorateConstant.SKELETON];
		if(!skeletonsCache){
			var graphStrategy = this.getGraphStrategy(),
			 	skeletons = this.getCoordinatesByDeal(graphStrategy.getSkeletonCoordinates,runtime);
			cache[decorateConstant.SKELETON] = skeletons;
			return skeletons;
		}
		return skeletonsCache;
	},
	/**
	 * fetch the marks' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMarkCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			marksCache = cache[decorateConstant.MARK];
		if(!marksCache){
			var graphStrategy = this.getGraphStrategy(),
				marks = this.getCoordinatesByDeal(graphStrategy.getMarkCoordinates,runtime);
			cache[decorateConstant.MARK] = marks;
			return marks;
		}
		return marksCache;
	},
	/**
	 * get the outlet of the graph
	 */
	/*Array<DecorateCoordinateFormatter>*/getOutletCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			outletCache = cache[decorateConstant.OUTLET];
		if(!outletCache){
			var outlet = new drawboard.graph.strategy.RectangleStrategy(),
				coordinates = outlet.getGraphCoordinates(this,runtime),
				rotator = this.getGraphRotator(runtime),
				pole = rotator.coordinate,
				a = rotator.angle;
			dojo.forEach(coordinates,function(item,index){
				coordinates[index] = rotate(item,pole,a);
			},this);
			cache[decorateConstant.OUTLET] = coordinates;
			return coordinates;
		}
		return outletCache;
	},
	/**
	 * whether or not the rotator is shown 
	 */
	/*boolean*/hasRotator:function(){
		return this.getGraphStrategy().hasRotator();
	},
	/**
	 * get the graph's rotate information
	 */
	/*RotatorFormatter*/getRotatorCoordinates:function(/*ExecuteRuntime*/runtime){
		if(!this.hasRotator()){
			return null;
		}
		var cache = this.getCache(runtime),
			rotatorCache = cache[decorateConstant.ROTATOR];
		if(!rotatorCache){
			var r = runtime.getDistance(),
				d = runtime.getRotateDistance(),
				rotator = this.getRotator(runtime),
				pole = rotator.coordinate,
				a = rotator.angle,
				start = this.getCoordinate(runtime),
				cross = {x:pole.x,y:start.y},
				rotatorCenter = this.getGraphRotator(runtime).coordinate,
				distant = geometry.getDistant(pole,rotate(cross,rotatorCenter,a)),
				handerOuter;
			(distant > 0) && (d += distant);
			handerOuter = rotate({x:pole.x,y:pole.y - d - r},pole,a);
			rotatorCache = [
			        //handler outer circle center
			        geometry.intersectCircleLine(handerOuter,r,handerOuter,{x:handerOuter.x,y:handerOuter.y + 10})[0],
			        //line coordinate near the handler outer circle
			        rotate({x:pole.x,y:pole.y - d},pole,a),
			        //line another coordinate
			        rotate({x:pole.x,y:pole.y - r},pole,a),
			        //handler inner circle center
			        {x:pole.x,y:pole.y},
			        //for isIn function line near the handler inner circle
			        rotate({x:pole.x,y:pole.y - 2 * r},pole,a),
			        // for isIn function handler outer circle center
			        handerOuter
		            ];
			cache[decorateConstant.ROTATOR] = rotatorCache;
			return rotatorCache;
		}
		return rotatorCache;
	},
	/**
	 * fetch the motion anchors' coordinate,will be call by the controller
	 */
	/*Array<CoordinateFormatter>*/getMotionAnchorCoordinates:function(/*ExecuteRuntime*/runtime){
		var cache = this.getCache(runtime),
			motionAnchorCache = cache[decorateConstant.MOTIONANCHOR];
		if(!motionAnchorCache){
			var graphStrategy = this.getGraphStrategy(),
				motionAnchors = this.getCoordinatesByDeal(graphStrategy.getMotionAnchorCoordinates,runtime);
			cache[decorateConstant.MOTIONANCHOR] = motionAnchors;
			return motionAnchors;
		}
		return motionAnchorCache;
	},
	/**
	 * reset cache,and notify the listener.
	 */
	/*void*/refresh:function(/*ExecuteRuntime*/runtime,/*Function*/funct){
		//now only listen to the mark changes.
		var marksCache = this.getMarkCoordinates(runtime),marks,delta;
		this.clearCache(runtime);
		this.getSkeletonCoordinates(runtime);
		this.getMotionAnchorCoordinates(runtime);
		//listen to the mark changes.
		marks = this.getMarkCoordinates(runtime);
		dojo.forEach(marksCache,function(item,index){
			if(item[0] != marks[index][0]){
				delta = subtract(marks[index][0],item[0]);
				drawboard.relationController.fireEvent(this.getIdty(),new drawboard.graph.decorate.Mark({coordinate:[item[1],item[3],item[2],item[4]],index:index}),[delta],runtime,funct);
			}
		},this);
	},
	/**
	 * according to the instance to choose difference class
	 */
	/*Object*/getCache:function(/*ExecuteRuntime*/runtime){
		return runtime.getCache(this);
	},
	/**
	 * clear cache
	 */
	/*void*/clearCache:function(/*ExecuteRuntime*/runtime,/*Constant*/type){
		runtime.clearCache(this,type);
	},
	/**********************************************************************************************
	 * 										Action
	 **********************************************************************************************/
	/**
	 * draw the graph
	 */
	/*void*/draw:function(/*ExecuteRuntime*/runtime){
		this.getGraphStrategy().draw(this,runtime.getGraphic(),runtime);
		if(this.isActived()){
			var p = drawboard.Constant.Path,
				cache = this.getOutletCoordinates(runtime);
			runtime.getGraphic().drawPath([
					//west north corner
					{command:p.MOVE,points:cache[0]},
					//east north corner
					{command:p.LINE,points:cache[1]},
					//east south corner
					{command:p.LINE,points:cache[2]},
					//west south corner
					{command:p.LINE,points:cache[3]}
		            ],"fill:none;stroke:red;stroke-width:2");
		}
	},
	//something is wrong with size change method,will modify to zoom out or zoom in
	/**
	 * reset the graph size
	 * if the end doesn't exist,the start is a delta data
	 */
	/*void*/sizeChange:function(/*Decorate*/decorate,/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		var graphStrategy = this.getGraphStrategy(),
			grotator = this.getGraphRotator(runtime),
			gpole = grotator.coordinate,
			a = grotator.angle,
			delta = start,
			gp = this,
			hasRotator = graphStrategy.hasRotator(),oriFixObj = {};
		if(end !== null && end !== undefined){
			delta = subtract(end,start);
			if(hasRotator){
				var direct = decorate.getDirect(),
					d = constant.Direction,
					coordinate = this.getCoordinate(runtime),
					skeletons = this.getSkeletonCoordinates(runtime),oriFixPos,oriFixFunct;
				switch(direct){
					case d.NORTH:
					case d.WEST:
					case d.WESTNORTH:
						oriFixPos = skeletons[3][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							gp.setCoordinate(add(coordinate,subtract(rotate(pos,p,-a),{x:coordinate.x + gp.getWidth(runtime),y:coordinate.y + gp.getHeight(runtime)})),runtime);
						};
						break;
					case d.EASTNORTH:
						oriFixPos = skeletons[2][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							gp.setCoordinate(add(coordinate,subtract(rotate(pos,p,-a),{x:coordinate.x,y:coordinate.y + gp.getHeight(runtime)})),runtime);
						};
						break;
					case d.WESTSOUTH:
						oriFixPos = skeletons[1][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							gp.setCoordinate(add(coordinate,subtract(rotate(pos,p,-a),{x:coordinate.x + gp.getWidth(runtime),y:coordinate.y})),runtime);
						};
						break;
					case d.SOUTH:
					case d.EAST:
					case d.EASTSOUTH:
						oriFixPos = skeletons[0][0];
						oriFixFunct = function(/*CoordinateFormatter*/pos,/*CoordinateFormatter*/p,/*Double*/a){
							pos = rotate(pos,p,-a);
							gp.setCoordinate(pos,runtime);
						};
						break;
					case d.END:
						break;
					default:
						break;
				}
				
				oriFixObj.oriFixPos = oriFixPos;
				oriFixObj.oriFixFunct = oriFixFunct;
				start = rotate(start,gpole,-a);
				end = rotate(end,gpole,-a);
				delta = subtract(end,start);
			}
		}
		graphStrategy.sizeChange(this,decorate,delta,runtime);
		if(hasRotator && a!=0 && oriFixObj !== undefined){
			this.clearCache(runtime,decorateConstant.CENTER);
			var npole = rotate(this.getCenter(runtime),gpole,a);
			oriFixObj.oriFixFunct(oriFixObj.oriFixPos,npole,a);
		}
		this.refresh(runtime);
	},
	/**
	 * this function will be called in case of mouse up event call
	 */
	/*void*/normalize:function(/*Decorator*/decorator,/*ExecuteRuntime*/runtime){
		var isRefresh = this.getGraphStrategy().normalize(this,decorator,runtime);
		isRefresh && this.refresh(runtime);
	},
	/**
	 * move the graph position
	 */
	/*void*/move:function(/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		var preCoordinate = this.getCoordinate(runtime),
			delta = subtract(end,start);
		this.setCoordinate({x:preCoordinate.x + delta.x,y:preCoordinate.y + delta.y},runtime);
		this.reset(delta,runtime);
		this.refresh(runtime);
	},
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate,/*ExecuteRuntime*/runtime){
		this.refresh(runtime,function(){return false;});
	},
	/**
	 * move the motion anchor in the graph
	 */
	/*void*/moveMotionAnchor:function(/*MotionAnchor*/anchor,/*CoordinateFormatter*/point,/*ExecuteRuntime*/runtime){
		var motionAnchor = this.getGraphStrategy().calcMotionAnchor(this,anchor,point,runtime),
			motionAnchors = this.getRealMotionAnchors(runtime);
		(anchor.getIndex() < motionAnchors.length) && (motionAnchor != null) &&(motionAnchors[anchor.getIndex()] = motionAnchor);
		this.refresh(runtime);
	},
	/*GraphProxy*/active:function(/*CoordinateFormatter*/p,/*ExecuteRuntime*/runtime){
		if(this.getGraphStrategy().isIn(this,p,runtime)){
			return this;
		}
		return null;
	},
	/*Array<Decorate<Skeleton>>*/getActiveAnchors:function(/*ExecuteRuntime*/runtime){
		return this.getGraphStrategy().getActiveAnchors(this,runtime);
	},
	/*boolean*/isAnchor:function(/*Decorate*/d){
		return this.getGraphStrategy().isAnchor(d);
	},
	/*void*/deleteAll:function(/*DrawBoard*/db,/*ExecuteRuntime*/runtime){
		this.destroy(runtime);
	},
	/**
	 * destroy self
	 */
	/*void*/destroy:function(/*ExecuteRuntime*/runtime){
		drawboard.relationController.removeListener(this,null,runtime);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.CompositeProxy"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.CompositeProxy"] = true;
dojo.provide("drawboard.graph.CompositeProxy");



(function(){
/**
 *	GraphItemFormatter:{
 *		gp:GraphProxy,
 *		oriPos:CoordinateFormatter,
 *		oriRotator:RotatorFormatter
 *	}
 * 
 */
var geometry = common.calc.Geometry,
	add = geometry.add2Points,
	subtract = geometry.subtract2Points,
	dConstant = drawboard.Constant.Decorate;
dojo.declare("drawboard.graph.CompositeProxy",[common.container.ListContainer,drawboard.graph.GraphProxy],{
	/*boolean*/_focus:false,		//if it is true,this composite proxy has been focus,maybe the child is focus.
	/*boolean*/_isComposite:true,
	/*boolean*/_operate:false,
	/*boolean*/isFocus:function(/*boolean*/focus){
		if(focus !== undefined){
			this._focus = focus;
		}
		return this._focus;
	},
	/*boolean*/contains:function(/*GraphProxy*/gp){
		if(!gp){
			return false;
		}
		var exist = false;
		this.some(function(/*GraphItemFormatter*/item){
			if(item.gp == gp){
				exist = true;
				return true;
			}
		},this);
		return exist;
	},
	/*void*/remove:function(/*GraphProxy*/gp){
		var index;
		this.some(function(/*GraphItemFormatter*/item,i){
			if(item.gp == gp){
				index = i;
				return true;
			}
		},this);
		drawboard.graph.CompositeProxy.superclass.remove.apply(this,[index]);
	},
	/*boolean*/equals:function(/*CompositeProxy*/cp){
		if(cp.size() != this.size()){
			return false;
		}
		var same = true;
		this.some(function(/*GraphItemFormatter*/item){
			if(!cp.contains(item.gp)){
				same = false;
				return true;
			}
		},this);
		return same;
	},
	/*void*/resetRelations:function(){
		var that = this,parent,gp;
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			parent = (gp.getParent && gp.getParent());
			if(parent != that){
				parent && parent.remove(gp);
				gp.getParent = function(){
					return that;
				};
			}
		},this);
	},
	/**
	 * add children
	 */
	/*void*/add:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		drawboard.graph.CompositeProxy.superclass.add.apply(this,[{gp:gp,oriPos:gp.getCoordinate(runtime),oriRotator:dojo.clone(gp.getRotator(runtime))}]);
		if(geometry.graphContainsGraph(this.getSkeletonCoordinates(runtime),gp.getSkeletonCoordinates(runtime))){
			return;
		}
		var rect = geometry.getMaxRect(gp.getSkeletonCoordinates(runtime).concat(this.getSkeletonCoordinates(runtime)));
		this.setCoordinate({x:rect.x,y:rect.y},runtime);
		this.setWidth(rect.width,runtime);
		this.setHeight(rect.height,runtime);
		this.refresh(runtime);
	},
	/**
	 * set rotator
	 */
	/*void*/setRotator:function(/*Rotator*/rotator,/*ExecuteRuntime*/runtime,/*boolean*/maintain){
		this._operate = true;
		var r = this.getRotator(runtime),fixCoordinate,
			rotate = geometry.rotation,
			deltaAngle = rotator.angle - r.angle,
			contains = dojo.hitch(this,this.contains),
			graphs = [];
		this.inherited(arguments);
		if(maintain){return;}
		this.recursiveChild(graphs);
		dojo.forEach(graphs,function(/*GraphProxy*/gp){
			r = gp.getGraphRotator(runtime);
			r.angle += deltaAngle;
			fixCoordinate = gp.getNWCoordinate(runtime);
			fixCoordinate = rotate(rotate(fixCoordinate,rotator.coordinate,deltaAngle),rotate(r.coordinate,rotator.coordinate,deltaAngle),-r.angle);
			gp.setCoordinate(fixCoordinate,runtime);
			gp.setRotator(r,runtime,true);
			gp.refresh(runtime,function(/*GraphProxy*/gItem){
				if(contains(gItem)){
					return false;
				}
				return true;
			});
		},this);
		this._operate = false;
	},
	/*void*/recursiveChild:function(/*Array*/graphs){
		var gp;
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			graphs.push(gp);
			if(gp.recursiveChild){
				gp.recursiveChild(graphs);
				return;
			}
		},this);
	},
	/**
	 * delete operation call
	 * @param db
	 */
	/*void*/deleteAll:function(/*DrawBoard*/db){
		this.forInItems(function(/*GraphItemFormatter*/item){
			db.removeGraph(item.gp);
		},this);
		this.destroy();
	},
	/**
	 * destroy self
	 */
	/*void*/destroy:function(){
		this.inherited(arguments);
		var gp;
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			gp.getParent && (gp.getParent() == this) &&(delete gp.getParent);
		},this);
	},
	/**********************************************************************************************
	 * 										Action
	 **********************************************************************************************/
	/**
	 * draw the graph
	 */
	/*void*/draw:function(/*ExecuteRuntime*/runtime){
		this.inherited(arguments);
	},
	/**
	 * reset the graph size
	 * it is different with GraphProxy,the end paramter must exist 
	 */
	/*void*/sizeChange:function(/*Decorate*/decorate,/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		this._operate = true;
		var w = this.getWidth(runtime),
			h = this.getHeight(runtime),
			xRate = 1,yRate = 1,
			gp,nw,r,nnw,delta,coordinate,
			rotate = geometry.rotation,
			fixCoordinatePre = this.getSkeletonCoordinates(runtime)[0][0],
			rComposite = this.getRotator(runtime),
			contains = dojo.hitch(this,this.contains);
		this.inherited(arguments);
		xRate = this.getWidth(runtime)/w;
		yRate = this.getHeight(runtime)/h;
		fixCoordinate = this.getSkeletonCoordinates(runtime)[0][0];
		//like a zoom operation
		this.forInItems(function(/*GraphItemFormatter*/item){
			gp = item.gp;
			coordinate = gp.getCoordinate(runtime);
			//north west corner coordinate
			nw = gp.getNWCoordinate(runtime);
			nw = rotate(nw,fixCoordinatePre,-rComposite.angle);
			delta = subtract(nw,fixCoordinatePre);
			nw = rotate(add(fixCoordinatePre,{x:delta.x*xRate,y:delta.y*yRate}),fixCoordinatePre,rComposite.angle);
			nw = add(nw,subtract(fixCoordinate,fixCoordinatePre)); 
			
			gp.setWidth(gp.getWidth(runtime)*xRate,runtime);
			gp.setHeight(gp.getHeight(runtime)*yRate,runtime);
			
			runtime.clearCache(gp,dConstant.CENTER);
			r = gp.getGraphRotator(runtime);
			coordinate = gp.getCoordinate(runtime);
			nnw = rotate(coordinate,r.coordinate,r.angle);
			
			gp.setCoordinate(add(coordinate,subtract(nw,nnw)),runtime);
			gp.refresh(runtime,function(/*GraphProxy*/gItem){
				if(contains(gItem)){
					return false;
				}
				return true;
			});
		},this);
		this._operate = false;
	},
	/**
	 * move the graph position
	 */
	/*void*/move:function(/*CoordinateFormatter*/start,/*CoordinateFormatter*/end,/*ExecuteRuntime*/runtime){
		this._operate = true;
		this.inherited(arguments);
		this.forInItems(function(/*GraphItemFormatter*/item){
			if(item){
				item.oriPos = add(item.oriPos,subtract(end,start));
				item.gp.move(start,end,runtime);
			}
		},this);
		this._operate = false;
	},
	/**
	 * zoom out or zoom in
	 * @param rate
	 * @param runtime
	 */
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate,/*ExecuteRuntime*/runtime){
		this._operate = true;
		this.inherited(arguments);
		this.forInItems(function(/*GraphItemFormatter*/item){
			if(item){
				item.gp.zoom(rate,runtime);
			}
		},this);
		this._operate = false;
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.GraphStatus"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.GraphStatus"] = true;
dojo.provide("drawboard.graph.GraphStatus");




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

}

if(!dojo._hasResource["drawboard.drawProcessor.DrawProcessor"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.drawProcessor.DrawProcessor"] = true;
dojo.provide("drawboard.drawProcessor.DrawProcessor");
dojo.declare("drawboard.drawProcessor.DrawProcessor",null,{
	/*void*/draw:function(/*GraphProxy*/gp,/*ExcuteRuntime*/runtime){
		//draw interface
	}
});

}

if(!dojo._hasResource["drawboard._Selector"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard._Selector"] = true;
dojo.provide("drawboard._Selector");





(function(){
var constant = drawboard.Constant,
	actionStatus = constant.ActionStatus,
	mouseStatus = constant.MouseAction,
	geometry = common.calc.Geometry;
dojo.declare("drawboard._Selector",drawboard.container.LayoutContainer,{
	/*Array*/_events:null,										//store connect events
	/*Constant*/_status:actionStatus.NONE,						//current status when mouse down
	/*Constant*/_mouseStatus:mouseStatus.NONE,
	/*GraphProxy*/_active:null,									//current active graph proxy
	/*Decorate*/_decorate:null,									//current decorate,such as skeleton,mark,rotator
	/*String*/_graphStrategy:null,								//draw type
	/*boolean*/_isMark:false,									//active mark nodes or not
	/*boolean*/_isSelecting:false,								//active select operation
	/*double*/lastScrollTop:0,
	/*double*/lastScrollLeft:0,
	/*{active:GraphProxy,decorate:Decorate,status:Constant}*/cache:null,
	/*void*/postCreate:function(/*Node*/host){
		this._events = [dojo.connect(host,"onmousemove",dojo.hitch(this,"doMouseMove")),
		               dojo.connect(host,"onmousedown",dojo.hitch(this,"doMouseDown")),
		               dojo.connect(host,"onmouseup",dojo.hitch(this,"doMouseUp")),
		               dojo.connect(host,"onmouseover",dojo.hitch(this,"doMouseOver")),
		               dojo.connect(host,"onclick",dojo.hitch(this,"doClick")),
			  		   dojo.connect(host,"ondblclick",dojo.hitch(this,"doDblClick")),
		               dojo.connect(window,"onkeydown",dojo.hitch(this,"doKeyDown")),
			           dojo.connect(window,"onkeyup",dojo.hitch(this,"doKeyUp")),
		               dojo.connect(this.domNode,"onscroll",dojo.hitch(this,"doScroll"))];
		
	},
	/*void*/getStatusCache:function(){
		if(!this.cache){
			this.cache = {};
		}
		return this.cache;
	},
	
	/*void*/setStatusCache:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*Constant*/status){
		var cache = this.getStatusCache();
		gp && (cache.active = gp);
		decorate && (cache.decorate = decorate);
		cache.status = status;
	},
	
	/*void*/setStatus:function(/*GraphProxy*/gp,/*Decorate*/decorate,/*Constant*/status){
		var active = this._active,parent;
		if(active && active != gp){
			parent = active.getParent && active.getParent();
			if(active.isComposite() && !active.contains(gp)){
				active.isFocus(false);
			}
			active.isActive(false);
			if(parent && !parent.contains(gp)){
				parent.isFocus(false);
				parent.isActive(false);
			}
		}
		this._active = gp;
		this._decorate = decorate;
		this._status = status;
		this.updateActive();
	},
	/*void*/updateActive:function(){
		var gp = this.getActive();
		gp && gp.isActive(true) && gp.isComposite() && gp.isFocus(true);
	},
	/**
	 * get status of current mouse status
	 */
	/*Constant*/getMouseStatus:function(){
		return this._mouseStatus;
	},
	/**
	 * set status of current mouse status
	 */
	/*void*/setMouseStatus:function(/*Constant*/status){
		this._mouseStatus = status;
	},
	/**
	 * get status of current action status
	 */
	/*Constant*/getActionStatus:function(){
		return this._status;
	},
	/**
	 * set status of current action status
	 */
	/*void*/setActionStatus:function(/*Constant*/status){
		this._status = status;
	},
	/**
	 * get decorate
	 */
	/*Decorate*/getDecorate:function(){
		return this._decorate;
	},
	/**
	 * set decorate
	 */
	/*void*/setDecorate:function(/*Decorate*/d){
		this._decorate = d;
	},
	/**
	 * get active
	 */
	/*GraphProxy*/getActive:function(){
		return this._active;
	},
	/**
	 * set active
	 */
	/*void*/setActive:function(/*GraphProxy*/gp){
		this._active = gp;
	},
	/**
	 * graph icon click
	 */
	/*void*/setDrawType:function(/*String*/graphStrategy){
		this._graphStrategy = graphStrategy;
		this._isSelecting = false;
		this._isMark = false;
	},
	/**
	 * get draw type
	 */
	/*String*/getDrawType:function(){
		return this._graphStrategy;
	},
	/**
	 * select icon click
	 */
	/*void*/isSelecting:function(/*boolean*/select){
		this._isSelecting = select;
		if(select){
			this._isMark = false;
			this._graphStrategy = null;
		}
	},
	/**
	 * mark icon click
	 */
	/*void*/isMark:function(/*boolean*/mark){
		this._isMark = mark;
		if(mark){
			this._isSelecting = false;
			this._graphStrategy = null;
		}
	},
	
	/******************************************************
	 * 			Event Action
	 *****************************************************/
	/*void*/doClick:function(e){
		this.setMouseStatus(mouseStatus.MOUSECLICK);
	},
	/*void*/doDblClick:function(e){
		var active = this.getActive(),
			text = active && active.getText(),	
			textBoard = this.getTextBoard();
		if(text){
			textBoard.setText(text);
			textBoard.show(active);
		}
	},
	/*void*/doMouseMove:function(e){
		if(this.getMouseStatus() == mouseStatus.MOUSEDOWN){
			var active = this.getActive(),
				cache = this.getStatusCache(),
				cacheActive = cache.active,
				parent = cacheActive && cacheActive.getParent && cacheActive.getParent(),
				relationCtrl = drawboard.relationController,
				decorate = this.getDecorate(),
				runtime = this.getRuntime();
			//active && relationCtrl.containRestrain(active,decorate,runtime) && this.addCommand(constant.Command.ADDVSDELTECONSTRAINCOMMAND,relationCtrl,{restrainedGp:active,restrainedD:decorate},false);
			//active && drawboard.relationController.removeListener(active,this.getDecorate(),this.getRuntime());
			if(cacheActive && cacheActive.isComposite() && active){
				!active.isActive(false) && active.isComposite() && active.isFocus(false);
				cacheActive.isActive(true);
				cacheActive.isFocus(true);
				parent && parent.isFocus(true);
				this._active = cacheActive;
			}
		}
		this.setMouseStatus(mouseStatus.MOUSEMOVE);
	},
	/*void*/doMouseDown:function(e){
		this.getTextBoard().hide();
		var d = drawboard,
			markController = d.markController,
			point = this.fetchCoordinate(e),
			active,
			runtime = this.getRuntime(),
			setActive = dojo.hitch(runtime.getDrawProcessor(),"setActive"),
			selectRect = this.getSelectRect(),
			preActive = this.getActive(),
			status = this._status;
		this.setMouseStatus(mouseStatus.MOUSEDOWN);
		if(status && status == actionStatus.TEXT){
			return;
		}
		//if draw type exist,then current status is drawing
		if(this._graphStrategy){
			this.setStatus(null, null, actionStatus.DRAWING);
			return;
		}
		selectRect && (active = setActive(selectRect,point,this._isMark,markController,runtime));
		//get the graph status information which contains the point
		if(!active){
			//first focus the active graph
			preActive && (active = setActive(preActive,point,this._isMark,markController,runtime));
			(!active) && this.some(function(/*GraphProxy*/gp){
				//if it is mark,then current status is marking
				active = setActive(gp,point,this._isMark,markController,runtime);
				if(active){
					return true;
				}
			},this,true);
		}
		//add select rectangle
		if(this.getActive() && e.ctrlKey && active && active.active){
			active = active.active;
			if(selectRect){
				if(selectRect.contains(active)){
					return;
				}
				selectRect.add(active,runtime);
			}else{
				var preActive = this.getActive();
				if(!preActive){
					return;
				}
				if(preActive.isComposite() && preActive.contains(active)){
					return;
				}
				var rect = geometry.getMaxRect([active.getGraphCoordinates(runtime).concat(preActive.getGraphCoordinates(runtime))]),
					selectRect = new drawboard.graph.CompositeProxy(new drawboard.graph.GraphStatus({_coordinate:{x:rect.x,y:rect.y},_w:rect.width,_h:rect.height}),this.getSRGraphStrategyClass());
				preActive.isActive(false);
				selectRect.add(preActive,runtime);
				selectRect.add(active,runtime);
				this.setSelectRect(selectRect);
				this.setStatus(selectRect, null, actionStatus.MOVING);
			}
			this.draw();
			return;
		}
		if(selectRect){
			if(!active){
				this.setSelectRect(null);
				this.draw();
				return;
			}
			this.setStatus(active.active, active.decorate, active.status);
			return;
		}
		//if the active is null,then the operation is selecting
		if(!active){
			this.setStatus(null, null, actionStatus.SELECTING);
		}else{
			this.setStatus(active.active, active.decorate, active.status);
		}
//		this.draw();
	},
	/*void*/doMouseOver:function(e){
		this.setMouseStatus(mouseStatus.MOUSEOVER);
	},
	/*void*/doMouseUp:function(e){
		this.setMouseStatus(mouseStatus.MOUSEUP);
		this.setStatusCache(this._active, this._decorate, this._status);
		this._status = actionStatus.NONE;
		this._decorate = null;
	},
	/*void*/doKeyDown:function(e){
		var gp = this.getActive(),
			selectRect = this.getSelectRect(),
			keys = dojo.keys,
			commandConstant = constant.Command,
			addCommand = dojo.hitch(this,"addCommand"),
			update = false;
		if(gp && e.keyCode == keys.DELETE && !e.ctrlKey){
			addCommand(commandConstant.CREATEVSDELETECOMMAND,this,gp,true);
			selectRect && this.setSelectRect(null);
			update = true;
		}
		//below is only for test
		if(e.keyCode == keys.UP_ARROW){
			addCommand(commandConstant.ZOOMCOMMAND,this,{x:10,y:10});
			update = true;
		}
		if(e.keyCode == keys.DOWN_ARROW){
			addCommand(commandConstant.ZOOMCOMMAND,this,{x:-10,y:-10});
			update = true;
		}
		if(e.keyCode == 90 && e.ctrlKey){
			this.undo();
			update = true;
		}
		if(e.keyCode == 89 && e.ctrlKey){
			this.redo();
			update = true;
		}
		update && this.draw();
	},
	/*void*/doKeyUp:function(e){
		this.clearCommand();
	},
	/*void*/doScroll:function(/*Event*/e){
		var target = e.target || e.srcElement;
		if(target != this.domNode){
			return;
		}
		var top = target.scrollTop,
			left = target.scrollLeft,
			lastTop = this.lastScrollTop,
			lastLeft = this.lastScrollLeft;
		if(top != lastTop){
			this.fireListener(["doScroll",[false,top - lastTop]]);
			this.lastScrollTop = top;
			return;
		}
		if(left != lastLeft){
			this.fireListener(["doScroll",[true,left - lastLeft]]);
			this.lastScrollLeft = left;
		}
	},
	/*void*/destroy:function(){
		dojo.forEach(this.events,dojo.disconnect);
	}
});
})();

}

if(!dojo._hasResource["drawboard.controller.ParamsController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.controller.ParamsController"] = true;
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

}

if(!dojo._hasResource["drawboard.graph.decorate.controller.Controller"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.controller.Controller"] = true;
//current we only use the get type function
dojo.provide("drawboard.graph.decorate.controller.Controller");

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

}

if(!dojo._hasResource["drawboard.graph.decorate.controller.MarkController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.controller.MarkController"] = true;
dojo.provide("drawboard.graph.decorate.controller.MarkController");




(function(){
var	geometry = common.calc.Geometry;	
dojo.declare("drawboard.graph.decorate.controller.MarkController",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.MARK,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var mCoordinate,
			mark = new drawboard.graph.decorate.Mark(),
			gf = runtime.getGraphic();
		dojo.forEach(gp.getMarkCoordinates(runtime)||[],function(item,index){
			mCoordinate = [item[1],item[3],item[2],item[4]];
			mark.setCoordinate(mCoordinate);
			mark.setIndex(index);
			mark.draw(gf,this.getStyle(gp,mark,runtime),runtime);
		},this);
	},
	
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*Mark*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		var mark;
		dojo.some(gp.getMarkCoordinates(runtime)||[],function(item,index){
			item = [item[1],item[3],item[2],item[4]];
			if(geometry.isPointInPolyn(item,coordinate)){
				mark = new drawboard.graph.decorate.Mark({coordinate:item,index:index,center:item[0]});
				return true;
			}
		},this);
		return mark;
	},
	
	/**
	 * create decorate by coordinates
	 */
	/*Array<Decorate<Mark>>*/create:function(/*Array<Array<CoordinateFormatter>>*/ps){
		var mark,marks = [];
		dojo.forEach(ps||[],function(item,index){
			mark = [item[1],item[3],item[2],item[4]];
			mark = new drawboard.graph.decorate.Mark({coordinate:skeleton,index:index});
			marks.push(mark);
		},this);
		return marks;
	},
	
	/**
	 * whether or not the mark and skeleton cross
	 */
	/*{gp:GraphProxy,d:Decorate,restrainedGp:GraphProxy,restrainedD:Decorate}*/cross:function(/*Decorate<Skeleton>*/s,/*GraphProxy*/cgp,/*DrawBoard*/db,/*ExecuteRuntime*/runtime){
		var marks,skeletonController = drawboard.skeletonController,mark,result = {};
		db.some(function(/*GraphProxy*/gp){
			if(gp == cgp){
				return false;
			}
			marks = gp.getMarkCoordinates(runtime);
			dojo.some(marks||[],function(item,index){
				item = [item[1],item[3],item[2],item[4]];
				dojo.some(item,function(/*CoordinateFormatter*/p){
					if(skeletonController.isIn(s.getCoordinate(),p,runtime)){
						mark = true;
						return true;
					}
				},this);
				if(mark){
					result.d = new drawboard.graph.decorate.Mark({coordinate:item,index:index});
					return true;
				}
			},this);
			if(mark){
				result.gp = gp;
				return true;
			}
		},this,true);
		if(mark){
			result.restrainedGp = cgp;
			result.restrainedD = s;
			return result;
		}
		return null;
	}
});
if(!drawboard.markController){
	drawboard.markController = new drawboard.graph.decorate.controller.MarkController();
}
})();

}

if(!dojo._hasResource["drawboard.graph.decorate.MotionAnchor"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.MotionAnchor"] = true;
dojo.provide("drawboard.graph.decorate.MotionAnchor");


(function(){
var	constant = drawboard.Constant;
dojo.declare("drawboard.graph.decorate.MotionAnchor",drawboard.graph.decorate.Decorator,{
	/*Constant*/_type:constant.Decorate.MOTIONANCHOR,
	/**
	 * draw the skeleton
	 */
	/*void*/draw:function(/*Graphic*/gp,/*String*/style,/*ExecuteRuntime*/runtime){
		var p = this.getCoordinate(),
			path = constant.Path,
			paths = [
			        {command:path.MOVE,points:p[0]},
			        {command:path.LINE,points:p[1]},
			        {command:path.LINE,points:p[2]},
			        {command:path.LINE,points:p[3]}
			        ];
		gp.drawPath(paths,style);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.decorate.controller.MotionAnchorController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.controller.MotionAnchorController"] = true;
dojo.provide("drawboard.graph.decorate.controller.MotionAnchorController");





(function(){
var	geometry = common.calc.Geometry,
	utils = common.utils.CollectionUtils;		
dojo.declare("drawboard.graph.decorate.controller.MotionAnchorController",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.MOTIONANCHOR,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var maCoordinates,
			motionAnchor = new drawboard.graph.decorate.MotionAnchor(),
			gf = runtime.getGraphic(),
			motionAnchors = gp.getMotionAnchorCoordinates(runtime);
		motionAnchors && dojo.forEach(motionAnchors,function(item,index){
			maCoordinates = utils.sliceRange(item,1,4);
			motionAnchor.setCoordinate(maCoordinates);
			motionAnchor.setIndex(index),
			motionAnchor.draw(gf,this.getStyle(gp,motionAnchor,runtime),runtime);
		},this);
	},
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*MotionAnchor*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		var motionAnchor,motionAnchors = gp.getMotionAnchorCoordinates(runtime),center;
		motionAnchors && dojo.some(motionAnchors,function(item,index){
			center = item[0];
			item = utils.sliceRange(item,1,4);
			if(geometry.isPointInPolyn(item,coordinate)){
				motionAnchor = new drawboard.graph.decorate.MotionAnchor({coordinate:item,index:index,center:center});
				return true;
			}
		},this);
		return motionAnchor;
	}
});
if(!drawboard.motionAnchorController){
	drawboard.motionAnchorController = new drawboard.graph.decorate.controller.MotionAnchorController();
}
})();

}

if(!dojo._hasResource["drawboard.graph.decorate.Rotator"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.Rotator"] = true;
dojo.provide("drawboard.graph.decorate.Rotator");


(function(){
var constant = drawboard.Constant;
dojo.declare("drawboard.graph.decorate.Rotator",drawboard.graph.decorate.Decorator,{
	/*Constant*/_type:constant.Decorate.ROTATOR,
	/*CoordinateFormatter*/pole:null,
	/*Double*/angle:null,
	/**
	 * draw the rotator
	 */
	/*void*/draw:function(/*Graphic*/gf,/*String*/style,/*ExecuteRuntime*/runtime){
		var r = runtime.getDistance(),
			p = constant.Path,
			path = [],
			cache = this.getCoordinate();
		//draw pole circle
		gf.drawCircle(cache[3],r,style);
		gf.drawLine(cache[2],cache[1],style);
		gf.drawCircle({x:cache[0].x,y:cache[0].y - r},r,style);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.decorate.controller.RotatorController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.controller.RotatorController"] = true;
dojo.provide("drawboard.graph.decorate.controller.RotatorController");



(function(){
var	geometry = common.calc.Geometry;
dojo.declare("drawboard.graph.decorate.controller.RotatorController",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.ROTATOR,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return;
		}
		var coordinates = gp.getRotatorCoordinates(runtime),rotator;
		rotator = gp.getRotator(runtime);
		rotator = new drawboard.graph.decorate.Rotator({pole:rotator.coordinate,angle:rotator.angle,coordinate:coordinates});
		rotator.draw(runtime.getGraphic(),this.getStyle(gp,rotator,runtime),runtime);
	},
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*Rotator*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return null;
		}
		var rotator;
		if(this.isIn(gp,coordinate,runtime)){
			rotator = gp.getRotator(runtime);
			rotator = new drawboard.graph.decorate.Rotator({coordinate:gp.getRotatorCoordinates(runtime),pole:rotator.pole,angle:rotator.angle});
		}
		return rotator;
	},
	/**
	 * whether or not the coordinate is in the circle
	 */
	/*boolean*/isIn:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return false;
		}
		var r = runtime.getDistance(),
			cache = gp.getRotatorCoordinates(runtime);
		if(geometry.isPointInCircle(coordinate,{coordinate:cache[3],r:r}) || 
				geometry.isPointInCircle(coordinate,{coordinate:cache[5],r:r}) ||
				geometry.isPointInSegment(cache[1],cache[4],coordinate)){
			return true;
		}
		return false;
	},
	/**
	 * whether or not the coordinate is in the pole circle
	 */
	/*boolean*/isInPole:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		if(!gp.hasRotator()){
			return false;
		}
		var caceh = gp.getRotatorCoordinates(runtime);
		if(geometry.isPointInCircle(coordinate,{coordinate:caceh[3],r:runtime.getDistance()})){
			return true;
		}
		return false;
	}
});
if(!drawboard.rotatorController){
	drawboard.rotatorController = new drawboard.graph.decorate.controller.RotatorController();
}
})();

}

if(!dojo._hasResource["drawboard.graph.decorate.Skeleton"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.Skeleton"] = true;
dojo.provide("drawboard.graph.decorate.Skeleton");


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
			        {command:path.LINE,points:p[3]}
			        ];
		gp.drawPath(paths,style);
	}
});
})();

}

if(!dojo._hasResource["drawboard.graph.decorate.controller.SkeletonController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.graph.decorate.controller.SkeletonController"] = true;
dojo.provide("drawboard.graph.decorate.controller.SkeletonController");




(function(){
var	geometry = common.calc.Geometry,
	utils = common.utils.CollectionUtils;	
dojo.declare("drawboard.graph.decorate.controller.SkeletonContainer",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.SKELETON,
	/**
	 * draw the decorate
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var sCoordinate,
			skeleton = new drawboard.graph.decorate.Skeleton(),
			gf = runtime.getGraphic();
		dojo.forEach(gp.getSkeletonCoordinates(runtime)||[],function(item,index){
			sCoordinate = utils.sliceRange(item,1,4);
			skeleton.setCoordinate(sCoordinate);
			skeleton.setIndex(index);
			item[0].isAnchored && skeleton.anchored(item[0].isAnchored);
			skeleton.draw(gf,this.getStyle(gp,skeleton,runtime),runtime);
		},this);
	},
	/*boolean*/isIn:function(/*Array<CoordinateFormatter>*/ps,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		return geometry.isPointInPolyn(ps,coordinate);
	},
	/**
	 * whether or not the coordinate is in the rectangle
	 */
	/*Skeleton*/active:function(/*GraphProxy*/gp,/*CoordinateFormatter*/coordinate,/*ExecuteRuntime*/runtime){
		var skeleton,gs = gp.getGraphStrategy(),temp,center;
		dojo.some(gp.getSkeletonCoordinates(runtime)||[],function(item,index){
			center = item[0];
			temp = utils.sliceRange(item,1,4);
			if(this.isIn(temp, coordinate,runtime)){
				skeleton = new drawboard.graph.decorate.Skeleton({coordinate:temp,index:index,_direct:item[0].css,center:center});
				gs.isAnchor(skeleton) && skeleton.anchored(true);
				return true;
			}
		},this);
		return skeleton;
	},
	/**
	 * create decorate by coordinates
	 */
	/*Array<Decorate<Skeleton>>*/create:function(/*Array<Array<CoordinateFormatter>>*/ps){
		var skeletons = [];
		dojo.forEach(ps||[],function(item,index){
			skeletons.push(this.createItem(item, index));
		},this);
		return skeletons;
	},
	/*Decorate<Skeleton>*/createItem:function(/*Array<CoordinateFormatter>*/ps,/*Integer*/index){
		var skeleton = new drawboard.graph.decorate.Skeleton({coordinate:utils.sliceRange(ps,1,4),index:index,_direct:ps[0].css});
		ps[0].isAnchored && skeleton.anchored(true);
		return skeleton;
	}
});
if(!drawboard.skeletonController){
	drawboard.skeletonController = new drawboard.graph.decorate.controller.SkeletonContainer(); 
}
})();

}

if(!dojo._hasResource["drawboard.drawProcessor.DbDrawProcessor"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.drawProcessor.DbDrawProcessor"] = true;
dojo.provide("drawboard.drawProcessor.DbDrawProcessor");






(function(){
dojo.declare("drawboard.drawProcessor.DbDrawProcessor",drawboard.drawProcessor.DrawProcessor,{
	/**
	 * draw a graph
	 */
	/*void*/draw:function(/*GraphProxy*/gp,/*ExcuteRuntime*/runtime){
		if(gp.isComposite() && !gp.isFocus()){
			return;
		}
		gp.draw(runtime);		 
		if(gp.isActive()){
			//draw the decorate graph
			drawboard.skeletonController.draw(gp,runtime);
			drawboard.motionAnchorController.draw(gp,runtime);
			drawboard.rotatorController.draw(gp,runtime);
		}
		((runtime.getShowMark() || gp.showMark()) || gp.isActive() || gp.isActived()) && drawboard.markController.draw(gp,runtime);
	},
	/**
	 * set a active status in draw board
	 */
	/*{active:GraphProxy,decorate:Decorate,status:Constant}*/setActive:function(/*GraphProxy*/gp,/*CoordinateFormatter*/p,/*boolean*/only,/*Controller*/compController,/*ExecuteRuntime*/runtime){
		var actionStatus = drawboard.Constant.ActionStatus,active,parent;
		if(gp && gp.isActive()){
			var controllers = [{controller:drawboard.skeletonController,status:actionStatus.RESIZING},
								{controller:drawboard.rotatorController,status:[actionStatus.POLEMOVING,actionStatus.ROTATING]},
								{controller:drawboard.markController,status:actionStatus.MARKING},
								{controller:drawboard.motionAnchorController,status:actionStatus.MOTION}
			                   ],controller,actDecorator,status;
			dojo.some(controllers,function(item){
				controller = item.controller;
				if(only && controller != compController){return;}
				if(!only && controller == compController){return;}
				actDecorator = controller.active(gp,p,runtime);
				if(actDecorator){
					active = {};
					status = item.status;
					//in case of rotator,the status is a array.
					if(dojo.isArray(status)){
						if(controller.isInPole(gp,p,runtime)){
							active.status = status[0];
						}else{
							active.status = status[1];
						}
					}else{
						active.status = status;
					}
					active.active = gp;
					active.decorate = actDecorator;
					return true;
				}	
			},this);
		}
		if(!active && gp.isComposite()){
			return null;
		}
		if(!active && gp.active(p,runtime)){
			parent = this.getActiveParent(gp);
			active = {};
			active.status = actionStatus.MOVING;
			if(parent && !parent.isFocus()){
				gp = parent;
			}
			active.active = gp;
			active.decorate = null;
		}
		return active;
	},
	/*GraphProxy*/getActiveParent:function(/*GraphProxy*/gp){
		var curParent = (gp.getParent && gp.getParent()),preParent,parent;
		do{
			//if it has been focus,so return previous object
			if(!curParent || curParent.isFocus()){
				parent = preParent;
				break;
			}
			preParent = curParent;
			curParent = (preParent.getParent && preParent.getParent());
		}while(true);
		return parent;
	}
});
})();

}

if(!dojo._hasResource["drawboard.context.ExecuteContext"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.context.ExecuteContext"] = true;
dojo.provide("drawboard.context.ExecuteContext");



(function(){
var geometry = common.calc.Geometry;
dojo.declare("drawboard.context.ExecuteContext",dijit._Widget,{
	/*{x:Double,y:Double}*/zoom:{x:100,y:100},
	/*ParamsController*/paramsCtrl:null,
	/*StyleController*/styleCtrl:null,
	/*CommandController*/commandCtrl:null,
	/*DrawProcessor*/drawProcessor:null,
	/**
	 * get zoom
	 * @returns {Number}
	 */
	/*{x:Double,y:Double}*/getZoom:function(){
		return geometry.dividePoint(this.zoom,{x:100,y:100})[0];
	},
	/**
	 * set zoom
	 * @param zoom
	 */
	/*boolean*/setZoom:function(/*{x:Double,y:Double}*/rate){
		var zoom = geometry.add2Points(this.zoom,rate);
		if(zoom.x < 0 || zoom.y < 0 || zoom.x > 200 || zoom.y > 200){
			return false;
		}
		this.zoom = zoom;
		return true;
	},
	/**
	 * get parameters controller
	 * @returns
	 */
	/*ParamsController*/getParamsCtrl:function(){
		if(!this.paramsCtrl){
			new common.exception.Exception({msg:"the parameters controller in context doesnt' exist!"});
		}
		return this.paramsCtrl;
	},
	/**
	 * set parameters controller
	 * @param paramsCtrl
	 */
	/*void*/setParamsCtrl:function(/*ParamsController*/paramsCtrl){
		this.paramsCtrl = paramsCtrl;
	},
	/**
	 * get command controller
	 * @returns
	 */
	/*CommandController*/getCommandCtrl:function(){
		if(!this.commandCtrl){
			new common.exception.Exception({msg:"the command controller in context doesnt' exist!"});
		}
		return this.commandCtrl;
	},
	/**
	 * set command controller
	 * @param commandCtrl
	 */
	/*void*/setCommandCtrl:function(/*CommandController*/commandCtrl){
		this.commandCtrl = commandCtrl;
	},
	/**
	 * set style controller
	 * @param styleCtrl
	 */
	/*void*/setStyleCtrl:function(/*StyleController*/styleCtrl){
		if(!this.styleCtrl){
			new common.exception.Exception({msg:"the style controller in context doesnt' exist!"});
		}
		this.styleCtrl = styleCtrl;
	},
	/**
	 * get style controller
	 * @returns
	 */
	/*StyleController*/getStyleCtrl:function(){
		return this.styleCtrl;
	},
	/**
	 * get draw processor
	 * @returns
	 */
	/*DrawProcessor*/getDrawProcessor:function(){
		if(!this.drawProcessor){
			new common.exception.Exception({msg:"the draw processor in context doesnt' exist!"});
		}
		return this.drawProcessor;
	},
	/**
	 * set draw processor
	 * @param drawProcessor
	 */
	/*void*/setDrawProcessor:function(/*DrawProcessor*/drawProcessor){
		this.drawProcessor = drawProcessor;
	}
});
})();

}

if(!dojo._hasResource["drawboard.runtime.ExecuteRuntime"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.runtime.ExecuteRuntime"] = true;
dojo.provide("drawboard.runtime.ExecuteRuntime");





dojo.declare("drawboard.runtime.ExecuteRuntime",[dijit._Widget,common.Cache,common.listener.Listener],{
	/*ExecuteContext*/context:null,
	/*Graphic*/graphic:null,
	/*boolean*/_showMark:false,
    /*void*/setShowMark:function(/*boolean*/showMark){
		this._showMark = showMark;
	},
	/*boolean*/getShowMark:function(){
		return this._showMark;
	},
	/*void*/apply:function(/*String*/functName,/*Array<Object>*/params){
		this[functName] && this[functName].apply(this,params);
	},
	/**
	 * create cache by subclass
	 */
	/*Object*/createCache:function(){
		return {};
	},
	/**
	 * according to the instance to choose difference class
	 */
	/*Object*/getCache:function(/*GraphProxy*/gp){
		var cache = drawboard.runtime.ExecuteRuntime.superclass.getCache.apply(this),
			item = cache[gp.getIdty()];
		(!item)&&(cache[gp.getIdty()] = item = {});
		return item;
	},
	/**
	 * add cache
	 */
	/*void*/addCache:function(/*GraphProxy*/gp,/*Constant*/type,/*Object*/value){
		var cache = drawboard.runtime.ExecuteRuntime.superclass.getCache.apply(this),
			item = cache[gp.getIdty()];
		(!item)&&(cache[gp.getIdty()] = item = {});
		item[type] = value;
	},
	/**
	 * clear cache
	 */
	/*void*/clearCache:function(/*GraphProxy*/gp,/*Constant*/type){
		var cache = drawboard.runtime.ExecuteRuntime.superclass.getCache.apply(this);
		if(type !== undefined && type !== null){
			var item = cache[gp.getIdty()]; 
			if(item){ 
				item[type] = null;
				delete item[type];
			}
			this.fireListener(["clearCache",[gp,type]]);
			return;
		}
		cache[gp.getIdty()] = null;
		delete cache[gp.getIdty()];
		this.fireListener(["clearCache",[gp]]);
	},
	/*ExecuteContext*/getContext:function(){
		if(!this.context){
			new common.exception.Exception({msg:"the context in runtime doesnt' exist!"});
		}
		return this.context;
	},
	/*void*/setContext:function(/*ExecuteContext*/context){
		this.context = context;
	},
	/*Graphic*/getGraphic:function(){
		if(!this.graphic){
			new common.exception.Exception({msg:"the graphic in runtime doesnt' exist!"});
		}
		return this.graphic;
	},
	/*void*/setGraphic:function(/*Graphic*/gf){
		this.graphic = gf;
	},
	/*Double*/getDistance:function(){
		var ctx = this.getContext();
		return ctx.getParamsCtrl().getDistance();
	},
	/*Double*/getRotateDistance:function(){
		var ctx = this.getContext();
		return ctx.getParamsCtrl().getRotateDistance();
	},
	/*void*/getRounder:function(){
		var ctx = this.getContext();
		return ctx.getParamsCtrl().getRounder();
	},
	/*DrawProcessor*/getDrawProcessor:function(){
		return this.getContext().getDrawProcessor();
	},
	/*void*/draw:function(/*GraphProxy*/gp){
		this.getDrawProcessor().draw(gp,this);
	},
	/*void*/zoom:function(/*GraphProxy*/gp,/*{x:Double,y:Double}*/rate){
		gp.zoom(rate,this);
	}
});

}

if(!dojo._hasResource["drawboard.controller.CommandController"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.controller.CommandController"] = true;
dojo.provide("drawboard.controller.CommandController");




dojo.declare("drawboard.controller.CommandController",common.container.MapContainer,{
	/*String*/resouce:drawboardRuntimeSetting.commands,
	/*ListContainer*/_undoList:null,
	/*ListContainer*/_redoList:null,
	/*Integer*/maxSteps:20,
	/*Read*/store:null,
	/*void*/constructor:function(){
		var list = common.container.ListContainer;
		this._undoList = new list();
		this._redoList = new list();
		this.render();
	},
	/*Read*/getReadStore:function(){
		var store = this.store;
		if(!store){
			store = new dojo.data.ItemFileReadStore({url:this.resouce});
			store._forceLoad();
			this.store = store;
		}
		return this.store;
	},
	/*void*/render:function(){
		var store = this.getReadStore(),type,command,desp0,desp1;
		dojo.forEach(store._getItemsArray(),function(item){
			type = store.getValue(item,"type");
			command = store.getValue(item,"command");
			//eval('dojo.require("' + command + '")');
			desp0 = store.getValue(item,"desp0");
			desp1 = store.getValue(item,"desp1");
			this.registerCommand(type,command,desp0,desp1);
		},this);
	},
	/**
	 * register the commands
	 */
	/*void*/registerCommand:function(/*Constant*/type,/*String*/command,/*String*/desp0,/*String*/desp1){
		this.addItem(type,{command:command,0:desp0,1:desp1});
	},
	/**
	 * get command instance , and store to the undo/redo queue.
	 * @param type		command type
	 * @param memo		the parameters for command execute 
	 * @param runtime	execute runtime context
	 */
	/*Command*/instanceCommand:function(/*Constant*/type,/*Object*/executor,/*Memo*/memo,/*boolean*/isNegative,/*Runtime*/runtime){
		var item = this.getItem(type),command,instance;
		if(!item){
			new common.exception.Exception({msg:"the command type doesn't exsit!"});
			return;
		}
		//command = eval("new " + item.command + "(executor,memo,isNegative)");
		instance = eval(item.command);
		command = new instance(executor,memo,isNegative);
		command.setDescription({0:item.desp0,1:item.desp1});
		command.setRuntime(runtime);
		return command;
	},
	/*void*/add:function(/*Command*/command){
		var undoList = this._undoList;
		undoList.add(command);
		if(undoList.size() > this.maxSteps){
			undoList.shift();
		}
		this._redoList.clearItems();
	},
	/**
	 * undo the command
	 */
	/*void*/undo:function(){
		var command = this._undoList.pop();
		if(!command){return;}
		command.unexecute();
		this._redoList.add(command);
	},
	/**
	 * redo the command
	 */
	/*void*/redo:function(){
		var command = this._redoList.pop();
		if(!command){
			return;
		}
		command.execute();
		this._undoList.add(command);
	}
});

}

if(!dojo._hasResource["drawboard.DrawBoard"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.DrawBoard"] = true;
dojo.provide("drawboard.DrawBoard");

















dojo.declare("drawboard.DrawBoard",[dijit._Templated,drawboard._Selector,drawboard._Event,common.listener.Listener],{
	/*String*/templateString:"<div></div>",
	/*DomNode*/dbCanvas:null,
	/*Class*/graphicClass:drawboard.graphic.SVGGraphic,
	/*Class*/textBoardClass:drawboard.board.TextBoard,
	/*TextBoard*/_textBoard:null,
	/*Graphic*/_graphic:null,
	/*double*/w:null,
	/*double*/h:null,
	/*double*/defaultWidth:300,
	/*double*/defaultHeight:300,
	/*CompositeProxy*/_selectRect:null,
	/*ExecuteContext*/_runtime:null,
	/*Node*/fixNode:null,
	/*String*/SRGraphStrategyClass:"drawboard.graph.strategy.RectangleStrategy",
	/*String*/graphStrategyParam:null,
	/*{x:Double,y:Double,width:Double,height:Double}*/drawEntity:null,	//create a new graph,and draw.
	/*CompositeCommand*/_commands:null,
	
	/*void*/postCreate:function(){
		var graphic = this.createGraphic(),node,
			ctrller = drawboard.controller,
			ctx,dbCanvas,
			w = this.w,
			h = this.h,
			style = this.domNode.style;
		dbCanvas = dojo.create("div",{},this.domNode);
		style.overflow = "auto";
		style.width = w + "px";
		style.height = h + "px";
		style.position = "relative";
		this.dbCanvas = dbCanvas;
		node = graphic.createAnchor(w||this.defaultWidth,h || this.defaultHeight,dbCanvas);
		ctx = new drawboard.context.ExecuteContext({paramsCtrl:new ctrller.ParamsController(),
																styleCtrl:new ctrller.StyleController(),
																commandCtrl:new ctrller.CommandController(),
																drawProcessor:new drawboard.drawProcessor.DbDrawProcessor()
																});
		this._textBoard = new this.textBoardClass({"_db":this});
		this.domNode.appendChild(this._textBoard.domNode);
		this._runtime = new drawboard.runtime.ExecuteRuntime({context:ctx,graphic:graphic});
		drawboard.DrawBoard.superclass.postCreate.call(this,node);
		//drawboard.DrawBoard.superclass.postCreate.call(this,this.domNode);
	},
	/*boolean*/ready:function(){
		return this.getGraphic().ready();
	},
	/*TextBoard*/getTextBoard:function(){
		return this._textBoard;
	},
	/**
	 * get graphic
	 */
	/*Graphic*/getGraphic:function(){
		return this.getRuntime().getGraphic();
	},
	/**
	 * get execute runtime
	 * @return context
	 */
	/*ExecuteRuntime*/getRuntime:function(){
		return this._runtime;
	},
	/**
	 * set execute runtime
	 * @param context
	 */
	/*void*/setRuntime:function(/*ExecuteRuntime*/runtime){
		this._runtime = runtime;
	},
	/*void*/setGraphStrategyParam:function(/*String*/param){
		this.graphStrategyParam = param;
	},
	/*String*/getGraphStrategyParam:function(){
		return this.graphStrategyParam;
	},
	/**
	 * create graphic
	 */
	/*Graphic*/createGraphic:function(){
		if(!this._graphic){
		    this._graphic = new this.graphicClass();
		}
		return this._graphic;
	},
	/**
	 * get drawing information
	 */
	/*void*/getDrawEntity:function(/*boolean*/create){
		if(!this.drawEntity && create){
			this.drawEntity = {};
		}
		return this.drawEntity;
	},
	/*{x:double,y:double}*/getCanvasSize:function(){
		var zoom = this.getRuntime().getContext().getZoom();
		return {x:this.w*zoom.x,y:this.h*zoom.y};
	},
	/**
	 * get use view size , when the scroll bar show , the width and height will less than origin. 
	 * So we get use view size by the clientWidth and clientHeight,not by the this.w and this.h
	 * @returns {x:double,y:double}
	 */
	/*{x:double,y:double}*/getUserViewSize:function(){
		var domNode = this.domNode;
		return {x:domNode.clientWidth,y:domNode.clientHeight};
	},
	/**
	 * clear drawing information
	 */
	/*void*/clearDrawEntity:function(/*boolean*/isSelect){
		var drawEntity = this.drawEntity,
			param = this.graphStrategyParam;
		if(drawEntity && !isSelect){
			var gs = new drawboard.graph.GraphStatus({_coordinate:{x:drawEntity.x,y:drawEntity.y},_w:drawEntity.width,_h:drawEntity.height,affectedByZoom:(param&&param.affectedByZoom)}),
				gp = new drawboard.graph.GraphProxy(gs,this.getDrawType());
			param && param.url && (gs.setUrl(param.url));
			param && param.ratio && (gs.setRatio(param.ratio));
			this.addCommand(drawboard.Constant.Command.CREATEVSDELETECOMMAND,this,gp);
		}
		this.drawEntity = null;
		this.graphStrategyParam = null;
	},
	/**
	 * get combine graph strategy class
	 */
	/*String*/getSRGraphStrategyClass:function(){
		return this.SRGraphStrategyClass;
	},
	/**
	 * set combine graph strategy class
	 */
	/*void*/setSRGraphStrategyClass:function(/*String*/SRGraphStrategyClass){
		this.SRGraphStrategyClass = SRGraphStrategyClass;
	},
	/**
	 * get select rectangle
	 */
	/*CompositeProxy*/getSelectRect:function(){
		return this._selectRect;
	},
	/**
	 * set select rectangle
	 */
	/*void*/setSelectRect:function(/*CompositeProxy*/selectRect){
		var preSelectRect = this._selectRect;
		if(selectRect == preSelectRect){
			return;
		}
		preSelectRect && preSelectRect.destroy();
		this._selectRect = selectRect;
	},
	/**
	 * whether or not contains the select rectangle
	 */
	/*boolean*/containsSelectRect:function(/*CompositeProxy*/selectRect){
		var exist = false;
		this.some(function(/*GraphProxy*/gp){
			if(gp.isComposite() && gp.equals(selectRect)){
				exist = true;
				return true;
			}
		},this);
		return exist;
	},
	/**
	 * combine multiple graphs
	 */
	/*void*/combine:function(){
		var selectRect = this.getSelectRect();
		selectRect && !this.containsSelectRect(selectRect) && !selectRect.resetRelations() && this.combineGraph(selectRect);
		this._selectRect = null;
	},
	/*void*/combineGraph:function(/*CompositGraphProxy*/gp){
		this.add(gp);
	},
	/**
	 * divide the composite graph to single
	 */
	/*void*/divide:function(){
		var gp = this.getActive();
		this.divideGraph(gp);
	},
	/*void*/divideGraph:function(/*GraphProxy*/gp){
		if(gp && gp.isComposite()){
			gp.destroy();
			this.remove(gp);
		}
	},
	/**
	 * add graph
	 */
	/*void*/addGraph:function(/*GraphStatus*/gs,/*String*/graphStrategyClass){
		var proxy = new drawboard.graph.GraphProxy(gs,graphStrategyClass);
		this.add(proxy);
	},
	/**
	 * remove graph
	 */
	/*void*/removeGraph:function(/*GraphProxy*/gp){
		gp.deleteAll(this,this.getRuntime());
		this.getRuntime().getContext().getStyleCtrl().removeGraph(gp);
		this.remove(gp);
	},
	/**
	 * get graph
	 */
	/*GraphProxy*/getGraph:function(/*String*/idty){
		var gs;
		this.some(function(/*GraphProxy*/item){
			if(item.getIdty() == idty){
				gs = item;
				return true;
			}
		});
		return gs;
	},
	/**
	 * zoom out or zoom in
	 * @param rate
	 */
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate,/*ExecuteRuntime*/runtime){
		var preZoom = dojo.clone(runtime.getContext().getZoom());
		if(!runtime.getContext().setZoom(rate)){
			return;
		}
		//update the size of canvas
		var zoom = runtime.getContext().getZoom(),
			style = this.dbCanvas.style,
			gf = this.getGraphic(),
			w = this.w*zoom.x,
			h = this.h*zoom.y,
			domNode = this.domNode,
			geometry = common.calc.Geometry,
			selectRect = this.getSelectRect(),
			center;
		//update the canvas
		center = {x:domNode.scrollLeft + (this.w>>1),y:domNode.scrollTop + (this.h>>1)};
		center = geometry.dividePoint(center,preZoom)[0];
		center = geometry.multiPoint(center,zoom)[0];
		style.width = w + "px";
		style.height = h + "px";
		domNode.scrollLeft = center.x - (this.w>>1);
		domNode.scrollTop = center.y - (this.h>>1);
		gf.setSize(w,h);
		//update graphs
		this.forInItems(function(/*GraphProxy*/gp){
			gp && runtime.zoom(gp,zoom);
		},this,true);
		selectRect && runtime.zoom(selectRect,zoom);
		this.fireListener(["zoom",[rate]]);
	},
	/**
	 * draw graph
	 */
	/*void*/draw:function(){
		this.clearGraphs();
		var selectRect = this.getSelectRect(),
			drawEntity = this.getDrawEntity(),
			runtime = this.getRuntime();
		this.drawGraphs(runtime);
		if(drawEntity){
			var gs = new drawboard.graph.GraphStatus({_coordinate:{x:drawEntity.x,y:drawEntity.y},_w:drawEntity.width,_h:drawEntity.height}),
				proxy = new drawboard.graph.GraphProxy(gs,this.getDrawType()||this.getSRGraphStrategyClass()),
				param = this.graphStrategyParam;
			param && param.url && (gs.setUrl(param.url));
			param && param.ratio && (gs.setRatio(param.ratio));
			proxy.showMark(false);
//			console.info("x:" + drawEntity.x + ",y:" + drawEntity.y + ",width:" + drawEntity.width + ",height:" + drawEntity.height);
			runtime.draw(proxy);
		}
		selectRect && (runtime.draw(selectRect));
		this.fireListener(["draw"]);
	},
	/**
	 * draw graphs
	 * @param gf
	 */
	/*void*/drawGraphs:function(/*ExecuteRuntime*/runtime){
		this.forInItems(function(/*GraphProxy*/gp){
			gp && runtime.draw(gp);
		},this);
	},
	/**
	 * clear all graphs
	 */
	/*void*/clearGraphs:function(){
		this.getGraphic().clear();
	},
	/**
	 * set style for specific graph
	 * @param styleAttr
	 * @param style
	 */
	/*void*/setStyle:function(/*String*/styleAttr,/*String*/style,/*boolean*/isText){
		var gp = this.getActive();
		if(isText && gp && !gp.getText()){
			return;
		}
		gp && this.addCommand(drawboard.Constant.Command.STYLECOMMAND,this.getRuntime().getContext().getStyleCtrl(),{gp:gp,attr:styleAttr,value:style,isText:isText});
		this.clearCommand();
		this.draw();
	},
	/*void*/setText:function(/*String*/text){
		this.last().setText(text);
	},
	/************************************************************************************************************************
	 *										UNDO & REDO																		*
	 ************************************************************************************************************************/
	/*CommandController*/getCommandCtrl:function(){
		return this.getRuntime().getContext().getCommandCtrl();
	},
	/*void*/getCommands:function(){
		var commands = this._commands;
		if(!commands){
			commands = this._commands = new drawboard.command.CompositeCommand();
			this.getCommandCtrl().add(commands);
		}
		return commands;
	},
	/*void*/addCommand:function(/*Constant*/type,/*Object*/executor,/*Memo*/memo,/*boolean*/isNegative){
		var command = this.getCommandCtrl().instanceCommand(type,executor,memo,isNegative,this.getRuntime());
		command.execute();
		this.getCommands().add(command);
	},
	/*void*/clearCommand:function(){
		this._commands = null;
	},
	/*void*/undo:function(){
		this.getCommandCtrl().undo();
		this.draw();
	},
	/*void*/redo:function(){
		this.getCommandCtrl().redo();
		this.draw();
	}
});

}

if(!dojo._hasResource["drawboard.drawProcessor.ZoomDrawProcessor"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.drawProcessor.ZoomDrawProcessor"] = true;
dojo.provide("drawboard.drawProcessor.ZoomDrawProcessor");


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

}

if(!dojo._hasResource["drawboard.ZoomDrawBoard"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["drawboard.ZoomDrawBoard"] = true;
dojo.provide("drawboard.ZoomDrawBoard");











(function(){
var geometry = common.calc.Geometry,
	mouseStatus = drawboard.Constant.MouseAction,	
	subtract = geometry.subtract2Points;
dojo.declare("drawboard.ZoomDrawBoard",[dijit._Widget,dijit._Templated],{
	/*String*/templateString:"<div style='position:relative;overflow:hidden;'><div dojoAttachPoint='zoomDrawboard'></div><div dojoAttachPoint='zoomRect' style='position:absolute;border:2px solid red;left:0px;top:0px;'></div></div>",
	/*Class*/graphicClass:drawboard.graphic.SVGGraphic,
	/*Graphic*/_graphic:null,
	/*Node*/anchor:null,
	/*double*/w:null,
	/*double*/h:null,
	/*{x:double,y:double}*/_zoom:{x:100,y:100},
	/*double*/rectBorder:2,
	/*double*/defaultWidth:300,
	/*double*/defaultHeight:300,
	/*ExecuteContext*/_runtime:null,
	/*DrawBoard*/drawboard:null,
	/*Array*/events:null,
	/*{x:double,y:double}*/boxCache:null,
	/*boolean*/scopeSelf:false,
	
	/*void*/postCreate:function(){
		var graphic = this.createGraphic(),node,
			ctrller = drawboard.controller,ctx,
			db = this.getDrawBoard(),runtime,
			zoomRect = this.zoomRect,
			domNode = this.domNode,
			rectBorder = this.rectBorder,
			 w = this.w||this.defaultWidth,
			 h = this.h || this.defaultHeight;
		node = graphic.createAnchor(w,h);
		this.anchor = node;
		ctx = new drawboard.context.ExecuteContext({paramsCtrl:new ctrller.ParamsController(),
																styleCtrl:new ctrller.StyleController(),
																drawProcessor:new drawboard.drawProcessor.ZoomDrawProcessor(),
																zoom:{x:50,y:50}});
		this._runtime = runtime = new drawboard.runtime.ExecuteRuntime({context:ctx,graphic:graphic}); 
		this.zoomDrawboard.appendChild(this.anchor);
		zoomRect.style.width = w + "px";
		zoomRect.style.height = h + "px";
		domNode.style.width = w + (rectBorder<<1) + "px";
		domNode.style.height = h + (rectBorder<<1) + "px";
		this.events = [dojo.connect(zoomRect,"onmousemove",dojo.hitch(this,"doMouseMove")),
		               dojo.connect(zoomRect,"onmousedown",dojo.hitch(this,"doMouseDown")),
//		               dojo.connect(zoomRect,"onmouseout",dojo.hitch(this,"doMouseOut")),
		               dojo.connect(zoomRect,"onmouseup",dojo.hitch(this,"doMouseUp"))];
		db.addListener(this.apply,this);
		db.getRuntime().addListener(runtime.apply,runtime);
	},
	/**
	 * get draw board
	 * @returns
	 */
	/*DrawBoard*/getDrawBoard:function(){
		if(!this.drawboard){
			new common.exception.Exception({msg:"the draw board can't find in the zoom window!"});
		}
		return this.drawboard;
	},
	/**
	 * set draw board
	 * @param drawboard
	 */
	/*void*/setDrawBoard:function(/*DrawBoard*/drawboard){
		this.drawboard = drawboard;
	},
	/**
	 * set zoom
	 * @param rate
	 */
	/*boolean*/setZoom:function(/*{x:double,y:double}*/rate){
		var zoom = subtract(this._zoom,{x:rate.x,y:rate.y});
		if(zoom.x < 0 || zoom.y < 0 || zoom.x > 200 || zoom.y > 200){
			return false;
		}
		this._zoom = zoom;
		return true;
	},
	/**
	 * get zoom
	 * @returns {x:double,y:double}
	 */
	/*{x:double,y:double}*/getZoom:function(){
		return geometry.dividePoint(this._zoom,{x:100,y:100})[0];
	},
	/**
	 * get graphic
	 */
	/*Graphic*/getGraphic:function(){
		return this.getRuntime().getGraphic();
	},
	/**
	 * get execute runtime
	 * @return context
	 */
	/*ExecuteRuntime*/getRuntime:function(){
		return this._runtime;
	},
	/**
	 * set execute runtime
	 * @param context
	 */
	/*void*/setRuntime:function(/*ExecuteRuntime*/runtime){
		this._runtime = runtime;
	},
	/**
	 * create graphic
	 */
	/*Graphic*/createGraphic:function(){
		return new this.graphicClass();
	},
	/*void*/apply:function(/*String*/functName,/*Array<Object>*/params){
		this[functName] && this[functName].apply(this,params);
	},
	/**
	 * zoom out or zoom in
	 * @param rate
	 */
	/*void*/zoom:function(/*{x:Double,y:Double}*/rate){
		this._unitCache = null;
		if(!this.setZoom(rate)){
			return;
		}
		this.scopeSelf = true;
		var zoomRect = this.zoomRect,
			zoom = this.getDrawBoard().getRuntime().getContext().getZoom(),
			style = zoomRect.style,
			w = this.w,
			h = this.h,
			rw = w/(zoom.x),
			rh = h/(zoom.y);
		style.left = parseFloat(style.left) + (parseFloat(style.width)>>1) - (rw>>1) + "px";
		style.top = parseFloat(style.top) + (parseFloat(style.height)>>1) - (rh>>1)  + "px";
		style.width = rw + "px"; 
		style.height = rh + "px";
		this.draw();
	},
	/**
	 * draw graph
	 */
	/*void*/draw:function(){
		this.clearGraphs();
		var db = this.getDrawBoard();
		db.drawGraphs(this.getRuntime());
	},
	/**
	 * clear all graphs
	 */
	/*void*/clearGraphs:function(){
		var anchor = this.anchor;
		while(anchor.lastChild) 
		{
			anchor.removeChild(anchor.lastChild);
		}
	},
	/**
	 * get current drawboard panel box information
	 */
	/*void*/getBoxCache:function(){
		if(!this.boxCache){
			var node = this.domNode,
				cache = {left:node.offsetLeft,top:node.offsetTop};
			this.boxCache = cache;
		}
		return this.boxCache;
	},
	/**
	 * get the coordinate of current mouse position in the drawboard panel
	 */
	/*CoordinateFormatter*/fetchCoordinate:function(/*Event*/e){
		var box = this.getBoxCache(),domNode = this.domNode;
		return {x:e.pageX - box.left + domNode.scrollLeft,y:e.pageY - box.top + domNode.scrollTop};
	},
	/**
	 * unit px in the zoom mapping to the origin graph
	 */
	/*double*/getUnitPx:function(){
		if(!this._unitCache){
			var db = this.getDrawBoard(),
				dbSize = db.getCanvasSize(),
				oriSize = db.getUserViewSize(),
				style = this.zoomRect.style;
			this._unitCache = {x:(dbSize.x-oriSize.x)/(this.w - parseFloat(style.width)),y:(dbSize.y-oriSize.y)/(this.h - parseFloat(style.height))};
		}
		return this._unitCache;
	},
	/*************************************************************************
	 * 							Event
	 *************************************************************************/
	/*Constant*/status:mouseStatus.NONE,
	/*Coordinate*/_start:null,
	/*Coordinate*/_end:null,
	/*double*/_loseAccuracyLeft:0,
	/*double*/_loseAccuracyTop:0,
	/*integer*/_accuracy:100000,
	/*void*/doMouseMove:function(e){
		if(this.status != mouseStatus.MOUSEDOWN && this.status != mouseStatus.MOUSEMOVE){
			return;
		}
		var end = this.fetchCoordinate(e),
			delta = subtract(end,this._start),
			style = this.zoomRect.style,
			db = this.getDrawBoard(),
			dbNode = db.domNode,
			unit = this.getUnitPx(),temp,
			accuracy = this._accuracy,
			top = parseFloat(style.top) + delta.y,
			left = parseFloat(style.left) + delta.x,
			dbSize = db.getCanvasSize(),
			oriSize = db.getUserViewSize(),
			rWidth = parseFloat(style.width),
			rHeight = parseFloat(style.height);
		this._start = end;
//		if(top < 0 || left <0 || (left + parseFloat(style.width)) - 1 > this.w || (top + parseFloat(style.height)) - 1 > this.h){
//			return;
//		}
		(top<0)&&(top=0);
		(left<0)&&(left=0);
		this.scopeSelf = true;
		style.top = top + "px";
		style.left = left + "px";
		//for the scrollLeft and scrollTop in the node must be integer,so we must add the loss accuracy.Control the relative error in 1 px.
		if(left == 0){
			dbNode.scrollLeft = 0;
			this._loseAccuracyLeft = 0;
		}else if((left + rWidth)> this.w){
			dbNode.scrollLeft = dbSize.x-oriSize.x;
			style.left = this.w - rWidth + "px";
		}else{
			dbNode.scrollLeft = temp = dbNode.scrollLeft + delta.x*unit.x;
			temp = (temp * accuracy - parseInt(temp) * accuracy)/accuracy;
			this._loseAccuracyLeft = temp = this._loseAccuracyLeft + temp;
			if(temp >= 1){
				dbNode.scrollLeft += 1;
				this._loseAccuracyLeft = temp - 1;
			}
		}
		if(top == 0){
			dbNode.scrollTop = 0;
			this._loseAccuracyTop = 0;
		}else if((top + rHeight)> this.h){
			dbNode.scrollTop = dbSize.y-oriSize.y;
			style.top = this.h - rHeight + "px";
		}else{
			dbNode.scrollTop = temp = dbNode.scrollTop + delta.y*unit.y;
			temp = (temp * accuracy - parseInt(temp) * accuracy)/accuracy;
			this._loseAccuracyTop = temp = this._loseAccuracyTop + temp;
			if(temp >= 1){
				dbNode.scrollTop += 1;
				this._loseAccuracyTop = temp - 1;
			}
		}
		this.status = mouseStatus.MOUSEMOVE;
	},
	/*void*/doMouseDown:function(e){
		this._start = this.fetchCoordinate(e);
		this.status = mouseStatus.MOUSEDOWN;
	},
	/*void*/doMouseUp:function(e){
		this.status = mouseStatus.MOUSEUP;
	},
//	/*void*/doMouseOut:function(e){
//		this.status = mouseStatus.MOUSEOUT;
//	},
	/*void*/doScroll:function(/*boolean*/isHorizon,/*double*/delta){
		if(this.scopeSelf){
			this.scopeSelf = false;
			return;
		}
		var style = this.zoomRect.style,
			unit = this.getUnitPx();
		if(isHorizon){
			style.left = parseFloat(style.left) + delta/unit.x + "px";
		}else{
			style.top = parseFloat(style.top) + delta/unit.y + "px";
		}
	},
	/*void*/destroy:function(){
		dojo.forEach(this.events,dojo.disconnect);
	}
});
})();

}

