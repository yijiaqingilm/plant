<template>
    <f7-page class="changePay">
        <back title="选择支付方式"></back>
        <div class="my-list">
            <div class="my-item" @click="pay(payWay.wxPay)">
                <div class="left"><img src="../../assets/icon_wxpay.png" alt="" class="icon-item-left"></div>
                <div class="right">
                    <div>微信支付<span class="color-warn">(推荐)</span></div>
                    <div class="color-gray">微信安全支付</div>
                </div>
            </div>
        </div>
        <div class="my-title">其他支付方式</div>
        <div class="my-list">
            <div class="my-item" @click="pay(payWay.unionPay)">
                <div class="left"><img src="../../assets/icon_unionpay.png" alt="" class="icon-item-left"></div>
                <div class="right">
                    <div>网银转账</div>
                    <div class="color-gray">需提供付款凭证</div>
                </div>
            </div>
            <div class="my-item" @click="pay(payWay.cashpay)">
                <div class="left"><img src="../../assets/icon_cashpay.png" alt="" class="icon-item-left"></div>
                <div class="right">
                    <div>现金支付</div>
                    <div class="color-gray">需等财务核审</div>
                </div>
            </div>
        </div>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import wx from 'wx'
  import { payWay } from 'lib/common'
  import { userApi } from 'api'
  import { Cache } from 'lib/utils'

  export default {
    data () {
      return {
        testClass: false,
        orderId: -1,
        wxInfo: {},
        payWay: payWay,
        type: 1
      }
    },
    created () {
      this.orderId = Cache.get('orderId')
      this.type = Cache.get('orderType') || 1
      // 暂时隐藏
      userApi.wxPrepay(this.orderId).then((result) => {
        this.wxInfo = result.data
        // Cache.del("orderId");
      })
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      pay (payType) {
        var that = this
        switch (payType) {
          case payWay.wxPay:
            wx.chooseWXPay({
              ...that.wxInfo,
              success: function (res) {
                // 支付成功后的回调函数
                that.$f7.alert('您已进行了微信支付完成后，<br>可在我的订单查看订单状态', '', () => {
                  Cache.set('orderItem', this.type)
                  that.$router.load({url: '/user/myOrder'})

                })
              }, fail: function (res) {
                that.$f7.alert(JSON.stringify(res))
              }
            })
            break
          case payWay.unionPay:
          case payWay.cashpay:
            this.$f7.confirm('该支付方式由财务进行线下对接，<br>支付后需等待确认，<br>可在我的订单查询到支付状态更新', '', () => {
              userApi.prepay({
                id: this.orderId,
                paymenthod: payType
              }).then((result) => {
                Cache.set('orderItem', this.type)
                this.$router.load({url: '/user/myOrder'})

              })
            })
            break
          default:
          // default
        }
      }
    },
    computed: {},
    components: {}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/store/changePay.scss";
</style>
