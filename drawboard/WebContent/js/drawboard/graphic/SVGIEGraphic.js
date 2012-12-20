/**
 * draw kinds of graphs by SVG
 * style formatter : fill:none;stroke:(color);stroke-width:(double)
 */
dojo.provide("drawboard.graphic.SVGIEGraphic");
dojo.require("drawboard.graphic.Graphic");
dojo.require("common.utils.BrowerUtils");
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