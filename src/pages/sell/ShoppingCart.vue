<template>
    <f7-page @page:reinit="reinit" :cached="false">
        <!--购物车 shoppingcart.vue-->
        <back title="购物车">
            <div slot="right" class="cart_del" @click="delCart"></div>
        </back>
        <f7-block inner class="shoppingCart" no-hairlines>
            <div class="content">
                <div class="form no-border">
                    <div class="user-group">
                        <div class="group ">
                            <div class="form-label">用户编号：</div>
                            <div class="form-input"><input v-model="userNumber" placeholder="请输入用户编号" type="text">
                            </div>
                        </div>
                        <div><span class="middle-button" @click="getUser">确定</span></div>
                    </div>
                    <div class="address" @click="goAddressList">
                        <span class="gt"></span>
                        <div class="address-group ">
                            <div class="group">
                                <div class="form-label">用户名：</div>
                                <div class="form-input"><input placeholder="" :value="userInfo.nickname" readonly
                                                               type="text">
                                </div>
                            </div>
                            <div class="group">
                                <div class="form-label">公司名称：</div>
                                <div class="form-input"><input :value="userInfo.company" placeholder="" type="text">
                                </div>
                            </div>
                            <div class="group">
                                <div class="form-label">联系人：</div>
                                <div class="form-input"><input :value="userInfo.contact" placeholder="" type="text">
                                </div>
                            </div>
                            <div class="group">
                                <div class="form-label">联系电话：</div>
                                <div class="form-input"><input :value="userInfo.mobile" placeholder="" type="text">
                                </div>
                            </div>

                            <div class="group">
                                <div class="form-label">地址：</div>
                                <div class="form-input"><input :value="userInfo.address" placeholder="" type="text">
                                </div>
                            </div>
                            <div class="group no-border">
                                <div class="form-label">详细地址：</div>
                                <div class="form-input"><input :value="userInfo.addressdetail" placeholder=""
                                                               type="text">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="goods-wrap" v-if="buyList.length>0">

                    <div class="goods-type">
                        购买
                    </div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(goods,index) in buyList">
                            <div class="check">
                                <my-checkbox :id="'buyList_check_'+index" v-model="goods.checked"
                                ></my-checkbox>
                                <label :for="'buyList_check_'+index" class="check-label"></label>
                            </div>
                            <div class="photo"><img :src="goods.img" alt=""></div>
                            <div class="info">
                                <div class="name">{{goods.name}}</div>
                                <div class="context">
                                    <div v-if="goods.itemtype==itemType.combo">{{goods.brief}}</div>
                                    <div v-if="goods.itemtype==itemType.goods" v-for="attr in goods.attrs">
                                        {{attr.name}}:<span v-for="item in attr.items">{{item.name}}</span>
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
                    <div class="goods-type">租赁</div>
                    <div class="goods-list">
                        <div class="goods-item" v-for="(goods,index) in leaseList">
                            <div class="check">
                                <my-checkbox :id="'leaseList_check_'+index" v-model="goods.checked"></my-checkbox>
                                <label :for="'leaseList_check_'+index" class="check-label"></label>
                            </div>
                            <div class="photo"><img :src="goods.img" alt=""></div>
                            <div class="info">
                                <div class="name">{{goods.name}}</div>
                                <div class="context">
                                    <div v-if="goods.itemtype==itemType.combo">{{goods.brief}}</div>
                                    <div v-if="goods.itemtype==itemType.goods" v-for="attr in goods.attrs">
                                        {{attr.name}}:<span v-for="item in attr.items">{{item.name}}</span>
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
                <div class="checkAll ">
                    <my-checkbox :id="checkAllId" v-model="checkAll"></my-checkbox>
                    <label :for="checkAllId" class="checkAll-label">全选</label></div>
                <div class="amount">
                    <div>￥{{amount}}</div>
                </div>
                <div class="pay" @click="goPay">下单</div>
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { itemType } from 'lib/common'
  import { Cache } from 'lib/utils'
  import { userApi, sellApi } from 'api'
  import Counter from 'components/counter/counter.vue'

  export default {
    data () {
      return {
        data_len: -1,
        data: [],
        buyList: [],
        leaseList: [],
        recommandList: [],
        itemType: itemType,
        checkAllId: 'checkALL' + Math.random(),
        orderInfo: {},
        userNumber: ''
      }
    },
    created: function () {
      this.userNumber = this.userId
      this.loadData()
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      goAddressList () {
        if (this.userId !== '') {
          Cache.set('customer_id', this.userId)
          this.$router.load({
            url: '/user/address/list',
            query: {isChange: true}
          })
        } else {
          this.$f7.alert('请输入有效的用户编号并点击确定', '')
        }
      },
      getUser () {
        sellApi.getUserById(this.userNumber, 0).then(({data}) => {
          this.$store.state.userId = this.userNumber
          this.$store.state.user_address = data

        })
      },
      reinit () {
        userApi.cartList().then((result) => {
          if (this.buyList.length === result.data.buy.length && this.leaseList.length === result.data.lease.length) {
            // ?
          } else {
            this.loadData()
          }
        })

      },
      loadData () {
        userApi.cartList().then((result) => {
          if (result.data.buy === undefined || result.data.lease === undefined) {
            return
          }
          this.buyList = result.data.buy
          this.leaseList = result.data.lease
          this.recommandList = result.data.recommend
          if (this.buyList.length === 0 && this.leaseList.length === 0) {
            this.data_len = 0
            return
          } else {
            this.data_len = 1
          }
          this.buyList.forEach((item) => this.$set(item, 'checked', false))
          this.leaseList.forEach((item) => this.$set(item, 'checked', false))

        })
      },
      goGoodsDetail (goods) {
        if (parseInt(goods.type, 10) === itemType.goods) {
          this.$router.load({url: `/store/goodsDetail/${goods.recommend_id}`})
        } else if (parseInt(goods.type, 10) === itemType.combo) {
          this.$router.load({url: `/store/comboDetail/${goods.recommend_id}`})
        }
      },
      change ({baseData, value}) {
        userApi.editCartNum({
          cart_id: baseData.id,
          num: value
        }).then((result) => {
          let mergeList = [].concat(this.buyList).concat(this.leaseList)
        })
      },
      getIds () {
        let ids = []
        var checkedData = [].concat(this.buyList).concat(this.leaseList).filter((item) => {
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
            if (this.buyList.length === 0 && this.leaseList.length === 0) {
              this.data_len = 0
            }

          })
        })

      },
      goPay: function () {
        let items = [];
        [].concat(this.buyList).concat(this.leaseList).forEach((item) => {
          if (item.checked) {
            items.push(item.id)
          }
        })
        if (items.length <= 0) {
          this.$f7.alert('请选择要购买的商品')
          return
        }
        if (this.userId === '') {
          this.$f7.alert('请输入有效的用户编号并点击确定')
          return
        }
        if (this.userInfo.id === undefined || this.userInfo.id === '') {
          this.$f7.alert('请选择地址')
          return
        }
        // 预防手动修改数量 导致数量延迟显示。
        let step = 1000
        setTimeout(() => {
          userApi.addOrder(items.join(',')).then((result) => {
            Cache.set('user_id', this.userId)
            Cache.set('cartList', result.data)
            this.$router.load({url: '/sell/pay'})
          })
        }, step)

      }

    },
    computed: {
      checkAll: {
        get: function () {
          if (this.buyList.length <= 0 && this.leaseList.length <= 0) {
            return false
          }
          return [].concat(this.buyList).concat(this.leaseList).every((item) => item.checked)
        },
        set: function (value) {
          [].concat(this.buyList).concat(this.leaseList).forEach((item) => {
            item.checked = value
          })
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
      },
      userInfo () {
        return this.$store.state.user_address
      },
      userId () {
        return this.$store.state.userId
      }
    },
    components: {Counter}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/store/shoppingCart.scss";
</style>
