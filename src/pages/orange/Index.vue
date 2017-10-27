<template>
    <f7-page class="">
        <back title="年桔预售"></back>
        <div class=i-bg>
            <div class="i-context">
                <div class="i-m">
                    <span class="my-button" @click="$router.load({url:'/user/myOrder'})">查看预售订单</span>
                    <span class="my-button" @click="$router.load({url:'/orange/home'})">进入选购</span>
                </div>
                <div class='i-rule'>
                    <p> 预售规则：</p>
                    <p>1、预售期间支付一定比例金额的定金，可获得相同金额的无
                        门槛现金抵扣券，该券可用于购买株株绿植商城内除“年桔活
                        动”外的其他商品（即年桔费用 = 年桔 + 更多免费绿植商品）</p>
                    <p>2、剩余尾款可在年桔正式发售前任意时间内完成支付，正式
                        发售后进行配送</p>

                </div>
            </div>
        </div>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { orangeApi } from 'api'

  export default {
    data () {
      return {}
    },
    created: function () {
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
      orangeApi.orderNum().then((result) => {
        console.log(result, 'result')
      })
    },
    methods: {},
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/orange/index.scss";
</style>

