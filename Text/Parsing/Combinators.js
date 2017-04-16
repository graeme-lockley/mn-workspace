const Array = mrequire("core:Data.Array:v1.0.0");
const Result = require("../../Data/Result");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");


const identity = x => x;

const constant = c => _ => c;


function map(f) {
    return result => {
        return result.map(p =>
            Tuple(f(p.first))(p.second))
    }
}


function and(parsers) {
    return lexer => {
        let result = Result.Okay(Tuple(Array.empty)(lexer));

        for (let lp = 0; lp < parsers.length; lp += 1) {
            const parser = parsers[lp];
            result = result.andThen(tuple => {
                    const parserResult = parser(tuple.second);
                    return map(content => tuple.first.append(content))(parserResult);
                }
            );
        }

        return result;
    };
}


function andMap(parsers) {
    return f => lexer => {
        return map(f)(and(parsers)(lexer));
    }
}


function or(parsers) {
    return lexer => {
        for (lp = 0; lp < parsers.length; lp += 1) {
            const result = parsers[lp](lexer);

            if (result.isOkay()) {
                return result;
            }
        }

        return Result.Error(Tuple(lexer)("OR failed"));
    };
}


function symbolMap(token) {
    return map => lexer => {
        if (lexer.token().id === token) {
            return Result.Okay(Tuple(map(lexer.token()))(lexer.next()));
        } else {
            return Result.Error(Tuple(lexer)(`Expected token ${token}`));
        }
    };
}


const symbol = token => symbolMap(token)(identity);


function many(parser) {
    return lexer => {
        let current = Result.Okay(Tuple(Array.empty)(lexer));

        while(true) {
            let next = current.andThen(t => map(result => t.first.append(result))(parser(t.second)));

            if (next.isOkay()) {
                current = next;
            } else {
                return current;
            }
        }
    };
}

module.exports = {
    and,
    andMap,
    many,
    or,
    symbol,
    symbolMap
};