"use strict";

/*
 * Maybe a =
 *   Just a
 * | Nothing
 */

function Maybe(value) {
    this.value = value;
}


function Just(something) {
    return new Maybe([0, something]);
}


const Nothing = new Maybe([1]);


Maybe.prototype.match = function (patterns) {
    return this.value[0] === 0 ? patterns[0](this.value[1]) : patterns[1]();
};


// Maybe a . withDefault: a -> a
Maybe.prototype.withDefault = function (value) {
    return this.match([
        thisValue => thisValue,
        () => value
    ]);
};
assumption(Just(1).withDefault(10) === 1);
assumption(Nothing.withDefault(10) === 10);


// Maybe a . map: (a -> b) -> Maybe b
Maybe.prototype.map = function (f) {
    return this.match([
        value => Just(f(value)),
        () => Nothing
    ]);
};
assumption(Just(10).map(x => x * 2).withDefault(0) === 20);
assumption(Nothing.map(x => x * 2).withDefault(0) === 0);


// Maybe a . map2: (a -> b -> c) -> Maybe b -> Maybe c
Maybe.prototype.map2 = function (b) {
    return f => this.match([
        thisValue => b.match([
            bValue => Just(f(thisValue)(bValue)),
            () => Nothing
        ]),
        () => Nothing
    ]);
};
assumption(Just(10).map2(Just(20))(a => b => a * b).withDefault(0) === 200);
assumption(Nothing.map2(Just(20))(a => b => a * b).withDefault(0) === 0);
assumption(Just(10).map2(Nothing)(a => b => a * b).withDefault(0) === 0);


// Maybe a . andThen: (a -> Maybe b) -> Maybe b
Maybe.prototype.andThen = function (callback) {
    return this.match([
        value => callback(value),
        () => Nothing
    ]);
};
assumption(Just(10).andThen(a => Just(a * 20)).withDefault(0) === 200);
assumption(Just(10).andThen(a => Nothing).withDefault(0) === 0);
assumption(Nothing.andThen(a => Just(a * 20)).withDefault(0) === 0);


module.exports = {
    Just,
    Nothing
};