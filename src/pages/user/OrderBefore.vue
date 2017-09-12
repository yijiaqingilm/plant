<template>
    <!--未下单页面 orderbefore.vue-->
    <f7-page>
        <back title="绿植养护"></back>
        <f7-block inner class="orderBefore" no-hairlines>
            <div class="header"><img src="../../assets/book_header.jpg" alt=""></div>
            <div class="hint">
                您还没有养护订单，赶紧去预约吧
            </div>
            <div class="submit">
                <span class="my-button">绿植体检预约</span>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return {}
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
</style>
