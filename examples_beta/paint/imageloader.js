export default {
    props: {
        source: String,
    },
    data() {
        return {
            img: null,
        };
    },
    mounted() {
        this.loadImage(this.source);
    },
    methods: {
        loadImage(src) {
            const img = new Image();
            img.onload = () => {
                this.img = img;
            };
            img.src = src;
        },
    },
};

