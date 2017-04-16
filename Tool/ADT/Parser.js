/*
 * <start> ::= { <import> } <adt> EOF
 *
 * <import> ::= IMPORT CONSTANT_STRING AS UPPER_ID
 *
 * <adt> ::= TYPE UPPER_ID { LOWER_ID } EQUAL <adt_constructor> { BAR <adt_constructor> }
 *
 * <adt_constructor> ::= UPPER_ID { <type> }
 *
 * <type> ::= UPPER_ID | LPAREN UPPER_ID { UPPER_ID | LOWER_ID } RPAREN
 */

const Array = mrequire("core:Data.Array:v1.0.0");
const Lexer = require("./Lexer");
const C = require("../../Text/Parsing/Combinators");


// Parser a :: Lexer -> Result String (Tuple a Lexer)

const parseType =
    C.or([
        C.symbolMap(Lexer.Tokens.UPPER_ID)(t => Array.singleton(t.value)),
        C.andMap([
            C.symbol(Lexer.Tokens.LPAREN),
            C.symbolMap(Lexer.Tokens.UPPER_ID)(t => t.value),
            C.many(
                C.or([
                    C.symbolMap(Lexer.Tokens.UPPER_ID)(t => t.value),
                    C.symbolMap(Lexer.Tokens.LOWER_ID)(t => t.value)
                ])),
            C.symbol(Lexer.Tokens.RPAREN)
        ])(t => t.at(2).withDefault(Array.empty).cons(t.at(1).withDefault("")))
    ]);


module.exports = {
    parseType
};