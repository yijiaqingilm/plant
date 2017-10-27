<template>
    <f7-page @page:reinit="reinit">
        <back title="更换历史">
        </back>
        <f7-block inner class="replaceList" no-hairlines>
            <div class="apply-replace">
                <span class="my-button" @click="goApplyReplace">申请更换</span>
            </div>
            <div class="line-10"></div>
            <div class="list">
                <div class="item" v-for="item in historyList">
                    <div class="header">
                        <div class="time"><span class="icon_time"></span>申请更换日期：{{item.renewal_apply_at}}</div>
                        <div class="status" :class="{'err-info':item.status==2 || item.status==4}">
                            {{status[item.status]}}
                        </div>
                    </div>
                    <div class="info">
                        <div class="photo">
                            <img :src="item.img" alt="">
                        </div>
                        <div class="detail">
                            <div class="name">名称:{{item.name | uppercase}}</div>
                            <div class="number">编号：{{item.item_id}}</div>
                        </div>
                        <div class="status">
                            <div v-if="showCancel(item.status)">
                                <span class="apply-button bg-gray"
                                      @click="cancel(item)">取消申请</span>
                            </div>
                            <div v-if="showRestart(item.status)">
                                <span class="apply-button"
                                      @click="restart(item)">重新申请</span>
                            </div>
                        </div>
                    </div>
                    <!-- && item.remark=!null-->
                    <div class="err" v-if="item.remark!='' && item.remark!=null">
                        {{item.remark}}
                    </div>
                    <div class="line-10"></div>
                </div>
                <infinite-loading :on-infinite="loadData" ref="infiniteLoading" spinner="bubbles">
                    <div slot="no-more">没有更多数据</div>
                    <div slot="no-results">没有数据</div>
                </infinite-loading>
            </div>
        </f7-block>

    </f7-page>
</template>

<script type="text/ecmascript-6">
  // 更换状态:0审核中，1更换成功，2更换失败，3申请成功，4申请失败，5已取消 ,
  import { exchangeStatus } from 'lib/common'
  import { gardenerApi } from 'api'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    data () {
      return {
        historyList: [],
        status: {
          [exchangeStatus.reviewed]: '审核中',
          [exchangeStatus.exSuccess]: '更换成功',
          [exchangeStatus.exDefeated]: '更换失败',
          [exchangeStatus.apSuccess]: '申请成功',
          [exchangeStatus.apDefeated]: '申请失败',
          [exchangeStatus.canceled]: '已取消'
        },
        page: 1
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
        this.page = 1
        this.historyList = []
        let step = 100
        setTimeout(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        }, step)
      },
      // 等待接口对接
      loadData () {
        gardenerApi.replacePlantHistory(this.page).then((result) => {
          if (result.data.length > 0) {
            this.historyList = [].concat(this.historyList).concat(result.data)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
            this.page++
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
      },
      goApplyReplace () {
        this.$router.load({url: '/gardener/applyReplace'})
      },
      // 重新申请
      restart (item) {
        this.$f7.confirm('确定重新申请？', '', () => {
          this.$router.load({url: '/gardener/applyReplace'})
        })
      },
      // 取消申请
      cancel (item) {
        this.$f7.confirm('取消申请更换？', '', () => {
          gardenerApi.renewalCancel(this.$store.state.sessionkey, item.id).then((result) => {
            item.status = exchangeStatus.canceled
          })
        })
      },
      showRestart (status) {
        //  重新申请
        switch (status >>> 0) {
          case exchangeStatus.canceled:
          case exchangeStatus.apDefeated:
            return true
          case exchangeStatus.reviewed:
          case exchangeStatus.exSuccess:
          case exchangeStatus.exDefeated:
          case exchangeStatus.apSuccess:
            return false
          default:
            return false
        }
      },
      showCancel (status) {
        // 显示 取消申请
        switch (status >>> 0) {
          case exchangeStatus.exSuccess:
          case exchangeStatus.canceled:
          case exchangeStatus.exDefeated:
          case exchangeStatus.apSuccess:
          case exchangeStatus.apDefeated:
            return false
          case exchangeStatus.reviewed:
            return true
          default:
            return false
        }

      }
    },
    computed: {},
    components: {InfiniteLoading}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/replaceList.scss";
</style>

