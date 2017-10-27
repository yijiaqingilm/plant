<template>
    <f7-page @page:reinit="reinit">
        <!--养护列表 orderlist.vue-->
        <back title="预约订单列表">
            <div slot='right' class="history-list" @click="$router.load({url:'/sell/completedList'})">已完成预约</div>
        </back>
        <f7-block inner class="orderList" no-hairlines>
            <my-map ref="myMap"></my-map>
            <div class="list">
                <div class="item" v-for="(order,index) in orderList">
                    <div class="open-map" @click="openMap(order)">
                        <div>
                            <div class="icon_map"></div>
                        </div>
                        <div class="open-map-text">点击打开地图</div>
                    </div>
                    <div class="main">
                        <div>
                            预约订单编号：{{order.id}}
                        </div>
                        <div>
                            预约时间：<span class="color-theme">{{order.created_at}}</span>
                        </div>
                        <div class="company">
                            <div class="name">{{order.company}}</div>
                        </div>
                        <div class="address">
                            {{order.address}}
                        </div>
                        <div class="contacts">
                            联系人:{{order.contact}}
                        </div>
                        <div class="phone" @click.stop="call(order.mobile)">
                            联系电话：<a :href="'tel:'+order.mobile" class="external"><span class="phone-number">{{order.mobile}}<span
                                class="phone_icon"></span></span></a>
                        </div>
                    </div>
                    <div class="footer">
                        <div>
                            <div class="order-list-button bg-gray" @click.stop="changeTime(order,index)">更改时间</div>
                        </div>
                        <div>
                            <div class="order-list-button" @click.stop="finish(order,index)">完成预约</div>
                        </div>
                    </div>
                </div>
                <infinite-loading :on-infinite="getList" ref="infiniteLoading" spinner="bubbles">
                    <div slot="no-more">没有更多数据</div>
                    <div slot="no-results">没有数据</div>
                </infinite-loading>
            </div>
        </f7-block>
        <div slot="fixed">
            <masking :showMask="show"></masking>
            <div class="order-modal" v-show="show">
                <div class="modal-title">用户预约时间在{{orderTime}}，</div>
                <div class="modal-context">将延期
                    <counter v-model="day"></counter>
                    天
                </div>
                <div class="modal-footer">
                    <div>
                        <span class="middle-button bg-gray" @click="closeModal">取消</span>
                    </div>
                    <div>
                        <span @click="toPostpone" class="middle-button">延期</span>
                    </div>
                </div>
            </div>
        </div>
    </f7-page>
</template>
<script type="text/ecmascript-6">
  import InfiniteLoading from 'vue-infinite-loading'
  import { sellApi } from 'api'
  import Counter from 'components/counter/counter.vue'
  import MyMap from 'components/myMap/myMap.vue'
  import { Cache } from 'lib/utils'

  export default {
    data () {
      return {
        orderList: [],
        day: 1,
        orderTime: '',
        show: false,
        curIndex: -1,
        page: 1,
        curOrder: {}
      }
    },
    created () {
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      reinit () {
        // reinit
      },
      call (mobile) {
        // call
      },
      closeModal () {
        this.day = 1
        this.show = false
      },
      toPostpone () {
        sellApi.delay(this.curOrder.id, this.day).then((result) => {
          console.log('result', result)
          this.show = false
          this.day = 1
          this.orderList = []
          this.page = 1
          let step = 100
          setTimeout(() => {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
          }, step)

        })
      },

      getList: function () {
        sellApi.booking(this.page).then((result) => {
          if (result.data.length > 0) {
            this.orderList = [].concat(this.orderList).concat(result.data)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      },
      finish: function ({id}, index) {
        this.$f7.confirm('确定已达到目的地并完成了预约上门服务？', '', () => {
          sellApi.bookingComplete(id).then((result) => {
            this.orderList.splice(index, 1)
          })
        })
      },
      changeTime: function (order, index) {
        this.show = true
        this.curOrder = order
        this.curIndex = index
        this.orderTime = order.times
      },
      changeCount: function (increment) {
        let maxDay = 3
        this.day += increment
        if (this.day <= 0) {
          this.day = 1
        }
        if (this.day >= maxDay) {
          this.day = maxDay
        }
      },
      openMap (order) {
        this.$router.load({url: '/sell/navi'})
        Cache.set('navi', {dest: `${order.lng},${order.lat}`, destName: order.address})
        // location.href = `//m.amap.com/navi/?start=116.403124,39.940693&dest=116.481488,39.990464&destName=阜通西&naviBy=car&key=f9c719281e11c1b009601907809f0e19`;
      }
    },
    components: {Counter, InfiniteLoading, MyMap}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/orderList.scss";

    .orderList .list .item .main {

        margin-right: 180px;

    }

    .open-map {
        position: absolute;
        width: 180px;
        right: 35px;
        top: 50%;
        margin: 0 auto;
        transform: translateY(-50%);
        color: #40B96A;
        text-align: center;
    }

    .open-map > div {
        font-size: 13px; /*no*/
    }

    .open-map-text {
        margin-top: 10px;
    }

    .icon_map {
        margin: 0 auto;
    }
</style>

