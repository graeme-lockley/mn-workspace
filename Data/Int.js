const Maybe = mrequire("core:Data.Maybe:v1.0.0");


//- Reads an Int from a `String` value. The number must parse as an integer and fall within the valid range of values
//- for the `Int` type, otherwise `Nothing` is returned.
//-
//- fromString :: String -> Maybe Int
function fromString(s) {
    const result = parseInt(s);

    if (isNaN(result)) {
        return Maybe.Nothing;
    } else {
        return Maybe.Just(result);
    }
}


module.exports = {
    fromString
};