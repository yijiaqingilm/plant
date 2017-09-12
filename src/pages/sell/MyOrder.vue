<template>
    <f7-page>
        <!--我的订单 myorder.vue-->
        <back title="代下单列表" back-link=""></back>
        <f7-block inner class="myOrder" no-hairlines>
            <div class="tabs">
                <div class="tab" :class="{active:orderItem==orderType.plantOrder}"
                     @click="changeOrderItem(orderType.plantOrder)">绿植代下单
                </div>
                <div class="tab" :class="{active:orderItem==orderType.careOrder}"
                     @click="changeOrderItem(orderType.careOrder)">养护代下单
                </div>
            </div>
            <div class="order order2" v-show="orderItem==orderType.plantOrder">
                <div class="no-order" v-if="plantOrderListLen==0">
                    <div class="hint">
                        <p>暂无订单</p>
                    </div>
                </div>
                <div class="plant-order-list ">
                    <div class="order-msg" v-if="plantAmount>0">有{{plantAmount}}单月结订单，请提前通知用户付款</div>
                    <div class="item" v-for="(item,index) in plantOrderList" @click="goPlantDetail(item)">
                        <div class="item-header">
                            <div>订单{{item.id}}
                                <span class="color-theme" v-if="item.type==plantType.buy">(购买)</span>
                                <span class="color-theme" v-if="item.type==plantType.lease">(租赁)</span>
                            </div>
                            <div><span class="status" :class="{warn:plantOrderStatus[item.status].warn}">{{plantOrderStatus[item.status].value}}</span>
                            </div>
                        </div>
                        <div class="address-info">
                            <div class="address">
                                {{item.address}}
                            </div>
                            <div class="contacts">
                                联系人:{{item.contact}}
                            </div>
                            <div class="phone" @click.stop="call(item.mobile)">
                                联系电话：<a :href="'tel:'+item.mobile" class="external"><span class="phone-number">{{item.mobile}}<span
                                    class="phone_icon"></span></span></a>
                            </div>
                        </div>
                        <div class="item-context">
                            <div class="plant-list">
                                <div class="plant-item" v-if="item.img" v-for="img in item.img">
                                    <img :src="img" alt="">
                                </div>
                                <div class="item-gt">
                                    <span class="gt"></span>
                                </div>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div>下单时间：{{item.created_at}}</div>
                            <div>合计：<span class="total">￥{{item.payment}}</span></div>
                        </div>
                    </div>
                    <infinite-loading :isInit="orderItem==orderType.plantOrder" :on-infinite="loadPlantOrderList"
                                      ref="plantOrderLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results"></div>
                    </infinite-loading>
                </div>
            </div>
            <div class="order order3" v-show="orderItem==orderType.careOrder">
                <div class="no-order" v-if="maintenanceListLen==0">
                    <div class="hint">
                        <p>暂无订单</p>
                    </div>
                </div>
                <div class="order-msg" v-if="plantAmount>0">有{{plantAmount}}单月结订单，请提前通知用户付款</div>
                <div class="plant-order-list " v-show="maintenanceList.length>0">
                    <div class="item" v-for="(item,index) in maintenanceList" @click="goPlantDetail(item)">
                        <div class="item-header">
                            <div>订单{{item.id}}</div>
                            <div><span class="status" :class="{warn:plantOrderStatus[item.status].warn}">{{plantOrderStatus[item.status].value}}</span>
                            </div>
                        </div>
                        <div class="address-info">
                            <div class="address">
                                {{item.address}}
                            </div>
                            <div class="contacts">
                                联系人:{{item.contact}}
                            </div>
                            <div class="phone" @click.stop="call(item.mobile)">
                                联系电话：<a :href="'tel:'+item.mobile" class="external"><span class="phone-number">{{item.mobile}}<span
                                    class="phone_icon"></span></span></a>
                            </div>
                        </div>
                        <div class="item-context">
                            <div class="plant-list">
                                <div class="plant-item" v-if="item.img" v-for="img in item.img">
                                    <img :src="img" alt="">
                                </div>
                                <div class="item-gt">
                                    <span class="gt"></span>
                                </div>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div>下单时间：{{item.created_at}}</div>
                            <div>合计：<span class="total">￥{{item.payment}}</span></div>
                        </div>
                    </div>
                    <infinite-loading :isInit="orderItem==orderType.careOrder" :on-infinite="loadCareOrderList"
                                      ref="careOrderLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results"></div>
                    </infinite-loading>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {sellApi, commonApi} from 'src/api/index'
    import {Cache} from 'lib/utils'
    import InfiniteLoading from 'components/infiniteLoading/components/InfiniteLoading.vue'
    import UserSubsOrderList from 'section/user/subsOrderList/subsOrderList.vue'

    export default {
        data() {
            return {
                orderItem: 1,
                // 1绿植订单 2 养护订单
                orderType: {
                    plantOrder: 1,
                    careOrder: 2
                },
                // 绿植订单类型（1.购买+租赁，2租赁，3购买） ,
                plantType: {
                    compose: 1,
                    lease: 2,
                    buy: 3
                },
                //绿植订单
                //购买订单状态：0未付款，1已付款，2配送中，8已完成，9已取消;
                //租赁订单（购买/租赁订单）状态：0未付款，1已付款，2配送中，3养护中，5已到期，6已收回，8已完成，9已取消
                plantOrderStatus: {
                    0: {value: '用户未支付', warn: true},
                    18: {value: '待核账', warn: true}, /*等待财务收款*/
                    1: {value: '用户已付款', warn: false},
                    2: {value: '用户已付款', warn: false},//配送中
                    3: {value: '用户已付款', warn: false},//养护中
                    5: {value: '用户已付款', warn: false},//养护到期
                    6: {value: '用户已付款', warn: false},//已收回
                    8: {value: '用户已付款', warn: false},//已完成
                    9: {value: '订单已取消', warn: false},//已取消
                    14: {value: '订单已取消', warn: true},//已退款

                },
                bookOrderList: [],
                plantOrderList: [],
                maintenanceList: [],
                bookOrderListLen: -1,
                plantOrderListLen: -1,
                maintenanceListLen: -1,
                // 预约订单 预约类型
                type: {
                    0: '上门服务',
                    1: '风水服务预约'
                },
                // warn：状态显示的颜色 true 为红色
                status: {
                    1: {value: '已支付', warn: false},
                    0: {value: '待支付', warn: true},
                    8: {value: '已完成', warn: false},
                    9: {value: '已取消', warn: true},
                    13: {value: '已评价', warn: false},
                    14: {value: '已退款', warn: true},
                    10: {value: '待上门', warn: true},
                    11: {value: '待上门', warn: true},
                    15: {value: '待上门', warn: true},
                },
                bookPage: 1,
                plantPage: 1,
                carePage: 1,
                plantAmount:0
            }
        },
        created() {
            this.orderItem = Cache.get('orderItem') || 2;
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        methods: {
            call(mobile) {
            },
            goPlantDetail: function (item) {
                this.$router.load({url: `/sell/orderDetail/${item.id}`});
            },
            changeOrderItem: function (itemId) {
                this.orderItem = itemId;
                switch (this.orderItem >>> 0) {
                    case this.orderType.bookOrder:
                        break;
                    case this.orderType.plantOrder:
                        break;
                    case this.orderType.careOrder:
                        break;
                    default:
                        break;
                }

            },

            loadPlantOrderList: function () {
                sellApi.orderList(1, this.plantPage).then(result => {
                    if (result.data.items.length > 0) {
                        this.plantOrderList = [].concat(this.plantOrderList).concat(result.data.items);
                        this.$refs.plantOrderLoading.$emit('$InfiniteLoading:loaded');
                        this.plantPage++;
                        this.plantAmount=result.data.amount;

                    } else {
                        this.$refs.plantOrderLoading.$emit('$InfiniteLoading:complete');
                    }
                    this.plantOrderListLen = this.plantOrderList.length;
                });


            },
            loadCareOrderList: function () {
                sellApi.orderList(0, this.carePage).then(result => {
                    if (result.data.items.length > 0) {
                        this.maintenanceList = [].concat(this.maintenanceList).concat(result.data.items);
                        this.$refs.careOrderLoading.$emit('$InfiniteLoading:loaded');
                        this.carePage++;
                        this.plantAmount=result.data.amount;
                    } else {
                        this.$refs.careOrderLoading.$emit('$InfiniteLoading:complete');
                    }
                    this.maintenanceListLen = this.maintenanceList.length;
                });

            },


            /*预约订单 显示评论*/
            showComment: function (status, type) {
                if (type == 1) {
                    switch (status >>> 0) {
                        case 8:
                            return true;
                        default:
                            return false;
                    }
                } else {
                    return false;
                }

            },
            /*预约订单 显示 取消预约*/
            showCancel: function (status) {
                switch (status >>> 0) {
                    case 10:
                    case 11:
                    case 15:
                        return true;
                    default:
                        return false;
                }
            },
            /*预约订单 显示 删除订单*/
            showDel: function (status) {
                switch (status >>> 0) {
                    case 13:
                    case 8:
                    case 9:
                    case 14:
                        return true;
                    default:
                        return false;
                }
            },
            /*预约订单 显示 去支付*/
            showPay: function (status) {
                switch (status >>> 0) {
                    case 13:
                        return true;
                    default:
                        return false;
                }
            },
            /*预约订单 显示 确认上门*/
            showOnSite: function (status) {
                switch (status >>> 0) {
                    case 1:
                        return true;
                    default:
                        return false;
                }
            },
            /*确认上门*/
            onSite: function (item) {
                userApi.bookingOrderConfirmcome(item.booking_id).then(result => {
                    // item.status = 2;
                });
            },
            /*取消订单*/
            cancelOrder: function (item) {
                this.$f7.modal({
                    title: '',
                    text: '取消预约，请拨打客服电话<br>客服电话：0755-23619586',
                    buttons: [
                        {
                            text: '取消',
                            onClick: function () {
                            }
                        },
                        {
                            text: '<a href="tel:0755-23619586" class="external">呼叫</a>',
                            onClick: function () {

                            }
                        },
                    ]
                });

            },
            /*预约订单，删除订单*/
            delOrder: function (item, index) {
                this.$f7.confirm('是否删除订单', '', () => {
                    userApi.orderDel(item.id).then(result => {
                        this.bookOrderList.splice(index, 1);
                    });
                });
            },
            /*绿植订单， 删除订单*/
            delPlantOrder: function (item, index) {
                this.$f7.confirm('是否删除订单', '', () => {
                    userApi.orderDel(item.id).then(result => {
                        this.plantOrderList.splice(index, 1);
                    });
                });
            },
            /*养护订单 删除订单*/
            delmaintenanceOrder: function (item, index) {
                this.$f7.confirm('是否删除订单', '', () => {
                    userApi.orderDel(item.id).then(result => {
                        this.maintenanceList.splice(index, 1);
                    });
                });
            },

            /*绿植订单 显示删除订单*/
            showPlantOrderDel: function ({status, type}) {
                switch (status >>> 0) {
                    case 0:
                    case 14:
                    case 18:
                    case 8:
                    case 9:
                        return true;
                    default:
                        return false;
                }
            },
            /*绿植订单 去支付*/
            goPlantPay: function (item) {
                Cache.set("orderId", item.id);
                this.$router.load({url: '/store/changePay'});
            },
            /*绿植订单 显示 再次购买*/
            // 目前先 隐藏 再次购买
            showBuyAgain: function ({status, type}) {
                return false;
                /*if (type === this.plantType.buy) {
                 switch (status >>> 0) {
                 case 8:
                 return true;
                 default:
                 return false;
                 }
                 } else if (type === this.plantType.lease) {
                 return false;
                 } else {
                 return false;
                 }*/
            },
            /*绿植订单 显示 续租*/
            // 目前先 隐藏 续租
            showRelet: function ({status, type}) {
                return false;
                /*if (type === this.plantType.buy) {
                 return false
                 } else if (type === this.plantType.lease) {
                 switch (status >>> 0) {
                 case 3:
                 case 5:
                 return true;
                 default:
                 return false;
                 }
                 } else {
                 return false;
                 }*/
            },
            /*绿植订单 显示 取消订单*/
            showCancelPlantOrder: function ({status, type}) {
                switch (status >>> 0) {
                    case 1:
                        return true;
                    default:
                        return false;
                }
            },
            showPlantOrderPay: function ({status, type}) {
                switch (status >>> 0) {
                    case 0:
                    case 18:
                        return true;
                    default:
                        return false;
                }
            },
            /*绿植订单 显示 回退押金*/
            showReturn: function ({status, type}) {
                if (type === this.plantType.buy) {
                    return false;
                } else if (type === this.plantType.lease) {
                    switch (status >>> 0) {
                        case 8:
                            return true;
                        default:
                            return false;
                    }
                } else {
                    return false;
                }
            },

            /*绿植订单 再次购买*/
            buyAgain: function (item) {

            },
            /*绿植订单 续租*/
            relet: function (item) {

            },
            /*绿植订单 取消订单*/
            cancelPlantOrder: function (item) {
                this.$f7.modal({
                    title: '',
                    text: '取消预约，请拨打客服电话<br>客服电话：0755-23619586',
                    buttons: [
                        {
                            text: '取消',
                            onClick: function () {
                            }
                        },
                        {
                            text: '<a href="tel:0755-23619586" class="external">呼叫</a>',
                            onClick: function () {

                            }
                        },
                    ]
                });
            }

        },
        components: {UserSubsOrderList, InfiniteLoading},
        watch: {
            bookOrderList(value) {
                console.log('bookorderlist', value)
                this.bookOrderListLen = value.length > 0 ? 1 : 0;
            },
            plantOrderList(value) {
                console.log('plantOrderList', value)
                this.plantOrderListLen = value.length > 0 ? 1 : 0;
            },
            maintenanceList(value) {
                console.log('maintenanceList', value)
                this.maintenanceListLen = value.length > 0 ? 1 : 0;
            }
        }
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/user.scss";
    @import "../../css/user/myOrder.scss";

    .content-block {
        height: 100%;
    }

    .content-block-inner {
        height: 100%;
    }
</style>
