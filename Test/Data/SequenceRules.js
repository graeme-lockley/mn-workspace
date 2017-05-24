const Assert = require("assert");

const Generator = require("../Generator");

const Int = require("../../Data/Int").Int;
const NativeArray = require("../../Native/Data/Array");
const Sequence = require("../../Data/Sequence");


const length = x =>
    x.reduce(() => 0)(y => ys => 1 + length(ys));


const toArray = x =>
    x.foldl([])(acc => i => NativeArray.append(acc)(i));


const arrayEqual = x => y => {
    if (x.length === y.length) {
        for (let lp = 0; lp < x.length; lp += 1) {
            if (x[lp].$NOT$EQUAL(y[lp])) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
};


const rules = gen => s => s
    .case("forall x: x.length() == length(x)", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.length(), Int.of(length(x)));
    }))
    .case("forall x: forall y in 0 .. x.length() + 1: slice(0)(y) == x.take(y)", Generator.forall([gen], ([x]) => {
        const n = Generator.integerInRange(Int.of(0))(x.length());
        Assert.equal(arrayEqual(NativeArray.slice(toArray(x))(0)(n))(toArray(x.take(Int.of(n)))), true);
    }))
;

module.exports = rules;