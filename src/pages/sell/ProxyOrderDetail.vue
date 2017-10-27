<template>
    <f7-page>
        <back title="订单详情">
        </back>
        <f7-block inner class="pay" no-hairlines>
            <div class="header">
                <div class="address-list">
                    <div class="user-info">
                        <div>用户编号:{{proxyOrder.userId}}</div>
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
                                    <div class="name">{{item.name}}</div>
                                    <div class="detail">
                                        <div class="color-warn">￥{{item.price}}</div>
                                        <div class="count">×{{item.amount}}</div>
                                    </div>

                                </div>
                            </div>
                        </collapsed>
                    </div>
                    <div class="line-10"></div>
                    <div class="order-info-group onepx coupon min-height" @click="openPicker">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-if="coupon && coupon.id!==void(0) && coupon.id !=''">{{coupon.name}}</span>
                            <span v-else>请选择优惠券</span><span class="gt"></span>
                        </div>
                    </div>
                    <input type="hidden" class="coupon">
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
                        <div>养护期限</div>
                        <div>
                            {{showPaymethods}}
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>結算方式</div>
                        <div>
                            {{payTypeToName[proxyOrder.payType].name}}
                        </div>
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
  import { sellApi } from 'api'
  import { weekList, goodsType, itemType, payType, couponGiveType, payTypeToName } from 'lib/common'
  import { Cache, commonly } from 'lib/utils'
  import MyPicker from 'components/myPickerModal/myPickerModal.vue'
  import UserFooter from 'section/user/footer/footer.vue'
  import Counter from 'components/counter/counter.vue'
  import TypeSelector from 'components/typeSelector/typeSelector.vue'
  import Collapsed from 'components/collapsed/collapsed.vue'

  export default {
    data () {
      return {
        order_id: -1,
        /* 显示的最大条数*/
        maxLen: 4,
        orderInfo: null,
        weekList: weekList,
        weekName: '',
        itemType: itemType,
        proxyOrder: {},
        payTypeToName: payTypeToName,
        payType: payType,
        addressInfo: {},
        couponList: [],
        coupon: {
          id: '',
          discount: 0,
          name: ''
        },
        couponPicker: null,
      }
    },
    created () {
      this.proxyOrder = Cache.get('proxyOrder') || {}
      this.addressInfo = this.proxyOrder.addressInfo
      console.log(this.proxyOrder, 'proxyOrder')
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    mounted () {
      this.$nextTick(() => {
        var that = this
        let items = []
        let {goodsList} = this.proxyOrder
        goodsList.forEach((item) => items.push(item.id))
        let step = 500
        setTimeout(() => {
          sellApi.couponList(0, items.join(','), this.proxyOrder.payType, this.proxyOrder.paymethods.id).then((result) => {
            let coupon_input = document.querySelectorAll('.coupon')
            let couponValues = []
            let couponDisplayValues = []
            console.log('result', result)
            this.couponList = result.data
            this.couponList.forEach((item) => {
              couponValues.push(item.id)
              couponDisplayValues.push(item.name)
            })
            couponValues.push(-1)
            couponDisplayValues.push('不使用优惠券')
            var isChange = true
            this.couponPicker = this.$f7.picker({
              closeByOutsideClick: false,
              input: coupon_input[coupon_input.length - 1],
              values: [that.coupon.id],
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
                    that.coupon = that.couponList.find((item) => parseInt(item.id, 10) === parseInt(value[0], 10))
                  } else {
                    that.coupon = {}
                  }

                }

              }
            })
          })
        }, step)

      })
    },
    methods: {
      openPicker () {
        if (this.couponList.length > 0) {
          this.couponPicker.open()
        } else {
          this.$f7.alert('没有可使用的优惠券', '')
        }

      },
      changeShowLen: function (maxLen) {
        this.maxLen = maxLen
      },
      createOrder () {
        let items = []
        let {userId, goodsList, paymethods, payType, week, time} = this.proxyOrder
        goodsList.forEach((item) => items.push(item.id))
        let coupon = ''
        if (commonly.isEmptyObject(this.coupon) || !this.coupon.id) {
          coupon = ''
        } else {
          coupon = JSON.stringify([{id: this.coupon.id, type: 1}])
        }
        sellApi.payment({
          address_id: this.addressInfo.id,
          cartids: items.join(','),
          coupons: coupon,
          paymethods: JSON.stringify(paymethods),
          paytype: payType,
          week: week,
          time: JSON.stringify(time),
          // 0 养护 1 绿植
          type: 0
        }, userId).then((result) => {
          this.$f7.alert('代下单已生成，提示用户去支付<br>可在订单列表查看订单详情', '', () => {
            /*eslint no-magic-numbers:0*/
            Cache.set('orderItem', 2)
            this.$router.load({url: '/sell/myOrder'})
          })

        })

      }
    },
    computed: {
      // 优惠金额
      discount () {
        if (!this.coupon) {
          return 0
        }

        let couponPrice = this.coupon.id ? this.coupon.discount : 0
        return couponPrice
      },
      // 第一次 付款总额 包括 优惠金额
      totalAll () {
        if (!this.proxyOrder) {
          return 0
        }
        let total = parseFloat(this.proxyOrder.totalAll) - parseFloat(this.discount)

        return total > 0 ? total : 0.01
      },
      maintainAmount () {
        if (commonly.isEmptyObject(this.proxyOrder.goodsList)) {
          return ''
        }
        let plantType = this.proxyOrder.goodsList.length
        let plantCount = 0
        this.proxyOrder.goodsList.forEach((item) => {
          plantCount += item.amount
        })
        return `${plantType}种${plantCount}棵`
      },
      showPaymethods () {
        // 免{{payInfo.paymethods.give}}个月
        // {{proxyOrder.payType==payType.monthly?'月结':'一次性付款'}}

        let payMethod = this.proxyOrder.paymethods.name
        if (parseInt(this.proxyOrder.payType, 10) === payType.onec && this.proxyOrder.paymethods.give > 0) {
          payMethod += `免${this.proxyOrder.paymethods.give}个月`
        }
        return payMethod
      },
      giveService () {
        let giveService = ''
        if (this.coupon.coupon_type === couponGiveType.service) {
          giveService += this.coupon.num
        }
        return giveService
      },
      giveGoods () {
        let giveGoods = ''
        if (this.coupon.coupon_type === couponGiveType.goods) {
          giveGoods += this.coupon.item
        }
        return giveGoods
      }

    },
    components: {
      Counter, UserFooter, MyPicker, TypeSelector, Collapsed
    },

  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/store/pay.scss";
</style>

