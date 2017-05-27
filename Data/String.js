//- String
//-
//- import Int from "core:Data.Int:1.0.0"
//-
//- ```haskell
//- import Maybe from "core:Data.Maybe:1.0.0"
//- import String from "core:Data.String:1.0.0"
//-
//- type String extends NativeString implements Sequence Char, Ordered, Visible
//-     at :: Int -> Maybe String
//-     foldl :: b -> (b -> a -> b) -> b
//-     map :: (a -> b) -> Sequence b
//-     take :: Int -> Self a
//-     startsWith :: Self a -> Bool
//- ```

const Interfaces = require("./Interfaces");

const Array = require("./Array").Array;
const Char = require("./Char").Char;
const Int = require("./Int").Int;
const Maybe = require("./Maybe");
const Ordered = require("./Ordered");
const Sequence = require("./Sequence");
const Visible = require("./Visible");

const NativeString = require("../Native/Data/String");


function $StringType() {
}


$StringType.prototype.of = function (s) {
    return new $String(s);
};


const $StringTypeInstance =
    new $StringType();


function $String(value) {
    this.content = value;
    this.type = $StringTypeInstance;
}


Interfaces.extend($String, [
    Ordered.OrderedType,
    Sequence.SequenceType,
    Visible.VisibleType
]);


$String.prototype.unapplyNil = function () {
    return NativeString.length(this.content) === 0
        ? Maybe.Just([])
        : Maybe.Nothing;
};


$String.prototype.unapplyCons = function () {
    return NativeString.length(this.content) === 0
        ? Maybe.Nothing
        : Maybe.Just([
            NativeString.at(0)(this.content)
                .then(Char.ofNativeString)
                .withDefault(Char.minBound),
            this.type.of(NativeString.substringFrom(1)(this.content))]);
};


$String.prototype.reduce = function (fNil) {
    return fCons =>
        NativeString.length(this.content) === 0
            ? fNil()
            : fCons(
            NativeString.at(0)(this.content)
                .then(Char.ofNativeString)
                .withDefault(Char.minBound))(
            this.type.of(NativeString.substringFrom(1)(this.content))
        );
};


$String.prototype.endsWith = function (suffix) {
    return NativeString.endsWith(suffix.content)(this.content);
};


$String.prototype.at = function (i) {
    return Maybe.ofNative(NativeString.at(i.content)(this.content))
        .then(Char.ofNativeString);
};


$String.prototype.foldl = function (z) {
    const _value = this.content;

    return f => {
        let result = z;

        let loop = 0;
        let upper = _value.length;
        while (loop < upper) {
            result = f(result)(this.at(Int.of(loop)).withDefault(Char.minBound));
            loop += 1;
        }
        return result;
    };
};


$String.prototype.take = function(n) {
    return this.type.of(NativeString.substring(0)(n.content)(this.content));
};


$String.prototype.asArray = function() {
    return this.foldl(Array.empty)(acc => i => acc.append(i));
};


$String.prototype.map = function(f) {
    return this.asArray().map(f);
};


module.exports = {
    String: $StringTypeInstance,
    StringType: $StringType
};