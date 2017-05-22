//- Int is a type alias extension over NativeInt
//-
//- ```haskell
//- import NativeInt from "core:Native.Data.Int:1.0.0"
//- import Parity from "core:Data.Parity:1.0.0"
//- import Visible from "core:Data.Visible:1.0.0"
//- import Bounded from "core:Data.Bounded:1.0.0"
//-
//- type Int extends NativeInt implements Bounded, Integer
//-
//- Int.of :: NativeInt -> Int
//- Int.of n =
//-     n
//-
//- Int.minBound :: Int
//- Int.minBound =
//-     Int.of -2147483648
//-
//- Int.maxBound :: Int
//- Int.maxBound =
//-     Int.of 2147483647
//- ```

const Interfaces = require("./Interfaces");
const Ordered = require("./Ordered");
const Bounded = require("./Bounded");
const Integer = require("./Integer");

const Maybe = require("./Maybe");


function IntType() {
}


const IntTypeInstance =
    new IntType();


function Int(content) {
    this.content = content;
    this.type = IntTypeInstance;
}


Interfaces.extend(Int, [
    Bounded.BoundedType,
    Ordered.OrderedType,
    Integer.IntegerType
]);


IntType.prototype.maxBound =
    new Int(2147483647);


IntType.prototype.minBound =
    new Int(-2147483648);


IntType.prototype.zero =
    new Int(0);


IntType.prototype.identity =
    new Int(1);


//- Creates an `Int` from a `Native Integer`.
//= of :: Data.Native.Integer -> Int
IntType.prototype.of = function (value) {
    return new Int(value);
};


//= Int ~> (+) :: Int -> Int
Int.prototype.$PLUS = function (other) {
    return this.type.of(this.content + other.content | 0);
};


//= Int ~> (-) :: Int -> Int
Int.prototype.$MINUS = function (other) {
    return this.type.of(this.content - other.content | 0);
};


//= Int ~> (*) :: Int -> Int
Int.prototype.$STAR = function (other) {
    return this.type.of((this.content * other.content) | 0);
};


//= Int ~> negate :: () -> Int
Int.prototype.negate = function () {
    return this.type.of((-this.content) | 0);
};


//= Int ~> abs :: () -> Int
Int.prototype.abs = function () {
    return this.content < 0 ? this.type.of((-this.content) | 0) : this;
};


//= Int ~> signum :: () -> Int
Int.prototype.signum = function () {
    return this.content < 0
        ? this.type.of(-1)
        : this.content === 0
            ? this
            : this.type.of(1);
};


//= Int ~> (/) :: Int -> Maybe Int
Int.prototype.$SLASH = function (denominator) {
    if (denominator.content === 0) {
        return Maybe.Nothing;
    } else {
        return Maybe.Just(this.type.of((this.content / denominator.content) | 0));
    }
};


//= Int ~> mod :: Int -> Maybe Int
Int.prototype.mod = function (denominator) {
    if (denominator.content === 0) {
        return Maybe.Nothing;
    } else {
        return Maybe.Just(this.type.of((this.content % denominator.content) | 0));
    }
};


module.exports = {
    Int: IntTypeInstance,
    IntType
};
