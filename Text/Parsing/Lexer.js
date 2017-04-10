const Maybe = mrequire("core:lang.Maybe:v1.0.0");
const Tuple = require("../../Data/Tuple");


function TokenState(configuration, state) {
    this.configuration = configuration;
    this.state = state;
}


TokenState.prototype.token = function () {
    return this.state.token;
};


TokenState.prototype.position = function () {
    return this.state.oldPosition;
};


TokenState.prototype.index = function () {
    return this.state.oldIndex;
};


TokenState.prototype.next = function () {
    if (isEndOfFile(this.state.index, this.state.input)) {
        return new TokenState(this.configuration, finalState(this.configuration.eof, this.state));
    } else {
        const currentState = skipWhitespace(this.configuration.whitespacePattern, this.state);

        for (const tokenPatternIndex in this.configuration.tokenPatterns) {
            const tokenPattern = this.configuration.tokenPatterns[tokenPatternIndex];
            tokenPattern.first.lastIndex = currentState.index;
            const regexResult = tokenPattern.first.exec(currentState.input);

            if (regexResult) {
                return new TokenState(this.configuration, advanceState(currentState, regexResult[0], tokenPattern.second(regexResult[0])));
            }
        }

        return this.configuration.error;
    }
};


function isEndOfFile(index, input) {
    return index >= input.length;
}


function skipWhitespace(whitespaceRegex, state) {
    if (whitespaceRegex) {
        return matchRegex(whitespaceRegex, state).map(text => advanceState(state, text)).withDefault(state);
    } else {
        return state;
    }
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
            ? Tuple(1, position.second + 1)
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
        position: Tuple(1, 0),
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
            return new TokenState(configuration, initialState(input)).next();
        }
    };
}


module.exports = {
    setup
};