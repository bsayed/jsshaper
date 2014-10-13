if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['./narcissus', './fmt', './log', './assert'], function(Narcissus, Fmt, Log, Assert) {
"use strict"; "use restrict";

var log = (typeof console !== "undefined") && console.log || print;

var IfcRewrite = (function() {

    /// Exposing the desugaring capability of Narcissus
    function desugar(str,filename) {
        var originalAST = Narcissus.parser.parse(str, filename || "<no filename>", 1);
        var desugaredAST = Narcissus.desugaring.desugar(originalAST);
        return Narcissus.decompiler.pp(desugaredAST);
    }

    // Returns a pretty printed version of the rewritten code
    function rewrite(str, filename) {
        var originalAST = Narcissus.parser.parse(str, filename || "<no filename>", 1);
        var rewrittenAST= Narcissus.ifcRewriting.ifcRewrite(originalAST);
        return Narcissus.decompiler.pp(rewrittenAST);
    }


    var ifcRewrite= {};
    ifcRewrite.desugar = desugar;
    ifcRewrite.rewrite = rewrite;

    ifcRewrite.version = "0.0";

    return ifcRewrite;
})();

    return IfcRewrite;
});
