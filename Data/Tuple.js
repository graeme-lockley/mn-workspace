function TupleState(first, second) {
    this.first = first;
    this.second = second;
}


function Tuple(first) {
    return second => [first, second];
}


// TupleState.prototype.mapFirst = function (f) {
//     return Tuple(f(this.first))(this.second);
// };
// assumption(Tuple("Hello")(2).mapFirst(x => x + x).first === "HelloHello");
//
//
// TupleState.prototype.mapSecond = function (f) {
//     return Tuple(this.first)(f(this.second));
// };
// assumption(Tuple("Hello")(2).mapSecond(x => x + x).second === 4);
//
//
// TupleState.prototype.toString = function () {
//     return `(${this.first.toString()}, ${this.second.toString()})`;
// };
//

module.exports = Tuple;
