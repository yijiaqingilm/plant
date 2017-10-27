<template>
    <f7-page>
        <back title="销售申请" back-link=""></back>
        <f7-block inner class="applyBefore" no-hairlines>
            <div class="content">
                <p>您还不是销售人员</p>
                <p>申请成为销售人员</p>
                <f7-link href="/sell/apply">
                    <div class="my-button">确定</div>
                </f7-link>
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
    computed: {
      getUserInfo () {
        return this.$store.state.userInfo
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/applyBefore.scss";
</style>

