<template>
    <f7-page>
        <back title="投诉建议" back-link="">
            <div slot="right" class="suggest" @click="$router.load({url:'/gardener/advice'})">
                我的建议
            </div>
        </back>
        <f7-block inner class="service" no-hairlines>
            <div class="list">
                <div class="erweima">
                    <div><img :src="serverInfo.qrcode" alt=""></div>
                    <div>客服二维码</div>
                </div>
                <div class="qq">客服QQ：{{serverInfo.qq}}</div>
                <div class="phone">客服热线：{{serverInfo.contact}}</div>
                <div class="wx">客服微信号：{{serverInfo.wxclient}}</div>
                <div class="address">公司地址：{{serverInfo.address}}</div>
            </div>
            <div class="line-10"></div>
            <div class="list2">
                <div class="group">
                    <div class="label">联系电话:</div>
                    <div class="input ">
                        <input type="text" v-model="mobile">
                    </div>
                </div>
                <div class="advice">
                    <div class="ad-title">上报/建议:</div>
                    <div class="content">
                        <textarea v-model="suggestion" maxlength="200" placeholder='请留下您的建议'></textarea>
                    </div>
                    <div class="ad-footer">{{suggestion.length}}/200字数</div>
                </div>
                <div class="submit"><span @click="submit" class="my-button">提交</span></div>
            </div>

        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'

  export default {
    data () {
      return {
        serverInfo: {},
        suggestion: '',
        mobile: '',

      }
    },
    created () {
      userApi.getServer(this.$store.state.sessionkey).then((result) => {
        this.serverInfo = result.data
      })
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })

    },
    methods: {
      submit () {
        if (this.suggestion.length <= 0) {
          this.$f7.alert('请填写您的建议', '')
          return
        }
        userApi.advice(this.suggestion, this.mobile).then((result) => {
          this.$f7.alert(result.result, '', () => {
            this.$router.load({url: '/gardener/advice'})
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/service.scss";
</style>

