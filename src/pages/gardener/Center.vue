<template>
    <f7-page>
        <back title="养护中心" back-link=""></back>
        <f7-block inner class="center" no-hairlines>
            <div class="wrap">
                <ga-info></ga-info>
                <div class="line-10"></div>
                <div class="menu row no-gutter">
                    <div class="col-33" @click="$router.load({url:'/gardener/orderList'})">
                        <div class="icon icon_order"></div>
                        <div class="text">订单列表</div>
                    </div>
                    <!--<div class="col-33">
                        <div class="icon icon_time"></div>
                        <div class="text">请假系统</div>
                    </div>-->
                    <div class="col-33" @click="$router.load({url:'/gardener/performance'})">
                        <div class="icon icon_perf"></div>
                        <div class="text">绩效系统</div>
                    </div>
                    <div class="col-33" @click="$router.load({url:'/gardener/replaceList'})">
                        <div class="icon icon_exchange"></div>
                        <div class="text">绿植更换</div>
                    </div>

                    <div class="col-33" @click="$router.load({url:'/gardener/profile'})">
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
    methods: {
      userInfo (user) {
        //  ?
      }
    },
    components: {GaInfo}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/center.scss";
</style>

