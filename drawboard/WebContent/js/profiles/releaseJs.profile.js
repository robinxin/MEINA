dependencies = {
stripConsole: "normal",
layers: [
{
	name : "dojoBase.js",
	dependencies:[
		"dijit._Templated",
		"dijit._Widget",
		"dijit.layout.AccordionContainer",
		"dijit.layout.ContentPane",
		"dijit.Toolbar",
		"dijit.form.DropDownButton",
		"dijit.ColorPalette",
		"dojo.data.ItemFileReadStore",
		"dojo.parser",
		"dojox.collections.ArrayList"
	]
},
{
	name : "common.js",
	layerDependencies:[
		"dojoBase.js"	
	],
	dependencies:[
		"common.Cache",
		"common.Constant",
		"common.Identity",
		"common.calc.Geometry",
		"common.calc.Math",
		"common.command.Command",
		"common.container.ListContainer",
		"common.container.MapContainer",
		"common.exception.Exception",
		"common.listener.Listener",
		"common.utils.BrowerUtils",
		"common.utils.CodeUtils",
		"common.utils.CollectionUtils"
	]
},
{
	name: "drawboard.js",
	layerDependencies:[
		"common.js",
		"dojoBase.js"
	],
	dependencies :[
		"drawboard.DrawBoard",
		"drawboard.ZoomDrawBoard",
		"drawboard.PreRequire"
	]
},
{
	name : "window.js",
	layerDependencies:[
		"dojoBase.js",
		"drawboard.js"
	],
	dependencies:[
		"window.widget.Toolbar",
		"window.widget.GraphChooseContainer",
		"window.widget.ToolbarContainer",
		"window.Entrance"
	]
}
],
prefixes: [
 ["dijit","../dijit"],
 ["dojox","../dojox"],
 ["drawboard","../drawboard"],
 ["common","../common"],
 ["window","../window"]
]
}