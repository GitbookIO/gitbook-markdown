var _ = require('lodash');
var MarkdownIt = require('markdown-it');

// Create instance
var md = new MarkdownIt({
    html: true,
    langPrefix: 'lang-'
});

// Setup plugins
md.use(require('markdown-it-footnote'));


// Parse markdown into a list of tokens
function parse(src) {
    return md.parse(src, {});
}

// Render markdown to HTML
function render(src) {
    return md.render(src);
}

// Render markdown to HTML in inline mode
function renderInline(src) {
    return md.renderInline(src);
}

// Group tokens
function groupTokens(tokens) {
    var current = null;

    return _.reduce(tokens, function(accu, token) {
        var isOpen = _.endsWith(token.type, '_open');
        var isClose = _.endsWith(token.type, '_close');

        if (isOpen) {
            current = {
                type: token.type.slice(0, - '_open'.length),
                inner: []
            };
            current.inner.push(token);
        } else if (isClose && current) {
            current.inner.push(token);
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

// Render a list of tokens to html
function renderTokens(tokens) {
    return md.renderer.render(tokens);
}

// Render a list of tokens to text
function renderTokensText(tokens) {
    return _.reduce(tokens, function(text, token) {
        text = text + token.content;

        return text;
    }, '');
}

module.exports = {
    parse: parse,
    render: render,
    renderInline: renderInline,

    tokens: {
        group: groupTokens,
        render: renderTokens,
        renderToText: renderTokensText
    }
};
