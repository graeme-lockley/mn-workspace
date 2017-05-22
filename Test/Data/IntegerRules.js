const Assert = require("assert");

const Generator = require("../Generator");


const rules = gen => s => s
    .case("forall x, y: y != 0 => x = y * (x / y) + x mod y", Generator.forall([gen, gen], ([x, y]) => {
        if (x.$NOT$EQUAL(x.type.zero)) {
            Assert.deepEqual(x, y.$STAR(x.$SLASH(y).withDefault(x.type.identity)).$PLUS(x.mod(y).withDefault(x.type.identity)));
        }
    }))
    .case("forall x, y: y != 0 => (d, m) = x.divMod(y) && x = y * d + m", Generator.forall([gen, gen], ([x, y]) => {
        if (x.$NOT$EQUAL(x.type.zero)) {
            const [d, m] = x.divMod(y).withDefault();

            Assert.deepEqual(x, y.$STAR(d).$PLUS(m));
        }
    }))
;

module.exports = rules;