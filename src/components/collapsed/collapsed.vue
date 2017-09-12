<template>
    <div>
        <transition-group
                name="my-collapsed-transition"
                @before-enter="beforeEnter"
                @enter="enter"
                @leave="leave">
            <slot></slot>
        </transition-group>
        <div class="collapsed" v-if="listLen>baseLen">
            <div v-if="isCollapsed" @click="changeShowLen">
                <span>展开查看更多</span><span class="down"></span>
            </div>
            <div v-if="!isCollapsed" @click="changeShowLen">
                <span>收起</span><span class="up"></span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            listLen: Number,
            baseLen: {
                type: Number,
                default: 2
            }
        },
        data(){
            return {
                maxLen: -1,
                isCollapsed: true
            }
        },
        created(){
            this.maxLen = this.baseLen;
        },
        methods: {
            changeShowLen(){
                if (this.isCollapsed) {
                    this.maxLen = this.listLen;
                } else {
                    this.maxLen = this.baseLen;
                }
                this.isCollapsed = !this.isCollapsed;
                this.$emit("changeShowLen", this.maxLen);
            },
            beforeEnter: function (el) {
                el.style.opacity = 0
            },
            enter: function (el, done) {
                var delay = el.dataset.index * 150
                setTimeout(function () {
                    Velocity(
                        el,
                        {opacity: 1,height: '100%'},
                        {complete: done}
                    )
                }, delay)
            },
            leave: function (el, done) {
                var delay = el.dataset.index * 150
                setTimeout(function () {
                    Velocity(
                        el,
                        {opacity: 0, height: 0},
                        {complete: done}
                    )
                }, delay)
            }
        },
        components: {},
        computed: {}

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "collapsed.scss";
</style>
