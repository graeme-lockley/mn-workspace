const Assert = require("assert");

const Int = require("../../Data/Int").Int;
const Maybe = require("../../Data/Maybe");

const Generator = require("../Generator");


const rules = gen => s => s
    .case("forall x: x.~Nil().isJust() && x.~Cons.isNothing() || x.~Nil().isNothing() && x.~Con().isJust()", Generator.forall([gen], ([x]) => {
        Assert.equal(
            x.unapplyNil().isJust() && x.unapplyCons().isNothing() ||
            x.unapplyNil().isNothing() && x.unapplyCons().isJust(),
            true);
    }))
    .case("forall x: x.~Nil().isJust() && x.reduce (() => true) (\\h \\t -> false) || x.~Nil().isNothing() && x.reduce (() => false) (\\h \\t -> true)", Generator.forall([gen], ([x]) => {
        Assert.equal(
            x.unapplyNil().isJust() && x.reduce(() => true)(y => ys => false) ||
            x.unapplyNil().isNothing() && x.reduce(() => false)(y => ys => true),
            true);
    }))
    .case("forall x: x.~Nil().isJust() || x.~Nil().isNothing() && x.reduce (() => Nothing) (\y \ys -> Just y) == x.~Cons().map(\\(a, b) -> a)", Generator.forall([gen], ([x]) => {
        Assert.equal(
            x.unapplyNil().isJust() ||
            x.unapplyNil().isNothing() && x.reduce(() => Maybe.Nothing)(y => ys => Maybe.Just(y)).$EQUAL$EQUAL(x.unapplyCons().map(([a, b]) => a)),
            true);
    }))
;

module.exports = rules;