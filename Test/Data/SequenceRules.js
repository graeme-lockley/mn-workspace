const Assert = require("assert");

const Generator = require("../Generator");

const Int = require("../../Data/Int").Int;
const Maybe = require("../../Data/Maybe");
const NativeArray = require("../../Native/Data/Array");
const Sequence = require("../../Data/Sequence");


const length = x =>
    x.reduce(() => 0)(y => ys => 1 + length(ys));


const toArray = x =>
    x.foldl([])(acc => i => NativeArray.append(acc)(i));


const rules = gen => s => s
    .case("forall x: x.length() == length(x)", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.length(), Int.of(length(x)));
    }))
    .case("forall x: forany y in 0 .. x.length() + 2: slice(0)(y) == x.take(y)", Generator.forall([gen], ([x]) => {
        const n = Generator.integerInRange(Int.of(0))(x.length().$PLUS(Int.of(2)));
        Assert.deepEqual(NativeArray.slice(toArray(x))(0)(n), toArray(x.take(Int.of(n))));
    }))
    .case("forall x: forany y < 0: x.take(y) == []", Generator.forall([gen], ([x]) => {
        const n = Generator.integerInRange(Int.minBound)(Int.of(-1));
        Assert.deepEqual(toArray(x.take(Int.of(n))), []);
    }))
    .case("forall x: forany y in 0 .. x.length() + 2: y < x.length() ? Maybe.Just(toArray(x)[y]) == x.at(y) : Maybe.Nothing == a.at(y)", Generator.forall([gen], ([x]) => {
        const n = Int.of(Generator.integerInRange(Int.of(0))(x.length().$PLUS(Int.of(2))));

        if (n.$LESS(x.length())) {
            Assert.deepEqual(x.at(n), Maybe.Just(toArray(x)[n.content]));
        } else {
            Assert.deepEqual(x.at(n), Maybe.Nothing);
        }
    }))
    .case("forall x: x.map(\i -> i.show()) == toArray(x).map(\i -> i.show())", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(toArray(x.map(i => i.show())), toArray(x).map(i => i.show()));
    }))
;

module.exports = rules;