<template>
    <f7-page>
        <back title="优惠券使用帮助"></back>
        <f7-block inner no-hairlines>
            <div class="help">
                <p>1、优惠券使用条件</p>
                <p>按订单实际支付金额判断是否满足优惠券使用条件。</p>
                <p>即根据用户选择的结算方式、租期等，最终订单实际支付金额（不包括运费+押金）满足条件，即可使用。</p>
                <br>
                <p>2、订单可用优惠券数</p>
                <p>每笔订单仅可使用一张优惠券，合并订单除外，如订单内包括租赁+购买，可分别使用不同类型优惠券。</p>
                <br>
                <p>3、优惠券领取</p>
                <p>株株绿植微信平台不定期推出优惠活动，用户可通过平台领取，或免费预约销售人员上门进行服务，获取更多优惠</p>
                <br>
                <p>株株绿植客服电话：<a href="tel:0755-23619586" class="myMobile external">0755-23619586<span
                        class="phone_icon"></span></a></p>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { Cache } from 'lib/utils'
  import { couponStatus } from 'lib/common'

  export default {
    data () {
      return {}
    },
    created () {
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/couponList.scss";

</style>
