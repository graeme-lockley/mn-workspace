const Assert = require("assert");
const Unit = mrequire("core:Test.Unit:v1.0.0");

const Lexer = require("../Tool/ADT/Lexer");
const Parser = require("../Tool/ADT/Parser");
const Result = require("../Data/Result");


Unit.newSuite("Parser Suite - parseType")
    .case("given 'Integer' should return ['Integer']", () => {
        Assert.deepEqual(astResult(Parser.parseType(Lexer.fromString("Integer"))), ["Integer"]);
    })
;


function astResult(value) {
    return value.map(okay => okay.first)(error => Assert.fail(`${value.toString()} expected to be okay`));
}