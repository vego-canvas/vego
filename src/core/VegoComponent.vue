<template>
    <div
        :geox="vegoDisplayObject.$geomery.x"
        :geoy="vegoDisplayObject.$geomery.y"
        :rotation="vegoDisplayObject.$geomery.rotation"
        :scaleX="vegoDisplayObject.$geomery.scaleX"
        :scaleY="vegoDisplayObject.$geomery.scaleY"
        :skewX="vegoDisplayObject.$geomery.skewX"
        :skewY="vegoDisplayObject.$geomery.skewY"
        :regX="vegoDisplayObject.$geomery.regX"
        :regY="vegoDisplayObject.$geomery.regY">
        <slot></slot>
    </div>
</template>

<script>
import { queueUpdate } from '../util/Engine';
export default {
    mounted(){

    }
}
</script>

<style>

</style>
