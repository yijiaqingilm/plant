<template>
    <f7-page name="pay" @page:reinit="backPay">
        <back title="确认付款">
        </back>
        <f7-block inner class="pay" no-hairlines>
            <div class="header">
                <div class="address-list" v-if="addressInfo!=null">
                    <div class="user-info">
                        <div>{{addressInfo.company}}</div>
                        <div class="detail">
                            <div class="name">{{addressInfo.contact}}</div>
                            <div class="phone">{{addressInfo.mobile}}</div>
                        </div>
                        <div class="address">{{addressInfo.address}}</div>
                        <div class="address-detail">{{addressInfo.addressdetail}}</div>
                    </div>
                </div>
            </div>
            <div class="content" v-if="orderInfo!=null">
                <div class="goods-wrap" v-if="orderInfo.buys&&orderInfo.buys.items.length>0">
                    <div class="goods-type">
                        <div>订单{{orderInfo.buys.id}}<span class="color-theme">(购买)</span></div>
                        <div><span>合计：</span><span class="color-warn">￥{{orderInfo.buyTotal}}</span></div>
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
                        <div>￥{{orderInfo.buyTotal}}</div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="orderInfo.leases&&orderInfo.leases.items.length>0">
                    <div class="goods-type">
                        <div>订单{{orderInfo.leases.id}} <span class="color-theme">(租赁)</span></div>
                        <div><span>合计：</span><span class="color-warn">￥{{orderInfo.leaseTotal}}</span></div>
                    </div>
                    <div class="goods-type lease-time">
                        <div>
                            <span class="color-theme">
                                <span>租赁租期</span>
                                <span>
                                    {{showPaymethods}}
                                </span>
                            </span>
                        </div>
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
                    <div class="order-info-group onepx min-height"
                         @click="goCouponList(1)">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-for="coupon in orderInfo.leases.couponitems">{{coupon.name}}</span>
                            <span v-if="orderInfo.leases.couponitems.length<=0">请选择优惠券</span><span class="gt"></span>
                        </div>
                    </div>
                    <div class="order-info-group onepx">
                        <div><span>养护时间</span></div>
                        <div class="color-theme text-right group-right">
                            <div>
                                <div>{{orderInfo.weekName}}</div>
                                <div>
                                    <span v-if="orderInfo.timeArray" v-for="(time,index) in orderInfo.timeArray">
                                    {{time.timeregion}}<span v-if="index!=orderInfo.timeArray.length-1">,</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="order-info-group ">
                        <div>租赁数量</div>
                        <div>{{orderInfo.leases.saleamount}}</div>
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
                            {{payTypeToName[orderInfo.payType].name}}
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>租赁押金</div>
                        <div>￥{{depositAll}}</div>
                    </div>
                    <div class="order-info-group">
                        <div>租赁金额</div>
                        <div>￥{{orderInfo.leaseTotal | toFixed}}</div>
                    </div>
                </div>

                <div class="line-10"></div>
                <div class="order-info-group">
                    <div>配送及人工费用</div>
                    <div>￥{{orderInfo.shipfeeTotal}}</div>
                </div>
                <div class="order-info-group">
                    <div>优惠金额</div>
                    <div>￥{{discount}}</div>
                </div>
                <div class="order-info-group" v-if="giveService">
                    <div>优惠服务</div>
                    <div>{{giveService}}</div>
                </div>
                <div class="order-info-group" v-if="giveGoods">
                    <div>优惠赠品</div>
                    <div>{{giveGoods}}</div>
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
                            <span class="color-gray" v-if="orderInfo!=null">({{orderInfo.buys&&orderInfo.buys.items.length>0 ?'含运费':'含押金;运费'}} )</span>
                        </span>
                    </div>
                </div>
                <div slot="right" @click="pay">付款</div>
            </user-footer>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { Cache, commonly } from 'lib/utils'
  import { payType, weekList, goodsType, itemType, couponGiveType, payTypeToName } from 'lib/common'
  import MyPicker from 'components/myPickerModal/myPickerModal.vue'
  import UserFooter from 'section/user/footer/footer.vue'
  import Counter from 'components/counter/counter.vue'
  import TypeSelector from 'components/typeSelector/typeSelector.vue'
  import Collapsed from 'components/collapsed/collapsed.vue'

  export default {
    data () {
      return {
        itemType: itemType,
        /* 购买显示的最大条数*/
        maxBuysLen: 2,
        maxLeaseLen: 2,
        baseLen: 2,
        isCollapsed: true,
        isCollapsedByLease: true,
        orderInfo: null,
        payType: payType,
        payTypeToName: payTypeToName,
        // 租赁总押金
        depositAll: 0,
        changeCouponList: []
      }
    },
    created () {
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
      this.orderInfo = Cache.get('orderInfo') || {}
      this.depositAll = this.orderInfo.leases.items.map((item) => item.deposit * item.amount).reduce((a, b) => (a >>> 0) + (b >>> 0), 0)
      // 删除 之前选择的 优惠券
      Cache.del('couponType0')
      Cache.del('couponType1')
    },
    mounted () {
      console.log('mounted')
    },
    methods: {
      // type : 购买 0  租赁 1
      goCouponList (type) {
        Cache.set('changeCouponList', this.changeCouponList)
        let cartids = []
        if (type === 0) {
          if (this.orderInfo.buys.items.length > 0) {
            this.orderInfo.buys.items.forEach(({cart_id}) => cartids.push(cart_id))
          }
          Cache.set('cartids', cartids.join(','))
        } else if (type === 1) {
          if (this.orderInfo.leases.items.length > 0) {
            this.orderInfo.leases.items.forEach(({cart_id}) => cartids.push(cart_id))
          }
          Cache.set('cartids', cartids.join(','))
        }
        this.$router.load({
          url: '/user/coupon/list',
          query: {
            isChange: true,
            couponType: type,
            paytype: this.orderInfo.payType,
            paymethod: this.orderInfo.paymethods.id
          }
        })
      },
      backPay: function () {
        console.log('backPay', this.orderInfo)
        let hasChangeCoupon = Cache.get('hasChangeCoupon')
        if (hasChangeCoupon) {
          this.changeCouponList = []
          let couponBuys = Cache.get('couponType0')
          if (couponBuys) {
            this.orderInfo.buys.couponitems.splice(0, 1, couponBuys)
            this.changeCouponList.push(couponBuys)
          } else {
            this.orderInfo.buys.couponitems = []
          }
          let couponLease = Cache.get('couponType1')
          if (couponLease) {
            this.orderInfo.leases.couponitems.splice(0, 1, couponLease)
            this.changeCouponList.push(couponLease)
          } else {
            this.orderInfo.leases.couponitems = []
          }
          Cache.del('hasChangeCoupon')
        }

      },
      changeShowBuysLen: function (maxLen) {
        this.maxBuysLen = maxLen
      },
      changeShowLeaseLen: function (maxLen) {
        this.maxLeaseLen = maxLen
      },
      pay: function () {
        this.goPay()

      },
      goPay: function () {
        let couponList = []
        if (this.orderInfo.buys.couponitems && this.orderInfo.buys.couponitems.length > 0) {
          let buyCoupon = {}
          buyCoupon['id'] = this.orderInfo.buys.couponitems[0].id
          buyCoupon['type'] = goodsType.buy
          couponList.push(buyCoupon)
        }
        if (this.orderInfo.leases.couponitems && this.orderInfo.leases.couponitems.length > 0) {
          let leaseCoupon = {}
          leaseCoupon['id'] = this.orderInfo.leases.couponitems[0].id
          leaseCoupon['type'] = goodsType.lease
          couponList.push(leaseCoupon)
        }

        let cartids = []
        if (this.orderInfo.buys.items.length > 0) {
          this.orderInfo.buys.items.forEach(({cart_id}) => cartids.push(cart_id))
        }
        if (this.orderInfo.leases.items.length > 0) {
          this.orderInfo.leases.items.forEach(({cart_id}) => cartids.push(cart_id))
        }

        userApi.payment({
          cartids: cartids.join(','),
          address_id: this.addressInfo.id,
          coupons: JSON.stringify(couponList),
          week: this.orderInfo.week,
          time: this.orderInfo.time,
          paymethods: JSON.stringify({
            id: this.orderInfo.paymethods.id,
            buylong: this.orderInfo.paymethods.buylong
          }),
          paytype: this.orderInfo.payType
        }).then((result) => {
          Cache.set('orderId', result.data.id)
          this.$router.load({url: '/store/changePay'})
        })
      },
      ensure: function () {
        // ensure
      },

    },
    computed: {
      addressInfo () {
        console.log('default_address', this.$store.state.default_address)
        return commonly.isEmptyObject(this.$store.state.default_address) ? null : this.$store.state.default_address
      },

      /**
       * 租赁付款总额 (包含押金)
       * @returns {number}
       */
      leaseTotalIncludeDeposit () {
        return this.orderInfo.leaseTotal + this.depositAll
      },
      // 优惠金额
      discount () {
        if (!this.orderInfo) {
          return 0
        }
        let buysCouponPrice = this.orderInfo.buys.couponitems[0] ? this.orderInfo.buys.couponitems[0].discount : 0
        let leasesCouponPrice = this.orderInfo.leases.couponitems[0] ? this.orderInfo.leases.couponitems[0].discount : 0
        return parseFloat(buysCouponPrice) + parseFloat(leasesCouponPrice)
      },
      /**
       * 付款总额(包含 购买，租赁，配送费，优惠金额)
       * @returns {*}
       */
      totalAll () {
        if (!this.orderInfo) {
          return 0
        }
        let totalAll = this.orderInfo.buyTotal + this.leaseTotalIncludeDeposit + this.orderInfo.shipfeeTotal - this.discount
        return totalAll <= 0 ? 0 : totalAll
      },
      showPaymethods () {
        // 免{{payInfo.paymethods.give}}个月
        // {{proxyOrder.payType==payType.monthly?'月结':'一次性付款'}}
        console.log('test', this.orderInfo.paymethods)
        let payMethod = this.orderInfo.paymethods.name
        if (parseInt(this.orderInfo.payType, 10) === payType.onec && this.orderInfo.paymethods.give > 0) {
          payMethod += `免${this.proxyOrder.paymethods.give}个月`
        }
        return payMethod
      },
      giveService () {
        let buysCoupon = this.orderInfo.buys.couponitems[0] || {}
        let leasesCoupon = this.orderInfo.leases.couponitems[0] || {}
        let giveService = ''
        if (buysCoupon.coupon_type === couponGiveType.service) {
          giveService += buysCoupon.num + ','
        }
        if (leasesCoupon.coupon_type === couponGiveType.service) {
          giveService += leasesCoupon.num + ','
        }
        if (giveService) {
          giveService = giveService.slice(0, -1)
        }
        return giveService
      },
      giveGoods () {
        let buysCoupon = this.orderInfo.buys.couponitems[0] || {}
        let leasesCoupon = this.orderInfo.leases.couponitems[0] || {}
        let giveGoods = ''
        if (buysCoupon.coupon_type === couponGiveType.goods) {
          giveGoods += buysCoupon.item + ','
        }
        if (leasesCoupon.coupon_type === couponGiveType.goods) {
          giveGoods += leasesCoupon.item + ','
        }
        if (giveGoods) {
          giveGoods = giveGoods.slice(0, -1)
        }

        return giveGoods
      }
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

