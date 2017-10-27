<template>
    <f7-page @page:reinit="reinit">
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

        <plant-list>
            <plant-item v-for="(plant,index) in plantList"
                        :id="plant.id"
                        :cart_id.sync="plant.cart_id"
                        :amount.sync="plant.amount"
                        :imgUrl="plant.img"
                        :name="plant.name"
                        :key="index"
                        :price="plant.price"
                        :status.sync="plant.status"
                        @blur="blur"
            ></plant-item>
            <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                <div slot="no-more">没有更多数据</div>
                <div slot="no-results" class="no-result">没有搜索结果</div>
            </infinite-loading>
        </plant-list>
        <f7-toolbar bottom class="no-border">
            <div class="o-footer" @click="$router.load({url:'/sell/addPlant'})">
                <div class="active">确定</div>
            </div>
        </f7-toolbar>
    </f7-page>

</template>

<script type="text/ecmascript-6">
  import { sellApi } from 'api'
  import InfiniteLoading from 'vue-infinite-loading'
  import PlantItem from 'section/sell/plantItem/plantItem.vue'
  import PlantList from 'section/sell/plantList/plantList.vue'

  export default {
    data () {
      return {
        plantList: [],
        query: {
          key: '',
          page: 1
        },
        noData: '',

      }
    },
    created () {
      if (this.$route.options.query) {
        this.query.key = this.$route.options.query.key
      }

      console.log(this.$router)
      console.log(this.$route)
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
        sellApi.plantList(this.query.page, this.query.key).then((result) => {
          if (result.data.length > 0) {
            this.plantList = [].concat(this.plantList).concat(result.data)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.query.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      }
    },
    components: {PlantItem, InfiniteLoading, PlantList}
  }
</script>
<style lang="scss" scoped type="text/css">
    .o-footer {

    > div {
        width: 100%;
    }

    }
</style>
