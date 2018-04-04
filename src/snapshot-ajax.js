(function(global, Snapshot, $) {

    "use strict";

    /*

    $.ajax({
        url: "",
        method:"post",
        ss: "#form1", //ss-type="ss|tpl"
        ss:["../aa/tpl-1", {}],
        //"#",".ss-"
        ss:["#form1", "html"],
        ss:["#table1", "td[recordId=10000]"|event|elem],
        data: {
            "a": "b"
        },
        success: function() {}
    });

    $.ajax("http://www.abc.com", {
        method:"post",
        ss: {
            type:"ss|tpl",
            target:"#form1",
            data:{}/"",
            event:evt
        },
        data: {
            "a": "b"
        },
        success: function() {}
    });

    <table ss-selected=".checkbox-selected">
        <tr><td class="checkbox-selected"></td>..</tr>
        <tr><td class="checkbox-selected"></td>..</tr>
        <tr>..</tr>
        <tr>..</tr>
        <tr>..</tr>
    </table>

    */

    function resolveSSValue(value) {
        var cfg = {};

        if (typeof value == "string") {
            cfg.type = "ss";
            cfg.target = value;
        } else if (value instanceof Array) {
            var opt1 = value[0];
            if (typeof opt1 != "string") {
                throw "first option must be string for ajax/ss";
            }
            if (value.length == 1) {
                return resolveOptions(opt1);
            }

            var opt2 = value[1];
            if (opt1.startsWith("#") || opt1.startsWith(".ss-")) { //ss
                cfg.type = "ss";
                cfg.target = opt1;

                //表格的情况会有第二个参数
                if (opt2) {
                    cfg.data = opt2.target || opt2;
                }
            } else if (typeof opt2 == "object") { //tpl
                cfg.type = "tpl";
                cfg.target = opt1;
                if (!opt2) {
                    throw "please check your \"ss\" value in ajax.";
                }
                cfg.data = opt2;
            } else {
                throw "It has not yet been supported";
            }

        } else {
            throw "It has not yet been supported";
        }

        return cfg;
    }

    Snapshot._ajax_ = $.ajax;

    Snapshot.proxyAjax = function() {
        var options = (typeof arguments[0] == "string") ? arguments[1] : arguments[0];
        var ssVal = options.ss;
        if (ssVal) { //需要进行快照发布
            if (options.method !== "post" && options.method !== "POST") {
                throw "The http method must be 'post'";
            }

            var ssOpts = resolveSSValue(ssVal);
            var ssResult = Snapshot.beforePublish(ssOpts);
            if (!ssResult) {
                return;
            }

            options.data = options.data || {}; //数据可能在uri上
            if (typeof options.data == "string") {
                if (options.data.indexOf("_ss=") > 0) {
                    throw "The parameter named \"_ss\" is reserved for Snapshot."
                }
                options.data += "&_ss=" + encodeURIComponent(JSON.stringify(ssResult));
            } else {
                if (typeof options.data._ss != "undefined") {
                    throw "The parameter named \"_ss\" is reserved for Snapshot."
                }
                options.data._ss = encodeURIComponent(JSON.stringify(ssResult));
            }
        }

        //delete options.ss;
        return Snapshot._ajax_.apply($, arguments);
    }

    Snapshot.proxyAjax.proxy = "snapshot";
    $.ajax = Snapshot.proxyAjax;

})(typeof window !== "undefined" ? window : this, Snapshot, jQuery);