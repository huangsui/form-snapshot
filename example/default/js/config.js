

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
					"./case/input1.html",
					"./case/input2.html"
				]},
				{//章节
				id:"std-form-select",
				title:"下拉框", 
				desc:"描述，描述",
				cases:[//实例
					"./case/select.html"
				]},
				{//章节
				id:"std-form-checkbox",
				title:"多选框", 
				desc:"",
				cases:[//实例
					"./case/checkbox1.html",
					"./case/checkbox2.html"
				]},
				{//章节
				id:"std-form-textarea",
				title:"文本域", 
				desc:"",
				cases:[//实例
					"./case/textarea.html"
				]}
			]
		}]
	}

    global.caseConfig = cfg;

} )( typeof window !== "undefined" ? window : this );


