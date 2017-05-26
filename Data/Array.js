//- An array implementation of sequence using native arrays.
//-
//- type Array a extends NativeBuffer implements Sequence a, Visible a where
//-      ~Nil :: Maybe ()
//-      ~Cons :: Maybe a * (Collection a)
//-

const Interfaces = require("./Interfaces");

const Maybe = require("./Maybe");
const Tuple = require("./Tuple");

const NativeArray = require("../Native/Data/Array");
const NativeMaybe = require("../Native/Data/Maybe");

const Int = require("./Int").Int;
const $String = require("./String").String;

const Parity = require("./Parity");
const Sequence = require("./Sequence");
const Visible = require("./Visible");

const Ordered = require("./Ordered");


function ArrayType() {
}


const ArrayTypeInstance =
    new ArrayType();


function ArrayState(content) {
    this.content = content;
    this.type = ArrayTypeInstance;
}


Interfaces.extend(ArrayState, [
    Parity.ParityType,
    Sequence.SequenceType,
    Visible.VisibleType
]);


//- Constructor that create an `Array` from a `Data.Native.Array`.
//= of :: Data.Native.Array a -> Array a
ArrayType.prototype.of = function(content) {
    return new ArrayState(content);
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3, 4]).content, [1, 2, 3, 4]);


//- Constructor that create an `Array` containing a single element.
//= singleton :: a -> Array a
ArrayType.prototype.singleton = function(content) {
    return new ArrayState([content]);
};
assumptionEqual(ArrayTypeInstance.singleton(1).content, [1]);


//- Constructor that create an empty `Array`.
//= empty :: Array a
ArrayType.prototype.empty =
    new ArrayState([]);
assumptionEqual(ArrayTypeInstance.empty.content, []);


ArrayState.prototype.map = function (f) {
    return this.type.of(NativeArray.map(f)(this.content));
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3, 4]).map(n => "p" + n), ArrayTypeInstance.of(["p1", "p2", "p3", "p4"]));
assumptionEqual(ArrayTypeInstance.empty.map(n => "p" + n), ArrayTypeInstance.empty);


//- Creates an array of `Int`s for the given range.
//= range :: Data.Int -> Data.Int -> Array Data.Int
ArrayType.prototype.range = function(lower) {
    return upper =>
        new ArrayState(NativeArray.map(Int.of)(NativeArray.range(lower.content)(upper.content)));
};
assumptionEqual(ArrayTypeInstance.range(Int.of(1))(Int.of(10)), ArrayTypeInstance.of([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(Int.of));
assumptionEqual(ArrayTypeInstance.range(Int.of(10))(Int.of(1)), ArrayTypeInstance.of([10, 9, 8, 7, 6, 5, 4, 3, 2]).map(Int.of));


ArrayState.prototype.length = function () {
    return Int.of(NativeArray.length(this.content));
};
assumptionEqual(ArrayTypeInstance.empty.length(), Int.of(0));
assumptionEqual(ArrayTypeInstance.of([1, 2, 3]).length(), Int.of(3));


const nativeMaybeToMaybe = value =>
    value.reduce(() => Maybe.Nothing)(v => Maybe.Just(v));


const maybeToNativeMaybe = value =>
    value.reduce(() => NativeMaybe.Nothing)(v => NativeMaybe.Just(v));


//- Try to find an element in a data structure which satisfies a predicate mapping.
//-
//= Array a => findMap :: (a -> Maybe b) -> Maybe b
ArrayState.prototype.findMap = function (f) {
    return nativeMaybeToMaybe(
        NativeArray
            .findMap(this.content)(x => maybeToNativeMaybe(f(x)))
    );
};
assumption(ArrayTypeInstance.of([1, 2, 3, 4, 5]).findMap(n => n === 3 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 9);
assumption(ArrayTypeInstance.of([1, 2, 3, 4, 5]).findMap(n => n === 10 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 0);


ArrayState.prototype.append = function (item) {
    return this.type.of(NativeArray.append(this.content)(item));
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3]).append(4), ArrayTypeInstance.of([1, 2, 3, 4]));


ArrayState.prototype.prepend = function (item) {
    return this.type.of(NativeArray.prepend(item)(this.content));
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3]).prepend(0), ArrayTypeInstance.of([0, 1, 2, 3]));
assumptionEqual(ArrayTypeInstance.empty.prepend(0), ArrayTypeInstance.of([0]));


ArrayState.prototype.slice = function (start) {
    return end =>
        this.type.of(NativeArray.slice(this.content)(start.content)(end.content));
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3, 4, 5]).slice(Int.of(1))(Int.of(3)), ArrayTypeInstance.of([2, 3]));
assumptionEqual(ArrayTypeInstance.of([1, 2, 3, 4, 5]).slice(Int.of(1))(Int.of(2)), ArrayTypeInstance.of([2]));


