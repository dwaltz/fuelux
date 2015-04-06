define(function (require) {
	var tree   = require('tree');


	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
		TREE
	- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	// initialize
	function myTreeInit() {
		tree($('#myTree'),{dataSource:function(parentData, callback){
			callback({

				data: [
					{
						"name": "Ascending and Descending",
						"type": "folder",
						"attr": {
							"id": "folder1",
							"cssClass": "example-tree-class"
						}
					},
					{
						"name": "Sky and Water I (with custom icon)",
						"type": "item",
						"attr": {
							"id": "item1",
							"data-icon": "glyphicon glyphicon-file"
						}
					},
					{
						"name": "Drawing Hands",
						"type": "folder",
						"attr": {
							"id": "folder2"
						}
					},
					{
						"name": "Waterfall",
						"type": "item",
						"attr": {
							"id": "item2"
						}
					},
					{
						"name": "Belvedere",
						"type": "folder",
						"attr": {
							"id": "folder3"
						}
					},
					{
						"name": "Relativity (with custom icon)",
						"type": "item",
						"attr": {
							"id": "item3",
							"data-icon": "glyphicon glyphicon-picture"
						}
					},
					{
						"name": "House of Stairs",
						"type": "folder",
						"attr": {
							"id": "folder4"
						}
					},
					{
						"name": "Convex and Concave",
						"type": "item",
						"attr": {
							"id": "item4"
						}
					}
				]
			});
		}});
	}
	myTreeInit();
});
