<template>
    <f7-page>
        <!--养护订单确认 页面 order.vue-->
        <back title="养护订单确认"></back>
        <f7-block inner class="order" no-hairlines>
            <div class="address">
                <div class="ad-default">添加养护地址</div>
            </div>
            <div class="order-list">
                <div class="order-time"><span class="icon_time"></span>下单时间：2017-05-05</div>
                <div class="order-item">
                    <div class="item-photo"><img src="../../assets/flower.png" alt=""></div>
                    <div class="item-info">
                    </div>
                </div>
            </div>
            <div class="order-info"></div>
            <div class="submit"></div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    export default {
        data(){
            return {}
        },
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/orderBefore.scss";
</style>
