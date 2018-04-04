

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
            sections:[
                {//章节
                    id:"std-form-input",
                    title:"Input输入框",
                    desc:"",
                    cases:[//实例
                        "./case/input.html"
                    ]},
                {//章节
                    id:"std-form-textarea",
                    title:"Textarea文本域",
                    desc:"",
                    cases:[//实例
                        "./case/textarea.html"
                    ]},
                {//章节
                    id:"std-form-select",
                    title:"Select选择框",
                    desc:"",
                    cases:[//实例
                        "./case/select.html"
                    ]},
                {//章节
                    id:"std-form-checkbox",
                    title:"Checkbox多选框",
                    desc:"",
                    cases:[//实例
                        "./case/select.html"
                    ]},
                {//章节
                    id:"std-form-checkbox",
                    title:"Select选择框",
                    desc:"",
                    cases:[//实例
                        "./case/select.html"
                    ]},

            ]
        }]
    }

    global.caseConfig = cfg;

} )( typeof window !== "undefined" ? window : this );


