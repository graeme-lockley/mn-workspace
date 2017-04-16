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


Result.prototype.reduce = function(okay) {
    return error => this.value[0] === 0 ? okay(this.value[1]) : error(this.value[1]);
};


Result.prototype.withDefault = function (value) {
    return this.reduce(identity)(constant(value));
};
assumption(Okay(10).withDefault(1) === 10);
assumption(Error(10).withDefault(1) === 1);


Result.prototype.isOkay = function() {
    return this.reduce(constant(true))(constant(false));
};
assumption(Okay(10).isOkay());
assumption(!Error(10).isOkay());


Result.prototype.isError = function() {
    return this.reduce(constant(false))(constant(true));
};
assumption(!Okay(10).isError());
assumption(Error(10).isError());


Result.prototype.andThen = function(f) {
    return this.reduce(okay => f(okay))(error => Error(error));
};
assumption(Okay(10).andThen(n => Okay(n * 2)).isOkay());
assumption(Okay(10).andThen(n => Okay(n * 2)).withDefault(0) === 20);
assumption(Error(1).andThen(n => Okay(n * 2)).isError());
assumption(Error(1).andThen(n => Okay(n * 2)).reduce(identity)(identity) === 1);


Result.prototype.map = function(f) {
    return this.reduce(okay => Okay(f(okay)))(error => Error(error));
};
assumptionEqual(Okay(10).map(n => n * 10), Okay(100));
assumptionEqual(Error(10).map(n => n * 10), Error(10));


module.exports = {Error, Okay};
