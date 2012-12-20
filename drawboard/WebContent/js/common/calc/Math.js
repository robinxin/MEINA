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