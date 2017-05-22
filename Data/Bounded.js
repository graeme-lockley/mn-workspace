//- The `Bounded` interface for supports 2 functions which return the minimum and maximum value of the associated class.
//-
//- ```haskell
//- interface Bounded a where
//-     Bounded.minBound :: a
//-     Bounded.maxBound :: a
//- ```

function BoundedType() {
}


module.exports = {
    Bounded: new BoundedType(),
    BoundedType
};
