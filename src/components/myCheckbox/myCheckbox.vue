<template>
    <div class="my-checkbox" :class="[themeColor]">
        <input type="checkbox" :id="id" :disabled="disabled" :checked="value"
               @change="inputChange($event.target.checked)">
        <label :for="id"></label>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            id: String,
            value: Boolean,
            disabled: {
                type: Boolean,
                default: false
            },
            /*目前支持 theme-red*/
            themeColor: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        },
        methods: {
            inputChange: function (checked) {
                this.$emit('input', checked);
            }
        },
        computed: {}

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "myCheckbox.scss";
</style>
