function MaybeState(content) {
    this.content = content;
}


const Nothing =
    new MaybeState([0]);


const Just = content =>
    new MaybeState([1, content]);


MaybeState.prototype.reduce = function(fNothing) {
    return fJust => {
        switch (this.content[0]) {
            case 0: return fNothing();
            case 1: return fJust(this.content[1]);
        }
    };
};


MaybeState.prototype.isJust = function() {
    return this.reduce(() => false)(_ => true);
};


MaybeState.prototype.isNothing = function() {
    return this.reduce(() => true)(_ => false);
};



MaybeState.prototype.map = function(f) {
    return this.reduce(() => Nothing)(x => Just(f(x)));
};


MaybeState.prototype.withDefault = function(defaultValue) {
    return this.reduce(() => defaultValue)(x => x);
};


module.exports = {
    Nothing,
    Just
};
