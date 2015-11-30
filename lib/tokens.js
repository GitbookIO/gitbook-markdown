var _ = require('lodash');
var markdown = require('./markdown');

// Return true if token is an opening token
function isOpening(token) {
    return _.endsWith(token.type, '_open');
}

// Return false if token is a closing token
function isClosing(token) {
    return _.endsWith(token.type, '_close');
}

// Return true if is inline token
function isInline(token) {
    return token.type == 'inline';
}


// Group tokens
function groupTokens(tokens) {
    var current = null;

    return _.reduce(tokens, function(accu, token) {
        var isOpen = isOpening(token);
        var isClose = isClosing(token);

        if (isOpen) {
            current = {
                type: token.type.slice(0, - '_open'.length),
                inner: [],
                open: token,
                close: null
            };
        } else if (isClose && current) {
            current.close = token;
            accu.push(current);
            current = null;
        } else if(current) {
            current.inner.push(token);
        } else {
            accu.push(token);
        }

        return accu;
    }, []);
}

// Convert a group to a list of tokens
function groupToTokens(group) {
    return _.compact(
        [group.open]
        .concat(group.inner)
        .concat([group.close])
    );
}

// Render a list of tokens to html
function renderTokens(tokens) {
    return markdown.renderer.render(tokens);
}

// Render a list of tokens to text
function renderTokensText(tokens) {
    return _.reduce(tokens, function(text, token) {
        if (isInline(token)) {
            return (text + renderTokensText(token.children));
        } else if (isOpening(token) || isClosing(token)) {
            return text;
        }

        text = text + token.content;
        return text;
    }, '');
}

// Render a list of tokens to source
function renderTokensSource(tokens) {
    return _.reduce(tokens, function(text, token) {
        text = text + token.content;

        return text;
    }, '');
}

module.exports = {
    group: groupTokens,
    groupToTokens: groupToTokens,

    toHTML: renderTokens,
    toText: renderTokensText,
    toSource: renderTokensSource
};
