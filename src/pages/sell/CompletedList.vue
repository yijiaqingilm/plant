<template>
    <f7-page>
        <back title="已完成预约列表">

        </back>
        <!--<div slot='right' class="history-list">已完成:232单</div>-->
        <f7-block inner class="historyList" no-hairlines>
            <div class="history-list">
                <div class="history-item" v-for="item in historyList">
                    <div>预约订单编号：{{item.id}}</div>
                    <div>预约时间:{{item.created_at}}</div>
                    <div>公司名称:{{item.company}}</div>
                    <div>详细地址:{{item.address}}</div>
                    <div>联系人:{{item.contact}}</div>
                    <div>联系电话:{{item.mobile}}</div>
                    <div class="color-gray">完成时间:{{item.complete}}</div>
                </div>
                <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                    <div slot="no-more">没有更多数据</div>
                    <div slot="no-results">没有数据</div>
                </infinite-loading>
            </div>
        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading'
  import { sellApi } from 'api'
  import { Cache } from 'lib/utils'

  export default {
    data () {
      return {
        historyList: [],
        page: 1
      }
    },
    created () {
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      loadData () {
        sellApi.completeList(this.page).then((result) => {
          if (result.data.length > 0) {
            this.historyList = [].concat(this.historyList).concat(result.data)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      },

    },
    computed: {},
    components: {InfiniteLoading}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/historyList.scss";
</style>

