<template>
    <f7-page>
        <back title="搜索" :fixed=true></back>
        <!-- Search bar -->
        <form class="searchbar searchbar-init hybrid-background" action="javascript:return true;">
            <div class="searchbar-input">
                <input type="search" readonly @click="$router.back()" class="input-search" v-model="query.key"
                       placeholder="搜索"
                >
                <a href="#" class="searchbar-clear"></a>
            </div>
            <a href="#" class="searchbar-cancel">关闭</a>
        </form>

        <!-- Search bar overlay-->
        <div class="searchbar-overlay"></div>
        <!-- Search-through list -->

        <goods-list :itemList="dataList" id="search-list" class="searchbar-found">
        </goods-list>
        <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
            <div slot="no-more">没有更多数据</div>
            <div slot="no-results" class="no-result">{{noData}}</div>
        </infinite-loading>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import infiniteLoading from 'vue-infinite-loading'
  import GoodsList from 'section/store/goodsList/goodsList.vue'

  export default {
    data () {
      return {
        dataList: [],
        query: {
          key: '',
          page: 1
        },
        noData: '没有搜索结果',

      }
    },
    created () {
      if (this.$route.options.query) {
        this.query.key = this.$route.options.query.key
      }
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      search: function (e) {
        this.query.page = 1
        this.dataList = []
        let step = 100
        setTimeout(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        }, step)
        this.noData = '无搜索结果'
      },
      loadData: function () {
        if (this.query.key.length <= 0) {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          return
        }
        userApi.goodsSearch({...this.query}).then((result) => {
          if (result.data.length > 0) {
            this.dataList = [].concat(this.dataList).concat(result.data)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.query.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      }
    },
    components: {GoodsList, infiniteLoading}
  }
</script>
<style lang="scss" scoped type="text/css">
</style>
