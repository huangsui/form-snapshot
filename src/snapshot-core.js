

/**
 * 表单快照核心组件
 * 
 * Note: 便签，记录节点相关信息
 * Filter：过滤器，对每个节点扫描前后进行过滤 
 * Catcher: 捕捉者，
 * ProcessContext：上下文，节点处理时提供上下文信息
 * Manifest：货单，简单的节点描述规则，方便识别
 * 
 * !!TEXT~INPUTS~~!TEXT~INPUTS
 *  
 * 统一前缀：s-
 * 
 */

( function ( global, $ ) {

    "use strict"

    const VERSION = "1.0.0";/*版本*/
    const Note = require('./core/note-factory.js');
    const FilterChain = require('./core/filter-chain.js');
    const Util = require('./common/util.js');
    const Cache = require('./common/cache.js');

    var that = this;

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

    var filterChain = new FilterChain();

    var scan = function(node, note, ctx){
        if(node.childNodes.length>0){
            var _pnote = ctx.pnote || ctx.noteRoot;
            ctx.pnote = note;
            for( var i=0; i<node.childNodes.length; i++ ){
                var subNode = node.childNodes[i];
                var subNote = note.createSubNote(subNode);
                result = through( subNode, subNote, ctx );
                if(result){
                    note.appendChild(result);
                }               
            }
            ctx.pnote = _pnote;            
        }

        note.makeManifest(node, ctx);
    }

    var through = function( node, note, ctx ) {
        var result = note;

        processorChain.reset();
        while(processorChain.hashNext()){
            var pr = processorChain.next();
            if(pr.matchNode && pr.matchNode(node, note, ctx)){
                result = pr.process(node, note, ctx);
                return result;
            }else if(note.assign){
                break;
            }
        }

        scan( node, note, ctx );
        
        if(note.assign){
            var pr = processorChain.get(note.assign);
            return pr.process(node, note, ctx);
        }else{
            //有货单
            processorChain.reset();
            while(processorChain.hashNext()){
                var pr = processorChain.next();
                if(pr.matchManifest && pr.matchManifest(node, note, ctx)){
                    return pr.process(node, note, ctx);
                }
            }
        }
       
        return note;            
        
    };

    var Snapshot = function( options ) {

        this.takeSnap = function( selector, opts ){
            var node = $(selector)[0];
            var pctx = new ProcessContext(node, opts);
            var note = new Note(node);
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
            if(pr.init)pr.init();
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
        },
        get:function(name){
            for (var i = chain.length - 1; i >= 0; i--) {
                var pr = chain[i];
                if(pr.name = name){
                    return pr;
                }
            }
        }        
    };

    var aCache = new Cache();
    Snapshot.cache = function(){
        return aCache.cache.apply(aCache, arguments);
    }

    var convertors = new Cache();

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
                if(typeof arg.convert === "function"){
                    convertors.cache(arg);
                }
            }else if(arg.name.indexOf("-filter")>0){
                filterChain.add(arg);
            }else if(arg.name.endsWith("-convertor")){
                convertors.cache(arg.bind, arg);
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
        var cvt = convertors.cache(note.assign);
        html = cvt.convert(note, ctx);

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

