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

if(!dojo._hasResource["common.Cache"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.Cache"] = true;
dojo.provide("common.Cache");
dojo.declare("common.Cache",null,{
	/*Object*/_cache:null,			//information cache
	/**
	 * according to the instance to choose difference class
	 */
	/*Object*/getCache:function(){
		if(!this._cache){
			this._cache = this.createCache();
		}
		return this._cache;
	},
	/**
	 * create cache by subclass
	 */
	/*Object*/createCache:function(){
		//override by subclass
	},
	/**
	 * clear cache
	 */
	/*void*/clearCache:function(){
		this._cache = null;
		delete this._cache;
	}
});

}

if(!dojo._hasResource["common.Constant"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.Constant"] = true;
dojo.provide("common.Constant");
common.Constant = {
	Exception:{
		WARNNING:0,
		ERROR:1
	}
};

}

if(!dojo._hasResource["dojo.dnd.common"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo.dnd.common"] = true;
dojo.provide("dojo.dnd.common");


dojo.getObject("dnd", true, dojo);

dojo.dnd.getCopyKeyState = dojo.isCopyKey;

dojo.dnd._uniqueId = 0;
dojo.dnd.getUniqueId = function(){
	// summary:
	//		returns a unique string for use with any DOM element
	var id;
	do{
		id = dojo._scopeName + "Unique" + (++dojo.dnd._uniqueId);
	}while(dojo.byId(id));
	return id;
};

dojo.dnd._empty = {};

dojo.dnd.isFormElement = function(/*Event*/ e){
	// summary:
	//		returns true if user clicked on a form element
	var t = e.target;
	if(t.nodeType == 3 /*TEXT_NODE*/){
		t = t.parentNode;
	}
	return " button textarea input select option ".indexOf(" " + t.tagName.toLowerCase() + " ") >= 0;	// Boolean
};

}

if(!dojo._hasResource["common.Identity"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.Identity"] = true;
dojo.provide("common.Identity");

dojo.declare("common.Identity",null,{
	/*String*/idty:null,
	/*String*/preIdt:null,
	/*String*/getIdty:function(){
		if(!this.idty){
			this.idty = this.generateIdty();
		}
		return this.idty;
	},
	/*String*/generateIdty:function(){
		var idt = dojo.dnd.getUniqueId();
		return this.preIdt?this.preIdt + "_" + idt:idt;
	}
});

}

if(!dojo._hasResource["common.calc.Math"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.calc.Math"] = true;
dojo.provide("common.calc.Math");
(function(){
var zero = Math.exp(-12),
	maxn = 100000,
	allBaseLines = new Array();
common.calc.Math = {
		/**the calculation of add|subtract|multiply|divide has some problem
		 * provide the divide calculation via the javascript language will lose accuracy
		 * @param arg1
		 * @param arg2
		 * @returns {Number}
		 */
		/*double*/divide:function(arg1,arg2){ 
			var t1=0,t2=0,r1,r2; 
			try{t1=arg1.toString().split(".")[1].length;}catch(e){} 
			try{t2=arg2.toString().split(".")[1].length;}catch(e){} 
			with(Math){ 
			r1=Number(arg1.toString().replace(".",""));
			r2=Number(arg2.toString().replace(".",""));
			return (r1/r2)*pow(10,t2-t1); 
			} 
		}, 
		/**
		 * provide the multiply calculation via the javascript language will lose accuracy
		 * @param arg1
		 * @param arg2
		 * @returns {Number}
		 */
		/*double*/multiply:function(arg1,arg2) 
		{ 
			var m=0,s1=arg1.toString(),s2=arg2.toString(); 
			try{m+=s1.split(".")[1].length;}catch(e){} 
			try{m+=s2.split(".")[1].length;}catch(e){} 
			return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
		},
		/**
		 * provide the add calculation via the javascript language will lose accuracy
		 * @param arg1
		 * @param arg2
		 * @returns {Number}
		 */
		/*double*/add:function(arg1,arg2){ 
			var r1,r2,m; 
			try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
			try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;} 
			m=Math.pow(10,Math.max(r1,r2)); 
			return (arg1*m+arg2*m)/m;
		},
		/**
		 * provide the subtract calculation via the javascript language will lose accuracy
		 * @param arg1
		 * @param arg2
		 * @returns
		 */
		/*double*/subtract:function(arg1,arg2){
		     var r1,r2,m,n;
		     try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
		     try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
		     m=Math.pow(10,Math.max(r1,r2));
		     n=(r1>=r2)?r1:r2;
		     return ((arg1*m-arg2*m)/m).toFixed(n);
		},
		/**
         * Computes the product of the two matrices mat1*mat2.
         * @param {Array} mat1 Two dimensional array of numbers
         * @param {Array} mat2 Two dimensional array of numbers
         * @returns {Array} Two dimensional Array of numbers containing result
         *  
         * in SVG transform matrix,the third row is [0 0 1]
         * Translation [1 0 0 1 tx ty]
         * Scaling [sx 0 0 sy 0 0]
         * Rotation [cos(a) sin(a) -sin(a) cos(a) 0 0]
         * skew  x-axis:[1 0 tan(a) 1 0 0]
         * 		 y-axis:[1 tan(a) 0 1 0 0]
         * http://www.w3.org/TR/SVG/coords.html#TransformAttribute
         */
        matMatMult: function(mat1, mat2) {
            var m = mat1.length,
                n = m>0 ? mat2[0].length : 0,
                m2 = mat2.length,
                res = this.matrix(m,n),
                i, j, s, k;

            for (i=0;i<m;i++) {
                for (j=0;j<n;j++) {
                    s = 0;
                    for (k=0;k<m2;k++) {
                        s += mat1[i][k]*mat2[k][j];
                    }
                    res[i][j] = s;
                }
            }
            return res;
        },
        /**
         * Initializes a matrix as an array of rows with the given value.
         * @param {Number} n Number of rows
         * @param {Number} [m=n] Number of columns
         * @param {Number} [init=0] Initial value for each coefficient
         * @returns {Array} A <tt>n</tt> times <tt>m</tt>-matrix represented by a
         * two-dimensional array. The inner arrays hold the columns, the outer array holds the rows.
         */
        matrix: function(n, m, init) {
            var r, i, j;

            init = init || 0;
            m = m || n;

            r = new Array(Math.ceil(n));
            for(i=0; i<n; i++) {
                r[i] = new Array(Math.ceil(m));
                for(j=0; j<m; j++) {
                    r[i][j] = init;
                }
            }

            return r;
        },
	    /**
         * Multiplies a vector vec to a matrix mat: mat * vec. The matrix is interpreted by this function as an array of rows. Please note: This
         * function does not check if the dimensions match.
         * @param {Array} mat Two dimensional array of numbers. The inner arrays describe the columns, the outer ones the matrix' rows.
         * @param {Array} vec Array of numbers
         * @returns {Array} Array of numbers containing the result
         * @example
         * var A = [[2, 1],
         *          [1, 3]],
         *     b = [4, 5],
         *     c;
         * c = common.calc.Math.matVecMult(A, b)
         * // c === [13, 19];
         */
        matVecMult: function(mat, vec) {
            var m = mat.length,
                n = vec.length,
                res = [],
                i, s, k;

            if (n===3) {
                for (i=0;i<m;i++) {
                    res[i] = mat[i][0]*vec[0] + mat[i][1]*vec[1] + mat[i][2]*vec[2];
                }
            } else {
                for (i=0;i<m;i++) {
                    s = 0;
                    for (k=0;k<n;k++) { s += mat[i][k]*vec[k]; }
                    res[i] = s;
                }
            }
            return res;
        },
	/**
	 * 快速凸包算法
	 * @param points:points' array
	 */
	/*Array<Array<double>>*/quickHull:function(/*Array<double>*/points) {
	    //find first baseline
	    var maxX, minX;
	    var maxPt, minPt;
	    for (var idx in points) {
	        var pt = points[idx];
	        if (pt[0] > maxX || !maxX) {
	            maxPt = pt;
	            maxX = pt[0];
	        }
	        if (pt[0] < minX || !minX) {
	            minPt = pt;
	            minX = pt[0];
	        }
	    }
	    var ch = [].concat(this.buildConvexHull([minPt, maxPt], points),
	                       this.buildConvexHull([maxPt, minPt], points))
	    return ch;
	},
	/*Array<Array<double>>*/buildConvexHull:function(/*Array<double>*/baseLine,/*Array<Array<double>>*/points) {
	    allBaseLines.push(baseLine);
	    var convexHullBaseLines = new Array();
	    var t = this.findMostDistantPointFromBaseLine(baseLine, points);
	    if (t.maxPoint.length) { // if there is still a point "outside" the base line
	        convexHullBaseLines = 
	            convexHullBaseLines.concat( 
	                this.buildConvexHull( [baseLine[0],t.maxPoint], t.newPoints) 
	            );
	        convexHullBaseLines = 
	            convexHullBaseLines.concat( 
	                this.buildConvexHull( [t.maxPoint,baseLine[1]], t.newPoints) 
	            );
	        return convexHullBaseLines;
	    } else {  
	    	// if there is no more point "outside" the base line, the current base line is part of the convex hull
	        return [baseLine];
	    }    
	},
	getDistant:function(cpt, bl) {
	    var Vy = bl[1][0] - bl[0][0];
	    var Vx = bl[0][1] - bl[1][1];
	    return (Vx * (cpt[0] - bl[0][0]) + Vy * (cpt[1] -bl[0][1]));
	},
	findMostDistantPointFromBaseLine:function(/*Array<CoordinateFormatter>*/baseLine, /*Array<CoordinateFormatter>*/points) {
	    var maxD = 0;
	    var maxPt = new Array();
	    var newPoints = new Array();
	    for (var idx in points) {
	        var pt = points[idx];
	        var d = this.getDistant(pt, baseLine);
	        
	        if ( d > 0) {
	            newPoints.push(pt);
	        } else {
	            continue;
	        }
	        
	        if ( d > maxD ) {
	            maxD = d;
	            maxPt = pt;
	        }
	    
	    } 
	    return {'maxPoint':maxPt, 'newPoints':newPoints};
	},
	/*integer*/sgn:function(/*double*/x){
		return Math.abs(x)<zero?0:(x>0?1:-1);
	},
	/**
	 * 叉乘
	 * (P - Q1)*(Q2 - Q1)=0 点在直线上，可能在延长线或反向延长线上。
	 * @param q1:first coordinate of segment
	 * @param q2:end coordinate of segment
	 * @param p:point to judge whether or not in the segment
	 */
	/*double*/cross:function(/*CoordinateFormatter*/q1,/*CoordinateFormatter*/q2,/*CoordinateFormatter*/p){
		return (p.x - q1.x) * (q2.y - q1.y) - (q2.x - q1.x) * (p.y - q1.y);
	},
	/*boolean*/cmp:function(/*CoordinateFormatter*/a,/*CoordinateFormatter*/b){
		return (a.x < b.x || this.sgn(a.x - b.x) == 0 && a.y < b.y);
	},
	/**
	 * swap two object
	 */
	/*void*/swap:function(/*CoordinateFormatter*/a,/*CoordinateFormatter*/b){
		var temp = {};
		temp.x = a.x;
		temp.y = a.y;
		a.x = b.x;
		a.y = b.y;
		b.x = temp.x;
		b.y = temp.y;
	},
	/**
	 * get random points within the max x and y
	 * @param <integer>:point count
	 * @param <double>:max x
	 * @param <double>:max y
	 */
	/*Array<Array<double>>*/getRandomPoints:function(/*integer*/numPoint, /*double*/xMax,/*double*/yMax) {
	    var points = new Array();
	    var phase = Math.random() * Math.PI * 2;
	    for (var i = 0; i < numPoint/2; i++) {
	        var r =  Math.random()*xMax/4;
	        var theta = Math.random() * 1.5 * Math.PI + phase;
	        points.push( [ xMax /4 + r * Math.cos(theta), yMax/2 + 2 * r * Math.sin(theta) ] )
	    }
	    var phase = Math.random() * Math.PI * 2;
	    for (var i = 0; i < numPoint/2; i++) {
	        var r =  Math.random()*xMax/4;
	        var theta = Math.random() * 1.5 * Math.PI + phase;
	        points.push( [ xMax /4 * 3 +  r * Math.cos(theta), yMax/2 +  r * Math.sin(theta) ] )
	    }
	    return points;
	}
};
})();

}

if(!dojo._hasResource["common.utils.CollectionUtils"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.utils.CollectionUtils"] = true;
dojo.provide("common.utils.CollectionUtils");
common.utils.CollectionUtils = {
	/*Array*/sliceRange:function(/*Array*/arrays,/*Integer|0*/start,/*Integer*/count){
		var range = [],
			end = (start + count>arrays.length - 1)?arrays.length - 1:start + count;
		for(;end>=start;end--){
			range[--count] = arrays[end];
		}
		return range;
	},
	/**
	 * copy attribute from one to another except function and specific attribute name
	 */
	/*void*/copy4Attrs:function(/*Object*/from,/*Object*/to,/*Map*/except){
		for(var attr in from){
			if((except && except[attr]) || (typeof from[attr] == "function")){
				continue;
			}
			to[attr] = from[attr];
		}
	},
	/*boolean*/hasAttr:function(/*Object*/o){
		var has = false;
		for(var attr in o){
			has = true;
		}
		return has;
	}
};

}

if(!dojo._hasResource["common.calc.Geometry"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.calc.Geometry"] = true;
dojo.provide("common.calc.Geometry");


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
	 * ���ھ�����
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
	 * ����Բ��
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
	 * �������ϣ�(P - Q1)*(Q2 - Q1)=0,��P����Q1,Q2Ϊ�ԽǶ���ľ�����
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
	 * ���ڶ������
	 */
	/*boolean*/isPointInPolyn:function(/*Array<CoordinateFormatter>*/poly,/*CoordinateFormatter*/pt){
		for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
	        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
	        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
	        && (c = !c);
	    return c;
		
	},
	/**
	 *	ͼ�ΰ�ͼ��
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
	 * �����ཻ
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
	 * ��c0���߶�[c1,c2]�����߶ε��ӳ����ϵĴ�ֱ����
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
	 * �㵽�߶ε���̾�����жϵ�c0����������ɵ��߶�c1,c2
	 * @param {CoordinateFormatter} first line coordinate
	 * @param {CoordinateFormatter} end line coordinate
	 * @param {CoordinateFormatter} point
	 */
	/*Double*/distP2Line:function(/*CoordinateFormatter*/c1,/*CoordinateFormatter*/c2,/*CoordinateFormatter*/c0){
		var space = 0,
			getDist = this.getDistant,
			a = getDist(c1,c2),			// �߶εĳ���
			b = getDist(c1,c0),			//�߶ε���ĳ���
			c = getDist(c2,c0),			//�߶ε���ĳ���
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
	        //���ܳ�
	        p = (a + b + c) >> 1;							
	        //���׹�ʽ�����
	        s = Math.sqrt(p * (p - a) * (p - b) * (p - c));
	        //���ص㵽�ߵľ��루������������ʽ��ߣ�
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

}

if(!dojo._hasResource["common.command.Command"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.command.Command"] = true;
dojo.provide("common.command.Command");
dojo.declare("common.command.Command",null,{
	/*void*/execute:function(){
		//override by subclass
	},
	/*void*/unexecute:function(){
		//override by subclass
	}
});

}

if(!dojo._hasResource["common.container.ListContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.container.ListContainer"] = true;
dojo.provide("common.container.ListContainer");

dojo.declare("common.container.ListContainer",null,{
	/*ArrayList*/list:null,
	/*void*/constructor:function(){
		this.list = new dojox.collections.ArrayList();
	},
	/*Array*/getList:function(){
		return this.list.toArray();
	},
	/*boolean*/contains:function(value){
		if(this.list.contains(value)){
			return true;
		}
		return false;
	},
	/*Object*/get:function(/*Integer*/index){
		return this.list.item(index);
	},
	/*void*/add:function(/*Object*/value){
		if(!this.contains(value)){
			this.list.add(value);
		}
	},
	/*void*/remove:function(/*Integer|Object*/index){
		var list = this.list;
		if(typeof index == "object"){
			this.list.remove(index);
			return;
		}
		if(index > list.count - 1){return;}
		this.list.removeAt(index);
	},
	/*void*/insert:function(/*Integer*/index,/*Object*/item){
		this.list.insert(index,item);
	},
	/*Object*/pop:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(list.count - 1);
		list.removeAt(list.count - 1);
		return obj;
	},
	/*Object*/shift:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(0);
		list.removeAt(0);
		return obj;
	},
	/*Object*/first:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(0);
		return obj;
	},
	/*Object*/last:function(){
		var list = this.list,obj;
		if(list.count == 0){return null;}
		obj = list.item(list.count - 1);
		return obj;
	},
	/*Integer*/size:function(){
		return this.list.count;
	},
	/*Integer*/indexOf:function(/*Object*/item){
		return this.list.indexOf(item);
	},
	/**
	 * move item from original position to new position
	 */
	/*void*/move:function(/*Integer*/oriIndex,/*Integer*/newIndex){
		var item = this.get(oriIndex);
		this.remove(oriIndex);
		this.insert(newIndex, item);
	},
	/*void*/clearItems:function(){
		this.list.clear();
	},
	/*void*/forInItems:function(/*Function*/f,/*Object?*/o,/*boolean*/reverse){
		if(!f){return;}
		o = o || this;
		var list = this.list.toArray();
		dojo.forEach(reverse?list.reverse():list,f,o);
	},
	/*void*/some:function(/*Function*/f,/*Object*/o,/*boolean*/reverse){
		if(!f){return;}
		o = o || this;
		var list = this.list.toArray();
		dojo.some(reverse?list.reverse():list,f,o);
	},
	/*void*/concat:function(list){
		this.list.addRange(list);
	}
});

}

if(!dojo._hasResource["common.container.MapContainer"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.container.MapContainer"] = true;
dojo.provide("common.container.MapContainer");
dojo.declare("common.container.MapContainer",null,{
	/*Map*/map:null,
	/*boolean*/multiple:false,
	/*void*/constructor:function(){
		this.map = {};
	},
	/*boolean*/contains:function(/*String*/key){
		if(this.map[key]){
			return true;
		}
		return false;
	},
	/*Object*/getItem:function(/*String*/key){
		return this.map[key];
	},
	/*void*/addItem:function(/*String*/key,/*Object*/value){
		var item = this.map[key];
		if(!item || !this.multiple){
			this.map[key] = value;
			return;
		}
		!dojo.isArray(item) && (item = [item]);
		item.concat(value);
		this.map[key] = item;
	},
	/*void*/removeItem:function(/*String*/key,/*Object?*/value){
		var item = this.map[key];
		if(!this.multiple || !dojo.isArray(item)){
			delete this.map[key];
			return;
		}
		item.remove(value);
	},
	/*void*/clearItems:function(){
		this.map = null;
		this.map = {};
	},
	/*void*/forInItems:function(/*Function*/f,/*Object?*/o){
		if(!f){return;}
		o = o || this;
		var map = this.map;
		for(var attr in map){
			if(f.call(o,map[attr],attr,this) === false){
				break;
			};
		}
	}
});

}

if(!dojo._hasResource["common.exception.Exception"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.exception.Exception"] = true;
dojo.provide("common.exception.Exception");


dojo.declare("common.exception.Exception",dijit._Widget,{
	msg:"",
	type:common.Constant.Exception.WARNNING,
	/*void*/postCreate:function(){
		var excepType = common.Constant.Exception,
			msg = this.msg; 
		switch(this.type){
			case excepType.WARNNING:
				this.printMessage();
				break;
			case excepType.ERROR:
				this.throwMessage();
				break;
		}
	},
	/*void*/throwMessage:function(/*String*/msg){
		throw msg;
	},
	/*void*/printMessage:function(/*String*/msg){
		console.info(msg);
	}
});

}

if(!dojo._hasResource["common.listener.Listener"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.listener.Listener"] = true;
dojo.provide("common.listener.Listener");
dojo.declare("common.listener.Listener",null,{
	/*ArrayList*/_listeners:null,
	/*void*/constructor:function(){
		this._listeners = new dojox.collections.ArrayList();
	},
	/**
	 * whether or not the listener exist
	 * @param value
	 * @returns {Boolean}
	 */
	/*boolean*/containsListener:function(value){
		if(this._listeners.contains(value)){
			return true;
		}
		return false;
	},
	/**
	 * add listener item
	 * @param funct
	 * @param env
	 */
	/*void*/addListener:function(/*Function*/funct,/*Object*/env){
		var item = {funct:funct,env:env};
		if(!this.containsListener(item)){
			this._listeners.add(item);
		}
	},
	/**
	 * fire listener
	 */
	/*void*/fireListener:function(/*Array*/params){
		this.forInListeners(function(item,index){
			item.funct.apply(item.env||window,params||[]);
		},this);
	},
	/**
	 * remove listener item
	 * @param env
	 */
	/*void*/removeListener:function(/*Object*/env){
		this.forInListeners(function(item,index){
			if(item.env == env){
				this.remove(index);
			}
		},this,true);
	},
	/*void*/forInListeners:function(/*Function*/f,/*Object?*/o,/*boolean*/reverse){
		if(!f){return;}
		o = o || this;
		var list = this._listeners.toArray();
		dojo.forEach(reverse?list.reverse():list,f,o);
	},
	/**
	 * clear all listener items
	 */
	/*void*/clear:function(){
		this._listeners.clear();
	}
});

}

if(!dojo._hasResource["common.utils.BrowerUtils"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.utils.BrowerUtils"] = true;
dojo.provide("common.utils.BrowerUtils");
(function(){
var fontNode = null;
common.utils.BrowerUtils = {
	browerType:null,
	/*void*/copyClipboard:function(/*String*/txt){  
	    if(window.clipboardData){  
	        window.clipboardData.clearData();  
	        window.clipboardData.setData("Text",txt);  
	    }else if(navigator.userAgent.indexOf("Opera")!=-1){  
	        window.location=txt;  
	    }else if(window.netscape){  
	        try{  
	            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
	        }catch(e){  
	            alert("���firefox��ȫ������������м�����������򿪡�about:config����  signed.applets.codebase_principal_support������Ϊtrue��֮�����ԣ����·��Ϊfirefox��Ŀ¼ /greprefs/all.js");  
	            return false;  
	        }  
	        var clip=Components.classes['@mozilla.org/widget/clipboard;1'].createInstance (Components.interfaces.nsIClipboard);  
	        if(!clip)return;  
	        var trans=Components.classes['@mozilla.org/widget/transferable;1'].createInstance (Components.interfaces.nsITransferable);  
	        if(!trans)return;  
	        trans.addDataFlavor('text/unicode');  
	        var str=new Object();  
	        var len=new Object();  
	        var str=Components.classes["@mozilla.org/supports-string;1"].createInstance (Components.interfaces.nsISupportsString);  
	        var copytext=txt;  
	        str.data=copytext;  
	        trans.setTransferData("text/unicode",str,copytext.length*2);  
	        var clipid=Components.interfaces.nsIClipboard;  
	        if(!clip)return false;  
	        clip.setData(trans,null,clipid.kGlobalClipboard);  
	    }  
	},
	getWindowBox:function(){
		return viewport = dojo.window.getBox();
	},
	getFontNode:function(){
		if(!fontNode){
			fontNode = document.createElement("div");
			document.body.appendChild(fontNode);
		}
		return fontNode;
	},
	/*Double*/getFontHeight:function(/*String*/text,/*String*/style){
		var s = "padding:0;visibility:hidden;position:absolute;top:10000000px;",h;
		s += style;
		dojo.attr(this.getFontNode(),"style",s);
		fontNode.innerHTML=text;
		h = fontNode.offsetHeight;
		fontNode.innerHTML = "";
		return h;
	},
	getBrowerType:function(){
		if(!this.browerType){
			var Sys = {},   
				ua = navigator.userAgent.toLowerCase(),
				s;   
			(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]
			: (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1]    
			: (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1]    
			: (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1]    
			: (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
			this.browerType = Sys;
		}
		return this.browerType;
	}
};
})();

}

if(!dojo._hasResource["common.utils.CodeUtils"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["common.utils.CodeUtils"] = true;
dojo.provide("common.utils.CodeUtils");
common.utils.CodeUtils = {
	/*String*/toUnicode:function(/*String*/s){  
	    var res = [];  
	    var len = s.length - 1;  
	    while (len > -1) {  
	        var ch = s.charCodeAt(len--);  
	        if (!isNaN(ch)) {  
	            res.push(ch);  
	        }  
	    }  
	    res.push('');  
	    return res.reverse().join('&#');  
	},
	/*String*/toUnicode2:function(/*String*/s) {  
	    var res = [];  
	    var len = s.length - 1;  
	    while (len > -1) {  
	        var ch = s.charCodeAt(len--);  
	        if (!isNaN(ch)) {  
	            ch = ch.toString(16);  
	            switch (ch.length) {  
	                case 4 : {  
	                    chch = ch;  
	                }  
	                    break;  
	                case 3 : {  
	                    ch = '0' + ch;  
	                }  
	                    break;  
	                case 2 : {  
	                    ch = '00' + ch;  
	                }  
	                    break;  
	                case 1 : {  
	                    ch = '000' + ch;  
	                }  
	                    break;  
	                default :  
	                    ch = null;  
	            }  
	            if (ch != null) {  
	                res.push(ch);  
	            }  
	        }  
	    }  
	    res.push('');  
	    return res.reverse().join('\\u');  
	},
	/*String*/toGBK:function(/*String*/s) {  
	    var res = [''];  
	    if (s.indexOf('&#') === 0) {  
	        for (var i = 1, cs = s.split('&#'), len = cs.length; i < len; i++) {  
	            res.push(String.fromCharCode(cs[i]));  
	        }  
	        return res.join('');  
	    } else if (s.indexOf('\\u') === 0) {  
	        for (var i = 1, cs = s.split('\\u'), len = cs.length; i < len; i++) {  
	            res.push(String.fromCharCode(parseInt(cs[i], 16)));  
	        }  
	        return res.join('');  
	    }  
	    return '';  
	}
		
};

}

