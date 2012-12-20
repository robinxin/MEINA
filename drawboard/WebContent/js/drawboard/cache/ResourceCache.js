dojo.provide("drawboard.cache.ResourceCache");
dojo.require("common.Cache");
(function(){
dojo.declare("drawboard.cache.ResourceCache",common.Cache,{
	/**
	 * create cache by subclass
	 */
	/*Object*/createCache:function(){
		return {};
	},
	/*Object*/getResource:function(/*String*/key){
		return this.getCache()[key];
	},
	/*void*/addResource:function(/*String*/key,/*Object*/value){
		var cache = this.getCache();
		cache[key] = value;
	},
	/*void*/removeResource:function(/*String*/key){
		var cache = this.getCache();
		cache[key] = null;
		delete cache[key];
	}
});
if(drawboard.resourceCenter == null){
	drawboard.resourceCenter = new drawboard.cache.ResourceCache();
}
})();