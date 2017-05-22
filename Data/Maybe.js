//- The Maybe datatype is used to represent optional values and can be seen as something like a type-safe null, where
//- `Nothing` is `null` and `Just(x)` is the non-null content `x`.
//-
//- This datatype has the following type signature:
//- ```haskell
//- instance Maybe a implements Eq a, Show a
//- ```

const NativeMaybe = require("../Native/Data/Maybe");

const Parity = require("./Parity");
const Visible = require("./Visible");


function Maybe(value) {
    this.content = value;
}


//= Nothing :: Maybe a
const Nothing = new Maybe([0]);


//= Just :: a -> Maybe a
function Just(something) {
    return new Maybe([1, something]);
}


//- Adds `(==)` to enable `Parity a` over this class.
//= Maybe a => (==) :: Maybe a -> Bool
Maybe.prototype.$EQUAL$EQUAL = function (other) {
    return this.reduce(
        () => other.isNothing())(
        selfValue =>
            other.reduce(
                () => false)(
                otherValue => selfValue.$EQUAL$EQUAL(otherValue)
            )
    )

};


Maybe.prototype.$NOT$EQUAL = Parity.default$NOT$EQUAL;


//- Adds `show` to enable `Show a` over this class.
//= Maybe => show :: () -> String
Maybe.prototype.show = function () {
    return this.reduce(
        () => "Nothing()")(
        value => "Just(" + value.show() + ")"
    )
};


//= Maybe a => reduce :: (() -> b) -> (a -> b) -> b
Maybe.prototype.reduce = function (fNothing) {
    return fJust => this.content[0] === 0
        ? fNothing()
        : fJust(this.content[1]);
};


//= Maybe a => withDefault :: a -> a
Maybe.prototype.withDefault = function (value) {
    return this.reduce(
        () => value)(
        thisValue => thisValue);
};
assumption(Just(1).withDefault(10) === 1);
assumption(Nothing.withDefault(10) === 10);


//= Maybe a => map :: (a -> b) -> Maybe b
Maybe.prototype.map = function (f) {
    return this.reduce(
        () => Nothing)(
        value => Just(f(value)));
};
assumption(Just(10).map(x => x * 2).withDefault(0) === 20);
assumption(Nothing.map(x => x * 2).withDefault(0) === 0);


//= Maybe a => map2 :: (a -> b -> c) -> Maybe b -> Maybe c
Maybe.prototype.map2 = function (b) {
    return f => this.reduce(
        () => Nothing)(
        thisValue => b.reduce(
            () => Nothing)(
            bValue => Just(f(thisValue)(bValue))));
};
assumption(Just(10).map2(Just(20))(a => b => a * b).withDefault(0) === 200);
assumption(Nothing.map2(Just(20))(a => b => a * b).withDefault(0) === 0);
assumption(Just(10).map2(Nothing)(a => b => a * b).withDefault(0) === 0);


//= Maybe a => then :: (a -> Maybe b) -> Maybe b
Maybe.prototype.then = function (f) {
    return this.reduce(
        () => Nothing)(
        value => f(value));
};
assumption(Just(10).then(a => Just(a * 20)).withDefault(0) === 200);
assumption(Just(10).then(a => Nothing).withDefault(0) === 0);
assumption(Nothing.then(a => Just(a * 20)).withDefault(0) === 0);


//= Maybe a => catch :: (() -> Maybe a) -> Maybe a
Maybe.prototype.catch = function (f) {
    return this.reduce(
        () => f())(
        value => Just(value));
};
assumption(Just(10).catch(a => Just(100)).withDefault(0) === 10);
assumption(Just(10).catch(a => Nothing).withDefault(0) === 10);
assumption(Nothing.catch(a => Just(20)).withDefault(0) === 20);


//= Maybe a => isJust :: () -> Bool
Maybe.prototype.isJust = function () {
    return this.reduce(
        () => false)(
        value => true);
};
assumption(Just(10).isJust());
assumption(!Nothing.isJust());


//= Maybe a => isNothing :: () -> Bool
Maybe.prototype.isNothing = function () {
    return !this.isJust();
};
assumption(!Just(10).isNothing());
assumption(Nothing.isNothing());


//- Converts this into a native `Maybe`.
//= Maybe a => asNative :: () => Data.Native.Maybe a
Maybe.prototype.asNative = function () {
    return this.reduce(
        () => NativeMaybe.Nothing)(
        v => NativeMaybe.Just(v)
    );
};
assumptionEqual(Just(10).asNative(), NativeMaybe.Just(10));
assumptionEqual(Nothing.asNative(), NativeMaybe.Nothing);


//- Constructs an instance of `Maybe` from a native maybe.
//= Maybe a => asNative :: () => Data.Native.Maybe a
const ofNative = nativeMaybe =>
    nativeMaybe.reduce(
        () => Nothing)(
        v => Just(v)
    );
assumptionEqual(ofNative(NativeMaybe.Just(10)), Just(10));
assumptionEqual(ofNative(NativeMaybe.Nothing), Nothing);


module.exports = {
    Just,
    Nothing,
    ofNative
};
