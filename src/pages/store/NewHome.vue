<template>
    <f7-page navbar-fixed @page:reinit="reinit" @page:init="init" :cached="false">
        <div slot="fixed">
        </div>
        <!--back-link=""-->
        <back title="绿植商城" back-link="">
            <div slot="right" class="cart" @click="goCart"><span class="cart-count"
                                                                 v-if="cartcount>0">{{cartcount}}</span></div>
        </back>
        <f7-block inner class="home" no-hairlines>
            <header class="header">
                <form @click="gotoSearch" class="searchbar searchbar-init search no-border"
                      data-search-list=".list-block-search"
                      data-search-in=".item-title" data-found=".searchbar-found"
                      data-not-found=".searchbar-not-found">
                    <div class="searchbar-input">
                        <input type="search" readonly placeholder="输入关键字搜索">
                        <a href="#" class="searchbar-clear"></a>
                    </div>
                </form>
                <f7-swiper pagination :init="false" class="swiper-container">
                    <f7-swiper-slide v-for="(banner,index) in bannerList" :key="index">
                        <img :src="banner.img" class="banner_img" alt="" @click="goCouponGet(banner)">
                    </f7-swiper-slide>
                </f7-swiper>
            </header>
            <div class="notice" v-if="getUserInfo.notice">
                <span class="icon_x" @click="closeNotice"></span>
                <img src="../../assets/icon_notice.png" alt=""><span>暂不支持深圳以外地区的绿植业务</span>
            </div>
            <div class="h-title">
                <span class="icon_plant"></span><span class="t-context">办公室绿植</span><span class="icon_plant"></span>
            </div>
            <f7-grid>
                <f7-col width="50">
                    <img src="../../assets/home/1.png" alt="" @click="goZone(1,0)">
                </f7-col>
                <f7-col width="50">
                    <img src="../../assets/home/2.png" alt="" @click="goZone(3,0)">
                </f7-col>
            </f7-grid>
            <f7-grid class="mt-15">
                <f7-col width="33">
                    <img src="../../assets/home/3.png" alt="" @click="goZone(4,0)">
                </f7-col>
                <f7-col width="33">
                    <img src="../../assets/home/4.png" alt="" @click="goZone(8,0)">
                </f7-col>
                <f7-col width="33">
                    <img src="../../assets/home/5.png" alt="" @click="goZone(10,0)">
                </f7-col>
            </f7-grid>
            <div class="mt-15">
                <img src="../../assets/home/6.png" alt="" @click="goZone(9,0)">
            </div>
            <div class="mt-15" @click="goZone(7,0)">
                <img src="../../assets/home/7.png" alt="" class="h-sort-img">
            </div>
            <div class="h-title">
                <span class="icon_plant"></span><span class="t-context">常用分类</span><span class="icon_plant"></span>
            </div>
            <div class="h-sort">
                <div @click="goZone(13,0)">
                    <img src="../../assets/home/8.png" alt="" class="h-sort-img">
                </div>
                <div @click="goZone(5,1)">
                    <img src="../../assets/home/9.png" alt="" class="h-sort-img">
                </div>
                <div @click="goZone(6,1)">
                    <img src="../../assets/home/10.jpg" alt="" class="h-sort-img">
                </div>


                <div @click="goZone(11,0)">
                    <img src="../../assets/home/11.png" alt="" class="h-sort-img">
                </div>
                <div @click="goZone(12,0)">
                    <img src="../../assets/home/12.png" alt="" class="h-sort-img">
                </div>
                <div @click="goZone(2,0)">
                    <img src="../../assets/home/13.png" alt="" class="h-sort-img">
                </div>
                <div @click="$router.load({url:'/store/home'})">
                    <img src="../../assets/home/14.jpg" alt="" class="h-sort-img">
                </div>
            </div>

        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi, commonApi } from 'api'
  import { goodsType, wx_share, gotoCart } from 'lib/common'
  import { LocalCache, Cache, getScrollParent } from 'lib/utils'
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
      window.wx.ready(() => {
        var title = '株株绿植商城'
        var desc = '绿植购买租赁养护，一站式系统化标准化智能化式服务'
        var imgUrl = 'http://images.zhuzhulz.com/share2.jpg'
        var link = location.protocol + '//' + location.host + '/#/store/newHome'
        wx_share(title, link, imgUrl, desc)
      })
      userApi.bannerList(0).then((result) => {
        var data = result.data
        if (Array.isArray(data) && data.length > 0) {
          this.bannerList = data
          this.$nextTick(() => {
            var mySwiper = this.$f7.swiper('.swiper-container', {
              pagination: '.swiper-pagination',
              autoplay: 2000,
              speed: 500,
            })
          })

        }
      })

    },
    methods: {
      init () {
        let step = 300
        setTimeout(() => {
          userApi.getCartNum().then((result) => {
            this.cartcount = result.data
          })
        }, step)
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
      gotoSearch: function () {
        this.$router.load({url: '/store/search/history'})
      },
      goZone (id, type) {
        Cache.set('zoneId', id)
        Cache.set('zoneType', type)
        this.$router.load({url: '/store/zone'})
      },
      goCouponGet (banner) {
        if (banner.isout) {
          location.href = banner.url
        } else {
          this.$router.load({url: `${banner.url}`})
        }

      },
      closeNotice () {
        userApi.closeNotice().then((result) => {
          this.getUserInfo.notice = false
          Cache.set('userInfo', this.getUserInfo)
        })
      }

    },
    computed: {
      getUserInfo () {
        return this.$store.state.userInfo
      }
    },
    components: {},

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/home.scss";
</style>

