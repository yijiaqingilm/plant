<template>
    <div class="my-radio">
        <input type="radio" :disabled="disabled" :id="id" :checked="val==value" :name="name" :value="val"
               @change="inputChange($event.target,$event.target.value)">
        <label :for="id"></label>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            id: String,
            value: null,
            val: null,
            model: String,
            name: String,
            checked: {
                type: Boolean,
                defailt: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {}
        },
        methods: {
            inputChange: function (t, value) {
                this.$emit('input', value);
            }
        },
        computed: {}

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "myRadio.scss";
</style>
