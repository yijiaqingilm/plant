<template>
    <f7-page @page:reinit="reinit">
        <back title="销售中心" back-link=""></back>
        <f7-block inner class="center" no-hairlines>
            <div class="wrap">
                <ga-info utype="S" @info="info" ref="gaInfo"></ga-info>
                <div class="line-10"></div>
                <div class="menu row no-gutter">
                    <div class="col-33" @click="$router.load({url:'/sell/crm'})">
                        <div class="icon icon_crm"></div>
                        <div class="text">客户管理系统</div>
                    </div>
                    <div class="col-33" @click="$router.load({url:'/sell/bookOrderList'})">
                        <div class="icon icon_make_order">
                             <span class="book-count"
                                   v-if="bookingamount>0"
                             >{{bookingamount}}</span>
                        </div>
                        <div class="text">预约订单</div>

                    </div>
                    <div class="col-33" @click="$router.load({url:'/sell/addPlant'})">
                        <div class="icon icon_proxy"></div>
                        <div class="text">养护代下单</div>
                    </div>
                    <div class="col-33" @click="$router.load({url:'/sell/home'})">
                        <div class="icon icon_p_order"></div>
                        <div class="text">绿植代下单</div>
                    </div>

                    <div class="col-33" @click="$router.load({url:'/sell/myOrder'})">
                        <div class="icon icon_proxy_list"></div>
                        <div class="text">代下单列表</div>
                    </div>
                    <div class="col-33" @click="$router.load({url:'/sell/coupon'})">
                        <div class="icon icon_c_ticket"></div>
                        <div class="text">优惠券派发</div>
                    </div>
                    <div class="col-33" @click="$router.load({url:'/sell/performance'})">
                        <div class="icon icon_perf"></div>
                        <div class="text">绩效系统</div>
                    </div>
                    <div class="col-33" @click="$router.load({url:'/sell/profile'})">
                        <div class="icon icon_profile"></div>
                        <div class="text">个人信息</div>
                    </div>
                    <div class="col-33" @click="$router.load({url:'/gardener/service'})">
                        <div class="icon icon_give"></div>
                        <div class="text">客服中心</div>
                    </div>
                </div>
            </div>
        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  import GaInfo from 'components/gaInfo/gaInfo.vue'
  import { Cache } from 'lib/utils'

  export default {
    data () {
      return {
        bookingamount: 0
      }
    },
    created () {
      Cache.set('sell', true)
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      reinit () {
        this.$refs.gaInfo.reInit()
      },
      info (info) {
        this.bookingamount = info.bookingamount >>> 0 || 0
      }
    },
    components: {GaInfo}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/center.scss";

    .book {
        position: relative;
    }

</style>

