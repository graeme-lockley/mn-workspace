const Assert = require("assert");
const Generator = require("../Generator");
const Unit = require("../Unit");

const SequenceRules = require("./SequenceRules");

const Int = require("../../Data/Int").Int;
const Stream = require("../../Data/Stream").Stream;


const take = n => s =>
    n.$LESS(Int.of(1))
        ? Stream.Nil
        : s.unapplyCons().reduce(() => Stream.Nil)(([h, t]) => Stream.Cons(h)(() => take(n.$MINUS(Int.of(1)))(t)));


const map = f => s =>
    s.unapplyCons().reduce(() => Stream.Nil)(([h, t]) => Stream.Cons(f(h))(() => map(f)(t)));

const rangeFrom = n => Stream.Cons(n)(() => rangeFrom(n.$PLUS(Int.of(1))));

const StreamLengthGenerator = () => Int.of(Generator.integerInRange(Int.of(0))(Int.of(100)));
const IntGenerator = () => Int.of(Generator.integerInRange(Int.minBound)(Int.maxBound));
const StreamGenerator = () => take(StreamLengthGenerator())(rangeFrom(IntGenerator()));


Unit.suite("Data.Stream", s => s
    .case("Stream of 1s", () => {
        console.log(StreamGenerator().show());

        const streamOfOnes = Stream.Cons(Int.of(1))(() => streamOfOnes);
        const range = n => m => Stream.Cons(n)(() => n.$LESS(m) ? range(n.$PLUS(Int.of(1)))(m) : Stream.Nil);
        const fib = n => m => Stream.Cons(n)(() => fib(m)(n.$PLUS(m)));

        console.log(map(n => n.$STAR(Int.of(2)))(range(Int.of(1))(Int.of(100))).show());
        console.log(take(Int.of(20))(fib(Int.of(1))(Int.of(1))).show());
    })
    .suite("Data.Sequence", s =>
        SequenceRules(StreamGenerator)(s))
);