<template>
    <!-- 公用的提示组件 successmsg-->
    <div class="my-msg">
        <div class="msg-header">
            <slot name="header"></slot>
        </div>
        <div class="msg-main">
            <slot name="main"></slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {}
    },
    computed: {}

  }
</script>
<style lang="scss" scoped type="text/css">
    @import "myMsg.scss";
</style>
