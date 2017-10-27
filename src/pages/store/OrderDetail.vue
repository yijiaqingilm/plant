<template>
    <f7-page>
        <back title="订单详情">
        </back>
        <f7-block inner class="pay" no-hairlines>
            <div class="header">
                <div class="address-list" v-if="orderInfo&&orderInfo.address">
                    <div class="user-info">
                        <div class="detail">
                            <div class="name">{{orderInfo.address.contact}}</div>
                            <div class="phone">{{orderInfo.address.mobile}}</div>
                        </div>
                        <div class="address">{{orderInfo.address.address}}</div>
                        <div class="address-detail">{{orderInfo.address.addressdetail}}</div>
                    </div>
                </div>
            </div>
            <div class="content">
                <div v-if="orderInfo!=null && orderInfo.buys.items && orderInfo.buys.items.length>0">
                    <div class="goods-wrap">
                        <div class="goods-type">
                            <div>订单{{orderInfo.buys.id}}<span class="color-theme">(购买)</span></div>
                            <div><span>合计：</span><span class="color-warn">￥{{orderInfo.buys.saleprice}}</span></div>
                        </div>
                        <collapsed class="goods-list" :listLen="orderInfo.buys.items.length"
                                   @changeShowLen="changeShowBuysLen">
                            <div class="goods-item" v-for="(item,index) in orderInfo.buys.items"
                                 v-show="index<maxBuysLen" :key="index">
                                <div class="goods-photo"><img :src="item.img" alt=""></div>
                                <div class="goods-info">
                                    <div class="name">{{item.name}}</div>
                                    <div class="type" v-if="item.type==itemType.combo">{{item.brief}}</div>
                                    <div class="type" v-if="item.type==itemType.goods" v-for="attr in item.attrs">
                                        {{attr.name}}:<span
                                            v-for="item in attr.items">{{item.name}}</span></div>
                                    <div class="detail">
                                        <div class="price">￥{{item.price}}</div>
                                        <div class="count">×{{item.amount}}</div>
                                    </div>
                                </div>
                            </div>
                        </collapsed>
                    </div>
                    <div class="line-10"></div>
                    <div class="order-info-group onepx min-height"
                         v-if="orderInfo.buys.couponitems && orderInfo.buys.couponitems.length>0">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-if="orderInfo.buys.couponitems" v-for="coupon in orderInfo.buys.couponitems">{{coupon.name}}</span>
                        </div>
                    </div>
                    <div class="order-info-group ">
                        <div>购买数量</div>
                        <div>{{orderInfo.buys.saleamount}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>购买金额</div>
                        <div>￥{{orderInfo.buys.saleprice}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>配送及人工费用</div>
                        <div>￥{{orderInfo.shipfee}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>优惠金额</div>
                        <div>￥{{orderInfo.discount}}</div>
                    </div>
                    <div class="order-info-group" v-if="giveService">
                        <div>优惠服务</div>
                        <div>{{giveService}}</div>
                    </div>
                    <div class="order-info-group" v-if="giveGoods">
                        <div>优惠赠品</div>
                        <div>{{giveGoods}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>实付金额</div>
                        <div class="color-warn">￥{{orderInfo.payment}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>下单时间</div>
                        <div>{{orderInfo.ordertime}}</div>
                    </div>
                </div>
                <div v-if="orderInfo!=null && orderInfo.leases.items && orderInfo.leases.items.length>0">
                    <div class="goods-wrap">
                        <div class="goods-type">
                            <div>订单{{orderInfo.order_id}} <span class="color-theme">(租赁)</span></div>
                            <div><span>合计：</span><span class="color-warn">￥{{orderInfo.leases.leaseprice}}</span>
                            </div>
                        </div>
                        <div class="goods-type lease-time">
                            <div>
                            <span class="color-theme">
                                <span>租赁租期</span>
                                <span>{{orderInfo.leases.paymethods.name}}</span>
                            </span>
                            </div>
                        </div>
                        <collapsed class="goods-list" :listLen="orderInfo.leases.items.length"
                                   @changeShowLen="changeShowLeaseLen">

                            <div class="goods-item" v-for="(item,index) in orderInfo.leases.items"
                                 v-show="index<maxLeaseLen" :key="index">
                                <div class="goods-photo"><img :src="item.img" alt=""></div>
                                <div class="goods-info">
                                    <div class="name">{{item.name}}</div>
                                    <div class="type" v-if="item.type==itemType.combo">{{item.brief}}</div>
                                    <div class="type" v-if="item.type==itemType.goods" v-for="attr in item.attrs">
                                        {{attr.name}}:<span
                                            v-for="item in attr.items">{{item.name}}</span></div>
                                    <div class="detail">
                                        <div class="price">￥{{item.leaseprice}}/月</div>
                                        <div class="count">×{{item.amount}}</div>
                                    </div>
                                </div>
                            </div>
                        </collapsed>
                    </div>
                    <div class="line-10"></div>
                    <div class="order-info-group onepx min-height"
                         v-if="orderInfo.leases.couponitems && orderInfo.leases.couponitems.length>0">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-if="orderInfo.leases.couponitems" v-for="coupon in orderInfo.leases.couponitems">{{coupon.name}}</span>
                        </div>
                    </div>
                    <div class="order-info-group onepx">
                        <div><span>养护时间</span></div>
                        <div class="color-theme text-right">
                            <div>{{weekName}}</div>
                            <div>
                                <span v-if="orderInfo.leases.time" v-for="(time,index) in orderInfo.leases.time">
                                    {{time.timeregion}}<span v-if="index!=orderInfo.leases.time.length-1">,</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="order-info-group ">
                        <div>租赁数量</div>
                        <div>{{orderInfo.leases.leaseamount}}</div>
                    </div>
                    <div class="order-info-group">
                        <div>租赁押金</div>
                        <div>￥{{orderInfo.leases.deposit}}</div>
                    </div>
                    <div class="order-info-group ">
                        <div>配送及人工费用</div>
                        <div>￥{{orderInfo.shipfee}}</div>
                    </div>


                    <div class="order-info-group ">
                        <div>租赁租期</div>
                        <div>
                            {{orderInfo.leases.paymethods.name}}
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>結算方式</div>
                        <div>
                            {{orderInfo.paytypes}}
                        </div>
                    </div><!--3养护中，5已到期，6已收回，8已完成-->
                    <div class="order-info-group"
                         v-if="orderInfo.status==3 || orderInfo.status==5 || orderInfo.status==6|| orderInfo.status==8">
                        <div>到期时间</div>
                        <div>
                            {{orderInfo.leases.expire}}
                        </div>
                    </div>

                    <div class="order-info-group">
                        <div>租赁金额</div>
                        <div>￥{{orderInfo.leases.leaseprice}}</div>
                    </div>
                    <div class="line-10"></div>

                    <div class="order-info-group">
                        <div>优惠金额</div>
                        <div>￥{{orderInfo.discount}}</div>
                    </div>
                    <div class="order-info-group" v-if="giveService">
                        <div>优惠服务</div>
                        <div>{{giveService}}</div>
                    </div>
                    <div class="order-info-group" v-if="giveGoods">
                        <div>优惠赠品</div>
                        <div>{{giveGoods}}</div>
                    </div>
                    <div class="order-info-group">
                        <div>实付金额</div>
                        <div class="color-warn">￥{{orderInfo.payment}}</div>
                    </div>
                    <div class="order-info-group">
                        <div>下单时间</div>
                        <div>{{orderInfo.ordertime}}</div>
                    </div>
                </div>
                <div v-if="orderInfo!=null && orderInfo.maintenance.items && orderInfo.maintenance.items.length>0">
                    <div class="goods-wrap">
                        <div class="goods-type">
                            <div>订单{{orderInfo.order_id}}</div>
                            <div><span>合计：</span><span class="color-warn">￥{{orderInfo.maintenance.leaseprice}}</span>
                            </div>
                        </div>
                        <collapsed class="goods-list" :listLen="orderInfo.maintenance.items.length"
                                   @changeShowLen="changeShowLeaseLen">
                            <div class="goods-item" v-for="(item,index) in orderInfo.maintenance.items"
                                 v-show="index<maxLeaseLen" :key="index">
                                <div class="goods-photo"><img :src="item.img" alt=""></div>
                                <div class="goods-info">
                                    <div class="name">{{item.name}}</div>
                                    <div class="detail">
                                        <div class="price">￥{{item.price}}/月</div>
                                        <div class="count">×{{item.amount}}</div>
                                    </div>
                                </div>
                            </div>
                        </collapsed>
                    </div>
                    <div class="line-10"></div>
                    <div class="order-info-group onepx"
                         v-if="orderInfo.maintenance.couponitems && orderInfo.maintenance.couponitems.length>0">
                        <div>优惠券</div>
                        <div class="group-right color-theme">
                            <span v-if="orderInfo.maintenance.couponitems"
                                  v-for="coupon in orderInfo.maintenance.couponitems">{{coupon.name}}</span>
                        </div>
                    </div>
                    <div class="order-info-group onepx">
                        <div><span>养护时间</span></div>
                        <div class="color-theme text-right">
                            <div>{{weekName}}</div>
                            <div>
                                <span v-if="orderInfo.maintenance.time"
                                      v-for="(time,index) in orderInfo.maintenance.time">
                                    {{time.timeregion}}<span v-if="index!=orderInfo.maintenance.time.length-1">,</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="order-info-group ">
                        <div>养护数量</div>
                        <div>{{orderInfo.maintenance.leaseamount}}</div>
                    </div>
                    <div class="order-info-group">
                        <div>养护总额</div>
                        <div>￥{{orderInfo.maintenance.leaseprice}}</div>
                    </div>

                    <div class="order-info-group ">
                        <div>养护周期</div>
                        <div>
                            {{orderInfo.maintenance.paymethods.name}}
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>結算方式</div>
                        <div>
                            {{orderInfo.paytypes}}
                        </div>
                    </div>
                    <!--3养护中，5已到期，6已收回，8已完成-->
                    <div class="order-info-group"
                         v-if="orderInfo.status==3 || orderInfo.status==5 || orderInfo.status==6|| orderInfo.status==8">
                        <div>到期时间</div>
                        <div>
                            {{orderInfo.maintenance.expire}}
                        </div>
                    </div>
                    <div class="order-info-group">
                        <div>优惠金额</div>
                        <div>￥{{orderInfo.discount}}</div>
                    </div>
                    <div class="order-info-group" v-if="giveService">
                        <div>优惠服务</div>
                        <div>{{giveService}}</div>
                    </div>
                    <div class="order-info-group" v-if="giveGoods">
                        <div>优惠赠品</div>
                        <div>{{giveGoods}}</div>
                    </div>
                    <div class="order-info-group">
                        <div>实付金额</div>
                        <div class="color-warn">￥{{orderInfo.payment}}</div>
                    </div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { userApi } from 'api'
  import { weekList, goodsType, itemType, couponGiveType } from 'lib/common'
  import MyPicker from 'components/myPickerModal/myPickerModal.vue'
  import UserFooter from 'section/user/footer/footer.vue'
  import Counter from 'components/counter/counter.vue'
  import TypeSelector from 'components/typeSelector/typeSelector.vue'
  import Collapsed from 'components/collapsed/collapsed.vue'

  export default {
    data () {
      return {
        order_id: -1,
        /* 购买显示的最大条数*/
        maxBuysLen: 2,
        maxLeaseLen: 2,
        orderInfo: null,
        weekList: weekList,
        weekName: '',
        itemType: itemType,
        // 租赁订单（购买/租赁订单）状态：0未付款，1已付款，2配送中，3养护中，5已到期，6已收回 7.养护到期，8已完成，9已取消
        plantOrderStatus: {
          0: {value: '用户未支付', warn: true},
          18: {value: '待核账', warn: true}, /* 等待财务收款*/
          1: {value: '用户已付款', warn: false},
          2: {value: '用户已付款', warn: false}, // 配送中
          3: {value: '养护中', warn: false}, // 养护中
          5: {value: '养护中', warn: false}, // 养护到期
          6: {value: '已收回', warn: false}, // 已收回
          7: {value: '养护中', warn: false}, // 养护到期
          8: {value: '已完成', warn: false}, // 已完成
          9: {value: '订单已取消', warn: false}, // 已取消
          14: {value: '已退款', warn: true}, // 已退款

        },
      }
    },
    created () {
      this.order_id = this.$route.params.goodsId
      userApi.orderDetail(this.order_id).then((result) => {
        this.orderInfo = result.data
        if (this.orderInfo.leases.week) {
          this.weekName = this.orderInfo.leases.week.map((item) => weekList.find((week) => week.id === item).name).join(',')
        }
        if (this.orderInfo.maintenance.week) {
          this.weekName = this.orderInfo.maintenance.week.map((item) => weekList.find((week) => week.id === item).name).join(',')
        }

      })
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    mounted () {
      console.log('mounted')
    },
    methods: {
      changeShowBuysLen: function (maxLen) {
        this.maxBuysLen = maxLen
      },
      changeShowLeaseLen: function (maxLen) {
        this.maxLeaseLen = maxLen
      },

    },
    computed: {
      giveService () {
        let buysCoupon = this.orderInfo.buys.couponitems[0] || {}
        let leasesCoupon = this.orderInfo.leases.couponitems[0] || {}
        let maintenanceCoupon = this.orderInfo.maintenance.couponitems[0] || {}
        let giveService = ''
        if (buysCoupon.coupon_type === couponGiveType.service) {
          giveService += buysCoupon.num + ','
        }
        if (leasesCoupon.coupon_type === couponGiveType.service) {
          giveService += leasesCoupon.num + ','
        }
        if (maintenanceCoupon.coupon_type === couponGiveType.service) {
          giveService += maintenanceCoupon.num + ','
        }
        if (giveService) {
          giveService = giveService.slice(0, -1)
        }
        return giveService
      },
      giveGoods () {
        let buysCoupon = this.orderInfo.buys.couponitems[0] || {}
        let leasesCoupon = this.orderInfo.leases.couponitems[0] || {}
        let maintenanceCoupon = this.orderInfo.maintenance.couponitems[0] || {}
        let giveGoods = ''
        if (buysCoupon.coupon_type === couponGiveType.goods) {
          giveGoods += buysCoupon.item + ','
        }
        if (leasesCoupon.coupon_type === couponGiveType.goods) {
          giveGoods += leasesCoupon.item + ','
        }
        if (maintenanceCoupon.coupon_type === couponGiveType.goods) {
          giveGoods += maintenanceCoupon.item + ','
        }
        if (giveGoods) {
          giveGoods = giveGoods.slice(0, -1)
        }

        return giveGoods
      }
    },
    components: {
      Counter, UserFooter, MyPicker, TypeSelector, Collapsed
    },

  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/store/pay.scss";
</style>

