import { getNewCanvas } from '../../utils'

class Text {
    constructor(text, {
        font, color, textAlign, textBaseline,
        maxWidth,
        outline, lineWidth, lineHeight,
    }){
// public properties:
		/**
		 * The text to display.
		 * @property text
		 * @type String
		 **/
		this.text = text;

		/**
		 * The font style to use. Any valid value for the CSS font attribute is acceptable (ex. "bold 36px Arial").
		 * @property font
		 * @type String
		 **/
		this.font = font;

		/**
		 * The color to draw the text in. Any valid value for the CSS color attribute is acceptable (ex. "#F00"). Default is "#000".
		 * It will also accept valid canvas fillStyle values.
		 * @property color
		 * @type String
		 **/
		this.color = color;

		/**
		 * The horizontal text alignment. Any of "start", "end", "left", "right", and "center". For detailed
		 * information view the
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>. Default is "left".
		 * @property textAlign
		 * @type String
		 **/
		this.textAlign = textAlign || "left";

		/**
		 * The vertical alignment point on the font. Any of "top", "hanging", "middle", "alphabetic", "ideographic", or
		 * "bottom". For detailed information view the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>. Default is "top".
		 * @property textBaseline
		 * @type String
		*/
		this.textBaseline = textBaseline || "top";

		/**
		 * The maximum width to draw the text. If maxWidth is specified (not null), the text will be condensed or
		 * shrunk to make it fit in this width. For detailed information view the
		 * <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#text-styles">
		 * whatwg spec</a>.
		 * @property maxWidth
		 * @type Number
		*/
		this.maxWidth = maxWidth;

		/**
		 * If greater than 0, the text will be drawn as a stroke (outline) of the specified width.
		 * @property outline
		 * @type Number
		 **/
		this.outline = outline || 0;

		/**
		 * Indicates the line height (vertical distance between baselines) for multi-line text. If null or 0,
		 * the value of getMeasuredLineHeight is used.
		 * @property lineHeight
		 * @type Number
		 **/
		this.lineHeight = lineHeight || 0;

		/**
		 * Indicates the maximum width for a line of text before it is wrapped to multiple lines. If null,
		 * the text will not be wrapped.
		 * @property lineWidth
		 * @type Number
		 **/
		this.lineWidth = lineWidth || null;
    }
    isVisible () {
		var hasContent = this.cacheCanvas || (this.text != null && this.text !== "");
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
    }
    exec (ctx) {
		var col = this.color || "#000";
		if (this.outline) { ctx.strokeStyle = col; ctx.lineWidth = this.outline*1; }
		else { ctx.fillStyle = col; }
		this._drawText(this._prepContext(ctx));
		return true;
    }
    getMeasuredLineHeight () {
		return this._getMeasuredWidth("M")*1.2;
    }
    _getMeasuredWidth (text) {
		var ctx = Text._workingContext;
		ctx.save();
		var w = this._prepContext(ctx).measureText(text).width;
		ctx.restore();
		return w;
	}
    _prepContext (ctx) {
		ctx.font = this.font||"10px sans-serif";
		ctx.textAlign = this.textAlign||"left";
		ctx.textBaseline = this.textBaseline||"top";
		ctx.lineJoin = "miter";
		ctx.miterLimit = 2.5;
		return ctx;
    }
    _drawText (ctx, o, lines) {
		var paint = !!ctx;
		if (!paint) {
			ctx = Text._workingContext;
			ctx.save();
			this._prepContext(ctx);
		}
		var lineHeight = this.lineHeight||this.getMeasuredLineHeight();

		var maxW = 0, count = 0;
		var hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
		for (var i=0, l=hardLines.length; i<l; i++) {
			var str = hardLines[i];
			var w = null;

			if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
				// text wrapping:
				var words = str.split(/(\s)/);
				str = words[0];
				w = ctx.measureText(str).width;

				for (var j=1, jl=words.length; j<jl; j+=2) {
					// Line needs to wrap:
					var wordW = ctx.measureText(words[j] + words[j+1]).width;
					if (w + wordW > this.lineWidth) {
						if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
						if (lines) { lines.push(str); }
						if (w > maxW) { maxW = w; }
						str = words[j+1];
						w = ctx.measureText(str).width;
						count++;
					} else {
						str += words[j] + words[j+1];
						w += wordW;
					}
				}
			}

			if (paint) { this._drawTextLine(ctx, str, count*lineHeight); }
			if (lines) { lines.push(str); }
			if (o && w == null) { w = ctx.measureText(str).width; }
			if (w > maxW) { maxW = w; }
			count++;
		}

		if (o) {
			o.width = maxW;
			o.height = count*lineHeight;
		}
		if (!paint) { ctx.restore(); }
		return o;
    }
    _drawTextLine (ctx, text, y) {
		// Chrome 17 will fail to draw the text if the last param is included but null, so we feed it a large value instead:
		if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth||0xFFFF); }
		else { ctx.fillText(text, 0, y, this.maxWidth||0xFFFF); }
	}

}
Text.H_OFFSETS = {start: 0, left: 0, center: -0.5, end: -1, right: -1};
Text.V_OFFSETS = {top: 0, hanging: -0.01, middle: -0.4, alphabetic: -0.8, ideographic: -0.85, bottom: -1};
const {
    canvas, ctx
} = getNewCanvas()
Text._workingContext = ctx;
canvas.width = canvas.height = 1;

export default Text;