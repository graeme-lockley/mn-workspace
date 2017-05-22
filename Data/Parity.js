//- The interface `Parity` defines equality `(==)` and inequality `(!=)`.  This interface is implemented on the
//- majority of non-native data-types.
//-
//- ```haskell
//- interface Parity a where
//-     (==) :: a -> Bool
//-     (!=) :: a -> Bool
//-     (!=) y =
//-         ! (this.(==) y)
//- ```

function ParityType() {
}


ParityType.prototype.$EQUAL$EQUAL = function(other) {
    return this.content === other.content;
};


ParityType.prototype.$NOT$EQUAL = function(other) {
    return !this.$EQUAL$EQUAL(other);
};


module.exports = {
    Parity: new ParityType(),
    ParityType
};