ArrayState.prototype.at = function (index) {
    return nativeMaybeToMaybe(NativeArray.at(this.content)(index.content));
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3]).at(Int.of(2)), Maybe.Just(3));
assumptionEqual(ArrayTypeInstance.of([1, 2, 3]).at(Int.of(5)), Maybe.Nothing);


ArrayState.prototype.head = function () {
    return this.at(Int.of(0));
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3, 4]).head(), Maybe.Just(1));
assumptionEqual(ArrayTypeInstance.empty.head(), Maybe.Nothing);


ArrayState.prototype.tail = function () {
    const contentLength = NativeArray.length(this.content);

    return contentLength > 0 ? Maybe.Just(this.slice(Int.of(1))(Int.of(contentLength))) : Maybe.Nothing;
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3, 4]).tail(), Maybe.Just(ArrayTypeInstance.of([2, 3, 4])));
assumptionEqual(ArrayTypeInstance.of([1]).tail(), Maybe.Just(ArrayTypeInstance.empty));
assumptionEqual(ArrayTypeInstance.empty.tail(), Maybe.Nothing);


ArrayState.prototype.concat = function (array) {
    return this.type.of(NativeArray.concat(this.content)(array.content));
};
assumptionEqual(ArrayTypeInstance.of([1, 2, 3]).concat(ArrayTypeInstance.of([4, 5, 6])), ArrayTypeInstance.of([1, 2, 3, 4, 5, 6]));


ArrayState.prototype.reduce = function (fNil) {
    return fCons =>
        NativeArray.reduce(this.content)(fNil)(h => t => fCons(h)(this.type.of(t)));
};
assumptionEqual(ArrayTypeInstance.empty.reduce(() => ({}))(h => t => ({head: h, tail: t})), {});
assumptionEqual(ArrayTypeInstance.of([1, 2, 3]).reduce(() => ({}))(h => t => ({head: h, tail: t})), {head: 1, tail: ArrayTypeInstance.of([2, 3])});


ArrayState.prototype.zipWith = function (f) {
    return other => this.type.of(NativeArray.zipWith(f)(this.content)(other.content));
};


ArrayState.prototype.zip = function (other) {
    return this.zipWith(Tuple)(other);
};
assumptionEqual(ArrayTypeInstance.of(["a", "b", "c"]).zip(ArrayTypeInstance.range(Int.of(1))(Int.of(10))), ArrayTypeInstance.of([Tuple("a")(Int.of(1)), Tuple("b")(Int.of(2)), Tuple("c")(Int.of(3))]));
assumptionEqual(ArrayTypeInstance.of(["a", "b", "c"]).zip(ArrayTypeInstance.empty), ArrayTypeInstance.empty);
assumptionEqual(ArrayTypeInstance.empty.zip(ArrayTypeInstance.range(Int.of(1))(Int.of(10))), ArrayTypeInstance.empty);


ArrayState.prototype.join = function (separator) {
    return $String.of(NativeArray.join(this.map(x => x.show()).content)(separator.content));
};
// assumptionEqual(ArrayTypeInstance.empty.join($String.of(",")), $String.of(""));
// assumptionEqual(ArrayTypeInstance.range(Int.of(1))(Int.of(5)).join($String.of(",")), $String.of("1,2,3,4"));


//= Array a => filter :: (a -> Bool) -> Array a
ArrayState.prototype.filter = function (predicate) {
    return this.type.of(NativeArray.filter(predicate)(this.content));
};
assumptionEqual(ArrayTypeInstance.range(Int.of(1))(Int.of(5)).filter(n => n.content % 2 === 0), ArrayTypeInstance.of([2, 4]).map(Int.of));


//= Array a => sort :: Data.Ordered a => Array a
ArrayState.prototype.sort = function () {
    return this.type.of(NativeArray.sort(a => b => {
        const result = a.compare(b);
        if (result === Ordered.LT) {
            return -1;
        } else if (result === Ordered.EQ) {
            return 0;
        } else {
            return 1;
        }
    })(this.content));
};
assumptionEqual(ArrayTypeInstance.range(Int.of(10))(Int.of(0)).sort(), ArrayTypeInstance.range(Int.of(1))(Int.of(11)));


ArrayState.prototype.unapplyNil = function () {
    const contentLength = NativeArray.length(this.content);

    return contentLength === 0
        ? Maybe.Just([])
        : Maybe.Nothing;
};


ArrayState.prototype.unapplyCons = function () {
    const contentLength = NativeArray.length(this.content);

    return contentLength === 0
        ? Maybe.Nothing
        : Maybe.Just([this.content[0], this.slice(Int.of(1))(contentLength)]);
};


ArrayState.prototype.take = function(n) {
    return this.slice(Int.of(0))(n);
};


module.exports = {
    Array: ArrayTypeInstance,
    ArrayTypeInstance
};
