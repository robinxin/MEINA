/**
 * draw kinds of graphs by Canvas
 */
dojo.provide("drawboard.graphic.CanvasGraphic");
dojo.require("drawboard.Constant");
dojo.require("drawboard.cache.ResourceCache");
(function(){
var pathConstant = drawboard.Constant.Path,
	pathName = window.location.pathname,
	rootName = pathName.substring(0, pathName.indexOf("/",1) + 1);
dojo.declare("drawboard.graphic.CanvasGraphic",null,{
	anchor:null,
	ctx:null,
	/*Context*/getContext:function(){
		if(!this.ctx){
			this.ctx = this.anchor.getContext("2d");
		}
		return this.ctx;
	},
	/*Node*/createAnchor:function(/*Double*/w,/*Double*/h,/*Node*/parent){
		var node = dojo.create("canvas"); 
		w && node.setAttribute("width", w);
		h && node.setAttribute("height",h);
		node.wkWidget = this;
		this.anchor = node;
		parent.appendChild(node);
		return node;
	},
	/*void*/setSize:function(/*Double*/w,/*Double*/h){
		var anchor = this.anchor;
		dojo.attr(anchor,"height",h);
		dojo.attr(anchor,"width",w);
	},
	/*Function*/setStyle:function(/*CanvasContext*/ct,/*String*/style){
		if(!style){
			return;
		}
		var styles = style.split(";"),s,functList = [],funct;
		dojo.forEach(styles,function(item){
			s = item.split(':');
			switch(s[0]){
				case "fill":
					ct.fillStyle = s[1];
					funct = "fill";
					break;
				case "stroke":
					ct.strokeStyle = s[1];
					funct = "stroke";
					break;
				case "stroke-width":
					ct.lineWidth = s[1];
					funct = null;
					break;
				case "":
					break;
				default:
					break;
			}
			(s[1] != "none") && funct && functList.push(funct);
		},this);
		return function(){
			var pct = ct;
			dojo.forEach(functList,function(item){
				pct[item]();
			},this);
		};
	},
	/*void*/setAttrs:function(/*CanvasContext*/ct,/*Map*/attrs){
		if(attrs){
			var attr,value;
			for(attr in attrs){
				if(attr == "transform"){
					dojo.forEach(attrs[attr],function(opt){
						value = opt.indexOf("rotate");
						if(value != -1){
							opt.substr(rindex,opt.length - 2 - value);
							return;
						}
						eval("ct." + opt + ";");
					},this);
				}
			}	
		}
	},
	/*void*/drawLine:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2,/*String*/style){
		var ct = this.getContext(),
			funct = this.setStyle(ct,style);
		ct.moveTo(p1.x,p1.y);
		ct.lineTo(p2.x,p2.y);
		funct();
	},
	/*void*/drawRect:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*Double*/rx,/*Map*/attrs,/*String*/style){
		var ct = this.getContext(),funct;
		ct.save();
		funct = this.setStyle(ct,style);
		this.setAttrs(attrs);
		ct.moveTo(coordinate.x + (w > 0 ? rx : -rx), coordinate.y);    
		ct.arcTo(coordinate.x + w, coordinate.y, coordinate.x + w, coordinate.y + h - rx, rx);    
		ct.arcTo(coordinate.x + w, coordinate.y + h, coordinate.x + rx, coordinate.y + h, rx);    
		ct.arcTo(coordinate.x, coordinate.y + h, coordinate.x, coordinate.y + rx, rx);
		ct.arcTo(coordinate.x, coordinate.y, coordinate.x + (w > 0 ? rx : -rx), coordinate.y, rx);
		
		funct();
		ct.restore();
	},
	/*void*/drawCircle:function(/*CoordinateFormatter*/coordinate,/*Double*/r,/*String*/style){
		var ct= this.getContext(),
			funct = this.setStyle(ct,style);
		ct.beginPath();
		ct.arc(coordinate.x,coordinate.y,r,0,Math.PI*2,true);
		ct.closePath();
		//draw the circle
		funct();
	},
	/*Node|void*/drawPath:function(/*Array<{command:"",points:[CoordinateFormatter]|String}>*/coordinates,/*String*/style,/*boolean*/open){
		var ct= this.getContext(),p,
			funct = this.setStyle(ct,style);
		ct.beginPath();
		dojo.forEach(coordinates,function(item,index){
			p = item.points;
			switch(item.command){
				case pathConstant.MOVE:
				case pathConstant.RMOVE:
					ct.moveTo(p.x,p.y);
					break;
				case pathConstant.LINE:
				case pathConstant.RLINE:
					ct.lineTo(p.x,p.y);
					break;
				case pathConstant.NONE:
				default:
					break;
			}
		},this);
		!open && ct.closePath();
		//draw the circle
		funct();
	},
	/*Node|void*/drawImage:function(/*CoordinateFormatter*/coordinate,/*Double*/w,/*Double*/h,/*String*/url,/*Map*/attrs){
		var ct = this.getContext(),
			cache = drawboard.resourceCenter.getCache();
		ct.save();
		this.setAttrs(ct,attrs);
		if(cache[url]){
			ct.drawImage(cache[url],coordinate.x,coordinate.y,w,h);
		}else{
			var img = new Image();
			img.onload = function(){
				ct.drawImage(img,coordinate.x,coordinate.y,w,h);
				cache[url] = img;
			};
			img.src = rootName + url;
		}
		ct.restore();
	},
//	/*void*/drawSmailFace:function(/*Position*/pos,/*String*/fillStyle){
//		var ct= this.getContext(),w = pos.getW(),h = pos.getH(),
//		radius = w > h?h:w;
//		fillStyle && (ct.fillStyle = fillStyle);
//		ct.beginPath();
//		ct.arc((pos.endX - pos.x)>>1,(pos.endY - pos.y)>>1,radius>>1,0,Math.PI*2,true);
//		ct.arc((pos.endX - pos.x)>>2,(pos.endY - pos.y)>>2,radius>>2,90,Math.PI*2,true);
//		ct.arc((pos.endX - pos.x)>>1 + (pos.endX - pos.x)>>2,(pos.endY - pos.y)>>2,radius>>2,90,Math.PI*2,true);
//		ct.closePath();
//		//stroke the circle
//		ct.stroke();
//	},
//	/*void*/drawShadow:function(/*Double*/offsetX,/*Double*/offsetY,/*String*/shadowColor){
//		var ct= this.getContext();
//		ct.shadowOffsetX  = offsetX;
//		ct.shadowOffsetY  = offsetY;
//		ct.shadowColor = shadowColor;
//	},
//	/*void*/scale:function(/*Double*/xRatio,/*Double*/yRatio,/*Position*/pos){
//		var ct = this.getContext();
//		ct.scale(xRatio,yRatio);
//	},
	/*void*/clear:function(){
		var ct = this.getContext(),
			canvas = ct.canvas;
		ct.clearRect(0,0,canvas.width,canvas.height);
	}
});
})();