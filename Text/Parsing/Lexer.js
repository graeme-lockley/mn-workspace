const Maybe = mrequire("core:lang.Maybe:v1.0.0");
const Tuple = require("../../Data/Tuple");


function LexerState(configuration, state) {
    this.configuration = configuration;
    this.state = state;
}


LexerState.prototype.token = function () {
    return this.state.token;
};


LexerState.prototype.position = function () {
    return this.state.oldPosition;
};


LexerState.prototype.index = function () {
    return this.state.oldIndex;
};


LexerState.prototype.next = function () {
    if (isEndOfFile(this.state.index)(this.state.input)) {
        return new LexerState(this.configuration, finalState(this.configuration.eof, this.state));
    } else {
        const currentState = skipWhitespace(this.configuration.whitespacePattern)(this.state);
        const mapTokenPattern = tokenPattern =>
            matchRegex(tokenPattern.first, currentState).map(text => advanceState(currentState, text, tokenPattern.second(text)));

        return new LexerState(this.configuration, this.configuration.tokenPatterns.findMap(mapTokenPattern).withDefault(undefined));
    }
};


function isEndOfFile(index) {
    return input => index >= input.length;
}


function skipWhitespace(whitespaceRegex) {
    return state =>
        whitespaceRegex
            ? matchRegex(whitespaceRegex, state).map(text => advanceState(state, text)).withDefault(state)
            : state;
}


function matchRegex(regex, state) {
    regex.lastIndex = state.index;
    const matchedRegex = regex.exec(state.input);
    if (matchedRegex) {
        return Maybe.Just(matchedRegex[0]);
    } else {
        return Maybe.Nothing;
    }
}


function advanceState(currentState, matchedText, matchedToken) {
    const advancedIndex = currentState.index + matchedText.length;
    const advancePositionOnCharacter = position => item =>
        item.charCodeAt(0) === 10
            ? Tuple(1)(position.second + 1)
            : position.mapFirst(x => x + 1);
    const advancedPosition = matchedText.foldl(currentState.position)(advancePositionOnCharacter);

    return {
        input: currentState.input,
        index: advancedIndex,
        position: advancedPosition,
        token: matchedToken,
        oldPosition: currentState.position,
        oldIndex: currentState.index
    };
}


function initialState(input) {
    return {
        input: input,
        position: Tuple(1)(0),
        index: 0
    };
}
assumption(initialState("Hello world").input === "Hello world" && initialState("Hello world").index === 0);


function finalState(eofToken, state) {
    return {
        input: state.input,
        position: state.position,
        index: state.input.length,
        token: eofToken
    };
}


function setup(configuration) {
    return {
        fromString: function (input) {
            return new LexerState(configuration, initialState(input)).next();
        }
    };
}


module.exports = {
    setup
};
