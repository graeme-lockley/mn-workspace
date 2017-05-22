//- A list is a traditional Lisp Cons implementation
//-
//- data type List a = Nil | Cons a implements Sequence a, Visible a
//-      ~Nil :: Maybe ()
//-      ~Cons :: Maybe a * (Collection a)
//-

const Interfaces = require("./Interfaces");

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


module.exports = {
    List: ListTypeInstance,
    ListTypeInstance
};