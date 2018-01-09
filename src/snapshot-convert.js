
( function( global, Snapshot ) {

    "use strict";

    function ConvertFactory(){

        var convertors = [];
        var rootConvertor;

        var convertArray = function(arr){
            var html = "";
            for (var i = 0; i < arr.length; i++) {
                html += this.convert(arr[i]);
            }
            return html;
        }

        this.convert = function(arg){
            if(!arg){
                return "";
            }else if(arg.root){
                return rootConvertor.convert(arg.data, this);
            }else if(arg instanceof Array){
                return convertArray.call(this, arg);
            }

            var html = "";
            var note = arg;
            for (var i = 0; i < convertors.length; i++) {
                var cvt = convertors[i];
                if(cvt.match(note)){
                    html = cvt.convert(note, this);
                    break;
                }
            }

            if(html=="" && note.manifest == "GROUP"){
                html = this.convert(note.subNotes);
            }      

            return html;
        };

        this.register = function(convertor){
            if(convertor.name.endsWith("root-convertor")){
                rootConvertor = convertor;
            }else{
                convertors.push(convertor);
            }
            
        }       

    };

    var convertFactory = new ConvertFactory();

    if(Snapshot){
        var _register = Snapshot.register;
        Snapshot.register = function(){
            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if(arg.name.endsWith("-convertor")){
                    convertFactory.register(arg);
                }         
            }
            _register.apply(Snapshot, arguments);
        };
        Snapshot.fn.convert = convertFactory.convert;
    }else{
        Snapshot = convertFactory;
    }

} )( typeof window !== "undefined" ? window : this, Snapshot );

