if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['../../shaper', '../../fmt', '../../ref', '../../tkn'], function(Shaper, Fmt, Ref, tkn) {
"use strict"; "use restrict";

Shaper("rwVarStmt", function(root) {
    var varTempl = Shaper.parse("var $$");
    var semiTempl = Shaper.parse("var $$;");
    var forTempl = Shaper.parse("for (var $, $$; $; $) $");

    // VAR node has at least two children
    // keep the first child in the existing VAR node,
    // create new VAR nodes for the rest
    function alter(node, ref) {
        var newAssignNode;
        var sequenceProperty = ref.properties[0];
        var sequenceIndex = Number(ref.properties[1]);
        // ref is not in a sequence so create a BLOCK
        //if (isNaN(sequenceIndex)) {
            //var decl = Shaper.replace(ref.get().type === tkn.SEMICOLON ?
            //    "$" : "$;", ref.get());
            //ref.set(decl);
            //alter(node, new Ref(node, "children", 0));
            //return;
        //}
        var varNodeChildren = node.children, newAssignExprArray = [];

        for (var i = 0; i < varNodeChildren.length; i++) {
            var secClass = 0, isObj = false;
            // if the var child node is an assignment get the second child
            // security class
            if (varNodeChildren[i].type === tkn.ASSIGN) {
                var assignment = varNodeChildren[i];
                var rhs = assignment.children[1];
                secClass = rhs._sc;
                switch (rhs.type) {
                    case tkn.OBJECT_INIT:
                    case tkn.ARRAY_INIT:
                    case tkn.FUNCTION:
                    case tkn.REGEXP:
                        isObj = true;
                        break;
                }

                // A sanity check just in case what's on the lhs is not an
                // identifier.
                if (assignment.children[0].type !== tkn.IDENTIFIER)
                    continue;

                var lhs = (isObj) ? (assignment.children[0].value + "._sc") :
                    ("var " + assignment.children[0].value + "_sc");
                var newExpr = lhs + "=" + secClass + ";";
                newAssignNode = Shaper.parse(newExpr);
                newAssignExprArray.push(newAssignNode);
            } else if (varNodeChildren[i].type === tkn.IDENTIFIER) {
                newAssignNode = Shaper.parse("var " + varNodeChildren[i].value +"_sc=0;");
                newAssignExprArray.push(newAssignNode);
            }
        }

        for (var i = newAssignExprArray.length -1 ; i >= 0 ; i--) {
            newAssignExprArray[i].ifcSynthetic = true;
            Shaper.insertAfter(ref,newAssignExprArray[i],'\n');
        }
    }
    return Shaper.traverse(root, {pre: function(node, ref) {
        if (Shaper.match(forTempl, node)) {
            // create new FOR node without setup
            var repl = Shaper.parse(Fmt("for (;{0};{1}) $",
                node.condition ? "$" : "",
                node.update ? "$" : ""));
            node.condition && (repl.condition = node.condition);
            node.update && (repl.update = node.update);
            repl.body = node.body;
            Shaper.cloneComments(repl, node);
            ref.set(repl);

            // Prepend FOR node with the VAR setup embedded in a SEMICOLON node
            var semi = Shaper.replace("$;", node.setup);
            Shaper.insertBefore(ref, semi);

            // Split the VARs
            alter(semi.expression, ref); // ref points to semi now because of insert
            return repl;
        } else if (Shaper.match(varTempl, node) && !node.ifcSynthetic) {
            //alter(node, ref);
            //var newNode = Shaper.replace("$ ;",ref.get());
            //ref.set(newNode);
            //alter(node,ref);
        } else if (Shaper.match(semiTempl, node) && !node.ifcSynthetic) {
            alter(node.expression, ref);
        }

    }});
});

    return Shaper.get("rwVarStmt");
});
