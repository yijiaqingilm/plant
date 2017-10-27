<template>
    <f7-page navbar-fixed @page:reinit="reinit" :cached=false>
        <div slot="fixed">
            <transition enter-active-class="animated slideInUp">
                <div class="backTop" @click="initScroll" v-show="showBackTop">
                    <div class="gt-top"></div>
                    <div class="text">TOP</div>
                </div>
            </transition>
        </div>
        <!--back-link=""-->
        <back title="年桔预售" back-link=" ">
            <div slot="right" @click="goOrder">我的预售订单</div>
        </back>

        <!-- <div class="wrapper_zone">-->
        <f7-block inner class="home" no-hairlines>
            <div class="tabs">
                <div class="tab" :class="{active:orangeItem==orangeType.family}"
                     @click="changeItem(orangeType.family)">家庭年桔专区
                </div>
                <div class="tab" :class="{active:orangeItem==orangeType.firm}"
                     @click="changeItem(orangeType.firm)">公司年桔专区
                </div>
            </div>
            <div class="orange-goods" v-if="orangeItem==orangeType.family">
                <header class="zone-header">
                    <img :src="imagesList2family[0]&&imagesList2family[0].imageurl" class="zone-banner" alt="">
                </header>
                <div class="group mt-15">
                    <div class="list">
                        <div class="compose-item" v-if="item.type==itemType.combo"
                             v-for="(item,index) in dataList2family"
                             @click="gotoCombo(item)">
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
                        <div v-else class="item" @click="gotoDetail(item)">
                            <div class="photo"><img :src="item.img" alt=""></div>
                            <div class="name">{{item.name}}</div>
                            <div class="money">
                                <span class="buy">￥{{item.price}}</span>
                                <span class="min-line-through">￥{{item.orig_price}}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <infinite-loading :on-infinite="loadFamilyData" ref="familyInfiniteLoading" spinner="bubbles">
                    <div slot="no-more">没有更多数据</div>
                    <div slot="no-results">没有数据</div>
                </infinite-loading>
            </div>
            <div class="orange-goods" v-if="orangeItem==orangeType.firm">
                <header class="zone-header">
                    <img :src="imagesList2firm[0]&&imagesList2firm[0].imageurl" class="zone-banner" alt="">
                </header>
                <div class="group mt-15">
                    <div class="list">
                        <div class="compose-item" v-if="item.type==itemType.combo" v-for="(item,index) in dataList2firm"
                             @click="gotoDetail(item)">
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
                        <div v-else class="item">
                            <div class="photo"><img :src="item.img" alt=""></div>
                            <div class="name">{{item.name}}</div>
                            <div class="money">
                                <span class="buy">￥{{item.price}}</span>
                                <span class="min-line-through">￥{{item.orig_price}}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <infinite-loading :on-infinite="loadFirmData" ref="firmInfiniteLoading" spinner="bubbles">
                    <div slot="no-more">没有更多数据</div>
                    <div slot="no-results">没有数据</div>
                </infinite-loading>
            </div>
        </f7-block>
        <!-- </div>-->
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { orangeApi, userApi } from 'src/api/index'
  import { wx_share, gotoCart, categoryType, goodsType, orangeType, itemType } from 'lib/common'
  import { LocalCache, Cache, getScrollParent } from 'lib/utils'
  import InfiniteLoading from 'vue-infinite-loading'
  import BackTop from 'components/backTop/backTop.vue'
  import wx from 'wx'

  export default {
    data () {
      return {
        familyPage: 1,
        firmPage: 1,
        goodsType: goodsType,
        itemType: itemType,
        orangeType: orangeType,
        orangeItem: orangeType.family,
        dataList2family: [],
        dataList2firm: [],
        imagesList2family: [],
        imagesList2firm: [],
        showBackTop: false,
        scrollParent: null,
      }
    },
    created () {
      window.wx.ready(() => {
        var title = '株株绿植商城'
        var desc = '绿植购买租赁养护，一站式系统化标准化智能化式服务'
        var imgUrl = 'http://images.zhuzhulz.com/sill.jpg'
        var link = location.protocol + '//' + location.host + '/#/store/zone'
        wx_share(title, link, imgUrl, desc)
      })

    },
    methods: {
      reinit () {
        window.wx.ready(function () {
          var title = '株株绿植商城专区'
          var desc = '多样化专区，绿植品种丰富齐全，一站式选购'
          var imgUrl = 'http://images.zhuzhulz.com/share2.jpg'
          var link = location.protocol + '//' + location.host + '/#/orange/home'
          wx_share(title, link, imgUrl, desc)
        })
      },
      changeItem: function (itemId) {
        this.orangeItem = itemId
        /* this.page = 1
        this.dataList = []
        let step = 100
        setTimeout(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        }, step)*/
        switch (this.orangeItem >>> 0) {
          case orangeType.family:
            this.$nextTick(() => {
              this.$refs.familyInfiniteLoading.$emit('$InfiniteLoading:reset')
            })
            break
          case orangeType.firm:
            this.$nextTick(() => {
              this.$refs.firmInfiniteLoading.$emit('$InfiniteLoading:reset')
            })
            break
          default:
            break
        }
      },
      goOrder () {
        this.$router.load({url: '/user/myOrder'})
      },
      initScroll: function () {
        this.showBackTop = false
      },
      backTop: function (value) {
        this.showBackTop = value
      },
      gotoDetail: function ({id}) {
        this.$router.load({url: `/orange/goodsDetail/${id}`})

      },
      gotoCombo: function ({id}) {
        this.$router.load({url: `/orange/comboDetail/${id}`})

      },
      async loadFirmData () {
        orangeApi.presaleList(this.firmPage, orangeType.firm).then(({data}) => {
          if (this.firmPage === 1) {
            this.imagesList2firm = data.banner_url
          }
          if (Array.isArray(data.PreItemProList) && data.PreItemProList.length > 0) {
            this.dataList2firm = [].concat(this.dataList2firm).concat(data.PreItemProList)
            this.$refs.firmInfiniteLoading.$emit('$InfiniteLoading:loaded')
            this.firmPage++
          } else {
            this.$refs.firmInfiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      },
      async loadFamilyData () {
        orangeApi.presaleList(this.familyPage, orangeType.family).then(({data}) => {
          if (this.familyPage === 1) {
            this.imagesList2family = data.banner_url
          }
          if (Array.isArray(data.PreItemProList) && data.PreItemProList.length > 0) {
            this.dataList2family = [].concat(this.dataList2family).concat(data.PreItemProList)
            this.$refs.familyInfiniteLoading.$emit('$InfiniteLoading:loaded')
            this.familyPage++
          } else {
            this.$refs.familyInfiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      }
    },

    components: {BackTop, InfiniteLoading},

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/home.scss";

    .content-block {
        height: 100%;
    }

    .content-block-inner {
        height: 100%;
    }
</style>

