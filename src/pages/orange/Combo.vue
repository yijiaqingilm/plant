<template>
    <f7-page @page:reinit="reinit">
        <back title="套餐详情">
            <div slot="right" class="cart" @click="goCart">
                <span class='cart-count' v-if="cartCount>0">{{cartCount}}</span>
            </div>
        </back>
        <f7-block inner class="goodsDetail" no-hairlines v-if="goods!=null">
            <div class="header">
                <f7-swiper pagination :init="false" class="banners-top">
                    <f7-swiper-slide v-if="goods.img" v-for="(img,index) in goods.img" :key="index">
                        <img :src="img.img" alt="">
                    </f7-swiper-slide>
                </f7-swiper>

            </div>
            <div class="content">
                <div class="info">
                    <div class="goods-name">超值套餐:{{goods.name}}</div>
                    <div class="group">
                        <div class="group-label">套餐寓意:</div>
                        <div class="group-item brief">{{goods.brief}}</div>
                    </div>
                    <div class="combo-list">
                        <f7-swiper :init="false" class="banners-goods-img">
                            <f7-swiper-slide v-if="goods.composite" v-for="(item,index) in goods.composite"
                                             :key="index">
                                <div class="combo-item">
                                    <div class="img">
                                        <img :src="item.img" alt="">
                                    </div>
                                    <div class="remark">
                                        <div>{{item.name}}</div>
                                        <div>{{item.remark}}</div>
                                    </div>
                                </div>
                            </f7-swiper-slide>
                        </f7-swiper>
                    </div>

                    <div class="group mb-10 mt-10">
                        <div class="group-label">适用面积:</div>
                        <div class="group-item">{{goods.area}}平方</div>
                    </div>
                    <div class="group mb-10">
                        <div class="group-label">数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量:</div>
                        <div class="group-item">
                            <counter v-model="curGoods.amount"></counter>
                        </div>
                    </div>
                    <div class="group  color-gray">
                        <div class="group-label">原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价:</div>
                        <div class="group-item line-through">￥{{goods.oriprice}}/月</div>
                    </div>
                    <div class="group  color-gray">
                        <div class="group-label">定金比例选择:</div>
                        <div class="group-item">
                            <my-select v-model="rate" :options="rateArr" optionKey="id" optionValue="value">

                            </my-select>
                        </div>
                    </div>
                    <p class="color-warn g-desc">选择支付定金金额可得相同金额无门槛现金抵扣券</p>
                    <div class='g-rule'>
                        <div>预售规则:</div>
                        <div>
                            {{goods.rule}}
                        </div>
                    </div>

                </div>
                <div class="line-10"></div>

                <div class="goods-detail" v-html="goods.detail">
                </div>
            </div>


        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="combo-footer">
                <div><span class='color-black'>定金:</span>￥{{deposit | toFixed}}</div>
                <div class="footer-lease" @click="addCart()">预定</div>
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { Cache, commonly } from 'lib/utils'
  import { goodsType, wx_share, gotoCart } from 'lib/common'
  import TypeSelector from 'components/typeSelector/typeSelector.vue'
  import Counter from 'components/counter/counter.vue'
  import wx from 'wx'
  import MySelect from 'components/mySelect/mySelect.vue'

  let icon_success = require('../../assets/icon-gou.png')
  export default {
    data () {
      return {
        curGoods: {
          amount: 1,
        },
        goods: {},
        goodsType: goodsType,
        comboId: -1,
        cartCount: 0,
        rate: null,
        defaultRate: {id: -1, rate: 0, value: '请选择定金比例', hideOption: true}
      }
    },
    created: function () {
      this.rate = this.defaultRate
      this.comboId = this.$route.params.comboId
      userApi.comboDetail(this.comboId).then((result) => {
        this.goods = result.data
        this.goods.prerate = [{id: '1', rate: 0.15}, {id: '2', rate: 0.35}]
        this.$nextTick(() => {
          var mySwiper = this.$f7.swiper('.banners-top', {
            pagination: '.swiper-pagination',
            speed: 500,
            autoplay: 2000
          })
          this.$f7.swiper('.banners-goods-img', {
            pagination: '.swiper-pagination2',
            slidesPerView: 4.5,
            paginationClickable: true,
            spaceBetween: 5,
            freeMode: true
            /* slidesPerView: 3*/
          })

        })
        let step = 500
        setTimeout(() => {
          window.wx.ready(() => {
            var that = this
            var title = that.goods.name
            var desc = that.goods.brief
            var imgUrl = 'http://images.zhuzhulz.com/share3.jpg'
            var link = location.protocol + '//' + location.host + '/#' + location.href.split('#')[1]
            wx_share(title, link, imgUrl, desc)

          })
        }, step)

      })
      userApi.getCartNum().then((result) => {
        this.cartCount = result.data
      })

    },
    methods: {
      goCart () {
        gotoCart(this)
      },
      alertDeposit () {
        this.$f7.alert('租赁期满将进行绿植核查，<br>如无损坏缺失押金将全额退还')
      },
      reinit () {
        userApi.getCartNum().then((result) => {
          this.cartCount = result.data
        })
        wx.ready(() => {
          var that = this
          var title = that.goods.name
          var desc = that.goods.brief
          var imgUrl = 'http://images.zhuzhulz.com/share3.jpg'
          var link = location.protocol + '//' + location.host + '/#' + location.href.split('#')[1]
          wx_share(title, link, imgUrl, desc)

        })
      },
      addCart () {
        this.curGoods.attrIds = []
        for (let key in this.curGoods.attr) {
          if (this.curGoods.attr.hasOwnProperty(key)) {
            this.curGoods.attrIds.push(this.curGoods.attr[key].id)
          }

        }
        Object.assign(this.curGoods, {
          type: this.goods.type,
          composite_id: this.comboId,
        })
        userApi.addCart(this.curGoods).then((result) => {
          this.cartCount += this.curGoods.amount
          var modal = this.$f7.modal({
            title: '',
            text: '<div><img src="' + icon_success + '" class="icon_success"></div><div>加入购物车成功</div>',
          })
          let step = 2000
          setTimeout(() => {
            this.$f7.closeModal(modal)
          }, step)
        })
      },
    },
    computed: {
      rateArr () {
        if (commonly.isEmptyObject(this.goods)) {
          return []
        }
        let rateArr = []
        rateArr.push(this.defaultRate)
        let hundred = 100
        let num = 2
        this.goods.prerate.forEach((rate) => {
          rateArr.push({
            id: rate.id,
            rate: rate.rate,
            value: `${rate.rate * hundred}% ￥${Number(this.goods.leaseprice * rate.rate).toFixed(num)}`
          })
        })
        return rateArr
      },
      deposit () {
        if (this.rate.id === -1) {
          return 0
        } else {
          return parseFloat(this.rate.rate * this.goods.leaseprice)
        }
      }
    },
    components: {TypeSelector, Counter, MySelect}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/goodsDetail.scss";
</style>

