<template>
    <f7-page>
        <back title="发票历史"></back>
        <div class="invocieList">
            <div class="item" v-for="item in invoiceList">
                <div class="item-time">
                    <div>申请时间：{{item.created_at}}</div>
                    <div class="status">{{invoiceType[item.status]}}</div>
                </div>
                <div>发票抬头：{{item.header}}</div>
                <div>发票金额：{{item.invoice}}元</div>
                <div v-if="item.status==2||item.status==3">快递单号：{{item.expressnum}}</div>
            </div>
            <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                <div slot="no-more">没有更多数据</div>
                <div slot="no-results">没有数据</div>
            </infinite-loading>
        </div>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    data () {
      return {
        page: 1,
        invoiceList: [],
        // 发票状态：0已申请，1处理中，2已邮寄，3已查收
        invoiceType: {
          0: '已申请',
          1: '已申请',
          2: '已邮寄',
          3: '已邮寄'
        }
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
      // 等待接口对接
      loadData () {
        userApi.invoiceHistory(this.page).then((result) => {
          if (result.data.length > 0) {
            this.invoiceList = [].concat(this.invoiceList).concat(result.data)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      }
    },
    computed: {},
    components: {InfiniteLoading}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/invoice.scss";
</style>

