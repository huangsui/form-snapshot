

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
    		title:"银行端示例",
    		desc:"",
			sections:[{//章节
				id:"std-form-select",
				title:"下拉框",
				desc:"",
				cases:[//实例
					"./case/b1.html"
				]},
				{//章节
				id:"std-form-orgNo",
				title:"机构选择框",
				desc:"",
				cases:[//实例
					"./case/b2.html"
				]},
				{//章节
				id:"std-form-checkbox",
				title:"复选框",
				desc:"",
				cases:[//实例
					"./case/b3.html"
				]},
                {//章节
                    id:"std-form-date",
                    title:"日期控件",
                    desc:"",
                    cases:[//实例
                        "./case/b4.html"
				]},
                {//章节
                    id:"std-form-table",
                    title:"表格控件",
                    desc:"",
                    cases:[//实例
                        "./case/b5.html"
				]},
                {//章节
                    id:"std-form-tab",
                    title:"tab标签页",
                    desc:"",
                    cases:[//实例
                        "./case/b6.html"
                ]},
                {//章节
                    id:"std-form-textArea",
                    title:"文本域",
                    desc:"",
                    cases:[//实例
                        "./case/b7.html"//章节
                ]},
                {//章节
                    id:"std-form-zTree",
                    title:"树结构",
                    desc:"",
                    cases:[//实例
                        "./case/b8.html"
                ]},
                {
                    id:"std-form-composite",
                    title:"综合实例",
                    desc:"",
                    cases:[//实例
                        "./case/b9.html"
                ]},
                {
                    id:"std-form-module",
                    title:"单独模块测试",
                    desc:"",
                    cases:[//实例
                        "./case/b10.html"
                ]}
			]
		}]
	}

    global.caseConfig = cfg;

} )( typeof window !== "undefined" ? window : this );


