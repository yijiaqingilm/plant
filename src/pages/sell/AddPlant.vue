<template>
    <f7-page @page:reinit="reinit">
        <div slot="fixed">
            <transition enter-active-class="animated slideInUp">
                <div class="backTop" @click="initScroll" v-show="showBackTop">
                    <div class="gt-top"></div>
                    <div class="text">TOP</div>
                </div>
            </transition>
        </div>
        <back title="添加绿植" back-link=""></back>
        <div id="wrapper" class="wrapper">
            <f7-block inner class="add-plant" no-hairlines>
                <!-- Search bar -->
                <form class="searchbar searchbar-init hybrid-background" action="javascript:return true;">
                    <div class="searchbar-input">
                        <input @click="$router.load({url:'/sell/search/history'})" type="search" readonly
                               class="input-search" v-model="query.key" placeholder="搜索">
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
                                :status.sync="plant.status"
                                :price="plant.price"
                                @blur="blur"
                                @focus="focus"
                    ></plant-item>
                    <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results" class="no-result">没有数据</div>
                    </infinite-loading>
                </plant-list>
            </f7-block>
        </div>
        <f7-toolbar bottom class="no-border">
            <div class="o-footer" @click="$router.load({url:'/sell/proxyOrder'})">
                <div class="active">确定</div>
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import InfiniteLoading from 'components/infiniteLoading/components/InfiniteLoading.vue'
  import PlantItem from 'section/sell/plantItem/plantItem.vue'
  import PlantList from 'section/sell/plantList/plantList.vue'
  import { sellApi } from 'api'
  import BackTop from 'components/backTop/backTop.vue'
  import IScroll from 'lib/iscroll'

  export default {
    data () {
      return {
        query: {
          key: ''
        },
        plantList: [],
        myScroll: null,
        showBackTop: false,
        page: 1,
      }
    },
    created () {
      // created
    },
    mounted () {
      this.$nextTick(() => {
        let wrapperArr = document.querySelectorAll('.wrapper')

        this.myScroll = new IScroll(wrapperArr[wrapperArr.length - 1], {freeScroll: true})
        this.myScroll.on('scrollEnd', () => {
          let infiniteValue = 40
          let minScroll = -200
          if (this.myScroll.y - this.myScroll.maxScrollY <= infiniteValue) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:infinite')
          }
          if (this.myScroll.y < minScroll) {
            this.showBackTop = true
          }
        })
        this.myScroll.on('scrollStart', function () {
          let input = document.querySelectorAll('input[type="number"]')
        })

      })
    },
    methods: {
      reinit () {
        this.page = 1
        this.plantList = []
        let step = 100
        setTimeout(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        }, step)
      },
      loadData () {
        sellApi.plantList(this.page).then((result) => {
          if (result.data.length > 0) {
            this.plantList = [].concat(this.plantList).concat(result.data)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.page++
            let step = 500
            setTimeout(() => {
              this.myScroll.refresh()
            }, step)
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      },
      blur () {
        //  处理安卓机  键盘弹出后 页面上移问题
        let wrapperArr = document.querySelectorAll('.wrapper')
        let wrapper = wrapperArr[wrapperArr.length - 1]
        wrapper.scrollTop = 0
      },
      focus () {
        // foucus
      },
      /* @enter="enter"
       @beforeEnter="beforeEnter"
       @leave="leave"*/
      beforeEnter: function (el) {
        el.style.bottom = '100px'
      },
      enter: function (el, done) {
        window.Velocity(el, {
          bottom: 0
        }, {complate: done})
      },
      leave: function (el, done) {
        window.Velocity(el, {
          bottom: 100
        }, {complate: done})
      },
      initScroll: function () {
        this.showBackTop = false
        /*eslint no-magic-numbers: 0*/
        this.myScroll.scrollTo(0, 0, 1000, IScroll.utils.ease.elastic)
      },
      backTop: function (value) {
        console.log('value', value)
        this.showBackTop = value
      },
    },
    components: {PlantItem, InfiniteLoading, PlantList, BackTop}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/sell/addPlant.scss";

    #wrapper {
        bottom: 50px; /*no*/
    }

</style>
