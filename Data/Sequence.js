//- This interface defines a Sequence of a
//-
//- import Int from "core:Data.Int:1.0.0"
//- import Collection from "core:Data.Collection:1.0.0"
//- import Maybe from "core:Data.Maybe:1.0.0"
//-
//- ```haskell
//- interface Sequence a extends Collection a where
//-     map :: (a -> b) -> Sequence b
//-     length :: () -> Int
//-
//-     take :: Int -> Self a
//-     at :: Int -> Maybe a
//-     startsWith :: Self a -> Bool
//-     indexOf :: Self a -> Maybe Int
//- ```

const Int = require("./Int").Int;
const Interfaces = require("./Interfaces");
const Maybe = require("./Maybe");

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


SequenceType.prototype.at = function(n) {
    let current = this;
    let index = n;
    while (index.$GREATER(index.type.zero)) {
        const cons = current.unapplyCons();

        if (cons.isJust()) {
            const unboxedCons = cons.withDefault([]);

            current = unboxedCons[1];
        } else {
            return Maybe.Nothing;
        }

        index = index.$MINUS(index.type.identity);
    }
    return current.unapplyCons().reduce(() => Maybe.Nothing)(([h, t]) => Maybe.Just(h));
};


SequenceType.prototype.isEmpty = function() {
    return this.unapplyNil().isJust();
};


SequenceType.prototype.startsWith = function(other) {
    let thisCurrent = this;
    let otherCurrent = other;

    while (true) {
        if (otherCurrent.isEmpty()) {
            return true;
        } else if (thisCurrent.isEmpty()) {
            return false;
        } else {
            const thisUncons = thisCurrent.unapplyCons().withDefault();
            const otherUncons = otherCurrent.unapplyCons().withDefault();

            if (thisUncons[0].$EQUAL$EQUAL(otherUncons[0])) {
                thisCurrent = thisUncons[1];
                otherCurrent = otherUncons[1];
            } else {
                return false;
            }
        }
    }
};


module.exports = {
    Sequence: SequenceTypeInstance,
    SequenceType
};