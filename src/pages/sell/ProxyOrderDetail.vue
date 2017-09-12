<template>
    <f7-page>
        <back title="订单详情">
        </back>
        <f7-block inner class="pay" no-hairlines>
            <div class="header">
                <div class="address-list">
                    <div class="user-info">
                        <div class="detail">
                            <div class="name">{{addressInfo.contact}}</div>
                            <div class="phone">{{addressInfo.mobile}}</div>
                        </div>
                        <div class="address">{{addressInfo.address}}</div>
                        <div class="address-detail">{{addressInfo.addressdetail}}</div>
                    </div>
                </div>
            </div>
            <div class="line-10"></div>
            <div class="content">
                <div v-if="proxyOrder!=null && proxyOrder.goodsList && proxyOrder.goodsList.length>0">
                    <div class="goods-wrap">
                        <collapsed class="goods-list" :listLen="proxyOrder.goodsList.length"
                                   @changeShowLen="changeShowLen" :baseLen="4">

                            <div class="goods-item" v-for="(item,index) in proxyOrder.goodsList"
                                 v-show="index<maxLen" :key="index">
                                <div class="photo"><img :src="item.img" alt=""></div>
                                <div class="goods-info">
                                    <div class="name">{{item.name}} </div>
                                    <div class="detail">
                                        <div class="color-warn">￥{{item.price}}</div>
                                        <div class="count">×{{item.amount}}</div>
                                    </div>

                                </div>
                            </div>
                        </collapsed>
                    </div>
                    <div class="line-10"></div>
                    <div class="order-info-group onepx" v-if="proxyOrder.coupon && proxyOrder.coupon.id !=''">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            {{proxyOrder.coupon.name}}
                        </div>
                    </div>
                    <div class="order-info-group onepx">
                        <div><span>养护时间</span></div>
                        <div class="color-theme text-right">
                            <div>{{proxyOrder.weekName}}</div>
                            <div>
                                <span v-if="proxyOrder.timeArray" v-for="(time,index) in proxyOrder.timeArray">
                                    {{time.timeregion}}<span v-if="index!=proxyOrder.timeArray.length-1">,</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="order-info-group ">
                        <div>养护数量</div>
                        <div>{{maintainAmount}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>租赁租期</div>
                        <div>
                            {{showPaymethods}}
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>結算方式</div>
                        <div>
                            {{proxyOrder.payType==payType.monthly?'月结':'一次性付款'}}
                        </div>
                    </div>
                </div>
            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <user-footer>
                <div slot="left">
                    <div class="total-warp">
                        <span class="total">合计：</span>
                        <span class="color-warn">￥{{totalAll | toFixed}}</span>
                    </div>
                </div>
                <div slot="right" @click="createOrder">生成订单</div>
            </user-footer>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {sellApi} from 'api'
    import {weekList, goodsType, itemType, payType} from 'lib/common'
    import {Cache, commonly} from 'lib/utils'
    import MyPicker from 'components/myPickerModal/myPickerModal.vue'
    import UserFooter from 'section/user/footer/footer.vue'
    import Counter from 'components/counter/counter.vue'
    import TypeSelector from 'components/typeSelector/typeSelector.vue'
    import Collapsed from 'components/collapsed/collapsed.vue'

    export default {
        data() {
            return {
                order_id: -1,
                /*显示的最大条数*/
                maxLen: 4,
                orderInfo: null,
                weekList: weekList,
                weekName: '',
                itemType: itemType,
                proxyOrder: {},
                payType: payType,
                addressInfo: {}
            }
        },
        created() {
            this.proxyOrder = Cache.get('proxyOrder') || {};
            this.addressInfo = this.proxyOrder.addressInfo;
            console.log(this.proxyOrder, 'proxyOrder');
            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })
        },
        mounted() {
        },
        methods: {
            changeShowLen: function (maxLen) {
                this.maxLen = maxLen;
            },
            createOrder() {
                let items = [];
                let {coupon, userId, goodsList, paymethods, payType, week, time} = this.proxyOrder;
                goodsList.forEach(item => {
                    items.push(item.id);
                });
                if (commonly.isEmptyObject(coupon)) {
                    coupon = '';
                } else {
                    coupon = JSON.stringify([{id: coupon.id, type: 0}]);
                }
                sellApi.payment({
                    address_id: this.addressInfo.id,
                    cartids: items.join(','),
                    // 0 养护 1 绿植
                    coupons: coupon,
                    paymethods: JSON.stringify(paymethods),
                    paytype: payType,
                    week: week,
                    time: JSON.stringify(time),
                    type:0
                }, userId).then(result => {
                    this.$f7.alert('代下单已生成，提示用户去支付<br>可在订单列表查看订单详情', '', () => {
                        this.$router.load({url: '/sell/myOrder'});
                    })

                });

            }
        },
        computed: {
            maintainAmount() {
                if (commonly.isEmptyObject(this.proxyOrder.goodsList)) {
                    return '';
                }
                let plantType = this.proxyOrder.goodsList.length;
                let plantCount = 0;
                this.proxyOrder.goodsList.forEach(item => {
                    plantCount += item.amount;
                });
                return `${plantType}种${plantCount}颗`;
            },
            showPaymethods() {
                //免{{payInfo.paymethods.give}}个月
                //{{proxyOrder.payType==payType.monthly?'月结':'一次性付款'}}

                let payMethod = this.proxyOrder.paymethods.name;
                if (this.proxyOrder.payType == payType.onec) {
                    payMethod += `免${this.proxyOrder.paymethods.give}个月`
                }
                return payMethod;
            },
            totalAll() {
                if (commonly.isEmptyObject(this.proxyOrder.goodsList)) {
                    return 0;
                }
                let {coupon} = this.proxyOrder;
                let {buylong, give} = this.proxyOrder.paymethods;
                let moneyCount = (buylong >>> 0);
                if (this.proxyOrder.payType == payType.onec) {
                    moneyCount -= (give >>> 0);
                }
                return this.proxyOrder.goodsList.map(item => {
                    return parseFloat(item.amount) * parseFloat(item.price);
                }).reduce((a, b) => a + b) * moneyCount - coupon.discount;
            }
        },
        components: {
            Counter, UserFooter, MyPicker, TypeSelector, Collapsed, UserFooter
        },

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/store.scss";
    @import "../../css/store/pay.scss";
</style>

