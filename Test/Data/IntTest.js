const Assert = require("assert");
const Generator = require("../Generator");
const Unit = require("../Unit");

const ParityRules = require("./ParityRules");
const NumberRules = require("./NumberRules");
const OrderedRules = require("./OrderedRules");
const IntegerRules = require("./IntegerRules");

const Int = require("../../Data/Int").Int;
const of = Int.of;


const IntGenerator = () => of(Generator.integerInRange(Int.minBound)(Int.maxBound));


Unit.suite("Data.Int", s => s
    .suite("Parity Rules", s =>
        ParityRules(IntGenerator)(s))
    .case("show", () => {
        Assert.equal(of(0).show(), "0");
        Assert.equal(of(100).show(), "100");
        Assert.equal(of(-100).show(), "-100");
    })
    .suite("Ordered Rules", s =>
        OrderedRules(IntGenerator)(s))
    .suite("Number Rules", s =>
        NumberRules(IntGenerator)(s))
    .case("maxBound", () => {
        Assert.deepEqual(of(10).type.maxBound.content, (Math.pow(2, 31) - 1) | 0);
    })
    .case("minBound", () => {
        Assert.deepEqual(of(10).type.minBound.content, -Math.pow(2, 31) | 0);
    })
    .suite("Integer Rules", s =>
        IntegerRules(IntGenerator)(s))
);