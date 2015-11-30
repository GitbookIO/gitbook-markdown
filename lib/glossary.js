var _ = require('lodash');
var markdown = require('./markdown');
var tokensUtil = require('./tokens');

// Get all the pairs of header + paragraph in a list of nodes
function groups(nodes) {
    var current = null;
    var accu = [];

    function pushCurrent() {
        if (!current || current.content.length == 0) return;

        accu.push(current);
        current = null;
    }

    _.each(nodes, function(node, idx) {
        if (node.type == 'heading') {
            pushCurrent();

            current = {
                heading: node.inner,
                content: []
            };
        } else if (current) {
            current.content = current.content.concat(tokensUtil.groupToTokens(node));
        }
    });

    pushCurrent();

    return accu;
}

function parseGlossary(src) {
    var tokens = markdown.parse(src);
    tokens = tokensUtil.group(tokens);

    return groups(tokens)
    .map(function(pair) {
        return {
            name: tokensUtil.toSource(pair.heading),
            description: tokensUtil.toSource(pair.content)
        };
    });
}

function glossaryToMarkdown(glossary) {
    var bl = "\n";

    var body = _.map(glossary, function(entry) {
        return "## "+entry.name+bl+bl+entry.description;
    }).join(bl+bl);

    return "# Glossary"+bl+bl+body;
}

module.exports = parseGlossary;
module.exports.toText = glossaryToMarkdown;
