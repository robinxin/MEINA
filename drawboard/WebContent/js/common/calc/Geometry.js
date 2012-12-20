dojo.provide("common.calc.Geometry");
dojo.require("common.calc.Math");
dojo.require("common.utils.CollectionUtils");
(function(){
var math = common.calc.Math,
	utils = common.utils.CollectionUtils;
common.calc.Geometry = {
	/*CoordinateFormatter*/add2Points:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2){
		return {x:p1.x + p2.x,y:p1.y + p2.y};
	},
	/*CoordinateFormatter*/subtract2Points:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2){
		return {x:p1.x - p2.x,y:p1.y - p2.y};
	},
	/*Array<CoordinateFormatter>*/multiPoint:function(/*Array<CoordinateFormatter>|CoordinateFormatter*/p1,/*CoordinateFormatter*/multi){
		var np = [],copy4Attrs = utils.copy4Attrs,temp;
		(!dojo.isArray(p1))&&(p1 = [p1]);
		dojo.forEach(p1,function(item){
			temp = {x:item.x*multi.x,y:item.y*multi.y};
			copy4Attrs(item,temp,{x:1,y:1});
			np.push(temp);
		},this);
		return np;
	},
	/*Array<CoordinateFormatter>*/dividePoint:function(/*Array<CoordinateFormatter>|CoordinateFormatter*/p1,/*CoordinateFormatter*/divide){
		var np = [],copy4Attrs = utils.copy4Attrs,temp;
		(!dojo.isArray(p1))&&(p1 = [p1]);
		dojo.forEach(p1,function(item){
			temp = {x:item.x/divide.x,y:item.y/divide.y};
			copy4Attrs(item,temp,{x:1,y:1});
			np.push(temp);
		},this);
		return np;
	},
	/**
	 * calculate the distance of two points
     * @param {CoordinateFormatter} first point
     * @param {CoordinateFormatter} second point
     * @returns {Double} distance
	 */
	/*Double*/getDistant:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2) {
		if(p1.x == p2.x){
			return Math.abs(p2.y - p1.y);
		}
		if(p1.y == p2.y){
			return Math.abs(p2.x - p1.x);
		}
	    return Math.sqrt(Math.pow((p1.x - p2.x),2) + Math.pow((p1.y - p2.y),2));
	},
	/*boolean*/equals4Ps:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2){
		if(p1.x == p2.x && p1.y == p2.y){
			return true;
		}
		return false;
	},
	/*{xmax:double,xmin:double,ymax:double,ymin:double}*/getExtremePoints:function(/*Array<Array<CoordinateFormatter>>*/rects){
		var maxX,maxY,minX,minY;
		dojo.forEach(rects,function(rect){
			dojo.forEach(rect,function(ps){
				if(maxX ===undefined){
					maxX = minX = ps.x;
					maxY = minY = ps.y;
					return;
				}
				(ps.x > maxX)&&(maxX = ps.x);
				(ps.x < minX)&&(minX = ps.x);
				(ps.y > maxY)&&(maxY = ps.y);
				(ps.y < minY)&&(minY = ps.y);
			},this);
		},this);
		return {minX:minX,maxX:maxX,minY:minY,maxY:maxY};
	},
	/*{x:double,y:double,width:double,height:double}*/getMaxRect:function(/*Array<Array<CoordinateFormatter>>*/rects){
		var maxX,maxY,minX,minY;
		dojo.forEach(rects,function(rect){
			dojo.forEach(rect,function(ps){
				if(maxX ===undefined){
					maxX = minX = ps.x;
					maxY = minY = ps.y;
					return;
				}
				(ps.x > maxX)&&(maxX = ps.x);
				(ps.x < minX)&&(minX = ps.x);
				(ps.y > maxY)&&(maxY = ps.y);
				(ps.y < minY)&&(minY = ps.y);
			},this);
		},this);
		return {x:minX,y:minY,width:maxX - minX,height:maxY - minY};
	},
	/**
      * Calculates the angle defined by the three points A, B, C if you're going from A to C around B counterclockwise.
      * @param {JXG.Point} A Point or [x,y] array
      * @param {JXG.Point} B Point or [x,y] array
      * @param {JXG.Point} C Point or [x,y] array
      * @see #rad
      * @returns {Number} The angle in degrees.
      */
     /*double*/angle: function(A, B, C) {
         return this.rad(A, B, C) * 57.295779513082323; // *180.0/Math.PI;
     },
	/**
	 * Calculates the internal angle defined by the three points A, B, C if you're going from A to C around B counterclockwise.
	 * @param {CoordinateFormatter}Point 
	 * @param {CoordinateFormatter}Point 
	 * @param {CoordinateFormatter}Point 
	 */
	/*double*/rad:function(/*CoordinateFormatter*/A,/*CoordinateFormatter*/B,/*CoordinateFormatter*/C){
		var ax = A.x,
			ay = A.y,
			bx = B.x, 
			by = B.y, 
			cx = C.x, 
			cy = C.y,
			phi;
		phi = Math.atan2(cy - by, cx - bx) - Math.atan2(ay - by, ax - bx);
	   	if (phi < 0) phi += 6.2831853071795862;
	   	return phi;
	},
	/**
	 * Computes the new position of a point which is rotated
	 * around a second point (called pole) by the angle.
     * @param {CoordinateFormatter} point point to be rotated
     * @param {CoordinateFormatter} pole Center of the rotation
     * @param {Double} angle rotation angle in arc length
     * @returns {CoordinateFormatter} Coordinates of the new position.
	 */
	/*CoordinateFormatter*/rotation:function(/*CoordinateFormatter*/coordinate,/*CoordinateFormatter*/pole,/*Double*/angle){
 		var x0 = coordinate.x - pole.x,
 			y0 = coordinate.y - pole.y,
 			angle = 3.1415916*angle/180,
 			c = Math.cos(angle),
 			s = Math.sin(angle),
 			x1 = x0 * c - y0 * s + pole.x,
 			y1 = x0 * s + y0 * c + pole.y;
 		return {x:x1,y:y1};
	},
	/**
	 * 点在矩形内
	 * @param q1:start coordinate of rectangle
	 * @param q2:end coordinate of rectangle
	 * @param p:point to judge whether or not in the rectangle
	 */
	/*boolean*/isPointInRect:function(/*CoordinateFormatter*/q1,/*CoordinateFormatter*/q2,/*CoordinateFormatter*/p){
		var min = Math.min,max = Math.max;
		if(min(q1.x,q2.x) <= p.x && p.x <= max(q1.x,q2.x) && min(q1.y,q2.y) <= p.y && p.y <= max(q1.y,q2.y)){
			return true;
		}
		return false;
	
		if(coordinate.x < rect.coordinate.x || coordinate.y < rect.coordinate.y || 
				coordinate.x > rect.coordinate.x + rect.w || coordinate.y > rect.coordinate.y + rect.h){
				return false;
			}
			return true;
	},
	/**
	 * 点在圆内
	 */
	/*boolean*/isPointInCircle:function(/*CoordinateFormatter*/coordinate,/*{coordinate:CoordinateFormatter,r:Double}*/circle){
		var distance = this.getDistant(coordinate, circle.coordinate);
		if(distance <= circle.r){
			return true;
		}
		return false;
	},
	/**
	 * 
	 */
	/**
	 * 点在线上，(P - Q1)*(Q2 - Q1)=0,且P在以Q1,Q2为对角顶点的矩形内
	 * @param q1:first coordinate of segment
	 * @param q2:end coordinate of segment
	 * @param p:point to judge whether or not in the segment
	 */
	/*boolean*/isPointInSegment:function(/*CoordinateFormatter*/q1,/*CoordinateFormatter*/q2,/*CoordinateFormatter*/p){
		if(math.cross(q1,q2,p) != 0){
			return false;
		}
		return this.isPointInRect(q1, q2, p);
	},
	/**
	 * 点在多边形中
	 */
	/*boolean*/isPointInPolyn:function(/*Array<CoordinateFormatter>*/poly,/*CoordinateFormatter*/pt){
		for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
	        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
	        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
	        && (c = !c);
	    return c;
		
	},
	/**
	 *	图形包含图形
	 *@oriPos   parent graph which maybe contain another graph
	 *@comparePos graph which maybe be contained.
	 */
	/*boolean*/graphContainsGraph:function(/*CoordinateFormatter*/oriPos,/*CoordinateFormatter*/comparePos){
		var parent = this.getExtremePoints(oriPos),
			child = this.getExtremePoints(comparePos);
		if(parent.minX > child.minX && parent.minY > child.minY
			&& parent.maxX < child.maxX && parent.maxY < child.maxY){
			return true;
		}
		return false;
	},
	/**
	 * 矩形相交
	 */
	/*boolean*/intersectRectRect:function(/*CoordinateFormatter*/oriPos,/*CoordinateFormatter*/comparePos){
		var oriX = oriPos.x,oriY = oriPos.y,
			oriEndX = oriX + oriPos.width,oriEndY = oriY + oriPos.height,
			compareX = comparePos.x,compareY = comparePos.y,
			compareEndX = compareX + comparePos.width,compareEndY = compareY + comparePos.height;
		if(oriEndX == undefined || oriEndY == undefined || compareEndX == undefined || compareEndY == undefined){
			return false;
		}
		var xs = (oriX > oriEndX)?{min:oriEndX,max:oriX}:{min:oriX,max:oriEndX},
			ys = (oriY > oriEndY)?{min:oriEndY,max:oriY}:{min:oriY,max:oriEndY},
			compareXs = (compareX > compareEndX)?{min:compareEndX,max:compareX}:{min:compareX,max:compareEndX},
			compareYs = (compareY > compareEndY)?{min:compareEndY,max:compareY}:{min:compareY,max:compareEndY}	;
		if(xs.min > compareXs.max || ys.min > compareYs.max 
			|| xs.max < compareXs.min || ys.max < compareYs.min){
			return false;
		}
		return true;
	},
	/**
     * Calculates the coordinates of the intersection of the given lines.
     * @param {CoordinateFormatter} line1 Line.
     * @param {CoordinateFormatter} line2 Line.
     * @returns {CoordinateFormatter} Coordinates of the intersection point of the given lines.
     */
    /*CoordinateFormatter*/intersectLineLine: function(/*CoordinateFormatter*/line1,/*CoordinateFormatter*/line2) {
        var A = line1.x,
            B = line1.y,
            C = line2.x,
            D = line2.y,
            d0, d1, den, x, y;

        d0 = A[1] * B[2] - A[2] * B[1];
        d1 = C[1] * D[2] - C[2] * D[1];
        den = (B[2] - A[2]) * (C[1] - D[1]) - (A[1] - B[1]) * (D[2] - C[2]);

        if (Math.abs(den) < Math.E) {
            den = Math.E;
        }
        x = (d0 * (C[1] - D[1]) - d1 * (A[1] - B[1])) / den;
        y = (d1 * (B[2] - A[2]) - d0 * (D[2] - C[2])) / den;

        return {x:x,y:y};
    },
	/*boolean*/isHorizontal:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2){
		if(p1.x == p2.x){
			return true;
		}
		return false;
	},
	/*boolean*/isVertical:function(/*CoordinateFormatter*/p1,/*CoordinateFormatter*/p2){
		if(p1.y == p2.y){
			return true;
		}
		return false;
	},
	/**
	 * calculate the vertical distance of the point to line
	 * 点c0到线段[c1,c2]或者线段的延长线上的垂直距离
	 * @param {CoordinateFormatter} first line coordinate
	 * @param {CoordinateFormatter} end line coordinate
	 * @param {CoordinateFormatter} point
	 */
	/*CoordinateFormatter*/vdistP2Lin:function(/*CoordinateFormatter*/c1,/*CoordinateFormatter*/c2,/*CoordinateFormatter*/c0){
		var a = 180 - this.angle(c1, c2, c0),
			d = this.getDistant(c2, c0);
		return {x:Math.cos(a) * d,y:Math.sin(a) * d};
	},
	/**
	 * calculate the shortest distance of point to line
	 * 点到线段的最短距离的判断点c0到由两点组成的线段c1,c2
	 * @param {CoordinateFormatter} first line coordinate
	 * @param {CoordinateFormatter} end line coordinate
	 * @param {CoordinateFormatter} point
	 */
	/*Double*/distP2Line:function(/*CoordinateFormatter*/c1,/*CoordinateFormatter*/c2,/*CoordinateFormatter*/c0){
		var space = 0,
			getDist = this.getDistant,
			a = getDist(c1,c2),			// 线段的长度
			b = getDist(c1,c0),			//线段到点的长度
			c = getDist(c2,c0),			//线段到点的长度
			p,s;
		if (c <= 0.000001 || b <= 0.000001) {
	           space = 0;
	           return space;
	        }
	        if (a <= 0.000001) {
	           space = b;
	           return space;
	        }
	        if (c * c >= a * a + b * b) {
	           space = b;
	           return space;
	        }
	        if (b * b >= a * a + c * c) {
	           space = c;
	           return space;
	        }
	        //半周长
	        p = (a + b + c) >> 1;							
	        //海伦公式求面积
	        s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
	        //返回点到线的距离（利用三角形面积公式求高）
	        space = 2 * s / a;
	        return space;
	},
	/*Array<CoordinateFormatter>*/intersectCircleLine: function(/*CoordinateFormatter*/c1,/*Double*/r,/*CoordinateFormatter*/l1,/*CoordinateFormatter*/l2) {
        var s, d0, d1, b, w, h, r, n1, dx, dy, firstPointX, firstPointY, l, x, y, n1s, firstPoint, secondPoint, d,
	        dist = this.getDistant;
	
	    s = dist(l1, l2);
	    if (s > 0) {
	        d0 = dist(c1,l1);
	        d1 = dist(c1,l2);
	        b = ((d0 * d0) + (s * s) - (d1 * d1)) / (2 * s);
	        w = (d0 * d0) - (b * b);
	        w = (w < 0) ? 0 : w;
	        h = Math.sqrt(w);
	
	        n1 = Math.sqrt((r * r) - h * h);
	        dx = l2.x - l1.x;
	        dy = l2.y - l1.y;
	        firstPointX = c1.x + (h / s) * dy;
	        firstPointY = c1.y - (h / s) * dx;
	        d0 = (l2.x * dy) - (l2.y * dx);
	        d1 = (firstPointX * dx) + (firstPointY * dy);
	        l = (dy * dy) + (dx * dx);
	        if (Math.abs(l) < Math.E) {
	            l = Math.E;
	        }
	        x = ((d0 * dy) + (d1 * dx)) / l;
	        y = ((d1 * dy) - (d0 * dx)) / l;
	        n1s = n1 / s;
	        firstPoint = {x:x + n1s * dx,y:y + n1s * dy};
	        secondPoint = {x:x - n1s * dx,y:y - n1s * dy};
	        d = dist(c1, firstPoint);
	
	        if ((r < (d - 1)) || isNaN(d)) {
	            return [];
	        } else {
	            return [firstPoint,secondPoint];
	        }
	    }
	    return [];
	}
};
})();