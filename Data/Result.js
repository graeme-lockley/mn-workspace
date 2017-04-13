"use strict";

const Maybe = mrequire("core:lang.Maybe:v1.0.0");


function Okay(value) {
    return [0, value];
}


function Error(value) {
    return [1, value];
}


function withDefault(value) {
    return result => result[0] === 0 ? result[1] : value;
}
assumption(withDefault(1)(Okay(10)) === 10);
assumption(withDefault(1)(Error(10)) === 1);


module.exports = {Error, Okay, withDefault};
