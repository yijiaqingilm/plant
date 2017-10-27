<template>
    <f7-page :no-navbar="true" :hide-navbar-on-scroll="true" :hide-bars-on-scroll="true">
        <back title="优惠券"></back>
        <f7-block inner class="getCoupon" no-hairlines>
            <div v-if="couponInfo.status==0">
                <img @click="goCenter" class="coupon-get" :src="couponInfo.dump_img" alt="">
            </div>
            <div v-if="couponInfo.status==2">
                <img @click="getCoupon" class="coupon-get" :src="couponInfo.img" alt="">
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { couponStatus, wx_share } from 'lib/common'

  export default {
    data () {
      return {
        /* 礼包领取状态： -1:加载中。  0优惠礼包已领取，1优惠礼包不存在, 2 没领*/
        couponInfo: {
          id: '',
          status: -1,
          name: '',
          img: '', // 领取礼包的背景图片 ,
          dump_img: '', // 跳转的背景图片 ,
          url: ''
        }
      }
    },
    created () {
      userApi.getPackage().then((result) => {
        this.couponInfo = result.data
      })
      window.wx.ready(() => {
        var title = '900元绿植大礼包免费领'
        var desc = '株株绿植，一站式绿植服务，关注免费领取'
        var imgUrl = 'http://images.zhuzhulz.com/share2_coupon.jpg'
        var link = location.protocol + '//' + location.host + '/#/user/coupon/get'
        wx_share(title, link, imgUrl, desc)
      })
    },
    methods: {
      getCoupon () {
        userApi.getMyCoupon().then((result) => {
          this.couponInfo.status = 0
        })
      },
      goCenter () {
        this.$router.load({url: '/user/coupon/list'})
      }

    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/couponList.scss";
</style>
