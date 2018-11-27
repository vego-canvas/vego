import Text from './textRender';
class Graphics {
    static getRGB(r, g, b, alpha) {
		if (r != null && b == null) {
			alpha = g;
			b = r&0xFF;
			g = r>>8&0xFF;
			r = r>>16&0xFF;
		}
		if (alpha == null) {
			return "rgb("+r+","+g+","+b+")";
		} else {
			return "rgba("+r+","+g+","+b+","+alpha+")";
		}
    }

    static getHSL(hue, saturation, lightness, alpha) {
		if (alpha == null) {
			return "hsl("+(hue%360)+","+saturation+"%,"+lightness+"%)";
		} else {
			return "hsla("+(hue%360)+","+saturation+"%,"+lightness+"%,"+alpha+")";
		}
    }



    constructor(){
        this.command = null;
        this._stroke = null;
        this._strokeStyle = null;
        this._oldStrokeStyle = null;
        this._strokeDash = null;
        this._oldStrokeDash = null;
        this._strokeIgnoreScale = false;
        this._fill = null;

        this._instructions = [];
        this._commitIndex = 0;
        this._activeInstructions = [];

        this._dirty = false;
        this._storeIndex = 0;
        this.clear();
    }

    clear() {
		this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
		this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
		this._dirty = this._strokeIgnoreScale = false;
		return this;
    }

    _getInstructions(){
        this._updateInstructions();
		return this._instructions;
    }

    get instructions(){
        return this._getInstructions();
    }

