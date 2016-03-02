var _ = require('lodash');
var md = require('./parser');

var RAW_START = '{% raw %}';
var RAW_END = '{% endraw %}';


// Apply a transformation on a markdown string
// Since ot all tokens have a "position" and "size"
function annotate(src, fn) {
    var nsrc = '' + src;
    var ctx = {};

    fn = fn.bind(ctx);

    // Parse markdown
    var tokens = md.parse(src, {});

    // Do some annotations on "tokens"
    var changes = annotateTokens(tokens, src, fn);

    // Apply changes
    var diff = 0;
    return _.reduce(changes, function(nsrc, change) {
        var result;

        var before = nsrc.slice(0, change.position + diff);
        var after = nsrc.slice(change.position + diff + change.origin.length);

        // Add sring before and new token
        result = before;
        result += change.s;

        // Calcul new difference for next changes
        diff += (change.s.length - change.origin.length);

        // Add part after
        result += after;

        return result;
    }, src);
}

// Apply a transformation on a list of tokens recursively
function annotateTokens(tokens, src, fn) {
    return _.reduce(tokens, function(changes, token) {
        if (token.children) {
            changes = changes.concat(annotateTokens(token.children, src, fn));
        }

        var origin = src.slice(token.position, token.position + token.size);
        var s = fn(token, origin);

        if (_.isString(s)) {
            changes.push({
                origin: origin,
                s: s,
                position: token.position,
                size: token.size
            });
        }

        return changes;
    }, []);
}

// Escape for templating syntax
function escape(str) {
    return RAW_START + str + RAW_END;
}

// Add templating "raw" to code blocks
// Only if not already in a raw tags
function preparePage(src) {
    return annotate(src, function(token, raw) {
        if (token.type == 'template_expr_inline') {
            this.rawLevel = this.rawLevel || 0;

            if (token.info == 'raw') {
                this.rawLevel ++;
            } else if (token.info == 'endraw') {
                this.rawLevel = 0;
            }
        }

        if (this.rawLevel > 0) return;

        if (token.type == 'code_inline') {
            return escape(raw);
        } else if (token.type == 'code_block') {
            return escape(raw);
        } else if (token.type == 'fence') {
            return escape(raw);
        }

        return;
    });
}

module.exports = {
    prepare: preparePage
};
