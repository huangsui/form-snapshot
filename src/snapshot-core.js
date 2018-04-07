

/**
 * 表单快照核心组件
 * 
 * Note: 便签，记录节点相关信息
 * Filter：过滤器，对每个节点扫描前进行过滤 
 * ProcessContext：上下文，节点处理时提供上下文信息
 * Manifest：货单，简单的节点描述规则，方便识别
 * 
 * !!TEXT~INPUTS~~!TEXT~INPUTS
 *  
 * 统一前缀：ss-
 * 
 */

( function ( global, $ ) {

    "use strict"

    const VERSION = "1.0.0";/*版本*/

    var that = this;

    var NoteFactory = new function(){
        this.create = function(node, ctx){
            var note = new Note().init(node).baseInfo(node);
            note.depth = ctx.depth();
            return note;
        }
    };

    var Note = function(){
    }

    Note.prototype = {
        constructor:Note,
        depth:1,
        hierarchy:0,
        init:function(node){
            this.nodeName = node.nodeName;
            return this;
        },
        baseInfo:function(node){
            this.attrs = {};
            //factor: 0|1，文本和各输入框为快照基本因子
            switch(node.nodeName){
                case "INPUT"://text,hidden,radio,checkbox,password
                    var iptType = node.getAttribute("type");
                    iptType = iptType||"TEXT";
                    this.nodeType="INPUTS:"+iptType.toUpperCase();
                    if(iptType=="checkbox" || iptType=="radio"){
                        if(node.checked)this.attrs.checked = node.checked;
                    }else{
                        this.attrs.value = node.value||"";
                    }
                    
                    break;
                case "SELECT"://multiple
                    this.nodeType="INPUTS:SELECT";
                    break;
                case "TEXTAREA":
                    this.nodeType="INPUTS";
                    break;
                case "#text"://button
                    this.nodeType="TEXT";
                    this.attrs.value=trim(node.nodeValue);
                    break;
                default:;
            }
            return this;
        },
        makeManifest:function(node, ctx){
            if(!this.subNotes || this.subNotes.length == 0){
                this.manifest = this.nodeType;
                this.hierarchy = 1;
                return this;
            }

            if(node.nodeName == "TEXTAREA"){
                this.manifest = "INPUTS";
            }

            if(!this.manifest){
                for(var i=0;i<this.subNotes.length;i++){
                    var subNote = this.subNotes[i];
                    this.hierarchy = Math.max(subNote.hierarchy+1, this.hierarchy);
                    if(subNote.assign){
                        this.manifest = "GROUP";
                        break;
                    }else{
                        this.manifest = (this.manifest?this.manifest+"||":"!")+subNote.manifest; 
                    }                                   
                }
            }            

            var idx = Math.min(this.hierarchy, 5)-2;
            this.manifest=this.manifest.replace(/\|\|/g,["~","~~","~~~","~~~~","~~~~~"][idx]);

            return this;
        },
        appendChild:function(arg){
            this.subNotes = this.subNotes || [];
            if(arg instanceof Array ){
                this.subNotes = this.subNotes.concat(arg);
            }else{
                this.subNotes.push(arg);
            }
            
        },
        removeChild:function(note){
            for (var i = 0; i < this.subNotes.length; i++) {
                var subNote = this.subNotes[i];
                if(subNote == note){
                    this.subNotes.splice(i, 1);
                }
            }
        }
    };

    function trim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }

    var ProcessContext = function(node, opts){
        this.noteRoot = null;
        this.pnote = null;
        this.curNote = null;
        this.opts = opts;
        this.depth = function(){
            if(this.pnote){
                return this.pnote.depth+1;
            }
            return 1;
        };
        this.appendNote = function(note){
            if(this.noteRoot == null){
                this.noteRoot = note;
            }else{
                this.pnote.appendChild(note);
            }            
        };
        this.removeNote = function(note){
            this.pnote.removeChild(note);
        }
    }

    var filterChain = {
        filters:[],
        curIdx:-1,
        targetFn:null,
        add:function(filter){
            this.filters.push(filter);
        },
        resetIdx:function(){
            this.curIdx = -1;
        },
        filter:function(){
            this.curIdx++;
            if(this.curIdx < this.filters.length){                
                var result = this.filters[this.curIdx].filter(arguments, this);
                return result;
            }else{
                return this.invoke.apply(this, arguments);
            }            
        },
        invoke:function(){
            var result = this.targetFn.apply(this, arguments);
            return result;
        },
        weave:function(fn){
            this.targetFn = fn;
            //节点为树状结构，遍历节点过程为递归式嵌套，过滤器链也在递归中被嵌套
            return function(){
                //过滤器链每次发起前进行下标重置
                filterChain.resetIdx();
                var result = filterChain.filter.apply(filterChain, arguments);
                return result;
            };
        }
    };

    var through = function( node, note, ctx ) {
        var result = note;
        processorChain.reset();
        while(processorChain.hashNext()){
            var pr = processorChain.next();
            if(pr.matchNode && pr.matchNode(node, note, ctx)){
                result = pr.process(node, note, ctx);
                return result;
            }
        }

        if(node.childNodes.length>0){
            var _pnote = ctx.pnote || ctx.noteRoot;
            ctx.pnote = note;
            for( var i=0; i<node.childNodes.length; i++ ){
                var subNode = node.childNodes[i];
                var subNote = NoteFactory.create(subNode, ctx);
                result = through( subNode, subNote, ctx );
                if(result){
                    note.appendChild(result);
                }               
            }
            ctx.pnote = _pnote;            
        }

        note.makeManifest(node, ctx);
        
        //有货单
        processorChain.reset();
        while(processorChain.hashNext()){
            var pr = processorChain.next();
            if(pr.matchManifest && pr.matchManifest(node, note, ctx)){
                return pr.process(node, note, ctx);
            }
        }
       
        return note;            
        
    };

    var Snapshot = function( options ) {

        this.takeSnap = function( selector, opts ){
            var node = $(selector)[0];
            var pctx = new ProcessContext(node, opts);
            var note = NoteFactory.create(node, pctx);
            pctx.appendNote(note);
            var result = through(node, note, pctx);
            return result;
        };

        this.init( options );

    };

    var processorChain = {
        chain:[],
        curIdx:-1,
        add:function(pr){
            pr.init();
            this.chain.push(pr); 
        },
        reset:function(){
            this.curIdx = -1;
        },
        hashNext:function(){
            return (this.curIdx+1) < this.chain.length;
        },
        next:function(){
            return this.chain[++this.curIdx];
        }        
    };

    var caches = {};
    Snapshot.cache = function(){
        if(arguments.length==0){
            throw "arguments length must be greater then 0.";
        }
        if(arguments.length==1){
            if(typeof arguments[0] == "string"){
                return caches[arguments[0]];
            }else if(arguments[0] && arguments[0].name){
                caches[arguments[0].name] = arguments[0];
            }
        }else if(arguments.length==2){
            caches[arguments[0]] = arguments[1];
        }
    }

    var convertors = [];

    Snapshot.register = function(){
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if(typeof arg == "string"){
                var m = Snapshot.cache(arg);
                if(m){
                    Snapshot.register(m);
                }else{
                    throw "Snapshot cannot find \""+arg+"\" in caches ";
                }
            }else if(arg.name.indexOf("-processor")>0){
                processorChain.add(arg);
            }else if(arg.name.indexOf("-filter")>0){
                filterChain.add(arg);
            }else if(arg.name.endsWith("-convertor")){
                convertors.push(arg);
            }else{
                Snapshot.cache(arg);
            }            
        }
        return this;
    }

    Snapshot.fn = Snapshot.prototype = {
        version: VERSION,
        constructor: Snapshot,
        config: { maxDepth:10, isVisible:true },
        init: function( options ){
            this.config = this.config||{};
            if( options ){
                this.config.isVisible = options.isVisible;
                this.config.convertType = options["convert-type"];
            }
            return this;
        }
    }


    through = filterChain.weave(through);

    
    var convertArray = function(arr, ctx){
        var html = "";
        for (var i = 0; i < arr.length; i++) {
            html += convert(arr[i], ctx);
        }
        return html;
    }

    var convert = function(arg, ctx){
        if(!arg){
            throw "convert param is required.";
        }else if(arg instanceof Array){
            return convertArray.call(this, arg, ctx);
        }

        if(!ctx || !ctx.root){
            ctx = {root:arg};
        }

        var html = "", note = arg;
        for (var i = 0; i < convertors.length; i++) {
            var cvt = convertors[i];
            if(cvt.match(note)){
                html = cvt.convert(note, ctx);
                break;
            }
        }

        if( note.manifest == "GROUP" || note.subNotes){
            ctx.parent = note;
            html += convert(note.subNotes, ctx);
            //ctx.parent is dirty here.
        }      

        return html;
    };

    Snapshot.convert = convert;
    Snapshot.fn.convert = convert;
    
    global.Snapshot = Snapshot;

    if ( typeof define === "function" && define.amd ) {
        define( "Snapshot", [], function() {
            return Snapshot;
        } );
    }

    if(typeof module !== "undefined"){
        module.exports = Snapshot;
    }

})( typeof window !== "undefined" ? window : this, jQuery );

