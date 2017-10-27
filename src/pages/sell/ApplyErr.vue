<template>
    <f7-page>
        <back title="销售申请"></back>
        <f7-block inner class="apply" no-hairlines>
            <div class="wrap">
                <div class="apply-msg">
                    <div class="header">
                        <h4 class="color-warn">审核失败 !</h4>
                        <div class="color-black">失败原因:{{getUserInfo.seller.reason}}</div>
                    </div>
                    <div>
                        <div class="my-button" @click="$router.load({url:'/sell/apply'})">重新申请</div>
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
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
    methods: {},
    computed: {
      getUserInfo: function () {
        return this.$store.state.userInfo
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/apply.scss";
</style>

