<template>
    <!--  订单列表 orderlist.vue-->
    <f7-page>
        <back title="养护记录" back-link=""></back>
        <f7-block inner class="orderList" no-hairlines>
            <div class="order-list">
                <div class="order-item" v-for="(order,index) in orderList">
                    <div class="order-title">
                        <div><span class="order-name">租赁养护订单：{{order.id}}</span></div>
                        <!-- <div><span class="middle-button">续期</span></div>-->
                    </div>
                    <div class="order-detail">
                        <div>养护周期：{{order.leaselong}}个月</div>
                        <div>剩余天数：<span class="color-theme">{{order.remainingday}}天</span></div>
                        <div>到期时间：{{order.expire}}</div>
                        <div class="total">￥{{order.price}}</div>
                        <div class="start-time">下单时间:{{order.created_at}}</div>
                    </div>
                    <collapsed class="plant-list" v-if="order.maintenanceitems&&order.maintenanceitems.length>0"
                               :listLen="order.maintenanceitems.length"
                               @changeShowLen="changeShowLen">
                        <div class="plant-item" v-for="(item,index) in order.maintenanceitems" v-show="index<maxLen"
                             @click="showDetail(item,order.id)" :key="index">
                            <div class="plant-time">
                                <span class="icon_time"></span><span class="time">{{item.day_at}}</span>
                                <span class="gt" v-if="!item.isdelay"></span>
                            </div>
                            <div class="detail" v-if="item.isdelay">养护改期</div>
                        </div>
                    </collapsed>
                </div>
                <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                    <div slot="no-more">没有更多数据</div>
                    <div slot="no-results">没有数据</div>
                </infinite-loading>

            </div>
            <div class="no-order" v-if="noOrder">
                <div class="hint">
                    <p>您还没有任何养护记录，</p>
                    <p>赶快前往绿植服务预约吧</p>
                </div>
                <div class="go">
                    <!--@click="$router.load({url:'/'})"-->
                    <!--<div><span class="middle-button">风水服务预约</span></div>-->
                    <div><span class="middle-button" @click="$router.load({url:'/user/book'})">预约上门</span></div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {userApi} from 'api'
    import Collapsed from 'components/collapsed/collapsed.vue'
    import InfiniteLoading from 'vue-infinite-loading'

    export default {
        data() {
            return {
                orderList: [],
                maxLen: 2,
                page: 1,
                noOrder: false
            }
        },
        created() {
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            loadData() {
                userApi.maintenanceHistory(this.page).then(result => {
                    console.log('result 养护记录', result);
                    if (result.data.length > 0) {
                        this.orderList = [].concat(this.orderList).concat(result.data);
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                        this.page++;
                    } else {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    }
                    if (this.orderList.length <= 0) {
                        this.noOrder = true;
                    }
                });

            },
            changeShowLen(maxLen) {
                this.maxLen = maxLen;
            },
            showDetail(item, id) {
                if (item.isdelay) {
                    return;
                }
                this.$router.load({url: `/user/order/detail/${id}/${item.day_at}`});
            }
        },
        components: {Collapsed, InfiniteLoading}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/orderList.scss";
</style>
