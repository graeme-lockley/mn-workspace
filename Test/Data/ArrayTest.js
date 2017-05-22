const Assert = require("assert");
const Generator = require("../Generator");
const Unit = require("../Unit");

const Collection = require("../../Data/Collection");
const CollectionRules = require("./CollectionRules");
const Int = require("../../Data/Int").Int;
const Maybe = require("../../Data/Maybe");
const OrderedRules = require("./OrderedRules");
const ParityRules = require("./ParityRules");
const SequenceRules = require("./SequenceRules");
const Array = require("../../Data/Array").Array;


const mkList = gen => n => {
    let result = [];
    let lp = 0;
    while (lp < n) {
        result.push(gen());
        lp += 1;
    }
    return Array.of(result);
};


const IntGenerator = () => Int.of(Generator.integerInRange(Int.minBound)(Int.maxBound));
const ArrayGenerator = () => mkList(IntGenerator)(Generator.integerInRange(Int.of(0))(Int.of(20)));


Unit.suite("Data.Array", s => s
        .suite("Data.Parity Rules", s =>
            ParityRules(ArrayGenerator)(s))
        // .case("show", Generator.forall([StringGenerator], ([s]) => {
        //     const replaceQuote = NativeString.replaceAll("\"")("\\\"");
        //     const replaceBackslash = NativeString.replaceAll("\\")("\\\\");
        //
        //     Assert.equal(s.show(), '"' + replaceQuote(replaceBackslash(s.content)) + '"');
        // }))
        .suite("Data.Collection Rules", s =>
            CollectionRules(ArrayGenerator)(s))
        .suite("Data.Sequence Rules", s =>
            SequenceRules(ArrayGenerator)(s))
    //
    // .case("unapplyCons", Generator.forall([NonEmptyStringGenerator], ([s]) => {
    //     Assert.deepEqual(
    //         s.unapplyCons(),
    //         Maybe.Just([s.at(Int.of(0)).withDefault(Char.minBound), String.of(NativeString.substringFrom(1)(s.content))])
    //     );
    // }))
    // .case("at", () => {
    //     Assert.deepEqual(String.of("Hello").at(Int.of(0)), Char.ofNativeString("H"));
    //     Assert.deepEqual(String.of("Hello").at(Int.of(-1)), Maybe.Nothing);
    // })
    // .case("length", () => {
    //     Assert.deepEqual(String.of("").length(), Int.of(0));
    //     Assert.deepEqual(String.of("Hello").length(), Int.of(5));
    // })
    // .case("endsWith", () => {
    //     Assert.equal(String.of("Hello").endsWith(String.of("llo")), true);
    //     Assert.equal(String.of("Hello").endsWith(String.of("ll")), false);
    // })
);
