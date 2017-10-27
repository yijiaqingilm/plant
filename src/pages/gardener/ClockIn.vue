<template>
    <f7-page>
        <back title="开始养护"></back>
        <f7-block inner class="clockIn" no-hairlines>
            <div class="wrap">
                <my-map ref="myMap"></my-map>

                <!--<div v-if="show_clockIn_address">
                    <div class="plant-header">
                        <div>{{position_msg}}</div>
                        <div>
                            <span class="icon_adddress2"></span>
                            <span class="address">{{address}}</span>
                        </div>
                    </div>
                    <div class="line-10"></div>
                </div>-->
                <div class="content">
                    <div class="top" @click="getCode">
                        <div class="scan"></div>
                        <p>点击扫描同一品种任意二维码进行养护</p>
                    </div>
                    <div class="plant-list">
                        <div class="item" v-for="(item,index) in items">
                            <div class="checkbox">
                                <my-checkbox v-model="item.status" :disabled="true" :id="'id'+index"></my-checkbox>
                            </div>
                            <div class="photo no-padding"><img :src="item.img" alt=""></div>
                            <div class="info">
                                <div class="name">
                                    <div>{{item.name}}</div>
                                </div>
                                <div>×{{item.amount}}{{item.unit}}</div>
                                <div class="detail">
                                    <div>养护明细：</div>
                                    <div>
                                        <div v-for="(detail,index) in item.detail">{{detail}};</div>
                                    </div>
                                </div>
                                <div class="notes" v-if="item.remark.length>0">系统备注：{{item.remark }}</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </f7-block>
        <div slot="fixed">
            <transition
                    enter-active-class="animated fadeInUp"
                    leave-active-class="animated fadeOutUp">
                <div class="plant-header2" v-show="showClock">
                    <div>{{position_msg}}</div>
                    <div>
                        <span class="icon_adddress2"></span>
                        <span v-if="clockStatus" class="address">{{address}}</span>
                        <span v-if="!clockStatus" class="address">距离实际位置较远</span>
                        <span v-if="!clockStatus" class="location" @click="againCurrentPosition">重新定位</span>
                    </div>
                </div>
            </transition>
        </div>
        <f7-toolbar bottom class="no-border">
            <div class="footer" @click="submit">
                完成养护
            </div>
        </f7-toolbar>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import wx from 'wx'
  import { gardenerApi } from 'api'
  import MyMap from 'components/myMap/myMap.vue'

  const msg = ['打卡成功', '打卡失败 !', '打卡中']
  export default {
    data () {
      return {
        address: '',
        items: [],
        /*eslint no-magic-numbers: ["error", { "ignoreArrayIndexes": true }]*/
        position_msg: msg[2],
        /* 打卡成功状态 true 打卡成功或打卡中， false 打卡失败  默认 true */
        showClock: true,
        clockStatus: false,
        shopper_id: '',
        shopper_period_id: '',
        m_info_main_id: '',
        company: {},
        serverId: '',
        order_id: ''
      }
    },
    created () {
      this.shopper_id = this.$route.params.shopperId
      this.shopper_period_id = this.$route.params.shopper_period_id
      this.order_id = this.$route.params.order_id
      gardenerApi.maintenanceDetail(this.shopper_id, this.order_id).then(({data}) => {
        this.items = data.items
        this.company = data.company
      })
      window.wx.ready(() => {
        wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })

      this.$refs.myMap.getCurrentPosition().then((result) => {
        this.getCurrentPosition(result)
      })
    },
    methods: {
      getCode () {
        var that = this
        // 扫一扫功能
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
            // 扫完 回调 得到二维码
            gardenerApi.maintain(result.split('#')[1], that.m_info_main_id).then((result) => {
              /*eslint no-magic-numbers: 0*/
              if (result.data.length <= 0) {
                that.$f7.alert('扫码错误')
              } else {
                let index = that.items.findIndex((item) => parseInt(item.shopper_item_id, 10) === parseInt(result.data.shopper_item_id, 10))
                if (index !== -1) {
                  that.$set(that.items[index], 'status', true)
                } else {
                  that.$f7.alert('扫码失败，该养护订单不属于你的养护范围')
                }

              }

            })
          }
        })
      },
      getCurrentPosition (result) {
        let position = result.position
        gardenerApi.clock(this.shopper_period_id, position.getLng(), position.getLat()).then(({data}) => {
          let step = 2000
          setTimeout(() => {
            this.showClock = false
          }, step)
          this.clockStatus = true
          this.position_msg = msg[0]
          this.address = result.formattedAddress
          this.m_info_main_id = data.m_info_main_id
        }).catch(() => {
          this.position_msg = msg[1]
          this.clockStatus = false
          this.showClock = true
        })
      },
      againCurrentPosition () {
        // this.clockStatus = true;
        this.position_msg = msg[2]
        this.$refs.myMap.getCurrentPosition().then((result) => {
          this.getCurrentPosition(result)
        })
      },
      submit () {
        if (!this.clockStatus) {
          return
        }
        let no_check_item = this.items.find((item) => !item.status)
        if (no_check_item) {
          this.$f7.alert('尚有绿植未勾选养护，<br>请完成所有绿植养护')
          return
        }
        var that = this
        // 随机出现打卡
        /*eslint no-magic-numbers: 0*/
        if (parseInt(this.company.random_item_id, 10) !== 0) {
          this.$f7.modal({
            title: '',
            text: `随机打卡<br>请拍照上传 "${this.company.random_item_name}" 养护状况`,
            buttons: [{
              text: '拍照',
              onClick: function () {
                wx.chooseImage({
                  count: 1, // 默认9
                  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                  sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                  success: function (res) {
                    let localIds = res.localIds[0] // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    let step = 100
                    setTimeout(() => {
                      wx.uploadImage({
                        localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                          that.serverId = res.serverId // 返回图片的服务器端ID
                          that.accomplish()
                        }
                      })
                    }, step)

                  }
                })
              }
            }]
          })
        } else {
          this.accomplish()
        }

      },
      accomplish () {
        // 重新获取 经纬度。
        let lat, lng
        this.$refs.myMap.getCurrentPosition().then((result) => {
          let position = result.position
          lat = position.getLat()
          lng = position.getLng()
          // 提交信息
          gardenerApi.accomplish({
            shopper_id: this.shopper_id,
            m_info_main_id: this.m_info_main_id,
            random_item_id: this.company.random_item_id,
            lat: lat,
            lng: lng,
            clock: this.serverId,
            order_id: this.order_id
          }).then((result) => {
            this.$f7.alert('您已完成本次养护任务', '', () => {
              this.$router.back()
            })

          })
        })

      }
    },
    components: {
      MyMap
    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/clockIn.scss";
</style>
