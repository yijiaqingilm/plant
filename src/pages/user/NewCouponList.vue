<template>
    <f7-page>
        <back title="优惠券"></back>
        <f7-block inner class="couponList" no-hairlines>
            <div class="help-desc" @click="$router.load({url:'/user/coupon/help'})">优惠券使用帮助</div>
            <div class="coupon-list">
                <div class="coupon-new active" v-for="item in couponList.news"
                     @click="changeCoupon(item)">
                    <div class="title">{{item.name}}</div>
                    <ul class="context">
                        <li>
                            <div>{{item.remark}}</div>
                        </li>
                        <li>
                            <div>{{item.type}}</div>
                        </li>
                        <li>
                            <div>有效期:{{item.start_at | dateFormat }}至{{item.expire_at | dateFormat }}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="coupon-list" v-if="isChange">
                <div class="coupon-new" v-for="item in couponList.others">
                    <div class="title">{{item.name}}</div>
                    <ul class="context">
                        <li>
                            <div>{{item.remark}}</div>
                        </li>
                        <li>
                            <div>{{item.type}}</div>
                        </li>
                        <li>
                            <div>有效期:{{item.start_at | dateFormat }}至{{item.expire_at | dateFormat }}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-if="isChange">
                <div class="coupon-list">
                    <div class="coupon-new"
                         @click="noChangeCoupon">
                        <div class="title">不使用优惠券</div>
                    </div>
                </div>
            </div>
            <div v-if="!isChange">
                <div class='show-coupon-lose' @click="showLose=true" v-if="!showLose">
                    查看已失效优惠券
                </div>
                <div class="sigma-content" v-if="showLose">
                    <div class="sigma-middle-line">
                        <span class="sigma-line-text">已失效</span>
                    </div>
                </div>
                <div class="coupon-list" v-if="showLose">
                    <div class="coupon-new" :class="setClass(item)"
                         v-for="item in couponList.uses"
                         @click="changeCoupon(item)">
                        <div class="title">{{item.name}}</div>
                        <ul class="context">
                            <li>
                                <div>{{item.remark}}</div>
                            </li>
                            <li>
                                <div>{{item.type}}</div>
                            </li>
                            <li>
                                <div>有效期至：{{item.expire_at | dateFormat }}</div>
                            </li>
                        </ul>
                    </div>
                </div>
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
        couponStatus: couponStatus,
        showLose: false,
        isChange: false,
        couponType: null
      }
    },
    created () {
      if (this.$route.options.query) {
        this.couponType = this.$route.options.query.couponType
      }

      this.changeCouponList = Cache.get('changeCouponList') || []
      let paytype = ''
      let paymethod = ''
      if (this.$route.options.query) {
        this.isChange = this.$route.options.query.isChange || false
        paytype = this.$route.options.query.paytype || ''
        paymethod = this.$route.options.query.paymethod || ''
      }

      let cartids = Cache.get('cartids')
      userApi.couponList(cartids, paytype, paymethod).then((result) => {
        this.couponList = result.data
        this.couponList.news = this.couponList.news.filter((coupon) => {
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
      noChangeCoupon () {
        Cache.del('couponType' + this.couponType)
        Cache.set('hasChangeCoupon', true)
        this.$router.back()
      },
      changeCoupon (item) {
        if (parseInt(item.status, 10) === couponStatus.noUse) {
          return
        }

        if (this.isChange) {
          Cache.set('couponType' + this.couponType, item)
          Cache.set('hasChangeCoupon', true)
          this.$router.back()
        }

      },
      setClass (item) {
        // 0未使用，1已使用，2已失效，3已过期 ,
        let couponStatus = {
          0: '',
          // 已经使用
          1: 'use',
          // 已经失效
          2: 'bad',
          // 已经过期
          3: 'expire'
        }
        return {
          [couponStatus[item.status]]: true
        }
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/user/couponList.scss";
</style>
