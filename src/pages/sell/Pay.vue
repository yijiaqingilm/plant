<template>
    <f7-page name="pay" @page:reinit="backPay">
        <back title="确认订单">
        </back>
        <f7-block inner class="pay" no-hairlines>
            <div class="header">
                <div class='no-address' v-if="addressInfo==null">
                    <span class="my-button">请选择地址信息</span>
                </div>
                <div class="address-list" v-if="addressInfo!=null">
                    <div class="user-info">
                        <div>用户编号：{{user_id}}</div>
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
                                        v-for="(item,index) in attr.items">{{item.name}}<span
                                        v-if="index!=attr.items.length-1">,</span></span></div>
                                <div class="detail">
                                    <div class="price">￥{{item.price}}</div>
                                    <div class="count">×{{item.amount}}</div>
                                </div>
                            </div>
                        </div>
                    </collapsed>

                    <div class="line-10"></div>
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
                                        v-for="(item,index) in attr.items">{{item.name}}<span
                                        v-if="index!=attr.items.length-1">,</span></span></div>
                                <div class="detail">
                                    <div class="price">￥{{item.leaseprice}}/月</div>
                                    <div class="count">×{{item.amount}}</div>
                                </div>
                            </div>
                        </div>
                    </collapsed>
                    <div class="line-10"></div>
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
                            {{payTypeToName[payInfo.payType].name}}
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
                    <div>配送及人工费用</div>
                    <div>￥{{shipfeeTotal }}</div>
                </div>

            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <user-footer>
                <div slot="left">
                    <div class="total-warp">
                        <div class="total">实付金额：</div>
                        <span class="total-context">
                            <span class="color-warn">￥{{totalAll | toFixed}}</span>
                        </span>
                    </div>
                </div>
                <div slot="right" @click="pay">确认订单</div>
            </user-footer>
        </f7-toolbar>
        <div slot="fixed" class="pay_fixed">
            <my-picker :show="showMask" v-if="orderInfo!=null" @closeModal="hideModal">
                <div class="picker-header">
                    <div>选择租赁租期</div>
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
                    <!--v-show="type.type==payType.onec || type.type==payType.monthly&&payInfo.paymethodsId !=orderInfo.custom.id"-->
                    <div class="group" v-for="(value,key) in payTypeToName" :key="value.index">
                        <div>
                            <my-radio :id="'payType'+key" name="payType" v-model="payInfo.payType"
                                      :val="key"></my-radio>
                            <label :for="'payType'+key">
                                {{value.name}}
                                <span class="color-warn" v-if="key==payType.monthly"></span>
                                <span class="color-warn"
                                      v-if="key==payType.onec && payInfo.paymethods.give>0">(免{{payInfo.paymethods.give}}个月)</span>
                            </label>
                        </div>
                        <div class="color-warn">
                            <span v-if="key==payType.monthly">￥{{monthlyByMoney |toFixed}}/月</span>
                            <span v-if="key==payType.quarter">￥{{monthlyByQuarter |toFixed}}/季</span>
                            <span v-if="key==payType.onec">￥{{onecByMoney |toFixed}}</span>
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
  import { userApi, sellApi } from 'api'
  import { Cache, commonly } from 'lib/utils'
  import { payType, weekList, goodsType, itemType, payTypeToName } from 'lib/common'
  import MyPicker from 'components/myPickerModal/myPickerModal.vue'
  import UserFooter from 'section/user/footer/footer.vue'
  import Counter from 'components/counter/counter.vue'
  import TypeSelector from 'components/typeSelector/typeSelector.vue'
  import Collapsed from 'components/collapsed/collapsed.vue'
  import { order2Mixin } from 'mixins/order2Mixin'
  // 时间类型，0 普通的(按月)，1自定义(按天)
  const timeType = {
    common: 0,
    custom: 1
  }

  export default {
    data () {
      return {
        orderInfo: null,
        payInfo: {
          payType: payType.monthly,
          addressId: null,
          orderId: -1,
          paymethodsId: 1,
          paymethods: {},
          week: null
        },
        user_id: '',

      }
    },
    mixins: [order2Mixin],
    created () {
      this.user_id = Cache.get('user_id') || ''

      this.orderInfo = Cache.get('cartList')
      // 自定义的。
      this.orderInfo.custom = this.orderInfo.paymethods.find((item) => parseInt(item.type, 10) === timeType.custom)
      // 一般通用的。
      this.orderInfo.paymethods = this.orderInfo.paymethods.filter((item) => {
        /* 默认一个 支付方式*/
        if (item.status) {
          this.payInfo.paymethodsId = item.id
        }
        return parseInt(item.type, 10) === timeType.common
      })

      this.$watch('payInfo.paymethodsId', this.changePaymethods, {immediate: true})

      this.depositAll = this.orderInfo.leases.items.map((item) => item.deposit * item.amount).reduce((a, b) => (a >>> 0) + (b >>> 0), 0)

      this.$nextTick(() => {
        var that = this
        let time1 = []
        /*eslint no-magic-numbers: 0*/
        for (let i = 8; i <= 12; i++) {
          time1.push(`${i}:00`)
        }
        let time2 = []
        for (let i = 13; i <= 20; i++) {
          time2.push(`${i}:00`)
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
          onClose ({value}) {
            that.zone.amStartTime = value[0]
          }
        })
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
          onClose ({value}) {
            that.zone.amEndTime = value[0]
          }
        })
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
          onClose ({value}) {
            that.zone.pmStartTime = value[0]
          }
        })
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
          onClose ({value}) {
            that.zone.pmEndTime = value[0]
          }
        })
      })

      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })

    },
    mounted () {
      console.log('mounted')
    },
    methods: {
      pay: function () {
        if (this.addressInfo === null) {
          this.$f7.alert('请选择收货地址')
          return
        }
        this.goPay()

      },
      goPay: function () {
        let cartids = []
        if (this.orderInfo.buys.items.length > 0) {
          this.orderInfo.buys.items.forEach(({cart_id}) => cartids.push(cart_id))
        }
        if (this.orderInfo.leases.items.length > 0) {
          this.orderInfo.leases.items.forEach(({cart_id}) => cartids.push(cart_id))
        }
        Cache.set('orderInfo', {
          buys: this.orderInfo.buys,
          leases: this.orderInfo.leases,
          address_id: this.addressInfo.id,
          leaseTotal: this.leaseTotal,
          shipfeeTotal: this.shipfeeTotal,
          buyTotal: this.buyTotal,
          week: this.payInfo.week,
          time: JSON.stringify({
            before_noon: `${this.zone.amStartTime}-${this.zone.amEndTime}`,
            afternoon: `${this.zone.pmStartTime}-${this.zone.pmEndTime}`
          }),
          timeArray: [
            {name: 'before_noon', timeregion: `${this.zone.amStartTime}-${this.zone.amEndTime}`},
            {name: 'afternoon', timeregion: `${this.zone.pmStartTime}-${this.zone.pmEndTime}`}
          ],
          paymethods: this.payInfo.paymethods,
          payType: this.payInfo.payType,
          weekName: this.checkedWeekListName,
        })
        this.$router.load({url: '/sell/confirm/order'})
      },
    },
    computed: {
      addressInfo () {
        return this.$store.state.user_address
      },
    },
    components: {
      Counter, UserFooter, MyPicker, TypeSelector, Collapsed
    },
    destroyed () {
      console.log('销毁 pay vue')
    }

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/pay.scss";
</style>

