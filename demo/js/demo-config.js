

( function( global ) {

    "use strict";

    var demo = {
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
					"./fragment/f1.html"
				]},
				{//章节
				id:"std-form-textarea",
				title:"文本域", 
				desc:"",
				cases:[//实例
					"./fragment/f2.html"
				]},
				{//章节
				id:"std-form-checkbox",
				title:"多选框", 
				desc:"",
				cases:[//实例
					"./fragment/f3.html"
				]}
			]
		}]
	}

    global.demo = demo;

} )( typeof window !== "undefined" ? window : this );