    isEmpty(){
        return !(this._instructions.length || this._activeInstructions.length);
    }
    draw(ctx, data) {
		this._updateInstructions();
        var instr = this._instructions;
        // 仅从保存过后的序号开始执行绘制，有可能大大提高效率
		for (var i=this._storeIndex, l=instr.length; i<l; i++) {
			instr[i].exec(ctx, data);
		}
    }
    drawAsPath(ctx) {
		this._updateInstructions();
		var instr, instrs = this._instructions;
		for (var i=this._storeIndex, l=instrs.length; i<l; i++) {
			// the first command is always a beginPath command.
			if ((instr = instrs[i]).path !== false) { instr.exec(ctx); }
		}
    }
    moveTo(x, y) {
		return this.append(new G.MoveTo(x,y), true);
	}
    lineTo(x, y) {
		return this.append(new G.LineTo(x,y));
    }
    arcTo(x1, y1, x2, y2, radius) {
		return this.append(new G.ArcTo(x1, y1, x2, y2, radius));
    }
    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
		return this.append(new G.Arc(x, y, radius, startAngle, endAngle, anticlockwise));
    }
    quadraticCurveTo(cpx, cpy, x, y) {
		return this.append(new G.QuadraticCurveTo(cpx, cpy, x, y));
    }
    curveTo (cpx, cpy, x, y) {
		return this.append(new G.QuadraticCurveTo(cpx, cpy, x, y));
    }
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
		return this.append(new G.BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
    }
    rect(x, y, w, h) {
		return this.append(new G.Rect(x, y, w, h));
    }
    drawRect(x, y, w, h) {
		return this.append(new G.Rect(x, y, w, h));
    }
    closePath() {
		return this._activeInstructions.length ? this.append(new G.ClosePath()) : this;
    }
    beginFill(color) {
		return this._setFill(color ? new G.Fill(color) : null);
    }
    beginLinearGradientFill(colors, ratios, x0, y0, x1, y1) {
		return this._setFill(new G.Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
    }
    beginRadialGradientFill(colors, ratios, x0, y0, r0, x1, y1, r1) {
		return this._setFill(new G.Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
    }
    beginBitmapFill(image, repetition, matrix) {
		return this._setFill(new G.Fill(null,matrix).bitmap(image, repetition));
    }
    endFill() {
		return this.beginFill();
    }
    setStrokeStyle (thickness, caps, joints, miterLimit, ignoreScale) {
		this._updateInstructions(true);
		this._strokeStyle = this.command = new G.StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);

		// ignoreScale lives on Stroke, not StrokeStyle, so we do a little trickery:
		if (this._stroke) { this._stroke.ignoreScale = ignoreScale; }
		this._strokeIgnoreScale = ignoreScale;
		return this;
    }
    setStrokeDash (segments, offset) {
		this._updateInstructions(true);
		this._strokeDash = this.command = new G.StrokeDash(segments, offset);
		return this;
	}
	setFont (font, textAlign, textBaseline, lineJoin, miterLimit) {
		this.font = font||"10px sans-serif";
		this.textAlign = textAlign||"left";
		this.textBaseline = textBaseline||"top";
		this.lineJoin = lineJoin || "miter";
		this.miterLimit = miterLimit || 2.5;
		return this;
	};
    beginStroke (color) {
		return this._setStroke(color ? new G.Stroke(color) : null);
    }
    beginLinearGradientStroke (colors, ratios, x0, y0, x1, y1) {
		return this._setStroke(new G.Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
    }
    beginRadialGradientStroke (colors, ratios, x0, y0, r0, x1, y1, r1) {
		return this._setStroke(new G.Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
    }
    beginBitmapStroke (image, repetition) {
		// NOTE: matrix is not supported for stroke because transforms on strokes also affect the drawn stroke width.
		return this._setStroke(new G.Stroke().bitmap(image, repetition));
    }
    endStroke () {
		return this.beginStroke();
    }

    drawRoundRect (x, y, w, h, radius) {
		return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
    }
    drawRoundRectComplex (x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
		return this.append(new G.RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
    }
    drawCircle (x, y, radius) {
		return this.append(new G.Circle(x, y, radius));
    }
    drawEllipse (x, y, w, h) {
		return this.append(new G.Ellipse(x, y, w, h));
    }
    drawPolyStar (x, y, radius, sides, pointSize, angle) {
		return this.append(new G.PolyStar(x, y, radius, sides, pointSize, angle));
	}
	drawText(text, config){
		return this.append(new G.Text(text, config));
	}
    append (command, clean) {
		this._activeInstructions.push(command);
		this.command = command;
		if (!clean) { this._dirty = true; }
		return this;
    }
    store () {
		this._updateInstructions(true);
		this._storeIndex = this._instructions.length;
		return this;
    }
    unstore () {
		this._storeIndex = 0;
		return this;
    }
    clone () {
		var o = new Graphics();
		o.command = this.command;
		o._stroke = this._stroke;
		o._strokeStyle = this._strokeStyle;
		o._strokeDash = this._strokeDash;
		o._strokeIgnoreScale = this._strokeIgnoreScale;
		o._fill = this._fill;
		o._instructions = this._instructions.slice();
		o._commitIndex = this._commitIndex;
		o._activeInstructions = this._activeInstructions.slice();
		o._dirty = this._dirty;
		o._storeIndex = this._storeIndex;
		return o;
    }
    toString () {
		return "[Graphics]";
    }
    _updateInstructions (commit) {
		var instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;

		if (this._dirty && active.length) {
			instr.length = commitIndex; // remove old, uncommitted commands
			instr.push(Graphics.beginCmd);

			var l = active.length, ll = instr.length;
			instr.length = ll+l;
			for (var i=0; i<l; i++) { instr[i+ll] = active[i]; }

			if (this._fill) { instr.push(this._fill); }
			if (this._stroke) {
				// doesn't need to be re-applied if it hasn't changed.
				if (this._strokeDash !== this._oldStrokeDash) {
					instr.push(this._strokeDash);
				}
				if (this._strokeStyle !== this._oldStrokeStyle) {
					instr.push(this._strokeStyle);
				}
				if (commit) {
					this._oldStrokeStyle = this._strokeStyle;
					this._oldStrokeDash = this._strokeDash;
				}
				instr.push(this._stroke);
			}

			this._dirty = false;
		}

		if (commit) {
			active.length = 0;
			this._commitIndex = instr.length;
		}
    }
    _setFill (fill) {
		this._updateInstructions(true);
		this.command = this._fill = fill;
		return this;
    }
    _setStroke (stroke) {
		this._updateInstructions(true);
		if (this.command = this._stroke = stroke) {
			stroke.ignoreScale = this._strokeIgnoreScale;
		}
		return this;
	}
}
const G = Graphics;
let p;
// Command Objects:
	(G.Text = function(text, config){
		this.text = new Text(text, config)
	}).prototype.exec = function(ctx) { this.text.exec(ctx); };
	/**
	 * @namespace Graphics
	 */
	/**
	 * Graphics command object. See {{#crossLink "Graphics/lineTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information. See {{#crossLink "Graphics"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class LineTo
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.LineTo = function(x, y) {
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.lineTo(this.x,this.y); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/moveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class MoveTo
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx
	 */
	(G.MoveTo = function(x, y) {
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.moveTo(this.x, this.y); };


	/**
	 * Graphics command object. See {{#crossLink "Graphics/arcTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class ArcTo
	 * @constructor
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 * @param {Number} radius
	 **/
	/**
	 * @property x1
	 * @type Number
	 */
	/**
	 * @property y1
	 * @type Number
	 */
	/**
	 * @property x2
	 * @type Number
	 */
	/**
	 * @property y2
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.ArcTo = function(x1, y1, x2, y2, radius) {
		this.x1 = x1; this.y1 = y1;
		this.x2 = x2; this.y2 = y2;
		this.radius = radius;
	}).prototype.exec = function(ctx) { ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/arc"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Arc
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} startAngle
	 * @param {Number} endAngle
	 * @param {Number} anticlockwise
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * @property startAngle
	 * @type Number
	 */
	/**
	 * @property endAngle
	 * @type Number
	 */
	/**
	 * @property anticlockwise
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.Arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
		this.x = x; this.y = y;
		this.radius = radius;
		this.startAngle = startAngle; this.endAngle = endAngle;
		this.anticlockwise = !!anticlockwise;
	}).prototype.exec = function(ctx) { ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/quadraticCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class QuadraticCurveTo
	 * @constructor
	 * @param {Number} cpx
	 * @param {Number} cpy
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property cpx
	 * @type Number
	 */
	/**
	 * @property cpy
	 * @type Number
	 */
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.QuadraticCurveTo = function(cpx, cpy, x, y) {
		this.cpx = cpx; this.cpy = cpy;
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/bezierCurveTo"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class BezierCurveTo
	 * @constructor
	 * @param {Number} cp1x
	 * @param {Number} cp1y
	 * @param {Number} cp2x
	 * @param {Number} cp2y
	 * @param {Number} x
	 * @param {Number} y
	 **/
	/**
	 * @property cp1x
	 * @type Number
	 */
	/**
	 * @property cp1y
	 * @type Number
	 */
	/**
	 * @property cp2x
	 * @type Number
	 */
	/**
	 * @property cp2y
	 * @type Number
	 */
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.BezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.cp1x = cp1x; this.cp1y = cp1y;
		this.cp2x = cp2x; this.cp2y = cp2y;
		this.x = x; this.y = y;
	}).prototype.exec = function(ctx) { ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/rect"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Rect
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property w
	 * @type Number
	 */
	/**
	 * @property h
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.Rect = function(x, y, w, h) {
		this.x = x; this.y = y;
		this.w = w; this.h = h;
	}).prototype.exec = function(ctx) { ctx.rect(this.x, this.y, this.w, this.h); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/closePath"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class ClosePath
	 * @constructor
	 **/
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.ClosePath = function() {
	}).prototype.exec = function(ctx) { ctx.closePath(); };

	/**
	 * Graphics command object to begin a new path. See {{#crossLink "Graphics"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class BeginPath
	 * @constructor
	 **/
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.BeginPath = function() {
	}).prototype.exec = function(ctx) { ctx.beginPath(); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/beginFill"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Fill
	 * @constructor
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Matrix2D} matrix
	 **/
	/**
	 * A valid Context2D fillStyle.
	 * @property style
	 * @type Object
	 */
	/**
	 * @property matrix
	 * @type Matrix2D
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	p = (G.Fill = function(style, matrix) {
		this.style = style;
		this.matrix = matrix;
	}).prototype;
	p.exec = function(ctx) {
		if (!this.style) { return; }
		ctx.fillStyle = this.style;
		var mtx = this.matrix;
		if (mtx) { ctx.save(); ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty); }
		ctx.fill();
		if (mtx) { ctx.restore(); }
	};
	/**
	 * Creates a linear gradient style and assigns it to {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginLinearGradientFill"}}{{/crossLink}} for more information.
	 * @method linearGradient
	 * @param {Array} colors
	 *
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	p.linearGradient = function(colors, ratios, x0, y0, x1, y1) {
		var o = this.style =  Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
		for (var i=0, l=colors.length; i<l; i++) { o.addColorStop(ratios[i], colors[i]); }
		o.props = {colors:colors, ratios:ratios, x0:x0, y0:y0, x1:x1, y1:y1, type:"linear"};
		return this;
	};
	/**
	 * Creates a radial gradient style and assigns it to {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginRadialGradientFill"}}{{/crossLink}} for more information.
	 * @method radialGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} r0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} r1
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	p.radialGradient = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
		var o = this.style =  Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
		for (var i=0, l=colors.length; i<l; i++) { o.addColorStop(ratios[i], colors[i]); }
		o.props = {colors:colors, ratios:ratios, x0:x0, y0:y0, r0:r0, x1:x1, y1:y1, r1:r1, type:"radial"};
		return this;
	};
	/**
	 * Creates a bitmap fill style and assigns it to the {{#crossLink "Fill/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginBitmapFill"}}{{/crossLink}} for more information.
	 * @method bitmap
	 * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement} image  Must be loaded prior to creating a bitmap fill, or the fill will be empty.
	 * @param {String} [repetition] One of: repeat, repeat-x, repeat-y, or no-repeat.
	 * @return {Fill} Returns this Fill object for chaining or assignment.
	 */
	p.bitmap = function(image, repetition) {
		if (image.naturalWidth || image.getContext || image.readyState >= 2) {
			var o = this.style = Graphics._ctx.createPattern(image, repetition || "");
			o.props = {image: image, repetition: repetition, type: "bitmap"};
		}
		return this;
	};
	p.path = false;

	/**
	 * Graphics command object. See {{#crossLink "Graphics/beginStroke"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Stroke
	 * @constructor
	 * @param {Object} style A valid Context2D fillStyle.
	 * @param {Boolean} ignoreScale
	 **/
	/**
	 * A valid Context2D strokeStyle.
	 * @property style
	 * @type Object
	 */
	/**
	 * @property ignoreScale
	 * @type Boolean
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	p = (G.Stroke = function(style, ignoreScale) {
		this.style = style;
		this.ignoreScale = ignoreScale;
	}).prototype;
	p.exec = function(ctx) {
		if (!this.style) { return; }
		ctx.strokeStyle = this.style;
		if (this.ignoreScale) { ctx.save(); ctx.setTransform(1,0,0,1,0,0); }
		ctx.stroke();
		if (this.ignoreScale) { ctx.restore(); }
	};
	/**
	 * Creates a linear gradient style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginLinearGradientStroke"}}{{/crossLink}} for more information.
	 * @method linearGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	p.linearGradient = G.Fill.prototype.linearGradient;
	/**
	 * Creates a radial gradient style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginRadialGradientStroke"}}{{/crossLink}} for more information.
	 * @method radialGradient
	 * @param {Array} colors
	 * @param {Array} ratios
	 * @param {Number} x0
	 * @param {Number} y0
	 * @param {Number} r0
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} r1
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	p.radialGradient = G.Fill.prototype.radialGradient;
	/**
	 * Creates a bitmap fill style and assigns it to {{#crossLink "Stroke/style:property"}}{{/crossLink}}.
	 * See {{#crossLink "Graphics/beginBitmapStroke"}}{{/crossLink}} for more information.
	 * @method bitmap
	 * @param {HTMLImageElement} image
	 * @param {String} [repetition] One of: repeat, repeat-x, repeat-y, or no-repeat.
	 * @return {Fill} Returns this Stroke object for chaining or assignment.
	 */
	p.bitmap = G.Fill.prototype.bitmap;
	p.path = false;

	/**
	 * Graphics command object. See {{#crossLink "Graphics/setStrokeStyle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class StrokeStyle
	 * @constructor
	 * @param {Number} width
	 * @param {String} [caps=butt]
	 * @param {String} [joints=miter]
	 * @param {Number} [miterLimit=10]
	 * @param {Boolean} [ignoreScale=false]
	 **/
	/**
	 * @property width
	 * @type Number
	 */
	/**
	 * One of: butt, round, square
	 * @property caps
	 * @type String
	 */
	/**
	 * One of: round, bevel, miter
	 * @property joints
	 * @type String
	 */
	/**
	 * @property miterLimit
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	p = (G.StrokeStyle = function(width, caps, joints, miterLimit, ignoreScale) {
		this.width = width;
		this.caps = caps;
		this.joints = joints;
		this.miterLimit = miterLimit;
		this.ignoreScale = ignoreScale;
	}).prototype;
	p.exec = function(ctx) {
		ctx.lineWidth = (this.width == null ? "1" : this.width);
		ctx.lineCap = (this.caps == null ? "butt" : (isNaN(this.caps) ? this.caps : Graphics.STROKE_CAPS_MAP[this.caps]));
		ctx.lineJoin = (this.joints == null ? "miter" : (isNaN(this.joints) ? this.joints : Graphics.STROKE_JOINTS_MAP[this.joints]));
		ctx.miterLimit = (this.miterLimit == null ? "10" : this.miterLimit);
		ctx.ignoreScale = (this.ignoreScale == null ? false : this.ignoreScale);
	};
	p.path = false;

	/**
	 * Graphics command object. See {{#crossLink "Graphics/setStrokeDash"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class StrokeDash
	 * @constructor
	 * @param {Array} [segments]
	 * @param {Number} [offset=0]
	 **/
	/**
	 * @property segments
	 * @type Array
	 */
	/**
	 * @property offset
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.StrokeDash = function(segments, offset) {
		this.segments = segments;
		this.offset = offset||0;
	}).prototype.exec = function(ctx) {
		if (ctx.setLineDash) { // feature detection.
			ctx.setLineDash(this.segments|| G.StrokeDash.EMPTY_SEGMENTS); // instead of [] to reduce churn.
			ctx.lineDashOffset = this.offset||0;
		}
	};
	/**
	 * The default value for segments (ie. no dash).
	 * @property EMPTY_SEGMENTS
	 * @static
	 * @final
	 * @readonly
	 * @protected
	 * @type {Array}
	 **/
	G.StrokeDash.EMPTY_SEGMENTS = [];

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawRoundRectComplex"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class RoundRect
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @param {Number} radiusTL
	 * @param {Number} radiusTR
	 * @param {Number} radiusBR
	 * @param {Number} radiusBL
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property w
	 * @type Number
	 */
	/**
	 * @property h
	 * @type Number
	 */
	/**
	 * @property radiusTL
	 * @type Number
	 */
	/**
	 * @property radiusTR
	 * @type Number
	 */
	/**
	 * @property radiusBR
	 * @type Number
	 */
	/**
	 * @property radiusBL
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.RoundRect = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
		this.x = x; this.y = y;
		this.w = w; this.h = h;
		this.radiusTL = radiusTL; this.radiusTR = radiusTR;
		this.radiusBR = radiusBR; this.radiusBL = radiusBL;
	}).prototype.exec = function(ctx) {
		var max = (w<h?w:h)/2;
		var mTL=0, mTR=0, mBR=0, mBL=0;
		var x = this.x, y = this.y, w = this.w, h = this.h;
		var rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;

		if (rTL < 0) { rTL *= (mTL=-1); }
		if (rTL > max) { rTL = max; }
		if (rTR < 0) { rTR *= (mTR=-1); }
		if (rTR > max) { rTR = max; }
		if (rBR < 0) { rBR *= (mBR=-1); }
		if (rBR > max) { rBR = max; }
		if (rBL < 0) { rBL *= (mBL=-1); }
		if (rBL > max) { rBL = max; }

		ctx.moveTo(x+w-rTR, y);
		ctx.arcTo(x+w+rTR*mTR, y-rTR*mTR, x+w, y+rTR, rTR);
		ctx.lineTo(x+w, y+h-rBR);
		ctx.arcTo(x+w+rBR*mBR, y+h+rBR*mBR, x+w-rBR, y+h, rBR);
		ctx.lineTo(x+rBL, y+h);
		ctx.arcTo(x-rBL*mBL, y+h+rBL*mBL, x, y+h-rBL, rBL);
		ctx.lineTo(x, y+rTL);
		ctx.arcTo(x-rTL*mTL, y-rTL*mTL, x+rTL, y, rTL);
		ctx.closePath();
	};

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawCircle"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Circle
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.Circle = function(x, y, radius) {
		this.x = x; this.y = y;
		this.radius = radius;
	}).prototype.exec = function(ctx) { ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); };

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawEllipse"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class Ellipse
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property w
	 * @type Number
	 */
	/**
	 * @property h
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.Ellipse = function(x, y, w, h) {
		this.x = x; this.y = y;
		this.w = w; this.h = h;
	}).prototype.exec = function(ctx) {
		var x = this.x, y = this.y;
		var w = this.w, h = this.h;

		var k = 0.5522848;
		var ox = (w / 2) * k;
		var oy = (h / 2) * k;
		var xe = x + w;
		var ye = y + h;
		var xm = x + w / 2;
		var ym = y + h / 2;

		ctx.moveTo(x, ym);
		ctx.bezierCurveTo(x, ym-oy, xm-ox, y, xm, y);
		ctx.bezierCurveTo(xm+ox, y, xe, ym-oy, xe, ym);
		ctx.bezierCurveTo(xe, ym+oy, xm+ox, ye, xm, ye);
		ctx.bezierCurveTo(xm-ox, ye, x, ym+oy, x, ym);
	};

	/**
	 * Graphics command object. See {{#crossLink "Graphics/drawPolyStar"}}{{/crossLink}} and {{#crossLink "Graphics/append"}}{{/crossLink}} for more information.
	 * @class PolyStar
	 * @constructor
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @param {Number} sides
	 * @param {Number} pointSize
	 * @param {Number} angle
	 **/
	/**
	 * @property x
	 * @type Number
	 */
	/**
	 * @property y
	 * @type Number
	 */
	/**
	 * @property radius
	 * @type Number
	 */
	/**
	 * @property sides
	 * @type Number
	 */
	/**
	 * @property pointSize
	 * @type Number
	 */
	/**
	 * @property angle
	 * @type Number
	 */
	/**
	 * Execute the Graphics command in the provided Canvas context.
	 * @method exec
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context
	 */
	(G.PolyStar = function(x, y, radius, sides, pointSize, angle) {
		this.x = x; this.y = y;
		this.radius = radius;
		this.sides = sides;
		this.pointSize = pointSize;
		this.angle = angle;
	}).prototype.exec = function(ctx) {
		var x = this.x, y = this.y;
		var radius = this.radius;
		var angle = (this.angle||0)/180*Math.PI;
		var sides = this.sides;
		var ps = 1-(this.pointSize||0);
		var a = Math.PI/sides;

		ctx.moveTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		for (var i=0; i<sides; i++) {
			angle += a;
			if (ps != 1) {
				ctx.lineTo(x+Math.cos(angle)*radius*ps, y+Math.sin(angle)*radius*ps);
			}
			angle += a;
			ctx.lineTo(x+Math.cos(angle)*radius, y+Math.sin(angle)*radius);
		}
		ctx.closePath();
    };

	Graphics.beginCmd = new G.BeginPath();
	Graphics.BASE_64 = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25,"a":26,"b":27,"c":28,"d":29,"e":30,"f":31,"g":32,"h":33,"i":34,"j":35,"k":36,"l":37,"m":38,"n":39,"o":40,"p":41,"q":42,"r":43,"s":44,"t":45,"u":46,"v":47,"w":48,"x":49,"y":50,"z":51,"0":52,"1":53,"2":54,"3":55,"4":56,"5":57,"6":58,"7":59,"8":60,"9":61,"+":62,"/":63};
    Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
    Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
	export default Graphics;
