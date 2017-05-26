//- A stream is a (potentially) infinitely long sequence.
//-
//- ```haskell
//- import Int from "core:Data.Int:1.0.0"
//-
//- data type Stream a = Nil | Cons a (() -> Stream a)  implements Sequence a, Visible a where
//-     ~Nil :: Maybe ()
//-     ~Cons :: Maybe a * (Collection a)
//-
//-     take :: Int -> This b
//-     map :: (a -> b) -> Sequence b
//- ```

const Interfaces = require("./Interfaces");

const Maybe = require("./Maybe");
const Parity = require("./Parity");
const Sequence = require("./Sequence");
const Visible = require("./Visible");

const Int = require("./Int").Int;


function StreamType() {
}


const StreamTypeInstance =
    new StreamType();


function Stream(content) {
    this.content = content;
    this.type = StreamTypeInstance;
}


Interfaces.extend(Stream, [
    Parity.ParityType,
    Visible.VisibleType,
    Sequence.SequenceType
]);


StreamType.prototype.Nil =
    new Stream([0]);


StreamType.prototype.Cons = function (x) {
    return xs => new Stream([1, x, xs]);
};


Stream.prototype.unapplyNil = function () {
    return this.content[0] === 0
        ? Maybe.Just([])
        : Maybe.Nothing;
};


Stream.prototype.unapplyCons = function () {
    return this.content[0] === 0
        ? Maybe.Nothing
        : Maybe.Just([this.content[1], this.content[2]()]);
};


Stream.prototype.take = function(n) {
    return n.$LESS(Int.of(1))
        ? this.type.Nil
        : this.unapplyCons().reduce(() => this.type.Nil)(([h, t]) => this.type.Cons(h)(() => t.take(n.$MINUS(Int.of(1)))));
};


Stream.prototype.map = function(f) {
    return this.unapplyCons().reduce(() => this.type.Nil)(([h, t]) => this.type.Cons(f(h))(() => t.map(f)));
};


module.exports = {
    Stream: StreamTypeInstance,
    StreamTypeInstance
};