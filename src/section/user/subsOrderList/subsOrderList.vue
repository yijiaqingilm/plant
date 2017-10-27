<template>
    <div class="list">
        <div class="order-item">
            <div class="order-info">
                <div>预约编号： yyy</div>
                <div>预约类型： <span class='have'>预约上门</span></div>
                <div>预约时间： xxxx</div>
                <div>上门服务人员：xxx</div>
            </div>
            <div class="order-status">
                <div class="status">已完成</div>
                <div><span class="order-button">评价</span></div>
            </div>
        </div>
        <div class="order-item">
            <div class="order-info">
                <div>预约编号 yyy</div>
                <div>预约时间 xxxx</div>
                <div>上门服务人员：xxx</div>
                <div>是否有下单业务：<span class="have">有</span></div>
            </div>
            <div class="order-status">
                <div class="status">已完成</div>
                <div><span class="order-button">评价</span></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      itemList: Array
    },
    data () {
      return {}
    }
  }
</script>
<style lang="scss" scoped type="text/css">
    @import "subsOrderList.scss";
</style>
