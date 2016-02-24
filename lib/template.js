var TPL_EXPR = /^{%\s*(.*?)\s*(?=%})%}/;
var TPL_VAR = /^{{\s*(.*?)\s*(?=}})}}/;

module.exports = function(md) {
    function template_expr_inline(state, silent) {
        var pos = state.pos,
            src = state.src.slice(pos);

        var match = src.match(TPL_EXPR);
        if (!match) {
            return false;
        }

        pos = pos + match.index;
        var type = match[1];

        token = state.push('template_expr_inline', 'pre', 0);
        token.markup = match[0];
        token.info = type;
        token.position = pos;
        token.size = match[0].length;

        state.pos = token.position + token.size;
        return true;
    }

    md.inline.ruler.after('image', 'template_expr_inline', template_expr_inline);
};

