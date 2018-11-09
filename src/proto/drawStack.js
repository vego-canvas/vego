const noop = () => {};  // eslint-disable-line

export default {
    methods: {
        _preUpdate: noop,
        _afterUpdate: noop,
        _updateContext(ctx) {
            const children = this.$children;
            const l = children.length;
            if (l === 0) {
                if (this._renderCtx) {
                    this.$options.draw.call(this._renderCtx, ctx);
                    return;
                }
                this.$options.draw && this.$options.draw.call(this, ctx);
            } else {
                this._preUpdate(ctx);
                for (let i = 0; i < l; i++) {
                    const child = children[i];
                    child._updateContext(ctx);
                }
                this._afterUpdate(ctx);
            }
        },
    },
};
