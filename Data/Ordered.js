//- The `Ordered` is used to define totally ordered data-types.
//-
//- ```haskell
//- interface Ordering a extends Parity a where
//-     (<=) :: a -> Bool
//-
//-     (<) :: a -> Bool
//-     (<) y =
//-         this.(<=) y && this.(!=) y
//-
//-     (>=) :: a -> Bool
//-     (>=) y =
//-         this.(==) y || ! (this.(<=) y)
//-
//-     (>) :: a -> Bool
//-     (>) y =
//-         ! (this.(<=) y)
//-
//-     compare :: a -> Ordering
//-     compare y =
//-         this.(==)(y)
//-             ? EQ
//-             : this.(<=) y
//-                 ? LT
//-                 : GT
//-
//-     max :: a -> a
//-     max y =
//-         this.(<=) y
//-             ? y
//-             : x
//-
//-     min :: a -> a
//-     min y =
//-         this.(<=) y
//-             ? x
//-             : y
//- ```
//-
//- The constants `LT`, `EQ` and `GT` are defined as
//-
//- ```haskell
//- datatype Ordering = LT | EQ | GT
//- ```

const Interfaces = require("./Interfaces");
const Parity = require("./Parity");

//- Constant content for compare result.
//= LT :: Int
const LT =
    -1;


//- Constant content for compare result.
//= EQ :: Int
const EQ =
    0;


//- Constant content for compare result.
//= GT :: Int
const GT =
    1;


function OrderedType() {
}


Interfaces.extend(OrderedType, [Parity.ParityType]);


//- The default implementation for `(<=)`.
//= Ordered a ~> (<=) :: a -> Bool
OrderedType.prototype.$LESS$EQUAL = function (other) {
    return this.content <= other.content;
};


//- The default implementation for `(<)`.
//= Ordered a ~> (<) :: a -> Bool
OrderedType.prototype.$LESS = function (other) {
    return this.$LESS$EQUAL(other) && this.$NOT$EQUAL(other);
};


//- The default implementation for `(>=)`.
//= Ordered a ~> (>=) :: a -> a -> Bool
OrderedType.prototype.$GREATER$EQUAL = function (other) {
    return this.$EQUAL$EQUAL(other) || !this.$LESS$EQUAL(other);
};


//- The default implementation for `(>)`.
//= Ordered a ~> (>) :: a -> Bool
OrderedType.prototype.$GREATER = function (other) {
    return !this.$LESS$EQUAL(other);
};


//- The default implementation for `compare`.
//= Ordered a ~> compare :: a -> Ordering
OrderedType.prototype.compare = function (other) {
    return this.$EQUAL$EQUAL(other)
        ? EQ
        : this.$LESS$EQUAL(other)
            ? LT
            : GT;
};


//- The default implementation for `max`.
//= Ordered a ~> max :: a -> a
OrderedType.prototype.max = function (other) {
    return this.$LESS$EQUAL(other)
        ? other
        : this;
};


//- The default implementation for `min`.
//= Ordered a ~> min :: a -> a
OrderedType.prototype.min = function (other) {
    return this.$LESS$EQUAL(other)
        ? this
        : other;
};


module.exports = {
    LT,
    EQ,
    GT,
    Ordered: new OrderedType(),
    OrderedType
};