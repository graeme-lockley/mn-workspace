//- String
//-
//- import Int from "core:Data.Int:1.0.0"
//-
//- type String extends NativeString implements Sequence Char, Ordered, Visible
//-      at :: Int -> Maybe String
//-      foldl :: b -> (b -> a -> b) -> b

const Interfaces = require("./Interfaces");
const Char = require("./Char").Char;
const Int = mrequire("core:Data.Int:1.1.0");
const Ordered = require("./Ordered");
const Sequence = require("./Sequence");
const Visible = require("./Visible");

const Maybe = require("./Maybe");

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


module.exports = {
    String: $StringTypeInstance,
    StringType: $StringType
};