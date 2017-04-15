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

const Lexer = require("./Lexer");
const C = require("../../Text/Parsing/Combinators");


// Parser a :: Lexer -> Result String (Tuple a Lexer)

const parseType = C.symbol(Lexer.Tokens.UPPER_ID)(t => [t.value]);


module.exports = {
    parseType
};