//- This interface defines a Sequence of a
//-
//- import Int from "core:Data.Int:1.0.0"
//- import Collection from "core:Data.Collection:1.0.0"
//-
//- interface Sequence a extends Collection a where
//-     map :: (a -> b) -> Sequence b
//-     length :: () -> Int
//-
//-     take :: Int -> Sequence a

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
//- Sequence * ~> length =
//-     this.foldl 0 (\a \_ -> a + 1)
SequenceType.prototype.length = function () {
    return this.foldl(Int.of(0))(a => _ => a.$PLUS(Int.of(1)));
};


//- Shows a list in a more general form by using square brackets around a comma separated sequence of values.
SequenceType.prototype.show = function () {
    let result = "[";

    let current = this;

    {
        const cons = current.unapplyCons();
        if (cons.isJust()) {
            const unboxedCons = cons.withDefault([]);

            result = result + unboxedCons[0].show();
            current = unboxedCons[1];
        } else {
            return result + "]";
        }
    }
    while (true) {
        const cons = current.unapplyCons();

        if (cons.isJust()) {
            const unboxedCons = cons.withDefault([]);

            result = result + "," + unboxedCons[0].show();
            current = unboxedCons[1];
        } else {
            return result + "]";
        }
    }
};


module.exports = {
    Sequence: SequenceTypeInstance,
    SequenceType
};