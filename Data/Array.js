const Maybe = mrequire("core:lang.Maybe:v1.0.0");


function ImmutableArray(content) {
	this.content = content;
}


function fromArray(content) {
	return new ImmutableArray(content);
}


ImmutableArray.prototype.length = function() {
	return this.content.length;
};
assumption(fromArray([1, 2, 3, 4]).length() === 4);


Array.prototype.toArray = function() {
    return fromArray(this);
};
assumption([1, 2, 3, 4, 5].toArray().length() === 5);


//- Try to find an element in a data structure which satisfies a predicate mapping.
//-
//- Array a . findMap :: (a -> Maybe b) -> Maybe b
ImmutableArray.prototype.findMap = function(f) {
    const content = this.content;

    for (let lp = 0; lp < content.length; lp += 1) {
        const fResult = f(content[lp]);

        if (fResult.match([() => true, () => false])) {
            return fResult;
        }
    }

    return Maybe.Nothing;
};
assumption([1, 2, 3, 4, 5].toArray().findMap(n => n === 3 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 9);
assumption([1, 2, 3, 4, 5].toArray().findMap(n => n === 10 ? Maybe.Just(n * n) : Maybe.Nothing).withDefault(0) === 0);


module.exports = {
	fromArray
};
