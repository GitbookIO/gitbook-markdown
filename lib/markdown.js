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


module.exports = {
    parse: parse,
    render: render,
    renderInline: renderInline,
    renderer: md.renderer
};
