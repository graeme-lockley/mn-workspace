//- This interface defines a Sequence of a
//-
//- interface Sequence a extends Collection a where
//-     map :: (a -> b) -> Sequence b
//-     length :: () -> Int
//-
//-     endsWith :: Parity a => Sequence a -> Bool

const Int = require("./Int").Int;
const Interfaces = require("./Interfaces");
const Collection = require("./Collection");


function SequenceType() {
}


Interfaces.extend(SequenceType, [Collection.CollectionType]);


const SequenceTypeInstance =
    new SequenceType();


//- Counts and returns the number of items within the sequence.
//= Sequence * ~> length :: () -> Int
SequenceType.prototype.length = function () {
    return this.foldl(Int.of(0))(a => _ => a.$PLUS(Int.of(1)));
};




module.exports = {
    Sequence: SequenceTypeInstance,
    SequenceType
};