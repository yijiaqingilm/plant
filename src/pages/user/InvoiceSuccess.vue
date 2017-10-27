<template>
    <f7-page>
        <back title="发票申请"></back>
        <f7-block inner class="invoiceSuccess" no-hairlines>
            <my-msg>
                <div slot="header">
                    <p>发票申请成功</p>
                    <p>我们将于3-5个工作日后为您寄出</p>
                </div>
                <div slot="main">
                    <span class="my-button" @click="goHome">确定</span>
                </div>
            </my-msg>

        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import myMsg from 'components/myMsg/myMsg.vue'

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
    components: {
      myMsg
    },
    methods: {
      goHome () {
        this.$router.load({url: '/user/invoice/list'})
      }
    },
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/invoiceSuccess.scss";
</style>

