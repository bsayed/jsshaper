"use strict"; "use restrict";
var require = require || function(f) { load(f); };
try {
require.paths && typeof __dirname !== "undefined" && require.paths.unshift(__dirname);
} catch (e) { /* require.paths disabled in node 0.5+ */ }

var args = (typeof process !== "undefined" && process.argv !== undefined) ?
    process.argv.slice(2) : arguments;

var log = (typeof console !== "undefined") && console.log || print;

if (args.length > 0 && args[0] === "--") {
    args.shift();
}
if (args.length <= 0) {
    log("run-IfcRewrite: filename");
    (typeof quit === "undefined" ? process.exit : quit)(0);
}
var filename = args.shift();

var IfcRewrite = IfcRewrite || require("./IfcRewrite.js") || IfcRewrite;

// read: js/d8/v8 || rhino || node
var read = read || typeof readFile !== "undefined" && readFile || require("fs").readFileSync;
var src = read(filename);
var desugaredSrc = IfcRewrite.rewrite(src, filename);

var fs = require('fs');
fs.writeFile(filename + "_ifcRewritten.js", desugaredSrc, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("IFC Rewrite terminated successfully, the output was saved to "+filename + "_ifcRewritten.js");
    }
});
//log(desugaredSrc);
