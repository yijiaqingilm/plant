<template>
    <f7-page>
        <back title="更多商品" :fixed=true></back>
        <f7-block inner class="moreCombo" no-hairlines>
            <sort-modal @changeItem="changeItem"></sort-modal>
            <goods-list :itemList="dataList" id="search-list" class="goods-list">
            </goods-list>
            <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                <div slot="no-more">没有更多数据</div>
                <div slot="no-results">没有数据</div>
            </infinite-loading>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { goodsType, sortType } from 'lib/common'
  import infiniteLoading from 'vue-infinite-loading'
  import GoodsList from 'section/store/goodsList/goodsList.vue'
  import SortModal from 'section/store/sortModal/sortModal.vue'

  export default {
    data () {
      return {
        dataList: [],
        query: {
          comprehensive: '',
          scene: '',
          price: '',
          min_price: 0,
          max_price: 0,
          page: 1
        },
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
      loadData: function () {
        let step = 1000
        setTimeout(() => {
          userApi.moreGoods({
            ...this.query,
          }).then((result) => {
            if (result.data.length > 0) {
              this.dataList = [].concat(this.dataList).concat(result.data)
              this.dataList.forEach((item) => {
                this.$set(item, 'type', goodsType.compose)
              })
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              this.query.page++
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          })
        }, step)
      },
      changeItem: function (item) {
        this.query.comprehensive = ''
        this.query.scene = ''
        this.query.price = ''
        this.query.min_price = ''
        this.query.max_price = ''
        switch (item.type) {
          case sortType.customPrice:
            this.query.min_price = item.min_price
            this.query.max_price = item.max_price
            break
          case sortType.comprehensive:
            break
          case sortType.price:
            this.query.price = item.id
            break
          case sortType.scene:
            this.query.scene = item.name
            break
          default:
            break

        }

        this.query.page = 1
        this.dataList = []
        let step = 100
        setTimeout(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        }, step)

      }
    },
    components: {GoodsList, infiniteLoading, SortModal}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/store/moreCombo.scss";
</style>
