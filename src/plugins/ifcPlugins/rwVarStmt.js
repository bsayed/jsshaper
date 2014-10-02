if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['../../shaper', '../../fmt', '../../ref', '../../tkn'], function(Shaper, Fmt, Ref, tkn) {
"use strict"; "use restrict";

Shaper("rwVarStmt", function(root) {
    var fns = [];
    var varStmt = Shaper.parse("var $");
    //var dotTempl = Shaper.parse("Assert.$($$)");
    return Shaper.traverse(root, {
        pre: function(node, ref) {
                //if (node.type === tkn.IDEN )
            console.log("PRE --> Node Type: "+node.type+"    Node Value: "+node.value);

//            if (node.type === tkn.FUNCTION) {
//                fns.push(node);
//            }
//            if (Shaper.match(callTempl, node) || Shaper.match(dotTempl, node)) {
//                var args = node.children[1];
//                var str = Fmt('{0}, function {1}, file {2}, line {3}',
//                              args.children[0].getSrc(),
//                              fns.length === 0 ? "<script>" :
//                              fns[fns.length - 1].name || "<anonymous>",
//                              node.tokenizer.filename,
//                              node.lineno);
//                Shaper.insertBefore(new Ref(args, "children", args.children.length), Shaper.parse(JSON.stringify(str)));
//            }
        },
        post: function(node, ref) {
              console.log("POST:--> Node Type: "+node.type+"    Node Value: "+node.value);
//            if (node.type === tkn.FUNCTION) {
//                fns.pop();
//            }
        }});
});

    return Shaper.get("rwVarStmt");
});
