<template>
    <f7-page @page:reinit="reinit">
        <back title="养护代下单">
            <div slot="right" class="cart_del" @click="delCart"></div>
        </back>
        <f7-block inner class="proxy" no-hairlines>
            <div class="form no-border">
                <div class="user-group">
                    <div class="group ">
                        <div class="form-label">用户编号：</div>
                        <div class="form-input"><input v-model="userNumber" placeholder="请输入用户编号" type="text">
                        </div>
                    </div>
                    <div><span class="middle-button" @click="getUser">确定</span></div>
                </div>

                <div class="address" @click="goAddressList">
                    <span class="gt"></span>
                    <div class="address-group ">
                        <div class="group">
                            <div class="form-label">用户名：</div>
                            <div class="form-input"><input placeholder="" :value="userInfo.nickname" readonly
                                                           type="text">
                            </div>
                        </div>
                        <div class="group">
                            <div class="form-label">公司名称：</div>
                            <div class="form-input"><input :value="userInfo.company" placeholder="" type="text">
                            </div>
                        </div>
                        <div class="group">
                            <div class="form-label">联系人：</div>
                            <div class="form-input"><input :value="userInfo.contact" placeholder="" type="text">
                            </div>
                        </div>
                        <div class="group">
                            <div class="form-label">联系电话：</div>
                            <div class="form-input"><input :value="userInfo.mobile" placeholder="" type="text">
                            </div>
                        </div>

                        <div class="group">
                            <div class="form-label">地址：</div>
                            <div class="form-input"><input :value="userInfo.address" placeholder="" type="text">
                            </div>
                        </div>
                        <div class="group no-border">
                            <div class="form-label">详细地址：</div>
                            <div class="form-input"><input :value="userInfo.addressdetail" placeholder=""
                                                           type="text">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="line-10"></div>
            <div class="add-plant" v-if="goodsList.length<=0">
                <span class="my-button" @click="$router.back()">添加绿植</span>
            </div>
            <div class="goods-list">
                <div class="goods-item" v-for="(goods,index) in goodsList">
                    <div class="check">
                        <my-checkbox :id="'buyList_check_'+index" v-model="goods.checked"
                        ></my-checkbox>
                        <label :for="'buyList_check_'+index" class="check-label"></label>
                    </div>
                    <div class="photo"><img :src="goods.img" alt=""></div>
                    <div class="info">
                        <div class="name">{{goods.name}}</div>
                        <div class="detail">
                            <div class="price">￥{{goods.price}}</div>
                            <div class="count">
                                <counter v-model="goods.amount" :baseData="goods"
                                         @changeValue="change"></counter>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="line-10"></div>
            <div class="order-info-group onepx coupon min-height" @click="openPicker">
                <div>优惠券</div>
                <div class="group-right color-theme">
                    <span v-if="coupon && coupon.id !=''">{{coupon.name}}</span>
                    <span v-else>请选择优惠券</span><span class="gt"></span>
                </div>
            </div>
            <input type="hidden" class="coupon">
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
                <div class="group">
                    <div v-for="(type,index) in payTypes"
                         v-show="type.type==payType.onec || type.type==payType.monthly&&payInfo.paymethodsId !=orderInfo.custom.id">
                        <my-radio :id="'payType'+index" name="payType" v-model="payInfo.payType"
                                  :val="type.type"></my-radio>
                        <label :for="'payType'+index">
                            {{type.name}}
                            <span class="color-warn" v-if="type.type==payType.monthly"></span>
                            <span class="color-warn"
                                  v-if="type.type==payType.onec && payInfo.paymethods.give>0">(免{{payInfo.paymethods.give}}个月)</span>
                        </label>
                    </div>
                </div>
                <div class="title">养护时间</div>
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
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="footer">
                <div class="checkAll ">
                    <my-checkbox :id="checkAllId" v-model="checkAll"></my-checkbox>
                    <label :for="checkAllId" class="checkAll-label">全选</label></div>
                <div class="amount">
                    <div>￥{{amount}}</div>
                </div>
                <div class="pay" @click="goPay">确认订单</div>
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
    import {sellApi} from "api"
    import {payType, weekList} from 'lib/common'
    import {Cache} from 'lib/utils'
    import AddressForm from 'components/addressForm/addressForm.vue'
    import TypeSelector from "components/typeSelector/typeSelector.vue"
    import Counter from 'components/counter/counter.vue'
    // 时间类型，0 普通的(按月)，1自定义(按天)
    const timeType = {
        common: 0,
        custom: 1
    }
    export default {
        data() {
            return {
                goodsList: [],
                orderInfo: {
                    custom: [],
                    paymethods: []

                },
                zone: {
                    amStartTime: '8:00',
                    amEndTime: '12:00',
                    pmStartTime: '13:00',
                    pmEndTime: '18:00'
                },
                checkAllId: 'checkALL' + Math.random(),
                payType: payType,
                timeType: timeType,
                weekList: weekList,
                payTypes: [
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
                checkedWeekListName: '',
                couponList: [],
                coupon: {
                    id: '',
                    discount: 0,
                    name: ''
                },
                couponPicker: null,
                userNumber: ''
            }
        },
        created() {
            this.userNumber = this.userId;
            this.loadData();

        },
        mounted() {
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

                sellApi.couponList(0).then(result => {
                    let coupon_input = document.querySelectorAll('.coupon');
                    let couponValues = [];
                    let couponDisplayValues = [];
                    console.log('result', result);
                    this.couponList = result.data;
                    this.couponList.forEach((item) => {
                        couponValues.push(item.id);
                        couponDisplayValues.push(item.name);
                    });
                    this.couponPicker = this.$f7.picker({
                        closeByOutsideClick: false,
                        input: coupon_input[coupon_input.length - 1],
                        values: [that.coupon.id],
                        toolbarTemplate: `<div class="toolbar">
                                          <div class="toolbar-inner">
                                            <div class="left"></div>
                                            <div class="center">优惠券选择</div>
                                            <div class="right">
                                              <a href="#" class="link close-picker">确定</a>
                                            </div>
                                          </div>
                                       </div> `,
                        cols: [
                            {
                                textAlign: 'center',
                                values: couponValues,
                                displayValues: couponDisplayValues
                            }
                        ], onClose({value}) {
                            console.log('关闭', value);
                            that.coupon = that.couponList.find(item => item.id == value[0]);
                        }
                    });
                });


            })
        },
        methods: {
            reinit() {
                sellApi.cartList().then(result => {
                    if (this.goodsList.length === result.data.buy.carts) {

                    } else {
                        this.setData(result.data);
                    }
                });
            },
            loadData() {
                sellApi.cartList().then(result => {
                    this.setData(result.data);
                });
            },
            setData(data) {
                this.goodsList = data.carts;
                this.goodsList.forEach(item => {
                    this.$set(item, 'checked', true);
                });
                this.payMothods = data.payMothods;
                // 自定义的。
                this.orderInfo.custom = data.paymethods.find(item => {
                    return item.type == timeType.custom
                });
                // 一般通用的。
                this.orderInfo.paymethods = data.paymethods.filter(item => {
                    /*默认一个 支付方式*/
                    if (item.status) {
                        this.payInfo.paymethodsId = item.id;
                    }
                    return item.type == timeType.common
                });
                this.$watch('payInfo.paymethodsId', this.changePaymethods, {immediate: true});
            },
            openPicker() {
                this.couponPicker.open();
            },
            change({baseData, value}) {
                sellApi.editPlantToCart(baseData.id, value).then(result => {
                });
            },
            goAddressList() {
                if (this.userId != '') {
                    Cache.set("customer_id", this.userId);
                    this.$router.load({
                        url: '/user/address/list',
                        query: {isChange: true}
                    });
                } else {
                    this.$f7.alert('请输入有效的用户编号并点击确定', '', () => {

                    });
                }

            },
            getUser() {
                sellApi.getUserById(this.userNumber, 0).then(result => {
                    console.log(result, 'get user');
                    this.$store.state.user_address = result.data;
                    this.$store.state.userId = this.userNumber;
                });
            },
            goPay: function () {
                if (this.userId == '') {
                    this.$f7.alert('请输入有效的用户编号并点击确定');
                    return;
                }
                if (this.userInfo.id == '') {
                    this.$f7.alert('请选择地址');
                    return;
                }


                if (this.goodsList.length <= 0) {
                    this.$f7.alert('请选择要购买的商品');
                    return;
                }


                let items = [];
                this.goodsList.forEach(item => {
                    item.checked && items.push(item);
                });
                console.log('items', items);
                if (items.length <= 0) {
                    this.$f7.alert('请选择要购买的商品');
                    return;
                }

                let proxyOrder = {
                    coupon: this.coupon,
                    goodsList: items,
                    paymethods: this.payInfo.paymethods,
                    week: this.orderInfo.week,
                    weekName: this.checkedWeekListName,
                    payType: this.payInfo.payType,
                    userId: this.userId,
                    addressInfo: this.$store.state.user_address,
                    time: {
                        before_noon: `${this.zone.amStartTime}-${this.zone.amEndTime}`,
                        afternoon: `${this.zone.pmStartTime}-${this.zone.pmEndTime}`
                    },
                    timeArray: [
                        {name: 'before_noon', timeregion: `${this.zone.amStartTime}-${this.zone.amEndTime}`},
                        {name: 'afternoon', timeregion: `${this.zone.pmStartTime}-${this.zone.pmEndTime}`}
                    ]
                };
                Cache.set('proxyOrder', proxyOrder);
                this.$router.load({url: '/sell/proxyOrder/detail'});


            },
            getIds() {
                let ids = [];
                var checkedData = this.goodsList.filter(item => {
                    if (item.checked) {
                        ids.push(item.id);
                        return true;
                    } else {
                        return false
                    }
                });
                return ids;
            },
            delCart: function () {
                let ids = this.getIds();
                if (ids.length <= 0) {
                    this.$f7.alert('选择要删除的目标');
                    return;
                }
                this.$f7.confirm("确定删除选中的目标？", '', () => {
                    // 删除逻辑
                    sellApi.delCartItemByIds(ids.join(',')).then(result => {
                        ids.forEach(id => {
                            let index = this.goodsList.findIndex(item => item.id === id);
                            this.goodsList.splice(index, 1);
                        });

                    });
                });

            },
            changePaymethods: function (newVal, oldVal) {
                this.payInfo.paymethods = [].concat(this.orderInfo.custom).concat(this.orderInfo.paymethods).find(item => {
                    return item.id == newVal;
                });
                if (newVal == this.orderInfo.custom.id) {
                    this.payInfo.payType = this.payType.onec;
                }
            },
            getAddressInfo() {

            },
            getWeekList: function ({checkedItems}) {
                this.orderInfo.week = checkedItems.map(item => item.id).join(',');
                this.checkedWeekListName = checkedItems.map(item => item.name).join(',');
            },
        },
        computed: {
            amount: function () {
                let amount = 0;
                this.goodsList.forEach(item => {
                    if (item.checked) {
                        amount += item.price * item.amount;
                    }
                });
                return amount.toFixed(2);
            },
            checkAll: {
                get: function () {
                    if (this.goodsList.length <= 0) {
                        return false;
                    }
                    return this.goodsList.every(item => item.checked == true);
                },
                set: function (value) {
                    this.goodsList.forEach(item => {
                        item.checked = value;
                    });
                }
            },
            userInfo() {
                return this.$store.state.user_address;
            },
            userId() {
                return this.$store.state.userId;
            }
        },
        components: {AddressForm, TypeSelector, Counter}
    }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/store.scss";
    @import "../../css/sell/proxyOrder.scss";
</style>
