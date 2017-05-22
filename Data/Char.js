//- Char is a type alias extension over NativeChar
//-
//- ```haskell
//- import NativeInt from "core:Native.Data.Int:1.0.0"
//- import Parity from "core:Data.Parity:1.0.0"
//- import Visible from "core:Data.Visible:1.0.0"
//- import Bounded from "core:Data.Bounded:1.0.0"
//- import Maybe from "core:Data.Maybe:1.0.0"
//-
//- type Char extends NativeInt implements Parity, Visible, Bounded
//-
//- Char.of :: NativeInt -> Char
//- Char.of n =
//-     n mod 255
//-
//- Char.ofInt :: Int -> Char
//- Char.ofInt n =
//-     n.content
//-
//- Char.ofNativeString :: NativeString -> Maybe Char
//- Char.ofNativeString s =
//-     (NativeString.at 0 s)
//-         .then Char.ofInt
//-
//- Char.minBound :: Char
//- Char.minBound =
//-     Char.of 0
//-
//- Char.maxBound :: Char
//- Char.maxBound =
//-     Char.of 255
//- ```
//-
//- interface Bounded a where
//-     Bounded.minBound :: a
//-     Bounded.maxBound :: a
//-

const Interfaces = require("./Interfaces");
const Maybe = require("./Maybe");
const NativeInt = mrequire("core:Data.Native.Int:1.0.0");

const Parity = require("./Parity");
const Bounded = require("./Bounded");
const Visible = require("./Visible");


function CharType() {
}


const CharTypeInstance =
    new CharType();


function Char(content) {
    this.content = content;
    this.type = CharTypeInstance;
}


Interfaces.extend(Char, [Parity.ParityType, Bounded.BoundedType, Visible.VisibleType]);


Char.prototype.show = function() {
    return String.fromCharCode(this.content);
};


CharType.prototype.maxBound =
    new Char(255);


CharType.prototype.minBound =
    new Char(0);


CharType.prototype.of = function(n) {
    return new Char(n);
};


CharType.prototype.ofInt = function (n) {
    return this.of(n.content)
};


CharType.prototype.ofNativeString = function (s) {
    return s.length > 0
        ? Maybe.Just(new Char(s.charCodeAt(0)))
        : Maybe.Nothing;
};


module.exports = {
    Char: CharTypeInstance,
    CharType
};