import Render from './core/render.js';

const cachedCanvas = null;
const noop = () => {};
const plugin = {
	install(Vue, options){
		Vue.mixin({
			mounted(){
				if(this.$options.renderCanvas){
					this.$watch(this._updateCanvas, noop)
				}
			},

			methods: {
				_updateCanvas(){
					let vnode = this.$options.renderCanvas.call(this._renderProxy, this.$createElement)
					
					this._paint(vnode);
					
					//console.log(vnode);
					return vnode;
				},
				_paint(vnode){
					const vm = this.$parent;
					const el = vm.$el;
					//console.log(this.$parent.$el);

					if(el.getContext){
						const ctx = el.getContext('2d');
						const {
							width,
							height
						} = vm.$props

						ctx.clearRect(0, 0, width, height);
					
						Render(ctx, vnode);
					}
				}
			},
			render(){
				if(this.$options.renderCanvas) return;
			}
		})
	}
}

export default plugin;