const Assert = require("assert");

const Generator = require("../Generator");

const Int = require("../../Data/Int").Int;
const Sequence = require("../../Data/Sequence");


const length = x =>
    x.reduce(() => 0)(y => ys => 1 + length(ys));


const rules = gen => s => s
    .case("forall x: x.length() == length(x)", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.length(), Int.of(length(x)));
    }))
;

module.exports = rules;