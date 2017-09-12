<template>
    <!-- 公用的modal窗口组件 mypickermodal-->
    <div class="my-picker-modal">
        <masking :showMask="show" @click="closeModal"></masking>
        <transition
                name="my-modal-transition"
                enter-active-class="animated slideInUp"
                leave-active-class="animated slideOutDown">
            <div class="my-modal" v-show="show">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {}
        },
        created(){
        },
        methods: {
            showModal: function () {
                this.show = true;
            },
            closeModal: function () {
                //this.show = false;
                this.$emit('closeModal',false);
            }
        },
        computed: {}

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "myPickerModal.scss";
</style>
