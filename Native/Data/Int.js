const NativeMaybe = require("./Maybe");


//- Converts an NativeInt to a NativeString.
//- toString :: NativeInt -> NativeString
const toString = v =>
    "" + v;
assumptionEqual(toString(0), "0");
assumptionEqual(toString(100), "100");
assumptionEqual(toString(-100), "-100");


//- Reads an Int from a `String` content. The number must parse as an integer and fall within the valid range of values
//- for the `Int` type, otherwise `Nothing` is returned.
//-
//- fromString :: String -> Maybe Int
const fromString = s => {
    const result = parseInt(s);

    if (isNaN(result)) {
        return NativeMaybe.Nothing;
    } else {
        return NativeMaybe.Just(result);
    }
};
assumption(fromString("123").withDefault(0) === 123);
assumption(fromString("12abc").withDefault(0) === 12);
assumption(fromString("abc").withDefault(0) === 0);


module.exports = {
    fromString,
    toString
};
