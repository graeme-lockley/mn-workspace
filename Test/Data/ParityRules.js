const Assert = require("assert");

const Generator = require("../Generator");
const Unit = require("../Unit");

const rules = gen => s => s
    .case("forall x: x == x && !(x != x)", Generator.forall([gen], ([x]) => {
        Assert.equal(x.$EQUAL$EQUAL(x), true);
        Assert.equal(!(x.$NOT$EQUAL(x)), true);
    }))
    .case("forall x, y: x == y => !(x != y) || !(x == y) => x != y ", Generator.forall([gen, gen], ([x, y]) => {
        Assert.equal(x.$EQUAL$EQUAL(y) && !(x.$NOT$EQUAL(y)) || x.$NOT$EQUAL(y), true);
        Assert.equal(!(x.$EQUAL$EQUAL(y)) && x.$NOT$EQUAL(y) || x.$EQUAL$EQUAL(y), true);
    }));

module.exports = rules;