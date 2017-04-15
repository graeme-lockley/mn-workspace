"use strict";

const Maybe = mrequire("core:Data.Maybe:v1.0.0");

const identity = x => x;

const constant = c => _ => c;


function Result(value) {
    this.value = value;
}


function Okay(value) {
    return new Result([0, value]);
}


function Error(value) {
    return new Result([1, value]);
}


Result.prototype.map = function(okayMap) {
    return errorMap => this.value[0] === 0 ? okayMap(this.value[1]) : errorMap(this.value[1]);
};


Result.prototype.withDefault = function (value) {
    return this.map(identity)(constant(value));
};
assumption(Okay(10).withDefault(1) === 10);
assumption(Error(10).withDefault(1) === 1);


Result.prototype.isOkay = function() {
    return this.map(constant(true))(constant(false));
};
assumption(Okay(10).isOkay());
assumption(!Error(10).isOkay());


Result.prototype.isError = function() {
    return this.map(constant(false))(constant(true));
};
assumption(!Okay(10).isError());
assumption(Error(10).isError());


module.exports = {Error, Okay};
