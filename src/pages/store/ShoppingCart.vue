<template>
    <f7-page @page:reinit="reinit" :cached="false">
        <!--购物车 shoppingcart.vue-->
        <back title="购物车">
            <div slot="right" class="cart_del" @click="delCart"></div>
        </back>
        <f7-block inner class="shoppingCart" no-hairlines>
            <div class="content">
                <div class="no-goods" v-if="data_len===0">
                    <div class="hint">
                        <p>您的购物车空空如也</p>
                        <p>赶快去绿植商城挑选您的绿植吧</p>
                    </div>
                    <div class="go-home">
                        <span class="my-button" @click="$router.load({url:'/store/home'})">绿植商城</span>
                    </div>
                    <div class="suggest">
                        <div class="line-10"></div>
                        <div class="title">- 购物车精选推荐 -</div>
                        <div class="goods-list">
                            <div class="item" v-for="(goods,index) in recommandList" v-if="index<4"
                                 @click="goGoodsDetail(goods)">
                                <div class="photo"><img :src="goods.img" alt=""></div>
                                <div class="name">{{goods.name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="preList.length>0">
                    <div class="notice">
                        <span>提示：预售商品不与其他商品同时支付</span>
                    </div>
                    <div class="goods-title">
                        <my-checkbox :id="checkAllIdByPre" :disabled="disableByPre"
                                     v-model="checkByPreAll"></my-checkbox>
                        <label :for="checkAllIdByPre" class="checkAll-label">预售</label>
                    </div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(goods,index) in preList">
                            <div class="check">
                                <my-checkbox :id="'preList_check_'+index" :disabled="disableByPre"
                                             v-model="goods.checked"
                                ></my-checkbox>
                                <label :for="'preList_check_'+index" class="check-label"></label>
                            </div>
                            <div class="photo"><img :src="goods.img" alt=""></div>
                            <div class="info">
                                <div class="name">{{goods.name}}</div>
                                <div class="context">
                                    <div v-if="goods.itemtype==itemType.combo">{{goods.brief}}</div>
                                    <div v-if="goods.itemtype==itemType.goods" v-for="attr in goods.attrs">
                                        {{attr.name}}:<span v-for="(item,index) in attr.items">{{item.name}}<span
                                            v-if="index!=attr.items.length-1">,</span></span>
                                    </div>
                                </div>
                                <div class="detail">
                                    <div class="price">￥{{goods.price}}</div>
                                    <div class="count">
                                        <counter v-model="goods.amount" :baseData="goods"
                                                 @changeValue="change"></counter>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="buyList.length>0">
                    <div class="goods-title">
                        <my-checkbox :id="checkAllIdByBuy" :disabled="disableByBuyAndLease"
                                     v-model="checkByBuyAll"></my-checkbox>
                        <label :for="checkAllIdByBuy" class="checkAll-label">购买</label>
                    </div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(goods,index) in buyList">
                            <div class="check">
                                <my-checkbox :id="'buyList_check_'+index" :disabled="disableByBuyAndLease"
                                             v-model="goods.checked"
                                ></my-checkbox>
                                <label :for="'buyList_check_'+index" class="check-label"></label>
                            </div>
                            <div class="photo"><img :src="goods.img" alt=""></div>
                            <div class="info">
                                <div class="name">{{goods.name}}</div>
                                <div class="context">
                                    <div v-if="goods.itemtype==itemType.combo">{{goods.brief}}</div>
                                    <div v-if="goods.itemtype==itemType.goods" v-for="attr in goods.attrs">
                                        {{attr.name}}:<span v-for="(item,index) in attr.items">{{item.name}}<span
                                            v-if="index!=attr.items.length-1">,</span></span>
                                    </div>
                                </div>
                                <div class="detail">
                                    <div class="price">￥{{goods.price}}</div>
                                    <div class="count">
                                        <counter v-model="goods.amount" :baseData="goods"
                                                 @changeValue="change"></counter>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="leaseList.length>0">
                    <div class="goods-title">
                        <my-checkbox :id="checkAllIdByLease" :disabled="disableByBuyAndLease"
                                     v-model="checkByLeaseAll"></my-checkbox>
                        <label :for="checkAllIdByLease" class="checkAll-label">租赁</label>
                    </div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(goods,index) in leaseList">
                            <div class="check">
                                <my-checkbox :id="'leaseList_check_'+index" :disabled="disableByBuyAndLease"
                                             v-model="goods.checked"></my-checkbox>
                                <label :for="'leaseList_check_'+index" class="check-label"></label>
                            </div>
                            <div class="photo"><img :src="goods.img" alt=""></div>
                            <div class="info">
                                <div class="name">{{goods.name}}</div>
                                <div class="context">
                                    <div v-if="goods.itemtype==itemType.combo">{{goods.brief}}</div>
                                    <div v-if="goods.itemtype==itemType.goods" v-for="attr in goods.attrs">
                                        {{attr.name}}:<span v-for="(item,index) in attr.items">{{item.name}}<span
                                            v-if="index!=attr.items.length-1">,</span></span>
                                    </div>
                                </div>
                                <div class="detail">
                                    <div class="price">￥{{goods.price}}/月</div>
                                    <div class="count">
                                        <counter v-model="goods.amount" :baseData="goods"
                                                 @changeValue="change"></counter>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="footer">
                <div class="amount">
                    <div>￥{{amount}}</div>
                    <div class="mini-text">(不含押金)</div>
                </div>
                <div class="pay" @click="goPay">去支付</div>
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { itemType } from 'lib/common'
  import { Cache } from 'lib/utils'
  import { userApi } from 'api'
  import Counter from 'components/counter/counter.vue'

  export default {
    data () {
      return {
        data_len: -1,
        data: [],
        buyList: [],
        leaseList: [],
        preList: [],
        recommandList: [],
        itemType: itemType,
        checkAllIdByPre: 'checkALLByPre' + Math.random(),
        checkAllIdByBuy: 'checkALLByBuy' + Math.random(),
        checkAllIdByLease: 'checkALLByLease' + Math.random(),
        disableByPre: false,
        disableByBuyAndLease: false
      }
    },
    created: function () {
      this.loadData()
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      reinit () {
        userApi.cartList().then((result) => {
          if (this.buyList.length === result.data.buy.length && this.leaseList.length === result.data.lease.length && this.preList.length === result.data.pre.length) {
            // ?
          } else {
            this.setData(result.data)
          }
        })

      },
      loadData () {
        userApi.cartList().then((result) => {
          this.setData(result.data)

        })
      },
      setData (data) {
        if (data.buy === undefined || data.lease === undefined) {
          return
        }
        this.buyList = data.buy
        this.leaseList = data.lease
        // this.preList = data.pre
        this.preList = [{
          'id': 671,
          'item_id': 28,
          'amount': 1,
          'price': 25,
          'attrs': [{'name': '适用场景', 'status': false, 'items': [{'id': 9, 'name': '室内场景'}]}, {
            'name': '绿植规格',
            'status': true,
            'items': [{
              'id': 141,
              'name': '单株普通 高25-30 cm',
              'price': '50.00',
              'leaseprice': '25.00',
              'leaseprice_day': '0.00',
              'deposit': '50.00',
              'delivery': null
            }]
          }],
          'deposit': 50,
          'img': 'http://images.zhuzhulz.com/itemImage_thumb_SAhEwe0fyOOeeibeRgsM.jpg',
          'name': '台面红掌',
          'brief': '其花朵独特，为佛焰苞，色泽鲜艳华丽，色彩丰富，是世界名贵花卉。许多欧美人士都把它视为“热烈”、“豪放”的特征。',
          'itemtype': 0
        }, {
          'id': 672,
          'item_id': 9,
          'amount': 1,
          'price': 269,
          'attrs': [],
          'deposit': 554,
          'img': 'http://images.zhuzhulz.com/itemImage_thumb_zStgbc7tIC3xJa2PZZq7.jpg',
          'name': '大展经纶',
          'brief': '富有吉祥富贵的含义，还可以改善空气质量。',
          'itemtype': 1
        }]
        this.recommandList = data.recommend
        if (this.buyList.length === 0 && this.leaseList.length === 0 && this.preList.length === 0) {
          this.data_len = 0
          return
        } else {
          this.data_len = 1
        }
        this.buyList.forEach((item) => {
          this.$set(item, 'checked', false)
        })
        this.leaseList.forEach((item) => {
          this.$set(item, 'checked', false)
        })
        this.preList.forEach((item) => {
          this.$set(item, 'checked', false)
        })

        this.$watch('preList', (newPreList) => {
          this.disableByBuyAndLease = newPreList.map((item) => item.checked).some((checked) => checked)
        }, {deep: true})
        this.$watch('buyList', (newBuyList) => {
          this.disableByPre = newBuyList.map((item) => item.checked).some((checked) => checked)
        }, {deep: true})
        this.$watch('leaseList', (newLeaseList) => {
          this.disableByPre = newLeaseList.map((item) => item.checked).some((checked) => checked)
        }, {deep: true})

      },
      goGoodsDetail (goods) {
        if (goods.type >> 0 === itemType.goods) {
          this.$router.load({url: `/store/goodsDetail/${goods.recommend_id}`})
        } else if (goods.type >> 0 === itemType.combo) {
          this.$router.load({url: `/store/comboDetail/${goods.recommend_id}`})
        }
      },
      change ({baseData, value}) {
        userApi.editCartNum({
          cart_id: baseData.id,
          num: value
        })
      },
      getIds () {
        let ids = []
        var checkedData = [].concat(this.buyList).concat(this.leaseList).concat(this.preList).filter((item) => {
          if (item.checked) {
            ids.push(item.id)
            return true
          } else {
            return false
          }
        })
        return ids
      },
      delCart: function () {
        let ids = this.getIds()
        if (ids.length <= 0) {
          this.$f7.alert('选择要删除的目标')
          return
        }
        this.$f7.confirm('确定删除选中的目标？', '', () => {
          // 删除逻辑
          userApi.delCartItem(ids.join(',')).then((result) => {
            ids.forEach((id) => {
              let index = this.buyList.findIndex((item) => item.id === id)
              if (index === -1) {
                let index = this.leaseList.findIndex((item) => item.id === id)
                this.leaseList.splice(index, 1)
              } else {
                this.buyList.splice(index, 1)
              }
            })
            if (this.buyList.length === 0 && this.leaseList.length === 0 && this.preList.length === 0) {
              this.data_len = 0
            }

          })
        })

      },
      goPay: function () {
        let items = [];
        [].concat(this.buyList).concat(this.leaseList).concat(this.preList).forEach((item) => {
          if (item.checked) {
            items.push(item.id)
          }
        })
        if (items.length <= 0) {
          this.$f7.alert('请选择要购买的商品')
          return
        }
        let step = 100
        setTimeout(() => {
          userApi.addOrder(items.join(',')).then((result) => {
            Cache.set('cartList', result.data)
            this.$router.load({url: '/store/pay'})
          })
        }, step)

      }

    },
    computed: {
      checkByPreAll: {
        get: function () {
          if (this.preList.length <= 0) {
            return false
          }
          return this.preList.every((item) => item.checked)
        },
        set: function (value) {
          this.preList.forEach((item) => item.checked = value)
        }
      },
      checkByBuyAll: {
        get: function () {
          if (this.buyList.length <= 0) {
            return false
          }
          return this.buyList.every((item) => item.checked)
        },
        set: function (value) {
          this.buyList.forEach((item) => item.checked = value)
        }
      },
      checkByLeaseAll: {
        get: function () {
          if (this.leaseList.length <= 0) {
            return false
          }
          return this.leaseList.every((item) => item.checked)
        },
        set: function (value) {
          this.leaseList.forEach((item) => item.checked = value)
        }
      },
      amount: function () {
        let amount = 0
        let minNum = 2
        this.buyList.forEach((item) => {
          if (item.checked) {
            amount += item.price * item.amount
          }
        })
        this.leaseList.forEach((item) => {
          if (item.checked) {
            amount += parseFloat(item.price) * item.amount
          }
        })
        return amount.toFixed(minNum)
      }
    },
    components: {Counter}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/store/shoppingCart.scss";
</style>
