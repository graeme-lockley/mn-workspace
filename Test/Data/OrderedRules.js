const Assert = require("assert");

const Generator = require("../Generator");

const Ordered = require("../../Data/Ordered");


const rules = gen => s => s
    .case("forall x: x.compare(x) == Ordered.EQ && x <= x && !(x < x) && x >= x && !(x > x) && x == x.min(x) && x == x.max(x)", Generator.forall([gen], ([x]) => {
        Assert.equal(x.compare(x), Ordered.EQ);
        Assert.equal(x.$LESS$EQUAL(x), true);
        Assert.equal(!(x.$LESS(x)), true);
        Assert.equal(x.$GREATER$EQUAL(x), true);
        Assert.equal(!(x.$GREATER(x)), true);
        Assert.equal(x.$EQUAL$EQUAL(x.min(x)), true);
        Assert.equal(x.$EQUAL$EQUAL(x.max(x)), true);
    }))
    .case("forall x, y: x.compare(y) == Ordered.LT => x != y && x <= y && x < y && !(x >= y) && !(x > y) && x == x.min(y) && y == x.max(y)", Generator.forall([gen, gen], ([x, y]) => {
        if (x.compare(y) === Ordered.LT) {
            Assert.equal(x.$NOT$EQUAL(y), true);
            Assert.equal(x.$LESS$EQUAL(y), true);
            Assert.equal(x.$LESS(y), true);
            Assert.equal(!(x.$GREATER$EQUAL(y)), true);
            Assert.equal(!(x.$GREATER(y)), true);
            Assert.equal(x.$EQUAL$EQUAL(x.min(y)), true);
            Assert.equal(y.$EQUAL$EQUAL(x.max(y)), true);
        }
    }))
    .case("forall x, y: x.compare(y) == Ordered.GT => x != y && !(x <= y) && !(x < y) && x >= y && x > y && y == x.min(y) && x == x.max(y)", Generator.forall([gen, gen], ([x, y]) => {
        if (x.compare(y) === Ordered.GT) {
            Assert.equal(x.$NOT$EQUAL(y), true);
            Assert.equal(!(x.$LESS$EQUAL(y)), true);
            Assert.equal(!(x.$LESS(y)), true);
            Assert.equal(x.$GREATER$EQUAL(y), true);
            Assert.equal(x.$GREATER(y), true);
            Assert.equal(y.$EQUAL$EQUAL(x.min(y)), true);
            Assert.equal(x.$EQUAL$EQUAL(x.max(y)), true);
        }
    }))
;

module.exports = rules;