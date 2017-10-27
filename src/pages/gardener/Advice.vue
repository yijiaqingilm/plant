<template>
    <f7-page>
        <back title="我的建议"></back>
        <f7-block inner class="advice" no-hairlines>
            <div class="list">
                <div class="item" v-for="item in items">
                    <div class="time">{{item.created_at}}</div>
                    <div class="context">{{item.suggestion}}</div>
                    <div class="reply" v-for="(reply,index) in item.replies">
                        <div><span>回复:</span>{{reply.content}}</div>
                        <!--<div v-if="index==item.replies.length-1" class="color-gray">回复时间:{{reply.created_at}}</div>-->
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { wx } from 'wx'

  export default {
    data () {
      return {
        items: []
      }
    },
    created () {
      userApi.myAdvice(this.$store.state.sessionkey).then((result) => {
        this.items = result.data
      })
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    }
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/advice.scss";
</style>
