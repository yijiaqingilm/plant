<template>
    <f7-page>
        <!--我的订单 myorder.vue-->
        <back title="我的订单" back-link=""></back>
        <f7-block inner class="myOrder" no-hairlines>
            <div class="tabs">
                <div class="tab" :class="{active:orderItem==orderType.bookOrder}"
                     @click="changeOrderItem(orderType.bookOrder)">预约订单
                </div>
                <div class="tab" :class="{active:orderItem==orderType.plantOrder}"
                     @click="changeOrderItem(orderType.plantOrder)">绿植订单
                </div>
                <div class="tab" :class="{active:orderItem==orderType.careOrder}"
                     @click="changeOrderItem(orderType.careOrder)">养护订单
                </div>
                <div class="tab" :class="{active:orderItem==orderType.preOrder}"
                     @click="changeOrderItem(orderType.preOrder)">预售订单
                </div>
            </div>
            <div class="order order1" v-show="orderItem==orderType.bookOrder">
                <div class="no-order" v-if="bookOrderListLen==0">
                    <div class="hint">
                        <p>您还没有任何预约上门记录，</p>
                        <p>赶快前往绿植服务预约吧</p>
                    </div>
                    <div class="go">
                        <!--@click="$router.load({url:'/'})"-->
                        <!--<div><span class="middle-button">风水服务预约</span></div>-->
                        <div><span class="my-button" @click="$router.load({url:'/user/book'})">预约上门</span></div>
                    </div>
                </div>
                <div class="order-list" v-show="bookOrderList.length>0">
                    <div class="order-item" v-for="(item,index) in bookOrderList">
                        <div class="order-info">
                            <div>预约编号:{{item.id}}</div>
                            <div>预约类型:<span class='have'>{{type[item.type]}}</span></div>
                            <div>预约时间:{{item.created_at}}</div>
                            <div>上门服务人员：{{item.customer}}</div>
                        </div>
                        <div class="order-status">
                            <!-- 状态 -->
                            <div class="status" :class="{warn:status[item.status] && status[item.status].warn}">
                                {{status[item.status] && status[item.status].value}}
                            </div>
                            <!-- 操作-->
                            <div v-if="showComment(item.status,item.type)">
                                <span class="btn-link active">去评价</span>
                            </div>
                            <div v-if="showPay(item.status,item.type)">
                                <span class="btn-link active ml-10">去支付</span>
                            </div>
                            <div v-if="showOnSite(item.status,item.type)">
                                <span class="btn-link active ml-10" @click="onSite(item)">确认上门</span>
                            </div>
                            <div v-if="showCancel(item.status)">
                                <span class="btn-link  ml-10" @click="cancelOrder(item)">取消预约</span>
                            </div>
                            <div v-if="showDel(item.status)">
                                <span class="btn-link  ml-10" @click="delOrder(item,index)">删除订单</span>
                            </div>

                        </div>
                    </div>
                    <infinite-loading :isInit="orderItem==orderType.bookOrder" :on-infinite="loadBookOrderList"
                                      ref="bookOrderLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results">没有数据</div>
                    </infinite-loading>
                </div>
            </div>
            <div class="order order2" v-show="orderItem==orderType.plantOrder">
                <div class="no-order" v-if="plantOrderListLen==0">
                    <div class="hint">
                        <p>您还没有任何绿植购买或租赁记录</p>
                        <p>赶快前往绿植商城挑选您的绿植吧</p>
                    </div>
                    <div class="go">
                        <div><span class="my-button" @click="$router.load({url:'/store/home'})">绿植商城</span></div>
                    </div>
                </div>
                <div class="plant-order-list ">
                    <div class="item" v-for="(item,index) in plantOrderList" @click="goPlantDetail(item)">
                        <div class="item-header">
                            <div>{{item.isagent?'代下':''}}订单{{item.id}}
                                <span class="color-theme" v-if="item.type==plantType.buy">(购买)</span>
                                <span class="color-theme" v-if="item.type==plantType.lease">(租赁)</span>
                            </div>
                            <div v-if="plantOrderStatus[item.status]"><span class="status"
                                                                            :class="{warn:plantOrderStatus[item.status] && plantOrderStatus[item.status].warn}">{{plantOrderStatus[item.status].value}}</span>
                            </div>
                        </div>
                        <div class="item-context">
                            <div class="plant-list">
                                <div class="plant-item" v-if="item.items" v-for="img in item.items">
                                    <img :src="img.img" alt="">
                                </div>
                                <div class="item-gt">
                                    <span class="gt"></span>
                                </div>
                            </div>
                            <div class="context-footer">
                                <div>{{item.describe}}</div>
                                <div>(含运费)&nbsp;合计：<span class="total">￥{{item.price}}</span></div>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div>下单时间：{{item.created_at}}</div>
                            <div>
                                <span class="btn-link" v-if="showPlantOrderDel(item)"
                                      @click.stop="delPlantOrder(item,index)">删除订单</span>
                                <span class="btn-link active ml-10" v-if="showPlantOrderPay(item)"
                                      @click.stop="goPlantPay(item,1)">去支付</span>
                                <span class="btn-link active ml-10" v-if="showBuyAgain(item)"
                                      @click.stop="buyAgain(item)">再次购买</span>
                                <span class="btn-link active ml-10" v-if="showRelet(item)"
                                      @click.stop="relet(item)">续租</span>
                                <span class="btn-link ml-10" v-if="showCancelPlantOrder(item)"
                                      @click.stop="cancelPlantOrder(item)">取消订单</span>
                                <span class="color-warn ml-10" v-if="showReturn(item)">押金已退</span>
                            </div>
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
                        <p>您还没有任何绿植养护记录,</p>
                        <p>赶快预约专业人员对您的绿植进行体检养护吧</p>
                    </div>
                    <div class="go">
                        <div><span class="my-button" @click="$router.load({url:'/user/book'})">预约上门</span></div>
                    </div>
                </div>
                <div class="plant-order-list " v-show="maintenanceList.length>0">
                    <div class="item" v-for="(item,index) in maintenanceList" @click="goPlantDetail(item)">
                        <div class="item-header">
                            <div>订单{{item.id}}
                            </div>
                            <div v-if="plantOrderStatus[item.status]"><span class="status"
                                                                            :class="{warn:plantOrderStatus[item.status] && plantOrderStatus[item.status].warn}">{{plantOrderStatus[item.status].value}}</span>
                            </div>
                        </div>
                        <div class="item-context">
                            <div class="plant-list">
                                <div class="plant-item" v-if="item.items" v-for="img in item.items">
                                    <img :src="img.img" alt="">
                                </div>
                                <div class="item-gt">
                                    <span class="gt"></span>
                                </div>
                            </div>
                            <div class="context-footer">
                                <div>{{item.describe}}</div>
                                <div>合计：<span class="total">￥{{item.price}}</span></div>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div>下单时间：{{item.created_at}}</div>
                            <div>
                                <span class="btn-link" v-if="showPlantOrderDel(item)"
                                      @click.stop="delmaintenanceOrder(item,index)">删除订单</span>
                                <span class="btn-link active ml-10" v-if="showPlantOrderPay(item)"
                                      @click.stop="goPlantPay(item,2)">去支付</span>
                                <span class="btn-link active ml-10" v-if="showBuyAgain(item)" @click="buyAgain(item)">再次购买</span>
                                <span class="btn-link active ml-10" v-if="showRelet(item)"
                                      @click.stop="relet(item)">续租</span>
                                <span class="btn-link  ml-10" v-if="showCancelPlantOrder(item)"
                                      @click.stop="cancelPlantOrder(item)">取消订单</span>
                                <span class="color-warn ml-10" v-if="showReturn(item)">押金已退</span>
                            </div>
                        </div>
                    </div>
                    <infinite-loading :isInit="orderItem==orderType.careOrder" :on-infinite="loadCareOrderList"
                                      ref="careOrderLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results"></div>
                    </infinite-loading>
                </div>
            </div>
            <div class="order order4" v-show="orderItem==orderType.preOrder">
                <div class="no-order" v-if="preOrderListLen==0">
                    <div class="hint">
                        <p>您还没有任何预售订单</p>
                        <p>赶快前往商城挑选您的绿植吧</p>
                    </div>
                    <div class="go">
                        <div><span class="my-button" @click="$router.load({url:'/orange/home'})">绿植商城</span></div>
                    </div>
                </div>
                <div class="plant-order-list " v-show="preOrderList.length>0">
                    <div class="item" v-for="(item,index) in preOrderList" @click="goPlantDetail(item)">
                        <div class="item-header">
                            <div>订单{{item.id}}
                            </div>
                            <div v-if="plantOrderStatus[item.status]"><span class="status"
                                                                            :class="{warn:plantOrderStatus[item.status] && plantOrderStatus[item.status].warn}">{{plantOrderStatus[item.status].value}}</span>
                            </div>
                        </div>
                        <div class="item-context">
                            <div class="plant-list">
                                <div class="plant-item" v-if="item.items" v-for="img in item.items">
                                    <img :src="img.img" alt="">
                                </div>
                                <div class="item-gt">
                                    <span class="gt"></span>
                                </div>
                            </div>
                            <div class="context-footer">
                                <div>{{item.describe}}</div>
                                <div>合计：<span class="total">￥{{item.price}}</span></div>
                            </div>
                        </div>
                        <div class="item-footer">
                            <div>下单时间：{{item.created_at}}</div>
                            <div>
                                <span class="btn-link" v-if="showPreOrderDel(item)"
                                      @click.stop="delmaintenanceOrder(item,index)">删除订单</span>
                                <span class="btn-link active ml-10" v-if="showPreOrderPayByD(item)"
                                      @click.stop="goPlantPay(item,3)">付定金</span>
                                <span class="btn-link active ml-10" v-if="showPreOrderPayByW(item)"
                                      @click.stop="goPlantPay(item,3)">付尾款</span>
                            </div>
                        </div>
                    </div>
                    <infinite-loading :isInit="orderItem==orderType.preOrder" :on-infinite="loadPreOrderList"
                                      ref="preOrderLoading" spinner="bubbles">
                        <div slot="no-more">没有更多数据</div>
                        <div slot="no-results"></div>
                    </infinite-loading>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi, orangeApi } from 'api'
  import { orderStatus, preOrderStatus } from 'lib/common'
  import { Cache } from 'lib/utils'
  import InfiniteLoading from 'components/infiniteLoading/components/InfiniteLoading.vue'
  import UserSubsOrderList from 'section/user/subsOrderList/subsOrderList.vue'
  import { orderList2Mixin } from 'mixins/orderList2Mixin'

  export default {
    data () {
      return {
        orderItem: 0,
        // 0 预约订单 1绿植订单 2 养护订单 3 预售订单
        orderType: {
          bookOrder: 0,
          plantOrder: 1,
          careOrder: 2,
          preOrder: 3
        },
        // 绿植订单
        // 购买订单状态：0未付款，1已付款，2配送中，8已完成，9已取消;
        // 租赁订单（购买/租赁订单）状态：0未付款，1已付款，2配送中，3养护中，5已到期，6已收回，8已完成，9已取消

        plantOrderStatus: {
          [orderStatus.nonPayment]: {value: '未付款', warn: true},
          [orderStatus.unauditedVoucher]: {value: '待核账', warn: true}, /* 等待财务收款*/
          [orderStatus.paid]: {value: '已付款', warn: false},
          [orderStatus.distribution]: {value: '配送中', warn: false},
          [orderStatus.maintenance]: {value: '养护中', warn: false},
          [orderStatus.expired]: {value: '养护中', warn: false}, // 已到期
          [orderStatus.hasrecyled]: {value: '已收回', warn: false}, // 已收回
          [orderStatus.MExpired]: {value: '养护中', warn: false}, // 养护到期
          [orderStatus.completed]: {value: '已完成', warn: false},
          [orderStatus.canceled]: {value: '已取消', warn: true},
          [orderStatus.refunded]: {value: '已退款', warn: true}, // 已退款
          [orderStatus.expiredByL]: {value: '养护到期', warn: true}, // 人工租赁干涉到期
          [orderStatus.expiredByM]: {value: '已完成', warn: false} // 人工养护干涉到期;
        },
        preOrderStatus: {
          [preOrderStatus.noDownpayment]: {value: '未付定金', warn: true},
          [preOrderStatus.unauditedVoucherByD]: {value: '待核定金', warn: true},
          [preOrderStatus.downpayment]: {value: '已付定金', warn: false},
          [preOrderStatus.unauditedVoucherByW]: {value: '待核尾款', warn: true},
          [preOrderStatus.distribution]: {value: '配送中', warn: false},
          [preOrderStatus.waitDistribution]: {value: '已付全款，待配送', warn: true},
          [preOrderStatus.completed]: {value: '已完成', warn: false},
          [preOrderStatus.expiredByW]: {value: '未付尾款,已失效', warn: true},
          [preOrderStatus.expiredByD]: {value: '未付定金,已过期', warn: true}
        },
        bookOrderList: [],
        plantOrderList: [],
        maintenanceList: [],
        preOrderList: [],
        bookOrderListLen: -1,
        plantOrderListLen: -1,
        maintenanceListLen: -1,
        preOrderListLen: -1,
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
        prePage: 1
      }
    },
    mixins: [orderList2Mixin],
    created () {
      this.orderItem = Cache.get('orderItem') || 0
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      goPlantDetail: function (item) {
        this.$router.load({url: `/store/orderDetail/${item.id}`})
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
      loadBookOrderList: function () {
        userApi.bookingOrderList(this.bookPage).then((result) => {
          if (result.data.length > 0) {
            this.bookOrderList = [].concat(this.bookOrderList).concat(result.data)
            this.$refs.bookOrderLoading.$emit('$InfiniteLoading:loaded')
            this.bookPage++
          } else {
            this.$refs.bookOrderLoading.$emit('$InfiniteLoading:complete')
          }
          this.bookOrderListLen = this.bookOrderList.length
        })

      },
      loadPlantOrderList: function () {
        userApi.saleOrderList(this.plantPage).then((result) => {
          if (result.data.length > 0) {
            this.plantOrderList = [].concat(this.plantOrderList).concat(result.data)
            this.$refs.plantOrderLoading.$emit('$InfiniteLoading:loaded')
            this.plantPage++
          } else {
            this.$refs.plantOrderLoading.$emit('$InfiniteLoading:complete')
          }
          this.plantOrderListLen = this.plantOrderList.length
        })

      },
      loadCareOrderList: function () {
        userApi.maintenanceOrderList(this.carePage).then((result) => {
          if (result.data.length > 0) {
            this.maintenanceList = [].concat(this.maintenanceList).concat(result.data)

            this.maintenanceList.forEach((item) => {
              this.$set(item, 'isagent', true)
            })
            this.$refs.careOrderLoading.$emit('$InfiniteLoading:loaded')
            this.carePage++
          } else {
            this.$refs.careOrderLoading.$emit('$InfiniteLoading:complete')
          }
          this.maintenanceListLen = this.maintenanceList.length
        })

      },
      loadPreOrderList: function () {
        orangeApi.preOrderList(this.prePage).then((result) => {
          if (result.data.length > 0) {
            this.preOrderList = [].concat(this.preOrderList).concat(result.data)
            this.preOrderList.forEach((item) => {
              this.$set(item, 'isagent', true)
            })
            this.$refs.preOrderLoading.$emit('$InfiniteLoading:loaded')
            this.prePage++
          } else {
            this.$refs.preOrderLoading.$emit('$InfiniteLoading:complete')
          }
          this.preOrderListLen = this.preOrderList.length
        })

      },
    },
    components: {UserSubsOrderList, InfiniteLoading},
    watch: {
      bookOrderList (value) {
        this.bookOrderListLen = value.length > 0 ? 1 : 0
      },
      plantOrderList (value) {
        this.plantOrderListLen = value.length > 0 ? 1 : 0
      },
      maintenanceList (value) {
        this.maintenanceListLen = value.length > 0 ? 1 : 0
      },
      preOrderList (value) {
        this.preOrderListLen = value.length > 0 ? 1 : 0
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
