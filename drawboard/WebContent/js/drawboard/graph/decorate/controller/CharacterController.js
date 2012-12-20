dojo.provide("drawboard.graph.decorate.controller.CharacterController");
dojo.require("drawboard.graph.decorate.Character");
dojo.require("drawboard.graph.decorate.controller.Controller");
(function(){
dojo.declare("drawboard.graph.decorate.controller.CharacterController",drawboard.graph.decorate.controller.Controller,{
	/*Constant*/type:drawboard.Constant.Decorate.CHARACTER,
	/**
	 * create mark nodes
	 */
	/*Array<Character>*/_create:function(/*GraphProxy*/gp,/*ExecuteRuntime*/runtime){
		var coordinates = gp.getMarks(runtime),
			rotator = gp.getRotator(runtime),
			character = new drawboard.graph.decorate.Character({coordinate:pos,rotator:rotator}),
			characters = [],character,
			gf = runtime.getGraphic();
		dojo.forEach(coordinates,function(pos){
			character.setCoordinate(pos);
			character.setRotator(rotator);
			character.draw(gf,this.getStyle(gp,character,runtime),runtime);
			characters.push(character);
		},this);
		return characters;
	}
});
drawboard._characterController = null;
drawboard.characterController = function(){
	if(!drawboard._characterController){
		drawboard._characterController = new drawboard.graph.decorate.controller.CharacterController();
	}
	return drawboard._characterController;
};
})();