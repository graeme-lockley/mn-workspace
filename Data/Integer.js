//- The following interface represents all numbers that can be expressed without a fractional component.
//-
//-```haskell
//- interface Integer a extends Number a, Ordered a
//-     (/), mod :: a -> Maybe a
//-     divMod   :: a -> Maybe (a * a)
//-     divMod y =
//-         this.(/)(y).reduce(() => Nothing)(q => this.mod(y).reduce(() => Nothing)(t => (q, r))
//-  ```
//-
//- Note the following:
//-
//- * The division centered operations all return a Maybe to cater for the scenario where an attempt is used to divide
//-   by 0.
//- * The type `a * a` signifies a tuple.

const Interfaces = require("./Interfaces");
const Number = require("./Number");
const Ordered = require("./Ordered");

const Maybe = require("./Maybe");


function IntegerType() {
}


Interfaces.extend(IntegerType, [
    Number.NumberType,
    Ordered.OrderedType
]);


//- Default implementation for `divMod`.
//= Integer a => defaultDivMod :: a -> Maybe (a * a)
IntegerType.prototype.divMod = function (y) {
    return this.$SLASH(y).reduce(
        () => Maybe.Nothing)(
        q => this.mod(y).reduce(
            () => Maybe.Nothing)(
            r => Maybe.Just([q, r])
        )
    );
};


module.exports = {
    Integer: new IntegerType(),
    IntegerType
};