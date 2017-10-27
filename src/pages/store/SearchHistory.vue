<template>
    <f7-page @page:reinit="reinit">
        <back title="搜索" :fixed=true></back>
        <!-- Search bar -->
        <form class="searchbar searchbar-init hybrid-background" action="javascript:return true;">
            <div class="searchbar-input">
                <input type="search" class="input-search" v-model="query.key" placeholder="搜索"
                       @keyup.enter="search">
                <a href="#" class="searchbar-clear"></a>
            </div>
            <a href="#" class="searchbar-cancel">关闭</a>
        </form>

        <!-- Search bar overlay-->
        <div class="searchbar-overlay"></div>
        <!-- Search-through list -->
        <div class="list-block list-block-search searchbar-found no-hairlines">
            <ul class="search-list ">
                <li v-for="(data,index) in dataList" @click="goSearch(data)">
                    <div>{{data}}</div>
                    <div @click.stop="delSearchHistory(index)"><img src="../../assets/icon_x.png" class="icon_search_del"
                                                                    alt="">
                    </div>
                </li>
            </ul>
        </div>
        <div @click="clearHistory" class="clear">清空搜索记录</div>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { LocalCache } from 'lib/utils'
  import { userApi } from 'api'

  export default {
    data () {
      return {
        dataList: [],
        query: {
          key: '',
          page: 1
        },
        noData: '',

      }
    },
    created () {
      this.dataList = LocalCache.get('searchHistoryByUser') || []
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      clearHistory () {
        this.dataList = []
        LocalCache.del('searchHistoryByUser')
      },
      delSearchHistory (index) {
        this.dataList.splice(index, 1)
        LocalCache.set('searchHistoryByUser', this.dataList)
      },
      reinit: function () {
        this.dataList = LocalCache.get('searchHistoryByUser') || []
      },
      search: function () {
        let maxCount = 10
        if (this.query.key.length > 0) {
          this.dataList.unshift(this.query.key)
          if (this.dataList.length > maxCount) {
            this.dataList.pop()
          }
          let setDataList = new Set(this.dataList)
          LocalCache.set('searchHistoryByUser', Array.from(setDataList))
        }
        this.goSearch(this.query.key)

      },
      goSearch (key) {
        this.$router.load({url: '/store/search', query: {key}})
      },
    },
    components: {}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/sell/search.scss";
</style>
