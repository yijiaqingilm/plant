<template>
    <!--  订单列表 orderlist.vue-->
    <f7-page>
        <back title="养护记录"></back>
        <f7-block inner class="orderDetail" no-hairlines>
            <div class="plant-list">
                <div class="plant-time"><span class="icon_time"></span><span>{{created_at}}</span></div>
                <div class="plant-item" v-for="item in dataList">
                    <div class="plant-photo"><img :src="item.img" alt=""></div>
                    <div class="plant-detail">
                        <div class="plant-name">
                            <span>绿植名称：{{item.name}}</span>
                            <span >×{{item.amount}}</span>
                        </div>
                        <div class="plant-status">
                            <span>养护打卡：已进行</span><span class="color-theme">{{item.maintenance}}</span>
                        </div>
                        <div>绿植状态：{{item.status}}</div>
                    </div>
                </div>
            </div>

        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {userApi} from "api"
    export default {
        data(){
            return {
                day_at: '',
                id:-1,
                dataList: [],
                created_at: ''
            }
        },
        created(){
            this.day_at = this.$route.params.orderId;
            this.id = this.$route.params.id;
            userApi.maintenanceHistoryDetail(this.id,this.day_at).then(result => {
                console.log('result', result);
                this.dataList = result.data.items;
                this.created_at = result.data.created_at;
            })
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {},
        components: {}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/orderDetail.scss";
</style>
