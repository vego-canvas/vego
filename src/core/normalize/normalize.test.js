import nomalize from './index';
describe('nomalize test' ,function(){
    const config = {
        prop: {
            p: Number,
            t: Object
        },
        data: {
            a: 'xxx',
            b: {
                c: 6666,
            },
            d: [
                'test',
                {
                    g: 'hhhh'
                }
            ]
        },
        watch: {
            a(){

            },
        },
        created(){

        },
        mounted(){

        },
        methods: {
            start(){

            },
            stop(){

            }
        },
    };

    nomalize(config);
});