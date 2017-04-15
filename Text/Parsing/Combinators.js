const Result = require("../../Data/Result");
const Tuple = mrequire("core:Data.Tuple:v1.0.0");

function symbol(token) {
    return map => lexer => {
        if (lexer.token().id === token) {
            return Result.Okay(Tuple(map(lexer.token()))(lexer.next()));
        } else {
            return Result.Error(Tuple(lexer)(`Expected token ${token}`));
        }
    };
}


module.exports = {
    symbol
};