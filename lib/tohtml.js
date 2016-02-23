var md = require('./parser');

// Convert markdown to HTML
function convertMdToHTML(src) {
    return md.render(src);
}

module.exports = convertMdToHTML;
