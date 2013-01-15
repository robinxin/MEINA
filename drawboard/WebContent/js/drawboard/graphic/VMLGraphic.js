/**
 * draw kinds of graphs by SVG
 * style formatter : fill:none;stroke:(color);stroke-width:(double)
 */
dojo.provide("drawboard.graphic.VMLGraphic");
dojo.require("drawboard.graphic.Graphic");
dojo.require("common.utils.BrowerUtils");
dojo.require("drawboard.Constant");
(function(){
var attr = dojo.attr,
	pathName = window.location.pathname,
	constant = drawboard.Constant,
	path = constant.Path,
	rootName = pathName.substring(0, pathName.indexOf("/",1) + 1),
	/*void*/attr = function(/*Node*/node,/*String*/attribute,/*String*/value){
		try{
			node[attribute] = value;
		}catch(e){
			node.setAttribute(attribute,value);
		}
	},
	/*Node*/createNode = function(/*String*/ele){
		return document.createElement(ele);
	},
	utils = common.utils.BrowerUtils,
	markReg = new RegExp("(shape|image|rect|roundrect|oval|line|test)",'ig');
markReg.compile();
dojo.declare("drawboard.graphic.VMLGraphic",drawboard.graphic.Graphic,{
	/*Node*/anchor:null,
	/*Constant*/type: constant.GraphicType.VML,

	/*Node*/createAnchor:function(/*Double*/w,/*Double*/h,/*Node*/parent){
		var node = createNode("div"),style = ["position:relative"];
		w && style.push("width:" + w);
		h && style.push("height:" + h);
		(style.length > 0) && attr(node,"style", style.join(";"));
		this.anchor = node;
		parent.appendChild(node);
		return node;
	},
	/*Boolean*/isGraphMark:function(/*String*/mark){
		return markReg.test(mark);
	},
	/*void*/styleAdapte: function(/*Node*/node,/*String*/style){
		style = style.split(";");
		var kv;
		for(var i = 0;i < style.length;i++){
			kv = style[i].split(":");
			switch(kv[0]){
				case 'fill':
					if(kv[1] != 'none'){
						attr(node, 'filled', 't');
						attr(node, 'fillcolor',kv[1]);
					}else{
						attr(node, 'filled', 'f');
					}
					break;
				case 'stroke':
					attr(node, 'strokecolor', kv[1]);
					break;
				case 'stroke-width':
					attr(node, 'strokeweight', kv[1]);
					break;
			}
		}
	},
	/*String*/commandAdapte:function(command){
		var c = command;
		switch(command){
			case path.QUADRATIC:
			case path.RQUADRATIC:
				c = path.QUADRATICVML;
				break;
		}
		return c;
	},
	/*void*/setSize:function(/*Double*/w,/*Double*/h){
		var node = this.anchor,style = [];
		w && style.push("width:" + w);
		h && style.push("height:" + h);
		(style.length > 0) && attr(node,"style", style.join(";"));
	},
	/*Node|void*/drawPath:function(/*Array<{command:"",points:[CoordinateFormatter]|String}>*/coordinates,/*String*/style,/*boolean*/open){
		var path,d = [], ps;
		dojo.forEach(coordinates,function(item){
			if(!item){return;}
			if(typeof item == "string"){
				this.push(item);
			}else{
				this.push(item.command);
				ps = item.points;
				(!dojo.isArray(ps)) && (ps = [ps]);
				dojo.forEach(ps,function(p){
					this.push((~~p.x || 0) + " " + (~~p.y || 0));
				},this);
			}
		},d);
		!open && d.push(" x");
		d.push(" e");
		//coordsize:{cx,cy} 是将width和height划分成cx和cy份，如果有px值，将忽略px.coordorigin定义坐标源点
		path = createNode("<v:shape style='width:1;height:1;position:absolute;' CoordSize='1,1'></v:shape>");
		attr(path,"path",d.join(""));
		this.styleAdapte(path, style);
		this.anchor.appendChild(path);
		return path;
	},
	/*Node|void*/drawCircle:function(/*CoordinateFormatter*/coordinate,/*Double*/r,/*String*/style){
		var s=["position:absolute","left:" + (coordinate.x - r),"top:" + (coordinate.y - r),"width:" + (r<<1),"height:" + (r<<1)],
			circle = createNode("<v:oval style='" + s.join(";") + "'></v:oval>");
		this.anchor.appendChild(circle);
		this.styleAdapte(circle, style);
		return circle;
	},
	/*Node|void*/drawEllipse:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Map*/attrs,/*String*/style){
		var s=["position:absolute","left:" + coordinate.x, "top:" + coordinate.y, "width:" + w,"height:" + h], ellipse, transform = attrs.transform;
		if(transform){
			s.push(";rotation:" + transform[1].substr(7, transform[1].length - 2));
		}
		ellipse = createNode("<v:oval style='" + s.join(";") + "'></v:oval>");
		this.styleAdapte(ellipse, style);
		this.anchor.appendChild(ellipse);
		return ellipse;
	},
	/*Node|void*/drawLine:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2,/*String*/style){
		var line = createNode("<v:line style='position:absolute'><v:line>");
		attr(line,"from",p1.x + ',' + p1.y);
		attr(line,"to",p2.x + ',' + p2.y);
		this.anchor.appendChild(line);
		return line;
	},
	/*Node|void*/drawRect:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Double*/rx,/*Map*/attrs,/*String*/style){
		var s=["position:absolute","left:" + coordinate.x,"top:" + coordinate.y,"width:" + w,"height:" + h], rect, transform = attrs.transform;
		if(transform){
			s.push(";rotation:" + transform[1].substr(7, transform[1].length - 2));
		}
		rect = (rx ===undefined)?createNode("<v:Rect style=" + s.join(";") + "></v:Rect>"):createNode("<v:RoundRect style=" + s.join(";") + "></v:RoundRect>");
		this.styleAdapte(rect, style);
		this.anchor.appendChild(rect);
		return rect;
	},
	/*Node|void*/drawImage:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/url,/*Map*/attrs){
		var s=["position:absolute","left:" + coordinate.x,"top:" + coordinate.y,"width:" + w,"height:" + h], image, transform = attrs.transform;
		if(transform){
			s.push(";rotation:" + transform[1].substr(7, transform[1].length - 2));
		}
		image = createNode("<v:image src='" + url + "' style='" + s.join(";") + "' ></v:image>");
		this.anchor.appendChild(image);
		return image;
	},
	/*Node|void*/drawText:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/textContent,/*Map*/attrs,/*String*/style){
		var text = createNode("text"),
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
			content = createNode("tspan");
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