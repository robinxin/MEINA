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