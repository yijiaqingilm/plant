<template>
    <f7-page @page:reinit="reinit">
        <back :title="title[type]" :fixed=true></back>
        <f7-block inner class="moreCombo" no-hairlines>
            <sort-modal :sortIndexs="[0,2,3]" @changeItem="changeItem"></sort-modal>
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
        type: 2,
        goodsType: goodsType,
        title: {
          [goodsType.buy]: '购买套餐',
          [goodsType.lease]: '租赁套餐',
        },
        query: {
          comprehensive: '',
          scene: '',
          price: '',
          page: 1,
          area: '',
          min_area: '',
          max_area: '',
          min_price: '',
          max_price: ''
        }
      }
    },
    created () {
      this.type = this.$route.params.type
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      reinit: function () {
        // reinit
      },
      loadData: function () {
        userApi.moreCombo({
          ...this.query,
          type: this.type
        }).then((result) => {
          if (result.data.length > 0) {
            this.dataList = [].concat(this.dataList).concat(result.data)
            this.dataList.forEach((item) => {
              this.$set(item, 'type', this.type)
            })
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.query.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      },
      changeItem: function (item) {
        this.query.comprehensive = ''
        this.query.scene = ''
        this.query.price = ''
        this.query.min_area = ''
        this.query.max_area = ''
        this.query.min_price = ''
        this.query.max_price = ''
        this.query.area = ''
        switch (item.type) {
          case sortType.customArea:
            this.query.min_area = item.min_area
            this.query.max_area = item.max_area
            break
          case sortType.comprehensive:
            break
          case sortType.price:
            this.query.price = item.id
            break
          case sortType.customPrice:
            this.query.min_price = item.min_price
            this.query.max_price = item.max_price
            break
          case sortType.area:
            this.query.area = item.id
            break
          default:
          // default
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
