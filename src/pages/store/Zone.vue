<template>
    <f7-page navbar-fixed @page:reinit="reinit" @page:init="init" :cached="false">
        <div slot="fixed">
            <transition enter-active-class="animated slideInUp">
                <div class="backTop" @click="initScroll" v-show="showBackTop">
                    <div class="gt-top"></div>
                    <div class="text">TOP</div>
                </div>
            </transition>
        </div>
        <!--back-link=""-->
        <back title="绿植商城" back-link=" ">
            <div slot="right" class="cart" @click="goCart"><span class="cart-count"
                                                                 v-if="cartcount>0">{{cartcount}}</span></div>
        </back>
        <div class="topTab">
            <div class="top_nav_module">
                <div class="top_nav_wrap">
                    <f7-swiper :init="false" class="top_nav_menu">
                        <f7-swiper-slide class="sw">
                            <span @click="$router.load({url:'/store/home'})">所有商品</span>
                        </f7-swiper-slide>
                        <f7-swiper-slide class="sw" :class="{active:item.id===zoneId}"
                                         v-for="(item,index) in typeList"
                                         :key="index">
                            <span @click="changeType(item)">{{item.category}}</span>
                        </f7-swiper-slide>
                    </f7-swiper>
                </div>
            </div>
        </div>
        <div class="wrapper_zone">
            <f7-block inner class="home" no-hairlines>
                <div>
                    <header class="zone-header">
                        <img :src="imagesList[0]&&imagesList[0].imageurl" class="zone-banner" alt="">
                    </header>
                    <div v-if="zoneType==categoryType.goods" class="group mt-15">
                        <div class="zone-list">
                            <div class="item" v-for="(item,index) in dataList" @click="gotoDetail(item)">
                                <div v-if="index%5===0" class="zone-big">
                                    <img :src="item.rectangle_img" alt="">
                                    <div class="context">
                                        <div class="name">{{item.name}}<span v-if="item.supportvalue"
                                                                             class="icon_bao"></span><span
                                                v-if="item.isspecial"
                                                class="icon_te"></span></div>
                                        <div class="money">
                                            <div>购买:<span class="buy">￥{{item.saleprice}}</span></div>
                                            <div>租赁:<span class="lease">￥{{item.leaseprice}}/月</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="photo"><img :src="item.img" alt=""></div>
                                    <div class="name">{{item.name}}<span v-if="item.supportvalue"
                                                                         class="icon_bao"></span><span
                                            v-if="item.isspecial"
                                            class="icon_te"></span></div>
                                    <div class="money">
                                        <div>购买:<span class="buy">￥{{item.saleprice}}</span></div>
                                        <div>租赁:<span class="lease">￥{{item.leaseprice}}/月</span></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div v-if="zoneType==categoryType.composite">
                        <div class="compose-title"
                             :class="[dataList[0]&&dataList[0].type==goodsType.buy?'bg_buy':'bg_lease']">
                        </div>
                        <div class="zone-compose-list">
                            <div class="item" v-for="(item,index) in dataList" @click="gotoCombo(item)">
                                <div class="zone-wrap">
                                    <img :src="item.rectangle_img" alt="">
                                    <div class="context">
                                        <div class="name">{{item.name}}</div>
                                        <div class='area'>适用面积：{{item.area}}平方</div>
                                        <div class="money">
                                            <span class="realPrice">
                                                ￥{{item.price}}
                                                <span v-if="item.type==goodsType.lease">/月</span>
                                            </span>
                                            <span class="cost">
                                                ￥{{item.orig_price}}
                                                <span v-if="item.type==goodsType.lease">/月</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results">没有数据</div>
                    </infinite-loading>
                </div>
            </f7-block>
        </div>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi, commonApi } from 'api'
  import { wx_share, gotoCart, categoryType, goodsType } from 'lib/common'
  import { LocalCache, Cache, getScrollParent } from 'lib/utils'
  import InfiniteLoading from 'components/infiniteLoading/components/InfiniteLoading.vue'
  import BackTop from 'components/backTop/backTop.vue'
  import IScroll from 'lib/iscroll'
  import wx from 'wx'

  export default {
    data () {
      return {
        page: 1,
        leaseComboList: [],
        buyComboList: [],
        dataList: [],
        imagesList: [],
        bannerList: [],
        categoryType: categoryType,
        goodsType: goodsType,
        showBackTop: false,
        scrollParent: null,
        myScroll: null,
        cartcount: 0,
        typeList: [],

        zoneId: -1,
        zoneType: -1

      }
    },
    created () {
      let zoneId = Cache.get('zoneId') !== null ? Cache.get('zoneId') : -1
      let zoneType = Cache.get('zoneType') !== null ? Cache.get('zoneType') : -1
      if (zoneId !== -1) {
        this.zoneId = zoneId
        this.zoneType = zoneType
      }
      userApi.categoryList().then((result) => {
        console.log('result', result)
        this.typeList = result.data

        if (zoneId === -1) {
          this.zoneId = this.typeList[0].id
          this.zoneType = this.typeList[0].type
        }

        this.$nextTick(() => {
          let mySwiper = this.$f7.swiper('.top_nav_menu', {
            pagination: '.swiper-pagination4',
            slidesPerView: 4.5,
            paginationClickable: true,
            spaceBetween: 5,
            freeMode: true,
          })
          let index = this.typeList.findIndex((item) => item.id === this.zoneId)
          mySwiper.slideTo(index)
        })

      })

      wx.ready(() => {
        var title = '株株绿植商城'
        var desc = '绿植购买租赁养护，一站式系统化标准化智能化式服务'
        var imgUrl = 'http://images.zhuzhulz.com/sill.jpg'
        var link = location.protocol + '//' + location.host + '/#/store/zone'
        wx_share(title, link, imgUrl, desc)
      })

    },
    mounted () {
      this.$nextTick(() => {
        let wrapperArr = document.querySelectorAll('.wrapper_zone')

        this.myScroll = new IScroll(wrapperArr[wrapperArr.length - 1], {freeScroll: true})
        this.myScroll.on('scrollEnd', () => {
          if (this.myScroll.y - this.myScroll.maxScrollY <= 40) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:infinite')
          }
          if (this.myScroll.y < -200) {
            this.showBackTop = true
          }
        })

      })
    },
    methods: {
      changeType (item) {
        this.page = 1
        this.dataList = []
        let step = 100
        setTimeout(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        }, step)
        this.myScroll.scrollTo(0, 0)
        this.showBackTop = false
        Cache.set('zoneId', item.id)
        Cache.set('zoneType', item.type)
        this.zoneId = item.id
        this.zoneType = item.type

      },
      init () {
        setTimeout(() => {
          userApi.getCartNum().then((result) => {
            this.cartcount = result.data
          })
        }, 300)
      },
      reinit () {
        userApi.getCartNum().then((result) => {
          this.cartcount = result.data
        })
        window.wx.ready(function () {
          var title = '株株绿植商城专区'
          var desc = '多样化专区，绿植品种丰富齐全，一站式选购'
          var imgUrl = 'http://images.zhuzhulz.com/share2.jpg'
          var link = location.protocol + '//' + location.host + '/#/store/zone'
          wx_share(title, link, imgUrl, desc)
        })
      },
      goCart () {
        gotoCart(this)

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
      gotoDetail: function ({id}) {
        this.$router.load({url: `/store/goodsDetail/${id}`})

      },
      gotoCombo: function ({id}) {
        this.$router.load({url: `/store/comboDetail/${id}`})

      },
      gotoMoreCombo: function (type) {
        this.$router.load({url: `/store/moreCombo/${type}`})

      },
      gotoMoreGoods: function () {
        this.$router.load({url: '/store/moreGoods'})
      },
      gotoSearch: function () {
        this.$router.load({url: '/store/search'})
      },
      async loadData () {
        if (this.zoneType === categoryType.goods) {
          userApi.categoryItemsById(this.zoneId, this.page).then((result) => {
            this.setData(result.data)
          })
        } else if (this.zoneType === categoryType.composite) {
          userApi.categoryCompositeById(this.zoneId, this.page).then((result) => {
            this.setData(result.data)
          })
        }

      },
      setData (data) {
        console.log('data', data)
        this.imagesList = data.images
        if (Array.isArray(data.items) && data.items.length > 0) {
          this.dataList = [].concat(this.dataList).concat(data.items)
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
          this.page++
          setTimeout(() => {
            this.myScroll.refresh()
          }, 500)

        } else {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
        }
      }
    },

    components: {BackTop, InfiniteLoading},

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/home.scss";
</style>

