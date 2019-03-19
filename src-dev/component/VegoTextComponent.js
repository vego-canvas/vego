import {
    TextDisplayObject,
} from 'vegocore';
import VegoBaseComponent from './VegoBaseComponent';

export default {
    props: {
        text: String,
        font: String,
        color: String,
        textAlign: String,
        textBaseline: String,
        outline: Number,
        lineWidth: Number,
        lineHeight: Number,
    },
    extends: VegoBaseComponent,
    watch: {
        text(val) {
            this.vegoInstance.text = val;
            this.vegoInstance.$graphic.uncache();
        },
    },
    methods: {
        initVegoComponet() {
            const {
                text,
                font, color, textAlign, textBaseline,
                outline, lineWidth, lineHeight,
            } = this;
            this.vegoInstance = new TextDisplayObject(
                this._uid,
                text,
                {
                    font, color, textAlign, textBaseline,
                    outline, lineWidth, lineHeight,
                }
            );
        },
    },
};
