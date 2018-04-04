

( function( global ) {

    "use strict";

    var cfg = {
    	theme:{
    		"default":{

    		},
    		"bank":{
    			css:""
    		},
    		"corp":{

    		}
    	},
    	sections:[{//章节
    		id:"std-table",
    		title:"标准表格",
    		desc:"",
			sections:[{//章节
				id:"std-table",
				title:"表格", 
				desc:"",
				cases:[//实例
					"./case/table.html"
				]}
			]
		}]
	}

    global.caseConfig = cfg;

} )( typeof window !== "undefined" ? window : this );


