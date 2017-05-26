//- A list is a traditional Lisp Cons implementation
//-
//- ```haskell
//- import Int from "core:Data.Int:1.0.0"
//-
//- data type List a = Nil | Cons a (List a) implements Sequence a, Visible a where
//-     ~Nil :: Maybe ()
//-     ~Cons :: Maybe a * This
//-
//-     take :: Int -> This
//-     map :: (a -> b) -> Sequence b
//- ```

const Interfaces = require("./Interfaces");

const Int = require("./Int").Int;
const Maybe = require("./Maybe");
const Parity = require("./Parity");
const Sequence = require("./Sequence");
const Visible = require("./Visible");


function ListType() {
}


const ListTypeInstance =
    new ListType();


function List(content) {
    this.content = content;
    this.type = ListTypeInstance;
}


Interfaces.extend(List, [
    Parity.ParityType,
    Sequence.SequenceType,
    Visible.VisibleType
]);


ListType.prototype.Nil =
    new List([0]);


ListType.prototype.Cons = function (x) {
    return xs => new List([1, x, xs]);
};


ListType.prototype.of = function (s) {

};


List.prototype.unapplyNil = function () {
    return this.content[0] === 0
        ? Maybe.Just([])
        : Maybe.Nothing;
};


List.prototype.unapplyCons = function () {
    return this.content[0] === 0
        ? Maybe.Nothing
        : Maybe.Just([this.content[1], this.content[2]]);
};


List.prototype.take = function(n) {
    return n.$LESS(Int.of(1))
        ? this.type.Nil
        : this.unapplyCons().reduce(() => this.type.Nil)(([h, t]) => this.type.Cons(h)(t.take(n.$MINUS(Int.of(1)))));
};


List.prototype.map = function(f) {
    return this.unapplyCons().reduce(() => this.type.Nil)(([h, t]) => this.type.Cons(f(h))(t.map(f)));
};


module.exports = {
    List: ListTypeInstance,
    ListTypeInstance
};