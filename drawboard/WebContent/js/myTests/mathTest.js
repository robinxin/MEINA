dojo.provide("myTests.mathTest");
dojo.require("dojo.string");
dojo.require("common.calc.Math");
dojo.require("common.calc.Geometry");
doh.register("mathTests", [
      function hullTest(){
		  	var point = [[10,10],[100,100],[10,100],[100,10]],
		  		p = common.calc.Math.quickHull(point);
//		  	t.is("hull is:","" + p);
   	  },
   	  function pointInSegmentTest(t){
   		  	doh.assertFalse(common.calc.Geometry.isPointInSegment({x:50,y:50},{x:100,y:100},{x:80,y:81}));
 	  },
 	  function pointInPolygen(t){
 		  	var point = [{x:100,y:100},{x:150,y:150},{x:100,y:200},{x:50,y:150}];
 		  	doh.assertTrue(common.calc.Geometry.isPointInPolyn(point,{x:60,y:150}));
 	  },
 	  function rotate(){
 		  console.info(common.calc.Geometry.rotation({x:50,y:100},{x:100,y:100},90));
 	  }
]);