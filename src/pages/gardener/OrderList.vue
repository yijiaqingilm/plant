<template>
    <f7-page @page:reinit="reinit">
        <!--养护列表 orderlist.vue-->
        <back title="养护列表">
            <div slot='right' class="history-list" @click="$router.load({url:'/gardener/history/list'})">历史列表</div>
        </back>
        <f7-block inner class="orderList" no-hairlines>
            <input type="hidden" class="hour" v-model="hour">
            <my-map ref="myMap"></my-map>
            <div class="list">
                <div class="item" @click="showDetail(order)" v-for="(order,index) in orderList">
                    <span class="gt"></span>
                    <div class="main">
                        <div class="row">
                            <div class="col-50">订单编号：{{order.id}}</div>
                            <div class="col-50 color-warn text-right">{{order.status}}</div>
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
                        <div class="content">
                            养护内容：<span v-for="(item,index) in order.items">{{item}}<span
                                v-if="index!=order.items.length-1">,</span></span>
                        </div>
                        <div>
                            养护时间：<span class="color-theme">{{order.times}}</span>
                        </div>
                        <div>
                            预计养护时间：<span class="color-theme">{{getTimer(order.timelong)}}</span>
                        </div>

                    </div>
                    <div class="footer">
                        <div>
                            <div class="order-list-button bg-gray" @click.stop="postpone(order,index)">确定延期</div>
                        </div>
                        <div>
                            <div class="order-list-button" @click.stop="keep(order)">确定养护</div>
                        </div>
                    </div>
                </div>
            </div>
            <!--<div class="get-more">
                    <span class="my-button" :class="{'bg-gray':orderList.length>0}"
                          @click="getMore(orderList.length)">获取更多养护任务</span>
            </div>-->
        </f7-block>
        <f7-toolbar bottom class="no-border">
            <div class="o-footer">
                <div :class="{active:orderList.length>0}" @click="knockOff">收工</div>
                <div :class="{active:orderList.length===0}" @click="getMoreTask">获取养护任务</div>
            </div>
        </f7-toolbar>
        <div slot="fixed">
            <masking :showMask="show"></masking>
            <div class="order-modal" v-show="show">
                <div class="modal-title"> 确认延期养护</div>
                <div class="modal-context">延期
                    <counter v-model="day" :max-value="3"></counter>
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
  import { gardenerApi } from 'api'
  /* import VuePullRefresh from 'components/pullRefresh/vue-pull-refresh.vue';*/
  import Counter from 'components/counter/counter.vue'
  import MyMap from 'components/myMap/myMap.vue'
  import { getTimer } from 'lib/utils'

  export default {
    data () {
      return {
        orderList: [],
        day: 1,
        show: false,
        curOrder: null,
        curIndex: -1,
        hour: 1,
        hourPicker: null
      }
    },
    created () {
      this.getList()
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    mounted () {
      this.$nextTick(() => {
        let that = this
        let hour_input = document.querySelectorAll('.hour')
        let hourValues = []
        let hourDisplayValues = []
        let maxTime = 8
        for (let i = 1; i <= maxTime; i++) {
          hourValues.push(i)
          hourDisplayValues.push(i + '小时')
        }
        this.hourPicker = this.$f7.picker({
          closeByOutsideClick: false,
          input: hour_input[hour_input.length - 1],
          values: [that.hour],
          toolbarTemplate: `<div class="toolbar">
                                          <div class="toolbar-inner">
                                            <div class="left"></div>
                                            <div class="center">请选择养护工作时间</div>
                                            <div class="right">
                                              <a href="#" class="link close-picker">确定</a>
                                            </div>
                                          </div>
                                       </div> `,
          cols: [
            {
              values: hourValues,
              displayValues: hourDisplayValues
            }
          ], onClose ({value}) {
            that.hour = value[0]
            that.$refs.myMap.getCurrentPosition().then((result) => {
              let position = result.position
              gardenerApi.maintenanceList({
                act: 'more',
                lng: position.getLng(),
                lat: position.getLat(),
                hour: that.hour,
              }).then((response) => {
                that.orderList = response.data
              })
            })
          }
        })
      })
    },
    methods: {
      getTimer: getTimer,
      reinit () {
        this.getList()
      },
      // 获取更多的任务
      getMoreTask () {
        if (this.orderList.length > 0) {
          this.$f7.alert('请完成当日任务，才能获取更多<br>养护信息', '')
          return
        }
        this.hourPicker.open()
      },
      // 收工
      knockOff () {
        if (this.orderList.length === 0) {
          return
        }
        this.$f7.confirm('是否确定收工', '', () => {
          gardenerApi.knockOff().then((result) => {
            // 回调
            this.orderList = []
          })
        })

      },
      call (mobile) {
        // call
      },
      closeModal () {
        this.day = 1
        this.show = false
      },
      toPostpone () {
        gardenerApi.delay(this.curOrder.order_id, this.day).then((result) => {
          this.orderList.splice(this.curIndex, 1)
          this.show = false
          this.day = 1
        })
      },

      getList: function () {
        gardenerApi.maintenanceList().then((response) => {
          this.orderList = response.data
        })
      },
      keep: function ({shopper_period_id, shopper_id, order_id}) {
        this.$f7.confirm('确定养护？', '', () => {
          gardenerApi.hasUnfinishedOrder(order_id).then((result) => {
            this.$router.load({url: `/gardener/clockIn/${shopper_id}/${shopper_period_id}/${order_id}`})
          })
        })
      },
      postpone: function (order, index) {
        this.show = true
        this.curOrder = order
        this.curIndex = index
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
      showDetail: function (order) {
        this.$router.load({url: `/gardener/detail/${order.shopper_id}/${order.order_id}`})
      }
    },
    components: {Counter, MyMap}
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/orderList.scss";
</style>

