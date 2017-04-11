const Maybe = mrequire("core:lang.Maybe:v1.0.0");
const Tuple = require("../../Data/Tuple");


function LexerState(configuration, state) {
    this.configuration = configuration;
    this.state = state;
}


function mkRunningState(input, index, position, token, oldPosition, oldIndex) {
    return {
        input: input,
        index: index,
        position: position,
        token: token,
        oldPosition: oldPosition,
        oldIndex: oldIndex
    };
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
        return new LexerState(this.configuration, finalState(this.configuration, this.state));
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

    return mkRunningState(
        currentState.input,
        advancedIndex,
        advancedPosition,
        matchedToken,
        currentState.position,
        currentState.index);
}


function initialState(configuration, input) {
    return mkRunningState(
        input,
        0,
        Tuple(1)(0),
        configuration.eof,
        Tuple(1)(0),
        0);
}


function finalState(configuration, state) {
    return mkRunningState (
        state.input,
        state.input.length,
        state.position,
        configuration.eof,
        state.oldPosition,
        state.oldIndex
    );
}


function setup(configuration) {
    return {
        fromString: function (input) {
            return new LexerState(configuration, initialState(configuration, input)).next();
        }
    };
}


module.exports = {
    setup
};
