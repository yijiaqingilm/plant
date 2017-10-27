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
        <div id="wrapper" class="wrapper">
            <f7-block inner class="home" no-hairlines>
                <!--<header class="header">
                    <form @click="gotoSearch" class="searchbar searchbar-init search no-border"
                          data-search-list=".list-block-search"
                          data-search-in=".item-title" data-found=".searchbar-found"
                          data-not-found=".searchbar-not-found">
                        <div class="searchbar-input">
                            <input type="search" readonly placeholder="输入关键字搜索">
                            <a href="#" class="searchbar-clear"></a>
                        </div>
                    </form>
                    <f7-swiper pagination :init="false" class="banners">
                        <f7-swiper-slide v-for="(banner,index) in bannerList" :key="index">
                            <img :src="banner.img" class="banner_img" alt="">
                        </f7-swiper-slide>
                    </f7-swiper>
                </header>-->
                <!--<div class="notice">
                    <img src="../../assets/icon_notice.png" alt=""><span>暂不支持深圳以外地区的绿植业务</span>
                </div>-->
                <div class="content">
                    <div class="group">
                        <div class="title" @click="gotoMoreCombo(goodsType.lease)">
                            <!--<div><span class="long-string"></span></div>
                            <div><span class="title-name-first">租赁</span>套餐</div>-->
                            <div><img class="home-icon" src="../../assets/zulin.png" alt=""></div>
                            <div class="more">更多<img src="../../assets/icon-more.png" class="icon_more"></div>
                        </div>
                        <div class="list">
                            <div class="item" v-if="index<=1" v-for="(item,index) in leaseComboList"
                                 @click="gotoCombo(item)">
                                <div class="photo"><img :src="item.img" alt=""></div>
                                <div class="name">{{item.name}}</div>
                                <div class="area">适用面积：{{item.area}}平方米</div>
                                <div class="money"><span class="lease">￥{{item.price}}/月</span>&nbsp;&nbsp;<span
                                        class="min-line-through">￥{{item.orig_price}}/月</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="group">
                        <div class="title" @click="gotoMoreCombo(goodsType.buy)">
                            <div><img class="home-icon" src="../../assets/goumai.png" alt=""></div>
                            <div class="more">更多<img src="../../assets/icon-more.png" class="icon_more"></div>
                        </div>
                        <div class="list">
                            <div class="item" v-if="index<=1" v-for="(item,index) in buyComboList"
                                 @click="gotoCombo(item)">
                                <div class="photo"><img :src="item.img" alt=""></div>
                                <div class="name">{{item.name}}</div>
                                <div class="area">适用面积：{{item.area}}平方米</div>
                                <div class="money"><span class="buy">￥{{item.price}}</span>&nbsp;<span
                                        class="min-line-through">￥{{item.orig_price}}</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="group">
                        <div class="title" @click="gotoMoreGoods()">
                            <div><img class="home-icon" src="../../assets/daoping.png" alt=""></div>
                            <div class="more">更多<img src="../../assets/icon-more.png" class="icon_more"></div>
                        </div>
                        <div class="list">
                            <div class="item" v-for="item in dataList" @click="gotoDetail(item)">
                                <div class="photo"><img :src="item.img" alt=""></div>
                                <div class="name">{{item.name}}<span v-if="item.supportvalue"
                                                                     class="icon_bao"></span><span v-if="item.isspecial"
                                                                                                   class="icon_te"></span>
                                </div>
                                <div class="money">
                                    <div>购买:<span class="buy">￥{{item.saleprice}}</span></div>
                                    <div>租赁:<span class="lease">￥{{item.leaseprice}}/月</span></div>
                                </div>
                            </div>

                        </div>
                        <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                            <div slot="no-more">没有更多数据</div>
                            <div slot="no-results">没有数据</div>
                        </infinite-loading>
                    </div>
                </div>
            </f7-block>
        </div>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi, commonApi } from 'api'
  import { goodsType, wx_share, gotoCart } from 'lib/common'
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
        bannerList: [],
        goodsType: goodsType,
        showBackTop: false,
        scrollParent: null,
        myScroll: null,
        cartcount: 0

      }
    },
    created () {
      wx.ready(() => {
        var title = '株株绿植商城'
        var desc = '绿植购买租赁养护，一站式系统化标准化智能化式服务'
        var imgUrl = 'http://images.zhuzhulz.com/share2.jpg'
        var link = location.protocol + '//' + location.host + '/#/store/home'
        wx_share(title, link, imgUrl, desc)
      })

    },
    mounted () {
      this.$nextTick(() => {
        let wrapperArr = document.querySelectorAll('.wrapper')

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
          var title = '株株绿植商城'
          var desc = '绿植购买租赁养护，一站式系统化标准化智能化式服务'
          var imgUrl = 'http://images.zhuzhulz.com/share2.jpg'
          var link = location.protocol + '//' + location.host + '/#/store/home'
          wx_share(title, link, imgUrl, desc)
        })
      },
      goCart () {
        gotoCart(this)

      },
      initScroll: function () {
        this.showBackTop = false
        /*eslint no-magic-numbers: 0*/
        this.myScroll.scrollTo(0, 0, 1000, IScroll.utils.ease.elastic)
      },
      backTop: function (value) {
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
        userApi.mallList(this.page).then((result) => {
          var data = result.data
          if (Array.isArray(data.items) && data.items.length > 0) {
            if (this.page === 1) {
              this.leaseComboList = data.compositeleaseitems
              this.buyComboList = data.compositebuyitems
              this.bannerList = data.banners
              /* this.$nextTick(() => {
                  var mySwiper = this.$f7.swiper('.swiper-container', {
                      pagination: '.swiper-pagination',
                      autoplay: 2000,
                      speed: 500,
                  });
              })*/

            }
            this.dataList = [].concat(this.dataList).concat(data.items)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.page++
            setTimeout(() => {
              this.myScroll.refresh()
            }, 500)

          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })

      }
    },
    components: {BackTop, InfiniteLoading},

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/home.scss";
</style>

