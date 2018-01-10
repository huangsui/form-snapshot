

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
    		id:"std-form",
    		title:"标准表单",
    		desc:"",
			sections:[{//章节
				id:"std-form-input",
				title:"输入框", 
				desc:"",
				cases:[//实例
					"./case/c1.html"
				]},
				{//章节
				id:"std-form-textarea",
				title:"文本域", 
				desc:"",
				cases:[//实例
					"./case/c2.html"
				]},
				{//章节
				id:"std-form-checkbox",
				title:"多选框", 
				desc:"",
				cases:[//实例
					"./case/c3.html"
				]}
			]
		}]
	}

    global.caseConfig = cfg;

} )( typeof window !== "undefined" ? window : this );


