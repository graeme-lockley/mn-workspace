const Assert = require("assert");
const Generator = require("../Generator");
const Unit = require("../Unit");

const ParityRules = require("./ParityRules");

const Char = require("../../Data/Char").Char;

const CharGenerator = () => Char.of(Generator.integerInRange(Char.minBound)(Char.maxBound));


Unit.suite("Data.Char", s => s
    .case("ofNativeString", () => {
        Assert.equal(Char.of(65).$EQUAL$EQUAL(Char.ofNativeString("A").withDefault(Char.of(0))), true);
    })
    .suite("Visibility", s => s
        .case("show", () => {
            Assert.equal(Char.of(65).show(), 'A');
        })
    )
    .suite("Parity Rules", s =>
        ParityRules(CharGenerator)(s))
);