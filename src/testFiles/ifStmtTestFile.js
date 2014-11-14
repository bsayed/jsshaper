// throw examples
function f() {
    if(x) {
        var x = 33#2;
    } else {
        var x = [false#33];
        if (y > z) {
            throw x;
        }
    }
    throw y;
}
//throw function f(){}