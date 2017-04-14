const Test = require("./../../Unit");

const Array = require("../../../Data/Array");
const Int = require("../../../Data/Int");
const Maybe = mrequire("core:Data.Maybe:v1.0.0");
const Regex = require("../../../Data/String/Regex");
const Tuple = require("../../../Data/Tuple");

const Assert = require("assert");

const Lexer = require("../../../Text/Parsing/Lexer");


const lexerDefinition = Lexer.setup({
        eof: {id: 0, value: ""},
        err: text => ({id: -1, value: text}),
        whitespacePattern: Maybe.Just(Regex.from(/\s+/iy)),
        tokenPatterns: Array.from([
            Tuple(Regex.from(/[0-9]+/iy))(text => ({id: 1, value: Int.fromString(text).withDefault(0)})),
            Tuple(Regex.from(/[A-Za-z_][A-Za-z0-9_]*/iy))(text => ({id: 2, value: text}))
        ]),
        comments: Array.from([
            {open: Regex.from(/\/\//my), close: Regex.from(/\n/my), nested: false}
        ])
    })
;

Test.newSuite("Lexer Suite")
    .case("given an empty lexer should be at EOF", () => {
        const lexer = lexerDefinition.fromString("");

        assertLexerState(
            lexer,
            0, "", Tuple(1)(1), 0);
    })

    .case("given a lexer with a defined token should return that token", () => {
        const lexer = lexerDefinition.fromString("2912 hello");

        assertLexerState(
            lexer,
            1, 2912, Tuple(1)(1), 0);
    })

    .case("given a lexer with a defined token should return that token and the next token whilst skipping whitespace", () => {
        const lexer = lexerDefinition.fromString("2912 hello");

        assertLexerState(
            lexer,
            1, 2912, Tuple(1)(1), 0);

        assertLexerState(
            lexer.next(),
            2, "hello", Tuple(6)(1), 5);
    })

    .case("given a lexer with a character that the lexer does not recognise then the error token is returned and the lexer is advanced onto the next character", () => {
        const lexer = lexerDefinition.fromString("2912*hello");

        assertLexerState(
            lexer,
            1, 2912, Tuple(1)(1), 0);

        assertLexerState(
            lexer.next(),
            -1, "*", Tuple(5)(1), 4);

        assertLexerState(
            lexer.next().next(),
            2, "hello", Tuple(6)(1), 5);
    })

    .case("given a lexer with an input of only whitespace", () => {
        const lexer = lexerDefinition.fromString("   ");

        assertLexerState(
            lexer,
            0, "", Tuple(4)(1), 3);
    })

    .case("given a lexer with input contain non-nested comments should ignore the comments", () => {
        const lexer = lexerDefinition.fromString("123\n// some comments\nabc");

        assertLexerState(
            lexer,
            1, 123, Tuple(1)(1), 0);

        assertLexerState(
            lexer.next(),
            2, "abc", Tuple(1)(3), 21);
    });


function assertLexerState(lexer, id, value, position, index) {
    Assert.equal(lexer.token().id, id);
    Assert.equal(lexer.token().value, value);
    Assert.deepEqual(lexer.position(), position);
    Assert.equal(lexer.index(), index);
}
