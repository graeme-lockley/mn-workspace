const identity = x => x;

const constant = c => _ => c;


function Result(value) {
    this.value = value;
}


const Okay = value =>
    new Result([0, value]);


const Error = value =>
    new Result([1, value]);


Result.prototype.reduce = function(fOkay) {
    return fError => this.value[0] === 0 ? fOkay(this.value[1]) : fError(this.value[1]);
};


Result.prototype.withDefault = function (value) {
    return this.reduce(identity)(constant(value));
};


Result.prototype.isOkay = function() {
    return this.reduce(constant(true))(constant(false));
};


Result.prototype.isError = function() {
    return this.reduce(constant(false))(constant(true));
};


Result.prototype.andThen = function(f) {
    return this.reduce(okay => f(okay))(error => Error(error));
};


Result.prototype.map = function(f) {
    return this.reduce(okay => Okay(f(okay)))(error => Error(error));
};


module.exports = {
    Error,
    Okay
};
