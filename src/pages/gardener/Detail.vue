<template>
    <f7-page>
        <back title="养护详情"></back>
        <f7-block inner class="detail" no-hairlines>
            <div class="wrap">
                <div class="header">
                    <div>预计总养护时长：{{settotalTime}}</div>
                    <div class="company">
                        <p>公司: {{company.company}}</p>
                        <p>{{company.address}} </p>
                        <p>联系人:{{company.contact}}</p>
                        <p><span class="phone">联系电话:<a :href="'tel:'+company.mobile" class="external">{{company.mobile}}<span
                                class="icon_phone"></span></a></span></p>
                    </div>
                </div>
                <div class="line-10"></div>
                <div class="content">
                    <div class="plant-list">
                        <div class="item" v-for="item in items">
                            <div class="photo"><img :src="item.img" alt=""></div>
                            <div class="info">
                                <div class="name">
                                    <span>{{item.name}}</span>
                                    <span>×{{item.amount}}</span>
                                </div>
                                <div>
                                    预计养护时长：{{setTime(item.timelong,item.amount)}}
                                </div>
                                <div class="detail">
                                    <div>养护明细：</div>
                                    <div>
                                        <div v-for="(detail,index) in item.detail">{{detail}};</div>
                                    </div>
                                </div>
                                <div class="notes" v-if="item.remark.length>0">系统备注：{{item.remark}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  import { gardenerApi } from 'api'
  import { getTimer, Cache } from 'lib/utils'

  export default {
    data () {
      return {
        items: [],
        company: {},
        totalTime: 0,
      }
    },
    created () {
      this.shopper_id = this.$route.params.shopperId
      this.order_id = this.$route.params.order_id
      gardenerApi.maintenanceDetail(this.shopper_id, this.order_id, false).then(({data}) => {
        if (data !== null) {
          this.items = data.items
          this.company = data.company
          this.totalTime = data.totaltime
        }

      })
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    methods: {
      setTime (time, amount) {
        return getTimer(time * amount)
      }
    },
    computed: {
      settotalTime () {
        return getTimer(this.totalTime)
      }
    }
  }
</script>
<style lang="scss" scoped type="text/css">

    @import "../../css/gardener/detail.scss";
</style>

