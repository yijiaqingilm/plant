<template>
    <f7-page>
        <!--我的订单 myorder.vue-->
        <back title="代下单列表" back-link=""></back>
        <f7-block inner class="myOrder" no-hairlines>
            <div class="tabs">
                <div class="tab" :class="{active:orderItem==orderType.plantOrder}"
                     @click="changeOrderItem(orderType.plantOrder)">绿植代下单
                </div>
                <div class="tab" :class="{active:orderItem==orderType.careOrder}"
                     @click="changeOrderItem(orderType.careOrder)">养护代下单
                </div>
            </div>
            <div class="order order2" v-show="orderItem==orderType.plantOrder">
                <div class="no-order" v-if="plantOrderListLen==0">
                    <div class="hint">
                        <p>暂无订单</p>
                    </div>
                </div>
                <div class="plant-order-list ">
                    <div class="order-msg" v-if="plantAmount>0">有{{plantAmount}}单月结订单，请提前通知用户付款</div>
                    <div class="item" v-for="(item,index) in plantOrderList" @click="goPlantDetail(item)">
                        <div class="item-header">
                            <div :class="{'color-warn':item.impending}">订单{{item.id}}
                                <span :class="{'color-theme':!item.impending}"
                                      v-if="item.type==plantType.buy">(购买)</span>
                                <span :class="{'color-theme':!item.impending}"
                                      v-if="item.type==plantType.lease">(租赁)</span>
                            </div>
                            <div><span class="status"
                                       :class="{warn:plantOrderStatus[item.status] && plantOrderStatus[item.status].warn}">{{plantOrderStatus[item.status] && plantOrderStatus[item.status].value}}</span>
                            </div>
                        </div>
                        <div class="address-info">
                            <div v-if="item.company">{{item.company}}</div>
                            <div class="address">
                                {{item.address}}
                            </div>
                            <div class="contacts">
                                联系人:{{item.contact}}
                            </div>
                            <div class="phone" @click.stop="call(item.mobile)">
                                联系电话：<a :href="'tel:'+item.mobile" class="external"><span class="phone-number">{{item.mobile}}<span
                                    class="phone_icon"></span></span></a>
                            </div>
                        </div>
                        <div class="item-context">
                            <div class="plant-list">
                                <div class="plant-item" v-if="item.img" v-for="img in item.img">
                                    <img :src="img" alt="">
                                </div>
                                <div class="item-gt">
                                    <span class="gt"></span>
                                </div>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div>下单时间：{{item.created_at}}</div>
                            <div>合计：<span class="total">￥{{item.payment}}</span></div>
                        </div>
                    </div>
                    <infinite-loading :isInit="orderItem==orderType.plantOrder" :on-infinite="loadPlantOrderList"
                                      ref="plantOrderLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results"></div>
                    </infinite-loading>
                </div>
            </div>
            <div class="order order3" v-show="orderItem==orderType.careOrder">
                <div class="no-order" v-if="maintenanceListLen==0">
                    <div class="hint">
                        <p>暂无订单</p>
                    </div>
                </div>
                <div class="order-msg" v-if="maintenanceAmount>0">有{{maintenanceAmount}}单月结订单，请提前通知用户付款</div>
                <div class="plant-order-list " v-show="maintenanceList.length>0">
                    <div class="item" v-for="(item,index) in maintenanceList" @click="goPlantDetail(item)">
                        <div class="item-header">
                            <div :class="{'color-warn':item.impending}">订单{{item.id}}</div>
                            <div><span class="status"
                                       :class="{warn:plantOrderStatus[item.status] && plantOrderStatus[item.status].warn}">{{plantOrderStatus[item.status] && plantOrderStatus[item.status].value}}</span>
                            </div>
                        </div>
                        <div class="address-info">
                            <div v-if="item.company">{{item.company}}</div>
                            <div class="address">
                                {{item.address}}
                            </div>
                            <div class="contacts">
                                联系人:{{item.contact}}
                            </div>
                            <div class="phone" @click.stop="call(item.mobile)">
                                联系电话：<a :href="'tel:'+item.mobile" class="external"><span class="phone-number">{{item.mobile}}<span
                                    class="phone_icon"></span></span></a>
                            </div>
                        </div>
                        <div class="item-context">
                            <div class="plant-list">
                                <div class="plant-item" v-if="item.img" v-for="img in item.img">
                                    <img :src="img" alt="">
                                </div>
                                <div class="item-gt">
                                    <span class="gt"></span>
                                </div>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div>下单时间：{{item.created_at}}</div>
                            <div>合计：<span class="total">￥{{item.payment}}</span></div>
                        </div>
                    </div>
                    <infinite-loading :isInit="orderItem==orderType.careOrder" :on-infinite="loadCareOrderList"
                                      ref="careOrderLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results"></div>
                    </infinite-loading>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { orderStatus } from 'lib/common'
  import { sellApi, commonApi } from 'src/api/index'
  import { Cache } from 'lib/utils'
  import InfiniteLoading from 'components/infiniteLoading/components/InfiniteLoading.vue'
  import UserSubsOrderList from 'section/user/subsOrderList/subsOrderList.vue'
  import { orderList2Mixin } from 'mixins/orderList2Mixin'

  export default {
    data () {
      return {
        orderItem: 1,
        // 1绿植订单 2 养护订单
        orderType: {
          plantOrder: 1,
          careOrder: 2
        },
        // 绿植订单
        // 购买订单状态：0未付款，1已付款，2配送中，8已完成，9已取消;
        // 租赁订单（购买/租赁订单）状态：0未付款，1已付款，2配送中，3养护中，5已到期，6已收回，8已完成，9已取消
        plantOrderStatus: {
          [orderStatus.nonPayment]: {value: '用户未支付', warn: true},
          [orderStatus.unauditedVoucher]: {value: '待核账', warn: true}, /* 等待财务收款*/
          [orderStatus.paid]: {value: '用户已付款', warn: false},
          [orderStatus.distribution]: {value: '用户已付款', warn: false},
          [orderStatus.maintenance]: {value: '用户已付款', warn: false},
          [orderStatus.expired]: {value: '用户已付款', warn: false}, // 已到期
          [orderStatus.hasrecyled]: {value: '用户已付款', warn: false}, // 已收回
          [orderStatus.MExpired]: {value: '用户已付款', warn: false}, // 养护到期
          [orderStatus.completed]: {value: '用户已付款', warn: false},
          [orderStatus.canceled]: {value: '订单已取消', warn: true},
          [orderStatus.refunded]: {value: '订单已取消', warn: true}, // 已退款
          [orderStatus.expiredByL]: {value: '订单已付款', warn: true}, // 人工租赁干涉到期
          [orderStatus.expiredByM]: {value: '订单已付款', warn: false} // 人工养护干涉到期;
        },
        bookOrderList: [],
        plantOrderList: [],
        maintenanceList: [],
        bookOrderListLen: -1,
        plantOrderListLen: -1,
        maintenanceListLen: -1,
        // 预约订单 预约类型
        type: {
          0: '上门服务',
          1: '风水服务预约'
        },
        // warn：状态显示的颜色 true 为红色
        status: {
          [orderStatus.paid]: {value: '已支付', warn: false},
          [orderStatus.nonPayment]: {value: '待支付', warn: true},
          [orderStatus.completed]: {value: '已完成', warn: false},
          [orderStatus.canceled]: {value: '已取消', warn: true},
          [orderStatus.haveEvaluation]: {value: '已评价', warn: false},
          [orderStatus.refunded]: {value: '已退款', warn: true},
          [orderStatus.noVisiting]: {value: '待上门', warn: true},
          [orderStatus.goingByService]: {value: '待上门', warn: true},
          [orderStatus.goingByGeo]: {value: '待上门', warn: true},
        },
        bookPage: 1,
        plantPage: 1,
        carePage: 1,
        plantAmount: 0,
        maintenanceAmount: 0
      }
    },
    mixins: [orderList2Mixin],
    created () {
      this.orderItem = Cache.get('orderItem') || 1
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      call (mobile) {
        // call
      },
      goPlantDetail: function (item) {
        this.$router.load({url: `/sell/orderDetail/${item.id}`})
      },
      changeOrderItem: function (itemId) {
        this.orderItem = itemId
        switch (this.orderItem >>> 0) {
          case this.orderType.bookOrder:
            break
          case this.orderType.plantOrder:
            break
          case this.orderType.careOrder:
            break
          default:
            break
        }

      },

      loadPlantOrderList: function () {
        sellApi.orderList(1, this.plantPage).then((result) => {
          if (result.data.items.length > 0) {
            this.plantOrderList = [].concat(this.plantOrderList).concat(result.data.items)
            this.$refs.plantOrderLoading.$emit('$InfiniteLoading:loaded')
            this.plantPage++
            this.plantAmount = result.data.amount

          } else {
            this.$refs.plantOrderLoading.$emit('$InfiniteLoading:complete')
          }
          this.plantOrderListLen = this.plantOrderList.length
        })

      },
      loadCareOrderList: function () {
        sellApi.orderList(0, this.carePage).then((result) => {
          if (result.data.items.length > 0) {
            this.maintenanceList = [].concat(this.maintenanceList).concat(result.data.items)
            this.$refs.careOrderLoading.$emit('$InfiniteLoading:loaded')
            this.carePage++
            this.maintenanceAmount = result.data.amount
          } else {
            this.$refs.careOrderLoading.$emit('$InfiniteLoading:complete')
          }
          this.maintenanceListLen = this.maintenanceList.length
        })

      },

    },
    components: {UserSubsOrderList, InfiniteLoading},
    watch: {
      bookOrderList (value) {
        console.log('bookorderlist', value)
        this.bookOrderListLen = value.length > 0 ? 1 : 0
      },
      plantOrderList (value) {
        console.log('plantOrderList', value)
        this.plantOrderListLen = value.length > 0 ? 1 : 0
      },
      maintenanceList (value) {
        console.log('maintenanceList', value)
        this.maintenanceListLen = value.length > 0 ? 1 : 0
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/user/myOrder.scss";

    .content-block {
        height: 100%;
    }

    .content-block-inner {
        height: 100%;
    }
</style>
