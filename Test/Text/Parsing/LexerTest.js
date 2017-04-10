const Test = require("./../../Unit");

const Int = require("../../../Data/Int");
const Tuple = require("../../../Data/Tuple");

const Assert = require("assert");

const Lexer = require("../../../Text/Parsing/Lexer");


Test.newSuite("Lexer Suite")
    .case("given an empty lexer should be at EOF", () => {
        const lexerDefinition = Lexer.setup({
            eof: {id: 0}
        });

        Assert.equal(lexerDefinition.fromString("").token().id, 0);
    })

    .case("given a lexer with a defined token should return that token", () => {
        const lexerDefinition = Lexer.setup({
            eof: {id: 0},
            tokenPatterns: [
                Tuple(/[0-9]+/iy)(text => ({id: 1, value: Int.fromString(text).withDefault(0)}))
            ].toArray()
        });
        const lexer = lexerDefinition.fromString("2912 hello");

        Assert.equal(lexer.token().id, 1);
        Assert.equal(lexer.token().value, 2912);
        Assert.deepEqual(lexer.position(), Tuple(1)(0));
        Assert.equal(lexer.index(), 0);
    })

    .case("given a lexer with a defined token should return that token and the next token whilst skipping whitespace", () => {
        const lexerDefinition = Lexer.setup({
            eof: {id: 0},
            whitespacePattern: /\s*/iy,
            tokenPatterns: [
                Tuple(/[0-9]+/iy)(text => ({id: 1, value: Int.fromString(text).withDefault(0)})),
                Tuple(/[A-Za-z_][A-Za-z0-9_]*/iy)(text => ({id: 2, value: text}))
            ].toArray()
        });
        const lexer = lexerDefinition.fromString("2912 hello");

        Assert.equal(lexer.token().id, 1);
        Assert.equal(lexer.token().value, 2912);
        Assert.deepEqual(lexer.position(), Tuple(1)(0));
        Assert.equal(lexer.index(), 0);

        const nextLexer = lexer.next();

        Assert.equal(nextLexer.token().id, 2);
        Assert.equal(nextLexer.token().value, "hello");
        Assert.deepEqual(nextLexer.position(), Tuple(6)(0));
        Assert.equal(nextLexer.index(), 5);
    });
