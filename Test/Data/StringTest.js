const Assert = require("assert");
const Generator = require("../Generator");
const Unit = require("../Unit");

const Char = require("../../Data/Char").Char;
const Collection = require("../../Data/Collection");
const CollectionRules = require("./CollectionRules");
const Int = require("../../Data/Int").Int;
const Maybe = require("../../Data/Maybe");
const NativeString = require("../../Native/Data/String");
const OrderedRules = require("./OrderedRules");
const ParityRules = require("./ParityRules");
const SequenceRules = require("./SequenceRules");
const String = require("../../Data/String").String;


const mkString = gen => n => {
    let result = "";
    let lp = 0;
    while (lp < n) {
        result += gen().show();
        lp += 1;
    }
    return String.of(result);
};


const CharGenerator = () => Char.of(Generator.integerInRange(Int.of(32))(Int.of(255)));
const StringGenerator = () => mkString(CharGenerator)(Generator.integerInRange(Int.of(0))(Int.of(20)));
const NonEmptyStringGenerator = () => mkString(CharGenerator)(Generator.integerInRange(Int.of(1))(Int.of(20)));


Unit.suite("Data.String", s => s
    .suite("Data.Parity Rules", s =>
        ParityRules(StringGenerator)(s))
    .suite("Data.Ordered Rules", s =>
        OrderedRules(StringGenerator)(s))
    .case("show", Generator.forall([StringGenerator], ([s]) => {
        const replaceQuote = NativeString.replaceAll("\"")("\\\"");
        const replaceBackslash = NativeString.replaceAll("\\")("\\\\");

        Assert.equal(s.show(), '"' + replaceQuote(replaceBackslash(s.content)) + '"');
    }))
    .suite("Data.Collection Rules", s =>
        CollectionRules(StringGenerator)(s))
    .suite("Data.Sequence Rules", s =>
        SequenceRules(StringGenerator)(s))

    .case("unapplyCons", Generator.forall([NonEmptyStringGenerator], ([s]) => {
        Assert.deepEqual(
            s.unapplyCons(),
            Maybe.Just([s.at(Int.of(0)).withDefault(Char.minBound), String.of(NativeString.substringFrom(1)(s.content))])
        );
    }))
    .case("endsWith", () => {
        Assert.equal(String.of("Hello").endsWith(String.of("llo")), true);
        Assert.equal(String.of("Hello").endsWith(String.of("ll")), false);
    })
);
