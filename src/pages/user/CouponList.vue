<template>
    <f7-page>
        <back title="优惠券"></back>
        <f7-block inner class="couponList" no-hairlines>
            <div class="help-desc">优惠券使用帮助</div>
            <div class="coupon-list">
                <div class="coupon" :class="{active:item.status==couponStatus.use}" v-for="item in couponList"
                     @click="changeCoupon(item)">
                    <div class="left">
                        ￥{{item.discount | toFixed(0)}}
                    </div>
                    <div class="right">
                        <div class="title">{{item.name}}</div>
                        <div class="context">
                            {{item.remark}}
                        </div>
                        <div class="valid-time">
                            有效期至：{{item.expire_at | dateFormat }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="coupon-list">

            </div>
            <div class="coupon-list">

            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { Cache } from 'lib/utils'
  import { couponStatus } from 'lib/common'

  export default {
    data () {
      return {
        couponList: [],
        changeCouponList: [],
        couponStatus: couponStatus
      }
    },
    created () {
      this.changeCouponList = Cache.get('changeCouponList') || []
      let cartids = Cache.get('cartids')
      userApi.couponList(cartids).then((result) => {
        this.couponList = result.data
        this.couponList = this.couponList.filter((coupon) => {
          if (this.changeCouponList.length > 0) {
            let index = this.changeCouponList.findIndex((changeCoupon) => {
              if (parseInt(coupon.id, 10) === parseInt(changeCoupon.id, 10)) {
                return true
              }
            })
            return index === -1
          }
          return true
        })
      })
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      changeCoupon (item) {
        if (parseInt(item.status, 10) === couponStatus.noUse) {
          return
        }
        let isChange = this.$route.options.query && this.$route.options.query.isChange || false
        if (isChange) {
          let couponType = this.$route.options.query.couponType
          Cache.set('couponType' + couponType, item)
          Cache.set('hasChangeCoupon', true)
          this.$router.back()
        }

      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/couponList.scss";
</style>
