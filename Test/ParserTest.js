const Assert = require("assert");
const Unit = mrequire("core:Test.Unit:v1.0.0");

const Array = mrequire("core:Data.Array:v1.0.0");

const Lexer = require("../Tool/ADT/Lexer");
const Parser = require("../Tool/ADT/Parser");
const Result = require("../Data/Result");


Unit.newSuite("Parser Suite - parseType")
    .case("given 'Integer' should return ['Integer']", () => {
        Assert.deepEqual(astResult(Parser.parseType(Lexer.fromString("Integer"))), Array.from(["Integer"]));
    })
    .case("given '(Maybe String)' should return ['Maybe', 'String']", () => {
        Assert.deepEqual(astResult(Parser.parseType(Lexer.fromString("(Maybe String)"))), Array.from(["Maybe", "String"]));
    })
;


function astResult(value) {
    return value.reduce(okay => okay.first)(error => Assert.fail(`${error.first.position()}: ${error.second}`));
}