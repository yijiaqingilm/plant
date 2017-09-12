<template>
    <f7-page name="pay" @page:reinit="backPay">
        <back title="确认付款">
        </back>
        <f7-block inner class="pay" no-hairlines>
            <div class="header">
                <div class='no-address' v-if="addressInfo==null"
                     @click="$router.load({url:'/user/address/list',query:{canChange:true}})">
                    <span class="my-button">请选择地址信息</span>
                </div>
                <div class="address-list" v-if="addressInfo!=null"
                     @click="$router.load({url:'/user/address/list',query:{canChange:true}})">
                    <div class="user-info">
                        <div>{{addressInfo.company}}</div>
                        <div class="detail">
                            <div class="name">{{addressInfo.contact}}</div>
                            <div class="phone">{{addressInfo.mobile}}</div>
                        </div>
                        <div class="address">{{addressInfo.address}}</div>
                        <div class="address-detail">{{addressInfo.addressdetail}}</div>
                    </div>
                    <div class="address-edit">
                        <span class="gt"></span>
                    </div>
                </div>
            </div>
            <div class="content" v-if="orderInfo!=null">
                <div class="goods-wrap" v-if="orderInfo.buys&&orderInfo.buys.items.length>0">
                    <div class="goods-type">
                        <div>订单{{orderInfo.buys.id}}<span class="color-theme">(购买)</span></div>
                        <div><span>合计：</span><span class="color-warn">￥{{buyTotal}}</span></div>
                    </div>
                    <collapsed class="goods-list" :listLen="orderInfo.buys.items.length"
                               @changeShowLen="changeShowBuysLen">
                        <div class="goods-item" v-for="(item,index) in orderInfo.buys.items"
                             v-show="index<maxBuysLen" :key="index">
                            <div class="goods-photo"><img :src="item.img" alt=""></div>
                            <div class="goods-info">
                                <div class="name">{{item.name}}</div>
                                <div class="type" v-if="item.type==itemType.combo">{{item.brief}}</div>
                                <div class="type" v-if="item.type==itemType.goods" v-for="attr in item.attrs">
                                    {{attr.name}}:<span
                                        v-for="item in attr.items">{{item.name}}</span></div>
                                <div class="detail">
                                    <div class="price">￥{{item.price}}</div>
                                    <div class="count">×{{item.amount}}</div>
                                </div>
                            </div>
                        </div>
                    </collapsed>

                    <div class="line-10"></div>
                    <div class="order-info-group onepx coupon min-height"
                         @click="goCouponList(0)">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-for="coupon in orderInfo.buys.couponitems">{{coupon.name}}</span>
                            <span v-if="orderInfo.buys.couponitems.length<=0">请选择优惠券</span><span class="gt"></span>
                        </div>
                    </div>
                    <div class="order-info-group ">
                        <div>购买数量</div>
                        <div>{{orderInfo.buys.saleamount}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>购买总额</div>
                        <div>￥{{buyTotal}}</div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="orderInfo.leases&&orderInfo.leases.items.length>0">
                    <div class="goods-type">
                        <div>订单{{orderInfo.leases.id}} <span class="color-theme">(租赁)</span></div>
                        <div><span>合计：</span><span class="color-warn">￥{{leaseTotal}}</span></div>
                    </div>
                    <div class="goods-type lease-time">
                        <div>
                            <span class="color-theme">
                                <span>租赁租期</span>
                                <span v-if="payInfo.paymethods.type==timeType.common">
                                    {{payInfo.paymethods.name}}
                                    <span v-if="payInfo.payType==payType.onec && payInfo.paymethods.give>0">免{{payInfo.paymethods.give}}个月</span>
                                </span>
                                <span v-if="payInfo.paymethods.type==timeType.custom">{{payInfo.paymethods.buylong}}天</span>
                            </span>
                        </div>
                        <div><span class="apply-button" @click="showModal">查看更多租赁价格</span></div>
                    </div>
                    <collapsed class="goods-list" :listLen="orderInfo.leases.items.length"
                               @changeShowLen="changeShowLeaseLen">
                        <div class="goods-item" v-for="(item,index) in orderInfo.leases.items"
                             v-show="index<maxLeaseLen" :key="index">
                            <div class="goods-photo"><img :src="item.img" alt=""></div>
                            <div class="goods-info">
                                <div class="name">{{item.name}}</div>
                                <div class="type" v-if="item.type==itemType.combo">{{item.brief}}</div>
                                <div class="type" v-if="item.type==itemType.goods" v-for="attr in item.attrs">
                                    {{attr.name}}:<span
                                        v-for="item in attr.items">{{item.name}}</span></div>
                                <div class="detail">
                                    <div class="price">￥{{item.leaseprice}}/月</div>
                                    <div class="count">×{{item.amount}}</div>
                                </div>
                            </div>
                        </div>
                    </collapsed>
                    <div class="line-10"></div>
                    <div class="order-info-group onepx min-height"
                         @click="goCouponList(1)">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-for="coupon in orderInfo.leases.couponitems">{{coupon.name}}</span>
                            <span v-if="orderInfo.leases.couponitems.length<=0">请选择优惠券</span><span class="gt"></span>
                        </div>
                    </div>
                    <div class="order-info-group onepx" @click="showWeekModal">
                        <div><span>养护时间</span></div>
                        <div class="color-theme text-right group-right">
                            <div>
                                <div>{{checkedWeekListName}}</div>
                                <div>{{zone.amStartTime}}-{{zone.amEndTime}},{{zone.pmStartTime}}-{{zone.pmEndTime}}
                                </div>
                            </div>
                            <span class="gt"></span>
                        </div>
                    </div>
                    <div class="order-info-group ">
                        <div>租赁数量</div>
                        <div>{{orderInfo.leases.saleamount}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>租赁租期</div>
                        <div>
                        <span v-if="payInfo.paymethods.type==timeType.common">
                                    {{payInfo.paymethods.name}}
                                    <span v-if="payInfo.payType==payType.onec && payInfo.paymethods.give>0">免{{payInfo.paymethods.give}}个月</span>
                        </span>
                            <span v-if="payInfo.paymethods.type==timeType.custom">{{payInfo.paymethods.buylong}}天</span>
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>結算方式</div>
                        <div>
                            <span v-if="payInfo.payType==payType.monthly">月结</span>
                            <span v-if="payInfo.payType==payType.onec">一次性付款</span>
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>租赁押金</div>
                        <div>￥{{depositAll}}</div>
                    </div>
                    <div class="order-info-group">
                        <div>租赁金额</div>
                        <div>￥{{leaseTotal | toFixed}}</div>
                    </div>
                </div>

                <div class="line-10"></div>
                <div class="order-info-group">
                    <div>配送费用</div>
                    <div>￥{{shipfeeTotal }}</div>
                </div>
                <div class="order-info-group">
                    <div>优惠金额</div>
                    <div>￥{{discount}}</div>
                </div>

            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <user-footer>
                <div slot="left">
                    <div class="total-warp">
                        <div class="total">实付金额：</div>
                        <span class="total-context">
                            <span class="color-warn">￥{{totalAll}}</span>
                        </span>
                    </div>
                </div>
                <div slot="right" @click="pay">生成订单</div>
            </user-footer>
        </f7-toolbar>
        <div slot="fixed" class="pay_fixed">
            <my-picker :show="showMask" v-if="orderInfo!=null" @closeModal="hideModal">
                <div class="picker-header">
                    <div>选择租期期限</div>
                    <!--<div @click="closeModal" class="close-modal"><span class="apply-button">确定</span></div>-->
                </div>
                <div class="picker-content">
                    <div class="title">租赁期限</div>
                    <div class="group">
                        <div class="item" v-for="(paymethod,index) in orderInfo.paymethods">
                            <my-radio :id="'payMethod'+index" name="paymethod" :val="paymethod.id"
                                      v-model="payInfo.paymethodsId"></my-radio>
                            <label :for="'payMethod'+index">{{paymethod.name}}</label>
                        </div>
                    </div>
                    <div class="custom" v-if="false">
                        <div>
                            <my-radio id="custom" name="paymethod" :val="orderInfo.custom.id"
                                      v-model="payInfo.paymethodsId"></my-radio>
                            <label for="custom">{{orderInfo.custom.name}}</label>
                        </div>
                        <div class="counter">
                            <counter v-model="orderInfo.custom.buylong"></counter>
                            <div>天</div>
                        </div>
                    </div>
                    <div class="title">结算方式</div>
                    <div class="group" v-for="(type,index) in payMothods"
                         v-show="type.type==payType.onec || type.type==payType.monthly&&payInfo.paymethodsId !=orderInfo.custom.id">
                        <div>
                            <my-radio :id="'payType'+index" name="payType" v-model="payInfo.payType"
                                      :val="type.type"></my-radio>
                            <label :for="'payType'+index">
                                {{type.name}}
                                <span class="color-warn" v-if="type.type==payType.monthly"></span>
                                <span class="color-warn"
                                      v-if="type.type==payType.onec && payInfo.paymethods.give>0">(免{{payInfo.paymethods.give}}个月)</span>
                            </label>
                        </div>
                        <div class="color-warn">
                            <span v-if="type.type==payType.monthly">￥{{monthlyByMoney |toFixed}}/月</span>
                            <span v-if="type.type==payType.onec">￥{{onecByMoney |toFixed}}</span>
                        </div>
                    </div>
                    <!--<div class="title">需付押金:￥{{depositAll}}</div>-->
                </div>
                <div class="line-50"></div>
                <user-footer>
                    <div slot="left" class="footer-line-center">
                        <span class="total">金额：</span>
                        <span class="color-warn">￥{{leaseTotal | toFixed}}</span>
                    </div>
                    <div slot="right" @click="closeModal">确定</div>
                </user-footer>
            </my-picker>
            <my-picker :show="showWeek" v-if="orderInfo!=null">
                <div class="picker-header">
                    <div>请选择养护时间</div>
                    <div @click="colorWeekModal" class="close-modal"><span class="color-theme">确定</span></div>
                </div>
                <div class="picker-content">
                    <type-selector class="week-list" :items="weekList" :multi="true"
                                   :checkAll="true"
                                   @changeItem="getWeekList"></type-selector>
                    <div class="time-zones">
                        <div class="zones-title">
                            <div>时间区间:</div>
                            <div class="color-light-gray">(可修改)</div>
                        </div>
                        <div class="zones-context">
                            <div class="zones-group">
                                <input type="text" readonly id="zone1" placeholder="上午开始时间" class="time-input">
                                <div class="line"></div>
                                <input type="text" readonly id="zone2" value="" placeholder="上午结束时间"
                                       class="time-input">
                            </div>
                            <div class="zones-group">
                                <input type="text" readonly id="zone3" value="" placeholder="下午开始时间"
                                       class="time-input">
                                <div class="line"></div>
                                <input type="text" readonly id="zone4" value="" placeholder="下午结束时间"
                                       class="time-input">
                            </div>
                        </div>
                    </div>
                </div>
            </my-picker>
        </div>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {userApi, sellApi} from 'api'
    import {Cache, commonly} from 'lib/utils'
    import {payType, weekList, goodsType, itemType} from 'lib/common'
    import MyPicker from 'components/myPickerModal/myPickerModal.vue'
    import UserFooter from 'section/user/footer/footer.vue'
    import Counter from 'components/counter/counter.vue'
    import TypeSelector from 'components/typeSelector/typeSelector.vue'
    import Collapsed from 'components/collapsed/collapsed.vue'

    // 时间类型，0 普通的(按月)，1自定义(按天)
    const timeType = {
        common: 0,
        custom: 1
    }

    export default {
        data() {
            return {
                itemType: itemType,
                /*购买显示的最大条数*/
                maxBuysLen: 2,
                maxLeaseLen: 2,
                baseLen: 2,
                isCollapsed: true,
                isCollapsedByLease: true,
                showMask: false,
                showWeek: false,
                orderInfo: null,
                days: 1,
                payType: payType,
                timeType: timeType,
                weekList: weekList,
                payMothods: [
                    {type: payType.monthly, isuse: true, name: '月结'},
                    {type: payType.onec, isuse: false, name: '一次性'}
                ],
                payInfo: {
                    payType: payType.monthly,
                    addressId: null,
                    orderId: -1,
                    paymethodsId: 1,
                    paymethods: {},
                    week: null
                },
                // 租赁总押金
                depositAll: 0,
                checkedWeekListName: [],
                zone: {
                    amStartTime: '8:00',
                    amEndTime: '12:00',
                    pmStartTime: '13:00',
                    pmEndTime: '18:00'
                },
                changeCouponList: []
            }
        },
        created() {
            this.orderInfo = Cache.get('cartList');
            console.log(Cache.get('cartList'), 'pay Order info');
            // 自定义的。
            this.orderInfo.custom = this.orderInfo.paymethods.find(item => {
                return item.type == timeType.custom
            });
            // 一般通用的。
            this.orderInfo.paymethods = this.orderInfo.paymethods.filter(item => {
                /*默认一个 支付方式*/
                if (item.status) {
                    this.payInfo.paymethodsId = item.id;
                }
                return item.type == timeType.common
            });

            // 默认推送优惠券
            /*if (this.orderInfo.leases && this.orderInfo.leases.couponitems.length > 0) {
                this.changeCouponList.push(this.orderInfo.leases.couponitems[0]);
            }
            if (this.orderInfo.buys && this.orderInfo.buys.couponitems.length > 0) {
                this.changeCouponList.push(this.orderInfo.buys.couponitems[0]);
            }*/


            this.$watch('payInfo.paymethodsId', this.changePaymethods, {immediate: true});


            this.depositAll = this.orderInfo.leases.items.map(item => item.deposit * item.amount).reduce((a, b) => {
                return (a >>> 0) + (b >>> 0);
            }, 0);


            this.$nextTick(() => {
                var that = this;
                let time1 = [];
                for (let i = 8; i <= 12; i++) {
                    time1.push(`${i}:00`);
                }
                let time2 = [];
                for (let i = 13; i <= 20; i++) {
                    time2.push(`${i}:00`);
                }
                var pickerDevice = this.$f7.picker({
                    input: '#zone1',
                    value: [that.zone.amStartTime],
                    cols: [
                        {
                            textAlign: 'center',
                            values: time1
                        }
                    ],
                    toolbarCloseText: '确定',
                    scrollToInput: false,
                    /*onChange(p, values, displayValues){
                     console.log('p', p, 'values', values, 'display', displayValues);
                     },*/
                    onClose({value}) {
                        that.zone.amStartTime = value[0];
                    }
                });
                var pickerDevice2 = this.$f7.picker({
                    input: '#zone2',
                    value: [that.zone.amEndTime],
                    cols: [
                        {
                            textAlign: 'center',
                            values: time1
                        }
                    ],
                    toolbarCloseText: '确定',
                    scrollToInput: false,
                    onClose({value}) {
                        that.zone.amEndTime = value[0];
                    }
                });
                var pickerDevice3 = this.$f7.picker({
                    input: '#zone3',
                    value: [that.zone.pmStartTime],
                    cols: [
                        {
                            textAlign: 'center',
                            values: time2
                        }
                    ],
                    toolbarCloseText: '确定',
                    scrollToInput: false,
                    onClose({value}) {
                        that.zone.pmStartTime = value[0];
                    }
                });
                var pickerDevice4 = this.$f7.picker({
                    input: '#zone4',
                    value: [that.zone.pmEndTime],
                    cols: [
                        {
                            textAlign: 'center',
                            values: time2
                        }
                    ],
                    toolbarCloseText: '确定',
                    scrollToInput: false,
                    onClose({value}) {
                        that.zone.pmEndTime = value[0];
                    }
                });
            })

            window.wx.ready(() => {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:QZone", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:appMessage", "menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            })

            // 删除 之前选择的 优惠券
            Cache.del('couponType0');
            Cache.del('couponType1');
        },
        mounted() {
            console.log('mounted');
        },
        methods: {
            hideModal() {
                this.showMask = false;
            },
            alertDeposit() {
                this.$f7.alert('租赁期满将进行绿植核查，<br>如无损坏缺失押金将全额退还');
            },
            alertShipfee() {
                this.$f7.alert(`租赁：月租金满${this.orderInfo.maxleaseshipfee}元免运费<br>购买：运费最低${this.orderInfo.minshipfee}元`);
            },
            // type : 购买 0  租赁 1
            goCouponList(type) {
                Cache.set('changeCouponList', this.changeCouponList);
                let cartids = [];
                if (this.orderInfo.buys.items.length > 0) {
                    this.orderInfo.buys.items.forEach(({cart_id}) => cartids.push(cart_id));
                }
                if (this.orderInfo.leases.items.length > 0) {
                    this.orderInfo.leases.items.forEach(({cart_id}) => cartids.push(cart_id));
                }
                Cache.set('cartids', cartids.join(','));
                this.$router.load({url: '/user/coupon/list', query: {isChange: true, couponType: type}});
            },
            backPay: function () {
                console.log('backPay', this.orderInfo);
                let hasChangeCoupon = Cache.get("hasChangeCoupon");
                if (hasChangeCoupon) {
                    this.changeCouponList = [];
                    let couponBuys = Cache.get("couponType0");
                    if (couponBuys) {
                        this.orderInfo.buys.couponitems.splice(0, 1, couponBuys);
                        this.changeCouponList.push(couponBuys);
                    }
                    let couponLease = Cache.get("couponType1");
                    if (couponLease) {
                        this.orderInfo.leases.couponitems.splice(0, 1, couponLease);
                        this.changeCouponList.push(couponLease);
                    }
                    Cache.del("hasChangeCoupon");
                }


            },
            changeShowBuysLen: function (maxLen) {
                this.maxBuysLen = maxLen;
            },
            changeShowLeaseLen: function (maxLen) {
                this.maxLeaseLen = maxLen;
            },
            pay: function () {
                if (this.addressInfo == null) {
                    this.$f7.alert('请选择收货地址');
                    return;
                }
                this.goPay();


            },
            goPay: function () {
                let couponList = [];
                if (this.orderInfo.buys.couponitems && this.orderInfo.buys.couponitems.length > 0) {
                    let buyCoupon = {};
                    buyCoupon["id"] = this.orderInfo.buys.couponitems[0].id;
                    buyCoupon["type"] = goodsType.buy;
                    couponList.push(buyCoupon);
                }
                if (this.orderInfo.leases.couponitems && this.orderInfo.leases.couponitems.length > 0) {
                    let leaseCoupon = {};
                    leaseCoupon["id"] = this.orderInfo.leases.couponitems[0].id;
                    leaseCoupon["type"] = goodsType.lease;
                    couponList.push(leaseCoupon);
                }

                let cartids = [];
                if (this.orderInfo.buys.items.length > 0) {
                    this.orderInfo.buys.items.forEach(({cart_id}) => cartids.push(cart_id));
                }
                if (this.orderInfo.leases.items.length > 0) {
                    this.orderInfo.leases.items.forEach(({cart_id}) => cartids.push(cart_id));
                }

                sellApi.payment({
                    cartids: cartids.join(','),
                    address_id: this.addressInfo.id,
                    coupons: JSON.stringify(couponList),
                    week: this.payInfo.week,
                    time: JSON.stringify({
                        before_noon: `${this.zone.amStartTime}-${this.zone.amEndTime}`,
                        afternoon: `${this.zone.pmStartTime}-${this.zone.pmEndTime}`
                    }),
                    paymethods: JSON.stringify({
                        id: this.payInfo.paymethods.id,
                        buylong: this.payInfo.paymethods.buylong
                    }),
                    paytype: this.payInfo.payType,
                    type:1
                }, Cache.get('user_id') || '').then(result => {
                    Cache.set('orderId', result.data.id);
                    this.$f7.alert('代下单已生成，提示用户去支付，<br>可在订单列表查看订单详情', '', () => {
                        this.$router.load({url: '/sell/myOrder'});
                    });

                });
            },
            showModal: function () {
                this.showMask = true;
            },
            closeModal: function () {
                if (payType.monthly == this.payInfo.payType) {
                    this.$f7.confirm(`您选择了月结支付方式，<br>本次付款金额为月结金额+押金<br> \
                        下月月结金额需进行线下支付，<br>将会有工作人员与您提前联系<br>下月月结金额为${this.monthlyByMoney}`, '', () => {
                        this.showMask = false;
                    });

                } else {
                    this.showMask = false;
                }

            },
            ensure: function () {

            },
            showWeekModal: function () {
                this.showWeek = true;
            },
            colorWeekModal: function () {
                this.showWeek = false;
            },
            changePaymethods: function (newVal, oldVal) {
                this.payInfo.paymethods = [].concat(this.orderInfo.custom).concat(this.orderInfo.paymethods).find(item => {
                    return item.id == newVal;
                });
                if (newVal == this.orderInfo.custom.id) {
                    this.payInfo.payType = this.payType.onec;
                }
            },
            getWeekList: function ({checkedItems}) {
                this.payInfo.week = checkedItems.map(item => item.id).join(',');
                this.checkedWeekListName = checkedItems.map(item => item.name).join(',');
            },
        },
        computed: {
            /*总运费*/
            shipfeeTotal() {
                let {buylong, give} = this.payInfo.paymethods;
                console.log('buylong', buylong);
                console.log('give', give);
                if (!this.orderInfo) {
                    return 0;
                }
                let leaseShipfeeTotal = buylong * parseFloat(this.orderInfo.leaseshipfee);
                if (leaseShipfeeTotal >= parseFloat(this.orderInfo.maxleaseshipfee)) {
                    leaseShipfeeTotal = 0;
                } else if (leaseShipfeeTotal <= parseFloat(this.orderInfo.minshipfee) && leaseShipfeeTotal > 0) {
                    leaseShipfeeTotal = this.orderInfo.minshipfee;
                }
                return Math.round(parseFloat(this.orderInfo.saleshipfee) + parseFloat(leaseShipfeeTotal));

            },
            addressInfo() {
                console.log('default_address', this.$store.state.default_address);
                return commonly.isEmptyObject(this.$store.state.default_address) ? null : this.$store.state.default_address;
            },
            /**
             * 每月的租赁价格
             * @returns {number}
             */
            monthlyByMoney() {
                let {buylong, give} = this.payInfo.paymethods;
                if (this.orderInfo.leases) {
                    return this.orderInfo.leases.items.map(item => item.leaseprice * item.amount).reduce((a, b) => {
                        return parseFloat(a) + parseFloat(b);
                    }, 0);
                } else {
                    return 0;
                }

            },
            /**
             * 一次性付款价格
             * @returns {number}
             */
            onecByMoney() {
                let {buylong, give, type} = this.payInfo.paymethods;
                if (this.orderInfo.leases) {
                    return this.orderInfo.leases.items.map(item => {
                        if (type == timeType.common) {
                            return item.leaseprice * item.amount;
                        } else if (type == timeType.custom) {
                            return item.leaseprice_day * item.amount;
                        } else {
                            return 0;
                        }

                    }).reduce((a, b) => {
                        return parseFloat(a) + parseFloat(b);
                    }, 0) * ((buylong >>> 0) - (give >>> 0));
                } else {
                    return 0;
                }

            },
            /**
             * 第一次 租赁付款总额 （按月只计算 当前月）
             * @returns {*}
             */
            leaseTotal() {
                // let {buylong}=this.payInfo.paymethods;
                let payType = this.payInfo.payType >>> 0;
                if (payType == this.payType.monthly) {
                    return this.monthlyByMoney;
                } else if (payType == this.payType.onec) {
                    return this.onecByMoney;
                    ;
                } else {
                    return 0;
                }
            },
            /**
             * 租赁付款总额 (包含押金)
             * @returns {number}
             */
            leaseTotalIncludeDeposit() {
                return this.leaseTotal + this.depositAll;
            },
            /**
             * 购买总额
             * @return{number}
             *
             */
            buyTotal() {
                if (!this.orderInfo) {
                    return 0;
                }
                return this.orderInfo.buys.items.map(item => item.amount * item.price).reduce((a, b) => {
                    return parseFloat(a) + parseFloat(b);
                }, 0);
            },
            // 优惠金额
            discount() {
                if (!this.orderInfo) {
                    return 0;
                }
                let buysCouponPrice = this.orderInfo.buys.couponitems[0] ? this.orderInfo.buys.couponitems[0].discount : 0;
                let leasesCouponPrice = this.orderInfo.leases.couponitems[0] ? this.orderInfo.leases.couponitems[0].discount : 0;
                return parseFloat(buysCouponPrice) + parseFloat(leasesCouponPrice);
            },
            /**
             * 付款总额(包含 购买，租赁，配送费，优惠金额)
             * @returns {*}
             */
            totalAll() {
                if (!this.orderInfo) {
                    return 0;
                }
                let totalAll = this.buyTotal + this.leaseTotalIncludeDeposit + this.shipfeeTotal - this.discount;
                return totalAll <= 0 ? 0 : totalAll;
            }
        },
        components: {
            Counter, UserFooter, MyPicker, TypeSelector, Collapsed
        },
        destroyed() {
            console.log('销毁 pay vue');
        }

    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/store.scss";
    @import "../../css/store/pay.scss";
</style>

