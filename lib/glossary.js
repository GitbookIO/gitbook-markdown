var _ = require('lodash');
var markdown = require('./markdown');

// Get all the pairs of header + paragraph in a list of nodes
function groups(nodes) {
    // A list of next nodes
    var next = nodes.slice(1).concat(null);

    return _.reduce(nodes, function(accu, node, idx) {
        // Skip
        if(!(
            node.type === 'heading' &&
            (next[idx] && next[idx].type === 'paragraph')
        )) {
            return accu;
        }

        // Add group
        accu.push([
            node,
            next[idx]
        ]);

        return accu;
    }, []);
}

function parseGlossary(src) {
    var tokens = markdown.parse(src);
    tokens = markdown.tokens.group(tokens);

    return groups(tokens)
    .map(function(pair) {
        var name = pair[0].inner;
        var description = pair[1].inner;

        return {
            name: markdown.tokens.renderToText(name),
            description: markdown.tokens.renderToText(description),
            html: {
                name: markdown.tokens.render(name),
                description: markdown.tokens.render(description)
            }
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
