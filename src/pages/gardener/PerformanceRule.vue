<template>
    <f7-page>
        <back title="绩效系统">
        </back>
        <f7-block inner class="performanceRule" no-hairlines>
            <div class="context">
                绩效积分计算规则：<br>
                订单总数=当天养护人员前往进行养护的公司数目<br>
                上班总时长=养护人员最后打卡时间（最后一次结束养护时间） — 养护人员<br>
                首次打卡时间（第一次开始养护时间）<br>
                养护效率=当天全部订单养护实际总工时 ÷ 当天全部订单养护预计总工时<br>
                绿植存活率=xxxxxxxxxx<br>
                违规行为：指养护人员是否存在死亡绿植不上报、未前往进行绿<br>
                植养护、养护过程中作弊等行为<br>

            </div>
            <div class="performance-rule-table">
                <div class="tr">
                    <div class="td">日期</div>
                    <div class="td">完成订单数</div>
                </div>
                <div class="tr">
                    <div class="td">2017-05015</div>
                    <div class="td">23</div>
                </div>
            </div>
        </f7-block>
    </f7-page>
</template>

<script type="text/ecmascript-6">
  import GaInfo from 'components/gaInfo/gaInfo.vue'

  export default {
    data () {
      return {}
    },
    created () {
      window.wx.ready(() => {
        window.wx.hideMenuItems({
          menuList: ['menuItem:share:QZone', 'menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:share:appMessage', 'menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
        })
      })
    },
    components: {GaInfo}
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "../../css/gardener/performanceRule.scss";
</style>
