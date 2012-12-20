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