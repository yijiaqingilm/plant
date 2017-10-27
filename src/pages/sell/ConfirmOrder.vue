<template>
    <f7-page name="pay" @page:reinit="backPay">
        <back title="生成订单">
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
                         @click="openPicker(0)">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-if="buyCoupon && buyCoupon.id && buyCoupon.id !=''">{{buyCoupon.name}}</span>
                            <span v-else>请选择优惠券</span><span class="gt"></span>
                        </div>
                    </div>
                    <input type="hidden" class="buyCoupon">
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
                         @click="openPicker(1)">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-if="leasesCoupon && leasesCoupon.id && leasesCoupon.id !=''">{{leasesCoupon.name}}</span>
                            <span v-else>请选择优惠券</span><span class="gt"></span>
                        </div>
                    </div>
                    <input type="hidden" class="leasesCoupon">
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
                <div slot="right" @click="pay">生成订单</div>
            </user-footer>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { sellApi } from 'api'
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
        changeCouponList: [],
        couponBuyList: [],
        couponLeaseList: [],
        buyCoupon: {},
        leasesCoupon: {},
        buyCouponPicker: null,
        leasesCouponPicker: null
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
    },
    mounted () {
      console.log('mounted')
      this.$nextTick(() => {
        var that = this

        let buyCartids = []
        let leaseCartids = []
        if (this.orderInfo.buys.items.length > 0) {
          this.orderInfo.buys.items.forEach(({cart_id}) => buyCartids.push(cart_id))
        }
        if (this.orderInfo.leases.items.length > 0) {
          this.orderInfo.leases.items.forEach(({cart_id}) => leaseCartids.push(cart_id))
        }
        if (buyCartids.length > 0) {
          sellApi.couponList(1, buyCartids.join(','), this.orderInfo.payType, this.orderInfo.paymethods.id).then((result) => {
            let buyCouponInput = document.querySelectorAll('.buyCoupon')
            let couponValues = []
            let couponDisplayValues = []
            this.couponBuyList = result.data
            this.couponBuyList.forEach((item) => {
              couponValues.push(item.id)
              couponDisplayValues.push(item.name)
            })
            couponValues.push(-1)
            couponDisplayValues.push('不使用优惠券')
            var isChange = true
            this.buyCouponPicker = this.$f7.picker({
              closeByOutsideClick: false,
              input: buyCouponInput[buyCouponInput.length - 1],
              values: [that.buyCoupon.id],
              toolbarTemplate: `<div class="toolbar">
                                          <div class="toolbar-inner">
                                            <div class="left"><a href="#" class="link cancel">取消</a></div>
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
              ],
              onOpen: (picker) => {
                isChange = true
                picker.container.find('.cancel').on('click', () => {
                  isChange = false
                  picker.close()
                })
              },
              onClose ({value}) {
                console.log('关闭', value)
                if (isChange) {
                  if (parseInt(value[0], 10) !== -1) {
                    that.buyCoupon = that.couponBuyList.find((item) => parseInt(item.id, 10) === parseInt(value[0], 10))
                  } else {
                    that.buyCoupon = {}
                  }

                }

              }
            })
          })
        }
        if (leaseCartids.length > 0) {
          sellApi.couponList(1, leaseCartids.join(','), this.orderInfo.payType, this.orderInfo.paymethods.id).then((result) => {
            let leasesCouponInput = document.querySelectorAll('.leasesCoupon')
            let couponValues = []
            let couponDisplayValues = []
            this.couponLeaseList = result.data
            this.couponLeaseList.forEach((item) => {
              couponValues.push(item.id)
              couponDisplayValues.push(item.name)
            })
            couponValues.push(-1)
            couponDisplayValues.push('不使用优惠券')
            var isChange = true
            this.leasesCouponPicker = this.$f7.picker({
              closeByOutsideClick: false,
              input: leasesCouponInput[leasesCouponInput.length - 1],
              values: [that.leasesCoupon.id],
              toolbarTemplate: `<div class="toolbar">
                                          <div class="toolbar-inner">
                                            <div class="left"><a href="#" class="link cancel">取消</a></div>
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
              ],
              onOpen: (picker) => {
                isChange = true
                picker.container.find('.cancel').on('click', () => {
                  isChange = false
                  picker.close()
                })
              },
              onClose ({value}) {
                console.log('关闭', value)
                if (isChange) {
                  if (parseInt(value[0], 10) !== -1) {
                    that.leasesCoupon = that.couponLeaseList.find((item) => parseInt(item.id, 10) === parseInt(value[0], 10))
                  } else {
                    that.leasesCoupon = {}
                  }

                }

              }
            })
          })
        }

      })
    },
    methods: {
      openPicker (target) {
        // 0 是 购买的 优惠券
        if (parseInt(target, 10) === 0) {
          if (this.couponBuyList.length > 0) {
            this.buyCouponPicker.open()
          } else {
            this.$f7.alert('没有可使用的优惠券', '')
          }

        }
        // 1 是 租赁的 优惠券
        if (parseInt(target, 10) === 1) {
          if (this.couponLeaseList.length > 0) {
            this.leasesCouponPicker.open()
          } else {
            this.$f7.alert('没有可使用的优惠券', '')
          }

        }

      },

      backPay: function () {
        // back pay
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
        if (this.buyCoupon && this.buyCoupon.id && this.buyCoupon.id !== '') {
          let buyCoupon = {}
          buyCoupon['id'] = this.buyCoupon.id
          buyCoupon['type'] = goodsType.buy
          couponList.push(buyCoupon)
        }
        if (this.leasesCoupon && this.leasesCoupon.id && this.leasesCoupon.id !== '') {
          let leaseCoupon = {}
          leaseCoupon['id'] = this.leasesCoupon.id
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

        sellApi.payment({
          cartids: cartids.join(','),
          address_id: this.addressInfo.id,
          coupons: JSON.stringify(couponList),
          week: this.orderInfo.week,
          time: this.orderInfo.time,
          paymethods: JSON.stringify({
            id: this.orderInfo.paymethods.id,
            buylong: this.orderInfo.paymethods.buylong
          }),
          paytype: this.orderInfo.payType,
          type: 1
        }, Cache.get('user_id') || '').then((result) => {
          Cache.set('orderId', result.data.id)
          this.$f7.alert('代下单已生成，提示用户去支付，<br>可在订单列表查看订单详情', '', () => {
            Cache.set('orderItem', 1)
            this.$router.load({url: '/sell/myOrder'})
          })

        })

      },
      ensure: function () {
        // ensure
      },

    },
    computed: {
      addressInfo () {
        return commonly.isEmptyObject(this.$store.state.user_address) ? null : this.$store.state.user_address
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
        let buyDiscount = 0
        let leaseDiscount = 0
        if (this.buyCoupon) {
          buyDiscount += this.buyCoupon.id ? parseFloat(this.buyCoupon.discount) : 0
        }
        if (this.leasesCoupon) {
          leaseDiscount += this.leasesCoupon.id ? parseFloat(this.leasesCoupon.discount) : 0
        }

        return buyDiscount + leaseDiscount
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
        let buysCoupon = this.buyCoupon || {}
        let leasesCoupon = this.leasesCoupon || {}
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
        let buysCoupon = this.buyCoupon || {}
        let leasesCoupon = this.leasesCoupon || {}
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

