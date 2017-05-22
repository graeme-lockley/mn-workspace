//- The interface that all `Number` values will need to implement.
//-
//- ```haskell
//- interface Number a extends Parity a, Visible a
//-     (+), (-), (⋆)   :: a -> a
//-     negate          :: () -> a
//-     abs, signum     :: () -> a
//-
//-     Number.zero     :: a
//-     Number.identity :: a
//- ```
//-
//- This interface offers no default implementations as all implementations will need to be able to represent 0 and 1.

const Interfaces = require("./Interfaces");
const Parity = require("./Parity");
const Visible = require("./Visible");


function NumberType() {
}


Interfaces.extend(NumberType, [Parity.ParityType, Visible.VisibleType]);


module.exports = {
    Number: new NumberType(),
    NumberType
};
