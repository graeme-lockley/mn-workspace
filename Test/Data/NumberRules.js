const Assert = require("assert");

const Generator = require("../Generator");


const rules = gen => s => s
    .case("Commutative Addition: forall x, y: x + y == y + x", Generator.forall([gen, gen], ([x, y]) => {
        Assert.deepEqual(x.$PLUS(y), y.$PLUS(x));
    }))
    .case("Associative Addition: forall x, y, z: (x + y) + z == x + (y + z)", Generator.forall([gen, gen, gen], ([x, y, z]) => {
        Assert.deepEqual(x.$PLUS(y).$PLUS(z), x.$PLUS(y.$PLUS(z)));
    }))
    .case("Identity Addition: forall x: x + 0 == 0 + x == x", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.$PLUS(x.type.zero), x.type.zero.$PLUS(x));
        Assert.deepEqual(x.$PLUS(x.type.zero), x);
    }))
    .case("Anti-commutative Subtraction: forall x, y: x - y == -(y - x)", Generator.forall([gen, gen], ([x, y]) => {
        Assert.deepEqual(x.$MINUS(y), y.$MINUS(x).negate());
    }))
    .case("Identity Subtraction: forall x: x - 0 == x", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.$MINUS(x.type.zero), x);
    }))
    .case("Commutative Multiplication: forall x, y: x * y == y * x", Generator.forall([gen, gen], ([x, y]) => {
        Assert.deepEqual(x.$STAR(y), y.$STAR(x));
    }))
    .case("Identity Multiplication: forall x: x * 1 = x", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.$STAR(x.type.identity), x);
    }))
    .case("Zero Multiplication: forall x: x * 0 = 0", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.$STAR(x.type.zero), x.type.zero);
    }))
    .case("forall x: x * 0 = 0", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.$STAR(x.type.zero), x.type.zero);
    }))
    .case("forall x: x.signum() * x == x.abs()", Generator.forall([gen], ([x]) => {
        Assert.deepEqual(x.signum().$STAR(x), x.abs());
    }))
;

module.exports = rules;