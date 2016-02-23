var markdownIt = require('markdown-it');
var markdownFootnote = require('markdown-it-footnote');
var markdownLazyHeader = require('markdown-it-lazy-headers');
var markdownAttrs = require('markdown-it-attrs');

var md = markdownIt({
    langPrefix: 'lang-'
});

// Enable plugins
md.use(markdownFootnote);
md.use(markdownLazyHeader);
md.use(markdownAttrs);

module.exports = md;
