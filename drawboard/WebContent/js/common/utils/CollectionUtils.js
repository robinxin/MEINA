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